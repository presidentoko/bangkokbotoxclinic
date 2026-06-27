import re

with open('debug_maps.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find aria-labels that look like business names near /maps/place/ links
# Look for places with ratings nearby
sections = re.findall(r'href="([^"]*place[^"]*)"[^>]*aria-label="([^"]{3,80})"', html)
print('Place links with aria-labels:')
for href, label in sections[:20]:
    print(f'  label="{label}"')

print()
# Find all Thai star ratings with context
star_matches = re.finditer(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
for m in star_matches:
    ctx = html[max(0,m.start()-300):m.start()]
    # Try to find nearest name
    name_m = re.findall(r'aria-label="([^"]{5,60})"[^>]*>', ctx[-200:])
    print(f'  ★{m.group(1)} ({m.group(2)}) — context: {name_m[-2:] if name_m else "?"}')
