"""Scrape Samitivej health checkup - proper URL approach."""
import re, time, json, requests
from playwright.sync_api import sync_playwright

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36'
session.headers['Accept-Language'] = 'th-TH,th;q=0.9,en;q=0.8'

# Try various Samitivej URL patterns
URLS = [
    'https://www.samitivejhospitals.com/package/health-checkup/?lang=en',
    'https://www.samitivejhospitals.com/package/health-checkup/',
    'https://www.samitivejhospitals.com/package/?lang=en&cat=health-checkup',
    'https://www.samitivejhospitals.com/th/package/health-checkup/',
]

print('Direct requests:')
for url in URLS:
    r = session.get(url, timeout=15)
    prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', r.text)
              if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]
    print(f'  {r.status_code} {url.split("samitivej")[1][:50]}: prices={sorted(set(prices))[:5]}')

print('\nPlaywright approach:')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(
        viewport={'width': 1400, 'height': 900},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36'
    )
    page = ctx.new_page()

    # Intercept API
    api_calls = []
    page.on('response', lambda r: api_calls.append(r.url) if 'samitivej' in r.url and r.status < 400 else None)

    page.goto('https://www.samitivejhospitals.com/package/health-checkup/', wait_until='commit', timeout=20000)
    time.sleep(8)

    url = page.url
    text = page.inner_text('body')
    prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
              if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]

    print(f'  URL: {url}')
    print(f'  Prices: {sorted(set(prices))[:10]}')
    print(f'  Text length: {len(text)}')
    print(f'  API calls ({len(api_calls)}):')
    for c in api_calls[:15]:
        print(f'    {c[:100]}')

    if prices:
        # Extract package cards
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        pkgs = {}
        for i, line in enumerate(lines):
            m = re.search(r'[฿฿]([\d,]+)', line)
            if m:
                price = int(m.group(1).replace(',',''))
                if 1000 < price < 200000:
                    for j in range(i-1, max(i-6,-1), -1):
                        if lines[j] and not re.search(r'[฿฿]|\d{4,}', lines[j]) and len(lines[j]) > 5:
                            pkgs[lines[j]] = price
                            break
        print(f'\n  Packages found ({len(pkgs)}):')
        for n, p in list(pkgs.items())[:15]:
            print(f'    ฿{p:,}  {n[:60]}')

    browser.close()
