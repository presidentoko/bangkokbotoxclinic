"""Debug what Google returns."""
import re, requests

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

r = session.get('https://www.google.com/search?q=Bumrungrad+International+Hospital+Bangkok&hl=en', timeout=15)
html = r.text
print(f'Status: {r.status_code}, Size: {len(html):,}')
print(f'Title: {re.search("<title>(.*?)</title>", html, re.IGNORECASE).group(1) if re.search("<title>(.*?)</title>", html) else "no title"}')

# Check for CAPTCHA or bot detection
if 'unusual traffic' in html.lower() or 'captcha' in html.lower() or 'robot' in html.lower():
    print('CAPTCHA/Bot detection triggered')
elif len(html) < 5000:
    print('Very short response - likely blocked')
    print(html[:500])
else:
    # Look for rating patterns
    print('\nSearching for rating patterns...')
    for pattern in ['ratingValue', 'reviewCount', '4\.', 'stars', 'review', r'\d\.\d']:
        m = re.search(pattern, html, re.IGNORECASE)
        if m:
            print(f'  Found "{pattern}" at pos {m.start()}: ...{html[max(0,m.start()-20):m.start()+40]}...')

    # Check JSON-LD
    jlds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    print(f'\nJSON-LD blocks: {len(jlds)}')
    for jld in jlds[:2]:
        print(f'  {jld[:100]}')
