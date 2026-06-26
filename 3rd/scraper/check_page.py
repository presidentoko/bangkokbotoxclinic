from playwright.sync_api import sync_playwright
import json, re

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36')
    try:
        page.goto('https://www.carousell.com/search/?search=chanel+bag&country=TH', wait_until='domcontentloaded', timeout=25000)
        page.wait_for_timeout(5000)
        title = page.title()
        print(f'title: {title}')
        content = page.content()
        print(f'page length: {len(content)}')
        # Check for NEXT_DATA
        pattern = r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>'
        m = re.search(pattern, content, re.DOTALL)
        if m:
            data = json.loads(m.group(1))
            page_props = data.get('props', {}).get('pageProps', {})
            print('NEXT_DATA keys:', list(page_props.keys())[:10])
            # Look for listings
            def find_lists(obj, path='', depth=0):
                if depth > 4: return
                if isinstance(obj, dict):
                    for k, v in obj.items():
                        if isinstance(v, list) and len(v) > 2:
                            if isinstance(v[0], dict) and any(p in str(v[0]).lower() for p in ('price', 'title')):
                                print(f'  listings at {path}.{k}: {len(v)} items, keys={list(v[0].keys())[:8]}')
                        find_lists(v, f'{path}.{k}', depth+1)
                elif isinstance(obj, list) and len(obj) > 2:
                    find_lists(obj[0], f'{path}[0]', depth+1)
            find_lists(page_props)
        else:
            print('No __NEXT_DATA__')
            print('First 500:', content[:500])
    except Exception as e:
        print(f'Error: {e}')
    browser.close()
