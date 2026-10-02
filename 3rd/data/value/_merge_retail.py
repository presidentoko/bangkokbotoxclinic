"""Merge the retail research batches into retail.json, applying the review.

Each correction below is a config mismatch found by reading the source: a
price for one product filed under another. A retail price that describes a
different bag than the resale side matches would produce a confident,
wrong retention figure.
"""
import glob, json, re
MOVE = {  # slug -> (correct slug, config pattern that proves the misfiling)
    # PurseBop's figure is the Mini *Rectangular*; our "mini" is the square.
    'chanel-classic-flap-mini': ('chanel-mini-rectangular-flap', r'^(?!.*square).*rectang'),
    # Agent filed the Re-Edition 2005 Re-Nylon price under the generic nylon bag.
    'prada-nylon-shoulder-bag': ('prada-re-edition-2005', r're-edition 2005'),
}
allr = {}
for f in sorted(glob.glob('_retail_result*.json')):
    for k, v in json.load(open(f, encoding='utf-8')).items():
        if not (v and v.get('usd')):
            continue
        # A move fixes a price filed under the wrong slug. Only move entries
        # whose own config says they belong elsewhere: a later batch filed the
        # Mini *Square* price correctly under chanel-classic-flap-mini, and a
        # blind move would have put it on the Rectangular page.
        if k in MOVE and not re.search(MOVE[k][1], v.get('config', ''), re.I):
            allr[k] = v
            continue
        allr[MOVE[k][0] if k in MOVE else k] = v
DROP = {
    'marc-jacobs-the-snapshot-camera-bag': 'source labels $325 a sale price; may be a markdown',
    'louis-vuitton-speedy-25': 'price is the Speedy Bandouliere 25; resale side excludes Bandouliere',
    'fendi-peekaboo-regular': 'price is the Peekaboo ISeeU Medium, a different bag',
    'chanel-19-bag-medium': 'Chanel 19 sizes ambiguous between sources (standard vs large)',
    'chanel-19-large-flap': 'Chanel 19 sizes ambiguous between sources (standard vs large)',
    'chanel-19-bag-small': 'Chanel 19 sizes ambiguous between sources (standard vs small)',
    'gucci-dionysus-gg-supreme': 'price is for the Small; resale side covers every size',
    'patek-philippe-aquanaut-5167a': 'currency not shown at source; trackers disagree',
    'cartier-ronde-louis-cartier-29mm': 'priced the rose-gold version; resale side is mostly steel',
    'omega-aqua-terra-38-5mm': 'priced the current 38mm, not the 38.5mm',
}
for k in DROP:
    allr.pop(k, None)
keep = {k: {f: v[f] for f in ('usd', 'config', 'source_url', 'confidence', 'as_of', 'discontinued') if f in v}
        for k, v in sorted(allr.items())}
json.dump(keep, open('retail.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(keep), 'retail prices with sources')
