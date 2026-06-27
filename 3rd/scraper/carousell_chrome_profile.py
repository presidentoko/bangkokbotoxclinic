#!/usr/bin/env python3
"""
Carousell TH scraper using your real Chrome profile (already logged in).
Chrome must be FULLY CLOSED before running.

Run: python 3rd/scraper/carousell_chrome_profile.py
"""
import json, os, time, random, subprocess
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
CHROME_USER_DATA = Path(os.environ.get('LOCALAPPDATA', '')) / 'Google' / 'Chrome' / 'User Data'

CONDITION_MAP = {
    'brand new': 'excellent', 'like new': 'excellent',
    'lightly used': 'very_good', 'well used': 'good', 'heavily used': 'good',
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
    return {c: {'min': int(min(p)), 'max': int(max(p))} for c, p in by_cond.items() if p}

def trim_samples(samples, keep=30):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def search_carousell(page, query: str) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    captured = []

    def on_response(response):
        url = response.url
        if not any(k in url for k in ['api-service', 'search', 'listing']):
            return
        ct = response.headers.get('content-type', '')
        if 'json' not in ct:
            return
        try:
            body = response.json()
            def find_listings(obj, depth=0):
                if depth > 6 or not isinstance(obj, dict):
                    return []
                for k in ('listingCards', 'listings', 'items', 'results', 'data'):
                    if k in obj:
                        v = obj[k]
                        if isinstance(v, list) and v and isinstance(v[0], dict):
                            if any(pk in str(v[0].keys()).lower() for pk in ('price', 'listing', 'title')):
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
            wait_until='networkidle', timeout=25000
        )
        page.wait_for_timeout(3000)
    except Exception as e:
        print(f'  [nav] {e}')

    for listing in captured:
        try:
            price_thb = None
            for getter in [
                lambda l: l.get('price', {}).get('amount'),
                lambda l: l.get('price', {}).get('value'),
                lambda l: l.get('listingCard', {}).get('price', {}).get('amount'),
            ]:
                try:
                    v = getter(listing)
                    if v and float(v) > 100:
                        price_thb = float(v)
                        break
                except Exception:
                    pass
            if not price_thb:
                continue
            cond = listing.get('condition', {})
            cond_label = cond.get('value', '') if isinstance(cond, dict) else str(cond)
            results.append({
                'price': round(price_thb / 500) * 500,
                'condition': normalize_condition(cond_label),
                'platform': 'carousell_th',
                'date': today,
            })
        except Exception:
            continue
    return results

def run():
    import shutil, tempfile

    with open(DB_PATH) as f:
        db = json.load(f)

    # Copy Chrome profile to temp dir (Chrome blocks debug on default profile)
    src = CHROME_USER_DATA / 'Default'
    tmp_root = Path(tempfile.mkdtemp(prefix='chrome_scrape_'))
    dst = tmp_root / 'Default'
    print(f'Copying Chrome profile to {tmp_root} ...')
    shutil.copytree(str(src), str(dst), ignore=shutil.ignore_patterns('Cache', 'Code Cache', 'GPUCache', 'ShaderCache', 'DawnCache', 'Service Worker'))
    print('Profile copied.')

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            str(tmp_root),
            channel='chrome',
            headless=False,
            viewport={'width': 1280, 'height': 800},
            locale='th-TH',
            args=['--no-sandbox'],
        )
        page = ctx.new_page()
        print('Using copied Chrome profile — logged in sessions active')

        updated = 0
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]}'
            print(f'Fetching: {query}')
            new_samples = search_carousell(page, query)
            print(f'  Got {len(new_samples)} listings')
            if new_samples:
                item['price_samples'] = trim_samples(item.get('price_samples', []) + new_samples)
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(3, 6))

        ctx.close()

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
    run()
