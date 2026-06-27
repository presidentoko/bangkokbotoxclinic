"""Try to get hospital ratings from Wongnai (Thailand's Yelp)."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0'

hospitals = [
    ('bumrungrad', 'Bumrungrad International Hospital'),
    ('vejthani', 'Vejthani Hospital'),
    ('samitivej-srinakarin', 'Samitivej Hospital Srinakarin'),
    ('bangkok-hospital', 'Bangkok Hospital'),
    ('praram9', 'Praram 9 Hospital'),
    ('bnh', 'BNH Hospital'),
    ('phyathai-1', 'Phyathai 1 Hospital'),
    ('phyathai-2', 'Phyathai 2 Hospital'),
]

for slug, name in hospitals:
    # Try Wongnai search
    query = name.replace(' ', '+')
    url = f'https://www.wongnai.com/search?q={query}&category=hospital'
    try:
        r = session.get(url, timeout=10)
        html = r.text
        # Look for rating patterns
        ratings = re.findall(r'"rating"\s*:\s*([\d.]+)', html)
        counts = re.findall(r'"reviewCount"\s*:\s*([\d]+)', html)
        print(f'{name}: {r.status_code} ({len(html):,} chars)')
        if ratings:
            print(f'  Ratings: {ratings[:3]}, Counts: {counts[:3]}')
    except Exception as e:
        print(f'{name}: ERROR {type(e).__name__}')
