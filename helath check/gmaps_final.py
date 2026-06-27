"""Google Maps rating scraper - final version.
Auto-redirect approach: search redirects to detail page, read first star pattern.
"""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG


async def scrape_rating(page, name):
    """Search for hospital, get auto-redirected to detail page, read main rating."""
    query = name.replace(' ', '+') + '+Bangkok'
    url = f'https://www.google.com/maps/search/{query}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Check if redirected to detail page
        current_url = page.url
        if '/maps/place/' not in current_url:
            # Still on search results - try clicking first result
            first = await page.query_selector('a[href*="/maps/place/"]')
            if first:
                await first.click()
                await page.wait_for_timeout(3000)
            else:
                # Might be a list view - look for clickable results
                result = await page.query_selector('.Nv2PK, .hfpxzc, [data-result-index="0"]')
                if result:
                    await result.click()
                    await page.wait_for_timeout(3000)

        html = await page.content()

        # First aria-label match = main hospital rating
        matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
        if matches:
            rating = float(matches[0][0])
            count = int(matches[0][1].replace(',', ''))
            if 1.0 <= rating <= 5.0:
                return rating, count

        return None, None
    except Exception as e:
        return None, None


async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    # Get hospitals without ratings
    with conn.cursor() as cur:
        cur.execute("""SELECT id, name, slug FROM hospitals
                       WHERE rating IS NULL ORDER BY id""")
        hospitals = cur.fetchall()
    print(f'Hospitals needing ratings: {len(hospitals)}')

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=[
            '--disable-blink-features=AutomationControlled',
        ])
        context = await browser.new_context(
            locale='th-TH',
            timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
            viewport={'width': 1280, 'height': 800},
        )
        page = await context.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        updated = 0
        for h in hospitals:
            rating, count = await scrape_rating(page, h['name'])
            if rating:
                with conn.cursor() as cur:
                    cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE id=%s",
                                (rating, count, h['id']))
                print(f'  ★{rating} ({count:,}) {h["name"][:40]}')
                updated += 1
            else:
                print(f'  - {h["name"][:40]}')
            await asyncio.sleep(1.5)

        await browser.close()

    print(f'\nUpdated: {updated}/{len(hospitals)}')

    with conn.cursor() as cur:
        cur.execute("""SELECT name, rating, review_count FROM hospitals
                       WHERE rating IS NOT NULL ORDER BY review_count DESC""")
        print('\n=== All rated hospitals ===')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:40]}')

        cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
        r = cur.fetchone()
        print(f'\nTotal: {r["n"]} hospitals, {r["nr"]} with ratings')

    conn.close()


asyncio.run(main())
