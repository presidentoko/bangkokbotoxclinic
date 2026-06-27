#!/usr/bin/env python3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

NEW_ITEMS = [
    {"id":"hermes-constance-24","brand":"Hermès","model":"Constance 24","category":"handbags","slug":"hermes/constance-24","retail_price_thb":374000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-lindy-26","brand":"Hermès","model":"Lindy 26","category":"handbags","slug":"hermes/lindy-26","retail_price_thb":285600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-mini-kelly","brand":"Hermès","model":"Mini Kelly II","category":"handbags","slug":"hermes/mini-kelly-ii","retail_price_thb":425000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"hermes-twilly","brand":"Hermès","model":"Twilly Silk Scarf","category":"scarves","slug":"hermes/twilly-silk-scarf","retail_price_thb":8160,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-22-bag-small","brand":"Chanel","model":"22 Bag Small","category":"handbags","slug":"chanel/22-bag-small","retail_price_thb":153000,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-mini-flap-rectangular","brand":"Chanel","model":"Mini Rectangular Flap","category":"handbags","slug":"chanel/mini-rectangular-flap","retail_price_thb":127500,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-keepall-45","brand":"Louis Vuitton","model":"Keepall 45 Bandoulière","category":"handbags","slug":"louis-vuitton/keepall-45-bandouliere","retail_price_thb":71400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-palm-springs-mini","brand":"Louis Vuitton","model":"Palm Springs Mini Backpack","category":"handbags","slug":"louis-vuitton/palm-springs-mini-backpack","retail_price_thb":73100,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-dauphine-mm","brand":"Louis Vuitton","model":"Dauphine MM","category":"handbags","slug":"louis-vuitton/dauphine-mm","retail_price_thb":122400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-gg-marmont-belt-bag","brand":"Gucci","model":"GG Marmont Belt Bag","category":"handbags","slug":"gucci/gg-marmont-belt-bag","retail_price_thb":39100,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-blondie-small","brand":"Gucci","model":"Blondie Small Shoulder Bag","category":"handbags","slug":"gucci/blondie-small-shoulder-bag","retail_price_thb":49300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"dior-saddle-pouch","brand":"Dior","model":"Saddle Pouch with Strap","category":"handbags","slug":"dior/saddle-pouch-with-strap","retail_price_thb":61200,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"dior-oblique-backpack","brand":"Dior","model":"Dior Oblique Backpack","category":"handbags","slug":"dior/oblique-backpack","retail_price_thb":132600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"omega-speedmaster-moonwatch","brand":"Omega","model":"Speedmaster Moonwatch Professional","category":"watches","slug":"omega/speedmaster-moonwatch-professional","retail_price_thb":234600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-ballon-bleu-36","brand":"Cartier","model":"Ballon Bleu 36mm","category":"watches","slug":"cartier/ballon-bleu-36mm","retail_price_thb":275400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-juste-un-clou-bracelet","brand":"Cartier","model":"Juste un Clou Bracelet","category":"jewelry","slug":"cartier/juste-un-clou-bracelet","retail_price_thb":236300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"van-cleef-vintage-alhambra-necklace","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Necklace","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-necklace","retail_price_thb":236300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"christian-louboutin-pigalle-100","brand":"Christian Louboutin","model":"Pigalle 100 Pump","category":"shoes","slug":"christian-louboutin/pigalle-100-pump","retail_price_thb":28050,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-princetown-loafer","brand":"Gucci","model":"Princetown Leather Loafer","category":"shoes","slug":"gucci/princetown-leather-loafer","retail_price_thb":29580,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-classic-card-holder","brand":"Chanel","model":"Classic Card Holder","category":"small-leather-goods","slug":"chanel/classic-card-holder","retail_price_thb":21250,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"lv-zippy-wallet","brand":"Louis Vuitton","model":"Zippy Wallet","category":"small-leather-goods","slug":"louis-vuitton/zippy-wallet","retail_price_thb":29580,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
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
