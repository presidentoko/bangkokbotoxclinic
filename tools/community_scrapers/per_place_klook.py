"""Per-place Klook product DEEP scrape.

For each place that bookable_verify already flagged as having Klook products
(per_place_bookable.json, klook.has_products=true), open the Klook search URL
and extract the TOP product card's: title, price (THB), photo URL, rating,
review count, product URL.

This lets the place page render "From ฿1,200 on Klook" — a powerful
conversion signal vs. the generic "⚡ Bookable" badge we have now.

Output: siamverified-portable/public/data/per_place_klook.json
Schema: { "<place_id>": {
    "search_url": "...",
    "products": [ { title, price_thb, currency, photo_url, rating,
                    review_count, product_url, position }, ... ],
    "scraped_at": "..."
} }

Resume-safe: places already in the output file are skipped.
"""
from __future__ import annotations

import argparse
import json
import logging
import random
import re
import time

from playwright.sync_api import sync_playwright, Page, TimeoutError as PWTimeout

from . import common

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("per_place_klook")

PLACES_JSON = common.REPO_ROOT / "siamverified-portable" / "public" / "data" / "places.json"
BOOKABLE = common.REPO_ROOT / "siamverified-portable" / "public" / "data" / "per_place_bookable.json"
OUTPUT = common.REPO_ROOT / "siamverified-portable" / "public" / "data" / "per_place_klook.json"

CHECKPOINT_EVERY = 15
PAGE_TIMEOUT_MS = 22_000
MAX_PRODUCTS = 3

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def load_places() -> list[dict]:
    if not PLACES_JSON.exists():
        return []
    return json.loads(PLACES_JSON.read_text(encoding="utf-8")).get("places", [])


def load_bookable() -> dict[str, dict]:
    if not BOOKABLE.exists():
        return {}
    try:
        return json.loads(BOOKABLE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def load_existing() -> dict[str, dict]:
    if not OUTPUT.exists():
        return {}
    try:
        return json.loads(OUTPUT.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save(data: dict[str, dict]) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUTPUT.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    tmp.replace(OUTPUT)


# Klook search page renders product cards as <a href="/activity/{id}-{slug}">
# wrapping the price/title/photo. We grab DOM via locator and extract from
# the anchor + descendants.
CARD_SELECTOR = 'a[href*="/activity/"]'
PRICE_RE = re.compile(r"([\d,]+)")


def extract_products(page: Page, max_n: int = MAX_PRODUCTS) -> list[dict]:
    cards = page.locator(CARD_SELECTOR)
    n = min(cards.count(), 12)  # process up to 12 to find max_n unique products
    seen_urls: set[str] = set()
    products: list[dict] = []
    for i in range(n):
        if len(products) >= max_n:
            break
        try:
            card = cards.nth(i)
            href = card.get_attribute("href") or ""
            if not href or "/activity/" not in href:
                continue
            if href.startswith("/"):
                product_url = f"https://www.klook.com{href}"
            else:
                product_url = href
            # Dedup by activity id
            m = re.search(r"/activity/(\d+)", product_url)
            if not m:
                continue
            act_id = m.group(1)
            if act_id in seen_urls:
                continue
            seen_urls.add(act_id)

            # Inner text often holds title + price + rating in jumbled order;
            # we then split on lines and pattern-match.
            try:
                inner = card.inner_text(timeout=2000).strip()
            except Exception:
                inner = ""

            # Title — prefer URL slug (stable, descriptive), fall back to
            # inner text. The visible card text is mostly category labels
            # ("Sightseeing cruises • Bangkok") rather than the real title,
            # so the slug is actually more useful.
            title = ""
            slug_m = re.search(r"/activity/\d+-([\w\-]+?)(?:/|$|\?)", product_url)
            if slug_m:
                slug = slug_m.group(1).replace("-", " ").strip()
                # Title-case while preserving small words
                title = re.sub(r"\b(\w)", lambda m: m.group(1).upper(), slug)[:200]
            if not title:
                for line in inner.split("\n"):
                    line = line.strip()
                    if not line:
                        continue
                    low = line.lower()
                    if any(t in low for t in ("฿", "thb", "★", "from", "%", "off")):
                        continue
                    if line in ("Free Cancellation", "Instant Confirmation"):
                        continue
                    if len(line) < 5:
                        continue
                    title = line[:200]
                    break

            # Price — first number after a ฿ or "THB" cue
            price_thb = None
            currency = "THB"
            for m2 in re.finditer(r"(?:฿|THB)\s*([\d,]+)", inner):
                try:
                    price_thb = int(m2.group(1).replace(",", ""))
                    break
                except ValueError:
                    pass

            # Rating like "4.7" and review count "(123)"
            rating = None
            review_count = None
            m3 = re.search(r"(\d\.\d)\s*\(?\s*([\d,]+)\)?", inner)
            if m3:
                try:
                    rating = float(m3.group(1))
                    review_count = int(m3.group(2).replace(",", ""))
                except ValueError:
                    pass

            # Photo — first <img> descendant's src
            photo_url = ""
            try:
                img = card.locator("img").first
                photo_url = (img.get_attribute("src") or
                             img.get_attribute("data-src") or "")
            except Exception:
                pass

            if not title and not price_thb:
                continue

            products.append({
                "title": title,
                "price_thb": price_thb,
                "currency": currency,
                "photo_url": photo_url,
                "rating": rating,
                "review_count": review_count,
                "product_url": product_url,
                "position": i + 1,
            })
        except Exception as e:
            log.debug(f"  card[{i}] extract fail: {type(e).__name__}: {e}")
            continue
    return products


def scrape_url(page: Page, url: str) -> list[dict]:
    try:
        page.goto(url, timeout=PAGE_TIMEOUT_MS, wait_until="domcontentloaded")
    except PWTimeout:
        log.warning(f"  timeout loading {url[:90]}")
        return []
    except Exception as e:
        log.warning(f"  goto failed: {type(e).__name__}: {str(e)[:80]}")
        return []
    # JS hydration
    page.wait_for_timeout(2500)
    try:
        # Klook lazy-loads; tiny scroll to trigger more cards
        page.mouse.wheel(0, 600)
        page.wait_for_timeout(800)
    except Exception:
        pass
    return extract_products(page)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--niche", default="")
    ap.add_argument("--delay-min", type=float, default=4.0)
    ap.add_argument("--delay-max", type=float, default=8.0)
    args = ap.parse_args()

    places = load_places()
    bookable = load_bookable()
    if args.niche:
        places = [p for p in places if p.get("niche") == args.niche]

    # Only places with bookable.klook.has_products=true AND a search URL
    eligible: list[tuple[dict, str]] = []
    for p in places:
        pid = p.get("id")
        if not pid:
            continue
        b = bookable.get(pid) or {}
        k = b.get("klook") or {}
        if k.get("has_products") and k.get("url"):
            eligible.append((p, k["url"]))

    existing = load_existing()
    pending = [(p, u) for (p, u) in eligible if p["id"] not in existing]
    if args.limit:
        pending = pending[: args.limit]
    log.info(f"klook deep: {len(pending)} pending / {len(eligible)} eligible "
             f"/ {len(places)} total places")

    out = dict(existing)
    written = 0
    with_products = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled",
                  "--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1366, "height": 850},
            locale="en-US",
            extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
        )
        context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});",
        )
        page = context.new_page()
        # Block heavy media to speed up (but keep images — we need photo URLs)
        page.route("**/*.{woff,woff2,mp4,webm}", lambda r: r.abort())

        for i, (place, klook_url) in enumerate(pending, 1):
            pid = place["id"]
            label = f"[{place.get('niche')}] {place.get('name','?')[:48]}"
            log.info(f"({i}/{len(pending)}) {label}")
            products = scrape_url(page, klook_url)
            out[pid] = {
                "search_url": klook_url,
                "products": products,
                "scraped_at": common.now_iso(),
            }
            written += 1
            if products:
                with_products += 1
                top = products[0]
                log.info(f"  ✓ {len(products)} products · top: "
                         f"{top.get('title','')[:50]} · "
                         f"฿{top.get('price_thb') or '?'} · "
                         f"⭐{top.get('rating') or '?'}")
            else:
                log.info("  ✗ no products extracted")

            if written % CHECKPOINT_EVERY == 0:
                save(out)
                log.info(f"  [checkpoint] {len(out)} entries · "
                         f"with_products {with_products}/{written}")

            time.sleep(random.uniform(args.delay_min, args.delay_max))

        browser.close()

    save(out)
    log.info(f"DONE — {len(out)} entries · with_products {with_products} "
             f"→ {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
