import json
from datetime import date

DB_PATH = "data/items_db.json"
TODAY = date.today().isoformat()

CLOTHING_ITEMS = [
    {"id":"chanel-tweed-jacket","brand":"Chanel","model":"Classic Tweed Jacket","category":"clothing","slug":"chanel/classic-tweed-jacket","retail_price_usd":5800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-little-black-dress","brand":"Chanel","model":"Little Black Dress","category":"clothing","slug":"chanel/little-black-dress","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"burberry-trench-coat","brand":"Burberry","model":"Westminster Trench Coat","category":"clothing","slug":"burberry/westminster-trench-coat","retail_price_usd":2090,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-blazer","brand":"Gucci","model":"GG Jacquard Blazer","category":"clothing","slug":"gucci/gg-jacquard-blazer","retail_price_usd":2900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-bar-jacket","brand":"Dior","model":"Bar Jacket","category":"clothing","slug":"dior/bar-jacket","retail_price_usd":4800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-veneta-trench","brand":"Bottega Veneta","model":"Leather Trench Coat","category":"clothing","slug":"bottega-veneta/leather-trench-coat","retail_price_usd":6500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"saint-laurent-leather-jacket","brand":"Saint Laurent","model":"Classic Motorcycle Jacket","category":"clothing","slug":"saint-laurent/classic-motorcycle-jacket","retail_price_usd":4990,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"valentino-rockstud-dress","brand":"Valentino","model":"Rockstud Mini Dress","category":"clothing","slug":"valentino/rockstud-mini-dress","retail_price_usd":2800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-blazer","brand":"Celine","model":"Single Breasted Blazer","category":"clothing","slug":"celine/single-breasted-blazer","retail_price_usd":2400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"balenciaga-oversized-hoodie","brand":"Balenciaga","model":"Oversized Logo Hoodie","category":"clothing","slug":"balenciaga/oversized-logo-hoodie","retail_price_usd":995,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-nylon-jacket","brand":"Prada","model":"Re-Nylon Jacket","category":"clothing","slug":"prada/re-nylon-jacket","retail_price_usd":1650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-monogram-coat","brand":"Louis Vuitton","model":"Monogram Wool Coat","category":"clothing","slug":"louis-vuitton/monogram-wool-coat","retail_price_usd":3800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-cashmere-sweater","brand":"Hermès","model":"Cashmere V-Neck Sweater","category":"clothing","slug":"hermes/cashmere-v-neck-sweater","retail_price_usd":1350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"moncler-maya-jacket","brand":"Moncler","model":"Maya Short Down Jacket","category":"clothing","slug":"moncler/maya-short-down-jacket","retail_price_usd":1530,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"off-white-industrial-belt-bag","brand":"Off-White","model":"Industrial Belt Bag","category":"clothing","slug":"off-white/industrial-belt-bag","retail_price_usd":590,"price_ranges":{},"price_samples":[],"last_updated":""},
]

NEW_WATCHES = [
    {"id":"patek-calatrava-5196","brand":"Patek Philippe","model":"Calatrava 5196","category":"watches","slug":"patek-philippe/calatrava-5196","retail_price_usd":22000,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ap-royal-oak-15400","brand":"Audemars Piguet","model":"Royal Oak 15400","category":"watches","slug":"audemars-piguet/royal-oak-15400","retail_price_usd":24100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"breitling-navitimer-b01","brand":"Breitling","model":"Navitimer B01 Chronograph 43","category":"watches","slug":"breitling/navitimer-b01-chronograph-43","retail_price_usd":9700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-tank-must","brand":"Cartier","model":"Tank Must","category":"watches","slug":"cartier/tank-must","retail_price_usd":3300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"iwc-portugieser-auto","brand":"IWC Schaffhausen","model":"Portugieser Automatic 40","category":"watches","slug":"iwc-schaffhausen/portugieser-automatic-40","retail_price_usd":8500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"jaeger-reverso-classic","brand":"Jaeger-LeCoultre","model":"Reverso Classic Small","category":"watches","slug":"jaeger-lecoultre/reverso-classic-small","retail_price_usd":5900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"vacheron-overseas-auto","brand":"Vacheron Constantin","model":"Overseas Automatic 41mm","category":"watches","slug":"vacheron-constantin/overseas-automatic-41mm","retail_price_usd":26600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tag-heuer-carrera-heuer01","brand":"TAG Heuer","model":"Carrera Heuer-01","category":"watches","slug":"tag-heuer/carrera-heuer-01","retail_price_usd":5200,"price_ranges":{},"price_samples":[],"last_updated":""},
]

MORE_BAGS = [
    {"id":"celine-triomphe-canvas","brand":"Celine","model":"Triomphe Canvas Bag","category":"handbags","slug":"celine/triomphe-canvas-bag","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"loewe-puzzle-small","brand":"Loewe","model":"Puzzle Small Bag","category":"handbags","slug":"loewe/puzzle-small-bag","retail_price_usd":2250,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-cassette","brand":"Bottega Veneta","model":"Cassette Bag","category":"handbags","slug":"bottega-veneta/cassette-bag","retail_price_usd":2850,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"miu-miu-wander","brand":"Miu Miu","model":"Wander Matelassé Bag","category":"handbags","slug":"miu-miu/wander-matelasse-bag","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"jacquemus-le-chiquito","brand":"Jacquemus","model":"Le Chiquito Moyen","category":"handbags","slug":"jacquemus/le-chiquito-moyen","retail_price_usd":595,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"saint-laurent-loulou","brand":"Saint Laurent","model":"Loulou Medium Bag","category":"handbags","slug":"saint-laurent/loulou-medium-bag","retail_price_usd":2150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-30-montaigne","brand":"Dior","model":"30 Montaigne Bag","category":"handbags","slug":"dior/30-montaigne-bag","retail_price_usd":3700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-19-medium","brand":"Chanel","model":"19 Medium Flap","category":"handbags","slug":"chanel/19-medium-flap","retail_price_usd":5900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-horsebit-1955","brand":"Gucci","model":"Horsebit 1955 Small Bag","category":"handbags","slug":"gucci/horsebit-1955-small-bag","retail_price_usd":1380,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-re-edition-2005","brand":"Prada","model":"Re-Edition 2005 Shoulder Bag","category":"handbags","slug":"prada/re-edition-2005-shoulder-bag","retail_price_usd":1390,"price_ranges":{},"price_samples":[],"last_updated":""},
]

def main():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    existing_ids = {item["id"] for item in db["items"]}
    added = 0

    for item in CLOTHING_ITEMS + NEW_WATCHES + MORE_BAGS:
        if item["id"] in existing_ids:
            print(f"  skip (exists): {item['id']}")
            continue
        if not item["last_updated"]:
            item["last_updated"] = TODAY
        db["items"].append(item)
        existing_ids.add(item["id"])
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
