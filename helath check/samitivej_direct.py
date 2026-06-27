"""Scrape Samitivej health checkup packages - correct URL discovery."""
import re, time, json
import requests
from playwright.sync_api import sync_playwright

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

# Discover correct URLs
TEST_URLS = [
    'https://www.samitivejhospitals.com/en/health-check-up-package/',
    'https://www.samitivejhospitals.com/packages/',
    'https://www.samitivejhospitals.com/health-checkup/',
    'https://www.samitivejhospitals.com/',
    'https://samitivejhospitals.com/',
]

print('=== Testing URLs ===')
for url in TEST_URLS:
    try:
        r = session.get(url, timeout=10, allow_redirects=True)
        prices = re.findall(r'[฿฿]([\d,]+)', r.text)
        valid = [int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 1000 < int(p.replace(',','')) < 200000]
        print(f'  {r.status_code} {url}: {sorted(set(valid))[:5]}')
    except Exception as e:
        print(f'  ERR {url}: {str(e)[:50]}')

print('\n=== Playwright with headless=False ===')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    # Intercept API calls
    api_calls = []
    def on_resp(resp):
        if 'samitivej' in resp.url and ('api' in resp.url or 'package' in resp.url or 'json' in resp.url):
            try:
                body = resp.body()
                api_calls.append({'url': resp.url, 'body': body[:500]})
            except Exception:
                pass

    page.on('response', on_resp)

    try:
        page.goto('https://www.samitivejhospitals.com/', wait_until='networkidle', timeout=20000)
        time.sleep(3)
        # Look for health checkup navigation
        links = page.query_selector_all('a')
        health_links = []
        for link in links:
            href = link.get_attribute('href') or ''
            text = (link.inner_text() or '').strip()
            if 'health' in (href+text).lower() and 'check' in (href+text).lower():
                health_links.append((href, text[:40]))
        print(f'Health check links: {health_links[:5]}')

        if health_links:
            url = health_links[0][0]
            if url.startswith('/'):
                url = 'https://www.samitivejhospitals.com' + url
            page.goto(url, wait_until='networkidle', timeout=20000)
            time.sleep(3)

        text = page.inner_text('body')
        prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                  if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]
        print(f'Current URL: {page.url}')
        print(f'Prices found: {sorted(set(prices))[:10]}')
        print(f'API calls: {len(api_calls)}')
        for c in api_calls[:5]:
            print(f'  {c["url"][:100]}')

    except Exception as e:
        print(f'Error: {e}')

    browser.close()
