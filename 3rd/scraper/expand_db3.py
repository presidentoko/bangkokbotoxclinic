#!/usr/bin/env python3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

NEW_ITEMS = [
    {"id":"chanel-tweed-jacket","brand":"Chanel","model":"Classic Tweed Jacket","category":"clothing","slug":"chanel/classic-tweed-jacket","retail_price_thb":197200,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"burberry-trench-coat","brand":"Burberry","model":"Westminster Trench Coat","category":"clothing","slug":"burberry/westminster-trench-coat","retail_price_thb":71060,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"saint-laurent-leather-jacket","brand":"Saint Laurent","model":"Classic Motorcycle Jacket","category":"clothing","slug":"saint-laurent/classic-motorcycle-jacket","retail_price_thb":169660,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"moncler-maya-jacket","brand":"Moncler","model":"Maya Short Down Jacket","category":"clothing","slug":"moncler/maya-short-down-jacket","retail_price_thb":52020,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"balenciaga-oversized-hoodie","brand":"Balenciaga","model":"Oversized Logo Hoodie","category":"clothing","slug":"balenciaga/oversized-logo-hoodie","retail_price_thb":33830,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"cartier-tank-must","brand":"Cartier","model":"Tank Must","category":"watches","slug":"cartier/tank-must","retail_price_thb":112200,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"ap-royal-oak-15400","brand":"Audemars Piguet","model":"Royal Oak 15400","category":"watches","slug":"audemars-piguet/royal-oak-15400","retail_price_thb":819400,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"tag-heuer-carrera-heuer01","brand":"TAG Heuer","model":"Carrera Heuer-01","category":"watches","slug":"tag-heuer/carrera-heuer-01","retail_price_thb":176800,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"loewe-puzzle-small","brand":"Loewe","model":"Puzzle Small Bag","category":"handbags","slug":"loewe/puzzle-small-bag","retail_price_thb":76500,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"celine-triomphe-canvas","brand":"Celine","model":"Triomphe Canvas Bag","category":"handbags","slug":"celine/triomphe-canvas-bag","retail_price_thb":49300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"miu-miu-wander","brand":"Miu Miu","model":"Wander Matelassé Bag","category":"handbags","slug":"miu-miu/wander-matelasse-bag","retail_price_thb":49300,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"dior-30-montaigne","brand":"Dior","model":"30 Montaigne Bag","category":"handbags","slug":"dior/30-montaigne-bag","retail_price_thb":125800,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"chanel-19-medium","brand":"Chanel","model":"19 Medium Flap","category":"handbags","slug":"chanel/19-medium-flap","retail_price_thb":200600,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"gucci-horsebit-1955","brand":"Gucci","model":"Horsebit 1955 Small Bag","category":"handbags","slug":"gucci/horsebit-1955-small-bag","retail_price_thb":46920,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
    {"id":"saint-laurent-loulou","brand":"Saint Laurent","model":"Loulou Medium Bag","category":"handbags","slug":"saint-laurent/loulou-medium-bag","retail_price_thb":73100,"price_ranges":{},"price_samples":[],"affiliate_links":{},"last_updated":""},
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
