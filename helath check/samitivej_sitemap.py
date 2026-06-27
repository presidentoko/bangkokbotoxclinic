"""Scrape Samitivej packages via sitemap → individual package pages."""
import re, time, json, requests, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36'

# Step 1: Get all package URLs from sitemap
print('Fetching package sitemap...')
r = session.get('https://www.samitivejhospitals.com/sitemap-packages-en.xml', timeout=15)
pkg_urls = re.findall(r'<loc>([^<]+)</loc>', r.text)
print(f'Total package URLs: {len(pkg_urls)}')

# Filter for health checkup URLs
HEALTH_KW = ['health', 'checkup', 'check-up', 'executive', 'annual', 'comprehensive',
              'cancer', 'cardiac', 'wellness', 'screening']
health_urls = [u for u in pkg_urls if any(k in u.lower() for k in HEALTH_KW)]
print(f'Health-related URLs: {len(health_urls)}')
for u in health_urls[:20]:
    print(f'  {u}')

# Step 2: Scrape each package page
print(f'\nScraping {min(len(health_urls), 50)} pages...')

packages = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1200, 'height': 900})
    page = ctx.new_page()

    # Intercept API responses
    api_responses = {}
    def on_resp(resp):
        if 'samitivej' in resp.url and resp.url not in api_responses:
            ct = resp.headers.get('content-type', '')
            if 'json' in ct:
                try:
                    body = resp.body()
                    api_responses[resp.url] = body
                except Exception:
                    pass
    page.on('response', on_resp)

    for i, url in enumerate(health_urls[:50]):
        try:
            page.goto(url, wait_until='networkidle', timeout=15000)
            time.sleep(1)

            # Extract structured data (JSON-LD)
            scripts = page.query_selector_all('script[type="application/ld+json"]')
            price_found = False
            for script in scripts:
                try:
                    d = json.loads(script.inner_text())
                    if isinstance(d, list):
                        d = d[0]
                    price_raw = (d.get('offers', {}) or {}).get('price') or d.get('price')
                    name = d.get('name', '')
                    if price_raw and name:
                        price = float(str(price_raw).replace(',', ''))
                        if 1000 < price < 500000:
                            # Determine hospital branch from URL
                            branch = 'sukhumvit' if 'sukhumvit' in url.lower() or 'svh' in url.lower() else \
                                     'nawamin' if 'nawamin' in url.lower() or 'snh' in url.lower() else \
                                     'srinakarin' if 'srinakarin' in url.lower() or 'srk' in url.lower() else 'general'
                            packages.append({'name': name, 'price': int(price), 'branch': branch, 'url': url})
                            print(f'  [{i}] ✓ {name[:50]} → ฿{price:,.0f} ({branch})')
                            price_found = True
                            break
                except Exception:
                    pass

            if not price_found:
                # Try inner text
                text = page.inner_text('body')
                prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                          if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]
                if prices and i < 5:
                    print(f'  [{i}] text prices: {sorted(set(prices))[:3]} at {url}')

        except Exception as e:
            if i < 5:
                print(f'  [{i}] error: {str(e)[:50]}')

    browser.close()

print(f'\nTotal packages found: {len(packages)}')

# Step 3: Save to DB
if packages:
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        for p in packages:
            slug = f'samitivej-{p["branch"]}' if p['branch'] != 'general' else 'samitivej-general'
            name = f'Samitivej Hospital {p["branch"].capitalize()}'
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if not row:
                cur.execute("INSERT INTO hospitals (name, slug, city, country) VALUES (%s, %s, 'Bangkok', 'Thailand')", (name, slug))
                hosp_id = cur.lastrowid
            else:
                hosp_id = row['id']

            cur.execute("""INSERT INTO checkup_packages (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
                          VALUES (%s, %s, %s, 'comprehensive', TRUE, TRUE, FALSE, FALSE, %s, NOW())
                          ON DUPLICATE KEY UPDATE price=VALUES(price)""",
                       (hosp_id, p['name'], p['price'], p['url']))

        print(f'Inserted {len(packages)} packages')
    conn.close()
