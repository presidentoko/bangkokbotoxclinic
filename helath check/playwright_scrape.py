"""
playwright_scrape.py — Re-scrape hospital checkup pages with full JS rendering,
extract prices, update DB.
"""
import re, time, pymysql
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from config import DB_CONFIG

PRICE_RE = re.compile(r'(?:฿|THB|Baht)\s*([\d,]+)|(?<!\d)([\d]{1,3},[\d]{3})(?!\d)\s*(?:บาท|baht|thb)?', re.IGNORECASE)

TARGETS = [
    ('phyathai-1',        'https://www.phyathai.com/en/pyt1/center/pyt1-center-28'),
    ('phyathai-2',        'https://www.phyathai.com/en/pyt2/package'),
    ('bangpakok9',        'https://bpk9internationalhospital.com/en/package/content/Health_Check-Up_Programs'),
    ('vibhavadi',         'https://www.vibhavadi.com/en/health-checkup'),
    ('medpark',           'https://www.medparkhospital.com/en-US/center-and-specialty/health-screening-center'),
    ('samitivej-sukhumvit','https://www.samitivejhospitals.com/page/checkup-package'),
    ('thonburi',          'https://www.thonburihospital.com/en/package/pk_health_check/'),
]

# Pattern to find price lines: name + price on same/adjacent line
LINE_PRICE_RE = re.compile(
    r'(.{10,80}?)\s*(?:฿|THB)\s*([\d,]+)', re.IGNORECASE | re.MULTILINE
)

def extract_packages_from_text(text: str, hosp_slug: str) -> list[dict]:
    """Try to extract package name+price pairs from page text."""
    results = []
    seen = set()

    # Method 1: lines containing both a price and a name
    for m in LINE_PRICE_RE.finditer(text):
        name = m.group(1).strip()
        price_str = m.group(2).replace(',', '')
        try:
            price = int(price_str)
        except ValueError:
            continue
        if not (500 <= price <= 300_000):
            continue
        # Clean name
        name = re.sub(r'\s+', ' ', name).strip()
        name = re.sub(r'^[\d\.\s\-]+', '', name).strip()
        if len(name) < 5 or name in seen:
            continue
        seen.add(name)
        results.append({'name': name, 'price': price})

    # Method 2: price-only list (match line number to price)
    if not results:
        prices = []
        for m in re.finditer(r'(?:฿|THB)\s*([\d,]+)', text, re.IGNORECASE):
            p = int(m.group(1).replace(',', ''))
            if 500 <= p <= 300_000:
                prices.append(p)

        # Just return prices we found (we'll need to match to existing pkg names)
        if prices:
            results = [{'name': None, 'price': p} for p in sorted(set(prices))]

    return results


def update_null_prices(conn, hosp_slug: str, prices: list[int]) -> int:
    """Fill null prices for this hospital in order (cheapest to most expensive)."""
    if not prices:
        return 0
    prices_sorted = sorted(set(prices))
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, name FROM checkup_packages
            WHERE hospital_id=(SELECT id FROM hospitals WHERE slug=%s)
            AND price IS NULL
            ORDER BY id
        """, (hosp_slug,))
        rows = cur.fetchall()

    updated = 0
    with conn.cursor() as cur:
        for i, row in enumerate(rows):
            if i < len(prices_sorted):
                cur.execute(
                    "UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL",
                    (prices_sorted[i], row['id'])
                )
                if cur.rowcount:
                    updated += 1
                    print(f"    updated {row['name'][:50]} → ฿{prices_sorted[i]:,}")
    return updated


def insert_named_packages(conn, hosp_slug: str, packages: list[dict]) -> int:
    """Insert packages that have both name and price."""
    from hdmall_scrape import get_or_create_hospital, insert_packages, guess_category, parse_inclusions
    # Reuse logic
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (hosp_slug,))
        row = cur.fetchone()
        if not row:
            return 0
        hosp_id = row['id']

    inserted = 0
    with conn.cursor() as cur:
        for pkg in packages:
            if not pkg.get('name'):
                continue
            cur.execute(
                "SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s",
                (hosp_id, pkg['name'])
            )
            if cur.fetchone():
                continue
            cat = guess_category(pkg['name'])
            incl = parse_inclusions(pkg['name'])
            cur.execute("""
                INSERT INTO checkup_packages
                  (hospital_id, name, category, price, currency,
                   has_blood, has_xray, has_ultrasound, has_ct, has_mri,
                   has_ecg, has_treadmill, has_cancer_marker,
                   has_doctor_consult, has_interpreter, results_days, source_url, scraped_at)
                VALUES (%s,%s,%s,%s,'THB',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1,%s,NOW())
            """, (
                hosp_id, pkg['name'], cat, pkg['price'],
                incl['has_blood'], incl['has_xray'], incl['has_ultrasound'],
                incl['has_ct'], incl['has_mri'], incl['has_ecg'], incl['has_treadmill'],
                incl['has_cancer_marker'], incl['has_doctor_consult'], incl['has_interpreter'],
                'playwright-scraped'
            ))
            inserted += 1
            print(f"    inserted: {pkg['name'][:60]} ฿{pkg['price']:,}")
    return inserted


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    total_updated = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
            locale='en-US',
        )
        page = ctx.new_page()

        for slug, url in TARGETS:
            print(f"\n→ {slug}: {url}")
            try:
                page.goto(url, wait_until='networkidle', timeout=30000)
                time.sleep(2)
                text = page.inner_text('body')
            except PWTimeout:
                print(f"  timeout")
                try:
                    text = page.inner_text('body')
                except Exception:
                    continue
            except Exception as e:
                print(f"  error: {e}")
                continue

            # Save raw text for inspection
            from pathlib import Path
            cache = Path(__file__).parent / "cache"
            (cache / f"{slug}_pw.txt").write_text(text, encoding='utf-8')

            pkgs = extract_packages_from_text(text, slug)
            named = [p for p in pkgs if p.get('name')]
            unnamed_prices = [p['price'] for p in pkgs if not p.get('name')]

            print(f"  Found: {len(named)} named packages, {len(unnamed_prices)} raw prices")
            if named:
                print(f"  Sample: {named[0]['name'][:60]} ฿{named[0]['price']:,}")

            if named:
                n = insert_named_packages(conn, slug, named)
                total_updated += n
            elif unnamed_prices:
                n = update_null_prices(conn, slug, unnamed_prices)
                total_updated += n

            time.sleep(1)

        browser.close()

    conn.close()
    print(f"\nTotal updated/inserted: {total_updated}")


if __name__ == '__main__':
    main()
