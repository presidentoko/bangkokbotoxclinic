#!/usr/bin/env python3
"""
Shopee Thailand price scraper.
First run: python 3rd/scraper/shopee_sampler.py --login
Normal run: python 3rd/scraper/shopee_sampler.py
"""
import json, time, random, subprocess, argparse
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
COOKIE_FILE = Path(__file__).parent / 'cookies_shopee.json'

def recalculate_ranges(samples):
    by_cond = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(p)), 'max': int(max(p))}
        for cond, p in by_cond.items() if p
    }

def trim_samples(samples, keep=30):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def do_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 800}, locale='th-TH')
        page = ctx.new_page()
        page.goto('https://shopee.co.th/buyer/login', wait_until='domcontentloaded')
        print('Log in to Shopee in the browser.')
        print('Cookies will be saved automatically after login...')
        try:
            page.wait_for_url(lambda url: '/login' not in url and '/buyer' not in url, timeout=120000)
        except Exception:
            pass
        time.sleep(2)
        cookies = ctx.cookies()
        COOKIE_FILE.write_text(json.dumps(cookies, indent=2))
        print(f'Saved {len(cookies)} cookies')
        browser.close()

def search_shopee(page, query: str) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    captured = []

    def on_response(response):
        url = response.url
        if '/api/v4/search/search_items' not in url and '/api/v2/search_items' not in url:
            return
        try:
            body = response.json()
            items = body.get('items', [])
            if items:
                captured.extend(items)
        except Exception:
            pass

    page.on('response', on_response)
    try:
        encoded = query.replace(' ', '%20')
        page.goto(
            f'https://shopee.co.th/search?keyword={encoded}&sortBy=relevancy',
            wait_until='networkidle',
            timeout=20000,
        )
        page.wait_for_timeout(3000)
    except Exception as e:
        print(f'  [nav warn] {e}')

    for item in captured:
        try:
            item_basic = item.get('item_basic', item)
            price_cents = item_basic.get('price') or item_basic.get('price_min')
            if not price_cents:
                continue
            price_thb = price_cents / 100000  # Shopee stores price * 100000
            if price_thb < 500:  # filter junk
                continue
            results.append({
                'price': round(price_thb / 500) * 500,
                'condition': 'good',  # Shopee doesn't standardize condition well
                'platform': 'shopee_th',
                'date': today,
            })
        except Exception:
            continue

    return results

def run():
    if not COOKIE_FILE.exists():
        print('Run with --login first:')
        print('  python 3rd/scraper/shopee_sampler.py --login')
        return

    cookies = json.loads(COOKIE_FILE.read_text())
    with open(DB_PATH) as f:
        db = json.load(f)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            locale='th-TH',
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        )
        ctx.add_cookies(cookies)
        page = ctx.new_page()

        updated = 0
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]} แท้'  # แท้ = authentic in Thai
            print(f'Fetching: {query}')
            new_samples = search_shopee(page, query)
            print(f'  Got {len(new_samples)} listings')
            if new_samples:
                item['price_samples'] = trim_samples(
                    item.get('price_samples', []) + new_samples
                )
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(4, 8))

        browser.close()

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode != 0:
        subprocess.run(['git', 'commit', '-m', f'chore(data): shopee_th price update {datetime.now():%Y-%m-%d}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Pushed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--login', action='store_true')
    args = parser.parse_args()
    if args.login:
        do_login()
    else:
        run()
