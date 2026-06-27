"""
Fix address extraction - Google Maps address is in specific aria-label patterns.
Run this after scrape_address_phone.py to fill in missing addresses.
"""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        # Get hospitals with phone but no address (or both missing)
        cur.execute("""SELECT id, name, city FROM hospitals
                       WHERE address IS NULL OR address=''
                       ORDER BY city, name LIMIT 200""")
        hospitals = cur.fetchall()
    print(f"Hospitals needing address: {len(hospitals)}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            locale='en-US', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36'
        )
        page = await ctx.new_page()
        await page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")

        found = 0
        for i, h in enumerate(hospitals):
            city = h['city'] or 'Bangkok'
            query = f"{h['name']} {city} Thailand"
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(2500)

                # Try to get address from page element
                addr = None
                phone = None

                # Method 1: aria-label on address button
                addr_el = await page.query_selector('[data-item-id="address"]')
                if addr_el:
                    addr = await addr_el.get_attribute('aria-label')
                    if addr:
                        addr = addr.replace('Address: ', '').strip()[:300]

                # Method 2: find address text via selector
                if not addr:
                    for sel in [
                        'button[data-item-id="address"] .fontBodyMedium',
                        '[data-tooltip="Copy address"] .fontBodyMedium',
                    ]:
                        el = await page.query_selector(sel)
                        if el:
                            addr = (await el.inner_text()).strip()[:300]
                            break

                # Method 3: regex in HTML
                if not addr:
                    html = await page.content()
                    m = re.search(r'"address"[^:]*:\s*"([^"]{15,250})"', html)
                    if m:
                        addr = m.group(1)[:300]
                    else:
                        # Look for Thai/English address format
                        m = re.search(r'(\d+[^<]{5,80}(?:Road|Rd\.|St\.|Ave\.|ถนน|ซอย|แขวง|Soi|Sukhumvit|Silom|Sathorn|Rama)[^<]{0,100})', html)
                        if m:
                            addr = re.sub(r'<[^>]+>', '', m.group(1)).strip()[:300]

                # Phone
                phone_el = await page.query_selector('[data-item-id^="phone:tel"]')
                if phone_el:
                    phone = await phone_el.get_attribute('aria-label')
                    if phone:
                        phone = re.sub(r'[^\d\+\-\s]', '', phone.replace('Phone:', '')).strip()[:30]
                        if len(phone) < 6: phone = None

                if addr or phone:
                    with conn.cursor() as cur:
                        cur.execute("UPDATE hospitals SET address=COALESCE(%s,address), phone=COALESCE(%s,phone) WHERE id=%s",
                                   (addr or None, phone or None, h['id']))
                    found += 1
                    print(f"  [{i+1}] {h['name'][:35]}: {phone or '?'} | {(addr or '')[:60]}")
                else:
                    if i % 20 == 0:
                        print(f"  [{i+1}] {h['name'][:35]}: no data")

            except Exception as e:
                print(f"  ERR {h['name']}: {e}")
            await asyncio.sleep(1.5)

        await browser.close()

    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE address IS NOT NULL AND address!=''")
        print(f"\nHospitals with address: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE phone IS NOT NULL AND phone!=''")
        print(f"Hospitals with phone: {cur.fetchone()['n']}")
    conn.close()

asyncio.run(main())
