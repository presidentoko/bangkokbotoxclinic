#!/usr/bin/env python3
"""Add new items to items_db.json, then run price_sampler on them."""
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

NEW_ITEMS = [
    # Chanel
    {"id":"chanel-classic-flap-mini","brand":"Chanel","model":"Classic Flap Mini","category":"handbags","slug":"chanel/classic-flap-mini","retail_price_usd":4400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-classic-flap-small","brand":"Chanel","model":"Classic Flap Small","category":"handbags","slug":"chanel/classic-flap-small","retail_price_usd":8800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-classic-flap-jumbo","brand":"Chanel","model":"Classic Flap Jumbo","category":"handbags","slug":"chanel/classic-flap-jumbo","retail_price_usd":11400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-woc","brand":"Chanel","model":"Wallet on Chain","category":"handbags","slug":"chanel/wallet-on-chain","retail_price_usd":2300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-19-small","brand":"Chanel","model":"19 Bag Small","category":"handbags","slug":"chanel/19-bag-small","retail_price_usd":4300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-19-medium","brand":"Chanel","model":"19 Bag Medium","category":"handbags","slug":"chanel/19-bag-medium","retail_price_usd":5100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-gabrielle-small","brand":"Chanel","model":"Gabrielle Hobo Small","category":"handbags","slug":"chanel/gabrielle-hobo-small","retail_price_usd":4200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-boy-small","brand":"Chanel","model":"Boy Bag Small","category":"handbags","slug":"chanel/boy-bag-small","retail_price_usd":6000,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Louis Vuitton
    {"id":"lv-speedy-25","brand":"Louis Vuitton","model":"Speedy 25","category":"handbags","slug":"louis-vuitton/speedy-25","retail_price_usd":1600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-speedy-35","brand":"Louis Vuitton","model":"Speedy 35","category":"handbags","slug":"louis-vuitton/speedy-35","retail_price_usd":1800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-neverfull-gm","brand":"Louis Vuitton","model":"Neverfull GM","category":"handbags","slug":"louis-vuitton/neverfull-gm","retail_price_usd":2000,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-alma-bb","brand":"Louis Vuitton","model":"Alma BB","category":"handbags","slug":"louis-vuitton/alma-bb","retail_price_usd":1550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-alma-pm","brand":"Louis Vuitton","model":"Alma PM","category":"handbags","slug":"louis-vuitton/alma-pm","retail_price_usd":1840,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-pochette-metis","brand":"Louis Vuitton","model":"Pochette Metis","category":"handbags","slug":"louis-vuitton/pochette-metis","retail_price_usd":1950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-capucines-bb","brand":"Louis Vuitton","model":"Capucines BB","category":"handbags","slug":"louis-vuitton/capucines-bb","retail_price_usd":7950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-dauphine-mm","brand":"Louis Vuitton","model":"Dauphine MM","category":"handbags","slug":"louis-vuitton/dauphine-mm","retail_price_usd":3400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-onthego-mm","brand":"Louis Vuitton","model":"OnTheGo MM","category":"handbags","slug":"louis-vuitton/onthego-mm","retail_price_usd":2990,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-twist-pm","brand":"Louis Vuitton","model":"Twist PM","category":"handbags","slug":"louis-vuitton/twist-pm","retail_price_usd":3750,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Hermes
    {"id":"hermes-birkin-25","brand":"Hermès","model":"Birkin 25","category":"handbags","slug":"hermes/birkin-25","retail_price_usd":10300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-birkin-35","brand":"Hermès","model":"Birkin 35","category":"handbags","slug":"hermes/birkin-35","retail_price_usd":13200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-kelly-25","brand":"Hermès","model":"Kelly 25","category":"handbags","slug":"hermes/kelly-25","retail_price_usd":10300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-kelly-32","brand":"Hermès","model":"Kelly 32","category":"handbags","slug":"hermes/kelly-32","retail_price_usd":12100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-constance-24","brand":"Hermès","model":"Constance 24","category":"handbags","slug":"hermes/constance-24","retail_price_usd":11100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-lindy-26","brand":"Hermès","model":"Lindy 26","category":"handbags","slug":"hermes/lindy-26","retail_price_usd":7950,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Gucci
    {"id":"gucci-gg-marmont-small","brand":"Gucci","model":"GG Marmont Small","category":"handbags","slug":"gucci/gg-marmont-small","retail_price_usd":1550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-dionysus-medium","brand":"Gucci","model":"Dionysus GG Supreme","category":"handbags","slug":"gucci/dionysus-gg-supreme","retail_price_usd":2350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-ophidia-medium","brand":"Gucci","model":"Ophidia GG Medium","category":"handbags","slug":"gucci/ophidia-gg-medium","retail_price_usd":1750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-jackie-1961-small","brand":"Gucci","model":"Jackie 1961 Small","category":"handbags","slug":"gucci/jackie-1961-small","retail_price_usd":1490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-soho-disco","brand":"Gucci","model":"Soho Disco","category":"handbags","slug":"gucci/soho-disco","retail_price_usd":1200,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Dior
    {"id":"dior-saddle-bag","brand":"Dior","model":"Saddle Bag","category":"handbags","slug":"dior/saddle-bag","retail_price_usd":3900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-book-tote-small","brand":"Dior","model":"Book Tote Small","category":"handbags","slug":"dior/book-tote-small","retail_price_usd":3300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-bobby-small","brand":"Dior","model":"Bobby Small","category":"handbags","slug":"dior/bobby-small","retail_price_usd":3800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-30-montaigne","brand":"Dior","model":"30 Montaigne","category":"handbags","slug":"dior/30-montaigne","retail_price_usd":3800,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Prada
    {"id":"prada-galleria-small","brand":"Prada","model":"Galleria Small","category":"handbags","slug":"prada/galleria-small","retail_price_usd":2470,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-galleria-medium","brand":"Prada","model":"Galleria Medium","category":"handbags","slug":"prada/galleria-medium","retail_price_usd":3275,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-re-edition-2000","brand":"Prada","model":"Re-Edition 2000","category":"handbags","slug":"prada/re-edition-2000","retail_price_usd":950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-cleo","brand":"Prada","model":"Cleo","category":"handbags","slug":"prada/cleo","retail_price_usd":1800,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Saint Laurent
    {"id":"ysl-loulou-small","brand":"Saint Laurent","model":"Loulou Small","category":"handbags","slug":"saint-laurent/loulou-small","retail_price_usd":1750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ysl-loulou-medium","brand":"Saint Laurent","model":"Loulou Medium","category":"handbags","slug":"saint-laurent/loulou-medium","retail_price_usd":2100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ysl-kate-medium","brand":"Saint Laurent","model":"Kate Medium","category":"handbags","slug":"saint-laurent/kate-medium","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ysl-solferino-small","brand":"Saint Laurent","model":"Solferino Small","category":"handbags","slug":"saint-laurent/solferino-small","retail_price_usd":1990,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Bottega Veneta
    {"id":"bv-jodie-small","brand":"Bottega Veneta","model":"Jodie Small","category":"handbags","slug":"bottega-veneta/jodie-small","retail_price_usd":2950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bv-cassette","brand":"Bottega Veneta","model":"Cassette Bag","category":"handbags","slug":"bottega-veneta/cassette-bag","retail_price_usd":3900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bv-arco-medium","brand":"Bottega Veneta","model":"Arco Tote Medium","category":"handbags","slug":"bottega-veneta/arco-tote-medium","retail_price_usd":3600,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Celine
    {"id":"celine-classic-box","brand":"Celine","model":"Classic Box","category":"handbags","slug":"celine/classic-box","retail_price_usd":2650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-belt-mini","brand":"Celine","model":"Belt Bag Mini","category":"handbags","slug":"celine/belt-bag-mini","retail_price_usd":2150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-luggage-micro","brand":"Celine","model":"Luggage Micro","category":"handbags","slug":"celine/luggage-micro","retail_price_usd":2750,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Fendi
    {"id":"fendi-baguette-medium","brand":"Fendi","model":"Baguette Medium","category":"handbags","slug":"fendi/baguette-medium","retail_price_usd":3250,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"fendi-peekaboo-mini","brand":"Fendi","model":"Peekaboo Mini","category":"handbags","slug":"fendi/peekaboo-mini","retail_price_usd":3600,"price_ranges":{},"price_samples":[],"last_updated":""},
    # Watches
    {"id":"rolex-gmt-master-ii","brand":"Rolex","model":"GMT-Master II","category":"watches","slug":"rolex/gmt-master-ii","retail_price_usd":10700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-oyster-perpetual-36","brand":"Rolex","model":"Oyster Perpetual 36","category":"watches","slug":"rolex/oyster-perpetual-36","retail_price_usd":6150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-daytona","brand":"Rolex","model":"Daytona","category":"watches","slug":"rolex/daytona","retail_price_usd":15550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-day-date-40","brand":"Rolex","model":"Day-Date 40","category":"watches","slug":"rolex/day-date-40","retail_price_usd":41150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"patek-aquanaut","brand":"Patek Philippe","model":"Aquanaut 5167A","category":"watches","slug":"patek-philippe/aquanaut-5167a","retail_price_usd":26900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"patek-calatrava","brand":"Patek Philippe","model":"Calatrava 5119","category":"watches","slug":"patek-philippe/calatrava-5119","retail_price_usd":24400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ap-roo-offshore","brand":"Audemars Piguet","model":"Royal Oak Offshore 42","category":"watches","slug":"audemars-piguet/royal-oak-offshore-42","retail_price_usd":32800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-santos-medium","brand":"Cartier","model":"Santos Medium","category":"watches","slug":"cartier/santos-medium","retail_price_usd":7350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-ballon-bleu-40","brand":"Cartier","model":"Ballon Bleu 40mm","category":"watches","slug":"cartier/ballon-bleu-40mm","retail_price_usd":8100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"omega-seamaster-300m","brand":"Omega","model":"Seamaster 300M","category":"watches","slug":"omega/seamaster-300m","retail_price_usd":6100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"omega-speedmaster","brand":"Omega","model":"Speedmaster Moonwatch","category":"watches","slug":"omega/speedmaster-moonwatch","retail_price_usd":7300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"iwc-portugieser","brand":"IWC","model":"Portugieser Chronograph","category":"watches","slug":"iwc/portugieser-chronograph","retail_price_usd":9600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tag-carrera","brand":"TAG Heuer","model":"Carrera Calibre 16","category":"watches","slug":"tag-heuer/carrera-calibre-16","retail_price_usd":4950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"breitling-navitimer","brand":"Breitling","model":"Navitimer B01","category":"watches","slug":"breitling/navitimer-b01","retail_price_usd":9750,"price_ranges":{},"price_samples":[],"last_updated":""},
]

with open(DB_PATH) as f:
    db = json.load(f)

existing_ids = {i['id'] for i in db['items']}
added = [i for i in NEW_ITEMS if i['id'] not in existing_ids]
db['items'].extend(added)

with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Added {len(added)} new items. Total: {len(db['items'])}")
