#!/usr/bin/env python3
"""
Carousell Thailand price scraper.
First run: python 3rd/scraper/carousell_sampler.py --login
  -> Opens browser, you log in, cookies saved.
Normal run: python 3rd/scraper/carousell_sampler.py
  -> Headless, uses saved cookies.
"""
import json, time, random, subprocess, argparse
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
COOKIE_FILE = Path(__file__).parent / 'cookies_carousell.json'

CONDITION_MAP = {
    'brand new': 'excellent',
    'like new': 'excellent',
    'lightly used': 'very_good',
    'well used': 'good',
    'heavily used': 'good',
}

def normalize_condition(label: str) -> str:
    l = label.lower().strip()
    for k, v in CONDITION_MAP.items():
        if k in l:
            return v
    return 'good'

def recalculate_ranges(samples):
    by_cond = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items() if prices
    }

def trim_samples(samples, keep=30):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def do_login():
    """Open real Chrome for user to log in, save cookies automatically on success."""
    with sync_playwright() as p:
        # Use real Chrome (not Playwright Chromium) to bypass Cloudflare
        browser = p.chromium.launch(headless=False, channel='chrome', slow_mo=50)
        ctx = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            locale='th-TH',
        )
        page = ctx.new_page()
        page.goto('https://www.carousell.com/login/?next=/', wait_until='domcontentloaded')
        print('Log in to Carousell in the browser window.')
        print('Cookies will be saved automatically after login...')
        try:
            page.wait_for_url(lambda url: '/login' not in url, timeout=120000)
        except Exception:
            pass
        time.sleep(2)
        cookies = ctx.cookies()
        COOKIE_FILE.write_text(json.dumps(cookies, indent=2))
        print(f'Saved {len(cookies)} cookies to {COOKIE_FILE}')
        browser.close()

def search_carousell(page, query: str) -> list:
    """Search Carousell and intercept API response."""
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    captured = []

    def on_response(response):
        url = response.url
        if 'api-service' not in url and 'search' not in url:
            return
        ct = response.headers.get('content-type', '')
        if 'json' not in ct:
            return
        try:
            body = response.json()
            # Carousell returns {data: {results: {listingCards: [...]}}}
            def find_listings(obj, depth=0):
                if depth > 6 or not isinstance(obj, dict):
                    return []
                for k in ('listingCards', 'listings', 'items', 'results', 'data'):
                    if k in obj:
                        v = obj[k]
                        if isinstance(v, list) and len(v) > 0:
                            first = v[0]
                            if isinstance(first, dict) and any(
                                pk in str(first.keys()).lower()
                                for pk in ('price', 'listing', 'title')
                            ):
                                return v
                        elif isinstance(v, dict):
                            r = find_listings(v, depth + 1)
                            if r:
                                return r
                return []

            listings = find_listings(body)
            if listings:
                captured.extend(listings)
        except Exception:
            pass

    page.on('response', on_response)

    try:
        encoded = query.replace(' ', '+')
        page.goto(
            f'https://www.carousell.com/search/?search={encoded}&country_code=TH&sort_by=3',
            wait_until='networkidle',
            timeout=20000
        )
        page.wait_for_timeout(3000)
    except Exception as e:
        print(f'  [nav warn] {e}')

    # Parse captured listings
    for listing in captured:
        try:
            # Try various price field paths
            price_thb = None
            for path in [
                lambda l: l.get('price', {}).get('amount'),
                lambda l: l.get('price', {}).get('value'),
                lambda l: l.get('listingCard', {}).get('price', {}).get('amount'),
                lambda l: int(l.get('priceLabel', '0').replace('฿', '').replace(',', '').strip()) if l.get('priceLabel') else None,
            ]:
                try:
                    v = path(listing)
                    if v and float(v) > 100:
                        price_thb = float(v)
                        break
                except Exception:
                    pass

            if not price_thb:
                continue

            cond_label = (
                listing.get('condition', {}).get('value', '') or
                listing.get('condition', '') or
                'used'
            )
            results.append({
                'price': round(price_thb / 500) * 500,  # round to nearest 500
                'condition': normalize_condition(str(cond_label)),
                'platform': 'carousell_th',
                'date': today,
            })
        except Exception:
            continue

    return results

def run():
    if not COOKIE_FILE.exists():
        print('No cookie file found. Run with --login first:')
        print('  python 3rd/scraper/carousell_sampler.py --login')
        return

    cookies = json.loads(COOKIE_FILE.read_text())

    with open(DB_PATH) as f:
        db = json.load(f)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            locale='th-TH',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        )
        ctx.add_cookies(cookies)
        page = ctx.new_page()

        updated = 0
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]}'
            print(f'Fetching: {query}')
            new_samples = search_carousell(page, query)
            print(f'  Got {len(new_samples)} listings')
            if new_samples:
                item['price_samples'] = trim_samples(
                    item.get('price_samples', []) + new_samples
                )
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(3, 6))

        browser.close()

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode != 0:
        subprocess.run(['git', 'commit', '-m', f'chore(data): carousell_th price update {datetime.now():%Y-%m-%d}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Pushed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--login', action='store_true', help='Open browser to log in and save cookies')
    args = parser.parse_args()
    if args.login:
        do_login()
    else:
        run()
