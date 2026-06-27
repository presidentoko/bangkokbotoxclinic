"""Extract Samitivej package name+price pairs from Nuxt state."""
import re, json, requests, pymysql
from pathlib import Path
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

def parse_nuxt_args(state_text):
    """Extract name+price pairs from Nuxt function args pattern."""
    # The Nuxt state uses: (function(a,b,...){...}(value1,value2,...))
    # Values alternate between names and prices in context
    func_call = re.search(r'\}\s*\(([^)]{20,})\)\s*\)', state_text, re.DOTALL)
    if not func_call:
        return []

    args_str = func_call.group(1)

    # Extract all string values (potential names)
    str_vals = re.findall(r'"([^"]{5,100})"', args_str)
    # Extract numeric values that look like prices
    num_vals = re.findall(r',\s*(\d+)\s*,', args_str)
    price_nums = [int(n) for n in num_vals if 1000 < int(n) < 200000]

    return str_vals, price_nums

def fetch_and_parse(slug):
    url = f'https://www.samitivejhospitals.com/package/detail/{slug}'
    r = session.get(url, timeout=20)
    html = r.text

    # Get full Nuxt state
    nuxt = re.search(r'window\.__NUXT__\s*=\s*\(function\(.*?\)\{.*?\}\s*\(.*?\)\)', html, re.DOTALL)
    if not nuxt:
        return {}

    state = nuxt.group(0)

    # Method 1: Find item structures - "title":"name" near "price":number
    # Look for context windows around prices
    pkgs = {}
    lines = state.split(',')
    for i, chunk in enumerate(lines):
        price_m = re.search(r':?(\d+)$', chunk.strip())
        if price_m:
            price = int(price_m.group(1))
            if 1000 < price < 200000:
                # Look nearby for a name
                context = ','.join(lines[max(0,i-15):i])
                names = re.findall(r'"([A-Za-z][^"]{5,80})"', context)
                # Take the last meaningful name
                health_names = [n for n in names if any(kw in n.lower() for kw in ['check', 'program', 'health', 'screen', 'cancer', 'executive', 'basic', 'annual', 'aging', 'cardiac'])]
                if health_names:
                    pkgs[health_names[-1]] = price

    return pkgs

# All package slugs to try
SLUGS = {
    'sukhumvit': [
        'annual-health-check-up-packages-samitivej-sukhumvit',
    ],
    'srinakarin': [
        'annual-health-check-up-packages-samitivej-srinakarin',
        'health-screening-programs-for-the-elderly',
        'advance-diabetic-check-up-program',
    ],
}

all_found = {}
for branch, slugs in SLUGS.items():
    print(f'\n=== {branch} ===')
    branch_pkgs = {}
    for slug in slugs:
        print(f'  Fetching {slug}...')
        pkgs = fetch_and_parse(slug)
        print(f'  Found {len(pkgs)} packages')
        for name, price in pkgs.items():
            print(f'    ฿{price:,}  {name[:60]}')
        branch_pkgs.update(pkgs)
    all_found[branch] = branch_pkgs

# Insert new packages for Samitivej Srinakarin
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Update srinakarin with any new packages
    cur.execute("SELECT id FROM hospitals WHERE slug='samitivej-srinakarin'")
    row = cur.fetchone()
    if row and all_found.get('srinakarin'):
        hosp_id = row['id']
        cur.execute("SELECT name, price FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
        existing = {r['name']: r['price'] for r in cur.fetchall()}

        new_added = 0
        for name, price in all_found['srinakarin'].items():
            if name not in existing:
                cur.execute("""INSERT INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                              VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'samitivej-web', NOW())""",
                           (hosp_id, name, price))
                new_added += 1
                print(f'  NEW: {name[:50]} → ฿{price:,}')
        print(f'\nAdded {new_added} new Srinakarin packages')

    # Sukhumvit - create if packages found
    if all_found.get('sukhumvit'):
        cur.execute("SELECT id FROM hospitals WHERE slug='samitivej-sukhumvit'")
        row = cur.fetchone()
        if not row:
            cur.execute("INSERT INTO hospitals (name, slug, city, country) VALUES ('Samitivej Hospital Sukhumvit', 'samitivej-sukhumvit', 'Bangkok', 'Thailand')")
            hosp_id = cur.lastrowid
        else:
            hosp_id = row['id']
        for name, price in all_found['sukhumvit'].items():
            cur.execute("""INSERT IGNORE INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                          VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'samitivej-web', NOW())""",
                       (hosp_id, name, price))
        print(f'Inserted {len(all_found["sukhumvit"])} Sukhumvit packages')

conn.close()
print('\ndone')
