"""Scrape Thonburi and Paolo hospitals."""
import re, time, requests, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)')

HOSPITALS = [
    ('thonburi', 'Thonburi Hospital', [
        'https://www.thonburihospital.com/en/health-checkup/',
        'https://www.thonburihospital.com/health-package/',
        'https://www.thonburihospital.com/th/health-package/',
        'https://thonburihospital.com/',
    ]),
    ('paolo-phaholyothin', 'Paolo Hospital Phaholyothin', [
        'https://www.paolobangkok.com/',
        'https://www.paolobangkok.com/health-package/',
        'https://www.paolobangkok.com/en/health-package/',
    ]),
    ('paolo-kaset', 'Paolo Hospital Kaset', [
        'https://www.paolo.co.th/',
        'https://paolohospital.com/',
        'https://www.paolokaset.com/',
        'https://www.paolohospitals.com/',
    ]),
    ('piyavate', 'Piyavate Hospital', [
        'https://www.piyavet.com/',
        'https://www.piyavate.com/',
        'https://piyavate.com/health-check/',
    ]),
    ('sikarin-general', 'Sikarin Hospital', [
        'https://www.sikarin.com/en/health-package/',
        'https://www.sikarin.com/health-package/',
    ]),
]

def try_urls(slug, hosp_name, urls):
    """Try multiple URLs, return packages if found."""
    print(f'\n=== {hosp_name} ===')
    for url in urls:
        try:
            r = session.get(url, timeout=8, allow_redirects=True)
            if r.status_code >= 400:
                print(f'  {r.status_code} {url}')
                continue
            text = re.sub(r'<[^>]+>', ' ', r.text)
            prices = sorted(set(
                int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000
            ))
            print(f'  {r.status_code} {url}: {prices[:5]}')
            if prices:
                return url, prices
        except Exception as e:
            print(f'  ERR {url}: {str(e)[:40]}')
    return None, []

found = {}
for slug, name, urls in HOSPITALS:
    url, prices = try_urls(slug, name, urls)
    if url:
        found[slug] = (name, url, prices)

# Playwright for dynamic sites that had 0 prices but valid 200
print('\n\n=== Playwright for dynamic sites ===')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    for slug, hosp_name, urls in HOSPITALS:
        if slug in found:
            continue
        for url in urls[:2]:
            try:
                resp = page.goto(url, wait_until='networkidle', timeout=15000)
                if resp and resp.status == 200:
                    time.sleep(3)
                    text = page.inner_text('body')
                    prices = sorted(set(
                        int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                        if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000
                    ))
                    print(f'\n{hosp_name}: {len(text)} chars, prices: {prices[:8]}')
                    print(f'  URL: {page.url}')

                    # Extract package cards
                    lines = [l.strip() for l in text.split('\n') if l.strip()]
                    pkgs = {}
                    for i, line in enumerate(lines):
                        m = PRICE_RE.search(line)
                        if m:
                            price = int(m.group(1).replace(',',''))
                            if 1000 < price < 200000:
                                for j in range(i-1, max(i-5,-1), -1):
                                    if lines[j] and not PRICE_RE.search(lines[j]) and len(lines[j]) > 5:
                                        pkgs[lines[j][:100]] = price
                                        break
                    if pkgs:
                        for n, p in list(pkgs.items())[:5]:
                            print(f'  ฿{p:,}  {n[:60]}')
                        found[slug] = (hosp_name, url, list(pkgs.items()))
                        break
            except Exception as e:
                print(f'  {url}: {str(e)[:50]}')

    browser.close()

print(f'\nFound data for: {list(found.keys())}')
