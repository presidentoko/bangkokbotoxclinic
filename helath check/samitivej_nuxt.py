"""Extract Samitivej API from Nuxt bundle and find package data."""
import re, json, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Get the Sukhumvit package page HTML
r = session.get('https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-sukhumvit', timeout=20)
html = r.text

# Find embedded data
patterns = [
    (r'window\.__NUXT__\s*=\s*\{(.{0,10000}?)\}\s*;', 'Nuxt state'),
    (r'"price"\s*:\s*"?(\d+)"?', 'price fields'),
    (r'axiosBaseURL["\s:=]+(["\'])(https?://[^"\']+)\1', 'axios base URL'),
    (r'baseURL\s*:\s*["\']([^"\']+)["\']', 'base URL'),
    (r'process\.env\.API_URL\s*[=:]\s*["\']([^"\']+)["\']', 'API URL env'),
    (r'"(https?://[^"]+/api/[^"]+)"', 'API endpoints in JS'),
]

print(f'HTML size: {len(html):,} chars')
print()

for pattern, label in patterns:
    matches = re.findall(pattern, html)
    if matches:
        print(f'{label}: {matches[:3]}')
    else:
        print(f'{label}: NOT FOUND')

# Look for package content in the HTML
# Samitivej SVH package page data might be in a script tag
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f'\nScript tags: {len(scripts)}')
for i, s in enumerate(scripts):
    if 'package' in s.lower() and len(s) > 100:
        if 'price' in s.lower() or 'checkup' in s.lower() or 'health' in s.lower():
            print(f'  Script {i}: {s[:200]}...')

# Also look for _payload.json pattern (Nuxt 3)
payload_urls = re.findall(r'(https?://[^\s"\']+_payload\.json)', html)
if payload_urls:
    print(f'\nPayload URLs: {payload_urls[:3]}')
    for url in payload_urls[:3]:
        pr = session.get(url, timeout=10)
        print(f'  {pr.status_code} {url}')
        if pr.status_code == 200:
            print(f'  Content: {pr.text[:300]}')

# Find the Nuxt chunks manifest
manifest = re.search(r'{"files":\{[^}]+\}}', html)
if manifest:
    print(f'\nManifest found: {manifest.group(0)[:200]}')
