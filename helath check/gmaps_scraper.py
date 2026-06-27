"""Scrape Google Maps ratings for all hospitals."""
import re, json, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

async def get_rating(page, slug, query):
    url = f'https://www.google.com/maps/search/{query.replace(" ", "+")}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2500)

        # Click first result to go to detail page
        try:
            first = await page.wait_for_selector('a[href*="/maps/place/"]', timeout=4000)
            if first:
                href = await first.get_attribute('href')
                await page.goto(href, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(2000)
        except Exception:
            pass  # Stay on search results page

        # Get rating from .F7nice (Google Maps rating class)
        rating = None
        rating_el = await page.query_selector('.F7nice')
        if rating_el:
            rating_text = await rating_el.inner_text()
            m = re.search(r'([\d.]+)', rating_text)
            if m:
                rating = float(m.group(1))

        # Fallback: aria-label
        if not rating:
            el = await page.query_selector('[role="img"][aria-label*="ดาว"]')
            if not el:
                el = await page.query_selector('[aria-label*="star"]')
            if el:
                label = await el.get_attribute('aria-label')
                m = re.search(r'([\d.]+)', label or '')
                if m:
                    rating = float(m.group(1))

        if not rating or not (1.0 <= rating <= 5.0):
            return None, None

        # Get review count
        count = None
        # Look for review count near rating
        html = await page.content()

        # Patterns for review count in Google Maps
        for pat in [
            r'([\d,]+)\s*(?:review|Google review|รีวิว|ความคิดเห็น)',
            r'\(([\d,]+)\)',  # (14,236)
            r'"([\d,]+)"\s*reviews?',
        ]:
            m = re.search(pat, html, re.IGNORECASE)
            if m:
                try:
                    val = int(m.group(1).replace(',', ''))
                    if val > 10:
                        count = val
                        break
                except Exception:
                    pass

        # Try to get count from the page text near the rating
        if not count:
            try:
                count_els = await page.query_selector_all('span[aria-label]')
                for el in count_els:
                    label = await el.get_attribute('aria-label')
                    if label:
                        m = re.search(r'([\d,]+)\s*(?:review|รีวิว)', label, re.IGNORECASE)
                        if m:
                            count = int(m.group(1).replace(',', ''))
                            break
            except Exception:
                pass

        return rating, count or 0

    except Exception as e:
        print(f'    Error: {e}')
        return None, None


async def main():
    # Get all hospitals from DB
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        # Only do major (non-HDmall) hospitals first
        cur.execute("""SELECT h.slug, h.name
                       FROM hospitals h
                       WHERE h.rating IS NULL
                       AND NOT EXISTS (
                           SELECT 1 FROM checkup_packages p
                           WHERE p.hospital_id = h.id AND p.source_url = 'hdmall'
                       )
                       ORDER BY (SELECT COUNT(*) FROM checkup_packages p WHERE p.hospital_id=h.id) DESC
                       LIMIT 50""")
        hospitals = cur.fetchall()

    print(f'Scraping ratings for {len(hospitals)} major hospitals...\n')

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--lang=en-US'])
        context = await browser.new_context(locale='en-US', timezone_id='Asia/Bangkok')
        page = await context.new_page()

        success = 0
        for h in hospitals:
            slug = h['slug']
            name = h['name']
            query = f'{name} Bangkok hospital'
            print(f'  {slug}: {name[:40]}')

            rating, count = await get_rating(page, slug, query)
            if rating:
                with conn.cursor() as cur:
                    cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s", (rating, count, slug))
                print(f'    ★{rating} ({count:,} reviews)')
                success += 1
            else:
                print(f'    No rating')
            await asyncio.sleep(1)

        await browser.close()

    print(f'\nDone! {success}/{len(hospitals)} hospitals rated')
    with conn.cursor() as cur:
        cur.execute("SELECT slug, name, rating, review_count FROM hospitals WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 15")
        print('\nTop rated:')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:40]}')

    conn.close()

asyncio.run(main())
