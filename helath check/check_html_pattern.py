"""Check the full cached Bumrungrad HTML for review count patterns."""
import re

html = open('cache/gmaps_bumrungrad_full.html', encoding='utf-8').read()
print(f'Full HTML: {len(html):,} chars')

# Find review count (Bumrungrad should have ~14k+ reviews)
for pat in [
    r'([\d,]+)\s*รีวิว',
    r'([\d,]+)\s*review',
    r'\(([\d,]+)\)',
    r'"(1[0-9],[0-9]{3})"',  # ~10-19k
    r'>([\d,]+)\s*<',
]:
    matches = list(re.finditer(pat, html, re.IGNORECASE))
    for m in matches[:3]:
        val_str = m.group(1).replace(',','')
        if val_str.isdigit() and int(val_str) > 1000:
            print(f'Pattern {pat!r}: {m.group(1)} at pos {m.start()}')
            print(f'  Context: {html[max(0,m.start()-60):m.start()+60]}')
            print()

# Also look for the F7nice class and nearby text
nice_pos = [m.start() for m in re.finditer(r'F7nice', html)]
print(f'\nF7nice found at positions: {nice_pos[:5]}')
for pos in nice_pos[:2]:
    print(f'  Context: {html[pos-20:pos+200]}')
    print()
