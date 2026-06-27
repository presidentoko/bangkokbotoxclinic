"""Fetch Yanhee health checkup data via WordPress REST API."""
import re, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Search WP API for health checkup pages
for endpoint in [
    '/wp-json/wp/v2/pages?search=health+check&per_page=10',
    '/wp-json/wp/v2/pages?search=checkup&per_page=10',
    '/wp-json/wp/v2/pages?parent=0&per_page=50',
]:
    r = session.get('https://www.yanhee.net' + endpoint, timeout=10)
    data = r.json()
    print(f'\n{endpoint}:')
    if isinstance(data, list):
        for p in data:
            title = p.get('title', {}).get('rendered', '')
            link = p.get('link', '')
            print(f'  [{p.get("id")}] {title} → {link}')

# Also try the health checkup sub-page directly
for path in [
    '/pricing-packages/health-check-up-prices/',
    '/pricing-packages/health-check-up/',
    '/pricing-packages/health-checkup-prices/',
    '/health-check-up-packages/',
    '/health-checkup-packages/',
    '/health-checkup/',
]:
    r = session.get(f'https://www.yanhee.net{path}', timeout=8)
    if r.status_code == 200 and len(r.text) > 5000:
        prices = re.findall(r'(\d[\d,]+)\s*(?:baht|thb|฿)', r.text, re.IGNORECASE)
        valid = [int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000]
        print(f'  OK {path}: {len(r.text):,} chars, prices: {sorted(set(valid))[:5]}')
    elif r.status_code != 404:
        print(f'  {r.status_code} {path}')
