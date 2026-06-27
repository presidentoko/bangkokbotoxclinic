"""Scrape Paolo Hospital health checkup packages."""
import re, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

BASE = 'https://www.paolohospital.com'

# Try different URL patterns for packages
for path in [
    '/en-US/center/Package',
    '/th-TH/center/Package',
    '/en-US/health-checkup',
    '/allyoucancheck',
    '/en-US/allyoucancheck',
]:
    r = session.get(f'{BASE}{path}', timeout=12)
    html = r.text
    print(f'{r.status_code} {BASE}{path} ({len(html):,} chars)')

    # Find prices
    prices_thb = re.findall(r'(\d[\d,]+)\s*(?:บาท|thb|฿)', html, re.IGNORECASE)
    valid = sorted(set(int(p.replace(',','')) for p in prices_thb if 999 < int(p.replace(',','')) < 200000))
    if valid:
        print(f'  THB prices: {valid[:8]}')

    # Look for package names
    pkg_names = re.findall(r'(?:โปรแกรม|package|program|check.?up|checkup)[^<"]{5,80}', html, re.IGNORECASE)
    if pkg_names:
        print(f'  Packages: {pkg_names[:4]}')

    # Check for JSON data
    json_data = re.findall(r'window\.__[A-Z]+__\s*=\s*(\{.*?\})\s*;', html, re.DOTALL)
    if json_data:
        print(f'  JSON data found ({len(json_data[0])} chars)')

    # Check for API endpoints
    api_urls = re.findall(r'"(/api/[^"]{5,60})"', html)
    if api_urls:
        print(f'  API endpoints: {api_urls[:5]}')
    print()

# Try the API endpoints
for api_path in [
    '/api/v1/packages?type=health',
    '/api/packages',
    '/api/v1/center/packages',
    '/api/v2/product/group?type=healthcheck',
]:
    r = session.get(f'{BASE}{api_path}', timeout=8)
    print(f'API {api_path}: {r.status_code} ({len(r.text)} chars)')
    if r.status_code == 200 and len(r.text) > 10:
        print(f'  Content: {r.text[:200]}')
