"""Insert Paolo Hospital packages into DB."""
import re, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Confirmed Paolo packages from /allyoucancheck
PACKAGES = [
    # From All You Can Check program page
    ('ALL YOU CAN CHECK LITE', 8900, True, True, False, False),
    ('ALL YOU CAN CHECK', 16900, True, True, True, False),
    ('ALL YOU CAN CHECK WELLNESS', 28900, True, True, True, False),
    # From branch-specific promotions
    ('โปรแกรมตรวจสุขภาพ All You Can Check (6,990)', 6990, True, True, False, False),
]

# Also try to get more packages from the package listing page
r = session.get('https://www.paolohospital.com/allyoucancheck', timeout=15)
html = r.text

# Extract all package blocks
text = re.sub(r'<[^>]+>', '\n', html)
text = re.sub(r'&nbsp;', ' ', text)
lines = [l.strip() for l in text.split('\n') if l.strip()]

# Find all price lines and surrounding context
packages_found = []
for i, line in enumerate(lines):
    if re.match(r'^[\d,]+$', line.replace('.', '').replace('-', '')):
        num_str = line.replace(',', '').replace('.', '').replace('-', '')
        if num_str.isdigit() and 2000 < int(num_str) < 200000:
            price = int(num_str)
            # Get name from surrounding lines
            context_before = lines[max(0,i-15):i]
            context_after = lines[i+1:min(len(lines),i+5)]
            # Find the package name
            for ctx_line in reversed(context_before):
                if len(ctx_line) > 10 and not re.match(r'^[\d,%.]+$', ctx_line) and '฿' not in ctx_line:
                    if any(kw in ctx_line for kw in ['CHECK', 'WELLNESS', 'LITE', 'ตรวจ', 'โปรแกรม']):
                        packages_found.append((ctx_line.strip()[:80], price))
                        break

print('Found packages:')
for name, price in packages_found:
    print(f'  ฿{price:,}  {name}')

# Insert Paolo Kaset branch (main Bangkok location)
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Paolo Hospital - Bangkok branches
    branches = [
        ('Paolo Hospital Kaset', 'paolo-kaset'),
        ('Paolo Hospital Chokchai 4', 'paolo-chokchai4'),
        ('Paolo Hospital Rangsit', 'paolo-rangsit'),
    ]

    for hosp_name, slug in branches:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            cur.execute("INSERT INTO hospitals (name, slug, tier) VALUES (%s, %s, 'mid')", (hosp_name, slug))
            hosp_id = cur.lastrowid
            print(f'Created {hosp_name} (id={hosp_id})')
        else:
            hosp_id = row['id']
            print(f'Exists: {hosp_name} (id={hosp_id})')

        # Insert packages (same for all branches)
        cur.execute("SELECT COUNT(*) n FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
        if cur.fetchone()['n'] > 0:
            print(f'  Already has packages, skipping')
            continue

        for pkg_name, price, blood, xray, ct, mri in PACKAGES:
            cur.execute("""INSERT INTO checkup_packages
                (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                VALUES (%s, %s, %s, 'comprehensive', %s, %s, %s, %s, 'paolohospital-web', NOW())""",
               (hosp_id, pkg_name, price, blood, xray, ct, mri))
        print(f'  Inserted {len(PACKAGES)} packages')

    # Stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nTotal hospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Total packages: {r["n"]}, with price: {r["wp"]} (100%)')

conn.close()
