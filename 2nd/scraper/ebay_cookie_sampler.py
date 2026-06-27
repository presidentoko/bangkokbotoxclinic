#!/usr/bin/env python3
"""
eBay sold-listings scraper using browser session cookies.
First run: python 2nd/scraper/ebay_cookie_sampler.py --login
Normal run: python 2nd/scraper/ebay_cookie_sampler.py
"""
import json, time, random, subprocess, argparse, re
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
COOKIE_FILE = Path(__file__).parent / 'cookies_ebay.json'

CONDITION_KEYWORDS = {
    'new': 'excellent', 'mint': 'excellent', 'never': 'excellent', 'unused': 'excellent',
    'excellent': 'excellent', 'pristine': 'excellent',
    'very good': 'very_good', 'great': 'very_good', 'near mint': 'very_good',
    'good': 'good', 'used': 'good', 'pre-owned': 'good', 'preowned': 'good',
}

def normalize_condition(label: str) -> str:
    l = label.lower()
    for k, v in CONDITION_KEYWORDS.items():
        if k in l:
            return v
    return 'good'

def recalculate_ranges(samples):
    by_cond = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(p)), 'max': int(max(p))}
        for cond, p in by_cond.items() if p
    }

def trim_samples(samples, keep=90):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def do_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = ctx.new_page()
        page.goto('https://www.ebay.com/signin/', wait_until='domcontentloaded')
        print('Log in to eBay in the browser.')
        print('Cookies will be saved automatically after login...')
        try:
            page.wait_for_url(lambda url: 'signin' not in url and 'login' not in url, timeout=120000)
        except Exception:
            pass
        time.sleep(2)
        cookies = ctx.cookies()
        COOKIE_FILE.write_text(json.dumps(cookies, indent=2))
        print(f'Saved {len(cookies)} cookies')
        browser.close()

def search_ebay_sold(page, query: str) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    results = []

    try:
        encoded = query.replace(' ', '+')
        # eBay sold/completed listings URL
        url = f'https://www.ebay.com/sch/i.html?_nkw={encoded}+authentic&_sacat=169291&LH_Sold=1&LH_Complete=1&_sop=15'
        page.goto(url, wait_until='domcontentloaded', timeout=20000)
        page.wait_for_timeout(2000)

        # Extract prices from HTML using page.evaluate
        items_data = page.evaluate('''() => {
            const items = [];
            document.querySelectorAll('.s-item').forEach(el => {
                const priceEl = el.querySelector('.s-item__price');
                const condEl = el.querySelector('.SECONDARY_INFO');
                const titleEl = el.querySelector('.s-item__title');
                if (!priceEl || !titleEl) return;
                const priceText = priceEl.textContent || '';
                const match = priceText.match(/\\$([\\d,]+\\.?\\d*)/);
                if (!match) return;
                const price = parseFloat(match[1].replace(',', ''));
                if (price < 50) return;
                items.push({
                    price: price,
                    condition: condEl ? condEl.textContent : 'Pre-Owned',
                    title: titleEl.textContent
                });
            });
            return items;
        }''')

        for item in items_data:
            results.append({
                'price': round(item['price'], 2),
                'condition': normalize_condition(item.get('condition', 'Pre-Owned')),
                'platform': 'ebay',
                'date': today,
            })
    except Exception as e:
        print(f'  [warn] {e}')

    return results

def run():
    if not COOKIE_FILE.exists():
        print('Run with --login first:')
        print('  python 2nd/scraper/ebay_cookie_sampler.py --login')
        return

    cookies = json.loads(COOKIE_FILE.read_text())
    with open(DB_PATH) as f:
        db = json.load(f)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        )
        ctx.add_cookies(cookies)
        page = ctx.new_page()

        updated = 0
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]}'
            print(f'Fetching eBay: {query}')
            new_samples = search_ebay_sold(page, query)
            print(f'  Got {len(new_samples)} sold listings')
            if new_samples:
                item['price_samples'] = trim_samples(
                    item.get('price_samples', []) + new_samples
                )
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(3, 7))

        browser.close()

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode != 0:
        subprocess.run(['git', 'commit', '-m', f'chore(data): ebay price update {datetime.now():%Y-%m-%d}'], check=True)
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
