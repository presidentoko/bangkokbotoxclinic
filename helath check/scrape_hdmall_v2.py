"""
HDmall re-scrape v2 - uses Playwright for JS-rendered sitemap,
then httpx for individual package pages.
Focuses on updating existing package prices + adding new packages.
"""
import re, json, asyncio, pymysql
import httpx
from playwright.async_api import async_playwright
from config import DB_CONFIG

BASE = "https://hdmall.co.th"

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

def categorize(name, price):
    n = name.lower()
    if re.search(r'cancer|tumor|มะเร็ง|marker|cea|psa|ca125', n): return 'cancer'
    if re.search(r'heart|cardiac|หัวใจ|treadmill', n): return 'heart'
    if re.search(r'women|female|สตรี|gynec|mammogram|pap', n): return 'women'
    if re.search(r'\bmen\b|male|ชาย|prostate', n): return 'men'
    if re.search(r'senior|elder|ผู้สูงอายุ', n): return 'senior'
    if price < 3000: return 'basic'
    if price < 8000: return 'standard'
    return 'executive'

def infer_flags(name):
    n = name.lower()
    return {
        'has_blood':         1 if re.search(r'blood|cbc|เลือด|lab|glucose|lipid|hba1c', n) else 0,
        'has_xray':          1 if re.search(r'x.?ray|chest|xray|เอกซเรย์', n) else 0,
        'has_ultrasound':    1 if re.search(r'ultrasound|อัลตร้า|อัลตราซาวด์', n) else 0,
        'has_ecg':           1 if re.search(r'\becg\b|\bekg\b|electrocardiogram', n) else 0,
        'has_ct':            1 if re.search(r'\bct\b|computed tomography', n) else 0,
        'has_mri':           1 if re.search(r'\bmri\b|magnetic resonance', n) else 0,
        'has_cancer_marker': 1 if re.search(r'cancer marker|tumor|cea|psa|ca125|afp|มะเร็ง', n) else 0,
        'has_doctor_consult': 1,
    }

async def get_brand_slugs_playwright():
    """Use Playwright to get JS-rendered brand list."""
    slugs = set()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent='Mozilla/5.0 Chrome/125')
        page = await ctx.new_page()
        for pg in range(1, 8):
            url = f"{BASE}/sitemap/health-checkup/brands?page={pg}"
            await page.goto(url, wait_until='networkidle', timeout=20000)
            await page.wait_for_timeout(2000)
            html = await page.content()
            found = re.findall(r'href="/health-checkup/([^"/]+)"', html)
            found += re.findall(r'href="https://hdmall\.co\.th/health-checkup/([^"/]+)"', html)
            # Remove package slugs (too long, contain multiple hyphens indicating they're not brands)
            brand_found = [s for s in found if len(s) < 60 and s.count('-') <= 5]
            if not brand_found and pg > 1:
                break
            slugs.update(brand_found)
            print(f"  Page {pg}: {len(brand_found)} brand slugs found (total: {len(slugs)})")
        await browser.close()
    return list(slugs)

async def scrape_package_page(client, slug):
    """Scrape a single HDmall brand/clinic page for packages."""
    url = f"{BASE}/health-checkup/{slug}"
    try:
        r = await client.get(url, timeout=15)
        if r.status_code != 200:
            return None, []
        html = r.text

        # Clinic name from h1
        name_m = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        name = name_m.group(1).strip() if name_m else slug

        packages = []
        # JSON-LD ItemList
        for jld_text in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL):
            try:
                data = json.loads(jld_text)
                items = []
                if data.get('@type') == 'ItemList':
                    items = data.get('itemListElement', [])
                for item in items:
                    obj = item.get('item', item)
                    pkg_name = obj.get('name', '')
                    offers = obj.get('offers', {})
                    if isinstance(offers, list): offers = offers[0] if offers else {}
                    price = float(offers.get('price', 0) or 0)
                    if pkg_name and price >= 200:
                        packages.append({'name': pkg_name[:200], 'price': price, 'url': url})
            except Exception:
                pass

        # Fallback: data-price attributes
        if not packages:
            for m in re.finditer(r'data-name="([^"]+)"[^>]*data-price="([\d.]+)"', html):
                packages.append({'name': m.group(1)[:200], 'price': float(m.group(2)), 'url': url})

        return name, packages
    except Exception:
        return None, []

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    print("=== Getting HDmall brand slugs (Playwright) ===")
    slugs = await get_brand_slugs_playwright()
    print(f"Total brand slugs: {len(slugs)}")

    if not slugs:
        # Fallback: scrape /health-checkup main listing pages
        print("Fallback: scraping main listing...")
        async with httpx.AsyncClient(headers={'User-Agent': 'Mozilla/5.0 Chrome/125'}, follow_redirects=True) as c:
            for pg in range(1, 15):
                url = f"{BASE}/health-checkup?page={pg}"
                r = await c.get(url, timeout=15)
                found = re.findall(r'href="/health-checkup/([^"/]{3,50})"', r.text)
                found = list(set(s for s in found if s.count('-') <= 5 and not s.startswith('?')))
                if not found:
                    break
                slugs.extend(found)
                await asyncio.sleep(0.3)
        slugs = list(set(slugs))
        print(f"Fallback found: {len(slugs)} slugs")

    new_hospitals = 0; new_packages = 0; updated = 0

    async with httpx.AsyncClient(headers={'User-Agent': 'Mozilla/5.0 Chrome/125'}, follow_redirects=True) as client:
        for i, slug in enumerate(slugs):
            name, packages = await scrape_package_page(client, slug)
            if not name or not packages:
                continue

            hosp_slug = slugify(name)
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM hospitals WHERE slug=%s OR slug=%s", (hosp_slug, slug))
                row = cur.fetchone()
                if row:
                    hid = row['id']
                else:
                    # Determine city
                    city = 'Bangkok'
                    for kw, city_name in [('chiang mai','Chiang Mai'),('phuket','Phuket'),('pattaya','Pattaya'),
                                           ('hua hin','Hua Hin'),('samui','Ko Samui'),('krabi','Krabi'),
                                           ('hat yai','Hat Yai'),('udon','Udon Thani'),('korat','Korat'),
                                           ('chiang rai','Chiang Rai')]:
                        if kw in name.lower():
                            city = city_name; break
                    cur.execute(
                        "INSERT INTO hospitals (name,slug,tier,area,city,checkup_url) VALUES (%s,%s,'standard',%s,%s,%s)",
                        (name, hosp_slug, city, city, f"{BASE}/health-checkup/{slug}")
                    )
                    hid = cur.lastrowid
                    new_hospitals += 1

                for pkg in packages:
                    cat = categorize(pkg['name'], pkg['price'])
                    flags = infer_flags(pkg['name'])
                    flags['has_blood'] = 1  # all health checkups have blood tests

                    cur.execute("SELECT id, price FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, pkg['name']))
                    existing = cur.fetchone()
                    if existing:
                        if abs(float(existing['price']) - pkg['price']) > 10:
                            cur.execute("UPDATE checkup_packages SET price=%s WHERE id=%s", (pkg['price'], existing['id']))
                            updated += 1
                    else:
                        cols = ', '.join(flags.keys())
                        vals = ', '.join(['%s'] * len(flags))
                        cur.execute(
                            f"INSERT INTO checkup_packages (hospital_id,name,price,currency,category,source_url,{cols},scraped_at) VALUES (%s,%s,%s,'THB',%s,%s,{vals},NOW())",
                            [hid, pkg['name'], pkg['price'], cat, pkg['url']] + list(flags.values())
                        )
                        new_packages += 1

            if i % 10 == 0:
                print(f"  [{i+1}/{len(slugs)}] {name}: {len(packages)} pkgs")
            await asyncio.sleep(0.4)

    print(f"\nDONE: {new_hospitals} new hospitals, {new_packages} new pkgs, {updated} price updates")
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n FROM hospitals")
        print(f"Total hospitals: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM checkup_packages")
        print(f"Total packages: {cur.fetchone()['n']}")
    conn.close()

asyncio.run(main())
