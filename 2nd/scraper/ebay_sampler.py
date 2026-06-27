#!/usr/bin/env python3
"""
eBay completed-sale scraper -> items_db.json price update.
Uses eBay Finding API (free tier, needs EBAY_APP_ID env var).
Get free AppID: https://developer.ebay.com -> My Account -> Application Access Keys
Run: python 2nd/scraper/ebay_sampler.py
"""
import json, os, time, random, subprocess
from datetime import datetime
from pathlib import Path
import requests

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1'

CONDITION_MAP = {
    '1000': 'excellent',  # New
    '1500': 'excellent',  # New other
    '2000': 'excellent',  # Certified refurbished
    '2500': 'very_good',  # Seller refurbished
    '3000': 'very_good',  # Used (good)
    '4000': 'good',       # Very good → map to good
    '5000': 'good',       # Good
    '6000': 'good',       # Acceptable
    '7000': 'good',       # For parts
}

def normalize_condition(condition_id: str) -> str:
    return CONDITION_MAP.get(str(condition_id), 'good')

def recalculate_ranges(samples: list) -> dict:
    by_cond: dict = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }

def trim_samples(samples: list, keep: int = 90) -> list:
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def fetch_ebay_sold(query: str, app_id: str) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    params = {
        'OPERATION-NAME': 'findCompletedItems',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': app_id,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'keywords': query,
        'categoryId': '169291',  # Women's Handbags & Bags
        'itemFilter(0).name': 'SoldItemsOnly',
        'itemFilter(0).value': 'true',
        'itemFilter(1).name': 'Currency',
        'itemFilter(1).value': 'USD',
        'paginationInput.entriesPerPage': '50',
        'sortOrder': 'EndTimeSoonest',
    }
    try:
        r = requests.get(API_URL, params=params, timeout=20)
        r.raise_for_status()
        data = r.json()
        resp = data.get('findCompletedItemsResponse', [{}])[0]
        items = resp.get('searchResult', [{}])[0].get('item', [])
    except Exception as e:
        print(f'  [warn] {e}')
        return []

    results = []
    for item in items:
        try:
            price_str = item.get('sellingStatus', [{}])[0].get('currentPrice', [{}])[0].get('__value__', '0')
            price = float(price_str)
            cid = item.get('condition', [{}])[0].get('conditionId', ['3000'])[0]
            if price < 50:  # filter out junk listings
                continue
            results.append({
                'price': round(price, 2),
                'condition': normalize_condition(cid),
                'platform': 'ebay',
                'date': today,
            })
        except Exception:
            continue
    return results

def run():
    app_id = os.environ.get('EBAY_APP_ID', '')
    if not app_id:
        print('[ebay_sampler] EBAY_APP_ID not set. Get free key at https://developer.ebay.com')
        print('[ebay_sampler] Set: $env:EBAY_APP_ID = "YourAppID-..."')
        return

    with open(DB_PATH) as f:
        db = json.load(f)

    updated = 0
    for item in db['items']:
        # Only scrape handbags and watches on eBay (most relevant categories)
        if item['category'] not in ('handbags', 'watches'):
            continue
        query = f'{item["brand"]} {item["model"]} authentic'
        print(f'Fetching: {query}')
        new_samples = fetch_ebay_sold(query, app_id)
        print(f'  Got {len(new_samples)} sold listings')
        if new_samples:
            item['price_samples'] = trim_samples(
                item.get('price_samples', []) + new_samples
            )
            item['price_ranges'] = recalculate_ranges(item['price_samples'])
            item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
            updated += 1
        time.sleep(random.uniform(1.5, 3))

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode != 0:
        subprocess.run(['git', 'commit', '-m', f'chore(data): ebay price update {datetime.now():%Y-%m-%d}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Pushed.')

if __name__ == '__main__':
    run()
