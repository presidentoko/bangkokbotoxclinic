"""Analyze Google Maps HTML to find rating pattern."""
import re, json

html = open('cache/gmaps_bumrungrad.html', encoding='utf-8').read()
print(f'HTML size: {len(html):,}')

# Look for the actual rating value we know: Bumrungrad is ~4.3-4.5 stars
for pattern in [
    r'4\.[2345]',           # Rating number
    r'"stars?"',
    r'aria-label',
    r'review',
    r'ratingValue',
    r'\brating\b',
    r'(\d\.\d)\s*\(',       # 4.3 (
]:
    matches = list(re.finditer(pattern, html, re.IGNORECASE))
    if matches:
        m = matches[0]
        print(f'\nPattern "{pattern}" found {len(matches)}x, first at {m.start()}:')
        print(f'  ...{html[max(0,m.start()-30):m.start()+60]}...')

# Look for specific Google Maps data structures
print('\n\nLooking for rating data in JSON arrays...')
# Google Maps often uses this pattern in serialized JS
for m in re.finditer(r'\[[\d.]+,[\d]+,[\d.]+\]', html):
    val = m.group(0)
    try:
        arr = json.loads(val)
        if len(arr) >= 2 and 1.0 <= arr[0] <= 5.0 and arr[1] > 100:
            print(f'  Possible: {val}')
    except Exception:
        pass

# Look for numbers that could be Bumrungrad's ~14,000+ reviews
print('\nLarge review count patterns:')
for m in re.finditer(r'(\d{4,6})', html):
    val = int(m.group(1))
    if 5000 < val < 100000:
        ctx = html[max(0,m.start()-50):m.start()+30]
        if any(kw in ctx.lower() for kw in ['review', 'rating', 'star', 'บาท']):
            print(f'  {val} at pos {m.start()}: ...{ctx}...')
