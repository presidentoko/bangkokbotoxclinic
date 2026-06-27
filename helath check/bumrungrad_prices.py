"""
Scrape Bumrungrad individual package pages for prices.
Each package has its own URL with price in text.
"""
import re, time, pymysql
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from config import DB_CONFIG

BASE = "https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages"

# Package slug → actual URL path (derived from the package list page)
PACKAGE_PATHS = [
    "comprehensive-program-male",
    "comprehensive-program-female-under-40",
    "comprehensive-program-female-over-40",
    "comprehensive-program-female-no-mammogram-and-pap",
    "comprehensive-advance-program-male",
    "comprehensive-advance-program-female-under-40",
    "comprehensive-advance-program-female-over-40",
    "comprehensive-vitality-program-male",
    "comprehensive-vitality-program-female-under-40",
    "comprehensive-vitality-program-female-over-40",
    "executive-program-health-check-up-package",
    "executive-program-female-health-check-up-package",
    "executive-program-with-stress-test-health-check-up-package",
    "executive-wellness-program-male",
    "executive-wellness-program-female",
    "holistic-male",
    "holistic-male-without-stress-test",
    "holistic-female",
    "holistic-70-male",
    "holistic-70-female",
    "holistic-80-female",
    "vitality-plus-cancer-genes-male",
    "vitality-plus-cancer-genes-female-under-40",
    "vitality-plus-cancer-genes-female-over-40",
    "vitality-plus-cancer-and-cardio-genes-male",
    "vitality-plus-cancer-and-cardio-genes-female-under-40",
    "vitality-plus-cancer-and-cardio-genes-female-over-40",
    "regular-program",
    "regular-program-female",
]

PRICE_RE = re.compile(r'(?:THB|฿)\s*([\d,]+)|([\d,]{4,})\s*(?:THB|Baht|฿)', re.IGNORECASE)
GUESS_CAT = {
    'executive': 'executive', 'holistic': 'executive',
    'vitality': 'comprehensive', 'comprehensive': 'comprehensive',
    'regular': 'basic', 'advance': 'comprehensive',
    'cancer': 'cancer', 'cardio': 'cardiac', 'cardiac': 'cardiac',
    'female': 'women', 'male': 'men',
}


def guess_category(slug: str) -> str:
    for kw, cat in GUESS_CAT.items():
        if kw in slug:
            return cat
    return 'comprehensive'


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as c:
        c.execute("SELECT id FROM hospitals WHERE slug='bumrungrad'")
        row = c.fetchone()
    if not row:
        print("bumrungrad not in DB")
        conn.close()
        return
    hosp_id = row['id']

    found = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        )
        page = ctx.new_page()

        for path in PACKAGE_PATHS:
            url = f"{BASE}/{path}"
            try:
                page.goto(url, wait_until='networkidle', timeout=20000)
                time.sleep(1)
                text = page.inner_text('body')
            except Exception:
                print(f"  skip {path}")
                continue

            prices = []
            for m in PRICE_RE.finditer(text):
                p_str = m.group(1) or m.group(2)
                try:
                    p = int(p_str.replace(',', ''))
                    if 3000 <= p <= 500_000:
                        prices.append(p)
                except (ValueError, AttributeError):
                    pass

            if prices:
                price = min(prices)  # Take lowest (usually the package price, not add-ons)
                name_words = path.replace('-', ' ').title()
                print(f"  {name_words}: ฿{price:,}")
                found.append({'path': path, 'price': price, 'name': name_words})
            else:
                print(f"  {path}: no price found")
            time.sleep(0.8)

        browser.close()

    # Update DB
    updated = 0
    with conn.cursor() as cur:
        for pkg in found:
            # Try to match by package name similarity in DB
            cur.execute(
                "SELECT id, name FROM checkup_packages WHERE hospital_id=%s AND price IS NULL",
                (hosp_id,)
            )
            null_pkgs = cur.fetchall()
            # Match by slug keywords
            slug_tokens = set(pkg['path'].replace('-', ' ').split())
            best_match = None
            best_score = 0
            for row in null_pkgs:
                db_tokens = set(row['name'].lower().split())
                overlap = len(slug_tokens & db_tokens)
                if overlap > best_score:
                    best_score = overlap
                    best_match = row

            if best_match and best_score >= 2:
                cur.execute(
                    "UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL",
                    (pkg['price'], best_match['id'])
                )
                if cur.rowcount:
                    updated += 1
                    print(f"  UPDATED {best_match['name'][:60]} → ฿{pkg['price']:,}")

    conn.close()
    print(f"\nTotal: {len(found)} prices found, {updated} DB rows updated")


if __name__ == '__main__':
    main()
