"""Scrape small Bangkok hospitals with valid domains."""
import re, time, json, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

HOSPITALS = [
    ('nonthavej', 'Nonthavej Hospital', [
        'https://www.nonthavej.co.th/health-checkup.php',
        'https://www.nonthavej.co.th/promotion.php',
        'https://www.nonthavej.co.th/',
    ]),
    ('bangmod', 'Bangmod Hospital', [
        'https://www.bangmodhospital.com/healthcheck/',
        'https://www.bangmodhospital.com/packages/',
        'https://www.bangmodhospital.com/promotion/',
        'https://www.bangmodhospital.com/',
    ]),
    ('kasemrad', 'Kasemrad Hospital Rattanathibet', [
        'https://www.kasemrad.co.th/en/health-package/',
        'https://www.kasemrad.co.th/en/',
        'https://www.kasemrad.co.th/th/health-package/',
        'https://www.kasemrad.co.th/',
    ]),
    ('synphaet', 'Synphaet Hospital', [
        'https://www.synphaet.co.th/en/health-package/',
        'https://www.synphaet.co.th/health-check/',
        'https://www.synphaet.co.th/package/',
        'https://www.synphaet.co.th/',
    ]),
    ('thonburi', 'Thonburi Hospital', [
        'https://www.thonburihospital.com/en/health-check/',
        'https://www.thonburihospital.com/health-check/',
        'https://www.thonburihospital.com/',
    ]),
]

PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)')

def extract_pkgs(text):
    pkgs = {}
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for i, line in enumerate(lines):
        m = PRICE_RE.search(line)
        if m:
            price = int(m.group(1).replace(',',''))
            if 1500 < price < 200000:
                for j in range(i-1, max(i-6,-1), -1):
                    cand = lines[j]
                    if cand and not PRICE_RE.search(cand) and 5 < len(cand) < 100:
                        if not cand.isdigit() and cand not in pkgs:
                            pkgs[cand] = price
                        break
    return pkgs

new_data = {}

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(
        viewport={'width': 1400, 'height': 900},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0',
        locale='th-TH'
    )
    page = ctx.new_page()

    for slug, name, urls in HOSPITALS:
        print(f'\n=== {name} ===')
        best_pkgs = {}

        for url in urls:
            try:
                resp = page.goto(url, wait_until='domcontentloaded', timeout=12000)
                if not resp or resp.status >= 400:
                    print(f'  {resp.status if resp else "?"} {url}')
                    continue
                time.sleep(3)
                # Scroll to load lazy content
                page.mouse.wheel(0, 500)
                time.sleep(1)
                page.mouse.wheel(0, 500)
                time.sleep(1)

                text = page.inner_text('body')
                pkgs = extract_pkgs(text)
                prices_raw = sorted(set(
                    int(m.replace(',','')) for m in PRICE_RE.findall(text)
                    if m.replace(',','').isdigit() and 1500 < int(m.replace(',','')) < 200000
                ))
                print(f'  {resp.status} {url}: {len(text)} chars, {len(pkgs)} named pkgs, raw prices: {prices_raw[:5]}')

                if pkgs and len(pkgs) > len(best_pkgs):
                    best_pkgs = pkgs

                # Also try JSON-LD
                for s in page.query_selector_all('script[type="application/ld+json"]'):
                    try:
                        d = json.loads(s.inner_text())
                        if isinstance(d, list): d = d[0]
                        pname = d.get('name','')
                        price = (d.get('offers',{}) or {}).get('price')
                        if pname and price:
                            best_pkgs[pname] = float(str(price).replace(',',''))
                    except Exception: pass

            except Exception as e:
                print(f'  ERR {url}: {str(e)[:50]}')

        if best_pkgs:
            print(f'  Best: {len(best_pkgs)} packages')
            for n, p in list(best_pkgs.items())[:5]:
                print(f'    ฿{p:,.0f}  {n[:60]}')
            new_data[slug] = (name, best_pkgs)
        else:
            print(f'  No packages found')

    browser.close()

# DB insertion
if new_data:
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        for slug, (hosp_name, pkgs) in new_data.items():
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if not row:
                cur.execute("INSERT INTO hospitals (name, slug, city, country) VALUES (%s, %s, 'Bangkok', 'Thailand')", (hosp_name, slug))
                hosp_id = cur.lastrowid
                print(f'Created: {hosp_name}')
            else:
                hosp_id = row['id']
                cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))

            for pkg_name, price in list(pkgs.items())[:20]:
                cur.execute("""INSERT INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                              VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'hospital-web', NOW())""",
                           (hosp_id, pkg_name, int(price)))
            print(f'  Inserted {min(len(pkgs),20)} for {hosp_name}')
    conn.close()

print('\ndone')
