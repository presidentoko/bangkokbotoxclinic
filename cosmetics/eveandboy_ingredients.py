"""Recover ingredient lists from EVEANDBOY, keyed by barcode.

Konvy deleted its structured ingredient block, and the 348 products still
missing ingredients are spread across 145 brands (the top ten cover only 26%),
so per-brand official sites are not worth writing parsers for. What is needed is
one multi-brand retailer that publishes INCI lists — and EVEANDBOY does, on an
endpoint keyed by the product's barcode:

    GET https://ecomapi.eveandboy.com/v11/product/{ean}?platform=web
    -> {"status": ..., "data": {..., "ingredients": {"text": "Aqua, Glycerin, ..."}}}

Keying on the barcode removes the matching problem entirely. Name similarity is
what produced Boots' "Biore Micellar Cleansing Water" -> "Biore UV Aqua Rich
Essence" and iHerb's krill-oil-for-La-Roche-Posay; here there is nothing to
guess. master_db carries a 13-digit code for 907 of 1,003 products.

We do NOT call that endpoint ourselves. It is protected by a per-request
signature (`appid` + `timestamp` + `sign`, plus a bearer token), and forging that
would mean reverse-engineering an access control the site deliberately put in
place. Instead this opens the ordinary public product page — which any visitor
can load — and reads the response to the request the site's own app issues.

Conveniently the slug is decorative: /product/{ean}, /product/x-{ean} and the
real /product/eucerin-omega-ato-calming-balm-{ean} all resolve to the same
product, so a URL can be built from the barcode alone.

Results go to state/ingredient_patches.json, which build_master_db already
applies — no pipeline change needed.

Usage:
  python -m cosmetics.eveandboy_ingredients
  python -m cosmetics.eveandboy_ingredients --limit 30
"""
from __future__ import annotations
import argparse, json, logging, re, time
from pathlib import Path

from cosmetics import config

log = logging.getLogger("cosmetics.eveandboy_ingredients")

SITE = "https://www.eveandboy.com"
PRODUCT_URL = SITE + "/product/{ean}"     # slug is decorative; barcode resolves it
API_MARKER = "/v11/product/"              # the call the site's own app makes
PATCH_PATH = config.STATE_DIR / "ingredient_patches.json"
MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"
STOP_FILE = config.STATE_DIR / "STOP_EVEANDBOY"

_SOLVENT_START = re.compile(r"^\s*(aqua|water|eau)\b", re.I)
_MIN_TOKENS = 5


def parse_inci(text: str) -> list[str]:
    """Split an ingredient blob into INCI tokens, or [] if it doesn't look like one."""
    t = re.sub(r"\s+", " ", (text or "").strip())
    if not t or len(t) > 8000:
        return []
    t = re.sub(r"^\s*(ingredients?|ส่วนผสม|ส่วนประกอบ)\s*[:：]\s*", "", t, flags=re.I)
    parts = [p.strip(" .;​") for p in t.split(",")]
    parts = [p for p in parts if 2 <= len(p) <= 80]
    if len(parts) < _MIN_TOKENS or not _SOLVENT_START.match(parts[0]):
        return []
    # Reject prose: INCI tokens are short.
    if sum(1 for p in parts if len(p.split()) > 6) > len(parts) * 0.2:
        return []
    return parts


def _extract(payload: dict) -> list[str]:
    data = (payload or {}).get("data") or {}
    ing = data.get("ingredients")
    text = ""
    if isinstance(ing, dict):
        text = ing.get("text") or ""
    elif isinstance(ing, str):
        text = ing
    return parse_inci(text)


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
    ap.add_argument("--delay", type=float, default=0.8)
    args = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    if not MASTER_DB.exists():
        print("master_db.json 없음")
        return 1
    products = json.loads(MASTER_DB.read_text(encoding="utf-8"))["products"]
    patches = _load_patches()

    pending = []
    for pid, p in products.items():
        ings = p.get("ingredients") or []
        if isinstance(ings, str):
            ings = [x for x in ings.split("|") if x]
        if ings or str(pid) in patches:
            continue
        ean = re.sub(r"\D", "", str(p.get("gtin8") or ""))
        if len(ean) in (12, 13):
            pending.append((str(pid), p.get("name", ""), ean))

    if args.limit:
        pending = pending[:args.limit]
    missing = sum(1 for p in products.values() if not (p.get("ingredients") or []))
    print(f"EVEANDBOY ingredient recovery: {len(pending)} products with a usable barcode "
          f"(of {missing} missing ingredients)")
    if not pending:
        print("Nothing to do.")
        return 0

    from playwright.sync_api import sync_playwright
    found = empty = fail = 0
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=False,
                               args=["--disable-blink-features=AutomationControlled",
                                     "--no-first-run", "--disable-infobars"])
        ctx = b.new_context(locale="th-TH", user_agent=config.USER_AGENT,
                            viewport={"width": 1366, "height": 768})
        ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = ctx.new_page()

        # Collect the product payloads the site's own app fetches.
        captured: list[dict] = []

        def _on_response(r):
            if API_MARKER in r.url and "/meta/" not in r.url and r.status == 200:
                try:
                    captured.append(r.json())
                except Exception:
                    pass

        page.on("response", _on_response)
        # Establish the site session once; every API call then rides on it.
        # Only the origin and its cookies matter here, not a painted page — the
        # homepage pulls enough assets to blow a 60s domcontentloaded wait, so
        # stop at "commit" (navigation committed, response headers applied).
        for attempt in range(3):
            try:
                page.goto(SITE, wait_until="commit", timeout=30000)
                page.wait_for_timeout(5000)
                break
            except Exception as e:
                log.warning(f"세션 설정 재시도 {attempt+1}/3: {str(e)[:60]}")
                if attempt == 2:
                    print("EVEANDBOY 접속 실패 — 종료")
                    b.close()
                    return 1

        for i, (pid, name, ean) in enumerate(pending, 1):
            if STOP_FILE.exists():
                log.info("STOP_EVEANDBOY seen — stopping")
                break
            try:
                captured.clear()
                page.goto(PRODUCT_URL.format(ean=ean), wait_until="domcontentloaded",
                          timeout=45000)
                page.wait_for_timeout(5000)

                toks = []
                for payload in captured:
                    toks = _extract(payload)
                    if toks:
                        break
                if toks:
                    patches[pid] = toks
                    found += 1
                    print(f"  [{i}/{len(pending)}] {pid} {name[:36]:<36} → {len(toks)} ingredients")
                else:
                    # Either this retailer doesn't carry the product or it
                    # publishes no list; record the attempt so reruns skip it.
                    patches[pid] = []
                    empty += 1
                _save_patches(patches)
                if i % 25 == 0:
                    print(f"  [{i}/{len(pending)}] found={found} none={empty} fail={fail}")
                time.sleep(args.delay)
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
