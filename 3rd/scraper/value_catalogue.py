#!/usr/bin/env python3
"""
Build data/value/catalogue.json — which Vestiaire listings count as which model.

    python 3rd/scraper/value_catalogue.py

Inputs: data/value/_candidates.json (our models) and data/value/_resolve.json
(the Vestiaire model facets each one's family search returned). Output is
meant to be read and corrected by hand; OVERRIDES below is where corrections
live so a rebuild doesn't lose them.

A size variant ("Classic Flap Medium") is matched by text, because Vestiaire
files every size under one model ("Timeless/Classique"). A listing must name
its own size and no sibling's. Listings that state no size are dropped: a
median that quietly mixes Medium and Jumbo is the error this replaces.
"""
from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / 'data' / 'value'

SIZE_WORDS = {'mini', 'micro', 'nano', 'small', 'medium', 'large', 'jumbo', 'regular',
              'bb', 'pm', 'mm', 'gm', 'tpm'}
STOP = {'bag', 'bags', 'the', 'de', 'le', 'la', 'handbag', 'with', 'and', 'top', 'handle',
        'shoulder', 'tote', 'leather', 'canvas', 'silk', 'quartz', 'automatic', 'dial',
        'green', 'yellow', 'gold', 'annual', 'calendar', 'chronograph', 'oblique', 'ff',
        'president', 'ii'}
BRAND_WORDS = {'chanel', 'hermes', 'louis', 'vuitton', 'lv', 'dior', 'christian', 'gucci',
               'prada', 'cartier', 'rolex', 'celine', 'fendi', 'loewe', 'bottega', 'veneta',
               'saint', 'laurent', 'ysl', 'balenciaga', 'bulgari', 'bvlgari', 'goyard', 'miu',
               'valentino', 'garavani', 'omega', 'patek', 'philippe', 'tiffany', 'co',
               'van', 'cleef', 'arpels', 'burberry', 'coach', 'givenchy'}
TYPE_WORDS = ['bracelet', 'ring', 'necklace', 'earrings', 'earring', 'pendant', 'card holder',
              'wallet', 'coin purse', 'pouch', 'belt', 'scarf', 'twilly', 'bandana']

# Chanel prints sizes in inches on the dust card and resellers echo it; the
# maison's own names are Mini/Small/Medium/Jumbo. Both count.
INCH = r'(?:"|”|″|\'\'| ?inch| ?in\b)'
CHANEL_FLAP = {
    'mini': rf'\bmini\b|\bsquare\b|\b17\s?cm|\b7(?:\.5)?{INCH}',
    'small': rf'\bsmall\b|\b23\s?cm|\b9{INCH}',
    'medium': rf'\bmedium\b|\bm/l\b|\b25(?:\.5)?\s?cm|\b10{INCH}|classic 10',
    'jumbo': rf'\bjumbo\b|\b30\s?cm|\b12{INCH}',
}

OVERRIDES: dict[str, dict] = {
    'chanel-classic-flap-mini': {'ids': [7597, 3], 'include': CHANEL_FLAP['mini'],
                                 'exclude': r'rectang|\b20\s?cm|\b8' + INCH + '|' + '|'.join(
                                     v for k, v in CHANEL_FLAP.items() if k != 'mini') + r'|wallet|woc'},
    'chanel-classic-flap-small': {'ids': [7597, 3], 'include': CHANEL_FLAP['small'],
                                  'exclude': '|'.join(v for k, v in CHANEL_FLAP.items() if k != 'small') + r'|wallet|woc'},
    'chanel-classic-flap-medium': {'ids': [7597, 3], 'include': CHANEL_FLAP['medium'],
                                   'exclude': '|'.join(v for k, v in CHANEL_FLAP.items() if k != 'medium') + r'|wallet|woc'},
    'chanel-classic-flap-jumbo': {'ids': [7597, 3], 'include': CHANEL_FLAP['jumbo'],
                                  'exclude': '|'.join(v for k, v in CHANEL_FLAP.items() if k != 'jumbo') + r'|maxi|wallet|woc'},
    'chanel-mini-rectangular-flap': {'ids': [7597, 3], 'include': r'rectang',
                                     'exclude': r'\bsquare\b|wallet|woc|' + CHANEL_FLAP['medium'] + '|' + CHANEL_FLAP['jumbo']},
    'chanel-wallet-on-chain': {'ids': [7445], 'include': None, 'exclude': r'\bboy\b', 'any_base': True},
    'chanel-19-bag-small': {'ids': [7613, 5744], 'include': r'\bsmall\b|\b26\s?cm', 'exclude': r'\bmedium\b|\blarge\b|maxi|\bwallet|woc|clutch|pouch'},
    'chanel-19-bag-medium': {'ids': [7613, 5744], 'include': r'\bmedium\b|\blarge\b|\b30\s?cm', 'exclude': r'\bsmall\b|maxi|\bwallet|woc|clutch|pouch'},
    'chanel-19-large-flap': {'ids': [7613, 5744], 'include': r'\bmaxi\b|\b36\s?cm', 'exclude': r'\bsmall\b|\bwallet|woc'},
    'chanel-22-bag-small': {'ids': [8014], 'include': r'\bsmall\b', 'exclude': r'\bmini\b|\bmedium\b|\blarge\b'},
    'chanel-classic-card-holder': {'ids': [7597, 3], 'include': r'card ?holder|card case', 'exclude': r'wallet on chain|woc', 'any_base': True},
    'cartier-tank-must': {'ids': [1515]},
    'cartier-tank-solo': {'ids': [1525]},
    'cartier-ballon-bleu-36mm': {'ids': [139], 'include': r'\b36\s?mm', 'exclude': r'\b(28|33|40|42)\s?mm'},
    'cartier-ballon-bleu-40mm': {'ids': [139], 'include': r'\b40\s?mm|\b42\s?mm', 'exclude': r'\b(28|33|36)\s?mm'},
    'cartier-love-bracelet': {'ids': [122], 'include': r'bracelet', 'exclude': r'\bsmall\b|\bpm\b|\bthin\b|diamond|paved|pav[eé]'},
    'cartier-love-ring': {'ids': [122], 'include': r'\bring\b'},
    'cartier-love-necklace': {'ids': [122], 'include': r'necklace|pendant'},
    'cartier-trinity-ring': {'ids': [121], 'include': r'\bring\b'},
    'celine-belt-bag-mini': {'ids': [367], 'include': r'\bmini\b', 'exclude': r'\bmicro\b|\bnano\b'},
    'gucci-gg-marmont-belt': {'ids': [2324], 'include': r'\bbelt\b|\bmarmont\b', 'any_base': True},
    'hermes-h-belt-32mm': {'ids': [1856], 'include': r'\b32\s?mm', 'any_base': True},
    'hermes-h-belt-42mm': {'ids': [1856], 'include': r'\b42\s?mm', 'any_base': True},
    'hermes-mini-kelly-ii': {'ids': [6685, 1838], 'exact_ids': [6685, 1838], 'exclude': r'clic|double tour|pochette|twilly'},
    'hermes-constance-18': {'ids': [11, 1795], 'include': r'\b18\s?(cm)?\b|\bmini\b', 'exclude': r'\b24\s?(cm)?\b|\b23\s?cm|slim|to go|wallet|long'},
    'hermes-constance-24': {'ids': [11, 1795], 'include': r'\b24\s?(cm)?\b|\b23\s?cm', 'exclude': r'\b18\s?(cm)?\b|\bmini\b|slim|to go|wallet|long'},
    'rolex-datejust-36': {'ids': [7037, 7038, 102], 'include': r'\b36\s?mm', 'exclude': r'\b(26|28|31|41)\s?mm'},
    'rolex-datejust-41': {'ids': [7037, 7038], 'include': r'\b41\s?mm', 'exclude': r'\b(26|28|31|36)\s?mm'},
    'rolex-daytona': {'ids': [101]},
    'van-cleef-arpels-vintage-alhambra-long-necklace': {'ids': [108], 'include': r'long|20 motif|twenty motif|sautoir'},
    'miu-miu-wander-matelasse-bag': {'ids': [8079]},
    # Vestiaire files these under a model wider than the product the retail
    # price describes (all "Classic" Celine bags; every Rockstud bag; Peekaboo
    # minis next to the pouch). Resale figures stand, labelled as the family;
    # no retention figure, no ranking.
    'celine-classic-box': {'broad': True},
    'valentino-rockstud-crossbody': {'broad': True},
    'fendi-peekaboo-mini': {'broad': True},
    'louis-vuitton-petite-malle': {'broad': True},
    'dior-lady-dior-large': {'broad': True},
    'louis-vuitton-keepall-45-bandouliere': {'broad': True},
    'van-cleef-arpels-vintage-alhambra-necklace': {'broad': True},
    'saint-laurent-loulou-small': {'broad': True},
    'saint-laurent-loulou-medium': {'broad': True},
    'omega-speedmaster-moonwatch-professional': {'ids': [1412], 'include': r'moon ?watch|professional', 'exclude': r'reduced'},
}


def norm(s: str) -> str:
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]', ' ', s)


def tokens(s: str) -> set[str]:
    return set(norm(s).split())


def size_tokens(name: str) -> list[str]:
    out = []
    for t in norm(name).split():
        if t in SIZE_WORDS:
            out.append(t)
        else:
            m = re.fullmatch(r'(\d{2,3})(cm|mm)?', t)
            if m:
                out.append(m.group(1))
    return out


def ref_tokens(name: str) -> list[str]:
    return [t for t in norm(name).split() if re.fullmatch(r'\d{4,6}[a-z]{0,3}', t)]


# "small scratches", "minor marks" — condition notes use size words too.
WEAR = (r'(?!\s*(?:scratch|mark|stain|sign|spot|wear|crack|scuff|dent|discolou?r|tear|hole|'
        r'imperfection|flaw|defect|patina|darkening|rubbing|bit|amount|detail)s?\b)')

# Within a handbag family a listing naming any other size is that other size,
# whether or not we carry a page for it — "Lady Dior Mini" is not a Medium.
BAG_SIZES = ['mini', 'micro', 'nano', 'small', 'medium', 'large', 'jumbo', 'maxi']


def size_regex(tok: str) -> str:
    if tok.isdigit():
        return rf'\b{tok}\s?(?:cm|mm)?\b'
    return rf'\b{tok}\b{WEAR}'


def main() -> None:
    cands = json.loads((DATA / '_candidates.json').read_text(encoding='utf-8'))
    resolve = json.loads((DATA / '_resolve.json').read_text(encoding='utf-8'))

    def family(c):
        return ' '.join(t for t in norm(c['name']).split()
                        if t not in SIZE_WORDS and not re.fullmatch(r'\d{2,3}(cm|mm)?', t))

    groups = defaultdict(list)
    for c in cands:
        groups[(c['brand'], family(c))].append(c)

    out = []
    for c in cands:
        slug = c['slug']
        fam_tokens = tokens(family(c)) - STOP - BRAND_WORDS
        sizes = size_tokens(c['name'])
        refs = ref_tokens(c['name'])
        facets = (resolve.get(slug) or {}).get('models') or []
        ids, exact = [], []
        for mid, mname, _count in facets:
            mt = tokens(mname) - STOP - BRAND_WORDS
            msizes = {t for t in mt if t in SIZE_WORDS or t.isdigit()}
            core = mt - msizes
            if not core or not core <= (fam_tokens | {'classique'}):
                continue
            if not (core & fam_tokens):
                continue
            if msizes and sizes and not (set(sizes) & msizes):
                continue  # a sibling size's own model ("Birkin 35" for Birkin 30)
            ids.append(int(mid))
            if sizes and msizes and set(sizes) <= msizes:
                exact.append(int(mid))
        siblings = [s for s in groups[(c['brand'], family(c))] if s['slug'] != slug]
        sib_sizes = {t for s in siblings for t in size_tokens(s['name'])}
        if c['category'] == 'handbags' and any(not t.isdigit() for t in sizes):
            sib_sizes |= set(BAG_SIZES)
        sib_sizes = sorted(sib_sizes - set(sizes))
        include = None
        if sizes:
            include = '|'.join(size_regex(t) for t in sizes)
        if refs:
            include = '|'.join(re.escape(r) for r in refs)
        type_words = [w for w in TYPE_WORDS if w in norm(c['name'])]
        if c['category'] in ('jewelry', 'small-leather-goods', 'belts', 'scarves') and type_words:
            tw = '|'.join(re.escape(w) for w in type_words)
            include = f'(?=.*(?:{tw}))(?:{include})' if include else tw
        entry = {
            'slug': slug,
            'item_slug': c['item_slug'],
            'brand': c['brand'],
            'name': c['name'],
            'category': c['category'],
            'ids': ids,
            'exact_ids': exact,
            'include': include,
            'exclude': '|'.join(size_regex(t) for t in sib_sizes) or None,
        }
        if slug in OVERRIDES:
            entry.update(OVERRIDES[slug])
            entry.setdefault('exact_ids', [])
        out.append(entry)

    usable = [e for e in out if e['ids']]
    (DATA / 'catalogue.json').write_text(json.dumps(usable, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(usable)}/{len(out)} candidates have a Vestiaire model')
    for e in out:
        if not e['ids']:
            print('  no model:', e['slug'])


if __name__ == '__main__':
    main()
