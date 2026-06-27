import json
from datetime import date

DB_PATH = "data/items_db.json"
TODAY = date.today().isoformat()

NEW_ITEMS = [
    {"id":"hermes-bearn-wallet","brand":"Hermès","model":"Béarn Compact Wallet","category":"small-leather-goods","slug":"hermes/bearn-compact-wallet","retail_price_usd":1125,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-dogon-wallet","brand":"Hermès","model":"Dogon Duo Wallet","category":"small-leather-goods","slug":"hermes/dogon-duo-wallet","retail_price_usd":1325,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-constance-24","brand":"Hermès","model":"Constance 24","category":"handbags","slug":"hermes/constance-24","retail_price_usd":11000,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-lindy-26","brand":"Hermès","model":"Lindy 26","category":"handbags","slug":"hermes/lindy-26","retail_price_usd":8400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-mini-kelly","brand":"Hermès","model":"Mini Kelly II","category":"handbags","slug":"hermes/mini-kelly-ii","retail_price_usd":12500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-pearl-crush-mini","brand":"Chanel","model":"Pearl Crush Mini","category":"handbags","slug":"chanel/pearl-crush-mini","retail_price_usd":3950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-22-bag-small","brand":"Chanel","model":"22 Bag Small","category":"handbags","slug":"chanel/22-bag-small","retail_price_usd":4500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-mini-flap-rectangular","brand":"Chanel","model":"Mini Rectangular Flap","category":"handbags","slug":"chanel/mini-rectangular-flap","retail_price_usd":3750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-keepall-45","brand":"Louis Vuitton","model":"Keepall 45 Bandoulière","category":"handbags","slug":"louis-vuitton/keepall-45-bandouliere","retail_price_usd":2100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-toiletry-pouch-26","brand":"Louis Vuitton","model":"Toiletry Pouch 26","category":"small-leather-goods","slug":"louis-vuitton/toiletry-pouch-26","retail_price_usd":590,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-palm-springs-mini","brand":"Louis Vuitton","model":"Palm Springs Mini Backpack","category":"handbags","slug":"louis-vuitton/palm-springs-mini-backpack","retail_price_usd":2150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-dauphine-mm","brand":"Louis Vuitton","model":"Dauphine MM","category":"handbags","slug":"louis-vuitton/dauphine-mm","retail_price_usd":3600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-marmont-belt-bag","brand":"Gucci","model":"GG Marmont Belt Bag","category":"handbags","slug":"gucci/gg-marmont-belt-bag","retail_price_usd":1150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-re-belle-medium","brand":"Gucci","model":"Re(belle) Medium Tote","category":"handbags","slug":"gucci/re-belle-medium-tote","retail_price_usd":2490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-blondie-small","brand":"Gucci","model":"Blondie Small Shoulder Bag","category":"handbags","slug":"gucci/blondie-small-shoulder-bag","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-saddle-pouch","brand":"Dior","model":"Saddle Pouch with Strap","category":"handbags","slug":"dior/saddle-pouch-with-strap","retail_price_usd":1800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-medium-lady-dior","brand":"Dior","model":"Lady Dior Large","category":"handbags","slug":"dior/lady-dior-large","retail_price_usd":5800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-oblique-backpack","brand":"Dior","model":"Dior Oblique Backpack","category":"handbags","slug":"dior/oblique-backpack","retail_price_usd":3900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-air-king-116900","brand":"Rolex","model":"Air-King 116900","category":"watches","slug":"rolex/air-king-116900","retail_price_usd":7250,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-cellini-50509","brand":"Rolex","model":"Cellini Time 50509","category":"watches","slug":"rolex/cellini-time-50509","retail_price_usd":19100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"omega-speedmaster-moonwatch","brand":"Omega","model":"Speedmaster Moonwatch Professional","category":"watches","slug":"omega/speedmaster-moonwatch-professional","retail_price_usd":6900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-ballon-bleu-36","brand":"Cartier","model":"Ballon Bleu 36mm","category":"watches","slug":"cartier/ballon-bleu-36mm","retail_price_usd":8100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-ronde-louis-29","brand":"Cartier","model":"Ronde Louis Cartier 29mm","category":"watches","slug":"cartier/ronde-louis-cartier-29mm","retail_price_usd":7500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-juste-un-clou-bracelet","brand":"Cartier","model":"Juste un Clou Bracelet","category":"jewelry","slug":"cartier/juste-un-clou-bracelet","retail_price_usd":6950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"van-cleef-vintage-alhambra-necklace","brand":"Van Cleef & Arpels","model":"Vintage Alhambra Necklace","category":"jewelry","slug":"van-cleef-arpels/vintage-alhambra-necklace","retail_price_usd":6950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tiffany-atlas-ring","brand":"Tiffany & Co.","model":"Atlas Ring","category":"jewelry","slug":"tiffany-co/atlas-ring","retail_price_usd":2200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bvlgari-divas-dream-necklace","brand":"Bulgari","model":"Divas Dream Necklace","category":"jewelry","slug":"bulgari/divas-dream-necklace","retail_price_usd":4950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"christian-louboutin-pigalle-100","brand":"Christian Louboutin","model":"Pigalle 100 Pump","category":"shoes","slug":"christian-louboutin/pigalle-100-pump","retail_price_usd":825,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-princetown-loafer","brand":"Gucci","model":"Princetown Leather Loafer","category":"shoes","slug":"gucci/princetown-leather-loafer","retail_price_usd":870,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"jimmy-choo-romy-100","brand":"Jimmy Choo","model":"Romy 100 Pump","category":"shoes","slug":"jimmy-choo/romy-100-pump","retail_price_usd":775,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-monolith-boots","brand":"Prada","model":"Monolith Brushed Boots","category":"shoes","slug":"prada/monolith-brushed-boots","retail_price_usd":1350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-monogram-trench","brand":"Louis Vuitton","model":"Monogram Flower Trench Coat","category":"clothing","slug":"louis-vuitton/monogram-flower-trench-coat","retail_price_usd":4900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-wool-blazer","brand":"Gucci","model":"GG Wool Jacquard Blazer","category":"clothing","slug":"gucci/gg-wool-jacquard-blazer","retail_price_usd":3800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-hedi-blazer","brand":"Celine","model":"Classic Single Breasted Blazer","category":"clothing","slug":"celine/classic-single-breasted-blazer","retail_price_usd":3500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-twilly","brand":"Hermès","model":"Twilly Silk Scarf","category":"scarves","slug":"hermes/twilly-silk-scarf","retail_price_usd":240,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-wool-scarf","brand":"Gucci","model":"GG Pattern Wool Scarf","category":"scarves","slug":"gucci/gg-pattern-wool-scarf","retail_price_usd":520,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-canvas-belt","brand":"Gucci","model":"GG Canvas Belt 38mm","category":"belts","slug":"gucci/gg-canvas-belt-38mm","retail_price_usd":420,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-saddle-belt","brand":"Dior","model":"Dior Saddle Belt","category":"belts","slug":"dior/saddle-belt","retail_price_usd":590,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-classic-card-holder","brand":"Chanel","model":"Classic Card Holder","category":"small-leather-goods","slug":"chanel/classic-card-holder","retail_price_usd":625,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-zippy-wallet","brand":"Louis Vuitton","model":"Zippy Wallet","category":"small-leather-goods","slug":"louis-vuitton/zippy-wallet","retail_price_usd":870,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-birkin-35","brand":"Hermès","model":"Birkin 35","category":"handbags","slug":"hermes/birkin-35","retail_price_usd":11400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-kelly-32","brand":"Hermès","model":"Kelly 32 Sellier","category":"handbags","slug":"hermes/kelly-32-sellier","retail_price_usd":10800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-flap-jumbo","brand":"Chanel","model":"Classic Flap Jumbo","category":"handbags","slug":"chanel/classic-flap-jumbo","retail_price_usd":11500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-petite-boite-chapeau","brand":"Louis Vuitton","model":"Petite Boite Chapeau","category":"handbags","slug":"louis-vuitton/petite-boite-chapeau","retail_price_usd":2900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-dior-book-tote-medium","brand":"Dior","model":"Book Tote Medium","category":"handbags","slug":"dior/book-tote-medium","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-diana-small","brand":"Gucci","model":"Diana Small Tote Bag","category":"handbags","slug":"gucci/diana-small-tote-bag","retail_price_usd":2490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-re-nylon-backpack","brand":"Prada","model":"Re-Nylon Backpack","category":"handbags","slug":"prada/re-nylon-backpack","retail_price_usd":1750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-veneta-mini-jodie","brand":"Bottega Veneta","model":"Mini Jodie Bag","category":"handbags","slug":"bottega-veneta/mini-jodie-bag","retail_price_usd":2100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"saint-laurent-loulou-small","brand":"Saint Laurent","model":"Loulou Small Bag","category":"handbags","slug":"saint-laurent/loulou-small-bag","retail_price_usd":1850,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"saint-laurent-college-medium","brand":"Saint Laurent","model":"College Medium Bag","category":"handbags","slug":"saint-laurent/college-medium-bag","retail_price_usd":1650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"loewe-puzzle-small","brand":"Loewe","model":"Puzzle Small Bag","category":"handbags","slug":"loewe/puzzle-small-bag","retail_price_usd":2900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"fendi-baguette-medium","brand":"Fendi","model":"Baguette Medium Bag","category":"handbags","slug":"fendi/baguette-medium-bag","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"alexander-mcqueen-jewelled-satchel","brand":"Alexander McQueen","model":"Jewelled Satchel Small","category":"handbags","slug":"alexander-mcqueen/jewelled-satchel-small","retail_price_usd":1895,"price_ranges":{},"price_samples":[],"last_updated":""},
]


def main():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    existing_ids = {item["id"] for item in db["items"]}
    existing_slugs = {item["slug"] for item in db["items"]}
    added = 0

    for item in NEW_ITEMS:
        if item["id"] in existing_ids:
            print(f"  skip (id exists): {item['id']}")
            continue
        if item["slug"] in existing_slugs:
            print(f"  skip (slug exists): {item['slug']}")
            continue
        if not item["last_updated"]:
            item["last_updated"] = TODAY
        db["items"].append(item)
        existing_ids.add(item["id"])
        existing_slugs.add(item["slug"])
        added += 1

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    cats: dict[str, int] = {}
    for item in db["items"]:
        cats[item["category"]] = cats.get(item["category"], 0) + 1

    print(f"\nAdded {added} items. Total: {len(db['items'])}")
    print("Count by category:")
    for cat, count in sorted(cats.items()):
        print(f"  {cat}: {count}")


if __name__ == "__main__":
    main()
