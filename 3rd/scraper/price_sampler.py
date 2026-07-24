#!/usr/bin/env python3
"""
Weekly scraper: Vestiaire Collective (USD) → THB → items_db.json
Exchange rate from frankfurter.app (free, no key); falls back to 35.0.
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

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
INTERVAL_HOURS = 168

SEARCH_API = 'https://search.vestiairecollective.com/v1/product/search'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://us.vestiairecollective.com/',
    'Origin': 'https://us.vestiairecollective.com',
    'x-usecase': 'plpStandard',
}

CONDITION_MAP = {
    1: 'excellent',
    2: 'excellent',
    3: 'very_good',
    4: 'good',
    5: 'good',
}


def get_usd_to_thb() -> float:
    try:
        r = requests.get('https://api.frankfurter.app/latest?from=USD&to=THB', timeout=10)
        rate = r.json()['rates']['THB']
        print(f'  USD→THB rate: {rate:.2f}')
        return rate
    except Exception as e:
        print(f'  [warn] exchange rate fetch failed ({e}), using 35.0')
        return 35.0


def normalize_condition(raw) -> str:
    if isinstance(raw, dict):
        return CONDITION_MAP.get(raw.get('id', 0), 'good')
    raw = str(raw).lower()
    if any(k in raw for k in ('excellent', 'like new', 'never worn', 'mint', 'pristine')):
        return 'excellent'
    if any(k in raw for k in ('very good', 'great', 'near mint')):
        return 'very_good'
    return 'good'


def recalculate_ranges(samples: list) -> dict:
    by_cond: dict = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }


def trim_samples(samples: list, keep: int = 30) -> list:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def fetch_prices(query: str, rate: float) -> list:
    payload = {
        'pagination': {'offset': 0, 'limit': 30},
        'fields': ['name', 'price', 'condition', 'brand', 'model'],
        'facets': {'fields': ['condition'], 'stats': ['price']},
        'q': query,
        'sortBy': 'relevance',
        'filters': {},
        'locale': {'country': 'US', 'currency': 'USD', 'language': 'us'},
    }
    headers = {
        **HEADERS,
        'x-deviceid': str(uuid.uuid4()),
        'x-search-session-id': str(uuid.uuid4()),
    }
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        resp = requests.post(SEARCH_API, headers=headers, json=payload, timeout=20)
        resp.raise_for_status()
        items = resp.json().get('items', [])
    except Exception as e:
        print(f'  [warn] {e}')
        return []

    results = []
    for p in items:
        price_data = p.get('price', {})
        cents = price_data.get('cents') or price_data.get('amount')
        if not cents:
            continue
        usd = cents / 100
        thb = round(usd * rate / 500) * 500  # round to nearest 500 THB
        if thb <= 0:
            continue
        results.append({
            'price': thb,
            'condition': normalize_condition(p.get('condition', {})),
            'platform': 'vestiaire',
            'date': today,
        })
    return results


def run():
    rate = get_usd_to_thb()

    with open(DB_PATH) as f:
        db = json.load(f)

    for item in db['items']:
        query = f"{item['brand']} {item['model']}"
        print(f'Fetching: {query}')
        new_samples = fetch_prices(query, rate)
        print(f'  Got {len(new_samples)} samples')

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
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode == 0:
        print('No changes to commit.')
        return

    subprocess.run(
        ['git', 'commit', '-m', f'chore(data): chic price update {datetime.now():%Y-%m-%d}'],
        check=True,
    )
    subprocess.run(['git', 'stash'], check=True)
    try:
        subprocess.run(['git', 'pull', '--rebase'], check=True)
    finally:
        subprocess.run(['git', 'stash', 'pop'], capture_output=True)
    subprocess.run(['git', 'push'], check=True)
    print('Pushed.')


if __name__ == '__main__':
    while True:
        # See 2nd/scraper/price_sampler.py's matching comment — same bug,
        # same fix (timestamp must lead the line for watchdog to parse it;
        # flush=True since a long run() could get force-killed before a
        # block-buffered print ever reaches disk).
        print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [price_sampler_chic] run start', flush=True)
        run()
        print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [price_sampler_chic] sleeping {INTERVAL_HOURS}h', flush=True)
        time.sleep(INTERVAL_HOURS * 3600)
