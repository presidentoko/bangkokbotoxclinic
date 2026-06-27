"""Scrape Paolo and other mid-tier hospital packages."""
import re, time, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

TARGETS = [
    # (slug, display_name, [urls_to_try])
    ('paolo-phaholyothin', 'Paolo Hospital Phaholyothin', [
        'https://www.paolo.co.th/promotion/',
        'https://www.paolo.co.th/health-checkup/',
        'https://www.paolohospital.com/en/',
    ]),
    ('yanhee', 'Yanhee Hospital', [
        'https://www.yanhee.net/health-check/',
        'https://www.yanhee.net/package/',
        'https://www.yanhee.net/health-package/',
    ]),
    ('piyavate', 'Piyavate Hospital', [
        'https://www.piyavate.com/packages/',
        'https://www.piyavate.com/health-check/',
        'https://www.piyavate.com/en/packages/',
    ]),
    ('nonthavej', 'Nonthavej Hospital', [
        'https://www.nonthavej.co.th/health-checkup.php',
        'https://www.nonthavej.co.th/package/',
        'https://www.nonthavej.co.th/health-package/',
    ]),
    ('bangmod', 'Bangmod Hospital', [
        'https://www.bangmodhospital.com/health-check/',
        'https://www.bangmodhospital.com/packages/',
    ]),
    ('petcharavej', 'Petcharavej Hospital', [
        'https://www.petcharavej.com/health-check/',
        'https://www.petcharavej.com/packages/',
    ]),
    ('synphaet', 'Synphaet Hospital', [
        'https://synphaet.co.th/health-checkup/',
        'https://synphaet.co.th/packages/',
    ]),
    ('kasemrad', 'Kasemrad Hospital', [
        'https://www.kasemrad.co.th/health-checkup/',
        'https://www.kasemrad.co.th/package/',
    ]),
]

PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)')

def extract_packages(text):
    pkgs = []
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for i, line in enumerate(lines):
        m = PRICE_RE.search(line)
        if m:
            price = int(m.group(1).replace(',', ''))
            if 2000 < price < 200000:
                # Look for name in nearby lines
                for j in range(i-1, max(i-6, -1), -1):
                    if lines[j] and not PRICE_RE.search(lines[j]) and len(lines[j]) > 5 and not lines[j].isdigit():
                        pkgs.append((lines[j][:120], price))
                        break
    return pkgs

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    total_new = 0

    for slug, hosp_name, urls in TARGETS:
        print(f'\n=== {hosp_name} ===')
        pkgs_found = []

        for url in urls:
            try:
                resp = page.goto(url, wait_until='domcontentloaded', timeout=12000)
                if not resp or resp.status >= 400:
                    print(f'  {url}: {resp.status if resp else "no resp"}')
                    continue
                time.sleep(2)
                text = page.inner_text('body')
                pkgs = extract_packages(text)
                if pkgs:
                    print(f'  ✓ {url}: {len(pkgs)} packages')
                    pkgs_found = pkgs
                    break
                else:
                    prices_raw = sorted(set(
                        int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                        if m.replace(',','').isdigit() and 2000 < int(m.replace(',','')) < 200000
                    ))
                    print(f'  {url}: no named packages, raw prices: {prices_raw[:5]}')
            except Exception as e:
                print(f'  {url}: {str(e)[:60]}')

        if not pkgs_found:
            continue

        with conn.cursor() as cur:
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if not row:
                cur.execute("""INSERT INTO hospitals (name, slug, city, country) VALUES (%s, %s, 'Bangkok', 'Thailand')""", (hosp_name, slug))
                hosp_id = cur.lastrowid
            else:
                hosp_id = row['id']
                cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))

            for pkg_name, price in pkgs_found[:25]:
                cur.execute("""
                    INSERT INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                    VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'hospital-web', NOW())
                """, (hosp_id, pkg_name, price))
            total_new += min(len(pkgs_found), 25)
            print(f'  → Inserted {min(len(pkgs_found),25)} packages')

    conn.close()
    browser.close()

print(f'\nTotal new packages: {total_new}')
