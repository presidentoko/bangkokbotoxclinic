"""Konvy crawl supervisor — the durable orchestrator that beats the two failure
modes we hit live:

  1. Playwright/SOCKS *wedge*: a half-dead tunnel hangs page.goto forever, past
     Playwright's own timeout. Fix: every browser task runs in a short-lived
     `konvy_worker` subprocess; if it exceeds WORKER_TIMEOUT we hard-kill its
     whole process tree (taskkill /T) and move on — only that one task is lost.
  2. Aliyun WAF escalation: listing->product on one reused context escalates to
     the slider CAPTCHA and returns an empty page. Fix: each product is its own
     fresh browser (product = first navigation), with port rotation (= alternating
     exit IP) and pacing between products.

Checkpointing: each product row is written to output/products/<id>.json, so a
resumed run keeps prior rows; products.csv is rebuilt from those at the end.
progress.json marks ok / waf / timeout / error so we don't redo finished work.

Usage:
    python -m cosmetics.konvy_supervise --limit 5
    python -m cosmetics.konvy_supervise            # full discovered set
"""
from __future__ import annotations
import argparse, csv, json, logging, os, subprocess, sys, tempfile, time
from pathlib import Path

from cosmetics import config, vpn_up
from cosmetics.konvy_scraper import CSV_FIELDS, load_progress, save_progress, _heartbeat

TMPDIR = Path(tempfile.gettempdir())  # nordvpn_runner watches rotate_port_<idx> here

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("cosmetics.sup")

PY = sys.executable
PRODUCTS_DIR = config.OUTPUT_DIR / "products"
WORKER_TIMEOUT = int(os.getenv("COSMETICS_WORKER_TIMEOUT", "55"))       # product metadata fetch (no reviews) hard cap
REVIEW_TIMEOUT = int(os.getenv("COSMETICS_REVIEW_TIMEOUT", "100"))      # review-corpus fetch hard cap (own phase)


def _int(v) -> int:
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return 0
ROTATE_WAIT = int(os.getenv("COSMETICS_ROTATE_WAIT", "12"))             # let a rotated exit boot
PRODUCT_ATTEMPTS = int(os.getenv("COSMETICS_PRODUCT_ATTEMPTS", "3"))
DISCOVER_TIMEOUT = int(os.getenv("COSMETICS_DISCOVER_TIMEOUT", "150"))
PACE_MIN = float(os.getenv("COSMETICS_PACE_MIN", "5"))                  # gap between products
PACE_MAX = float(os.getenv("COSMETICS_PACE_MAX", "10"))
# The NordVPN exits flap; both dedicated tunnels can be down at once. Rather than
# poison the product list with bogus "error"s, WAIT this long for any tunnel to
# recover; if it stays dark past the budget, stop cleanly and resume later.
PORT_WAIT_BUDGET = int(os.getenv("COSMETICS_PORT_WAIT_BUDGET", "300"))
PORT_WAIT_TICK = int(os.getenv("COSMETICS_PORT_WAIT_TICK", "15"))
DISCOVER_RETRIES = int(os.getenv("COSMETICS_DISCOVER_RETRIES", "6"))


def rotate_ip(ports: list[int], port: int) -> None:
    """Ask the DEDICATED nordvpn_runner to swap this port's exit server/IP (it
    watches TMPDIR/rotate_port_<idx>, idx relative to base 2090). The WAF escalates
    when one IP is hammered, so we rotate after a WAF/wedge instead of retrying it.

    SAFETY: only ever rotate our own dedicated ports. Borrowed prod-pool ports
    (2080-2087) belong to the clinic/dental runner; touching their rotate markers
    would yank tunnels out from under live production scrapers. For those we just
    move to another healthy port (the prod pool has several)."""
    ded = vpn_up.dedicated_ports()
    if port not in ded:
        log.info("skip rotation: port %d is a borrowed prod tunnel (not ours)", port)
        return
    try:
        idx = ded.index(port)  # marker idx is relative to the dedicated runner's base
        (TMPDIR / f"rotate_port_{idx}").write_text("1", encoding="utf-8")
        log.info("requested IP rotation: port %d (idx %d)", port, idx)
    except Exception as e:
        log.warning("rotate request failed for port %d: %s", port, e)


def wait_for_port(ports: list[int], cursor: int, budget_sec: int) -> "int | None":
    """Poll for a health-gated port until one appears or *budget_sec* elapses."""
    deadline = time.time() + budget_sec
    while time.time() < deadline:
        port = vpn_up.pick_healthy_port(ports, cursor)
        if port is not None:
            return port
        log.warning("all tunnels down -> wait %ds (%ds left in budget)",
                    PORT_WAIT_TICK, int(deadline - time.time()))
        time.sleep(PORT_WAIT_TICK)
    return None


def _pace(i: int) -> float:
    """Deterministic-ish jitter between PACE_MIN/MAX (no RNG dependency)."""
    span = PACE_MAX - PACE_MIN
    return PACE_MIN + span * ((i * 0.6180339887) % 1.0)


def run_worker(args: list[str], timeout: int) -> tuple[int, str]:
    """Spawn a konvy_worker subprocess; hard-kill its whole tree on timeout."""
    env = dict(os.environ, PYTHONUTF8="1", PYTHONIOENCODING="utf-8")
    p = subprocess.Popen([PY, "-m", "cosmetics.konvy_worker", *args],
                         stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                         env=env, text=True, encoding="utf-8", errors="replace")
    try:
        out, _ = p.communicate(timeout=timeout)
        return p.returncode, (out or "")
    except subprocess.TimeoutExpired:
        subprocess.run(["taskkill", "/T", "/F", "/PID", str(p.pid)],
                       capture_output=True)
        try:
            out, _ = p.communicate(timeout=10)
        except Exception:
            out = ""
        return -1, (out or "") + "\nTIMEOUT_HARD_KILLED"


def _parse_line(out: str, tag: str) -> "str | None":
    # Return the LAST matching line: the product worker emits an early product-only
    # RESULT then an upgraded RESULT (with reviews) — we want the richest available,
    # but if a hard-kill truncated it the early one is still captured.
    found = None
    for line in out.splitlines():
        if line.startswith(tag):
            found = line[len(tag):].strip()
    return found


DISCOVERED_CACHE = config.STATE_DIR / "discovered.json"


def _load_discovered_cache() -> "list[tuple[str, str]] | None":
    try:
        d = json.loads(DISCOVERED_CACHE.read_text(encoding="utf-8"))
        if time.time() - float(d.get("ts", 0)) < config.DISCOVER_TTL_SEC and d.get("pairs"):
            return [(u, c) for u, c in d["pairs"]]
    except Exception:
        pass
    return None


def _save_discovered_cache(pairs: list[tuple[str, str]]) -> None:
    try:
        config.STATE_DIR.mkdir(parents=True, exist_ok=True)
        DISCOVERED_CACHE.write_text(
            json.dumps({"ts": time.time(), "pairs": [[u, c] for u, c in pairs]},
                       ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as e:
        log.warning("discovery cache save failed: %s", e)


def paginate_base(base: str, concern: str, fetch_page, max_pages: int,
                  seen: "dict[str, str]") -> "list[tuple[str, str]]":
    """Page through one seed base, claiming product URLs not already in `seen`.

    fetch_page(page_url, page) -> list[str] | None (None/empty = stop). Stops at the
    first page yielding 0 NEW urls (Konvy clamps overflow pages to the last page, so
    a 0-new page means this seed is exhausted), a failed fetch, or `max_pages`. This
    is what lets us cap pages generously without paying for empty deep pages on thin
    keyword seeds. Mutates `seen` (first seed to claim a url wins its concern)."""
    out: "list[tuple[str, str]]" = []
    for page in range(1, max_pages + 1):
        urls = fetch_page(config.paged_url(base, page), page)
        if not urls:                       # failed or empty page -> stop this base
            break
        new = 0
        for u in urls:
            if u not in seen:
                seen[u] = concern
                out.append((u, concern))
                new += 1
        if new == 0:                       # duplicates only -> exhausted, stop
            break
    return out


def discover(ports: list[int]) -> list[tuple[str, str]]:
    """Fan out one fresh-context listing fetch PER keyword/category seed (WAF-safe),
    dedup the product URLs, cache the result for DISCOVER_TTL so multi-day passes
    don't re-discover. Each seed gets a retry + IP rotation on WAF/empty."""
    cached = _load_discovered_cache()
    if cached:
        log.info("using cached discovery: %d products (TTL %ds)", len(cached), config.DISCOVER_TTL_SEC)
        return cached

    bases = config.listing_seed_bases()
    max_pages = min(config.DISCOVER_PAGES_PER_SEED, config.MAX_LIST_PAGES)
    log.info("discovery: %d seed bases x up to %d pages (early-stop on 0-new)",
             len(bases), max_pages)
    seen: "dict[str, str]" = {}
    cursor = [0]  # mutable cell so the fetch closure can cycle ports across all pages

    def fetch_page(page_url: str, page: int) -> "list[str] | None":
        # cycle across the pool for natural IP diversity; do NOT rotate dedicated
        # tunnels here — a short listing fetch isn't worth knocking a tunnel out
        # mid-discovery (that just starves the next page).
        for attempt in range(DISCOVER_RETRIES):
            port = vpn_up.pick_healthy_port(ports, cursor[0]); cursor[0] += 1
            if port is None:
                time.sleep(PORT_WAIT_TICK); continue
            rc, out = run_worker(["listing", page_url, str(port)], DISCOVER_TIMEOUT)
            payload = _parse_line(out, "URLS ")
            if payload:
                lst = json.loads(payload)
                if lst:
                    return lst
            time.sleep(2)
        return None

    for j, (base, concern) in enumerate(bases):
        if wait_for_port(ports, j, PORT_WAIT_BUDGET) is None:
            log.error("discover: tunnels down whole budget -> use partial (%d)", len(seen)); break
        got = paginate_base(base, concern, fetch_page, max_pages, seen)
        log.info("seed[%d/%d] %s -> +%d new (total uniq %d)",
                 j + 1, len(bases), base[-45:], len(got), len(seen))

    pairs = [(u, c) for u, c in seen.items()]
    if pairs:
        _save_discovered_cache(pairs)
    log.info("discovery complete: %d unique products", len(pairs))
    return pairs


def rebuild_csv() -> int:
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for f in sorted(PRODUCTS_DIR.glob("*.json")):
        try:
            rows.append(json.loads(f.read_text(encoding="utf-8")))
        except Exception:
            pass
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with config.PRODUCTS_CSV.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=CSV_FIELDS)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in CSV_FIELDS})
    return len(rows)


def _ports_from_env() -> list[int]:
    """COSMETICS_PORT_LIST="2085,2086,2087" overrides the dedicated 2090/2091 —
    used to borrow healthy prod-pool exits when the dedicated runner is in a bad
    window. Rotation is auto-skipped for borrowed ports (see rotate_ip)."""
    raw = os.getenv("COSMETICS_PORT_LIST", "").strip()
    if raw:
        return [int(x) for x in raw.split(",") if x.strip()]
    return vpn_up.dedicated_ports()


def crawl(limit: int | None) -> int:
    ports = _ports_from_env()
    log.info("using ports: %s", ports)
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    progress = load_progress()

    urls = discover(ports)
    if not urls:
        log.error("no products discovered"); return 1

    done = 0
    port_cursor = 0
    for i, (url, concern) in enumerate(urls):
        pid_guess = url.rsplit("-", 1)[-1].replace(".html", "")
        if progress.get(pid_guess, {}).get("status") == "ok":
            continue

        # Block until a tunnel is healthy; a sustained outage stops the run for resume
        # (NOT a per-product error — the product is fine, the network isn't).
        gate = wait_for_port(ports, port_cursor, PORT_WAIT_BUDGET)
        if gate is None:
            log.error("tunnels down > %ds -> stop at %d/%d (resume later)",
                      PORT_WAIT_BUDGET, i, len(urls)); break

        row = None
        status = "error"
        for attempt in range(PRODUCT_ATTEMPTS):
            port = vpn_up.pick_healthy_port(ports, port_cursor)
            port_cursor += 1
            if port is None:
                # flapped between the gate and now; brief wait, retry within budget
                time.sleep(PORT_WAIT_TICK); continue
            rc, out = run_worker(["product", url, concern, str(port)], WORKER_TIMEOUT)
            payload = _parse_line(out, "RESULT ")
            if payload:
                row = json.loads(payload); status = "ok"; break
            if "WAF_BLOCKED" in out or "EMPTY_PARSE" in out:
                status = "waf"
                log.warning("WAF/empty %s (port %d, attempt %d) -> rotate IP",
                            pid_guess, port, attempt + 1)
                rotate_ip(ports, port); time.sleep(ROTATE_WAIT); continue
            if rc == -1:
                status = "timeout"
                log.warning("WEDGE/timeout %s (port %d, attempt %d) -> hard-killed, rotate IP",
                            pid_guess, port, attempt + 1)
                rotate_ip(ports, port); time.sleep(ROTATE_WAIT); continue
            log.warning("fail %s rc=%d tail=%s", pid_guess, rc, out.strip()[-120:])

        if row is not None:
            (PRODUCTS_DIR / f"{row.get('product_id', pid_guess)}.json").write_text(
                json.dumps(row, ensure_ascii=False, indent=2), encoding="utf-8")
            progress[row.get("product_id", pid_guess)] = {
                "status": "ok", "name": row.get("name", ""),
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
            done += 1
            log.info("OK %s %s (%s ingr, %s reviews) [%d done]",
                     row.get("product_id"), (row.get("name") or "")[:40],
                     len((row.get("ingredients") or "").split("|")) if row.get("ingredients") else 0,
                     row.get("konvy_review_count"), done)
        else:
            progress[pid_guess] = {"status": status,
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
            log.info("SKIP %s status=%s", pid_guess, status)

        save_progress(progress); _heartbeat()
        if done and done % 25 == 0:
            rebuild_csv()  # keep products.csv live during the long pass
        if limit and done >= limit:
            break
        time.sleep(_pace(i))

    n = rebuild_csv()
    log.info("products phase done: %d ok this run, %d rows in products.csv", done, n)

    # --- reviews phase: backfill the review corpus for ok products lacking it ---
    reviews_phase(ports)
    log.info("DONE (products + reviews phases)")
    return 0


def reviews_phase(ports: list[int]) -> None:
    """For every collected product that claims reviews but has no corpus file yet,
    fetch its reviews in a dedicated worker (own time budget). Resumable: a product
    with a saved review file is skipped; failures retry on the next pass."""
    targets = []
    for f in sorted(PRODUCTS_DIR.glob("*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        pid = d.get("product_id")
        if not pid or _int(d.get("konvy_review_count")) <= 0:
            continue
        if (config.REVIEWS_DIR / f"{pid}_konvy.json").exists():
            continue
        targets.append((pid, d.get("url"), f, d))
    if not targets:
        log.info("reviews phase: nothing to backfill"); return
    log.info("reviews phase: %d products need a review corpus", len(targets))
    pcur, got = 0, 0
    for k, (pid, url, f, d) in enumerate(targets):
        if not url:
            continue
        if wait_for_port(ports, pcur, PORT_WAIT_BUDGET) is None:
            log.error("reviews: tunnels down whole budget -> stop at %d/%d (resume)", k, len(targets)); break
        for attempt in range(2):
            port = vpn_up.pick_healthy_port(ports, pcur); pcur += 1
            if port is None:
                time.sleep(PORT_WAIT_TICK); continue
            rc, out = run_worker(["reviews", pid, url, str(port)], REVIEW_TIMEOUT)
            m = _parse_line(out, "REVIEWS ")
            if m is not None:
                cnt = _int(m)
                if cnt > 0:
                    d["reviews_scraped"] = cnt
                    try:
                        f.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
                    except Exception:
                        pass
                    got += 1
                    log.info("REVIEWS %s -> %d [%d/%d]", pid, cnt, k + 1, len(targets))
                break
            if "WAF_BLOCKED" in out or rc == -1:
                rotate_ip(ports, port); time.sleep(ROTATE_WAIT); continue
        _heartbeat()
        if (k + 1) % 25 == 0:
            rebuild_csv()
        time.sleep(_pace(k))
    rebuild_csv()
    log.info("reviews phase done: %d corpora fetched this pass", got)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    return crawl(ap.parse_args().limit)


if __name__ == "__main__":
    sys.exit(main())
