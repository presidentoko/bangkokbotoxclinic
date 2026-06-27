"""Scrape Samitivej individual package detail pages."""
import re, time, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
    'Referer': 'https://www.samitivejhospitals.com/',
})

PKG_URLS = [
    ('sukhumvit', 'https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-sukhumvit'),
    ('srinakarin', 'https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin'),
    ('general', 'https://www.samitivejhospitals.com/package/detail/digital-total-health-solution'),
    ('general', 'https://www.samitivejhospitals.com/package/detail/health-screening-programs-for-the-elderly'),
    ('general', 'https://www.samitivejhospitals.com/package/detail/alzheimer-s-disease-risk-screening-programs'),
    ('general', 'https://www.samitivejhospitals.com/package/detail/advance-diabetic-check-up-program'),
]

# Also try fetching the Samitivej Srinakarin package listing API
API_TRIES = [
    'https://www.samitivejhospitals.com/api/packages?hospital=SVH&lang=en',
    'https://www.samitivejhospitals.com/api/packages?hospital=SNH&lang=en',
    'https://www.samitivejhospitals.com/api/v1/package/list?lang=en',
    'https://www.samitivejhospitals.com/graphql',
]

# Try API endpoints
print('=== Direct API ===')
for url in API_TRIES:
    r = session.get(url, timeout=10)
    print(f'  {r.status_code} {url.split("samitivej")[1][:60]}')
    if r.status_code == 200:
        try:
            print(f'    JSON: {str(r.json())[:100]}')
        except Exception:
            print(f'    HTML size: {len(r.text)} chars')

print('\n=== Package pages ===')
packages = []
for branch, url in PKG_URLS:
    try:
        r = session.get(url, timeout=20)
        print(f'\n{branch}: {r.status_code} ({len(r.text)} chars)')
        if r.status_code == 200 and r.text:
            # Look for prices in raw HTML
            prices = re.findall(r'[฿฿]([\d,]+)', r.text)
            valid = [int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 1000 < int(p.replace(',','')) < 200000]
            print(f'  Prices: {sorted(set(valid))[:10]}')

            # Look for JSON-LD
            jsons = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', r.text, re.DOTALL)
            for j_str in jsons:
                try:
                    d = json.loads(j_str)
                    if isinstance(d, list): d = d[0]
                    price = (d.get('offers', {}) or {}).get('price')
                    name = d.get('name', '')
                    if price and name:
                        packages.append({'branch': branch, 'name': name, 'price': float(str(price).replace(',',''))})
                        print(f'  JSON-LD: {name[:50]} → ฿{price}')
                except Exception:
                    pass

            # Look for price in meta tags
            metas = re.findall(r'product:price:amount["\s]+content="([\d.,]+)"', r.text)
            if metas:
                print(f'  OG price: {metas}')

            # Look for embedded JSON data
            data_matches = re.findall(r'window\.__NUXT__\s*=\s*({.{0,5000}})', r.text, re.DOTALL)
            if data_matches:
                print(f'  Nuxt data found ({len(data_matches[0])} chars)')
                # Try to find prices in Nuxt data
                nuxt_prices = re.findall(r'"price["\s:]+(\d+)', data_matches[0])
                if nuxt_prices:
                    print(f'  Nuxt prices: {nuxt_prices[:5]}')

    except Exception as e:
        print(f'{branch}: {url} → {str(e)[:50]}')

print(f'\nTotal packages with prices: {len(packages)}')
for p in packages:
    print(f'  [{p["branch"]}] {p["name"][:50]} → ฿{p["price"]:,.0f}')
