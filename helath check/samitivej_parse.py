"""Parse Samitivej Nuxt state to extract package prices."""
import re, json, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

PKG_SLUGS = {
    'sukhumvit': 'annual-health-check-up-packages-samitivej-sukhumvit',
    'srinakarin': 'annual-health-check-up-packages-samitivej-srinakarin',
    'nawamin': 'health-screening-programs-for-the-elderly',
}

results = {}

for branch, slug in PKG_SLUGS.items():
    url = f'https://www.samitivejhospitals.com/package/detail/{slug}'
    print(f'\n=== {branch} ({slug}) ===')
    r = session.get(url, timeout=20)
    html = r.text

    # Extract full Nuxt state script
    nuxt_match = re.search(r'window\.__NUXT__\s*=\s*\(function\(.*?\)\{(.*?)\}\(.*?\)\)', html, re.DOTALL)
    if not nuxt_match:
        nuxt_match = re.search(r'window\.__NUXT__\s*=\s*(\{.*?\})\s*;', html, re.DOTALL)

    if nuxt_match:
        nuxt_raw = nuxt_match.group(0)
        print(f'  Nuxt state found ({len(nuxt_raw)} chars)')

        # Look for price patterns
        prices = re.findall(r'price["\s:=]+(\d+)', nuxt_raw)
        valid = [int(p) for p in prices if 1000 < int(p) < 200000]
        print(f'  Price values in Nuxt: {sorted(set(valid))[:10]}')

        # Look for package names
        names = re.findall(r'(?:title|name|package_name)["\s:=]+"([^"]{5,80})"', nuxt_raw)
        print(f'  Names in Nuxt: {names[:5]}')

        # Look for price_thb or specific Thai price pattern
        thb_prices = re.findall(r'(?:price_thb|thb_price|price_baht)["\s:=]+(\d+)', nuxt_raw)
        print(f'  THB prices: {thb_prices[:5]}')

        # Dump the full state to analyze
        state_file = f'cache/samitivej_{branch}_state.txt'
        with open(state_file, 'w', encoding='utf-8') as f:
            f.write(nuxt_raw)
        print(f'  Saved to {state_file}')

        # Look for the package items list
        items_match = re.search(r'"items"\s*:\s*\[(.*?)\]', nuxt_raw, re.DOTALL)
        if items_match:
            items_raw = items_match.group(1)
            print(f'  Items found: {items_raw[:200]}')

        # Search for specific patterns in the JS arguments
        # The Nuxt state uses function args like (a,b,c,...) with references
        # Let's find all argument values
        func_call = re.search(r'\}\s*\(([^)]+)\)\)', nuxt_raw)
        if func_call:
            args = func_call.group(1)
            print(f'  Function args preview: {args[:200]}')
            arg_values = [a.strip().strip('"\'') for a in args.split(',')]
            # Find price-like values in args
            price_args = [(i,v) for i,v in enumerate(arg_values) if v.isdigit() and 1000 < int(v) < 200000]
            print(f'  Price-like args: {price_args[:10]}')
    else:
        print('  No Nuxt state found')
        # Save raw HTML for inspection
        with open(f'cache/samitivej_{branch}.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  Saved HTML to cache/samitivej_{branch}.html')
