"""Scrape Vejthani missing package prices."""
import re, time, requests

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
})

# Try Vejthani's package listing
URLS = [
    'https://www.vejthani.com/health-package/',
    'https://www.vejthani.com/en/health-package/',
    'https://www.vejthani.com/package/',
    'https://vejthani.com/health-checkup/',
]

for url in URLS:
    r = session.get(url, timeout=15)
    if r.status_code == 200:
        text = r.text
        # Find president packages + prices
        for kw in ['President Lady', 'President Plus Hormones', 'President Plus Micronutrients']:
            # Find text around keyword
            idx = text.lower().find(kw.lower())
            if idx >= 0:
                snippet = text[max(0,idx-50):idx+200]
                prices = re.findall(r'[\d,]{5,}', snippet)
                valid = [int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 3000 < int(p.replace(',','')) < 200000]
                print(f'  [{url}] {kw}: prices={valid}')

print('\nChecking vejthani.com directly...')
for pkg_slug in ['president-lady-age-40', 'president-plus-hormones-gentleman', 'president-plus-micronutrients-lady-non-pap']:
    url = f'https://www.vejthani.com/{pkg_slug}/'
    r = session.get(url, timeout=10)
    print(f'  {pkg_slug}: {r.status_code}')

# Also try HDmall for Vejthani
r = session.get('https://hdmall.co.th/c/vejthani', timeout=15)
if r.status_code == 200:
    prices = re.findall(r'[\d,]{5,}', r.text)
    valid = sorted(set(int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 3000 < int(p.replace(',','')) < 200000))
    print(f'HDmall Vejthani prices: {valid[:10]}')
