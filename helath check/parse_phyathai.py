import re

html = open('cache/phyathai2_pkg.html', encoding='utf-8').read()
print('html size:', len(html))

# Find price patterns
prices = re.findall(r'[\d,]{5,}', html)
valid = [int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 1000 < int(p.replace(',','')) < 200000]
print('prices in HTML:', sorted(set(valid))[:15])

# Check for data-price or JSON data
dp = re.findall(r'data-price=["\'](\d+)["\']', html)
print('data-price attrs:', dp[:10])

# Find pkg names near prices
chunks = re.findall(r'.{0,100}[฿฿][\d,]+.{0,100}', html)
for c in chunks[:5]:
    print('chunk:', c[:120])

# API endpoints
import re as re2
urls = re2.findall(r'https?://[a-z0-9._/-]+(?:api|package|checkup)[a-z0-9._/-]*', html)
print('urls:', list(set(urls))[:5])
