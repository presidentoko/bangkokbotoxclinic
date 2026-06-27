"""Try to find Yanhee health checkup data."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Find Yanhee health checkup page
for url in [
    'https://yanhee.net/health-check-up-package/',
    'https://yanhee.net/health-checkup-packages/',
    'https://yanhee.net/en/health-checkup/',
    'https://yanhee.net/checkup/',
    'https://yanhee.net/en/health-check/',
    'https://yanhee.net/service/health-check/',
    'https://yanhee.net/en/package/health-check-up/',
]:
    try:
        r = session.get(url, timeout=8)
        if r.status_code == 200 and len(r.text) > 5000:
            prices = re.findall(r'฿\s*(\d[\d,]+)', r.text)
            valid = [int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000]
            print(f'OK {url}: {len(r.text):,} chars, prices: {sorted(set(valid))[:5]}')
        elif r.status_code == 200:
            print(f'thin {url}: {len(r.text)} chars')
        else:
            print(f'{r.status_code} {url}')
    except Exception as e:
        print(f'ERR {url}: {e}')
