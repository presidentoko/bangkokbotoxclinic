#!/usr/bin/env python3
"""
Weekly scraper: Vestiaire Collective search -> items_db.json price update.
Run from repo root: python 2nd/scraper/price_sampler.py
"""
import json
import re
import time
import random
import subprocess
from datetime import datetime
from pathlib import Path
import requests
from bs4 import BeautifulSoup

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

INTERVAL_HOURS = 168  # weekly

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
]


def normalize_condition(raw: str) -> str:
    raw = raw.lower()
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
    url = f"https://www.vestiairecollective.com/search/?q={query.replace(' ', '+')}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f'  [warn] request failed: {e}')
        return []

    match = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        resp.text, re.DOTALL
    )
    if not match:
        print('  [warn] __NEXT_DATA__ not found')
        return []

    try:
        data = json.loads(match.group(1))
        products = (
            data.get('props', {})
                .get('pageProps', {})
                .get('products', {})
                .get('items', [])
        )
    except (json.JSONDecodeError, AttributeError):
        return []

    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    for p in products[:30]:
        price_data = p.get('price', {})
        cents = price_data.get('cents') or price_data.get('amount')
        if not cents:
            continue
        results.append({
            'price': round(cents / 100, 2),
            'condition': normalize_condition(p.get('condition', '')),
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

        time.sleep(random.uniform(3, 8))

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    subprocess.run(['git', 'commit', '-m', f'chore(data): price update {datetime.now():%Y-%m-%d}'], check=True)
    subprocess.run(['git', 'push'], check=True)
    print('Pushed.')


if __name__ == '__main__':
    # Loop with weekly sleep so watchdog can keep the process alive
    # at a 168h (7-day) cadence without restarting it immediately.
    while True:
        print(f'[price_sampler] run start {datetime.now():%Y-%m-%d %H:%M:%S}')
        run()
        print(f'[price_sampler] sleeping {INTERVAL_HOURS}h until next run')
        time.sleep(INTERVAL_HOURS * 3600)
