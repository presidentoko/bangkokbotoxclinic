"""Scrape Samitivej hospital package prices - all branches."""
import re, time, requests, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

HOSPITALS = [
    ('samitivej-sukhumvit', 'Samitivej Hospital Sukhumvit',
     ['https://www.samitivejhospitals.com/package?hospital=SVH&category=health-check-up',
      'https://www.samitivejhospitals.com/en/health-check-up-package/',
      'https://www.samitivejhospitals.com/package/health-check-up?hospital=SVH']),
    ('samitivej-nawamin', 'Samitivej Hospital Nawamin',
     ['https://www.samitivejhospitals.com/package?hospital=SNH&category=health-check-up',
      'https://www.samitivejhospitals.com/en/health-check-up-package/?hospital=SNH',
      'https://www.samitivejhospitals.com/package/health-check-up?hospital=SNH']),
]

PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)|(\d{1,3}(?:,\d{3})+)\s*(?:บาท|THB)')

def extract_packages(text):
    pkgs = []
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for i, line in enumerate(lines):
        m = PRICE_RE.search(line)
        if m:
            price_str = m.group(1) or m.group(2)
            price = int(price_str.replace(',', ''))
            if 1000 < price < 200000:
                name = ''
                for j in range(i-1, max(i-5,-1), -1):
                    if lines[j] and not re.search(r'[฿฿]|\d{4,}', lines[j]) and len(lines[j]) > 5:
                        name = lines[j]
                        break
                if name:
                    pkgs.append((name, price))
    return pkgs

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    for slug, name, urls in HOSPITALS:
        print(f'\n=== {name} ===')
        pkgs_found = []

        for url in urls:
            try:
                page.goto(url, wait_until='networkidle', timeout=20000)
                time.sleep(3)
                text = page.inner_text('body')
                pkgs = extract_packages(text)
                if pkgs:
                    print(f'  Found {len(pkgs)} packages at {url}')
                    pkgs_found = pkgs
                    break
                else:
                    print(f'  0 packages at {url}')
            except Exception as e:
                print(f'  Error: {e}')

        if not pkgs_found:
            print(f'  No packages found for {name}')
            continue

        with conn.cursor() as cur:
            # Insert hospital if not exists
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if not row:
                cur.execute("""
                    INSERT INTO hospitals (name, slug, city, country, rating, review_count)
                    VALUES (%s, %s, 'Bangkok', 'Thailand', NULL, NULL)
                """, (name, slug))
                hosp_id = cur.lastrowid
                print(f'  Created hospital: {hosp_id}')
            else:
                hosp_id = row['id']

            for pkg_name, price in pkgs_found[:20]:
                cur.execute("""
                    INSERT INTO checkup_packages
                        (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                    VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'samitivej-web', NOW())
                    ON DUPLICATE KEY UPDATE price=VALUES(price)
                """, (hosp_id, pkg_name, price))
            print(f'  Inserted {len(pkgs_found[:20])} packages')

    conn.close()
    browser.close()

print('\ndone')
