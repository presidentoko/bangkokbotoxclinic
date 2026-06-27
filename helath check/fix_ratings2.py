"""Clean up duplicate/wrong ratings, re-scrape major hospitals with better logic."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# Fix duplicated counts (bug: same review_count across different hospitals)
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Find duplicate review_counts (bug indicator)
    cur.execute("""SELECT review_count, COUNT(*) n FROM hospitals
                   WHERE review_count IS NOT NULL GROUP BY review_count HAVING n > 1""")
    dup_counts = [r['review_count'] for r in cur.fetchall()]
    print(f"Duplicate counts (bug): {dup_counts}")
    if dup_counts:
        placeholders = ','.join(['%s'] * len(dup_counts))
        cur.execute(f"UPDATE hospitals SET rating=NULL, review_count=NULL WHERE review_count IN ({placeholders})", dup_counts)
        print(f"Cleared {cur.rowcount} rows with duplicate counts")

    # Also clear Bumrungrad's wrong data (3.9 is not correct)
    cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE slug='bumrungrad'")
    print(f"Cleared Bumrungrad: {cur.rowcount}")

    cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
    r = cur.fetchone()
    print(f"After cleanup: {r['n']} hospitals, {r['nr']} with ratings")

conn.close()


# Now re-scrape major hospitals with better targeting
MAJOR_HOSPITALS = [
    ('bumrungrad', 'Bumrungrad International Hospital Bangkok'),
    ('vejthani', 'Vejthani Hospital Bangkok'),
    ('bangkok-hospital', 'Bangkok Hospital Sukhumvit Bangkok'),
    ('praram9', 'Praram 9 Hospital Bangkok'),
    ('bnh', 'BNH Hospital Bangkok'),
    ('phyathai-2', 'Phyathai 2 Hospital Bangkok'),
    ('samitivej-srinakarin', 'Samitivej Srinakarin Hospital Bangkok'),
    ('samitivej-sukhumvit', 'Samitivej Sukhumvit Hospital Bangkok'),
    ('samitivej-nawamin', 'Samitivej Nawamin Hospital Bangkok'),
    ('paolo-kaset', 'Paolo Hospital Kaset Bangkok'),
    ('paolo-rangsit', 'Paolo Hospital Rangsit Pathum Thani'),
]

async def get_rating_targeted(page, slug, query):
    """Better targeted scraping: search and find matching result."""
    url = f'https://www.google.com/maps/search/{query.replace(" ", "+")}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        html = await page.content()

        # Method 1: Look for rating+review count pattern with reasonable count (50-100k)
        # Pattern: aria-label="X.X ดาว Y,YYY รีวิว"
        matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
        for rating_str, count_str in matches:
            count = int(count_str.replace(',', ''))
            if 50 < count < 100000:
                return float(rating_str), count

        # Method 2: Just get the star rating from the first visible F7nice element
        # and look for review count separately
        rating_el = await page.query_selector('.F7nice span[aria-hidden="true"]')
        if rating_el:
            rating_text = await rating_el.inner_text()
            m = re.search(r'([\d.]+)', rating_text)
            if m:
                rating = float(m.group(1))
                if 1.0 <= rating <= 5.0:
                    # Find review count
                    count_m = re.search(r'([\d,]+)\s*รีวิว', html)
                    if count_m:
                        count = int(count_m.group(1).replace(',', ''))
                        if 50 < count < 100000:
                            return rating, count
                    return rating, 0

        return None, None
    except Exception as e:
        print(f'    Error: {e}')
        return None, None

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--lang=th-TH'])
        context = await browser.new_context(locale='th-TH', timezone_id='Asia/Bangkok')
        page = await context.new_page()

        print(f'\nRe-scraping {len(MAJOR_HOSPITALS)} major hospitals...\n')
        for slug, query in MAJOR_HOSPITALS:
            print(f'  {slug}: {query}')
            rating, count = await get_rating_targeted(page, slug, query)
            if rating:
                with conn.cursor() as cur:
                    cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s", (rating, count, slug))
                print(f'    ★{rating} ({count:,})')
            else:
                print(f'    No rating')
            await asyncio.sleep(1.5)

        await browser.close()

    with conn.cursor() as cur:
        cur.execute("""SELECT name, rating, review_count FROM hospitals
                       WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 20""")
        print('\n=== Final top ratings ===')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:40]}')

        cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
        r = cur.fetchone()
        print(f'\nTotal: {r["n"]} hospitals, {r["nr"]} with ratings')

    conn.close()

asyncio.run(main())
