"""Try other health checkup aggregator sites."""
import re, requests, json

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

targets = [
    ('Packhai', 'https://packhai.com/health-check-up'),
    ('Goodlife', 'https://www.goodlife.co.th/check-up'),
    ('Chekpak', 'https://www.chekpak.com/health-check'),
    ('Ooca health', 'https://ooca.co/health-check'),
    ('Wemass', 'https://wemass.co.th/health-checkup'),
    ('Bedee', 'https://www.bedee.co.th/service/health-checkup'),
]

for name, url in targets:
    try:
        r = session.get(url, timeout=8)
        html = r.text
        prices = re.findall(r'(?:฿|thb|baht)\s*(\d[\d,]+)', html, re.IGNORECASE)
        valid = sorted(set(int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000))
        pkgs = re.findall(r'(?:package|program|check.?up)[^<]{5,50}', html, re.IGNORECASE)
        hospitals = re.findall(r'hospital[^<]{5,30}', html, re.IGNORECASE)
        print(f'{name}: {r.status_code} ({len(html):,} chars)')
        print(f'  Prices: {valid[:5]}')
        print(f'  Packages: {pkgs[:3]}')
        print(f'  Hospitals: {hospitals[:3]}')
    except Exception as e:
        print(f'{name}: ERROR {type(e).__name__}: {e}')
    print()
