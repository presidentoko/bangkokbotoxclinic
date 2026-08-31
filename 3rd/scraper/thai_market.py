#!/usr/bin/env python3
"""Build data/thai_market.json from live Thai dealer listings.

    python 3rd/scraper/thai_market.py            # report only, writes nothing
    python 3rd/scraper/thai_market.py --write    # write the data files
    python 3rd/scraper/thai_market.py --write --ship   # ...then commit + deploy

Run weekly. The whole sweep is about 30 HTTP requests.

Output is two files:

  data/thai_market.json   what every Thai-market figure on the site reads
  data/price_history.json one median per item per run, appended forever

The history file is the point of the exercise as much as the prices are.
Every Thai dealer publishes what a bag costs today; none of them publishes
what it cost six months ago, because their own inventory turns over and the
old listing disappears. Twelve of these runs and this site has the only
public Thai price trend for these items, which is not something a shop can
copy after the fact.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from thai_match import (  # noqa: E402
    MIN_FAMILY,
    MIN_VARIANT,
    brand_needles,
    condition_of,
    family_listings,
    family_tokens,
    norm,
    summarise,
    summarise_brand,
    observed_aliases,
    variant_listings,
)
from thai_vocab import vocabulary  # noqa: E402
from thai_sources import fetch_all  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / 'data' / 'items_db.json'
OUT_PATH = ROOT / 'data' / 'thai_market.json'
HISTORY_PATH = ROOT / 'data' / 'price_history.json'
# Raw sweep, kept out of git: it is 3MB of someone else's catalogue and the
# only thing that needs to be versioned is what we computed from it.
CACHE_PATH = ROOT / 'scraper' / '.cache' / 'thai_listings.json'

# How many live listings a model page shows. Enough to prove the number is
# real and give the reader somewhere to go; not so many that the page becomes
# a copy of the dealer's shop.
SHOWN_LISTINGS = 6
HISTORY_POINTS = 104  # two years of weekly runs
# Share of the previous run's item coverage below which a sweep is read as
# an outage rather than a result. See the check in main().
COVERAGE_FLOOR = 0.70


def _slug_brand(brand: str) -> str:
    """Mirror of lib/data.ts toBrandSlug, which owns the canonical form."""
    s = norm(brand)
    return s.replace(' ', '-')


def build(items: list[dict], listings: list[dict]) -> dict:
    for listing in listings:
        listing['n'] = norm(f"{listing['title']} {' '.join(listing.get('tags') or [])}")

    by_item: dict[str, dict] = {}
    variant_hits = family_hits = 0

    # Which families already have a size we can price exactly.
    #
    # Where one does, the family aggregate stops being useful for its other
    # sizes: it is dominated by whatever the dealers happen to title in a way
    # that misses the exact match. The Classic Flap is the clear case — the
    # Medium prices at 259,450 off eight "Chanel Classic 10”" listings, while
    # the family bucket catches only four older "CLASSIC FLAP BAG" listings at
    # one shop and lands on 84,900. Publishing that on the Jumbo page, beside
    # a Medium at three times the price, would be worse than publishing
    # nothing: a Jumbo is the largest of the four sizes, not the cheapest.
    priced_families = {
        (item['brand'], tuple(family_tokens(item['model'])))
        for item in items
        if summarise(variant_listings(listings, item), float(item.get('retail_price_thb') or 0), MIN_VARIANT)
    }

    for item in items:
        needles = brand_needles(item['brand'])
        retail = float(item.get('retail_price_thb') or 0)

        fam_toks = family_tokens(item['model'])
        variant_matches = variant_listings(listings, item)
        family_matches = family_listings(listings, item)

        variant = summarise(variant_matches, retail, MIN_VARIANT)
        # Only worth showing when it says something the variant figure doesn't,
        # and only when no sibling size has already been priced exactly — see
        # `priced_families`.
        family = None
        sibling_priced = not variant and (item['brand'], tuple(fam_toks)) in priced_families
        if len(family_matches) > len(variant_matches) and not sibling_priced:
            # Retail still anchors this. A family spans sizes, not product
            # types, so the window that keeps a wallet out of a handbag's
            # numbers applies here as much as it does to the variant.
            family = summarise(family_matches, retail, MIN_FAMILY)

        if not variant and not family:
            continue

        shown = variant_matches if variant else family_matches
        shown = sorted(shown, key=lambda l: l['price'])[:SHOWN_LISTINGS]

        by_condition = {}
        for grade in ('excellent', 'very_good', 'good'):
            graded = [l for l in variant_matches if condition_of(l['n']) == grade]
            summary = summarise(graded, retail, MIN_VARIANT)
            if summary:
                by_condition[grade] = summary

        entry = {
            'sources': sorted({l['source'] for l in (variant_matches if variant else family_matches)}),
            'listings': [
                {
                    'title': l['title'][:120],
                    'price': int(l['price']),
                    'url': l['url'],
                    'source': l['source'],
                    'in_stock': l['in_stock'],
                    # Stays on the dealer's server; see thai_sources._woo_image.
                    'image': l.get('image') or '',
                }
                for l in shown
            ],
        }
        if variant:
            entry['variant'] = variant
            variant_hits += 1
        if family:
            entry['family'] = dict(family, label=' '.join(fam_toks).title())
            family_hits += 1
        if by_condition:
            entry['by_condition'] = by_condition
        # What the shops call this, when they call it something else. The
        # buyer arrives holding the dealer's word, not the maison's.
        aliases = observed_aliases(item['slug'], variant_matches or family_matches)
        if aliases:
            entry['aliases'] = aliases
        by_item[item['slug']] = entry

    # Brand-level: every listing of that brand, whatever model. This is what
    # a brand page can honestly say about the Thai market as a whole.
    by_brand: dict[str, dict] = {}
    for brand in sorted({i['brand'] for i in items}):
        needles = brand_needles(brand)
        hits = [l for l in listings if any(n and n in l['n'] for n in needles)]
        summary = summarise_brand(hits)
        if summary:
            by_brand[_slug_brand(brand)] = dict(
                summary,
                brand=brand,
                sources=sorted({l['source'] for l in hits}),
            )

    # The shorthand the listings are written in, for the glossary page. Only
    # terms this sweep actually saw survive — see thai_vocab.
    vocab = vocabulary(listings)

    print(f'[thai] variant-level: {variant_hits} items, family-level: {family_hits}, brands: {len(by_brand)}')
    print(f'[thai] vocabulary: {len(vocab)} terms attested in this sweep')
    return {'items': by_item, 'brands': by_brand, 'vocabulary': vocab}


def update_history(built: dict, today: str) -> dict:
    """Append this run's medians. One point per run, oldest dropped past the cap."""
    if HISTORY_PATH.exists():
        history = json.loads(HISTORY_PATH.read_text(encoding='utf-8'))
    else:
        history = {'points': []}

    point = {
        'date': today,
        'items': {
            slug: entry['variant']['median']
            for slug, entry in built['items'].items()
            if 'variant' in entry
        },
        'brands': {slug: b['median'] for slug, b in built['brands'].items()},
    }
    points = [p for p in history.get('points', []) if p.get('date') != today]
    points.append(point)
    points.sort(key=lambda p: p['date'])
    history['points'] = points[-HISTORY_POINTS:]
    return history


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true', help='write the data files')
    parser.add_argument('--ship', action='store_true', help='commit and deploy after writing')
    parser.add_argument(
        '--cache',
        action='store_true',
        help='reuse the previous raw sweep instead of refetching '
             '(for working on the matching without hammering the dealers)',
    )
    args = parser.parse_args()

    today = datetime.now().strftime('%Y-%m-%d')
    items = json.loads(DB_PATH.read_text(encoding='utf-8'))['items']

    if args.cache and CACHE_PATH.exists():
        cached = json.loads(CACHE_PATH.read_text(encoding='utf-8'))
        listings, reports = cached['listings'], cached['sources']
        print(f'[thai] using cached sweep from {cached.get("generated")}')
    else:
        listings, reports = fetch_all()
        CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        CACHE_PATH.write_text(
            json.dumps({'generated': today, 'listings': listings, 'sources': reports}, ensure_ascii=False),
            encoding='utf-8',
            newline='\n',
        )
    ok = [r for r in reports if r['ok']]
    print(f'[thai] {len(listings)} listings from {len(ok)}/{len(reports)} dealers')
    if len(ok) < 2:
        # One dealer's catalogue is not a market. Better to leave the previous
        # file in place than to republish the site with a thinner one.
        print('[thai] too few dealers answered — leaving existing data untouched')
        return 1

    built = build(items, listings)
    payload = {
        'generated': today,
        'listing_count': len(listings),
        'sources': reports,
        **built,
    }

    covered = len(built['items'])
    print(f'[thai] {covered}/{len(items)} catalogue items have a Thai figure')

    # A dealer timing out is not a reason to unpublish two dozen prices.
    #
    # The `len(ok) < 2` check above is too coarse to catch this. On
    # 2026-08-31 brandnamevoyage — 2,000 of the 2,879 listings — dropped out
    # of a sweep while the other four answered fine. Four of five dealers
    # looks healthy, so the run wrote anyway and Thai coverage fell from 48
    # items to 22: half the pages silently reverting to converted dollar
    # prices, which is the failure this whole pipeline exists to fix.
    #
    # Shrinking is normal in small amounts — dealers sell things. A third of
    # the catalogue vanishing in a week is an outage, and the right response
    # to an outage is to keep serving yesterday's good data.
    if OUT_PATH.exists():
        previous = json.loads(OUT_PATH.read_text(encoding='utf-8'))
        was = len(previous.get('items', {}))
        if was and covered < was * COVERAGE_FLOOR:
            # Name the cause, not just the symptom. The first version of this
            # message only listed dealers that returned nothing, so when
            # brandnamevoyage came back with 300 of its 2,000 listings it
            # printed "Silent dealers: none reported" — accurate and useless.
            # A shop can answer and still be two thirds missing.
            silent = [r['id'] for r in reports if not r['ok']]
            truncated = [r['id'] for r in reports if r['ok'] and not r.get('complete', True)]
            before = {s['id']: s.get('listings', 0) for s in previous.get('sources', [])}
            shrunk = [
                f"{r['id']} {before[r['id']]}->{r['listings']}"
                for r in reports
                if r['ok'] and before.get(r['id'], 0) > r['listings'] * 2
            ]
            print(
                f'[thai] coverage fell {was} -> {covered} items '
                f'({covered / was:.0%} of the last run, floor {COVERAGE_FLOOR:.0%}) — '
                f'treating as an outage, not a result.'
            )
            for label, ids in (('silent', silent), ('truncated', truncated), ('shrunk', shrunk)):
                if ids:
                    print(f'[thai]   {label}: {", ".join(ids)}')
            print('[thai] leaving existing data untouched')
            return 1

    if not args.write:
        print('[thai] dry run — pass --write to save')
        return 0

    OUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8', newline='\n'
    )
    HISTORY_PATH.write_text(
        json.dumps(update_history(built, today), ensure_ascii=False, indent=2),
        encoding='utf-8',
        newline='\n',
    )
    print(f'[thai] wrote {OUT_PATH.name} and {HISTORY_PATH.name}')

    # Report contradictions, but do not hold up the deploy for them. Every
    # finding so far has been a pre-existing quirk of the international data
    # rather than something this sweep introduced, and blocking on those would
    # mean the Thai prices — the accurate half — never ship. The log is where
    # a human sees them; audit.py exits non-zero if anyone wants a hard gate.
    try:
        from audit import main as audit_main
        print('[thai] --- data audit ---', flush=True)
        audit_main()
    except Exception as e:  # noqa: BLE001
        print(f'[thai] audit skipped: {e}')

    if args.ship:
        from scripts.git_sync import commit_and_push
        from scripts.deploy_after_data import deploy
        if commit_and_push([OUT_PATH, HISTORY_PATH], f'chore(data): thai market {today}'):
            deploy('3rd')
    return 0


INTERVAL_HOURS = 168  # weekly, same cadence as the other samplers


if __name__ == '__main__':
    if '--loop' in sys.argv:
        # Long-running form for scripts/watchdog.py, which supervises by PID and
        # reads progress off the log. The timestamp has to LEAD the line or
        # watchdog's parser misses it and kills the process as stale every few
        # minutes; flush because stdout is redirected to a file and a sweep can
        # outlive the buffer. Both lessons are already commented in
        # price_sampler.py — same shape here on purpose.
        sys.argv = [a for a in sys.argv if a != '--loop']
        import time
        while True:
            print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [thai_market] run start', flush=True)
            try:
                main()
            except Exception as e:  # noqa: BLE001
                # A dealer changing their storefront must not take the service
                # down until someone notices — log it and try again next week.
                print(f'{datetime.now():%Y-%m-%d %H:%M:%S} [thai_market] run failed: {e}', flush=True)
            print(
                f'{datetime.now():%Y-%m-%d %H:%M:%S} [thai_market] sleeping {INTERVAL_HOURS}h',
                flush=True,
            )
            time.sleep(INTERVAL_HOURS * 3600)
    raise SystemExit(main())
