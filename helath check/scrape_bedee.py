"""Scrape Bedee.co.th - Thai health check marketplace."""
import re, time, json, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

CARD_PATTERN = re.compile(
    r'data-event-value="([^"]+)"[^>]{0,200}?data-price="([\d.]+)"',
    re.DOTALL
)
PRICE_RE = re.compile(r'[฿฿]\s*([\d,]+)')

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()

    # Capture API responses
    api_data = []
    def on_resp(resp):
        if 'bedee' in resp.url and ('api' in resp.url or 'package' in resp.url or 'json' in resp.url or 'search' in resp.url):
            try:
                body = resp.body()
                if body:
                    api_data.append({'url': resp.url, 'body': body})
            except Exception:
                pass
    page.on('response', on_resp)

    # Try Bedee health checkup
    BEDEE_URLS = [
        'https://www.bedee.com/en/health-checkup',
        'https://www.bedee.com/th/health-checkup',
        'https://bedee.com/health-checkup',
        'https://bedee.com/packages/health-checkup',
    ]

    for url in BEDEE_URLS:
        print(f'\nTrying: {url}')
        try:
            resp = page.goto(url, wait_until='domcontentloaded', timeout=15000)
            if resp and resp.status < 400:
                time.sleep(3)
                text = page.inner_text('body')
                prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', text)
                          if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]
                print(f'  status: {resp.status}, prices: {sorted(set(prices))[:10]}')
                print(f'  URL: {page.url}')
                print(f'  API calls: {len(api_data)}')

                # Look for package listings
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                pkgs = []
                for i, line in enumerate(lines):
                    m = PRICE_RE.search(line)
                    if m:
                        price = int(m.group(1).replace(',', ''))
                        if 1000 < price < 200000:
                            for j in range(i-1, max(i-5,-1), -1):
                                if lines[j] and not PRICE_RE.search(lines[j]) and len(lines[j]) > 5:
                                    pkgs.append((lines[j], price))
                                    break
                if pkgs:
                    print(f'  Packages: {len(pkgs)}')
                    for name, p in pkgs[:10]:
                        print(f'    ฿{p:,}  {name[:60]}')
                    break
            else:
                print(f'  status: {resp.status if resp else "?"}')
        except Exception as e:
            print(f'  error: {str(e)[:60]}')

    # Check API calls
    if api_data:
        for d in api_data[:3]:
            print(f'\nAPI: {d["url"][:100]}')
            try:
                j = json.loads(d['body'])
                print(f'  keys: {list(j.keys())[:5] if isinstance(j, dict) else type(j)}')
            except Exception:
                pass

    browser.close()

# Also try Rabbit Care Health
print('\n\n=== Rabbit Care ===')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = ctx.new_page()

    for url in ['https://www.rabbitcare.com/health-insurance', 'https://www.rabbit.co.th/health']:
        try:
            resp = page.goto(url, wait_until='domcontentloaded', timeout=10000)
            if resp and resp.status < 400:
                time.sleep(2)
                prices = [int(m.replace(',','')) for m in re.findall(r'[฿฿]([\d,]+)', page.inner_text('body'))
                          if m.replace(',','').isdigit() and 1000 < int(m.replace(',','')) < 200000]
                print(f'  {url}: {sorted(set(prices))[:5]}')
        except Exception as e:
            print(f'  {url}: {str(e)[:50]}')
    browser.close()

print('\ndone')
