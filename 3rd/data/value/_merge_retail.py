"""Merge the retail research batches into retail.json, applying the review.

Each correction below is a config mismatch found by reading the source: a
price for one product filed under another. A retail price that describes a
different bag than the resale side matches would produce a confident,
wrong retention figure.
"""
import glob, json
allr = {}
for f in sorted(glob.glob('_retail_result*.json')):
    for k, v in json.load(open(f, encoding='utf-8')).items():
        if v and v.get('usd'):
            allr[k] = v
MOVE = {
    # PurseBop's figure is the Mini *Rectangular*; our "mini" is the square.
    'chanel-classic-flap-mini': 'chanel-mini-rectangular-flap',
    # Agent filed the Re-Edition 2005 Re-Nylon price under the generic nylon bag.
    'prada-nylon-shoulder-bag': 'prada-re-edition-2005',
}
DROP = {
    'louis-vuitton-speedy-25': 'price is the Speedy Bandouliere 25; resale side excludes Bandouliere',
    'louis-vuitton-speedy-35': 'price is the Speedy Bandouliere 35; resale side excludes Bandouliere',
    'fendi-peekaboo-regular': 'price is the Peekaboo ISeeU Medium, a different bag',
    'chanel-19-bag-medium': 'Chanel 19 sizes ambiguous between sources (standard vs large)',
    'chanel-19-large-flap': 'Chanel 19 sizes ambiguous between sources (standard vs large)',
    'chanel-19-bag-small': 'Chanel 19 sizes ambiguous between sources (standard vs small)',
    'patek-philippe-aquanaut-5167a': 'currency not shown at source; trackers disagree',
    'cartier-ronde-louis-cartier-29mm': 'priced the rose-gold version; resale side is mostly steel',
    'omega-aqua-terra-38-5mm': 'priced the current 38mm, not the 38.5mm',
}
for a, b in MOVE.items():
    if a in allr:
        allr[b] = allr.pop(a)
for k in DROP:
    allr.pop(k, None)
keep = {k: {f: v[f] for f in ('usd', 'config', 'source_url', 'confidence', 'as_of', 'discontinued') if f in v}
        for k, v in sorted(allr.items())}
json.dump(keep, open('retail.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(keep), 'retail prices with sources')
