"""Discover Yanhee hospital URL structure."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Get homepage and sitemap
r = session.get('https://yanhee.net/', timeout=10)
print(f'Homepage: {r.status_code} {len(r.text):,} chars')
# Find internal links related to health checkup
links = re.findall(r'href="([^"]+(?:check|health|package|price)[^"]*)"', r.text, re.IGNORECASE)
print('Checkup links:', links[:10])

# Try sitemap
sitemap = session.get('https://yanhee.net/sitemap.xml', timeout=10)
if sitemap.status_code == 200:
    health_urls = re.findall(r'<loc>([^<]+(?:check|health|package)[^<]*)</loc>', sitemap.text, re.IGNORECASE)
    print(f'Sitemap health URLs: {health_urls[:10]}')
else:
    print(f'Sitemap: {sitemap.status_code}')
