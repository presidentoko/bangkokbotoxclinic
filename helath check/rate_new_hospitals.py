"""Get Google Maps ratings for Chiang Mai and Phuket hospitals."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# Name → search query mapping (more specific)
SEARCH_QUERIES = {
    'Bangkok Hospital Chiang Mai': 'Bangkok Hospital Chiang Mai โรงพยาบาลกรุงเทพเชียงใหม่',
    'Chiang Mai Ram Hospital': 'Chiang Mai Ram Hospital โรงพยาบาลเชียงใหม่ราม',
    'Lanna Hospital': 'Lanna Hospital Chiang Mai โรงพยาบาลลานนา',
    'Maharaj Nakorn Chiang Mai Hospital': 'Maharaj Nakorn Chiang Mai Hospital มหาราชนครเชียงใหม่',
    'Sriphat Medical Center Chiang Mai': 'Sriphat Medical Center เชียงใหม่',
    'Nakornping Hospital Chiang Mai': 'Nakornping Hospital เชียงใหม่',
    'Rajavej Chiang Mai Hospital': 'Rajavej Hospital Chiang Mai ราชเวช',
    'Bangkok Hospital Phuket': 'Bangkok Hospital Phuket โรงพยาบาลกรุงเทพภูเก็ต',
    'Mission Hospital Phuket': 'Mission Hospital Phuket โรงพยาบาลมิชชัน',
    'Phuket International Hospital': 'Phuket International Hospital โรงพยาบาลนานาชาติภูเก็ต',
    'Vachira Phuket Hospital': 'Vachira Phuket Hospital วชิระ',
    'Dibuk Hospital Phuket': 'Dibuk Hospital Phuket ดีบุก',
    'Bangkok Hospital Siriroj Phuket': 'Bangkok Hospital Siriroj Phuket ศิริโรจน์',
    'Thalang Hospital Phuket': 'Thalang Hospital Phuket ถลาง',
}

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled', '--no-sandbox']
        )
        context = await browser.new_context(
            locale='th-TH', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        )
        page = await context.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM hospitals WHERE area IN ('Chiang Mai','Phuket')")
            hospitals = cur.fetchall()

        for h in hospitals:
            query = SEARCH_QUERIES.get(h['name'], h['name'] + ' Thailand')
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(3000)
                html = await page.content()
                matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
                if matches:
                    rating = float(matches[0][0])
                    count = int(matches[0][1].replace(',', ''))
                    if 1.0 <= rating <= 5.0 and count >= 5:
                        with conn.cursor() as cur:
                            cur.execute(
                                "UPDATE hospitals SET rating=%s, review_count=%s WHERE id=%s",
                                (rating, count, h['id'])
                            )
                        print(f"  ★{rating} ({count:,}) {h['name']}")
                    else:
                        print(f"  - {h['name']} (low count: {count})")
                else:
                    print(f"  ? {h['name']} (no match)")
            except Exception as e:
                print(f"  ERR {h['name']}: {e}")
            await asyncio.sleep(2)

        await browser.close()

    print("\nFinal CM/Phuket ratings:")
    with conn.cursor() as cur:
        cur.execute("""SELECT name, area, rating, review_count FROM hospitals
                       WHERE area IN ('Chiang Mai','Phuket') ORDER BY area, review_count DESC""")
        for r in cur.fetchall():
            rating = f"★{r['rating']} ({r['review_count']:,})" if r['rating'] else "no rating"
            print(f"  [{r['area']}] {r['name']}: {rating}")
    conn.close()

asyncio.run(main())
