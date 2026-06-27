#!/usr/bin/env python3
"""Add scarves, jewelry, shoes, small leather goods to items_db.json."""
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

NEW_ITEMS = [
    # ── HERMÈS SCARVES ──────────────────────────────────────
    {"id":"hermes-carre-90","brand":"Hermès","model":"Carré 90","category":"scarves","slug":"hermes/carre-90","retail_price_usd":420,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-carre-140","brand":"Hermès","model":"Carré 140","category":"scarves","slug":"hermes/carre-140","retail_price_usd":595,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-twilly","brand":"Hermès","model":"Twilly Silk Scarf","category":"scarves","slug":"hermes/twilly-silk-scarf","retail_price_usd":195,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-bandana","brand":"Hermès","model":"Bandana 90","category":"scarves","slug":"hermes/bandana-90","retail_price_usd":280,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── LOUIS VUITTON SCARVES / SLG ──────────────────────────
    {"id":"lv-bandeau","brand":"Louis Vuitton","model":"Bandeau Silk","category":"scarves","slug":"louis-vuitton/bandeau-silk","retail_price_usd":240,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-zippy-wallet","brand":"Louis Vuitton","model":"Zippy Wallet","category":"small-leather-goods","slug":"louis-vuitton/zippy-wallet","retail_price_usd":720,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-card-holder","brand":"Louis Vuitton","model":"Card Holder","category":"small-leather-goods","slug":"louis-vuitton/card-holder","retail_price_usd":285,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-sarah-wallet","brand":"Louis Vuitton","model":"Sarah Wallet","category":"small-leather-goods","slug":"louis-vuitton/sarah-wallet","retail_price_usd":490,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── CHANEL SLG ───────────────────────────────────────────
    {"id":"chanel-classic-card-holder","brand":"Chanel","model":"Classic Card Holder","category":"small-leather-goods","slug":"chanel/classic-card-holder","retail_price_usd":625,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-zip-coin-purse","brand":"Chanel","model":"Zip Coin Purse","category":"small-leather-goods","slug":"chanel/zip-coin-purse","retail_price_usd":475,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── CARTIER JEWELRY ──────────────────────────────────────
    {"id":"cartier-love-bracelet","brand":"Cartier","model":"Love Bracelet","category":"jewelry","slug":"cartier/love-bracelet","retail_price_usd":6900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-juste-un-clou","brand":"Cartier","model":"Juste un Clou Bracelet","category":"jewelry","slug":"cartier/juste-un-clou-bracelet","retail_price_usd":6050,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-love-ring","brand":"Cartier","model":"Love Ring","category":"jewelry","slug":"cartier/love-ring","retail_price_usd":1890,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-trinity-ring","brand":"Cartier","model":"Trinity Ring","category":"jewelry","slug":"cartier/trinity-ring","retail_price_usd":1310,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-panthère-bracelet","brand":"Cartier","model":"Panthère de Cartier Bracelet","category":"jewelry","slug":"cartier/panthere-de-cartier-bracelet","retail_price_usd":7400,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── VAN CLEEF JEWELRY ─────────────────────────────────────
    {"id":"vcaf-alhambra-necklace","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Necklace","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-necklace","retail_price_usd":6500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"vcaf-alhambra-bracelet","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Bracelet","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-bracelet","retail_price_usd":5500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"vcaf-alhambra-earrings","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Earrings","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-earrings","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── TIFFANY JEWELRY ───────────────────────────────────────
    {"id":"tiffany-tee-bracelet","brand":"Tiffany & Co.","model":"T Wire Bracelet","category":"jewelry","slug":"tiffany-co/t-wire-bracelet","retail_price_usd":1750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tiffany-hardwear-necklace","brand":"Tiffany & Co.","model":"HardWear Link Necklace","category":"jewelry","slug":"tiffany-co/hardwear-link-necklace","retail_price_usd":3600,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── SHOES ─────────────────────────────────────────────────
    {"id":"louboutin-so-kate-100","brand":"Christian Louboutin","model":"So Kate 100","category":"shoes","slug":"christian-louboutin/so-kate-100","retail_price_usd":795,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"louboutin-pigalle-100","brand":"Christian Louboutin","model":"Pigalle 100","category":"shoes","slug":"christian-louboutin/pigalle-100","retail_price_usd":795,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-princetown-loafer","brand":"Gucci","model":"Princetown Leather Mule","category":"shoes","slug":"gucci/princetown-leather-mule","retail_price_usd":950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-ballet-flat","brand":"Chanel","model":"Ballet Flat","category":"shoes","slug":"chanel/ballet-flat","retail_price_usd":1050,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-cap-toe-slingback","brand":"Chanel","model":"Cap Toe Slingback","category":"shoes","slug":"chanel/cap-toe-slingback","retail_price_usd":1325,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-dway-mule","brand":"Dior","model":"Dway Mule","category":"shoes","slug":"dior/dway-mule","retail_price_usd":890,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-veneta-lido-mule","brand":"Bottega Veneta","model":"Lido Sandal","category":"shoes","slug":"bottega-veneta/lido-sandal","retail_price_usd":800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-monolith-boot","brand":"Prada","model":"Monolith Brushed Leather Boot","category":"shoes","slug":"prada/monolith-brushed-leather-boot","retail_price_usd":1550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ysl-tribute-sandal","brand":"Saint Laurent","model":"Tribute Sandal","category":"shoes","slug":"saint-laurent/tribute-sandal","retail_price_usd":845,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"jimmy-choo-romy-pumps","brand":"Jimmy Choo","model":"Romy 100 Pumps","category":"shoes","slug":"jimmy-choo/romy-100-pumps","retail_price_usd":750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"balenciaga-triple-s","brand":"Balenciaga","model":"Triple S Sneaker","category":"shoes","slug":"balenciaga/triple-s-sneaker","retail_price_usd":1095,"price_ranges":{},"price_samples":[],"last_updated":""},

    # ── BELTS ─────────────────────────────────────────────────
    {"id":"hermes-h-belt-32","brand":"Hermès","model":"H Belt 32mm","category":"belts","slug":"hermes/h-belt-32mm","retail_price_usd":990,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-h-belt-42","brand":"Hermès","model":"H Belt 42mm","category":"belts","slug":"hermes/h-belt-42mm","retail_price_usd":1060,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-double-g-belt","brand":"Gucci","model":"GG Marmont Belt","category":"belts","slug":"gucci/gg-marmont-belt","retail_price_usd":490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-initiales-belt","brand":"Louis Vuitton","model":"Initiales Monogram Belt","category":"belts","slug":"louis-vuitton/initiales-monogram-belt","retail_price_usd":520,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-cc-belt","brand":"Chanel","model":"CC Logo Belt","category":"belts","slug":"chanel/cc-logo-belt","retail_price_usd":1175,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-saddle-belt","brand":"Dior","model":"Saddle Belt","category":"belts","slug":"dior/saddle-belt","retail_price_usd":650,"price_ranges":{},"price_samples":[],"last_updated":""},
]

with open(DB_PATH) as f:
    db = json.load(f)

existing_ids = {i['id'] for i in db['items']}
added = [i for i in NEW_ITEMS if i['id'] not in existing_ids]
db['items'].extend(added)

with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Added {len(added)} new items. Total: {len(db['items'])}")

# Category breakdown
from collections import Counter
cats = Counter(i['category'] for i in db['items'])
for cat, count in cats.most_common():
    print(f"  {cat}: {count}")
