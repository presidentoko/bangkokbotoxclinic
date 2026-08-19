#!/usr/bin/env python3
"""
Weekly scraper: Vestiaire Collective (USD) → THB → items_db.json
Exchange rate from frankfurter.app (free, no key); falls back to 35.0.
Run from repo root: python 3rd/scraper/price_sampler.py
"""
import json
import math
import re
import unicodedata
import statistics
import time
import random
import subprocess
import sys
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


# --- price range derivation ------------------------------------------------
#
# The search results are not all the product we asked for. A query for
# "Patek Philippe Aquanaut 5167A" returns straps, boxes, service parts and
# outright fakes alongside the watches, and taking a raw min()/max() over that
# let a single 8,500 THB listing set the floor for a 915,000 THB watch — the
# published range read 8,500-4,594,500. A quarter of the catalogue (49 of 190
# items) was showing a range wider than 8x, on a site whose entire purpose is
# telling people what something costs.
#
# Three stages, each aimed at a failure seen in the data:
#   1. Retail window   — drop anything outside 0.2x-5x of retail. Kills the
#                        accessories and the "call for price" artifacts.
#   2. Cluster split   — the survivors are often still bimodal (junk at 200k,
#                        real watches at 1.6M+). Split on the largest >=3x gap
#                        between neighbouring prices and keep the cluster whose
#                        geometric centre sits closest to retail in log space.
#                        Not "the biggest cluster": for the Aquanaut the junk
#                        outnumbered the watches 19 to 11.
#   3. p10-p90 band    — report the middle of what is left rather than its
#                        extremes, so one mispriced listing cannot define the
#                        range.
#
# Anything left whose centre is still 10x off retail is not published at all.
# A missing price is recoverable; a wrong one is what the site exists to avoid.

RETAIL_WINDOW = (0.20, 5.0)
CLUSTER_GAP = 3.0
MIN_SAMPLES = 3
SANITY_WINDOW = (0.10, 10.0)


def _geometric_mean(values: list) -> float:
    return math.exp(sum(math.log(v) for v in values) / len(values))


def _clusters(prices: list) -> list:
    """Split a sorted price list wherever consecutive values jump >= CLUSTER_GAP."""
    prices = sorted(prices)
    out, current = [], [prices[0]]
    for lower, upper in zip(prices, prices[1:]):
        if lower > 0 and upper / lower >= CLUSTER_GAP:
            out.append(current)
            current = [upper]
        else:
            current.append(upper)
    out.append(current)
    return out


def _band(prices: list) -> dict | None:
    prices = sorted(prices)
    if len(prices) < MIN_SAMPLES:
        return None
    # The median is the number to lead with. The midpoint of the band describes
    # nothing once the band is wide: the Twenty~4's (min+max)/2 came to 714,000
    # THB against a real market around 250-380k, where the median lands at
    # 236,000.
    median = int(statistics.median(prices))
    if len(prices) < 4:
        return {'min': int(prices[0]), 'max': int(prices[-1]), 'median': median}
    q = statistics.quantiles(prices, n=10)
    # quantiles() interpolates and will run outside the observed data on small
    # samples — unclamped it produced a -9,500 THB "price". Clamp to what was seen.
    return {
        'min': int(max(prices[0], q[0])),
        'max': int(min(prices[-1], q[8])),
        'median': median,
    }


def credible_prices(prices: list, retail: float) -> set:
    """The subset of `prices` that plausibly describes this exact product."""
    prices = [p for p in prices if p > 0]
    if not prices:
        return set()

    if retail and retail > 0:
        low, high = retail * RETAIL_WINDOW[0], retail * RETAIL_WINDOW[1]
        windowed = [p for p in prices if low <= p <= high]
        # Only trust the window if it left enough to work with; otherwise the
        # retail figure itself is probably wrong and we fall back to the shape
        # of the data.
        if len(windowed) >= MIN_SAMPLES:
            prices = windowed

    groups = _clusters(prices)
    if len(groups) > 1:
        if retail and retail > 0:
            prices = min(groups, key=lambda g: abs(math.log(_geometric_mean(g) / retail)))
        else:
            prices = max(groups, key=len)

    if retail and retail > 0 and prices:
        centre = _geometric_mean(prices)
        if not (SANITY_WINDOW[0] * retail <= centre <= SANITY_WINDOW[1] * retail):
            return set()

    return set(prices)


def recalculate_ranges(samples: list, retail: float = 0) -> dict:
    keep = credible_prices([s['price'] for s in samples], retail)
    by_cond: dict = {}
    for s in samples:
        if s['price'] in keep:
            by_cond.setdefault(s['condition'], []).append(s['price'])
    ranges = {}
    for cond, prices in by_cond.items():
        band = _band(prices)
        if band:
            ranges[cond] = band
    return ranges


def trim_samples(samples: list, keep: int = 30) -> list:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def _norm(s: str) -> str:
    s = unicodedata.normalize('NFD', s or '')
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', s.lower())


def _same_brand(result: dict, brand: str) -> bool:
    return _norm((result.get('brand') or {}).get('name')) == _norm(brand)


def _same_model(result: dict, model: str) -> bool:
    """Vestiaire's model is a family name ("Aquanaut") against our reference
    ("Aquanaut 5167A"), so match by containment rather than equality."""
    theirs = _norm((result.get('model') or {}).get('name'))
    ours = _norm(model)
    return bool(theirs) and (theirs in ours or ours.startswith(theirs))


def fetch_prices(query: str, rate: float, brand: str = '', model: str = '') -> list:
    """Search, then keep only results that are actually the product asked for.

    The API answers an over-specific query by exhausting its exact matches and
    then padding to 30 with generic "watch" relevance. A search for
    "Patek Philippe Aquanaut 5168G Green Dial" came back with 7 Patek watches
    and 23 others — Michael Kors, Gucci Grip, Orient, Longines. Their prices
    were being recorded as Patek prices, which is how a ฿3,000 "Patek Aquanaut"
    reached the site: it was a Michael Kors.

    The response carries structured `brand` and `model`, which the old code
    requested and then never read. Filtering on brand alone takes the Aquanaut
    5168G's spread from 1283x to 7.9x and the Speedmaster's from 32x to 2.8x;
    adding the model check takes the 5168G to 3.5x. The model check is skipped
    when it would leave too little to work with — some listings carry no model
    at all, and thin real data beats none.

    Note this cannot repair what is already stored: samples keep only a price,
    condition and date, with nothing to re-check a brand against. Old samples
    age out through trim_samples over subsequent runs.
    """
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

    total = len(items)
    if brand:
        items = [p for p in items if _same_brand(p, brand)]
    if model:
        narrowed = [p for p in items if _same_model(p, model)]
        if len(narrowed) >= MIN_SAMPLES:
            items = narrowed
    if total and len(items) < total:
        print(f'  filtered {total - len(items)}/{total} off-target results')

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
        new_samples = fetch_prices(query, rate, item['brand'], item['model'])
        print(f'  Got {len(new_samples)} samples')

        if new_samples:
            item['price_samples'] = trim_samples(
                item.get('price_samples', []) + new_samples
            )
            item['price_ranges'] = recalculate_ranges(item['price_samples'], item.get('retail_price_thb', 0))
            item['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        time.sleep(random.uniform(2, 5))

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from scripts.git_sync import commit_and_push
    commit_and_push(DB_PATH, f'chore(data): chic price update {datetime.now():%Y-%m-%d}')

    # A push is not a deploy: the Vercel project has no git connection, so
    # nothing builds unless we ask it to. Skipping this is how the site served
    # a month-old build while this script reported success every day.
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from scripts.deploy_after_data import deploy
    deploy('3rd')


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
