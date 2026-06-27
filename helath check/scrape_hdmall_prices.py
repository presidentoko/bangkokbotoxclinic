"""
Re-scrape HDmall for real Bangkok hospital package prices.
Updates existing packages with accurate prices from HDmall.
"""
import re, json, asyncio, pymysql
import httpx
from config import DB_CONFIG

BASE = "https://hdmall.co.th"

async def get_brand_slugs(client):
    slugs = []
    for page in range(1, 6):
        r = await client.get(f"{BASE}/sitemap/health-checkup/brands?page={page}", timeout=15)
        if r.status_code != 200:
            break
        html = r.text
        found = re.findall(r'href="https://hdmall\.co\.th/health-checkup/([^"]+)"', html)
        if not found:
            break
        slugs.extend(found)
        await asyncio.sleep(0.3)
    return list(set(slugs))

async def scrape_brand(client, slug):
    url = f"{BASE}/health-checkup/{slug}"
    try:
        r = await client.get(url, timeout=15)
        if r.status_code != 200:
            return None, []
        html = r.text

        # Get clinic name
        name_m = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        name = name_m.group(1).strip() if name_m else slug

        # Skip non-Bangkok (already handled separately)
        name_lower = name.lower()
        if any(k in name_lower for k in ['chiang mai','chiang rai','phuket','pattaya','hua hin',
                                          'samui','krabi','hat yai','khon kaen','udon','koh chang',
                                          'เชียงใหม่','ภูเก็ต','เชียงราย']):
            return name, []

        packages = []
        # JSON-LD
        jlds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        for jld in jlds:
            try:
                data = json.loads(jld)
                items = data.get('itemListElement', []) if data.get('@type') == 'ItemList' else []
                for item in items:
                    offer = item.get('item', item)
                    pkg_name = offer.get('name', '')
                    price_data = offer.get('offers', {})
                    if isinstance(price_data, list):
                        price_data = price_data[0] if price_data else {}
                    price = float(price_data.get('price', 0) or 0)
                    if pkg_name and price >= 300:
                        packages.append({'name': pkg_name, 'price': price, 'url': url})
            except Exception:
                pass

        # Fallback: data-price cards
        if not packages:
            for m in re.finditer(r'data-name="([^"]+)"[^>]*data-price="([\d.]+)"', html):
                packages.append({'name': m.group(1), 'price': float(m.group(2)), 'url': url})

        return name, packages
    except Exception as e:
        return slug, []

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

def categorize(name, price):
    n = name.lower()
    if re.search(r'cancer|tumor|มะเร็ง|marker', n): return 'cancer'
    if re.search(r'heart|cardiac|หัวใจ', n): return 'heart'
    if re.search(r'women|female|สตรี|gynec', n): return 'women'
    if re.search(r'men|male|ชาย|prostate', n): return 'men'
    if re.search(r'senior|elder|ผู้สูงอายุ', n): return 'senior'
    if price < 3000: return 'basic'
    if price < 8000: return 'standard'
    return 'executive'

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    async with httpx.AsyncClient(
        headers={'User-Agent': 'Mozilla/5.0 Chrome/125'},
        follow_redirects=True
    ) as client:
        print("Fetching brand slugs from HDmall...")
        slugs = await get_brand_slugs(client)
        print(f"Found {len(slugs)} brand pages")

        new_hospitals = 0
        new_packages = 0
        updated_prices = 0

        for i, slug in enumerate(slugs):
            name, packages = await scrape_brand(client, slug)
            if not packages:
                continue

            # Find or create hospital
            hosp_slug = slugify(name)
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM hospitals WHERE slug=%s OR slug=%s", (hosp_slug, slug))
                row = cur.fetchone()
                if row:
                    hid = row['id']
                else:
                    cur.execute(
                        "INSERT INTO hospitals (name, slug, tier, area, city, checkup_url) VALUES (%s,%s,'standard','Bangkok','Bangkok',%s)",
                        (name, hosp_slug, f"{BASE}/health-checkup/{slug}")
                    )
                    hid = cur.lastrowid
                    new_hospitals += 1

            for pkg in packages:
                cat = categorize(pkg['name'], pkg['price'])
                with conn.cursor() as cur:
                    # Check if package exists (try to match by name)
                    cur.execute("SELECT id, price FROM checkup_packages WHERE hospital_id=%s AND name=%s",
                               (hid, pkg['name']))
                    existing = cur.fetchone()
                    if existing:
                        if abs(float(existing['price']) - pkg['price']) > 1:
                            cur.execute("UPDATE checkup_packages SET price=%s, category=%s WHERE id=%s",
                                       (pkg['price'], cat, existing['id']))
                            updated_prices += 1
                    else:
                        cur.execute("""INSERT INTO checkup_packages
                            (hospital_id, name, price, currency, category, source_url,
                             has_blood, has_doctor_consult, scraped_at)
                            VALUES (%s,%s,%s,'THB',%s,%s, 1,1,NOW())""",
                            (hid, pkg['name'], pkg['price'], cat, pkg['url']))
                        new_packages += 1

            if i % 20 == 0:
                print(f"  [{i}/{len(slugs)}] {name}: {len(packages)} pkgs")
            await asyncio.sleep(0.4)

    print(f"\nDONE: {new_hospitals} new hospitals, {new_packages} new pkgs, {updated_prices} price updates")
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE city='Bangkok'")
        print(f"Bangkok hospitals: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM checkup_packages p JOIN hospitals h ON h.id=p.hospital_id WHERE h.city='Bangkok'")
        print(f"Bangkok packages: {cur.fetchone()['n']}")
    conn.close()

asyncio.run(main())
