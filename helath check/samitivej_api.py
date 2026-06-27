"""Find Samitivej API endpoint via network interception."""
import re, time, json, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0'

# Check sitemap for package URLs
print('Checking sitemap...')
for url in ['https://www.samitivejhospitals.com/sitemap.xml',
            'https://www.samitivejhospitals.com/sitemap_index.xml']:
    r = session.get(url, timeout=10)
    if r.status_code == 200:
        urls = re.findall(r'<loc>([^<]+)</loc>', r.text)
        health = [u for u in urls if 'health' in u.lower() or 'check' in u.lower() or 'package' in u.lower()]
        print(f'  {len(urls)} URLs, {len(health)} health-related')
        for u in health[:10]:
            print(f'    {u}')
        break

# Try API discovery from JS files
print('\nChecking Nuxt JS for API URLs...')
r = session.get('https://www.samitivejhospitals.com/_nuxt/10389f1.js', timeout=10)
if r.status_code == 200:
    # Look for API URL patterns
    apis = re.findall(r'["\']https?://[^"\']+(?:api|package|checkup|product)[^"\']{0,100}["\']', r.text)
    print(f'  API URLs in JS: {len(apis)}')
    for a in apis[:10]:
        print(f'    {a[:100]}')

    # Look for base URL
    base = re.findall(r'baseURL[:\s]+["\']([^"\']+)["\']', r.text)
    print(f'  baseURL: {base[:3]}')

# Direct API attempts
print('\nTrying direct API endpoints...')
API_ATTEMPTS = [
    'https://www.samitivejhospitals.com/api/packages?category=health-checkup',
    'https://www.samitivejhospitals.com/api/v1/packages?category=health-checkup',
    'https://api.samitivejhospitals.com/packages?category=health-checkup',
    'https://www.samitivejhospitals.com/api/package/list',
    'https://www.samitivejhospitals.com/api/packages',
]
for url in API_ATTEMPTS:
    r = session.get(url, timeout=5)
    print(f'  {r.status_code} {url.split("samitivej")[1][:60]}')
    if r.status_code == 200:
        try:
            d = r.json()
            print(f'    JSON keys: {list(d.keys())[:5] if isinstance(d, dict) else type(d)}')
        except Exception:
            pass
