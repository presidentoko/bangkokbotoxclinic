"""Monthly review collection — runs Watsons + Konvy in parallel.

Each scraper skips already-collected reviews (output file existence),
so repeated passes progressively fill gaps and pick up new products.

RAM-safe: each scraper is its own subprocess (separate browser + memory).
Multi-worker: splits pending list into shards, one worker per VPN port.

Stop any time: touch cosmetics/state/STOP_REVIEWS
Resume: just re-run; already-collected files are skipped automatically.

Usage:
    python -m cosmetics.run_reviews [--hours 36] [--workers N]
    python -m cosmetics.run_reviews --workers 8   # use 8 VPN ports (4 konvy + 4 watsons)
"""
from __future__ import annotations
import argparse, logging, os, subprocess, sys, threading, time
from pathlib import Path

from cosmetics import config

PY = sys.executable
WT = Path(__file__).resolve().parent.parent
STOP_FILE = config.STATE_DIR / "STOP_REVIEWS"
LOG_FILE = config.STATE_DIR / "run_reviews.log"

REST_BETWEEN_PASSES = 300   # seconds between full loops if nothing gained

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [run_reviews] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(str(LOG_FILE), encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)


def _review_counts() -> dict[str, int]:
    d: dict[str, int] = {"konvy": 0, "watsons": 0, "boots": 0, "iherb": 0}
    rev_dir = config.REVIEWS_DIR
    if not rev_dir.exists():
        return d
    for src in d:
        d[src] = len(list(rev_dir.glob(f"*_{src}.json")))
    # ingredient patches
    patch_file = config.STATE_DIR / "ingredient_patches.json"
    if patch_file.exists():
        import json as _json
        patches = _json.loads(patch_file.read_text(encoding="utf-8"))
        d["ingredients_patched"] = sum(1 for v in patches.values() if v)
    return d


def _run_worker(label: str, cmd: list[str], deadline: float) -> None:
    """Run one worker subprocess (blocking). Called from a thread."""
    if STOP_FILE.exists():
        log.info(f"{label}: STOP_REVIEWS seen — skipping")
        return
    remaining = int(deadline - time.time())
    if remaining <= 0:
        log.info(f"{label}: time window exhausted — skipping")
        return
    log.info(f"=== {label} starting (up to {remaining // 60}m remaining) ===")
    env = {**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"}
    try:
        subprocess.run(
            cmd, cwd=str(WT), env=env,
            timeout=min(remaining, 12 * 3600),
        )
    except subprocess.TimeoutExpired:
        log.warning(f"{label}: timed out — moving on")
    except KeyboardInterrupt:
        raise
    except Exception as e:
        log.error(f"{label}: {e}")


def _run_parallel(ports: list[int], deadline: float) -> None:
    """Launch all workers concurrently, wait for all to finish.

    Splits ports evenly: first half → konvy workers, second half → watsons workers.
    Each worker gets its own VPN port and a shard of the pending product list.
    """
    n = len(ports)

    # Port allocation (with 8 ports):
    #   konvy:       2 workers  (ports 0-1)   — fast API, few needed
    #   watsons:     2 workers  (ports 2-3)   — needs VPN, Playwright
    #   boots:       2 workers  (ports 4-5)   — needs VPN, Playwright
    #   ingredients: 2 workers  (ports 6-7)   — needs VPN, Konvy product pages
    # iHerb runs in separate parallel threads (no VPN, own process pool)
    slots = [
        ("konvy",       "cosmetics.konvy_reviews",         max(1, n * 2 // 8)),
        ("watsons",     "cosmetics.watsons_reviews",        max(1, n * 2 // 8)),
        ("boots",       "cosmetics.boots_reviews",          max(1, n * 2 // 8)),
        ("ingredients", "cosmetics.ingredient_backfill",    max(1, n * 2 // 8)),
    ]
    # Distribute ports evenly across VPN scrapers
    vpn_scrapers = [s for s in slots]
    total_vpn_workers = sum(s[2] for s in vpn_scrapers)
    # If we have more ports than workers, scale up konvy/watsons
    if n > total_vpn_workers:
        extra = n - total_vpn_workers
        slots[0] = (slots[0][0], slots[0][1], slots[0][2] + extra)

    workers: list[tuple[str, list[str]]] = []
    port_idx = 0
    for scraper_name, module, n_workers in slots:
        for i in range(n_workers):
            port = ports[port_idx % n]
            port_idx += 1
            cmd = [PY, "-m", module, "--port", str(port), "--shard", f"{i}/{n_workers}"]
            workers.append((f"{scraper_name}-{i}[port={port}]", cmd))

    # iHerb workers (no VPN needed — run 4 in parallel without port args)
    n_iherb = 4
    for i in range(n_iherb):
        cmd = [PY, "-m", "cosmetics.iherb_reviews", "--shard", f"{i}/{n_iherb}"]
        workers.append((f"iherb-{i}", cmd))

    threads: list[threading.Thread] = []
    for label, cmd in workers:
        t = threading.Thread(
            target=_run_worker,
            args=(label, cmd, deadline),
            daemon=True,
            name=label,
        )
        t.start()
        threads.append(t)
        log.info(f"launched {label}")

    for t in threads:
        t.join()
    log.info("all workers finished this pass")


def _wait_for_ports(target_ports: list[int], wait_sec: int = 120) -> list[int]:
    """Wait up to wait_sec for VPN ports to come alive. Returns alive ports."""
    from cosmetics import vpn_up
    deadline = time.time() + wait_sec
    while time.time() < deadline:
        alive = list(vpn_up.ports_alive(target_ports))
        if len(alive) >= len(target_ports):
            return alive
        log.info(f"waiting for VPN ports... {len(alive)}/{len(target_ports)} alive")
        time.sleep(5)
    from cosmetics import vpn_up
    return list(vpn_up.ports_alive(target_ports))


def _clear_reviews() -> None:
    """Delete all review output files for a fresh monthly run."""
    rev_dir = config.REVIEWS_DIR
    if not rev_dir.exists():
        return
    deleted = 0
    for src in ("watsons", "konvy"):
        for f in rev_dir.glob(f"*_{src}.json"):
            f.unlink()
            deleted += 1
    log.info(f"cleared {deleted} review files for fresh run")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hours", type=float, default=36.0,
                        help="total window to run (default: 36 hours)")
    parser.add_argument("--workers", type=int, default=None,
                        help="total VPN ports to use (default: all active ports)")
    parser.add_argument("--base-port", type=int, default=config.PROXY_PORT_BASE,
                        help=f"first VPN port (default: {config.PROXY_PORT_BASE})")
    parser.add_argument("--fresh", action="store_true",
                        help="delete existing review files before starting (monthly refresh)")
    args = parser.parse_args()

    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    STOP_FILE.unlink(missing_ok=True)

    if args.fresh:
        _clear_reviews()

    # Determine ports to use
    if args.workers:
        target_ports = [args.base_port + i for i in range(args.workers)]
    else:
        from cosmetics import vpn_up
        target_ports = vpn_up.pick_active_ports()

    log.info(f"waiting for {len(target_ports)} VPN ports: {target_ports}")
    alive_ports = _wait_for_ports(target_ports, wait_sec=120)
    if not alive_ports:
        log.error("no VPN ports came alive — aborting")
        return 1
    log.info(f"using {len(alive_ports)} ports: {alive_ports}")

    deadline = time.time() + args.hours * 3600
    log.info(f"start: {args.hours}h window, "
             f"deadline={time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(deadline))}")

    pass_no = 0
    try:
        while time.time() < deadline and not STOP_FILE.exists():
            pass_no += 1
            before = _review_counts()
            log.info(f"pass {pass_no} begin | konvy={before['konvy']} watsons={before['watsons']} boots={before['boots']} iherb={before['iherb']} ingredients={before.get('ingredients_patched',0)}")

            _run_parallel(alive_ports, deadline)

            if STOP_FILE.exists() or time.time() >= deadline:
                break

            after = _review_counts()
            gained = {k: after.get(k, 0) - before.get(k, 0) for k in after}
            log.info(f"pass {pass_no} done | gained konvy={gained['konvy']} watsons={gained['watsons']} boots={gained['boots']} iherb={gained['iherb']}")

            if sum(gained.values()) == 0:
                rest = min(REST_BETWEEN_PASSES, int(deadline - time.time()))
                if rest > 0:
                    log.info(f"no new reviews — resting {rest}s before retry")
                    time.sleep(rest)

    except KeyboardInterrupt:
        log.info("interrupted by user")

    final = _review_counts()
    log.info(f"finished after {pass_no} passes | "
             f"watsons={final['watsons']} konvy={final['konvy']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
