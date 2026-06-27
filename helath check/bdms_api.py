"""Check BDMS group hospitals for API endpoints similar to Phyathai."""
import re, requests, json

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Bangkok Hospital BDMS API
BDMS_APIS = [
    ('BH main', 'https://www.bangkokhospital.com/api/v1/shop/product-group?posts_per_page=50&locale=en&branch=bkk1'),
    ('BH - en packages', 'https://www.bangkokhospital.com/en/promotion/category/health-check-up'),
    ('Samitivej API', 'https://api.samitivejhospitals.com/v1/packages?type=health&locale=en'),
    ('BNH API', 'https://www.bnhhospital.com/api/packages?category=checkup'),
]

for name, url in BDMS_APIS:
    try:
        r = session.get(url, timeout=10)
        print(f'{name}: {r.status_code} ({len(r.text)} chars)')
        if r.status_code == 200 and len(r.text) > 10 and r.text.strip().startswith('[') or r.text.strip().startswith('{'):
            data = r.json()
            print(f'  JSON! {type(data)} len={len(data) if isinstance(data, list) else "dict"}')
            print(f'  Preview: {str(data)[:200]}')
    except Exception as e:
        print(f'{name}: {type(e).__name__}: {str(e)[:50]}')

# Try Phyathai API for other branches (pyt2/pyt3 already done, try others)
for branch in ['bkk1', 'bkk2', 'btc', 'bkk3']:
    url = f'https://www.phyathai.com/api/v1/shop/product-group?posts_per_page=50&locale=en&branch={branch}'
    try:
        r = session.get(url, timeout=8)
        if r.status_code == 200:
            data = r.json()
            health = [p for p in data.get('data', []) if any(kw in (p.get('_title','') or '').lower() for kw in ['check', 'health', 'annual', 'screen'])]
            print(f'Phyathai/{branch}: {len(data.get("data",[]))} total, {len(health)} health')
        else:
            print(f'Phyathai/{branch}: {r.status_code}')
    except Exception as e:
        print(f'Phyathai/{branch}: {type(e).__name__}')
