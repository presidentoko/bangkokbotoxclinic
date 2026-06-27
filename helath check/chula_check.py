"""Quick check for Chulalongkorn Hospital health checkup packages."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

targets = [
    ('Chulalongkorn', 'https://www.chulahos.com/service/checkup'),
    ('Chulalongkorn 2', 'https://chcheckup.com/'),
    ('Chulalongkorn 3', 'https://www.chula.ac.th/en/academics/faculty-college/medicine/chulalongkorn-hospital/'),
    ('KCMH checkup', 'https://www.kcmh.or.th/service/health-checkup'),
    ('Ramathibodi', 'https://www.rama.mahidol.ac.th/checkup'),
    ('Siriraj', 'https://www.si.mahidol.ac.th/th/checkup'),
    ('Phramongkutklao', 'https://www.pmk.ac.th/service/checkup'),
    ('King Chulalongkorn', 'https://www.kch.ac.th/healthcheck'),
]

for name, url in targets:
    try:
        r = session.get(url, timeout=8)
        html = r.text
        prices = re.findall(r'(\d[\d,]+)\s*(?:บาท|thb|฿)', html, re.IGNORECASE)
        valid = sorted(set(int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000))
        pkg = re.search(r'(?:health.check|ตรวจสุขภาพ|annual|executive)[^<"]{5,50}', html, re.IGNORECASE)
        print(f'{name}: {r.status_code} ({len(html):,} chars)')
        if valid: print(f'  Prices: {valid[:5]}')
        if pkg: print(f'  Found: {pkg.group(0)[:60]}')
    except Exception as e:
        print(f'{name}: ERROR {type(e).__name__}')
