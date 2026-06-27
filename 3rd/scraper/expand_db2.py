#!/usr/bin/env python3
"""Add scarves, jewelry, shoes, SLG, belts to 3rd site items_db.json."""
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

# THB prices (~34x USD)
NEW_ITEMS = [
    # ── HERMÈS SCARVES ──────────────────────────────────────
    {"id":"hermes-carre-90","brand":"Hermès","model":"Carré 90","category":"scarves","slug":"hermes/carre-90","retail_price_thb":14300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-carre-140","brand":"Hermès","model":"Carré 140","category":"scarves","slug":"hermes/carre-140","retail_price_thb":20000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-twilly","brand":"Hermès","model":"Twilly Silk Scarf","category":"scarves","slug":"hermes/twilly-silk-scarf","retail_price_thb":6600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── LV SLG ──────────────────────────────────────────────
    {"id":"lv-zippy-wallet","brand":"Louis Vuitton","model":"Zippy Wallet","category":"small-leather-goods","slug":"louis-vuitton/zippy-wallet","retail_price_thb":24500,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-card-holder","brand":"Louis Vuitton","model":"Card Holder","category":"small-leather-goods","slug":"louis-vuitton/card-holder","retail_price_thb":9700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── CHANEL SLG ───────────────────────────────────────────
    {"id":"chanel-classic-card-holder","brand":"Chanel","model":"Classic Card Holder","category":"small-leather-goods","slug":"chanel/classic-card-holder","retail_price_thb":21000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── CARTIER JEWELRY ──────────────────────────────────────
    {"id":"cartier-love-bracelet","brand":"Cartier","model":"Love Bracelet","category":"jewelry","slug":"cartier/love-bracelet","retail_price_thb":234000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-juste-un-clou","brand":"Cartier","model":"Juste un Clou Bracelet","category":"jewelry","slug":"cartier/juste-un-clou-bracelet","retail_price_thb":205000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-love-ring","brand":"Cartier","model":"Love Ring","category":"jewelry","slug":"cartier/love-ring","retail_price_thb":64000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-trinity-ring","brand":"Cartier","model":"Trinity Ring","category":"jewelry","slug":"cartier/trinity-ring","retail_price_thb":44500,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── VAN CLEEF ─────────────────────────────────────────────
    {"id":"vcaf-alhambra-necklace","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Necklace","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-necklace","retail_price_thb":221000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"vcaf-alhambra-bracelet","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Bracelet","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-bracelet","retail_price_thb":187000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── SHOES ─────────────────────────────────────────────────
    {"id":"louboutin-so-kate-100","brand":"Christian Louboutin","model":"So Kate 100","category":"shoes","slug":"christian-louboutin/so-kate-100","retail_price_thb":27000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-princetown-loafer","brand":"Gucci","model":"Princetown Leather Mule","category":"shoes","slug":"gucci/princetown-leather-mule","retail_price_thb":32000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-ballet-flat","brand":"Chanel","model":"Ballet Flat","category":"shoes","slug":"chanel/ballet-flat","retail_price_thb":35700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-cap-toe-slingback","brand":"Chanel","model":"Cap Toe Slingback","category":"shoes","slug":"chanel/cap-toe-slingback","retail_price_thb":45000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"bottega-veneta-lido-mule","brand":"Bottega Veneta","model":"Lido Sandal","category":"shoes","slug":"bottega-veneta/lido-sandal","retail_price_thb":27000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"ysl-tribute-sandal","brand":"Saint Laurent","model":"Tribute Sandal","category":"shoes","slug":"saint-laurent/tribute-sandal","retail_price_thb":28700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    # ── BELTS ─────────────────────────────────────────────────
    {"id":"hermes-h-belt-32","brand":"Hermès","model":"H Belt 32mm","category":"belts","slug":"hermes/h-belt-32mm","retail_price_thb":33600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-double-g-belt","brand":"Gucci","model":"GG Marmont Belt","category":"belts","slug":"gucci/gg-marmont-belt","retail_price_thb":16600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-initiales-belt","brand":"Louis Vuitton","model":"Initiales Monogram Belt","category":"belts","slug":"louis-vuitton/initiales-monogram-belt","retail_price_thb":17700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
]

with open(DB_PATH) as f:
    db = json.load(f)

existing_ids = {i['id'] for i in db['items']}
added = [i for i in NEW_ITEMS if i['id'] not in existing_ids]
db['items'].extend(added)

with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Added {len(added)} new items. Total: {len(db['items'])}")
from collections import Counter
cats = Counter(i['category'] for i in db['items'])
for cat, count in cats.most_common():
    print(f"  {cat}: {count}")
