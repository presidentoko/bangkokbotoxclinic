"""SUPERSEDED — do not run. Use petfood/lazada_prices.py instead.

This scraper cannot produce correct prices: it takes min() of the first five
results of a price-ascending search with no check that any of them are the
product being priced (the cheapest hit is a sample sachet or a food scoop),
its price regex matches review and sold counts as readily as prices, it
divides by a weight_kg that is 1.0 on all 986 records, and it writes to a
petfood.json the website does not read. Kept only for its VPN worker pattern.

Shopee 최저가 스크래퍼 — VPN SOCKS5 프록시로 병렬 실행
각 워커가 foods 서브셋을 담당, Shopee 검색에서 최저가 추출

사전 조건: nordvpn_runner.py 로 N개 터널 기동
    python nordvpn_runner.py --ports 10 --base-port 2080 --auth /path/to/auth

Run:
    python -m petfood.shopee_prices             # 기본 10 워커
    python -m petfood.shopee_prices --workers 5  # 워커 수 지정
    python -m petfood.shopee_prices --no-vpn    # VPN 없이 (테스트용)
"""
from __future__ import annotations

raise SystemExit(
    "petfood/shopee_prices.py is superseded and would refill the catalogue "
    "with fabricated prices. Use: python -m petfood.lazada_prices"
)
import argparse
import json
import math
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from playwright.sync_api import sync_playwright, Browser

ROOT = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"
SHOPEE_BASE = "https://shopee.co.th"


def _search_query(food: dict) -> str:
    brand = food.get("brand", "")
    name = food.get("name_en") or food.get("name_th") or ""
    # Extract English model name from parentheses e.g. "อาหาร (MAXI ADULT)"
    m = re.search(r"\(([A-Z][A-Z0-9 ]+)\)", name)
    model = m.group(1) if m else ""
    if model:
        return f"{brand} {model}".strip()
    # Use name_en as-is or trim long Thai names
    short = name[:40].split("(")[0].strip()
    return f"{brand} {short}".strip()


def _extract_price_thb(page, query: str) -> tuple[float, str]:
    """Search Shopee and return (lowest_price_thb, product_url)."""
    search_url = f"{SHOPEE_BASE}/search?keyword={query}&sortBy=price&order=asc"
    try:
        page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        # Wait for product cards
        page.wait_for_selector('[data-sqe="item"]', timeout=15000)
        time.sleep(2)

        # Extract prices — Shopee price format: "฿XXX" or "XXX"
        prices: list[float] = []
        product_url = ""

        # Try to get first few product cards
        cards = page.query_selector_all('[data-sqe="item"]')[:5]
        for card in cards:
            try:
                text = card.inner_text()
                # Find price pattern ฿NNN or NNN.NN
                matches = re.findall(r"฿?\s*(\d{2,6}(?:\.\d{2})?)", text)
                for p in matches:
                    v = float(p)
                    if 10 <= v <= 10000:  # reasonable pet food price range
                        prices.append(v)
                        break
                if not product_url:
                    a = card.query_selector("a[href]")
                    if a:
                        product_url = SHOPEE_BASE + a.get_attribute("href").split("?")[0]
            except Exception:
                continue

        if prices:
            return min(prices), product_url
    except Exception as e:
        print(f"    shopee search error '{query}': {e}")

    return 0.0, ""


def _worker(
    foods_subset: list[dict],
    worker_id: int,
    proxy_port: int | None,
    results: dict,
) -> None:
    """Process a subset of foods in one browser session."""
    proxy = {"server": f"socks5://127.0.0.1:{proxy_port}"} if proxy_port else None

    with sync_playwright() as pw:
        browser: Browser = pw.chromium.launch(
            headless=True,
            slow_mo=200,
            proxy=proxy,  # type: ignore[arg-type]
        )
        ctx = browser.new_context(
            locale="th-TH",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = ctx.new_page()

        for food in foods_subset:
            query = _search_query(food)
            print(f"  [W{worker_id}] {query[:50]}")
            price, url = _extract_price_thb(page, query)
            if price > 0:
                weight = food.get("weight_kg", 1.0) or 1.0
                price_per_kg = round(price / weight, 1) if weight > 0 else 0.0
                results[food["id"]] = {
                    "price_thb": price,
                    "price_per_kg": price_per_kg,
                    "buy_url": url or food.get("buy_url", ""),
                }
                print(f"    ✓ ฿{price:.0f} ({weight}kg → ฿{price_per_kg:.0f}/kg)")
            else:
                print(f"    ✗ price not found")
            time.sleep(1.5)

        browser.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument("--base-port", type=int, default=2080)
    parser.add_argument("--no-vpn", action="store_true")
    parser.add_argument("--food-ids", nargs="*", help="specific food IDs to update")
    args = parser.parse_args()

    with open(OUTPUT, encoding="utf-8") as f:
        foods: list[dict] = json.load(f)

    # Filter target foods
    if args.food_ids:
        targets = [f for f in foods if f["id"] in args.food_ids]
    else:
        # Prioritise foods with price = 0
        targets = [f for f in foods if f.get("price_thb", 0) == 0]

    print(f"Target foods: {len(targets)} (0-price)")
    if not targets:
        print("All foods already have prices.")
        return

    n_workers = min(args.workers, len(targets))
    chunk_size = math.ceil(len(targets) / n_workers)
    chunks = [targets[i:i+chunk_size] for i in range(0, len(targets), chunk_size)]

    results: dict[str, dict] = {}

    if args.no_vpn:
        # Single-threaded, no proxy
        print("Running without VPN (single worker)")
        _worker(targets, 0, None, results)
    else:
        print(f"Launching {len(chunks)} workers on ports {args.base_port}–{args.base_port+len(chunks)-1}")
        with ThreadPoolExecutor(max_workers=n_workers) as pool:
            futures = {
                pool.submit(_worker, chunk, i, args.base_port + i, results): i
                for i, chunk in enumerate(chunks)
            }
            for fut in as_completed(futures):
                i = futures[fut]
                try:
                    fut.result()
                except Exception as e:
                    print(f"  Worker {i} crashed: {e}")

    # Update foods with new prices
    updated = 0
    for food in foods:
        if food["id"] in results:
            food.update(results[food["id"]])
            updated += 1

    OUTPUT.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n✓ Updated prices for {updated}/{len(targets)} foods → {OUTPUT}")


if __name__ == "__main__":
    main()
