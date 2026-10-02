#!/usr/bin/env python3
"""
Join resale data with sourced retail prices into what the two sites read.

    python 3rd/scraper/value_build.py

Reads   data/value/catalogue.json, market.json, history.json, retail.json
Writes  3rd/data/value/models.json     (chicpreowned /value, /index)
        2nd/data/value_stats.json      (secondluxuryitems calculators)

Both outputs come from build_rows(), so the calculator on one domain and the
value page on the other can never quote different numbers for the same bag.

What gets a number, and what doesn't:
  * resale  — sold-listing median when there are MIN_SOLD sales, else the
              asking-price median, labelled `basis: "asking"`. Asking prices
              run 20-40% above what things sell for, so they never enter a
              ranking.
  * retention — resale ÷ retail, only when the retail price carries a source
              and the resale basis is "sold". Discontinued models keep their
              last retail on the page but stay out of the rankings: a 2021
              list price against a 2026 market is not a retention figure.
  * Anything outside SANE is held back and printed. A model "holding 300%"
    has nearly always matched the wrong listings, not beaten the market.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data' / 'value'
TWIN = ROOT.parent / '2nd' / 'data' / 'value_stats.json'

SANE = (12.0, 300.0)
# A ranking needs this many sales behind each row.
RANK_MIN_SOLD = 20
GRADE_MIN = 5


def brand_slug(brand: str) -> str:
    import unicodedata
    s = unicodedata.normalize('NFD', brand).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    return re.sub(r'-+', '-', re.sub(r'\s+', '-', s))


def trim_monthly(monthly: list[dict]) -> list[dict]:
    """Keep the run of months that each have enough sales for a median.

    Vestiaire's sold index reaches back years for some models but with one or
    two sales a month — a line through those points draws noise as trend.
    Start where the data becomes continuous."""
    out: list[dict] = []
    for m in reversed(monthly):
        if m.get('median') is None:
            break
        out.append(m)
    return list(reversed(out))


def load(name: str, default=None):
    p = DATA / name
    if not p.exists():
        return default
    return json.loads(p.read_text(encoding='utf-8'))


def build_rows() -> list[dict]:
    catalogue = load('catalogue.json', [])
    market = (load('market.json', {}) or {}).get('models', {})
    generated = (load('market.json', {}) or {}).get('generated')
    retail_all = load('retail.json', {}) or {}
    history = (load('history.json', {}) or {}).get('points', [])

    rows = []
    held = []
    for e in catalogue:
        m = market.get(e['slug'])
        if not m:
            continue
        sold = m.get('sold') or {}
        live = m.get('live') or {}
        if sold.get('median'):
            basis, resale = 'sold', sold
        elif live.get('median'):
            basis, resale = 'asking', live
        else:
            continue

        retail = retail_all.get(e['slug'])
        retention = None
        # Watches are matched by family, not reference or metal: a Datejust
        # 36 median mixes steel with gold, against a steel retail price. That
        # made a "103% of retail" Datejust. Same for catalogue entries marked
        # broad. Resale figures still publish; the ratio does not.
        comparable = e['category'] != 'watches' and not e.get('broad')
        if retail and retail.get('usd') and basis == 'sold' and comparable:
            retention = round(resale['median'] / retail['usd'] * 100, 1)
            if not (SANE[0] <= retention <= SANE[1]):
                held.append((e['slug'], retention, resale['median'], retail['usd']))
                retention = None

        grades = {g: v for g, v in (m.get('grades') or {}).items() if v and v.get('median')}
        like_new = grades.get('A')
        rows.append({
            'slug': e['slug'],
            'item_slug': e['item_slug'],
            'brand': e['brand'],
            'brand_slug': brand_slug(e['brand']),
            'name': e['name'],
            'category': e['category'],
            'basis': basis,
            'resale': {k: resale.get(k) for k in ('n', 'median', 'p25', 'p75')},
            'sold': sold or None,
            'live': live or None,
            'grades': grades,
            'monthly': trim_monthly(m.get('monthly') or []),
            'family_stock': m.get('family_stock'),
            'stock_history': [
                {'date': p['date'], 'family_stock': p['models'][e['slug']]['family_stock']}
                for p in history
                if e['slug'] in p['models'] and p['models'][e['slug']].get('family_stock') is not None
            ],
            'retail': retail or None,
            'retention': retention,
            'like_new_vs_retail': (round(like_new['median'] / retail['usd'] * 100, 1)
                                   if like_new and retail and retail.get('usd')
                                   and like_new.get('n', 0) >= GRADE_MIN else None),
            'rankable': bool(retention is not None and not (retail or {}).get('discontinued')
                             and sold.get('n', 0) >= RANK_MIN_SOLD),
            'examples': m.get('examples') or [],
            'generated': generated,
        })
    for slug, r, med, ret in held:
        print(f'  held back {slug}: {r}% (resale {med} / retail {ret}) — check matching')
    return rows


def rankings(rows: list[dict]) -> dict:
    rk = [r for r in rows if r['rankable']]
    by_ret = sorted(rk, key=lambda r: -r['retention'])
    under = [r for r in rk if r['like_new_vs_retail'] is not None and r['like_new_vs_retail'] < 100]
    return {
        'value_retention': [r['slug'] for r in by_ret],
        'biggest_depreciation': [r['slug'] for r in reversed(by_ret)],
        'under_retail': [r['slug'] for r in sorted(under, key=lambda r: r['like_new_vs_retail'])],
    }


def twin_rows(rows: list[dict]) -> list[dict]:
    """The calculators need far less than a value page: no examples, no
    history, no monthly series."""
    return [{
        'slug': r['slug'],
        'brand': r['brand'],
        'name': r['name'],
        'category': r['category'],
        'basis': r['basis'],
        'resale': r['resale'],
        'grades': {g: {'median': v['median'], 'p25': v.get('p25'), 'p75': v.get('p75'), 'n': v['n']}
                   for g, v in r['grades'].items()},
        'retail_usd': (r['retail'] or {}).get('usd'),
        'retail_as_of': (r['retail'] or {}).get('as_of'),
        'retail_discontinued': bool((r['retail'] or {}).get('discontinued')),
        'retention': r['retention'],
    } for r in rows]


def main() -> None:
    rows = build_rows()
    generated = rows[0]['generated'] if rows else None
    out = {'generated': generated, 'models': rows, 'rankings': rankings(rows)}
    (DATA / 'models.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    TWIN.parent.mkdir(parents=True, exist_ok=True)
    TWIN.write_text(json.dumps({'generated': generated, 'models': twin_rows(rows)},
                               ensure_ascii=False, indent=1), encoding='utf-8')
    rk = out['rankings']
    print(f'{len(rows)} models published ({sum(r["basis"] == "sold" for r in rows)} on sales, '
          f'{sum(r["retention"] is not None for r in rows)} with retention, '
          f'{len(rk["value_retention"])} ranked, {len(rk["under_retail"])} under retail like-new)')


if __name__ == '__main__':
    main()
