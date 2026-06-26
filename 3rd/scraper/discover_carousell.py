"""Find Carousell's real search API endpoint via network interception."""
from playwright.sync_api import sync_playwright
import json

hits = []
all_json_calls = []

def on_response(response):
    url = response.url
    skip = ['analytics', 'track', 'log', 'event', 'beacon', 'pixel', 'gtm', 'clarity',
            'hotjar', '.png', '.jpg', '.svg', '.css', '.js', 'font', 'favicon']
    if any(s in url.lower() for s in skip):
        return
    ct = response.headers.get('content-type', '')
    if 'json' not in ct:
        return
    try:
        body = response.json()
        all_json_calls.append({'url': url[:200], 'status': response.status, 'keys': list(body.keys())[:6] if isinstance(body, dict) else type(body).__name__})
        def find_listings(obj, depth=0):
            if depth > 5: return None
            if isinstance(obj, dict):
                for k in ('items', 'listings', 'data', 'results', 'products', 'hits', 'collections'):
                    if k in obj and isinstance(obj[k], list) and len(obj[k]) > 2:
                        first = obj[k][0]
                        if isinstance(first, dict):
                            keys = list(first.keys())
                            if any(p in str(keys).lower() for p in ('price', 'listing', 'title', 'name')):
                                return {'url': url[:200], 'key': k, 'count': len(obj[k]), 'sample_keys': keys[:12]}
                for v in obj.values():
                    r = find_listings(v, depth+1)
                    if r: return r
            return None
        hit = find_listings(body)
        if hit:
            hits.append(hit)
            print(f'[HIT] {hit["url"][:100]} | key={hit["key"]} count={hit["count"]}')
    except Exception:
        pass

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale='th-TH',
        extra_http_headers={'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8'}
    )
    page = ctx.new_page()
    page.on('response', on_response)
    print('Opening www.carousell.com search...')
    try:
        page.goto('https://www.carousell.com/search/?search=chanel+bag&country=TH',
                  wait_until='domcontentloaded', timeout=30000)
        page.wait_for_timeout(8000)
    except Exception as e:
        print(f'goto error: {e}')
    browser.close()

print('\n=== ALL JSON CALLS ===')
for c in all_json_calls:
    print(f"  [{c['status']}] {c['url'][:100]} keys={c['keys']}")

print('\n=== LISTING HITS ===')
print(json.dumps(hits, indent=2, ensure_ascii=False))
