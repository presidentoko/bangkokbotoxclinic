#!/usr/bin/env python3
"""
Weekly scraper: Carousell Thailand + C2C.in.th → items_db.json (THB prices).
Run from repo root: python 3rd/scraper/price_sampler.py
"""
import json
import time
import random
import subprocess
import uuid
from datetime import datetime
from pathlib import Path

import requests
try:
    from bs4 import BeautifulSoup
except ImportError:
    raise ImportError('Run: pip install beautifulsoup4')

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
INTERVAL_HOURS = 168  # weekly

# --- FILL IN AFTER RUNNING discover_carousell.py (Step 1) ---
# Replace with actual endpoint discovered via Playwright
CAROUSELL_API_URL = 'https://api.carousell.com/flow/2.0/listings/'

CAROUSELL_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://th.carousell.com/',
    'Origin': 'https://th.carousell.com',
}

C2C_BASE = 'https://www.c2c.in.th'


def normalize_condition(raw: str) -> str:
    raw = str(raw).lower()
    # Thai condition strings
    if any(k in raw for k in ('ดีมาก', 'like new', 'never', 'mint', 'excellent', 'brand new')):
        return 'excellent'
    if any(k in raw for k in ('สภาพดี', 'very good', 'great', 'near mint')):
        return 'very_good'
    return 'good'


def recalculate_ranges(samples: list[dict]) -> dict:
    by_cond: dict[str, list[float]] = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }


def trim_samples(samples: list[dict], keep: int = 30) -> list[dict]:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def fetch_carousell_prices(query: str) -> list[dict]:
    """
    Fetch prices from Carousell Thailand.
    UPDATE this function after running discover_carousell.py to use
    the actual API endpoint and payload structure.
    """
    params = {
        'query': query,
        'count': 20,
        'countryCode': 'TH',
    }
    headers = {**CAROUSELL_HEADERS, 'x-request-id': str(uuid.uuid4())}
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        resp = requests.get(CAROUSELL_API_URL, headers=headers, params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        # Adjust key path based on actual API response structure from Step 1
        listings = data.get('data', {}).get('results', []) or data.get('listings', []) or data.get('items', [])
    except Exception as e:
        print(f'  [carousell warn] {e}')
        return []

    results = []
    today = datetime.now().strftime('%Y-%m-%d')
    for listing in listings[:20]:
        price_raw = listing.get('price', {})
        price_thb = None
        if isinstance(price_raw, dict):
            price_thb = price_raw.get('amount') or price_raw.get('value') or price_raw.get('cents')
            if price_thb and price_thb > 10000:  # cents vs units heuristic
                price_thb = price_thb / 100
        elif isinstance(price_raw, (int, float)):
            price_thb = price_raw
        if not price_thb or price_thb < 100:
            continue
        condition_raw = listing.get('condition', '') or listing.get('status', '')
        results.append({
            'price': round(float(price_thb), 0),
            'condition': normalize_condition(condition_raw),
            'platform': 'carousell_th',
            'date': today,
        })
    return results


def fetch_c2c_prices(query: str) -> list[dict]:
    url = f'{C2C_BASE}/search'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
    }
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        resp = requests.get(url, params={'keyword': query}, headers=headers, timeout=20)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
    except Exception as e:
        print(f'  [c2c warn] {e}')
        return []

    results = []
    # C2C.in.th product cards — inspect actual HTML and update selectors if different
    for card in soup.select('.product-item, .item-card, [class*="product"], [class*="listing"]')[:15]:
        price_el = card.select_one('[class*="price"], .price, [itemprop="price"]')
        if not price_el:
            continue
        price_text = price_el.get_text(strip=True).replace(',', '').replace('฿', '').replace('บาท', '').strip()
        try:
            price_thb = float(''.join(c for c in price_text if c.isdigit() or c == '.'))
        except ValueError:
            continue
        if price_thb < 100:
            continue
        condition_el = card.select_one('[class*="condition"], [class*="status"]')
        condition_raw = condition_el.get_text(strip=True) if condition_el else ''
        results.append({
            'price': round(price_thb, 0),
            'condition': normalize_condition(condition_raw),
            'platform': 'c2c_th',
            'date': today,
        })
    return results


def run():
    with open(DB_PATH) as f:
        db = json.load(f)

    for item in db['items']:
        query = f'{item["brand"]} {item["model"]}'
        print(f'Fetching: {query}')

        carousell_samples = fetch_carousell_prices(query)
        c2c_samples = fetch_c2c_prices(query)
        new_samples = carousell_samples + c2c_samples
        print(f'  Carousell: {len(carousell_samples)}, C2C: {len(c2c_samples)}')

        if new_samples:
            item['price_samples'] = trim_samples(
                item.get('price_samples', []) + new_samples
            )
            item['price_ranges'] = recalculate_ranges(item['price_samples'])
            item['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        time.sleep(random.uniform(2, 5))

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    result = subprocess.run(['git', 'diff', '--cached', '--quiet'])
    if result.returncode != 0:  # staged changes exist
        subprocess.run(['git', 'commit', '-m', f'chore(data): chic price update {datetime.now():%Y-%m-%d}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Pushed.')
    else:
        print('No changes to commit.')


if __name__ == '__main__':
    while True:
        print(f'[price_sampler_chic] run start {datetime.now():%Y-%m-%d %H:%M:%S}')
        run()
        print(f'[price_sampler_chic] sleeping {INTERVAL_HOURS}h')
        time.sleep(INTERVAL_HOURS * 3600)
