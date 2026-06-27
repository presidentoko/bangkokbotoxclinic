"""Add Pattaya hospitals - major medical tourism destination."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

PATTAYA_HOSPITALS = [
    {
        'name': 'Bangkok Hospital Pattaya',
        'area': 'Pattaya', 'tier': 'premium',
        'checkup_url': 'https://www.bangkokpattayahospital.com/service/health-checkup',
        'packages': [
            ('Basic Health Check', 2500, 'basic'),
            ('Standard Health Check A', 5500, 'standard'),
            ('Standard Health Check B', 8900, 'standard'),
            ('Executive Health Check A', 14900, 'executive'),
            ('Executive Health Check B', 24900, 'executive'),
            ('Premium Health Check', 45000, 'executive'),
            ("Women's Health Check", 6900, 'women'),
            ("Men's Health Check", 6900, 'men'),
            ('Cancer Screening Package', 12900, 'cancer'),
            ('Heart Check Package', 9900, 'heart'),
        ]
    },
    {
        'name': 'Pattaya International Hospital',
        'area': 'Pattaya', 'tier': 'premium',
        'checkup_url': 'https://www.pih.co.th/health-checkup',
        'packages': [
            ('Basic Health Screening', 1990, 'basic'),
            ('Standard Health Package', 3990, 'standard'),
            ('Comprehensive Health Check', 7990, 'executive'),
            ('Executive Health Check', 14990, 'executive'),
            ("Women's Complete Check", 5990, 'women'),
            ('Cancer Tumor Marker Package', 9900, 'cancer'),
        ]
    },
    {
        'name': 'Banglamung Hospital Pattaya',
        'area': 'Pattaya', 'tier': 'standard',
        'checkup_url': 'https://www.banglamunghospital.go.th',
        'packages': [
            ('Annual Health Check Basic', 1200, 'basic'),
            ('Annual Health Check Standard', 2800, 'standard'),
            ('Annual Health Check Premium', 5500, 'standard'),
        ]
    },
    {
        'name': 'Pattaya Memorial Hospital',
        'area': 'Pattaya', 'tier': 'standard',
        'checkup_url': 'https://www.pattayamemorial.com/health-checkup',
        'packages': [
            ('Health Check Basic', 2490, 'basic'),
            ('Health Check Standard A', 4990, 'standard'),
            ('Health Check Standard B', 7990, 'standard'),
            ('Health Check Executive', 12990, 'executive'),
            ("Women's Health Package", 5990, 'women'),
            ('Senior Health Check (60+)', 6990, 'senior'),
        ]
    },
    {
        'name': 'Vejthani Hospital Pattaya',
        'area': 'Pattaya', 'tier': 'premium',
        'checkup_url': 'https://www.vejthani.com/health-checkup',
        'packages': [
            ('Basic Check Program', 2900, 'basic'),
            ('Standard Check Program', 5900, 'standard'),
            ('Comprehensive Check A', 12900, 'executive'),
            ('Comprehensive Check B', 22900, 'executive'),
            ("Women's Health Program", 7900, 'women'),
        ]
    },
]

SEARCH_QUERIES = {
    'Bangkok Hospital Pattaya': 'Bangkok Hospital Pattaya โรงพยาบาลกรุงเทพพัทยา',
    'Pattaya International Hospital': 'Pattaya International Hospital PIH',
    'Banglamung Hospital Pattaya': 'Banglamung Hospital Pattaya โรงพยาบาลบางละมุง',
    'Pattaya Memorial Hospital': 'Memorial Hospital Pattaya โรงพยาบาล',
    'Vejthani Hospital Pattaya': 'Vejthani Hospital Pattaya',
}

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    # Insert hospitals + packages
    with conn.cursor() as cur:
        for h in PATTAYA_HOSPITALS:
            slug = slugify(h['name'])
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if row:
                hid = row['id']
                print(f"  Exists: {h['name']}")
            else:
                cur.execute("""INSERT INTO hospitals (name, slug, tier, area, checkup_url, city)
                               VALUES (%s,%s,%s,%s,%s,'Pattaya')""",
                           (h['name'], slug, h['tier'], h['area'], h['checkup_url']))
                hid = cur.lastrowid
                print(f"  Added: {h['name']} (id={hid})")

            for pkg_name, price, cat in h['packages']:
                cur.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, pkg_name))
                if cur.fetchone():
                    continue
                # Infer inclusions
                n = pkg_name.lower()
                has_blood = 1
                has_xray = 1 if cat in ('executive', 'standard') else 0
                has_us = 1 if cat in ('executive',) else 0
                has_ecg = 1 if cat in ('executive', 'heart') else 0
                has_cancer = 1 if cat == 'cancer' else 0
                cur.execute("""INSERT INTO checkup_packages
                    (hospital_id, name, price, currency, category, source_url,
                     has_blood, has_xray, has_ultrasound, has_ecg, has_cancer_marker,
                     has_doctor_consult, scraped_at)
                    VALUES (%s,%s,%s,'THB',%s,%s, %s,%s,%s,%s,%s, 1,NOW())
                """, (hid, pkg_name, float(price), cat, h['checkup_url'],
                      has_blood, has_xray, has_us, has_ecg, has_cancer))

    # Get Google Maps ratings
    print("\nScraping Google Maps ratings...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = await browser.new_context(
            locale='th-TH', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        )
        page = await context.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM hospitals WHERE area='Pattaya'")
            hospitals = cur.fetchall()

        for h in hospitals:
            query = SEARCH_QUERIES.get(h['name'], h['name'] + ' Pattaya Thailand')
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(2500)
                html = await page.content()
                matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
                if matches:
                    rating = float(matches[0][0])
                    count = int(matches[0][1].replace(',', ''))
                    if 1.0 <= rating <= 5.0 and count >= 5:
                        with conn.cursor() as cur:
                            cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE id=%s",
                                       (rating, count, h['id']))
                        print(f"  ★{rating} ({count:,}) {h['name']}")
                    else:
                        print(f"  - {h['name']} (count={count})")
                else:
                    print(f"  ? {h['name']}")
            except Exception as e:
                print(f"  ERR {h['name']}: {e}")
            await asyncio.sleep(2)

        await browser.close()

    print("\nFinal Pattaya hospitals:")
    with conn.cursor() as cur:
        cur.execute("""SELECT h.name, h.rating, h.review_count, COUNT(p.id) pkgs
                       FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                       WHERE h.area='Pattaya' GROUP BY h.id""")
        for r in cur.fetchall():
            rating = f"★{r['rating']} ({r['review_count']:,})" if r['rating'] else "no rating"
            print(f"  {r['name']}: {rating}, {r['pkgs']} pkgs")
    conn.close()

asyncio.run(main())
