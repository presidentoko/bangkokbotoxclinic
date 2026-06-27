"""Quick check on remaining hospitals."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

targets = [
    ('Yanhee Hospital', 'https://yanhee.net/health-checkup/', 'yanhee'),
    ('Bangkok Christian', 'https://www.bch.in.th/en/check-up', 'bch'),
    ('Bangkok Christian 2', 'https://www.bch.in.th/health-check-up', 'bch2'),
    ('Sikarin2', 'https://www.sikarinhospital.com/service-eng/health-check-up', 'sikarin2'),
    ('Rajavithi', 'https://www.rajavithi.go.th/rj/?page_id=168', 'rajavithi'),
]

for name, url, slug in targets:
    try:
        r = session.get(url, timeout=10)
        html = r.text
        prices = re.findall(r'(?:฿|baht|thb|price)[\s,]*(\d[\d,]+)', html, re.IGNORECASE)
        valid_prices = [int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000]
        pkg_names = re.findall(r'(?:program|package|checkup|check.up)[^.!?<]{5,60}', html, re.IGNORECASE)
        print(f'{name}: {r.status_code} ({len(html):,} chars)')
        print(f'  Prices: {sorted(set(valid_prices))[:8]}')
        print(f'  Packages: {pkg_names[:3]}')
    except Exception as e:
        print(f'{name}: ERROR {e}')
    print()
