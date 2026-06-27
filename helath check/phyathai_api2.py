"""Fetch Phyathai packages via product-group API with correct field names."""
import requests, json, re, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://www.phyathai.com/',
    'Accept': 'application/json',
})

BASE = 'https://www.phyathai.com/api/v1/shop/product-group'

def fetch_packages(branch, category=''):
    params = {'posts_per_page': 50, 'locale': 'en', 'branch': branch, 'paged': 1}
    if category:
        params['category'] = category
    r = session.get(BASE, params=params, timeout=20)
    if r.status_code != 200:
        print(f'  HTTP {r.status_code}')
        return []
    d = r.json()
    posts = d.get('posts', [])
    print(f'  total posts: {d.get("found_posts", "?")}, returned: {len(posts)}')

    results = []
    for p in posts:
        name = p.get('_title', '') or p.get('post_title', '')
        slug = p.get('_slug', '')
        items = p.get('product_items', [])

        # Dig into product_items for price
        min_price = None
        for item in items:
            price_str = item.get('price') or item.get('sale_price') or item.get('regular_price') or ''
            if price_str:
                try:
                    price = float(str(price_str).replace(',', ''))
                    if min_price is None or price < min_price:
                        min_price = price
                except Exception:
                    pass

        terms = p.get('_terms', {})
        cats = terms.get('product_category', []) if isinstance(terms, dict) else []

        results.append({
            'name': name,
            'slug': slug,
            'price': min_price,
            'categories': [c.get('slug', '') for c in cats] if cats else [],
        })

    return results

all_packages = {}
for branch in ['pyt1', 'pyt2']:
    print(f'\n=== {branch} ===')
    pkgs = fetch_packages(branch)
    if pkgs:
        # Print first package structure for debugging
        r0 = session.get(BASE, params={'posts_per_page': 1, 'locale': 'en', 'branch': branch}, timeout=20)
        p0 = r0.json().get('posts', [{}])[0]
        print(f'  First post keys: {list(p0.keys())}')
        items0 = p0.get('product_items', [{}])
        if items0:
            print(f'  First item keys: {list(items0[0].keys())}')
            print(f'  First item sample: {json.dumps(items0[0])[:300]}')

    for p in pkgs:
        cats = p.get('categories', [])
        is_health = any('health' in c or 'check' in c for c in cats) if cats else True
        print(f'  {"[HEALTH]" if is_health else "       "}  ฿{p["price"] or "?":>8}  {p["name"][:60]}  cats={cats[:2]}')

    all_packages[branch] = pkgs

# Now insert health-checkup packages into DB
print('\n=== Inserting to DB ===')
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    for branch, pkgs in all_packages.items():
        slug = 'phyathai-1' if branch == 'pyt1' else 'phyathai-2'
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            continue
        hosp_id = row['id']
        cur.execute("SELECT id, name FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
        db_pkgs = cur.fetchall()

        for p in pkgs:
            if not p['price'] or not p['name']:
                continue
            # Try to match existing package
            matched = [d for d in db_pkgs if p['name'].lower() in d['name'].lower() or d['name'].lower() in p['name'].lower()]
            if matched:
                cur.execute("UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL", (p['price'], matched[0]['id']))
                if cur.rowcount:
                    print(f'  UPDATED {matched[0]["name"][:50]} → ฿{p["price"]:,.0f}')
conn.close()
