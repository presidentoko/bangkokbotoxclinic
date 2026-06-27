"""Scrape Google Maps ratings using correct aria-label pattern."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

async def get_rating(page, name, slug):
    query = f'{name} Bangkok hospital'
    url = f'https://www.google.com/maps/search/{query.replace(" ", "+")}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Try to click on the first hospital result
        try:
            # Click on the first result item
            first_result = page.locator('a[href*="/maps/place/"]').first
            href = await first_result.get_attribute('href')
            if href and '/maps/place/' in href:
                await page.goto(href, wait_until='domcontentloaded', timeout=15000)
                await page.wait_for_timeout(2500)
        except Exception:
            pass  # Stay on search results page

        html = await page.content()

        # Key pattern: aria-label="4.2 ดาว 2,087 รีวิว"
        # Thai: ดาว = stars, รีวิว = reviews
        # Find ALL occurrences and pick the one with review count > 50
        matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
        for rating_str, count_str in matches:
            rating = float(rating_str)
            count = int(count_str.replace(',', ''))
            if 1.0 <= rating <= 5.0 and count > 50:
                return rating, count

        # English fallback
        matches = re.findall(r'aria-label="([\d.]+)\s*stars?\s*([\d,]+)\s*reviews?"', html, re.IGNORECASE)
        for rating_str, count_str in matches:
            rating = float(rating_str)
            count = int(count_str.replace(',', ''))
            if 1.0 <= rating <= 5.0 and count > 50:
                return rating, count

        # Pattern without review count (just stars)
        m = re.search(r'aria-label="([\d.]+)\s*ดาว\s*"', html)
        if m:
            rating = float(m.group(1))
            if 1.0 <= rating <= 5.0:
                # Try to find review count separately
                count_m = re.search(r'([\d,]+)\s*รีวิว', html)
                count = int(count_m.group(1).replace(',','')) if count_m else 0
                return rating, count

        return None, None
    except Exception as e:
        print(f'    Error: {e}')
        return None, None


async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        # Get all hospitals needing ratings, prioritize by package count
        cur.execute("""SELECT h.slug, h.name,
                          COUNT(p.id) pkg_count
                       FROM hospitals h
                       LEFT JOIN checkup_packages p ON p.hospital_id = h.id
                       WHERE h.rating IS NULL
                       GROUP BY h.id
                       ORDER BY pkg_count DESC""")
        hospitals = cur.fetchall()

    print(f'Scraping {len(hospitals)} hospitals...\n')

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--lang=th-TH'])
        context = await browser.new_context(locale='th-TH', timezone_id='Asia/Bangkok')
        page = await context.new_page()

        success = 0
        for h in hospitals:
            slug = h['slug']
            name = h['name']
            print(f'  [{success}/{len(hospitals)}] {name[:40]}')

            rating, count = await get_rating(page, name, slug)
            if rating:
                with conn.cursor() as cur:
                    cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s", (rating, count, slug))
                print(f'    ★{rating} ({count:,})')
                success += 1
            else:
                print(f'    -')
            await asyncio.sleep(1.0)

        await browser.close()

    print(f'\nDone! {success}/{len(hospitals)} hospitals rated')

    with conn.cursor() as cur:
        cur.execute("""SELECT name, rating, review_count
                       FROM hospitals WHERE rating IS NOT NULL
                       ORDER BY review_count DESC LIMIT 20""")
        print('\nTop by review count:')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:45]}')

        cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
        r = cur.fetchone()
        print(f'\nTotal: {r["n"]} hospitals, {r["nr"]} with ratings')

    conn.close()

asyncio.run(main())
