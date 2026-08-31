"""
photo_scraper.py — Top-N restaurant photos from Google Maps via Playwright + SOCKS5.

For each restaurant in the input CSV, opens its Google Maps page, clicks the
Photos tab, and captures the first N photo URLs in Google's default
popularity-based ordering. Saves a CSV per restaurant in the output folder.

Each saved photo URL is converted to a "medium" size variant (w800 x h600)
that is small enough to upload to an app server without strain, while
remaining sharp on mobile screens.

Resume-safe: skips restaurants whose output file already exists.
Standalone: runs from any directory — paths configurable via CLI args.

USAGE
-----
    # First-time setup (once on the machine):
    python -m playwright install chromium

    # Default: read ./discovered_places.csv, write to ./photos/
    python photo_scraper.py

    # Specify input CSV and output directory explicitly:
    python photo_scraper.py --input /path/to/places.csv --output-dir /path/to/photos

    # Change photos per restaurant (default 10):
    python photo_scraper.py --top-n 15

    # Watch the browser for debugging:
    python photo_scraper.py --headed

NOTE: The SOCKS5 port is hard-coded to 2080 (the only safe port — review
scraper uses 2081-2087). The CLI does not expose a way to change it; this
prevents accidental interference with the live review collection.

INPUT CSV
---------
    Must contain a `place_id` column and either a `maps_url` or `href` column
    pointing to the Google Maps place page. Both `restaurants.csv` and
    `discovered_places.csv` from the deliverable project are supported.

REQUIREMENTS
------------
    - NordVPN SOCKS5 listeners running (nordvpn_runner.py active)
    - Playwright Chromium installed
    - Python 3.10+
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import logging
import random
import re
import sys
import time
from pathlib import Path

from playwright.async_api import (
    Browser,
    BrowserContext,
    Page,
    Playwright,
    TimeoutError as PWTimeoutError,
    async_playwright,
)

# === Paths (resolved at runtime from CLI args) =============================
# These are placeholders; the real values are set in main() based on args.
INPUT_CSV: Path = Path("./discovered_places.csv")
OUTPUT_DIR: Path = Path("./photos")
LOG_FILE: Path = Path("./photo.log")

# === Logger (handlers attached after CLI parsing) ==========================
log = logging.getLogger("photo")
log.setLevel(logging.INFO)


def setup_logging(log_file: Path) -> None:
    """
    Attach a UTF-8 file handler to the logger. Stdout handler is intentionally
    NOT attached because Windows consoles default to cp1252 and crash with
    UnicodeEncodeError when log messages contain Thai/Korean characters
    (which restaurant names frequently do).

    Use `tail -f <log_file>` to monitor progress in real time.
    """
    log_file.parent.mkdir(parents=True, exist_ok=True)
    fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    fh = logging.FileHandler(log_file, encoding="utf-8")
    fh.setFormatter(fmt)
    log.handlers = [fh]

# === Constants =============================================================
# Desktop user agents — Maps desktop UI exposes the photos panel reliably.
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]

# Selectors used to find the "Photos" entry button on the place card.
# Keep both English and Thai labels because the page is locale-th but
# Maps frequently mixes English in its accessibility labels.
PHOTO_BTN_PATTERNS = [
    'button[jsaction*="pane.heroHeaderImage"]',         # desktop hero image button
    'button[jsaction*="pane.placeActions.photos"]',     # desktop "Photos" action
    'button[jsaction*="photo"]',                         # generic photo action
    'button[aria-label^="Photo"]',                       # "Photo of {name}"
    'button[aria-label*="hoto"]',                        # "Photos", "See photos"
    'button[aria-label*="รูป"]',                          # Thai
    'a[aria-label^="Photo"]',
]

# Target image size — sharp enough on mobile, small enough for app upload.
# Google's CDN serves these dimensions directly; we never download the bytes
# ourselves, we just store the URL with the correct size suffix.
TARGET_WIDTH = 800
TARGET_HEIGHT = 600

# Hard-coded SOCKS5 port. 2080 = grid scanner port (idle since grid finished).
# Ports 2081-2087 are reserved for the live review scraper and MUST NOT be
# touched by this script. Not exposed via CLI to prevent accidental changes.
SOCKS_PORT = 2080


# === Helpers ===============================================================
def upgrade_photo_url(url: str, width: int = TARGET_WIDTH, height: int = TARGET_HEIGHT) -> str:
    """
    Rewrite a Google Maps photo CDN URL to request a medium size.

    Examples
    --------
    Input  : https://lh3.googleusercontent.com/p/AF1Q...=w408-h271-k-no
    Output : https://lh3.googleusercontent.com/p/AF1Q...=w800-h600-k-no

    Patterns handled:
        =w___-h___-...        (most common on Maps)
        =s___-...             (single-dimension max)
    """
    if re.search(r"=w\d+-h\d+", url):
        return re.sub(r"=w\d+-h\d+", f"=w{width}-h{height}", url)
    if re.search(r"=s\d+", url):
        return re.sub(r"=s\d+", f"=s{width}", url)
    return url


def maps_url_from_place_id(place_id: str) -> str:
    """
    Build a clean Google Maps URL from a place_id alone.

    The CSV's `maps_url` / `href` fields contain restaurant names in the
    URL path — for Thai-named restaurants the encoding is sometimes broken
    and lands on the wrong page. Building from `place_id` only is robust:
    place_id is a stable hex pair like `0x30e29feff0e20361:0x6c84778922e55ae8`
    that Google Maps resolves directly via the standard `!1s` data parameter.
    """
    return f"https://www.google.com/maps/place//data=!4m2!3m1!1s{place_id}"


def load_jobs(input_csv: Path) -> list[tuple[str, str, str]]:
    """
    Return a list of (place_id, name, url).

    The URL is ALWAYS constructed from place_id — the CSV's maps_url / href
    columns are ignored because they can be malformed for Thai-named
    restaurants. Deduplicates by place_id.
    """
    jobs: list[tuple[str, str, str]] = []
    seen: set[str] = set()
    with input_csv.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            place_id = (row.get("place_id") or "").strip()
            if not place_id or place_id in seen:
                continue
            name = (row.get("name") or "").strip()
            seen.add(place_id)
            jobs.append((place_id, name, maps_url_from_place_id(place_id)))
    return jobs


def output_path_for(place_id: str) -> Path:
    """Sanitize place_id (which contains ':' and '/') for use as a filename."""
    safe = place_id.replace(":", "_").replace("/", "_")
    return OUTPUT_DIR / f"{safe}.csv"


# === Page interactions =====================================================
async def click_photos_tab(page: Page) -> bool:
    """Try several selectors to open the photos panel. Returns True on success."""
    for selector in PHOTO_BTN_PATTERNS:
        try:
            btn = await page.query_selector(selector)
            if not btn:
                continue
            # Skip "Add a photo" / "Upload" type buttons — we want the viewer entry.
            aria = (await btn.get_attribute("aria-label") or "").lower()
            if any(kw in aria for kw in ("add", "upload", "post", "เพิ่ม")):
                continue
            await btn.click()
            await page.wait_for_timeout(1500)
            return True
        except Exception:
            continue
    return False


async def extract_photos(page: Page, top_n: int) -> list[dict]:
    """
    Collect the first N photo URLs from the photos panel.

    Maps renders photos as elements with background-image URLs (preferred)
    or fallback <img> tags pointing at lh3/lh5/lh6.googleusercontent.com.
    The first ~10 tiles are Google's most-popular ordering.
    """
    try:
        await page.wait_for_selector(
            'div[style*="googleusercontent.com"], '
            'a[style*="googleusercontent.com"], '
            'img[src*="googleusercontent.com"]',
            timeout=10000,
        )
    except PWTimeoutError:
        return []

    photos = await page.evaluate(
        """
        (target) => {
            const seen = new Set();
            const out = [];

            // Pass 1 — background-image styles (the photos grid uses this)
            const styled = document.querySelectorAll('[style*="googleusercontent.com"]');
            for (const el of styled) {
                if (out.length >= target) break;
                const style = el.getAttribute('style') || '';
                const m = style.match(/url\\(["']?(https?:[^"')]+googleusercontent[^"')]+)["']?\\)/);
                if (m && !seen.has(m[1])) {
                    seen.add(m[1]);
                    out.push({ url: m[1], alt: el.getAttribute('aria-label') || '' });
                }
            }

            // Pass 2 — <img src> fallback
            if (out.length < target) {
                const imgs = document.querySelectorAll('img[src*="googleusercontent.com"]');
                for (const el of imgs) {
                    if (out.length >= target) break;
                    const src = el.getAttribute('src') || '';
                    if (src && !seen.has(src)) {
                        seen.add(src);
                        out.push({ url: src, alt: el.getAttribute('alt') || '' });
                    }
                }
            }

            return out;
        }
        """,
        top_n,
    )
    return photos[:top_n]


class TransientError(Exception):
    """Raised when a restaurant fails for a network/IP reason — should be retried."""


async def scrape_one(
    page: Page, place_id: str, name: str, maps_url: str, top_n: int
) -> list[dict]:
    """
    Navigate to a restaurant, open the photos tab, return top-N photos.

    Distinguishes between:
      - Transient failures (goto timeout, no photos tab) → raise TransientError.
        These get logged but no output file is written, so the next run retries.
      - Genuine "page loaded but zero photos" → return []. Worker writes a
        zero-row CSV to mark "tried, nothing here" and will not retry.
    """
    # Maps is a heavy SPA — wait_until="domcontentloaded" frequently never
    # fires on slow VPN exits. Use "commit" (fires as soon as the response
    # starts) and rely on subsequent waits to settle the DOM.
    try:
        await page.goto(maps_url, wait_until="commit", timeout=45000)
    except PWTimeoutError:
        raise TransientError(f"goto timeout: {name}")
    except Exception as e:
        # Network-level errors (ERR_SOCKS_CONNECTION_FAILED, ERR_TIMED_OUT, etc.)
        raise TransientError(f"goto failed: {name} ({type(e).__name__})")

    # Wait for the place card / photo tile to actually render. This is the
    # real signal that the page is usable — much more reliable than
    # navigation events on a JS-heavy SPA.
    try:
        await page.wait_for_selector(
            'button[jsaction*="photo"], '
            'button[aria-label*="hoto"], '
            '[style*="googleusercontent.com"], '
            'img[src*="googleusercontent.com"]',
            timeout=20000,
        )
    except PWTimeoutError:
        raise TransientError(f"page never rendered photo UI: {name}")

    # Slight humanizing pause
    await page.wait_for_timeout(1500 + random.randint(0, 1500))

    if not await click_photos_tab(page):
        raise TransientError(f"no photos tab: {name}")

    await page.wait_for_timeout(2000 + random.randint(0, 1000))
    return await extract_photos(page, top_n)


# === VPN health =============================================================
async def vpn_alive(port: int, timeout: float = 8.0) -> bool:
    """Real SOCKS5 health check via curl. Returns True if VPN reaches the net."""
    try:
        proc = await asyncio.create_subprocess_exec(
            "curl", "--socks5-hostname", f"127.0.0.1:{port}",
            "-s", "-o", "/dev/null", "-w", "%{http_code}",
            "--connect-timeout", str(int(timeout)),
            "--max-time", str(int(timeout)),
            "https://www.google.com/generate_204",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.DEVNULL,
        )
        out, _ = await proc.communicate()
        return out.strip() == b"204"
    except Exception:
        return False


async def wait_for_vpn(port: int, max_wait: float = 300.0) -> bool:
    """
    Wait up to max_wait seconds for the SOCKS port to be reachable.
    Asks for a rotation early on, then just polls. Returns True on recovery.
    """
    deadline = time.time() + max_wait
    asked_rotate = False
    poll_count = 0
    while time.time() < deadline:
        if await vpn_alive(port):
            return True
        if not asked_rotate:
            rotate_vpn(port)
            asked_rotate = True
        poll_count += 1
        if poll_count % 6 == 0:  # every ~50s, ask for another rotation
            rotate_vpn(port)
        await asyncio.sleep(8)
    return False


# === Workers ===============================================================
async def _block_heavy(route, _request):
    await route.abort()


SESSION_MAX_ITEMS = 50      # restart browser every N items (memory hygiene)
HEARTBEAT_EVERY = 25        # log a progress line every N items


async def run_browser_session(
    idx: int,
    port: int,
    queue: asyncio.Queue,
    pw: Playwright,
    top_n: int,
    headed: bool,
    state: dict,
) -> None:
    """
    Run one browser session. Returns when SESSION_MAX_ITEMS items have been
    processed OR the queue is empty OR the session has too many fails.
    Browser is always torn down before return.
    """
    proxy = {"server": f"socks5://127.0.0.1:{port}"}
    browser: Browser = await pw.chromium.launch(
        headless=not headed,
        proxy=proxy,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--no-sandbox",
        ],
    )
    try:
        context: BrowserContext = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            locale="en-US",
            viewport={"width": 1366, "height": 768},
            device_scale_factor=1,
        )

        # Pre-accept Google's consent / GDPR cookie so EU exit IPs don't get
        # redirected to consent.google.com instead of the place page. Without
        # this, every request from an EU VPN exit lands on a consent prompt
        # and our photo selectors never find anything.
        await context.add_cookies([
            {
                "name": "CONSENT",
                "value": "YES+1",
                "domain": ".google.com",
                "path": "/",
            },
            {
                "name": "SOCS",
                "value": "CAESHAgBEhJnd3NfMjAyNDA1MDgtMF9SQzIaAmVuIAEaBgiAtIeyBg",
                "domain": ".google.com",
                "path": "/",
            },
        ])

        await context.route("**/*.{woff,woff2,ttf,otf,mp4,webm}", _block_heavy)

        items_this_session = 0
        while items_this_session < SESSION_MAX_ITEMS:
            try:
                place_id, name, maps_url = await asyncio.wait_for(queue.get(), timeout=2)
            except asyncio.TimeoutError:
                if queue.empty():
                    return
                continue

            out_file = output_path_for(place_id)
            if out_file.exists():
                queue.task_done()
                continue

            # new_page() has to sit inside its own guard, not above the
            # try/finally below. When the browser dies underneath us (Chromium
            # exiting mid-run raises TargetClosedError here) the item has
            # already been taken off the queue, and the finally: that calls
            # task_done() hasn't been entered yet — so that slot's completion
            # is never recorded. amain() waits on queue.join(), which only
            # returns once every put() has a matching task_done(), so a single
            # one of these crashes leaves the run unable to ever finish.
            try:
                page = await context.new_page()
            except Exception as e:
                state["failed"] += 1
                log.error(f"[W{idx}] new_page failed: {type(e).__name__}: {e}")
                queue.task_done()
                raise
            t0 = time.time()
            try:
                photos = await scrape_one(page, place_id, name, maps_url, top_n)
                with out_file.open("w", encoding="utf-8", newline="") as f:
                    writer = csv.DictWriter(
                        f,
                        fieldnames=["place_id", "rank", "url_thumb", "url_medium", "alt"],
                    )
                    writer.writeheader()
                    for i, ph in enumerate(photos):
                        writer.writerow({
                            "place_id": place_id,
                            "rank": i + 1,
                            "url_thumb": ph["url"],
                            "url_medium": upgrade_photo_url(ph["url"]),
                            "alt": ph.get("alt", ""),
                        })
                state["consecutive_fails"] = 0
                if photos:
                    state["completed"] += 1
                    dt = int(time.time() - t0)
                    log.info(f"[W{idx}] OK {name}: {len(photos)} photos ({dt}s)")
                else:
                    state["failed"] += 1
                    log.info(f"[W{idx}] -- {name}: 0 photos (page loaded, none found)")
            except TransientError as e:
                state["failed"] += 1
                state["consecutive_fails"] += 1
                log.warning(f"[W{idx}] RETRY {e}")
                # Backoff strategy: small fails → short sleep + rotate;
                # long fails → real VPN health check + long wait.
                cf = state["consecutive_fails"]
                if cf == 5:
                    log.info(f"[W{idx}] 5 fails — rotate + sleep 30s")
                    rotate_vpn(port)
                    await asyncio.sleep(30)
                elif cf == 15:
                    log.warning(f"[W{idx}] 15 fails — checking VPN health…")
                    if await wait_for_vpn(port, max_wait=180):
                        log.info(f"[W{idx}] VPN recovered, resuming")
                        state["consecutive_fails"] = 0
                    else:
                        log.error(f"[W{idx}] VPN still down after 3min — sleeping 5min")
                        await asyncio.sleep(300)
                elif cf >= 30:
                    # Hard failure mode — recycle browser via session exit
                    log.error(f"[W{idx}] {cf} consecutive fails — exiting session for full recycle")
                    queue.task_done()  # don't lose the slot
                    return
            except Exception as e:
                # Any unexpected error: log and move on. Never crash the worker.
                state["failed"] += 1
                log.error(f"[W{idx}] ERR {name}: {type(e).__name__}: {e}")
            finally:
                try:
                    await page.close()
                except Exception:
                    pass
                queue.task_done()

            items_this_session += 1
            total = state["completed"] + state["failed"]
            if total > 0 and total % HEARTBEAT_EVERY == 0:
                log.info(
                    f"[W{idx}] heartbeat: ok={state['completed']} "
                    f"fail={state['failed']} pending~{queue.qsize()}"
                )
    finally:
        try:
            await browser.close()
        except Exception:
            pass


async def worker(
    idx: int,
    port: int,
    queue: asyncio.Queue,
    pw: Playwright,
    top_n: int,
    headed: bool,
):
    """
    Outer worker — runs browser sessions back-to-back, restarting the browser
    every SESSION_MAX_ITEMS items to prevent Playwright/Chromium memory leaks
    that accumulate over thousands of pages.

    Catches every session-level exception so the worker NEVER crashes silently.
    """
    state = {"completed": 0, "failed": 0, "consecutive_fails": 0}
    log.info(f"[W{idx}] starting on port {port}")

    while not queue.empty():
        try:
            await run_browser_session(idx, port, queue, pw, top_n, headed, state)
            log.info(
                f"[W{idx}] session cycled "
                f"(ok={state['completed']} fail={state['failed']} pending~{queue.qsize()})"
            )
            await asyncio.sleep(3)  # cooldown between sessions
        except asyncio.CancelledError:
            break
        except Exception as e:
            log.exception(f"[W{idx}] session crashed: {type(e).__name__}: {e}")
            # Wait before retrying — gives system a chance to recover
            await asyncio.sleep(30)

    log.info(
        f"[W{idx}] all done. ok={state['completed']} fail={state['failed']}"
    )


def rotate_vpn(port: int):
    """
    Signal nordvpn_runner.py to rotate the tunnel for this port.
    The runner watches /tmp/rotate_port_<idx> for changes (file-based IPC).
    """
    idx = port - 2080
    try:
        Path(f"/tmp/rotate_port_{idx}").write_text(str(time.time()))
    except Exception:
        pass


# === Entry point ===========================================================
async def amain(args):
    jobs = load_jobs(INPUT_CSV)
    log.info(f"Loaded {len(jobs)} unique restaurants from {INPUT_CSV.name}")

    pending = [j for j in jobs if not output_path_for(j[0]).exists()]
    log.info(
        f"Pending: {len(pending)} "
        f"(skipping {len(jobs) - len(pending)} already cached)"
    )
    if not pending:
        log.info("Nothing to do.")
        return

    queue: asyncio.Queue = asyncio.Queue()
    for j in pending:
        await queue.put(j)

    log.info("=" * 70)
    log.info(f"  Photo scraper starting")
    log.info(f"  SOCKS5 port    : {SOCKS_PORT} (hard-coded)")
    log.info(f"  Photos/restaurant: {args.top_n}")
    log.info(f"  Pending        : {len(pending)} restaurants")
    log.info("=" * 70)

    async with async_playwright() as pw:
        # Single worker on the hard-coded port.
        w = asyncio.create_task(worker(0, SOCKS_PORT, queue, pw, args.top_n, args.headed))
        await queue.join()
        w.cancel()
        await asyncio.gather(w, return_exceptions=True)


def main():
    parser = argparse.ArgumentParser(
        description="Restaurant photo scraper (Google Maps via SOCKS5)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--input",
        default="discovered_places.csv",
        help="Path to input CSV (must have place_id + maps_url/href columns)",
    )
    parser.add_argument(
        "--output-dir",
        default="photos",
        help="Directory where per-restaurant CSVs are written",
    )
    parser.add_argument(
        "--log-file",
        default="photo.log",
        help="Path to log file",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=10,
        help="Photos to capture per restaurant",
    )
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Show the browser (debugging only, slower)",
    )
    args = parser.parse_args()

    # Wire global path constants from CLI (these are resolved against CWD)
    global INPUT_CSV, OUTPUT_DIR, LOG_FILE
    INPUT_CSV = Path(args.input).resolve()
    OUTPUT_DIR = Path(args.output_dir).resolve()
    LOG_FILE = Path(args.log_file).resolve()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    setup_logging(LOG_FILE)

    if not INPUT_CSV.exists():
        log.error(f"Input CSV not found: {INPUT_CSV}")
        log.error("Pass --input <path> or place a CSV named discovered_places.csv next to this script.")
        sys.exit(1)

    # Outer auto-restart loop — if asyncio.run dies for any reason at all
    # (Playwright crash, OS error, network nuke), wait 30s and start over.
    # The job queue is rebuilt from disk each restart and skips already-done
    # restaurants automatically, so restart is cheap and safe.
    crash_count = 0
    while True:
        try:
            asyncio.run(amain(args))
            log.info("Photo scraper finished cleanly.")
            return
        except KeyboardInterrupt:
            log.info("Interrupted by user.")
            return
        except Exception as e:
            crash_count += 1
            log.exception(
                f"Top-level crash #{crash_count}: {type(e).__name__}: {e}. "
                f"Restarting in 30s..."
            )
            time.sleep(30)


if __name__ == "__main__":
    main()
