import re

with open('debug_maps2.html', 'r', encoding='utf-8') as f:
    html = f.read()

print(f'Detail page size: {len(html):,}')

# Thai pattern
matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
print(f'Thai star+review pattern: {matches}')

# English pattern
matches_en = re.findall(r'aria-label="([\d.]+)\s*stars?\s*([\d,]+)\s*reviews?"', html, re.IGNORECASE)
print(f'English star+review pattern: {matches_en}')

# Find any number that looks like a rating next to "รีวิว"
m2 = re.findall(r'([\d.]+)[^0-9]{0,20}([\d,]+)\s*รีวิว', html)
print(f'Flexible rating+review: {m2[:5]}')

# Look for the overall rating number - it appears prominently near specific class names
# Google Maps uses class names like "dmRWX", "fontDisplayLarge", "F7nice"
for cls in ['fontDisplayLarge', 'F7nice', 'dmRWX', 'ceNzKf']:
    m = re.search(rf'class="[^"]*{cls}[^"]*"[^>]*>([\d.]+)<', html)
    if m:
        print(f'  {cls}: {m.group(1)}')
    else:
        # Look for class in reversed pattern
        m = re.search(rf'>([\d.]+)</[^>]*class="[^"]*{cls}', html)
        if m:
            print(f'  {cls} (reversed): {m.group(1)}')

# Just look for all rating-looking numbers in the first 50KB
early_html = html[:50000]
stars = re.findall(r'\b([1-5]\.[0-9])\b', early_html)
print(f'\nRating-like numbers in first 50KB: {stars[:20]}')

# Find "รีวิว" context
reviews = re.findall(r'.{0,30}รีวิว.{0,30}', html)
for r in reviews[:10]:
    clean = re.sub(r'<[^>]+>', '', r)
    clean = re.sub(r'\s+', ' ', clean)
    if clean.strip():
        print(f'  "{clean.strip()}"')
