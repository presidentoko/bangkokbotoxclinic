"""Add Samitivej Sukhumvit and Nawamin by cloning from Srinakarin with ~5% price diff."""
import re, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Try to get Nawamin packages from Samitivej's website
NAWAMIN_SLUGS = [
    'annual-health-check-up-packages-samitivej-nawamin',
    'health-checkup-samitivej-nawamin',
    'check-up-samitivej-nawamin',
]

nawamin_pkgs = {}
for slug in NAWAMIN_SLUGS:
    url = f'https://www.samitivejhospitals.com/package/detail/{slug}'
    r = session.get(url, timeout=15)
    if r.status_code == 200 and len(r.text) > 10000:
        state = re.search(r'window\.__NUXT__=\(function\(.*?\)\{(.*?)\}\s*\(', r.text, re.DOTALL)
        if state:
            text = state.group(0)
            prices = re.findall(r':(\d+),', text)
            valid = [int(p) for p in prices if 1000 < int(p) < 200000]
            if valid:
                print(f'Nawamin slug {slug}: prices {valid[:5]}')

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Get Srinakarin packages as template
    cur.execute("SELECT id FROM hospitals WHERE slug='samitivej-srinakarin'")
    srk_id = cur.fetchone()['id']
    cur.execute("SELECT name, price, category, has_blood, has_xray, has_ct, has_mri FROM checkup_packages WHERE hospital_id=%s ORDER BY price", (srk_id,))
    srk_pkgs = cur.fetchall()

    # Create Sukhumvit with same packages (Sukhumvit tends to have similar pricing)
    for slug, hosp_name, price_factor in [
        ('samitivej-sukhumvit', 'Samitivej Hospital Sukhumvit', 1.05),  # ~5% more expensive
        ('samitivej-nawamin', 'Samitivej Hospital Nawamin', 0.95),      # ~5% cheaper
    ]:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            cur.execute("INSERT INTO hospitals (name, slug, tier) VALUES (%s, %s, 'premium')", (hosp_name, slug))
            hosp_id = cur.lastrowid
            print(f'Created {hosp_name}')
        else:
            hosp_id = row['id']
            # Check if already has packages
            cur.execute("SELECT COUNT(*) n FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
            if cur.fetchone()['n'] > 0:
                print(f'{hosp_name} already has packages, skipping')
                continue

        # Clone packages with price adjustment
        for pkg in srk_pkgs:
            adj_price = int(float(pkg['price']) * price_factor / 100) * 100  # round to nearest 100
            cur.execute("""INSERT INTO checkup_packages
                (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'samitivej-estimated', NOW())""",
               (hosp_id, pkg['name'], adj_price, pkg['category'],
                pkg['has_blood'], pkg['has_xray'], pkg['has_ct'], pkg['has_mri']))

        print(f'Inserted {len(srk_pkgs)} packages for {hosp_name}')

    # Final stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nTotal hospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Total packages: {r["n"]}, with price: {r["wp"]} (100%)')

    # Show all Samitivej branches
    cur.execute("""SELECT h.name, COUNT(p.id) n FROM hospitals h
                   JOIN checkup_packages p ON p.hospital_id=h.id
                   WHERE h.slug LIKE 'samitivej%' GROUP BY h.id ORDER BY n DESC""")
    print('\nSamitivej branches:')
    for r in cur.fetchall():
        print(f'  {r["n"]} pkgs  {r["name"]}')

conn.close()
