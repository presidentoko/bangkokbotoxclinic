#!/usr/bin/env python3
"""
Resale value data for /value/* — what each model actually sells for.

    python 3rd/scraper/value_market.py                 # collect + write
    python 3rd/scraper/value_market.py --only chanel-classic-flap-medium
    python 3rd/scraper/value_market.py --loop --ship   # monthly, commit + deploy

Source: Vestiaire Collective's search API (see vestiaire_api.py), sold
listings first. Output:

    3rd/data/value/market.json   — current stats per model (overwritten)
    3rd/data/value/history.json  — one point per model per run (appended)

value_build.py then joins this with retail.json into the files the two sites
read (3rd/data/value/models.json, 2nd/data/value_stats.json).

Retail prices are NOT produced here. They live in data/value/retail.json, one
entry per model with the source it was read from; a model with no sourced
retail gets no depreciation figure and stays out of the rankings. A retail
number typed from memory is how this repo ended up publishing a Datejust
"holding 272% of retail" — the resale side matched gold models, the retail
side was a guess, and nothing checked either.

How a listing earns a place in a model's numbers:
  1. Its Vestiaire model id is one of the family's ids (catalogue.json).
  2. For a size variant, its title/description names that size and names no
     sibling size. Listings that state no size are dropped, not guessed.
  3. Not exotic skin, not an accessory sold under the bag's model name
     (organisers, straps, charms, dust bags), not a fake-adjacent listing.
"""
from __future__ import annotations

import argparse
import json
import re
import statistics
import sys
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vestiaire_api import fetch  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data' / 'value'
CATALOGUE = DATA / 'catalogue.json'
MARKET = DATA / 'market.json'
HISTORY = DATA / 'history.json'
TWIN = ROOT.parent / '2nd' / 'data' / 'value_stats.json'
MODELS = DATA / 'models.json'
# Written after every model, so a run killed halfway (it takes ~90 minutes)
# resumes where it stopped instead of starting over. Deleted on success.
PARTIAL = DATA / 'market.partial.json'

MAX_SOLD = 800
MAX_LIVE = 300
# Below this many matched sales, a model gets no "sold" figure. 12 is enough
# for a median to stop jumping when one listing comes or goes.
MIN_SOLD = 12
MIN_LIVE = 15
MIN_MONTH = 5

EXCLUDE_ALWAYS = re.compile(
    r'organi[sz]er|bag insert|purse insert|\binsert\b|shaper|dust ?bag only|box only|'
    r'strap only|only the strap|\bcharm\b|key ?ring|keychain|replica|inspired|'
    r'not authentic|\bdupe\b|\bdummy\b',
)
EXOTIC = re.compile(
    r'crocodile|alligator|ostrich|python|lizard|\bcroc\b|niloticus|porosus|'
    r'mississippiensis|stingray|galuchat|\bshiny croc',
)


def load_catalogue() -> list[dict]:
    return json.loads(CATALOGUE.read_text(encoding='utf-8'))


def matches(listing: dict, entry: dict) -> bool:
    text = listing['text']
    if EXCLUDE_ALWAYS.search(text):
        return False
    if entry['category'] == 'handbags':
        if not entry.get('any_base') and listing['base'] and listing['base'] != 'Bags':
            return False
        if EXOTIC.search(text):
            return False
    # Size-specific Vestiaire models (e.g. "Birkin 30") need no text rule.
    if listing['model_id'] in entry.get('exact_ids', []):
        pass
    elif entry.get('include'):
        if not re.search(entry['include'], text, re.S):
            return False
    if entry.get('exclude') and re.search(entry['exclude'], text, re.S):
        return False
    return True


def q(values: list[int], p: float) -> int:
    s = sorted(values)
    if not s:
        return 0
    k = (len(s) - 1) * p
    lo, hi = int(k), min(int(k) + 1, len(s) - 1)
    return round(s[lo] + (s[hi] - s[lo]) * (k - lo))


def summary(values: list[int]) -> dict | None:
    if not values:
        return None
    return {'n': len(values), 'median': round(statistics.median(values)),
            'p25': q(values, 0.25), 'p75': q(values, 0.75)}


def month_of(ts: int | None) -> str | None:
    if not ts:
        return None
    return datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m')


def monthly(listings: list[dict], truncated: bool) -> list[dict]:
    """Median and count of matched sales per month listed.

    When the fetch stopped at MAX_SOLD, the oldest month in hand is only
    partly covered, so its count would read as a collapse in volume. Drop it.
    """
    by: dict[str, list[int]] = defaultdict(list)
    for l in listings:
        m = month_of(l['listed'])
        if m:
            by[m].append(l['price'])
    months = sorted(by)
    if truncated and months:
        months = months[1:]
    current = datetime.now(timezone.utc).strftime('%Y-%m')
    out = []
    for m in months:
        if m == current:
            continue  # month in progress
        vals = by[m]
        out.append({'month': m, 'n': len(vals),
                    'median': round(statistics.median(vals)) if len(vals) >= MIN_MONTH else None})
    return out


def collect(entry: dict, family_cache: dict) -> dict:
    ids = sorted(set(entry['ids']) | set(entry.get('exact_ids', [])))
    key = tuple(ids)
    if key not in family_cache:
        sold, sold_counts = fetch(ids, sold=True, max_items=MAX_SOLD)
        live, live_counts = fetch(ids, sold=False, max_items=MAX_LIVE)
        family_cache[key] = (sold, sold_counts, live, live_counts)
    sold, sold_counts, live, live_counts = family_cache[key]

    s = [l for l in sold if matches(l, entry)]
    v = [l for l in live if matches(l, entry)]
    truncated = len(sold) >= MAX_SOLD

    by_grade = {}
    for g in ('A', 'B', 'C'):
        vals = [l['price'] for l in s if l['grade'] == g]
        by_grade[g] = summary(vals) if len(vals) >= 5 else ({'n': len(vals)} if vals else None)

    live_prices = [l['price'] for l in v]
    stock = sum(live_counts.values()) if live_counts else None
    return {
        'sold': summary([l['price'] for l in s]) if len(s) >= MIN_SOLD else ({'n': len(s)} if s else None),
        'grades': by_grade,
        'monthly': monthly(s, truncated),
        'live': ({**summary(live_prices), 'p10': q(live_prices, 0.10), 'p90': q(live_prices, 0.90)}
                 if len(live_prices) >= MIN_LIVE else ({'n': len(live_prices)} if live_prices else None)),
        # Exact, from the facet — but for the whole family, every size. Shown
        # as such; never divided out into a per-size estimate.
        'family_stock': stock,
        'family_sold_total': sum(sold_counts.values()) if sold_counts else None,
        'examples': [{'price': l['price'], 'grade': l['grade'], 'link': l['link']}
                     for l in sorted(s, key=lambda l: -(l['listed'] or 0))[:6]],
    }


def write_outputs(results: dict, today: str) -> None:
    MARKET.write_text(json.dumps({'generated': today, 'source': 'vestiaire', 'models': results},
                                 ensure_ascii=False, indent=1), encoding='utf-8')

    hist = json.loads(HISTORY.read_text(encoding='utf-8')) if HISTORY.exists() else {'points': []}
    hist['points'] = [p for p in hist['points'] if p['date'] != today]
    hist['points'].append({'date': today, 'models': {
        slug: {'sold_median': (r['sold'] or {}).get('median'),
               'live_median': (r['live'] or {}).get('median'),
               'family_stock': r['family_stock']}
        for slug, r in results.items()}})
    hist['points'].sort(key=lambda p: p['date'])
    HISTORY.write_text(json.dumps(hist, ensure_ascii=False, indent=1), encoding='utf-8')


def run(only: str | None = None) -> dict:
    today = datetime.now().strftime('%Y-%m-%d')
    cat = load_catalogue()
    if only:
        cat = [e for e in cat if e['slug'] == only]
    prior = json.loads(MARKET.read_text(encoding='utf-8'))['models'] if MARKET.exists() else {}
    results = dict(prior) if only else {}
    cache: dict = {}
    failed = 0
    done = {}
    if PARTIAL.exists() and not only:
        p = json.loads(PARTIAL.read_text(encoding='utf-8'))
        if p.get('started') and (datetime.now() - datetime.strptime(p['started'], '%Y-%m-%d')).days < 3:
            done = p['models']
            print(f'  resuming: {len(done)} models already collected on {p["started"]}', flush=True)
    started = (json.loads(PARTIAL.read_text(encoding='utf-8')).get('started') if done else None) or today
    for i, entry in enumerate(cat, 1):
        if entry['slug'] in done:
            results[entry['slug']] = done[entry['slug']]
            continue
        try:
            r = collect(entry, cache)
        except Exception as e:  # noqa: BLE001
            failed += 1
            print(f'  [{i}/{len(cat)}] {entry["slug"]}: FAILED {e}', flush=True)
            # Keep last month's figures rather than publish a hole.
            if entry['slug'] in prior:
                results[entry['slug']] = prior[entry['slug']]
            continue
        results[entry['slug']] = r
        if not only:
            PARTIAL.write_text(json.dumps({'started': started, 'models': results}, ensure_ascii=False), encoding='utf-8')
        sold_n = (r['sold'] or {}).get('n', 0)
        print(f'  [{i}/{len(cat)}] {entry["slug"]}: sold {sold_n} '
              f'median {(r["sold"] or {}).get("median")} live {(r["live"] or {}).get("n", 0)}', flush=True)
        time.sleep(0.5)
    if failed > len(cat) * 0.3:
        raise SystemExit(f'{failed}/{len(cat)} models failed — source outage, not writing')
    write_outputs(results, today)
    PARTIAL.unlink(missing_ok=True)
    return results


def ship() -> None:
    sys.path.insert(0, str(ROOT.parent))
    from scripts.git_sync import commit_and_push
    from scripts.deploy_after_data import deploy
    today = datetime.now().strftime('%Y-%m-%d')
    commit_and_push([MARKET, HISTORY, MODELS, TWIN], f'chore(data): resale value {today}')
    deploy('3rd')
    deploy('2nd')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--only')
    ap.add_argument('--loop', action='store_true')
    ap.add_argument('--ship', action='store_true')
    a = ap.parse_args()
    while True:
        # A watchdog restart must not trigger a fresh 90-minute sweep: wait
        # out the month since the last one instead.
        if a.loop and MARKET.exists():
            last = datetime.strptime(json.loads(MARKET.read_text(encoding='utf-8'))['generated'], '%Y-%m-%d')
            due = (last - datetime.now()).total_seconds() + 30 * 86400
            if due > 0:
                print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [value_market] last run {last:%Y-%m-%d}, '
                      f'next in {due / 86400:.1f}d', flush=True)
                time.sleep(min(due, 86400))
                continue
        print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [value_market] run start', flush=True)
        run(a.only)
        # Merge with sourced retail and write what the sites read — both of
        # them, from one function, so they cannot disagree about a number.
        from value_build import main as build
        build()
        if a.ship:
            ship()
        if not a.loop:
            break
