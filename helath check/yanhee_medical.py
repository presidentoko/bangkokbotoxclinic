"""Get Yanhee Medical Services Prices and insert health checkups."""
import re, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Get Medical Services Prices page (ID 791668)
r = session.get('https://www.yanhee.net/wp-json/wp/v2/pages/791668?_fields=title,content', timeout=10)
data = r.json()
raw_html = data.get('content', {}).get('rendered', '')
print(f'Content: {len(raw_html):,} chars')

# Strip HTML but preserve line structure
text = re.sub(r'<br\s*/?>', '\n', raw_html, flags=re.IGNORECASE)
text = re.sub(r'<\/(?:p|div|tr|td|th|li)>', '\n', text, flags=re.IGNORECASE)
text = re.sub(r'<[^>]+>', ' ', text)
text = re.sub(r'&(?:amp|nbsp|gt|lt);', ' ', text)
text = re.sub(r'[ \t]+', ' ', text)

# Find sections
lines = [l.strip() for l in text.split('\n') if l.strip()]
print(f'Lines: {len(lines)}')

# Find health checkup section
in_checkup = False
packages = []
current_name = None

for i, line in enumerate(lines):
    if any(kw in line.lower() for kw in ['check up', 'checkup', 'health check', 'annual check']):
        in_checkup = True
        print(f'\n[CHECKUP SECTION] Line {i}: {line[:100]}')

    if in_checkup or True:  # Show all lines with prices to understand structure
        price_m = re.search(r'(\d[\d,]+)\s*(?:THB|baht|฿)', line, re.IGNORECASE)
        if price_m:
            price = int(price_m.group(1).replace(',', ''))
            if 1000 < price < 200000:
                # Get context around this price
                context = ' | '.join(lines[max(0,i-3):i+1])
                print(f'  PRICE ฿{price:,}: {line[:100]}')

# Show all lines that contain THB or baht or ฿
print('\n\nAll price lines:')
for i, line in enumerate(lines):
    if re.search(r'(\d[\d,]+)\s*(?:THB|baht|฿)', line, re.IGNORECASE):
        print(f'  [{i}] {line[:120]}')
        if i > 0: print(f'       ← {lines[i-1][:80]}')

# Also save full text for inspection
with open('cache/yanhee_medical.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('\nSaved to cache/yanhee_medical.txt')
