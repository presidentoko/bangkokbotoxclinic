#!/usr/bin/env python3
"""
Map every URL secondluxuryitems.com used to serve to where it lives now.

    python 2nd/scraper/build_redirects.py

secondluxuryitems.com stopped being a second copy of chicpreowned.com's price
catalogue in October 2026 — the two domains had been publishing the same
model pages, and both were demoted in the same August week. What 2nd had
earned (381 indexed URLs) is handed to the page that now answers the same
question, by permanent redirect, rather than thrown away with a noindex:

    /chanel/classic-flap-medium        -> chic /en/value/chanel-classic-flap-medium
    /guides/how-to-authenticate-chanel -> /checklist/authenticity/chanel (here)
    /guides/chanel-bag-size-guide      -> /sizes/chanel (here)
    /compare/rolex-vs-omega            -> chic /en/compare/rolex-vs-omega

Every destination is checked against what chicpreowned actually builds — its
route folders, its catalogue and its value pages. A redirect into a 404 is
worse than the page it replaced. Run it again whenever either catalogue
changes; next.config.ts reads the output.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent          # 2nd/
CHIC = HERE.parent / '3rd'
OUT = HERE / 'data' / 'legacy_redirects.json'
C = 'https://www.chicpreowned.com/en'


def slugify(s: str) -> str:
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    return re.sub(r'-+', '-', re.sub(r'\s+', '-', s))


def old_dirs(sub: str) -> set[str]:
    """Route folders 2nd served before the October 2026 cut. Read from git
    at the last commit that still had them, since the folders themselves are
    gone — listing the working tree would map nothing."""
    import subprocess
    out = [l.rsplit('/', 1)[-1] for l in subprocess.run(
        ['git', 'ls-tree', '--name-only', 'HEAD', f'app/{sub}/'], cwd=HERE,
        capture_output=True, text=True).stdout.split()]
    return {d for d in out if '.' not in d and not d.startswith('[')} | dirs(HERE / 'app' / sub)


def dirs(p: Path) -> set[str]:
    return {d.name for d in p.iterdir() if d.is_dir() and not d.name.startswith('[')} if p.exists() else set()


def main() -> None:
    loc = CHIC / 'app' / '[locale]'
    chic_items = {i['slug'] for i in json.loads((CHIC / 'data' / 'items_db.json').read_text(encoding='utf-8'))['items']}
    chic_brands = {s.split('/')[0] for s in chic_items}
    chic_items_brandfix = {s.replace('van-cleef-arpels', 'van-cleef-arpels') for s in chic_items}
    value = json.loads((CHIC / 'data' / 'value' / 'models.json').read_text(encoding='utf-8'))
    value_by_item = {m['item_slug']: m['slug'] for m in value['models']}
    value_slugs = {m['slug'] for m in value['models']}
    chic_static = dirs(loc)
    chic_guides = dirs(loc / 'guides')
    chic_compare = dirs(loc / 'compare')
    chic_trends = dirs(loc / 'trends')
    chic_brand_guides = dirs(loc / 'brands')

    from_items = json.loads((HERE / 'data' / 'items_db.json').read_text(encoding='utf-8'))['items']
    app = HERE / 'app'
    rules: list[dict] = []

    def add(src: str, dst: str):
        rules.append({'source': src, 'destination': dst, 'permanent': True})

    # Model pages → the value page for that model, else chic's price page,
    # else the brand.
    for it in from_items:
        slug = it['slug']
        brand = slug.split('/')[0]
        flat = slug.replace('/', '-')
        if slug in value_by_item:
            add(f'/{slug}', f'{C}/value/{value_by_item[slug]}')
        elif flat in value_slugs:
            add(f'/{slug}', f'{C}/value/{flat}')
        elif slug in chic_items_brandfix:
            add(f'/{slug}', f'{C}/{slug}')
        elif brand in chic_brands:
            add(f'/{slug}', f'{C}/{brand}')
        else:
            add(f'/{slug}', f'{C}/value')
        # The OG image route under each model page.
    for brand in sorted({it['slug'].split('/')[0] for it in from_items}):
        add(f'/{brand}', f'{C}/{brand}' if brand in chic_brands else f'{C}/brands')

    for b in old_dirs('brands'):
        add(f'/brands/{b}', f'{C}/brands/{b}' if b in chic_brand_guides else f'{C}/brands')
    add('/brands', f'{C}/brands')

    checklists = {'chanel', 'louis-vuitton', 'hermes'}
    sizes = {'chanel-bag-size-guide': 'chanel', 'hermes-bag-size-guide': 'hermes',
             'lv-neverfull-size-guide': 'louis-vuitton', 'lv-speedy-size-guide': 'louis-vuitton'}
    for g in old_dirs('guides'):
        m = re.fullmatch(r'how-to-authenticate-(.+)', g)
        if m and m.group(1) in checklists:
            add(f'/guides/{g}', f'/checklist/authenticity/{m.group(1)}')
        elif g in sizes:
            add(f'/guides/{g}', f'/sizes/{sizes[g]}')
        elif g in ('how-to-spot-fake-luxury-bags',):
            add(f'/guides/{g}', '/checklist/authenticity')
        elif g in chic_guides:
            add(f'/guides/{g}', f'{C}/guides/{g}')
        elif g == 'chanel-bag-size-guide':
            add(f'/guides/{g}', '/sizes/chanel')
        else:
            add(f'/guides/{g}', f'{C}/guides')
    add('/guides', f'{C}/guides')

    compare_alias = {'chanel-vs-louis-vuitton': 'chanel-vs-lv', 'louis-vuitton-vs-gucci': 'lv-vs-gucci',
                     'bottega-veneta-vs-loewe': 'bottega-vs-loewe', 'hermes-vs-bottega-veneta': 'hermes-vs-bottega',
                     'hermes-vs-chanel': 'chanel-vs-hermes'}
    for c in old_dirs('compare'):
        t = compare_alias.get(c, c)
        add(f'/compare/{c}', f'{C}/compare/{t}' if t in chic_compare else f'{C}/compare')
    add('/compare', f'{C}/compare')

    trend_alias = {'best-luxury-bags-to-gift-2025': 'best-bags-to-gift-2025', 'luxury-bags-above-retail': 'luxury-above-retail',
                   'quiet-luxury-bags-2025': 'quiet-luxury-2025', 'chanel-bag-price-history-2025': 'chanel-price-increase-2025'}
    for t in old_dirs('trends'):
        d = trend_alias.get(t, t)
        add(f'/trends/{t}', f'{C}/trends/{d}' if d in chic_trends else f'{C}/trends')
    add('/trends', f'{C}/trends')

    for cat in ('handbags', 'watches', 'shoes', 'jewelry', 'belts', 'scarves', 'small-leather-goods', 'market-overview', 'search'):
        add(f'/{cat}', f'{C}/{cat}' if cat in chic_static else f'{C}/value')
    # Dollar budgets to the nearest baht budget chic has.
    add('/under-500', f'{C}/under-15000')
    add('/under-1000', f'{C}/under-30000')
    add('/under-2000', f'{C}/under-60000')
    add('/value-guide', f'{C}/index/value-retention')

    # Sanity: every chic destination must be a route chic builds.
    def chic_exists(url: str) -> bool:
        p = url.removeprefix(C).strip('/')
        parts = p.split('/') if p else []
        if not parts:
            return True
        if parts[0] == 'value':
            return len(parts) == 1 or parts[1] in value_slugs
        if parts[0] == 'index':
            return True
        if len(parts) == 2 and parts[0] in ('guides', 'compare', 'trends', 'brands'):
            return parts[1] in {'guides': chic_guides, 'compare': chic_compare, 'trends': chic_trends, 'brands': chic_brand_guides}[parts[0]]
        if len(parts) == 2:
            return '/'.join(parts) in chic_items
        return parts[0] in chic_static or parts[0] in chic_brands

    bad = [r for r in rules if r['destination'].startswith(C) and not chic_exists(r['destination'])]
    if bad:
        for r in bad:
            print('  MISSING destination', r)
        raise SystemExit(f'{len(bad)} redirects point at pages chicpreowned does not build')
    # Once the deletion is committed, git no longer lists the old folders, so
    # a rerun would quietly drop their rules. Carry every previous source
    # forward unless this run produced a fresher mapping for it.
    if OUT.exists():
        fresh = {r['source'] for r in rules}
        carried = [r for r in json.loads(OUT.read_text(encoding='utf-8')) if r['source'] not in fresh]
        bad_carried = [r for r in carried if r['destination'].startswith(C) and not chic_exists(r['destination'])]
        if bad_carried:
            raise SystemExit(f'{len(bad_carried)} existing redirects now point at missing chic pages: {bad_carried[:3]}')
        rules.extend(carried)
    # Two rules for one source would mean the first silently wins.
    seen: set[str] = set()
    uniq = []
    for r in rules:
        if r['source'] in seen:
            continue
        seen.add(r['source'])
        uniq.append(r)
    OUT.write_text(json.dumps(uniq, indent=1), encoding='utf-8')
    print(f'{len(uniq)} redirects -> {OUT}')


if __name__ == '__main__':
    main()
