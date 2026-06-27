"""Scrape hospital ratings from Google Maps using Playwright."""
import re, json, time, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# Hospital name → search query mapping
# Using major hospitals first to test
TEST_HOSPITALS = [
    ('bumrungrad', 'Bumrungrad International Hospital Bangkok'),
    ('vejthani', 'Vejthani Hospital Bangkok'),
    ('samitivej-srinakarin', 'Samitivej Hospital Srinakarin Bangkok'),
    ('bnh', 'BNH Hospital Bangkok'),
    ('phyathai-2', 'Phyathai 2 Hospital Bangkok'),
    ('praram9', 'Praram 9 Hospital Bangkok'),
    ('bangkok-hospital', 'Bangkok Hospital BDMS Bangkok'),
    ('phyathai-1', 'Phyathai 1 Hospital Bangkok'),
    ('sikarin', 'Sikarin Hospital Bangkok'),
    ('samitivej-sukhumvit', 'Samitivej Hospital Sukhumvit Bangkok'),
    ('samitivej-nawamin', 'Samitivej Hospital Nawamin Bangkok'),
    ('paolo-kaset', 'Paolo Hospital Kaset Bangkok'),
]

async def get_gmaps_rating(page, slug, query):
    """Search Google Maps and extract rating."""
    url = f'https://www.google.com/maps/search/{query.replace(" ", "+")}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Look for rating in the page
        html = await page.content()

        # Method 1: JSON in page source
        # Google Maps embeds rating like: "4.3","(2,341)"
        rating_m = re.search(r'"([\d.]+)","(\([\d,]+\))"', html)
        if rating_m:
            rating = float(rating_m.group(1))
            count_str = rating_m.group(2).strip('()')
            count = int(count_str.replace(',', ''))
            if 1.0 <= rating <= 5.0 and count > 0:
                return rating, count

        # Method 2: aria-label patterns
        m = re.search(r'aria-label="([\d.]+) stars ([\d,]+) reviews"', html)
        if m:
            return float(m.group(1)), int(m.group(2).replace(',', ''))

        # Method 3: Try to get text from rating element
        try:
            rating_el = await page.wait_for_selector('[aria-label*="star"], [class*="rating"]', timeout=3000)
            if rating_el:
                label = await rating_el.get_attribute('aria-label')
                if label:
                    m = re.search(r'([\d.]+)\s*star', label)
                    if m:
                        rating = float(m.group(1))
                        # Try to find count nearby
                        count_m = re.search(r'([\d,]+)\s*review', html, re.IGNORECASE)
                        count = int(count_m.group(1).replace(',', '')) if count_m else 0
                        return rating, count
        except Exception:
            pass

        # Method 4: Look for F1ls specific Google Maps rating pattern
        # Maps uses specific class structure
        patterns = [
            r'(\d\.\d)\s*\((\d[\d,]*)\)',  # 4.3 (2,341)
            r'"(\d\.\d)"[^}]*"([\d,]+)"[^}]*(?:review|rating)',
            r'(\d\.\d)分\s*([\d,]+)個',  # Chinese variant
        ]
        for pat in patterns:
            m = re.search(pat, html)
            if m:
                try:
                    rating = float(m.group(1))
                    count = int(m.group(2).replace(',', ''))
                    if 1.0 <= rating <= 5.0:
                        return rating, count
                except Exception:
                    pass

        # Last resort: Take screenshot and log what we got
        print(f'  Could not extract rating for {slug}, HTML length: {len(html)}')
        # Save sample for debugging
        with open(f'cache/gmaps_{slug}.html', 'w', encoding='utf-8') as f:
            f.write(html[:20000])
        return None, None

    except Exception as e:
        print(f'  Error for {slug}: {e}')
        return None, None


async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    # Add rating columns if they don't exist
    with conn.cursor() as cur:
        try:
            cur.execute("ALTER TABLE hospitals ADD COLUMN rating DECIMAL(3,1) DEFAULT NULL")
            cur.execute("ALTER TABLE hospitals ADD COLUMN review_count INT DEFAULT NULL")
            print("Added rating and review_count columns")
        except Exception:
            print("Columns already exist")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            locale='en-US',
        )
        page = await context.new_page()

        print(f'Scraping ratings for {len(TEST_HOSPITALS)} hospitals...\n')

        for slug, query in TEST_HOSPITALS:
            print(f'  {slug}: {query}')
            rating, count = await get_gmaps_rating(page, slug, query)
            if rating:
                with conn.cursor() as cur:
                    cur.execute(
                        "UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s",
                        (rating, count, slug)
                    )
                print(f'    ★ {rating} ({count:,} reviews) ✓')
            else:
                print(f'    No rating found')
            await asyncio.sleep(1.5)

        await browser.close()

    # Show results
    with conn.cursor() as cur:
        cur.execute("SELECT name, rating, review_count FROM hospitals WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 15")
        print('\n=== Results ===')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"]}')

    conn.close()

asyncio.run(main())
