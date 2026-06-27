"""
Scrape address + phone for all hospitals from Google Maps.
Runs through all 264 hospitals, ~3 sec each = ~15 min total.
"""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    with conn.cursor() as cur:
        cur.execute("""SELECT id, name, city, area FROM hospitals
                       WHERE (address IS NULL OR address='') OR (phone IS NULL OR phone='')
                       ORDER BY city, name""")
        hospitals = cur.fetchall()

    print(f"Need address/phone for {len(hospitals)} hospitals")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled', '--no-sandbox']
        )
        ctx = await browser.new_context(
            locale='en-US', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        )
        page = await ctx.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        for i, h in enumerate(hospitals):
            city = h['city'] or 'Bangkok'
            query = f"{h['name']} {city} Thailand"
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(2000)
                html = await page.content()

                # Extract address - look for the address button/section
                addr = None
                phone = None

                # Address patterns in Google Maps
                addr_patterns = [
                    r'aria-label="Address:[^"]*"[^>]*>([^<]+)',
                    r'"address"[^>]*>([^<]{10,150}(?:Road|St\.|Ave\.|Rd\.|ถนน|ซอย|แขวง|เขต|จังหวัด)[^<]{0,100})',
                    r'data-item-id="address"[^>]*aria-label="([^"]+)"',
                ]
                for pat in addr_patterns:
                    m = re.search(pat, html)
                    if m:
                        addr = m.group(1).strip()[:300]
                        break

                # Phone patterns
                phone_patterns = [
                    r'aria-label="Phone:[^"]*"[^>]*>([^<]+)',
                    r'data-item-id="phone:tel:[^"]*"[^>]*aria-label="([^"]+)"',
                    r'href="tel:(\+?[\d\s\-\(\)]{8,20})"',
                    r'"telephone":\s*"([^"]+)"',
                ]
                for pat in phone_patterns:
                    m = re.search(pat, html)
                    if m:
                        phone = m.group(1).strip()
                        phone = re.sub(r'[^\d\+\-\(\)\s]', '', phone).strip()[:30]
                        if len(phone) >= 8:
                            break
                        else:
                            phone = None

                if addr or phone:
                    with conn.cursor() as cur:
                        cur.execute(
                            "UPDATE hospitals SET address=%s, phone=%s WHERE id=%s",
                            (addr, phone, h['id'])
                        )
                    print(f"  [{i+1}/{len(hospitals)}] {h['name'][:35]}: {phone or '-'} | {(addr or '')[:50]}")
                else:
                    print(f"  [{i+1}/{len(hospitals)}] {h['name'][:35]}: no data")

            except Exception as e:
                print(f"  ERR {h['name']}: {e}")

            await asyncio.sleep(1.5)

        await browser.close()

    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE phone IS NOT NULL AND phone!=''")
        print(f"\nHospitals with phone: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE address IS NOT NULL AND address!=''")
        print(f"Hospitals with address: {cur.fetchone()['n']}")

    conn.close()

asyncio.run(main())
