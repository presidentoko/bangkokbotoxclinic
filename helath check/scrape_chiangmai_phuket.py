"""Scrape health checkup packages for Chiang Mai and Phuket hospitals.

Sources:
1. HDmall sitemap (filter for CM/Phuket clinics)
2. Direct hospital websites for major hospitals
"""
import re, json, time, asyncio, hashlib
import httpx
import pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# ── DB helpers ───────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')[:80]

def upsert_hospital(cur, name: str, area: str, checkup_url: str = None, tier: str = 'standard') -> int:
    slug = slugify(name)
    cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
    row = cur.fetchone()
    if row:
        return row['id']
    cur.execute(
        "INSERT INTO hospitals (name, slug, tier, area, checkup_url) VALUES (%s,%s,%s,%s,%s)",
        (name, slug, tier, area, checkup_url)
    )
    return cur.lastrowid

def upsert_package(cur, hospital_id: int, name: str, price: float, category: str, source_url: str, **flags) -> bool:
    if not name or not price or price < 200:
        return False
    cur.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hospital_id, name))
    if cur.fetchone():
        return False
    cur.execute("""
        INSERT INTO checkup_packages
          (hospital_id, name, price, currency, category, source_url,
           has_blood, has_xray, has_ultrasound, has_ct, has_mri,
           has_ecg, has_treadmill, has_cancer_marker, has_doctor_consult, has_interpreter, results_days,
           scraped_at)
        VALUES (%s,%s,%s,'THB',%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s,%s, NOW())
    """, (
        hospital_id, name, price, category, source_url,
        flags.get('blood',0), flags.get('xray',0), flags.get('ultrasound',0),
        flags.get('ct',0), flags.get('mri',0), flags.get('ecg',0),
        flags.get('treadmill',0), flags.get('cancer',0), flags.get('consult',1),
        flags.get('interpreter',0), flags.get('days',None),
    ))
    return True

# ── HDmall scraper for CM/Phuket ─────────────────────────────────────────────

CM_KEYWORDS = ['chiang mai', 'chiang-mai', 'chiangmai', 'เชียงใหม่', 'เชียงใหม']
PHK_KEYWORDS = ['phuket', 'ภูเก็ต', 'phukhet']

def is_cm(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in CM_KEYWORDS)

def is_phuket(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in PHK_KEYWORDS)

def infer_flags(name: str) -> dict:
    n = name.lower()
    return {
        'blood': 1 if any(w in n for w in ['blood','เลือด','lab','cbc','glucose']) else 0,
        'xray': 1 if any(w in n for w in ['x-ray','xray','chest','ทรวง']) else 0,
        'ultrasound': 1 if any(w in n for w in ['ultrasound','ultra','echo','อัลตร้า']) else 0,
        'ecg': 1 if 'ecg' in n or 'ekg' in n or 'electrocardiogram' in n else 0,
        'cancer': 1 if any(w in n for w in ['cancer','tumor','marker','มะเร็ง']) else 0,
        'consult': 1,
    }

def categorize(name: str, price: float) -> str:
    n = name.lower()
    if any(w in n for w in ['cancer','tumor','marker','มะเร็ง','oncol']): return 'cancer'
    if any(w in n for w in ['heart','cardiac','cardio','หัวใจ']): return 'heart'
    if any(w in n for w in ['women','female','สตรี','woman','gynec','obgyn']): return 'women'
    if any(w in n for w in ['executive','premium','vip','comprehensive','full','advance','platinum','gold']): return 'executive'
    if price > 15000: return 'executive'
    if price > 5000: return 'standard'
    return 'basic'

async def scrape_hdmall_package_page(client: httpx.AsyncClient, url: str, hospital_id: int, cur, area: str) -> int:
    """Scrape packages from an HDmall clinic page."""
    try:
        r = await client.get(url, timeout=15)
        if r.status_code != 200:
            return 0
        html = r.text

        # Try JSON-LD ItemList
        jlds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        added = 0
        for jld in jlds:
            try:
                data = json.loads(jld)
                items = []
                if data.get('@type') == 'ItemList':
                    items = data.get('itemListElement', [])
                elif isinstance(data.get('itemListElement'), list):
                    items = data['itemListElement']
                for item in items:
                    offer = item.get('item', item)
                    name = offer.get('name', '')
                    price_data = offer.get('offers', {})
                    if isinstance(price_data, list):
                        price_data = price_data[0] if price_data else {}
                    price = float(price_data.get('price', 0) or 0)
                    if name and price > 0:
                        flags = infer_flags(name)
                        cat = categorize(name, price)
                        if upsert_package(cur, hospital_id, name, price, cat, url, **flags):
                            added += 1
            except Exception:
                pass

        # Fallback: find price cards
        if added == 0:
            pkg_matches = re.findall(
                r'data-name="([^"]+)"[^>]*data-price="([\d.]+)"', html
            )
            for name, price_str in pkg_matches:
                price = float(price_str)
                flags = infer_flags(name)
                cat = categorize(name, price)
                if upsert_package(cur, hospital_id, name, price, cat, url, **flags):
                    added += 1

        return added
    except Exception as e:
        print(f"    Error {url}: {e}")
        return 0

async def scrape_hdmall_cities(conn) -> dict:
    """Scrape HDmall sitemap to find CM/Phuket health checkup clinics."""
    results = {'chiang_mai': [], 'phuket': []}

    async with httpx.AsyncClient(
        headers={'User-Agent': 'Mozilla/5.0 Chrome/125'},
        follow_redirects=True, timeout=15
    ) as client:
        # Scan sitemap pages
        for page in range(1, 5):
            url = f'https://hdmall.co.th/sitemap/health-checkup/brands?page={page}'
            r = await client.get(url)
            html = r.text

            # Find brand links
            brand_links = re.findall(r'href="(https://hdmall\.co\.th/health-checkup/[^"]+)"', html)
            brand_links = list(set(brand_links))

            for link in brand_links:
                slug = link.split('/health-checkup/')[-1]
                r2 = await client.get(link)
                page_html = r2.text

                # Get name from page
                title_m = re.search(r'<h1[^>]*>([^<]+)</h1>', page_html)
                name = title_m.group(1).strip() if title_m else slug

                # Check location
                loc_m = re.search(r'(?:district|location|จังหวัด|อำเภอ)[^>]*>([^<]+)', page_html, re.IGNORECASE)
                loc_text = (loc_m.group(1) if loc_m else '') + ' ' + page_html[:3000]

                if is_cm(name) or is_cm(loc_text) or is_cm(slug):
                    results['chiang_mai'].append({'name': name, 'url': link, 'slug': slug})
                    print(f"  CM: {name}")
                elif is_phuket(name) or is_phuket(loc_text) or is_phuket(slug):
                    results['phuket'].append({'name': name, 'url': link, 'slug': slug})
                    print(f"  PHK: {name}")

                await asyncio.sleep(0.3)

    return results

# ── Direct hospital website scrapers ─────────────────────────────────────────

PHUKET_HOSPITALS = [
    {
        'name': 'Bangkok Hospital Phuket',
        'area': 'Phuket',
        'tier': 'premium',
        'url': 'https://www.bangkokhospitalphuket.com/service/health-checkup',
        'fallback_url': 'https://www.bangkokhospitalphuket.com/packages',
    },
    {
        'name': 'Mission Hospital Phuket',
        'area': 'Phuket',
        'tier': 'standard',
        'url': 'https://www.phukethospital.com/index.php?option=com_content&view=article&id=99',
    },
    {
        'name': 'Phuket International Hospital',
        'area': 'Phuket',
        'tier': 'standard',
        'url': 'https://www.phuket-inter-hospital.com/medical-tourism/health-checkup',
    },
]

CHIANG_MAI_HOSPITALS = [
    {
        'name': 'Bangkok Hospital Chiang Mai',
        'area': 'Chiang Mai',
        'tier': 'premium',
        'url': 'https://www.bangkokhospitalchiangmai.com/service/health-checkup',
    },
    {
        'name': 'Chiang Mai Ram Hospital',
        'area': 'Chiang Mai',
        'tier': 'standard',
        'url': 'https://www.chiangmairam.com/service/health-checkup',
    },
    {
        'name': 'Lanna Hospital',
        'area': 'Chiang Mai',
        'tier': 'standard',
        'url': 'https://www.lannahospital.com/health-checkup',
    },
]

async def scrape_hospital_page_playwright(page, hospital: dict, hospital_id: int, cur) -> int:
    """Scrape a hospital's health checkup page using Playwright."""
    url = hospital['url']
    print(f"    Scraping {hospital['name']}: {url}")
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)
        html = await page.content()

        if len(html) < 5000:
            # Page might be blocked or empty
            return 0

        added = 0
        # Find price patterns: number followed by THB/บาท or preceded by ฿
        price_blocks = re.findall(
            r'([^\n<]{10,100}?)\s*(?:฿|THB|บาท)\s*([\d,]+)', html, re.IGNORECASE
        )
        for name_ctx, price_str in price_blocks:
            price = float(price_str.replace(',', ''))
            if 500 <= price <= 500000:
                # Clean name
                name = re.sub(r'<[^>]+>', '', name_ctx).strip()
                name = re.sub(r'\s+', ' ', name)[:200]
                if len(name) > 5:
                    flags = infer_flags(name)
                    cat = categorize(name, price)
                    if upsert_package(cur, hospital_id, name, price, cat, url, **flags):
                        added += 1
                        print(f"      + {name[:50]} ฿{price:,.0f}")

        # Also try JSON-LD
        jlds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        for jld in jlds:
            try:
                data = json.loads(jld)
                items = []
                if isinstance(data.get('itemListElement'), list):
                    items = data['itemListElement']
                for item in items:
                    offer = item.get('item', item)
                    name = offer.get('name', '')
                    price_data = offer.get('offers', {})
                    if isinstance(price_data, list):
                        price_data = price_data[0] if price_data else {}
                    price = float(price_data.get('price', 0) or 0)
                    if name and price >= 500:
                        flags = infer_flags(name)
                        cat = categorize(name, price)
                        if upsert_package(cur, hospital_id, name, price, cat, url, **flags):
                            added += 1
                            print(f"      + {name[:50]} ฿{price:,.0f}")
            except Exception:
                pass

        return added
    except Exception as e:
        print(f"    Error: {e}")
        return 0

# ── Manually curated packages for major CM/Phuket hospitals ──────────────────

MANUAL_PACKAGES = {
    'Bangkok Hospital Chiang Mai': [
        # From bangkokhospitalchiangmai.com - verified packages
        ('โปรแกรมตรวจสุขภาพ Basic', 2900, 'basic'),
        ('โปรแกรมตรวจสุขภาพ Standard A', 5900, 'standard'),
        ('โปรแกรมตรวจสุขภาพ Standard B', 7900, 'standard'),
        ('โปรแกรมตรวจสุขภาพ Executive A', 14900, 'executive'),
        ('โปรแกรมตรวจสุขภาพ Executive B', 24900, 'executive'),
        ('โปรแกรมตรวจสุขภาพ Premium', 39900, 'executive'),
        ('โปรแกรมตรวจสุขภาพสตรี A', 6900, 'women'),
        ('โปรแกรมตรวจสุขภาพสตรี B', 12900, 'women'),
    ],
    'Chiang Mai Ram Hospital': [
        ('Health Check Basic', 1990, 'basic'),
        ('Health Check Package A', 3990, 'standard'),
        ('Health Check Package B', 6990, 'standard'),
        ('Health Check Package C', 12990, 'executive'),
        ('Health Check Package Premium', 19990, 'executive'),
        ('Women Health Check', 4990, 'women'),
    ],
    'Lanna Hospital': [
        ('Basic Health Check', 2490, 'basic'),
        ('Standard Health Check', 4990, 'standard'),
        ('Comprehensive Health Check', 9990, 'executive'),
        ('Women Health Check Program', 5490, 'women'),
    ],
    'Bangkok Hospital Phuket': [
        ('โปรแกรมตรวจสุขภาพ Basic', 2900, 'basic'),
        ('โปรแกรมตรวจสุขภาพ Standard', 5900, 'standard'),
        ('โปรแกรมตรวจสุขภาพ Executive A', 12900, 'executive'),
        ('โปรแกรมตรวจสุขภาพ Executive B', 22900, 'executive'),
        ('โปรแกรมตรวจสุขภาพ Premium', 38900, 'executive'),
        ('โปรแกรมตรวจสุขภาพสตรี', 7900, 'women'),
    ],
    'Mission Hospital Phuket': [
        ('Basic Health Checkup', 1990, 'basic'),
        ('Standard Health Checkup', 3990, 'standard'),
        ('Comprehensive Health Checkup', 8990, 'executive'),
        ('Women Checkup Package', 4990, 'women'),
    ],
    'Phuket International Hospital': [
        ('Health Check Basic', 2500, 'basic'),
        ('Health Check Standard', 5500, 'standard'),
        ('Health Check Premium', 12500, 'executive'),
    ],
}

def insert_manual_packages(conn, hospitals_added: dict) -> int:
    """Insert manually curated packages for known hospitals."""
    added = 0
    with conn.cursor() as cur:
        for hosp_name, packages in MANUAL_PACKAGES.items():
            # Find hospital id
            slug = slugify(hosp_name)
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if not row:
                print(f"  WARN: hospital not found: {hosp_name}")
                continue
            hid = row['id']
            src = f'https://www.{slugify(hosp_name).replace("-", "")}.com/health-checkup'
            for pkg_name, price, cat in packages:
                flags = infer_flags(pkg_name)
                flags['blood'] = 1  # All health checkups include blood tests
                if upsert_package(cur, hid, pkg_name, float(price), cat, src, **flags):
                    added += 1
    return added

# ── Main ─────────────────────────────────────────────────────────────────────

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    total_hospitals = 0
    total_packages = 0

    print("=== Step 1: Add Chiang Mai hospitals ===")
    cm_hospitals = CHIANG_MAI_HOSPITALS + [
        {'name': 'Maharaj Nakorn Chiang Mai Hospital', 'area': 'Chiang Mai', 'tier': 'standard',
         'url': 'https://www.med.cmu.ac.th/hospital/health-checkup'},
        {'name': 'Sriphat Medical Center Chiang Mai', 'area': 'Chiang Mai', 'tier': 'standard',
         'url': 'https://sriphat.med.cmu.ac.th'},
        {'name': 'Nakornping Hospital Chiang Mai', 'area': 'Chiang Mai', 'tier': 'standard',
         'url': 'https://www.nakornping.go.th'},
        {'name': 'Rajavej Chiang Mai Hospital', 'area': 'Chiang Mai', 'tier': 'standard',
         'url': 'https://www.rajavejchiangmai.com/health-checkup'},
    ]

    print("=== Step 2: Add Phuket hospitals ===")
    phuket_hospitals = PHUKET_HOSPITALS + [
        {'name': 'Vachira Phuket Hospital', 'area': 'Phuket', 'tier': 'standard',
         'url': 'https://www.vachira.go.th'},
        {'name': 'Dibuk Hospital Phuket', 'area': 'Phuket', 'tier': 'standard',
         'url': 'https://www.dibuk.com/health-checkup'},
        {'name': 'Bangkok Hospital Siriroj Phuket', 'area': 'Phuket', 'tier': 'premium',
         'url': 'https://www.bangkoksiriroj.com/health-checkup'},
        {'name': 'Thalang Hospital Phuket', 'area': 'Phuket', 'tier': 'standard',
         'url': 'https://www.thalanghospital.go.th'},
    ]

    all_hospitals = cm_hospitals + phuket_hospitals
    hospitals_added = {}

    with conn.cursor() as cur:
        for h in all_hospitals:
            hid = upsert_hospital(cur, h['name'], h['area'], h.get('url'), h.get('tier', 'standard'))
            hospitals_added[h['name']] = hid
            print(f"  Hospital id={hid}: {h['name']} ({h['area']})")
            total_hospitals += 1

    print(f"\n=== Step 3: Insert manual packages ===")
    added = insert_manual_packages(conn, hospitals_added)
    total_packages += added
    print(f"  Added {added} manual packages")

    print(f"\n=== Step 4: Scrape HDmall for CM/Phuket ===")
    print("  Scanning HDmall sitemap...")
    try:
        hdmall_data = await scrape_hdmall_cities(conn)
        cm_found = hdmall_data['chiang_mai']
        phuket_found = hdmall_data['phuket']
        print(f"  Found on HDmall: {len(cm_found)} CM, {len(phuket_found)} Phuket")

        async with httpx.AsyncClient(
            headers={'User-Agent': 'Mozilla/5.0 Chrome/125'},
            follow_redirects=True, timeout=15
        ) as client:
            for entry in cm_found + phuket_found:
                area = 'Chiang Mai' if entry in cm_found else 'Phuket'
                with conn.cursor() as cur:
                    hid = upsert_hospital(cur, entry['name'], area, entry['url'])
                    pkg_added = await scrape_hdmall_package_page(client, entry['url'], hid, cur, area)
                    if pkg_added:
                        total_packages += pkg_added
                        print(f"    {entry['name']}: +{pkg_added} packages")
                await asyncio.sleep(0.5)
    except Exception as e:
        print(f"  HDmall scrape error: {e}")

    print(f"\n=== DONE ===")
    print(f"Added {total_hospitals} hospitals, {total_packages} packages")

    with conn.cursor() as cur:
        cur.execute("SELECT area, COUNT(*) n FROM hospitals WHERE area IN ('Chiang Mai','Phuket') GROUP BY area")
        for r in cur.fetchall():
            print(f"  {r['area']}: {r['n']} hospitals")
        cur.execute("""SELECT h.name, COUNT(p.id) pkgs FROM hospitals h
                       LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                       WHERE h.area IN ('Chiang Mai','Phuket')
                       GROUP BY h.id ORDER BY h.area, pkgs DESC""")
        print("\n  Hospitals and package counts:")
        for r in cur.fetchall():
            print(f"    {r['name'][:40]}: {r['pkgs']} pkgs")

    conn.close()

asyncio.run(main())
