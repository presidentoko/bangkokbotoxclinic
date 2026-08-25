#!/usr/bin/env python3
"""Look for prices this site should not be publishing.

    python 3rd/scraper/audit.py

Exists because two of the worst defects found on this site were invisible to
every check that existed at the time, and both were the same shape — a number
that was individually plausible and only wrong in relation to something else
on the site:

  * a Datejust 41 published at 579,000-767,000 THB while Thai dealers listed
    it at 399,000, because the figure came from a US marketplace in dollars;
  * a Classic Flap Jumbo published below a Classic Flap Medium, because the
    Jumbo's number was a family aggregate drawn from a different subset of
    listings than the Medium's.

Neither is catchable by looking at one item. So this reads the whole dataset
and reports the contradictions: sizes out of order, published prices far from
the Thai market, spreads too wide to mean anything, families thinner than
their own variants. It exits non-zero when it finds something, so the weekly
run can shout instead of quietly publishing.

Findings are printed, never auto-fixed. Every one of them so far has needed a
judgement about *why* the numbers disagree, and a script that silently
"corrects" a disagreement destroys the evidence needed to make it.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / 'data' / 'items_db.json'
MARKET_PATH = ROOT / 'data' / 'thai_market.json'

# Ordered smallest to largest. Only used to compare two items of the same
# family, so it does not need to know a Birkin 25 from a Kelly 25 — just that
# "mini" is under "small" is under "medium".
SIZE_ORDER = ['micro', 'nano', 'mini', 'small', 'medium', 'large', 'jumbo', 'maxi']

# A published band wider than this stopped describing one product.
WIDE_SPREAD = 8.0
# How far the published headline may sit from the Thai dealer median before
# it is worth a human looking at it.
DIVERGENCE = 1.6


def _size_rank(model: str) -> int | None:
    words = re.findall(r'[a-z]+', model.lower())
    for i, size in enumerate(SIZE_ORDER):
        if size in words:
            return i
    return None


def _family_key(item: dict) -> tuple:
    words = [w for w in re.findall(r'[a-z0-9]+', item['model'].lower())
             if w not in SIZE_ORDER]
    return (item['brand'], tuple(words))


def _headline(item: dict, market: dict) -> tuple[float, str] | None:
    """Mirror of lib/thai-market.ts marketPrice. Keep the two in step: this
    check is worthless if it audits a price the site does not show."""
    entry = market['items'].get(item['slug']) or {}
    if 'variant' in entry:
        return entry['variant']['median'], 'thai'

    intl = None
    for grade in ('very_good', 'excellent', 'good'):
        band = item['price_ranges'].get(grade)
        if band:
            intl = band.get('median') or (band['min'] + band['max']) / 2
            break

    family = entry.get('family')
    if family and family['median'] > 0:
        if not intl or max(intl / family['median'], family['median'] / intl) >= DIVERGENCE:
            return family['median'], 'thai_family'

    return (intl, 'international') if intl else None


def main() -> int:
    items = json.loads(DB_PATH.read_text(encoding='utf-8'))['items']
    market = json.loads(MARKET_PATH.read_text(encoding='utf-8'))
    findings: list[str] = []

    priced = {}
    for item in items:
        head = _headline(item, market)
        if head:
            priced[item['slug']] = (item, head[0], head[1])

    # 1. A larger size priced below a smaller one in the same family.
    families: dict[tuple, list] = {}
    for slug, (item, price, basis) in priced.items():
        rank = _size_rank(item['model'])
        if rank is not None:
            families.setdefault(_family_key(item), []).append((rank, item, price, basis))
    for key, members in families.items():
        members.sort(key=lambda m: m[0])
        for (r1, i1, p1, b1), (r2, i2, p2, b2) in zip(members, members[1:]):
            if r2 > r1 and p2 < p1:
                findings.append(
                    f'SIZE ORDER  {i1["brand"]} {i1["model"]} ({b1}) {p1:,.0f} '
                    f'> {i2["model"]} ({b2}) {p2:,.0f} — larger size priced lower'
                )

    # 2. Headline far from what Thai dealers are asking for the same thing.
    for slug, (item, price, basis) in priced.items():
        entry = market['items'].get(slug) or {}
        thai = entry.get('variant') or entry.get('family')
        if not thai or basis == 'thai' or not thai['median']:
            continue
        ratio = max(price / thai['median'], thai['median'] / price)
        if ratio >= DIVERGENCE:
            tier = 'variant' if 'variant' in entry else 'family'
            findings.append(
                f'DIVERGES    {item["brand"]} {item["model"]}: published {price:,.0f} '
                f'({basis}) vs Thai {tier} {thai["median"]:,.0f} — {ratio:.1f}x apart'
            )

    # 3. Bands too wide to be one product.
    for item in items:
        for grade, band in item['price_ranges'].items():
            if band['min'] > 0 and band['max'] / band['min'] >= WIDE_SPREAD:
                findings.append(
                    f'WIDE BAND   {item["brand"]} {item["model"]} [{grade}]: '
                    f'{band["min"]:,}-{band["max"]:,} — {band["max"] / band["min"]:.0f}x'
                )

    # 4. Anything non-positive that reached the data files.
    for item in items:
        for grade, band in item['price_ranges'].items():
            if band['min'] <= 0 or band['max'] <= 0:
                findings.append(f'NON-POSITIVE {item["slug"]} [{grade}]: {band}')
    for slug, entry in market['items'].items():
        for tier in ('variant', 'family'):
            summary = entry.get(tier)
            if summary and (summary['min'] <= 0 or summary['median'] <= 0):
                findings.append(f'NON-POSITIVE {slug} [{tier}]: {summary}')

    # 5. Catalogue duplicates — two entries for the same product compete with
    #    each other in search and split whatever authority the page earns.
    seen: dict[tuple, str] = {}
    for item in items:
        key = (item['brand'], re.sub(r'[^a-z0-9]', '', item['model'].lower()))
        if key in seen:
            findings.append(f'DUPLICATE   {seen[key]} and {item["slug"]} are the same product')
        seen[key] = item['slug']

    thai_count = sum(1 for _, (_, _, b) in priced.items() if b == 'thai')
    print(f'{len(items)} items · {len(priced)} priced · {thai_count} from Thai dealers')
    print(f'{len(findings)} findings\n')
    for line in sorted(findings):
        print(' ', line)

    return 1 if findings else 0


if __name__ == '__main__':
    raise SystemExit(main())
