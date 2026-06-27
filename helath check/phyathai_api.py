"""Fetch Phyathai packages via discovered API endpoint."""
import requests, json, re, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://www.phyathai.com/',
    'Accept': 'application/json',
})

BASE = 'https://www.phyathai.com/api/v1/shop/product-group'

# Key: what category filter params does phyathai use for health checkup?
# Try different category combinations for each hospital
QUERIES = {
    'phyathai-1': [
        f'{BASE}?posts_per_page=50&locale=en&branch=pyt1&category=health-checkup&paged=1',
        f'{BASE}?posts_per_page=50&locale=en&branch=pyt1&category=checkup&paged=1',
        f'{BASE}?posts_per_page=50&locale=en&branch=pyt1&paged=1',
    ],
    'phyathai-2': [
        f'{BASE}?posts_per_page=50&locale=en&branch=pyt2&category=health-checkup&paged=1',
        f'{BASE}?posts_per_page=50&locale=en&branch=pyt2&paged=1',
    ],
}

for slug, urls in QUERIES.items():
    print(f'\n=== {slug} ===')
    for url in urls:
        print(f'  {url[:100]}')
        r = session.get(url, timeout=15)
        print(f'  status: {r.status_code}')
        if r.status_code == 200:
            try:
                d = r.json()
                posts = d.get('posts', [])
                print(f'  posts: {len(posts)}, total: {d.get("found_posts", "?")}')
                for p in posts[:5]:
                    name = p.get('post_title', '') or p.get('name', '')
                    price = p.get('price') or p.get('regular_price') or p.get('sale_price', '')
                    print(f'    {price!r:>10}  {name[:60]}')
                if posts:
                    print(f'  sample keys: {list(posts[0].keys())[:10]}')
                    break
            except Exception as e:
                print(f'  json error: {e}, body: {r.text[:200]}')

# Also try the _next/data for specific health check slugs
print('\n=== Next.js data API for health check packages ===')
BUILD_ID = '1kVf2kRwTo7H5PkJEmVZC'
CHECK_SLUGS = [
    ('pyt1', 'health-screenings-by-age-35'),
    ('pyt1', 'health-screenings-by-age-50'),
    ('pyt1', 'health-screenings-by-age-60'),
    ('pyt1', 'all-you-can-check-lite-program'),
    ('pyt1', 'all-you-can-check-wellness'),
    ('pyt1', 'all-you-can-check-program-pt1'),
    ('pyt2', 'all-you-can-check-lite-program-pt2'),
    ('pyt2', 'all-you-can-check-wellness-pt2'),
    ('pyt2', 'all-you-can-check-program-pt2'),
]

for branch, pkg_slug in CHECK_SLUGS:
    url = f'https://www.phyathai.com/_next/data/{BUILD_ID}/en/{branch}/package/{pkg_slug}.json?branch={branch}&slug={pkg_slug}'
    r = session.get(url, timeout=10)
    if r.status_code == 200:
        try:
            d = r.json()
            # Navigate to price in pageProps
            pp = d.get('pageProps', {})
            product = pp.get('product', {}) or pp.get('post', {}) or {}
            name = product.get('post_title') or product.get('name') or pkg_slug
            price = product.get('price') or product.get('regular_price') or product.get('sale_price') or '?'
            print(f'  [{branch}] {name[:50]:50} price={price}')
            # Try to find price in nested structure
            d_str = json.dumps(d)
            prices = re.findall(r'"(?:price|sale_price|regular_price)"\s*:\s*"?(\d+)"?', d_str)
            if prices:
                print(f'     prices found: {prices[:5]}')
        except Exception as e:
            print(f'  [{branch}/{pkg_slug}] error: {e}')
    else:
        print(f'  [{branch}/{pkg_slug}] status {r.status_code}')
