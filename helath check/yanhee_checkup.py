"""Scrape Yanhee checkup page and insert into DB."""
import re, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Get checkup page via WP API (page ID 3716)
r = session.get('https://www.yanhee.net/wp-json/wp/v2/pages/3716?_fields=title,content,link', timeout=10)
data = r.json()
print(f'Title: {data.get("title", {}).get("rendered")}')
print(f'Link: {data.get("link")}')

raw_content = data.get('content', {}).get('rendered', '')
print(f'Content: {len(raw_content):,} chars')

# Strip HTML
text = re.sub(r'<[^>]+>', ' ', raw_content)
text = re.sub(r'&[a-z]+;', ' ', text)
text = re.sub(r'\s+', ' ', text).strip()
print(f'Text: {text[:1000]}')

# Also try the rendered page
r2 = session.get('https://www.yanhee.net/medical-services/checkup/', timeout=10)
html = r2.text
print(f'\nPage: {r2.status_code} {len(html):,} chars')

# Check pricing sub-pages
r3 = session.get('https://www.yanhee.net/pricing-packages/', timeout=10)
html3 = r3.text
# Get all child page links
child_links = re.findall(r'<a href="([^"]+pricing[^"]+)"', html3)
print(f'Pricing sub-links: {child_links[:10]}')

# Get page IDs for pricing page children via API
r4 = session.get('https://www.yanhee.net/wp-json/wp/v2/pages?parent=12821&per_page=20', timeout=10)
if r4.status_code == 200:
    children = r4.json()
    for c in children:
        title = c.get('title', {}).get('rendered', '')
        link = c.get('link', '')
        print(f'  [{c["id"]}] {title} → {link}')
        # If health checkup related, get content
        if any(kw in title.lower() for kw in ['health', 'check', 'medical']):
            rc = session.get(f'https://www.yanhee.net/wp-json/wp/v2/pages/{c["id"]}?_fields=content', timeout=8)
            content = re.sub(r'<[^>]+>', ' ', rc.json().get('content', {}).get('rendered', ''))
            prices = re.findall(r'(\d[\d,]+)\s*(?:baht|฿)', content, re.IGNORECASE)
            valid = sorted(set(int(p.replace(',','')) for p in prices if 999 < int(p.replace(',','')) < 200000))
            if valid:
                print(f'    PRICES: {valid[:10]}')
