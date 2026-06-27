"""Scrape Paolo Hospital health checkup package prices."""
import re, time, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

HOSPITALS = [
    ('paolo-memorial', 'Paolo Memorial Hospital Bangkok',
     'https://www.paolosamitivej.com/promotion/health-check-up/'),
    ('paolo-kaset', 'Paolo Hospital Kaset',
     'https://www.paolohospital.com/en/health-package/'),
    ('paolo-phaholyothin', 'Paolo Hospital Phaholyothin',
     'https://www.paolohospital.com/en/health-package/'),
]

PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)')

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    # Try Paolo Memorial first - it's BDMS group
    for slug, name, url in HOSPITALS[:2]:
        print(f'\n=== {name} ===')
        try:
            page.goto(url, wait_until='networkidle', timeout=20000)
            time.sleep(3)
            text = page.inner_text('body')
            prices = sorted(set(
                int(m.replace(',',''))
                for m in re.findall(r'[฿฿]([\d,]+)', text)
                if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000
            ))
            print(f'  Price-like numbers: {prices[:15]}')

            # Look for package cards with context
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            pkgs = []
            for i, line in enumerate(lines):
                m = PRICE_RE.search(line)
                if m:
                    price = int(m.group(1).replace(',',''))
                    if 1000 < price < 200000:
                        name_candidate = ''
                        for j in range(i-1, max(i-6,-1), -1):
                            if lines[j] and not PRICE_RE.search(lines[j]) and len(lines[j]) > 5:
                                name_candidate = lines[j]
                                break
                        if name_candidate:
                            pkgs.append((name_candidate, price))
                            print(f'  ฿{price:,}  {name_candidate[:60]}')

            if pkgs:
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
                    row = cur.fetchone()
                    if not row:
                        cur.execute("""INSERT INTO hospitals (name, slug, city, country) VALUES (%s, %s, 'Bangkok', 'Thailand')""", (name, slug))
                        hosp_id = cur.lastrowid
                    else:
                        hosp_id = row['id']

                    for pkg_name, price in pkgs[:20]:
                        cur.execute("""
                            INSERT INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                            VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'paolo-web', NOW())
                        """, (hosp_id, pkg_name, price))
                    print(f'  Inserted {min(len(pkgs),20)} packages')

        except Exception as e:
            print(f'  Error: {e}')

    conn.close()
    browser.close()

print('\ndone')
