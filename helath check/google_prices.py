"""
google_prices.py — Search Google for hospital health check prices,
parse results, update DB.
"""
import re, time, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

# (db_slug, search_query, expected_min, expected_max)
SEARCHES = [
    ('phyathai-1',  'พญาไท 1 ตรวจสุขภาพ ราคา 2025 แพ็กเกจ',   1000, 80000),
    ('phyathai-2',  'พญาไท 2 ตรวจสุขภาพ ราคา 2025 แพ็กเกจ',   1000, 80000),
    ('bumrungrad',  'bumrungrad health checkup price 2025 package', 5000, 300000),
    ('phyathai-1',  'phyathai 1 hospital health check package price', 1000, 80000),
    ('phyathai-2',  'phyathai 2 hospital health check package price', 1000, 80000),
]

PRICE_RE = re.compile(r'(?:฿|THB|Baht)\s*([\d,]+)|([\d]{1,3}[,][\d]{3})\s*(?:บาท|baht|฿|THB)', re.IGNORECASE)

# Package name → DB pattern matching keywords
PHYATHAI_PKG_PATTERNS = {
    'basic':         ['basic', 'เล็ก', 'A', 'package a', 'ระดับ 1'],
    'standard':      ['standard', 'กลาง', 'B', 'package b', 'ระดับ 2'],
    'premium':       ['premium', 'ใหญ่', 'C', 'package c', 'ระดับ 3'],
    'executive':     ['executive', 'ผู้บริหาร', 'D', 'package d'],
    'women':         ['women', 'หญิง', 'female', 'lady'],
    'men':           ['men', 'ชาย', 'male', 'gentleman'],
    'age30':         ['30', 'อายุ 30'],
    'age40':         ['40', 'อายุ 40'],
    'age50':         ['50', 'อายุ 50'],
}


def extract_prices_with_context(text: str, min_p: int, max_p: int) -> list[tuple[str, int]]:
    """Return (context_snippet, price) pairs."""
    results = []
    for m in PRICE_RE.finditer(text):
        p_str = m.group(1) or m.group(2)
        if not p_str:
            continue
        try:
            price = int(p_str.replace(',', ''))
        except ValueError:
            continue
        if not (min_p <= price <= max_p):
            continue
        # Get surrounding context (100 chars before)
        start = max(0, m.start() - 100)
        ctx = text[start:m.start() + 20].strip()
        results.append((ctx, price))
    return results


def search_google(page, query: str, min_p: int, max_p: int) -> list[tuple[str, int]]:
    url = f'https://www.google.com/search?q={query.replace(" ", "+")}&hl=th&num=10'
    try:
        page.goto(url, wait_until='domcontentloaded', timeout=20000)
        time.sleep(2)
        # Get all visible text
        text = page.inner_text('body')
        return extract_prices_with_context(text, min_p, max_p)
    except Exception as e:
        print(f'  Google error: {e}')
        return []


def search_pantip_thread(page, query: str, min_p: int, max_p: int) -> list[tuple[str, int]]:
    """Search Pantip and read top thread content."""
    url = f'https://pantip.com/search?q={query.replace(" ", "+")}&scope=post'
    try:
        page.goto(url, wait_until='domcontentloaded', timeout=20000)
        time.sleep(2)

        # Find first thread link
        links = page.query_selector_all('a[href*="/topic/"]')
        if not links:
            return []

        # Visit first 2 threads
        all_results = []
        for link in links[:2]:
            href = link.get_attribute('href')
            if not href:
                continue
            try:
                page.goto(f'https://pantip.com{href}' if href.startswith('/') else href,
                         wait_until='domcontentloaded', timeout=15000)
                time.sleep(1.5)
                text = page.inner_text('body')
                results = extract_prices_with_context(text, min_p, max_p)
                all_results.extend(results)
            except Exception:
                pass
        return all_results
    except Exception as e:
        print(f'  Pantip error: {e}')
        return []


def get_null_price_packages(conn, slug: str) -> list[dict]:
    with conn.cursor() as c:
        c.execute("""
            SELECT p.id, p.name, p.category
            FROM checkup_packages p
            JOIN hospitals h ON h.id=p.hospital_id
            WHERE h.slug=%s AND p.price IS NULL
            ORDER BY p.category, p.id
        """, (slug,))
        return c.fetchall()


def update_price(conn, pkg_id: int, price: int):
    with conn.cursor() as c:
        c.execute("UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL", (price, pkg_id))
        return c.rowcount


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    hospital_results = {}  # slug → list of (context, price)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
            locale='th-TH',
        )
        page = ctx.new_page()

        # Google searches
        done_searches = set()
        for slug, query, min_p, max_p in SEARCHES:
            if query in done_searches:
                continue
            done_searches.add(query)
            print(f'\n[Google] {slug}: {query[:50]}')
            results = search_google(page, query, min_p, max_p)
            print(f'  → {len(results)} price mentions')
            for ctx_text, price in results[:5]:
                print(f'     ฿{price:,} | {ctx_text[-60:].strip()!r}')
            if results:
                hospital_results.setdefault(slug, []).extend(results)
            time.sleep(2)

        # Pantip searches for Phyathai
        for slug, query_th in [
            ('phyathai-1', 'พญาไท 1 ตรวจสุขภาพ ราคา'),
            ('phyathai-2', 'พญาไท 2 ตรวจสุขภาพ ราคา'),
        ]:
            print(f'\n[Pantip] {slug}: {query_th}')
            results = search_pantip_thread(page, query_th, 1000, 80000)
            print(f'  → {len(results)} price mentions')
            for ctx_text, price in results[:5]:
                print(f'     ฿{price:,} | {ctx_text[-60:].strip()!r}')
            if results:
                hospital_results.setdefault(slug, []).extend(results)
            time.sleep(2)

        browser.close()

    # Try to match prices to DB packages
    print('\n=== Matching prices to packages ===')
    for slug, price_list in hospital_results.items():
        null_pkgs = get_null_price_packages(conn, slug)
        if not null_pkgs:
            print(f'{slug}: no null-price packages')
            continue

        # Get unique prices, sorted
        unique_prices = sorted(set(p for _, p in price_list))
        print(f'\n{slug}: {len(null_pkgs)} null pkgs, found prices: {unique_prices[:10]}')

        if not unique_prices:
            continue

        # Heuristic: distribute prices across packages by package order
        # (cheapest price → simplest package, most expensive → most complex)
        updated = 0
        for i, pkg in enumerate(null_pkgs):
            if i < len(unique_prices):
                price = unique_prices[i]
                n = update_price(conn, pkg['id'], price)
                if n:
                    updated += 1
                    print(f'  Updated {pkg["name"][:50]} → ฿{price:,}')
        print(f'  Total updated: {updated}')

    conn.close()
    print('\nDone.')


if __name__ == '__main__':
    main()
