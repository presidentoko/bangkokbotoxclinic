"""Replace Phyathai DB packages with real API data."""
import requests, json, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.phyathai.com/',
    'Accept': 'application/json',
})

BASE = 'https://www.phyathai.com/api/v1/shop/product-group'

HEALTH_KEYWORDS = ['checkup', 'check-up', 'ตรวจสุขภาพ', 'health screening', 'health check',
                   'all you can check', 'active elite', 'executive', 'ctdna',
                   'micronutrient', 'cancer screening', 'สุขภาพ']

SKIP_KEYWORDS = ['surgery', 'ผ่าตัด', 'botox', 'filler', 'juvederm', 'sculptra', 'voluma',
                 'dysport', 'vaccine', 'วัคซีน', 'ipl', 'nk cell', 'sex reassignment',
                 'dental', 'รากเทียม', 'hemorrhoid', 'infusion', 'vitamin drip',
                 'ultrasound', 'echocardiogram', 'doppler', 'flu']

def is_health_checkup(name: str) -> bool:
    name_lower = name.lower()
    for sk in SKIP_KEYWORDS:
        if sk in name_lower:
            return False
    for hk in HEALTH_KEYWORDS:
        if hk in name_lower:
            return True
    return False

def fetch_all_packages(branch):
    all_pkgs = []
    page = 1
    while True:
        r = session.get(BASE, params={
            'posts_per_page': 50, 'locale': 'en', 'branch': branch, 'paged': page
        }, timeout=20)
        if r.status_code != 200:
            break
        d = r.json()
        posts = d.get('posts', [])
        if not posts:
            break
        for p in posts:
            name = p.get('_title', '')
            items = p.get('product_items', [])
            min_price = None
            for item in items:
                for f in ('price', 'sale_price', 'regular_price'):
                    v = item.get(f)
                    if v:
                        try:
                            pv = float(str(v).replace(',', ''))
                            if pv > 0 and (min_price is None or pv < min_price):
                                min_price = pv
                        except Exception:
                            pass
            all_pkgs.append({'name': name, 'price': min_price})

        found = d.get('found_posts', 0)
        if len(all_pkgs) >= found:
            break
        page += 1
    return all_pkgs

# Phyathai-1: manual list (16 total, we know the health ones)
PYT1_CHECKUP = [
    ('Health Screening by Age Group - Under 35 Years',     7690, False, True, False, False),
    ('Health Screening by Age Group - 35-49 Years',       16900, False, True, False, False),
    ('Health Screening by Age Group - 50-59 Years',       27900, False, True, False, False),
    ('Health Screening by Age Group - 60+ Years',         28900, False, True, False, False),
    ('All You Can Check Lite Program',                     19500, False, True, False, False),
    ('All You Can Check Program',                          29500, False, True, True,  False),
    ('All You Can Check Wellness Program',                 59000, False, True, False, False),
]

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # === Phyathai-1 ===
    cur.execute("SELECT id FROM hospitals WHERE slug='phyathai-1'")
    h1 = cur.fetchone()['id']
    cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (h1,))
    print(f'Deleted old phyathai-1 packages: {cur.rowcount}')

    for (name, price, has_ct, has_xray, has_mri, has_blood) in PYT1_CHECKUP:
        cur.execute("""
            INSERT INTO checkup_packages
                (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
            VALUES (%s, %s, %s, 'comprehensive', %s, %s, %s, %s, 'phyathai-api', NOW())
        """, (h1, name, price, has_blood, has_xray, has_ct, has_mri))
    print(f'Inserted {len(PYT1_CHECKUP)} packages for phyathai-1')

    # === Phyathai-2: fetch all + filter ===
    print('\nFetching phyathai-2 packages...')
    pyt2_pkgs = fetch_all_packages('pyt2')
    print(f'Total pyt2 packages: {len(pyt2_pkgs)}')

    health_pkgs = [(p['name'], p['price']) for p in pyt2_pkgs
                   if p['price'] and p['price'] >= 3000 and is_health_checkup(p['name'])]
    print(f'Health checkup packages: {len(health_pkgs)}')
    for n, p in health_pkgs:
        print(f'  ฿{p:>8,.0f}  {n[:60]}')

    cur.execute("SELECT id FROM hospitals WHERE slug='phyathai-2'")
    h2 = cur.fetchone()['id']
    cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (h2,))
    print(f'\nDeleted old phyathai-2 packages: {cur.rowcount}')

    for name, price in health_pkgs:
        cur.execute("""
            INSERT INTO checkup_packages
                (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
            VALUES (%s, %s, %s, 'comprehensive', FALSE, TRUE, FALSE, FALSE, 'phyathai-api', NOW())
        """, (h2, name, int(price)))
    print(f'Inserted {len(health_pkgs)} packages for phyathai-2')

conn.close()
print('\ndone')
