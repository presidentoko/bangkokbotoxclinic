#!/usr/bin/env python3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

NEW_ITEMS = [
    {"id":"chanel-gabrielle-small","brand":"Chanel","model":"Gabrielle Small Hobo","category":"handbags","slug":"chanel/gabrielle-small-hobo","retail_price_thb":141100,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-deauville-tote","brand":"Chanel","model":"Deauville Tote Large","category":"handbags","slug":"chanel/deauville-tote-large","retail_price_thb":125800,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-twist-mm","brand":"Louis Vuitton","model":"Twist MM","category":"handbags","slug":"louis-vuitton/twist-mm","retail_price_thb":125800,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-nano-noe","brand":"Louis Vuitton","model":"Nano Noé","category":"handbags","slug":"louis-vuitton/nano-noe","retail_price_thb":47260,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-picotin-18","brand":"Hermès","model":"Picotin 18","category":"handbags","slug":"hermes/picotin-18","retail_price_thb":80750,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-garden-party-36","brand":"Hermès","model":"Garden Party 36","category":"handbags","slug":"hermes/garden-party-36","retail_price_thb":102850,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-evelyne-tpm","brand":"Hermès","model":"Evelyne TPM","category":"handbags","slug":"hermes/evelyne-tpm","retail_price_thb":86700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"dior-book-tote","brand":"Dior","model":"Book Tote Small","category":"handbags","slug":"dior/book-tote-small","retail_price_thb":98600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"prada-galleria-medium","brand":"Prada","model":"Galleria Saffiano Tote Medium","category":"handbags","slug":"prada/galleria-saffiano-tote-medium","retail_price_thb":105400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"prada-cleo-brushed","brand":"Prada","model":"Cleo Brushed Leather Bag","category":"handbags","slug":"prada/cleo-brushed-leather-bag","retail_price_thb":66300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"bottega-veneta-jodie-small","brand":"Bottega Veneta","model":"Jodie Small Hobo","category":"handbags","slug":"bottega-veneta/jodie-small-hobo","retail_price_thb":88400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"rolex-datejust-36","brand":"Rolex","model":"Datejust 36","category":"watches","slug":"rolex/datejust-36","retail_price_thb":256700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"rolex-gmt-master-ii","brand":"Rolex","model":"GMT-Master II","category":"watches","slug":"rolex/gmt-master-ii","retail_price_thb":513400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"omega-aqua-terra-38","brand":"Omega","model":"Aqua Terra 38.5mm","category":"watches","slug":"omega/aqua-terra-38-5mm","retail_price_thb":197200,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-love-necklace","brand":"Cartier","model":"Love Necklace","category":"jewelry","slug":"cartier/love-necklace","retail_price_thb":71400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"bvlgari-b-zero1-ring","brand":"Bulgari","model":"B.zero1 Ring","category":"jewelry","slug":"bulgari/b-zero1-ring","retail_price_thb":54060,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-calvi-cardholder","brand":"Hermès","model":"Calvi Card Holder","category":"small-leather-goods","slug":"hermes/calvi-card-holder","retail_price_thb":16660,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"prada-saffiano-wallet","brand":"Prada","model":"Saffiano Leather Bifold Wallet","category":"small-leather-goods","slug":"prada/saffiano-leather-bifold-wallet","retail_price_thb":19380,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"valentino-rockstud-pump","brand":"Valentino","model":"Rockstud Pump 105","category":"shoes","slug":"valentino/rockstud-pump-105","retail_price_thb":35700,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"ferragamo-gancini-belt","brand":"Salvatore Ferragamo","model":"Gancini Belt","category":"belts","slug":"salvatore-ferragamo/gancini-belt","retail_price_thb":13260,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
]

with open(DB_PATH, encoding='utf-8') as f:
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
