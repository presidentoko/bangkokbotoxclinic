import re

with open('debug_maps.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find star rating positions and get nearby text
star_positions = [m.start() for m in re.finditer(r'ดาว', html)]
print(f'Found {len(star_positions)} "ดาว" occurrences')

for pos in star_positions[:5]:
    # Get 500 chars around
    ctx = html[max(0, pos-400):pos+200]
    # Look for hospital names
    names = re.findall(r'(?:โรงพยาบาล|Hospital|Clinic|คลินิก|Bumrungrad|Samitivej|Vejthani|Phyathai|Paolo|Praram|BNH)[^<"]{0,50}', ctx, re.IGNORECASE)
    stars = re.findall(r'([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว', ctx)
    if stars:
        print(f'\n★{stars[0][0]} ({stars[0][1]}) — near: {names[:3]}')
        # Show relevant HTML snippet
        clean = re.sub(r'<[^>]+>', ' ', ctx)
        clean = re.sub(r'\s+', ' ', clean)
        print(f'  Text: {clean[:200]}')
