"""Recover ingredient lists from Watsons for products Konvy no longer publishes.

Konvy removed the structured ingredient block from its product pages (verified
2026-08-13: a product whose ingredients we already had re-scraped clean, with
`#ingredient_data_main a.ingredientFont` matching nothing on a fully rendered,
un-blocked page), so re-scraping Konvy cannot recover the 380 products that lack
ingredient data. Watsons product pages still carry the full INCI list, e.g.

    Aqua, Caprylic/Capric Triglyceride, Methylpropanediol, Butylene Glycol,
    Panthenol, Lactic Acid, Cetearyl Alcohol, Gluconolactone, ...

Only products that already have a saved Watsons match (output/reviews/
<id>_watsons.json with a snippet source_url) are reachable — the match was
established by watsons_reviews.py, so this module does no searching of its own
and cannot invent a wrong join.

Results are written to state/ingredient_patches.json, which build_master_db
already reads and applies, so no pipeline change is needed.

Notes on access: the OCC API (api.watsons.co.th/api/v2/wtcth/products/...)
returns 403 to plain HTTP clients, and headless Chromium is challenged, so this
uses a headed browser like the rest of the Watsons tooling.

Usage:
  python -m cosmetics.watsons_ingredients
  python -m cosmetics.watsons_ingredients --limit 20
"""
from __future__ import annotations
import argparse, glob, io, json, logging, os, re, time
from pathlib import Path

from cosmetics import config

log = logging.getLogger("cosmetics.watsons_ingredients")

PATCH_PATH = config.STATE_DIR / "ingredient_patches.json"
MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"
STOP_FILE = config.STATE_DIR / "STOP_WATSONS_ING"

# An INCI list is recognised by shape rather than by CSS class, so a markup
# change doesn't silently return nothing: many comma-separated chemical-looking
# tokens, opening with the solvent almost every formula starts with.
_SOLVENT_START = re.compile(r"^\s*(aqua|water|eau)\b", re.I)
_MIN_TOKENS = 6


def parse_inci(text: str) -> list[str]:
    """Split an ingredient blob into INCI tokens, or [] if it isn't one."""
    t = re.sub(r"\s+", " ", (text or "").strip())
    if not t or len(t) > 6000:
        return []
    # Strip a leading label ("Ingredients:", "ส่วนผสม:")
    t = re.sub(r"^\s*(ingredients?|ส่วนผสม|ส่วนประกอบ)\s*[:：]\s*", "", t, flags=re.I)
    parts = [p.strip(" .;") for p in t.split(",")]
    parts = [p for p in parts if 2 <= len(p) <= 80]
    if len(parts) < _MIN_TOKENS:
        return []
    if not _SOLVENT_START.match(parts[0]):
        return []
    # Reject prose: real INCI tokens are short and rarely contain sentences.
    if sum(1 for p in parts if len(p.split()) > 6) > len(parts) * 0.2:
        return []
    return parts


def extract_from_html(html: str) -> list[str]:
    """Pull the longest plausible INCI list out of a rendered product page."""
    best: list[str] = []
    # Look at text nodes that mention a formula solvent; the ingredient block is
    # rendered as plain text inside a content element.
    for m in re.finditer(r">([^<>]{60,6000})<", html):
        seg = m.group(1)
        if not re.search(r"\b(aqua|water)\b\s*,", seg, re.I):
            continue
        toks = parse_inci(seg)
        if len(toks) > len(best):
            best = toks
    return best


def _watsons_urls_by_pid() -> dict[str, str]:
    out: dict[str, str] = {}
    for f in glob.glob(str(config.REVIEWS_DIR / "*_watsons.json")):
        pid = os.path.basename(f).split("_watsons")[0]
        try:
            d = json.load(io.open(f, encoding="utf-8-sig"))
        except Exception:
            continue
        for s in d.get("snippets") or []:
            u = s.get("source_url")
            if u:
                out[pid] = u
                break
    return out


def _load_patches() -> dict:
    if PATCH_PATH.exists():
        try:
            return json.loads(PATCH_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def _save_patches(p: dict) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    PATCH_PATH.write_text(json.dumps(p, ensure_ascii=False), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--headless", action="store_true",
                    help="not recommended — Watsons challenges headless Chromium")
    args = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    if not MASTER_DB.exists():
        print("master_db.json 없음")
        return 1
    products = json.loads(MASTER_DB.read_text(encoding="utf-8"))["products"]
    urls = _watsons_urls_by_pid()
    patches = _load_patches()

    pending = []
    for pid, p in products.items():
        ings = p.get("ingredients") or []
        if isinstance(ings, str):
            ings = [x for x in ings.split("|") if x]
        if ings:
            continue                      # already has ingredients
        if str(pid) in patches:
            continue                      # already attempted
        u = urls.get(str(pid))
        if u:
            pending.append((str(pid), p.get("name", ""), u))

    if args.limit:
        pending = pending[:args.limit]
    print(f"Watsons ingredient recovery: {len(pending)} products "
          f"(of {sum(1 for p in products.values() if not (p.get('ingredients') or []))} missing ingredients)")
    if not pending:
        print("Nothing to do.")
        return 0

    from playwright.sync_api import sync_playwright
    found = empty = fail = 0
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=args.headless,
                               args=["--disable-blink-features=AutomationControlled",
                                     "--no-first-run", "--disable-infobars"])
        ctx = b.new_context(locale="th-TH", user_agent=config.USER_AGENT,
                            viewport={"width": 1366, "height": 768})
        ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = ctx.new_page()
        for i, (pid, name, url) in enumerate(pending, 1):
            if STOP_FILE.exists():
                log.info("STOP_WATSONS_ING seen — stopping")
                break
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(4000)
                for _ in range(4):
                    page.mouse.wheel(0, 3000)
                    page.wait_for_timeout(1000)
                toks = extract_from_html(page.content())
                if toks:
                    patches[pid] = toks
                    found += 1
                    print(f"  [{i}/{len(pending)}] {pid} {name[:38]:<38} → {len(toks)} ingredients")
                else:
                    # Record the attempt so reruns skip it, same as the Konvy
                    # backfill — but only because we verified the page loaded.
                    patches[pid] = []
                    empty += 1
                    print(f"  [{i}/{len(pending)}] {pid} {name[:38]:<38} → none on page")
                _save_patches(patches)
                time.sleep(1.5)
            except KeyboardInterrupt:
                break
            except Exception as e:
                fail += 1
                log.error(f"{pid}: {type(e).__name__}: {str(e)[:80]}")
        b.close()

    print(f"\nDone. recovered={found} none={empty} failed={fail}")
    print("Run `python -m cosmetics.build_master_db` to apply.")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
