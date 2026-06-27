"""Parse Paolo All You Can Check page for package data."""
import re, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

r = session.get('https://www.paolohospital.com/allyoucancheck', timeout=15)
html = r.text
print(f'Status: {r.status_code}, Size: {len(html):,} chars')

# Find package blocks - Paolo AYCC page
# Look for prices in different formats
prices_thb = re.findall(r'(\d[\d,]+)\s*(?:บาท|thb|฿)', html, re.IGNORECASE)
valid_prices = sorted(set(int(p.replace(',','')) for p in prices_thb if 999 < int(p.replace(',','')) < 200000))
print(f'THB prices: {valid_prices}')

# Look for structured data - the page likely has package cards
# Pattern: package name heading + price
text = re.sub(r'<[^>]+>', '\n', html)
text = re.sub(r'&nbsp;', ' ', text)
text = re.sub(r'&[a-z]+;', ' ', text)
text = re.sub(r'[ \t]+', ' ', text)
lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 1]

# Find price contexts
print('\nPrice contexts:')
for i, line in enumerate(lines):
    if '8,900' in line or '8900' in line:
        context = '\n'.join(lines[max(0,i-10):i+10])
        print(context)
        print('---')

# Look for package names with prices
print('\nAll numeric lines (potential prices):')
for i, line in enumerate(lines):
    if re.match(r'^[\d,]+$', line) and 999 < int(line.replace(',','')) < 200000:
        print(f'  [{i}] ฿{line}: context = {lines[i-1][:60] if i>0 else ""} | {lines[i+1][:60] if i<len(lines)-1 else ""}')

# Look for JSON embedded data
json_embeds = re.findall(r'const\s+\w+\s*=\s*(\[.*?\])', html, re.DOTALL)
for j in json_embeds:
    if 'price' in j.lower() and len(j) < 50000:
        print(f'\nJSON embed found ({len(j)} chars): {j[:200]}')
