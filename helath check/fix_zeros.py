"""Fix hospitals with review_count=0 and re-scrape missing ratings."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# Hospitals to fix/re-scrape
TARGETS = [
    ('bnh', 'BNH Hospital Bangkok'),
    ('paolo-kaset', 'Paolo Hospital Kaset Bangkok'),
    ('samitivej-sukhumvit', 'Samitivej Hospital Sukhumvit Bangkok'),
    ('samitivej-nawamin', 'Samitivej Nawamin Hospital Bangkok'),
]

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    # Reset 0-count ratings to NULL first
    with conn.cursor() as cur:
        cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE review_count=0")
        print(f"Reset {cur.rowcount} hospitals with review_count=0")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--disable-blink-features=AutomationControlled'])
        context = await browser.new_context(
            locale='th-TH', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        )
        page = await context.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        for slug, query in TARGETS:
            url = f'https://www.google.com/maps/search/{query.replace(" ", "+")}'
            await page.goto(url, wait_until='domcontentloaded', timeout=20000)
            await page.wait_for_timeout(3000)

            html = await page.content()
            matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
            if matches:
                rating = float(matches[0][0])
                count = int(matches[0][1].replace(',', ''))
                if 1.0 <= rating <= 5.0:
                    with conn.cursor() as cur:
                        cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s", (rating, count, slug))
                    print(f"  ★{rating} ({count:,}) {slug}")
                    await asyncio.sleep(1.5)
                    continue
            print(f"  - {slug} (no rating)")
            await asyncio.sleep(1.5)

        await browser.close()

    with conn.cursor() as cur:
        cur.execute("SELECT name, rating, review_count FROM hospitals WHERE slug IN ('bnh','paolo-kaset','samitivej-sukhumvit','samitivej-nawamin')")
        print("\nUpdated:")
        for r in cur.fetchall():
            print(f"  {r['name']}: ★{r['rating']} ({r['review_count']})")

    conn.close()

asyncio.run(main())
