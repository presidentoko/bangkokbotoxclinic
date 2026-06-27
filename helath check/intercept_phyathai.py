"""Intercept network requests on Phyathai to find package API."""
import time, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

api_calls = []

def handle_response(response):
    url = response.url
    if any(k in url for k in ['api', 'package', 'product', 'check', 'json', 'graphql']):
        try:
            if 'phyathai' in url:
                ct = response.headers.get('content-type', '')
                if 'json' in ct or 'javascript' in ct:
                    body = response.body()
                    api_calls.append({'url': url, 'body': body[:2000]})
                    print(f'API: {url[:100]}')
        except Exception:
            pass

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()
    page.on('response', handle_response)

    for slug, url in [
        ('phyathai-1', 'https://www.phyathai.com/en/pyt1/package'),
        ('phyathai-2', 'https://www.phyathai.com/en/pyt2/package'),
    ]:
        print(f'\n=== {slug} ===')
        api_calls.clear()
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(4)
        page.mouse.wheel(0, 1000)
        time.sleep(2)
        page.mouse.wheel(0, 1000)
        time.sleep(2)

        print(f'  API calls captured: {len(api_calls)}')
        for call in api_calls[:10]:
            print(f'  URL: {call["url"][:100]}')
            body_str = call['body'].decode('utf-8', errors='replace')
            # Look for price-like numbers
            prices = re.findall(r'"(?:price|cost|amount)":\s*(\d+)', body_str)
            if prices:
                print(f'  prices in response: {prices[:5]}')
            if len(body_str) < 500:
                print(f'  body: {body_str[:200]}')

    browser.close()
print('done')
