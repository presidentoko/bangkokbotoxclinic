#!/usr/bin/env python3
"""
Weekly scraper: Vestiaire Collective search API -> items_db.json price update.
Calls the internal search API directly (no browser needed).
Run from repo root: python 2nd/scraper/price_sampler.py
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
INTERVAL_HOURS = 168  # weekly

SEARCH_API = 'https://search.vestiairecollective.com/v1/product/search'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://us.vestiairecollective.com/',
    'Origin': 'https://us.vestiairecollective.com',
    'x-usecase': 'plpStandard',
}

# Vestiaire condition IDs -> our normalized values
CONDITION_MAP = {
    1: 'excellent',  # Never worn
    2: 'excellent',  # Excellent condition
    3: 'very_good',  # Very good condition
    4: 'good',       # Good condition
    5: 'good',       # Fair condition
}


def normalize_condition(raw) -> str:
    if isinstance(raw, dict):
        return CONDITION_MAP.get(raw.get('id', 0), 'good')
    raw = str(raw).lower()
    if any(k in raw for k in ('excellent', 'like new', 'never worn', 'mint', 'pristine')):
        return 'excellent'
    if any(k in raw for k in ('very good', 'great', 'near mint')):
        return 'very_good'
    return 'good'


def recalculate_ranges(samples: list[dict]) -> dict:
    by_cond: dict[str, list[float]] = {}
    for s in samples:
        cond = s['condition']
        by_cond.setdefault(cond, []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }


def trim_samples(samples: list[dict], keep: int = 30) -> list[dict]:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def fetch_vestiaire_prices(query: str) -> list[dict]:
    payload = {
        'pagination': {'offset': 0, 'limit': 30},
        'fields': [
            'name', 'description', 'brand', 'model', 'country', 'price', 'discount',
            'link', 'sold', 'likes', 'editorPicks', 'shouldBeGone', 'seller',
            'directShipping', 'local', 'pictures', 'colors', 'size', 'stock',
            'universeId', 'createdAt', 'dutyFree', 'condition',
        ],
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
        results.append({
            'price': round(cents / 100, 2),
            'condition': normalize_condition(p.get('condition', {})),
            'platform': 'vestiaire',
            'date': today,
        })
    return results


def run():
    with open(DB_PATH) as f:
        db = json.load(f)

    for item in db['items']:
        query = f"{item['brand']} {item['model']}"
        print(f'Fetching: {query}')
        new_samples = fetch_vestiaire_prices(query)
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
    subprocess.run(['git', 'commit', '-m', f'chore(data): price update {datetime.now():%Y-%m-%d}'], check=True)
    subprocess.run(['git', 'push'], check=True)
    print('Pushed.')


if __name__ == '__main__':
    while True:
        print(f'[price_sampler] run start {datetime.now():%Y-%m-%d %H:%M:%S}')
        run()
        print(f'[price_sampler] sleeping {INTERVAL_HOURS}h until next run')
        time.sleep(INTERVAL_HOURS * 3600)
