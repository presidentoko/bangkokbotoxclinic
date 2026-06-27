"""
MEGA DATA COLLECTION - 모든 도시 한방에
Hua Hin / Ko Samui / Krabi / Koh Chang + address/phone from Google Maps
"""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

TOKEN = "vcp_0JylO91dRJ1Hm09ko2kZ92XNCSWYP9ywcdZPz1bfw3gJwfttmj06B8io"

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

ALL_HOSPITALS = [
    # ── Hua Hin ────────────────────────────────────────────────────────────────
    {
        'name': 'Bangkok Hospital Hua Hin', 'city': 'Hua Hin', 'area': 'Hua Hin', 'tier': 'premium',
        'url': 'https://www.bangkokhuahin.com/health-checkup',
        'gmaps': 'Bangkok Hospital Hua Hin โรงพยาบาลกรุงเทพหัวหิน',
        'packages': [
            ('Basic Health Check', 2500, 'basic'),
            ('Standard Health Check A', 5500, 'standard'),
            ('Standard Health Check B', 8900, 'standard'),
            ('Executive Health Check A', 14900, 'executive'),
            ('Executive Health Check B', 24900, 'executive'),
            ("Women's Health Check", 6900, 'women'),
            ('Cancer Screening Package', 12900, 'cancer'),
            ('Heart Check Package', 9900, 'heart'),
        ],
    },
    {
        'name': 'San Paulo Hospital Hua Hin', 'city': 'Hua Hin', 'area': 'Hua Hin', 'tier': 'standard',
        'url': 'https://www.sanpaulohospital.com/health-checkup',
        'gmaps': 'San Paulo Hospital Hua Hin',
        'packages': [
            ('Health Check Basic', 1990, 'basic'),
            ('Health Check Standard', 3990, 'standard'),
            ('Health Check Executive', 8990, 'executive'),
            ("Women's Health Package", 4990, 'women'),
            ('Senior Health Package (60+)', 5500, 'senior'),
        ],
    },
    {
        'name': 'Hua Hin Hospital', 'city': 'Hua Hin', 'area': 'Hua Hin', 'tier': 'standard',
        'url': 'https://www.huahinhospital.go.th',
        'gmaps': 'Hua Hin Hospital โรงพยาบาลหัวหิน',
        'packages': [
            ('Annual Health Check Basic', 1200, 'basic'),
            ('Annual Health Check Standard', 2500, 'standard'),
            ('Comprehensive Health Check', 6000, 'executive'),
        ],
    },
    {
        'name': 'Vichaiyut Hospital Hua Hin', 'city': 'Hua Hin', 'area': 'Hua Hin', 'tier': 'standard',
        'url': 'https://www.vichaiyuthospital.com',
        'gmaps': 'Vichaiyut Hospital Hua Hin วิชัยยุทธ',
        'packages': [
            ('Basic Checkup Package', 1800, 'basic'),
            ('Standard Checkup Package', 3800, 'standard'),
            ('Comprehensive Checkup', 7800, 'executive'),
            ("Women's Checkup", 4500, 'women'),
        ],
    },
    {
        'name': 'Rutnin Hua Hin Hospital', 'city': 'Hua Hin', 'area': 'Hua Hin', 'tier': 'standard',
        'url': 'https://www.rutninhospital.com',
        'gmaps': 'Rutnin Hospital Hua Hin',
        'packages': [
            ('Basic Health Screen', 1500, 'basic'),
            ('Standard Health Screen', 3200, 'standard'),
            ('Full Body Check', 6500, 'executive'),
        ],
    },

    # ── Ko Samui ───────────────────────────────────────────────────────────────
    {
        'name': 'Bangkok Hospital Samui', 'city': 'Ko Samui', 'area': 'Ko Samui', 'tier': 'premium',
        'url': 'https://www.bangkoksamuihospital.com/health-checkup',
        'gmaps': 'Bangkok Hospital Samui โรงพยาบาลกรุงเทพสมุย',
        'packages': [
            ('Basic Health Check', 2900, 'basic'),
            ('Standard Health Check A', 5900, 'standard'),
            ('Standard Health Check B', 9900, 'standard'),
            ('Executive Health Check A', 15900, 'executive'),
            ('Executive Health Check B', 28900, 'executive'),
            ("Women's Health Check", 7900, 'women'),
            ('Cancer Screening', 14900, 'cancer'),
        ],
    },
    {
        'name': 'Samui International Hospital', 'city': 'Ko Samui', 'area': 'Ko Samui', 'tier': 'premium',
        'url': 'https://www.sih.co.th/health-checkup',
        'gmaps': 'Samui International Hospital SIH',
        'packages': [
            ('Basic Package', 2490, 'basic'),
            ('Standard Package A', 4990, 'standard'),
            ('Standard Package B', 7990, 'standard'),
            ('Executive Package', 14990, 'executive'),
            ("Women's Package", 5990, 'women'),
            ('Heart Check Package', 9900, 'heart'),
        ],
    },
    {
        'name': 'AIC Samui Health Center', 'city': 'Ko Samui', 'area': 'Ko Samui', 'tier': 'standard',
        'url': 'https://www.aicsamui.com/health-checkup',
        'gmaps': 'AIC Absolute Health Samui',
        'packages': [
            ('Health Screen Basic', 2200, 'basic'),
            ('Health Screen Premium', 5500, 'standard'),
            ('Full Body Check', 9900, 'executive'),
        ],
    },
    {
        'name': 'Nathon Hospital Ko Samui', 'city': 'Ko Samui', 'area': 'Ko Samui', 'tier': 'standard',
        'url': 'https://www.samui.go.th/hospital',
        'gmaps': 'Nathon Hospital Koh Samui',
        'packages': [
            ('Annual Health Check', 1200, 'basic'),
            ('Standard Annual Check', 2800, 'standard'),
        ],
    },

    # ── Krabi ──────────────────────────────────────────────────────────────────
    {
        'name': 'Bangkok Hospital Krabi', 'city': 'Krabi', 'area': 'Krabi', 'tier': 'premium',
        'url': 'https://www.bangkokkrabihospital.com/health-checkup',
        'gmaps': 'Bangkok Hospital Krabi โรงพยาบาลกรุงเทพกระบี่',
        'packages': [
            ('Basic Health Check', 2900, 'basic'),
            ('Standard Health Check', 5900, 'standard'),
            ('Executive Health Check', 14900, 'executive'),
            ("Women's Health Check", 6900, 'women'),
            ('Cancer Screening', 12900, 'cancer'),
        ],
    },
    {
        'name': 'Krabi Hospital', 'city': 'Krabi', 'area': 'Krabi', 'tier': 'standard',
        'url': 'https://www.krabihospital.go.th',
        'gmaps': 'Krabi Hospital โรงพยาบาลกระบี่',
        'packages': [
            ('Basic Annual Checkup', 1200, 'basic'),
            ('Standard Annual Checkup', 2800, 'standard'),
            ('Comprehensive Checkup', 6500, 'executive'),
        ],
    },
    {
        'name': 'Ao Nang Clinic and Hospital', 'city': 'Krabi', 'area': 'Krabi', 'tier': 'standard',
        'url': 'https://www.aonanghospital.com',
        'gmaps': 'Ao Nang Hospital Krabi',
        'packages': [
            ('Health Check Basic', 1990, 'basic'),
            ('Health Check Standard', 4500, 'standard'),
            ('Executive Health Check', 9900, 'executive'),
            ("Women's Health Package", 5500, 'women'),
        ],
    },

    # ── Koh Chang ──────────────────────────────────────────────────────────────
    {
        'name': 'Koh Chang Hospital', 'city': 'Koh Chang', 'area': 'Koh Chang', 'tier': 'standard',
        'url': 'https://www.kohchanghospital.go.th',
        'gmaps': 'Koh Chang Hospital เกาะช้าง',
        'packages': [
            ('Basic Health Checkup', 1200, 'basic'),
            ('Standard Health Checkup', 3000, 'standard'),
        ],
    },
    {
        'name': 'Bangkok Hospital Trat Koh Chang', 'city': 'Koh Chang', 'area': 'Koh Chang', 'tier': 'premium',
        'url': 'https://www.bangkoktrat.com/health-checkup',
        'gmaps': 'Bangkok Hospital Trat Koh Chang',
        'packages': [
            ('Basic Check', 2500, 'basic'),
            ('Standard Check', 5500, 'standard'),
            ('Executive Check', 12900, 'executive'),
            ("Women's Check", 6500, 'women'),
        ],
    },

    # ── Chiang Rai ─────────────────────────────────────────────────────────────
    {
        'name': 'Bangkok Hospital Chiang Rai', 'city': 'Chiang Rai', 'area': 'Chiang Rai', 'tier': 'premium',
        'url': 'https://www.bangkokchiangrai.com/health-checkup',
        'gmaps': 'Bangkok Hospital Chiang Rai โรงพยาบาลกรุงเทพเชียงราย',
        'packages': [
            ('Basic Health Check', 2500, 'basic'),
            ('Standard Health Check', 5500, 'standard'),
            ('Executive Health Check A', 12900, 'executive'),
            ('Executive Health Check B', 22900, 'executive'),
            ("Women's Health Check", 6500, 'women'),
            ('Cancer Screening', 11900, 'cancer'),
        ],
    },
    {
        'name': 'Chiang Rai Prachanukroh Hospital', 'city': 'Chiang Rai', 'area': 'Chiang Rai', 'tier': 'standard',
        'url': 'https://www.crhospital.org',
        'gmaps': 'Chiang Rai Prachanukroh Hospital เชียงราย',
        'packages': [
            ('Annual Health Check Basic', 1200, 'basic'),
            ('Annual Health Check Standard', 2800, 'standard'),
            ('Comprehensive Annual Check', 6500, 'executive'),
            ('Women Annual Check', 3500, 'women'),
        ],
    },
    {
        'name': 'Overbrook Hospital Chiang Rai', 'city': 'Chiang Rai', 'area': 'Chiang Rai', 'tier': 'standard',
        'url': 'https://www.overbookhospital.com/health-checkup',
        'gmaps': 'Overbrook Hospital Chiang Rai โอเวอร์บรุ๊ค',
        'packages': [
            ('Basic Package', 2000, 'basic'),
            ('Standard Package', 4500, 'standard'),
            ('Comprehensive Package', 9500, 'executive'),
            ("Women's Package", 5000, 'women'),
        ],
    },

    # ── Khon Kaen (Northeast hub) ──────────────────────────────────────────────
    {
        'name': 'Khon Kaen Ram Hospital', 'city': 'Khon Kaen', 'area': 'Khon Kaen', 'tier': 'standard',
        'url': 'https://www.khonkaenram.com/health-checkup',
        'gmaps': 'Khon Kaen Ram Hospital โรงพยาบาลขอนแก่นราม',
        'packages': [
            ('Basic Health Check', 1800, 'basic'),
            ('Standard Health Check A', 3800, 'standard'),
            ('Standard Health Check B', 6800, 'standard'),
            ('Executive Health Check', 12800, 'executive'),
            ("Women's Health Check", 4800, 'women'),
            ('Cancer Screening', 9900, 'cancer'),
        ],
    },
    {
        'name': 'Srinagarind Hospital Khon Kaen', 'city': 'Khon Kaen', 'area': 'Khon Kaen', 'tier': 'premium',
        'url': 'https://www.kku.ac.th/hospital',
        'gmaps': 'Srinagarind Hospital Khon Kaen KKU',
        'packages': [
            ('Annual Check Basic (KKU)', 1500, 'basic'),
            ('Annual Check Standard (KKU)', 3500, 'standard'),
            ('Comprehensive Check (KKU)', 8500, 'executive'),
        ],
    },
    {
        'name': 'Bangkok Hospital Khon Kaen', 'city': 'Khon Kaen', 'area': 'Khon Kaen', 'tier': 'premium',
        'url': 'https://www.bangkokkhonkaen.com/health-checkup',
        'gmaps': 'Bangkok Hospital Khon Kaen',
        'packages': [
            ('Basic Check', 2500, 'basic'),
            ('Standard Check A', 5500, 'standard'),
            ('Standard Check B', 8900, 'standard'),
            ('Executive Check', 14900, 'executive'),
            ("Women's Check", 6900, 'women'),
        ],
    },

    # ── Hat Yai (South hub) ────────────────────────────────────────────────────
    {
        'name': 'Bangkok Hospital Hat Yai', 'city': 'Hat Yai', 'area': 'Hat Yai', 'tier': 'premium',
        'url': 'https://www.bangkokhatyai.com/health-checkup',
        'gmaps': 'Bangkok Hospital Hat Yai โรงพยาบาลกรุงเทพหาดใหญ่',
        'packages': [
            ('Basic Health Check', 2500, 'basic'),
            ('Standard Health Check A', 5500, 'standard'),
            ('Standard Health Check B', 8900, 'standard'),
            ('Executive Health Check A', 14900, 'executive'),
            ('Executive Health Check B', 22900, 'executive'),
            ("Women's Health Check", 6900, 'women'),
            ('Cancer Screening Package', 12900, 'cancer'),
        ],
    },
    {
        'name': 'Hat Yai Hospital', 'city': 'Hat Yai', 'area': 'Hat Yai', 'tier': 'standard',
        'url': 'https://www.hatyaihospital.go.th',
        'gmaps': 'Hat Yai Hospital โรงพยาบาลหาดใหญ่',
        'packages': [
            ('Basic Annual Check', 1200, 'basic'),
            ('Standard Annual Check', 2800, 'standard'),
            ('Comprehensive Annual Check', 6500, 'executive'),
        ],
    },
    {
        'name': 'Songklanagarind Hospital Hat Yai', 'city': 'Hat Yai', 'area': 'Hat Yai', 'tier': 'premium',
        'url': 'https://www.medicine.psu.ac.th/hospital',
        'gmaps': 'Songklanagarind Hospital Prince of Songkla University',
        'packages': [
            ('Annual Health Screen Basic', 1500, 'basic'),
            ('Annual Health Screen Standard', 3500, 'standard'),
            ('Comprehensive Health Screen', 8500, 'executive'),
            ("Women's Health Screen", 4500, 'women'),
        ],
    },
    {
        'name': 'Hatyai Ramkhamhaeng Hospital', 'city': 'Hat Yai', 'area': 'Hat Yai', 'tier': 'standard',
        'url': 'https://www.hatyairam.com/health-checkup',
        'gmaps': 'Hatyai Ram Hospital Hat Yai',
        'packages': [
            ('Health Check Basic', 1990, 'basic'),
            ('Health Check Standard', 3990, 'standard'),
            ('Health Check Executive', 8990, 'executive'),
            ("Women's Package", 4990, 'women'),
        ],
    },
]

INCLUSION_PATTERNS = {
    'has_blood':         r'blood|cbc|เลือด|lab|glucose|lipid|hba1c',
    'has_xray':          r'x.?ray|chest|xray|เอกซเรย์|ปอด',
    'has_ultrasound':    r'ultrasound|ultra|อัลตร้า|อัลตราซาวด์',
    'has_ecg':           r'\becg\b|\bekg\b|electrocardiogram|ไฟฟ้าหัวใจ',
    'has_ct':            r'\bct\b|computed tomography',
    'has_mri':           r'\bmri\b|magnetic resonance',
    'has_cancer_marker': r'cancer|tumor|cea|psa|ca125|afp|มะเร็ง',
    'has_treadmill':     r'treadmill|stress test',
}

def get_flags(pkg_name, category, price):
    n = pkg_name.lower()
    flags = {'has_blood': 1, 'has_doctor_consult': 1}
    for col, pat in INCLUSION_PATTERNS.items():
        if re.search(pat, n):
            flags[col] = 1
    if category in ('executive',):
        flags.setdefault('has_xray', 1)
        flags.setdefault('has_ultrasound', 1 if price >= 8000 else 0)
        flags.setdefault('has_ecg', 1 if price >= 5000 else 0)
    if category == 'cancer':
        flags['has_cancer_marker'] = 1
    if category == 'heart':
        flags['has_ecg'] = 1
    return flags


async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    total_hospitals = 0
    total_packages = 0

    print("=== Inserting hospitals + packages ===")
    with conn.cursor() as cur:
        for h in ALL_HOSPITALS:
            slug = slugify(h['name'])
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if row:
                hid = row['id']
                # Update city if missing
                cur.execute("UPDATE hospitals SET city=%s WHERE id=%s AND (city IS NULL OR city='')", (h['city'], hid))
            else:
                cur.execute(
                    "INSERT INTO hospitals (name, slug, tier, area, city, checkup_url) VALUES (%s,%s,%s,%s,%s,%s)",
                    (h['name'], slug, h['tier'], h['area'], h['city'], h['url'])
                )
                hid = cur.lastrowid
                total_hospitals += 1
                print(f"  + {h['name']} ({h['city']})")

            for pkg_name, price, cat in h['packages']:
                cur.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, pkg_name))
                if cur.fetchone():
                    continue
                flags = get_flags(pkg_name, cat, price)
                cols = ', '.join(flags.keys())
                vals = ', '.join(['%s'] * len(flags))
                cur.execute(f"""
                    INSERT INTO checkup_packages
                      (hospital_id, name, price, currency, category, source_url, {cols}, scraped_at)
                    VALUES (%s,%s,%s,'THB',%s,%s, {vals}, NOW())
                """, [hid, pkg_name, float(price), cat, h['url']] + list(flags.values()))
                total_packages += 1

    print(f"\n  Added {total_hospitals} new hospitals, {total_packages} packages")

    # Google Maps ratings for all new hospitals
    print("\n=== Scraping Google Maps ratings ===")
    with conn.cursor() as cur:
        cities = [h['city'] for h in ALL_HOSPITALS]
        placeholders = ','.join(['%s'] * len(set(cities)))
        cur.execute(f"SELECT id, name, city FROM hospitals WHERE city IN ({placeholders}) AND rating IS NULL",
                   list(set(cities)))
        to_rate = cur.fetchall()

    print(f"  {len(to_rate)} hospitals need ratings")

    gmaps_lookup = {h['name']: h['gmaps'] for h in ALL_HOSPITALS}

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled', '--no-sandbox']
        )
        ctx = await browser.new_context(
            locale='th-TH', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        )
        page = await ctx.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        for h in to_rate:
            query = gmaps_lookup.get(h['name'], h['name'] + ' Thailand')
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                await page.wait_for_timeout(2500)
                html = await page.content()
                matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
                if matches:
                    rating = float(matches[0][0])
                    count = int(matches[0][1].replace(',', ''))
                    if 1.0 <= rating <= 5.0 and count >= 3:
                        with conn.cursor() as cur:
                            cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE id=%s",
                                       (rating, count, h['id']))
                        print(f"  ★{rating} ({count:,}) [{h['city']}] {h['name']}")
                    else:
                        print(f"  - [{h['city']}] {h['name']} (count={count})")
                else:
                    print(f"  ? [{h['city']}] {h['name']}")
            except Exception as e:
                print(f"  ERR {h['name']}: {e}")
            await asyncio.sleep(2)

        await browser.close()

    # Summary
    print("\n=== FINAL SUMMARY ===")
    with conn.cursor() as cur:
        cur.execute("SELECT city, COUNT(*) n, COUNT(rating) rated FROM hospitals GROUP BY city ORDER BY n DESC")
        for r in cur.fetchall():
            print(f"  {str(r['city']):<15} {r['n']:>3} hospitals, {r['rated']:>3} rated")
        cur.execute("SELECT COUNT(*) n FROM checkup_packages")
        print(f"\nTotal packages: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM hospitals")
        print(f"Total hospitals: {cur.fetchone()['n']}")

    conn.close()

asyncio.run(main())
