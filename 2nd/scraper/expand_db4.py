import json
from datetime import date

DB_PATH = "data/items_db.json"
TODAY = date.today().isoformat()

NEW_ITEMS = [
    {"id":"chanel-gabrielle-small","brand":"Chanel","model":"Gabrielle Small Hobo","category":"handbags","slug":"chanel/gabrielle-small-hobo","retail_price_usd":4150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-deauville-tote","brand":"Chanel","model":"Deauville Tote Large","category":"handbags","slug":"chanel/deauville-tote-large","retail_price_usd":3700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-vanity-case","brand":"Chanel","model":"Vanity Case Small","category":"handbags","slug":"chanel/vanity-case-small","retail_price_usd":3300,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-twist-mm","brand":"Louis Vuitton","model":"Twist MM","category":"handbags","slug":"louis-vuitton/twist-mm","retail_price_usd":3700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-petite-malle","brand":"Louis Vuitton","model":"Petite Malle","category":"handbags","slug":"louis-vuitton/petite-malle","retail_price_usd":5400,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-capucines-bb","brand":"Louis Vuitton","model":"Capucines BB","category":"handbags","slug":"louis-vuitton/capucines-bb","retail_price_usd":5650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-nano-noe","brand":"Louis Vuitton","model":"Nano Noé","category":"handbags","slug":"louis-vuitton/nano-noe","retail_price_usd":1390,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-picotin-18","brand":"Hermès","model":"Picotin 18","category":"handbags","slug":"hermes/picotin-18","retail_price_usd":2375,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-garden-party-36","brand":"Hermès","model":"Garden Party 36","category":"handbags","slug":"hermes/garden-party-36","retail_price_usd":3025,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-evelyne-tpm","brand":"Hermès","model":"Evelyne TPM","category":"handbags","slug":"hermes/evelyne-tpm","retail_price_usd":2550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-book-tote","brand":"Dior","model":"Book Tote Small","category":"handbags","slug":"dior/book-tote-small","retail_price_usd":2900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-diorama","brand":"Dior","model":"Diorama Bag","category":"handbags","slug":"dior/diorama-bag","retail_price_usd":3800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-ophidia-gg-tote","brand":"Gucci","model":"Ophidia GG Medium Tote","category":"handbags","slug":"gucci/ophidia-gg-medium-tote","retail_price_usd":1490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-bamboo-1947-small","brand":"Gucci","model":"Bamboo 1947 Small Top Handle","category":"handbags","slug":"gucci/bamboo-1947-small-top-handle","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-galleria-medium","brand":"Prada","model":"Galleria Saffiano Tote Medium","category":"handbags","slug":"prada/galleria-saffiano-tote-medium","retail_price_usd":3100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-cleo-brushed","brand":"Prada","model":"Cleo Brushed Leather Bag","category":"handbags","slug":"prada/cleo-brushed-leather-bag","retail_price_usd":1950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-veneta-arco-33","brand":"Bottega Veneta","model":"Arco 33 Tote","category":"handbags","slug":"bottega-veneta/arco-33-tote","retail_price_usd":3500,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bottega-veneta-jodie-small","brand":"Bottega Veneta","model":"Jodie Small Hobo","category":"handbags","slug":"bottega-veneta/jodie-small-hobo","retail_price_usd":2600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-luggage-nano","brand":"Celine","model":"Luggage Nano Bag","category":"handbags","slug":"celine/luggage-nano-bag","retail_price_usd":2450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"celine-medium-classic","brand":"Celine","model":"Medium Classic Box Flap","category":"handbags","slug":"celine/medium-classic-box-flap","retail_price_usd":3950,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"omega-aqua-terra-38","brand":"Omega","model":"Aqua Terra 38.5mm","category":"watches","slug":"omega/aqua-terra-38-5mm","retail_price_usd":5800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-datejust-36","brand":"Rolex","model":"Datejust 36","category":"watches","slug":"rolex/datejust-36","retail_price_usd":7550,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"rolex-gmt-master-ii","brand":"Rolex","model":"GMT-Master II","category":"watches","slug":"rolex/gmt-master-ii","retail_price_usd":15100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"patek-nautilus-5711","brand":"Patek Philippe","model":"Nautilus 5711","category":"watches","slug":"patek-philippe/nautilus-5711","retail_price_usd":35000,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-love-necklace","brand":"Cartier","model":"Love Necklace","category":"jewelry","slug":"cartier/love-necklace","retail_price_usd":2100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tiffany-return-to-tiffany","brand":"Tiffany & Co.","model":"Return to Tiffany Heart Tag Bracelet","category":"jewelry","slug":"tiffany-co/return-to-tiffany-heart-tag-bracelet","retail_price_usd":475,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bvlgari-b-zero1-ring","brand":"Bulgari","model":"B.zero1 Ring","category":"jewelry","slug":"bulgari/b-zero1-ring","retail_price_usd":1590,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bvlgari-serpenti-bracelet","brand":"Bulgari","model":"Serpenti Bracelet","category":"jewelry","slug":"bulgari/serpenti-bracelet","retail_price_usd":5200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"manolo-hangisi-105","brand":"Manolo Blahnik","model":"Hangisi 105 Pump","category":"shoes","slug":"manolo-blahnik/hangisi-105-pump","retail_price_usd":1025,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"roger-vivier-belle-vivier","brand":"Roger Vivier","model":"Belle Vivier Pump","category":"shoes","slug":"roger-vivier/belle-vivier-pump","retail_price_usd":995,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"valentino-rockstud-pump","brand":"Valentino","model":"Rockstud Pump 105","category":"shoes","slug":"valentino/rockstud-pump-105","retail_price_usd":1050,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-calvi-cardholder","brand":"Hermès","model":"Calvi Card Holder","category":"small-leather-goods","slug":"hermes/calvi-card-holder","retail_price_usd":490,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-gg-marmont-card","brand":"Gucci","model":"GG Marmont Card Case","category":"small-leather-goods","slug":"gucci/gg-marmont-card-case","retail_price_usd":395,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-saffiano-wallet","brand":"Prada","model":"Saffiano Leather Bifold Wallet","category":"small-leather-goods","slug":"prada/saffiano-leather-bifold-wallet","retail_price_usd":570,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"ferragamo-gancini-belt","brand":"Salvatore Ferragamo","model":"Gancini Belt","category":"belts","slug":"salvatore-ferragamo/gancini-belt","retail_price_usd":390,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"versace-medusa-belt","brand":"Versace","model":"Medusa Head Belt","category":"belts","slug":"versace/medusa-head-belt","retail_price_usd":450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-keepall-55","brand":"Louis Vuitton","model":"Keepall Bandoulière 55","category":"handbags","slug":"louis-vuitton/keepall-bandouliere-55","retail_price_usd":2130,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-multi-pochette","brand":"Louis Vuitton","model":"Multi Pochette Accessories","category":"handbags","slug":"louis-vuitton/multi-pochette-accessories","retail_price_usd":1790,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"goyard-st-louis-pm","brand":"Goyard","model":"Saint Louis PM Tote","category":"handbags","slug":"goyard/saint-louis-pm-tote","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"loewe-hammock-small","brand":"Loewe","model":"Hammock Small Bag","category":"handbags","slug":"loewe/hammock-small-bag","retail_price_usd":2350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"loewe-gate-small","brand":"Loewe","model":"Gate Small Bag","category":"handbags","slug":"loewe/gate-small-bag","retail_price_usd":1900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"givenchy-antigona-medium","brand":"Givenchy","model":"Antigona Medium Bag","category":"handbags","slug":"givenchy/antigona-medium-bag","retail_price_usd":2290,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"balenciaga-city-medium","brand":"Balenciaga","model":"City Bag Medium","category":"handbags","slug":"balenciaga/city-bag-medium","retail_price_usd":1750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"fendi-first-small","brand":"Fendi","model":"First Small Bag","category":"handbags","slug":"fendi/first-small-bag","retail_price_usd":2750,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-caro-medium","brand":"Dior","model":"Caro Medium Bag","category":"handbags","slug":"dior/caro-medium-bag","retail_price_usd":4900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-nylon-shoulder","brand":"Prada","model":"Nylon Shoulder Bag","category":"handbags","slug":"prada/nylon-shoulder-bag","retail_price_usd":1250,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-gst","brand":"Chanel","model":"Grand Shopping Tote","category":"handbags","slug":"chanel/grand-shopping-tote","retail_price_usd":3650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-19-large","brand":"Chanel","model":"19 Large Flap","category":"handbags","slug":"chanel/19-large-flap","retail_price_usd":6200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"valentino-vsling-small","brand":"Valentino","model":"VSling Small Bag","category":"handbags","slug":"valentino/vsling-small-bag","retail_price_usd":1375,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"coach-tabby-shoulder-26","brand":"Coach","model":"Tabby Shoulder Bag 26","category":"handbags","slug":"coach/tabby-shoulder-bag-26","retail_price_usd":495,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"marc-jacobs-snapshot","brand":"Marc Jacobs","model":"The Snapshot Camera Bag","category":"handbags","slug":"marc-jacobs/the-snapshot-camera-bag","retail_price_usd":328,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tory-burch-lee-radziwill","brand":"Tory Burch","model":"Lee Radziwill Small Bag","category":"handbags","slug":"tory-burch/lee-radziwill-small-bag","retail_price_usd":698,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"longchamp-le-pliage-cuir","brand":"Longchamp","model":"Le Pliage Cuir Medium","category":"handbags","slug":"longchamp/le-pliage-cuir-medium","retail_price_usd":690,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-saddle-mini","brand":"Dior","model":"Saddle Mini Bag","category":"handbags","slug":"dior/saddle-mini-bag","retail_price_usd":3200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-marmont-medium-shoulder","brand":"Gucci","model":"GG Marmont Matelassé Medium Shoulder","category":"handbags","slug":"gucci/gg-marmont-matelasse-medium-shoulder","retail_price_usd":1980,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"cartier-panthere-watch","brand":"Cartier","model":"Panthère de Cartier Watch","category":"watches","slug":"cartier/panthere-de-cartier-watch","retail_price_usd":9200,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"omega-de-ville-prestige","brand":"Omega","model":"De Ville Prestige 39.5mm","category":"watches","slug":"omega/de-ville-prestige-39-5mm","retail_price_usd":4100,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hublot-classic-fusion-42","brand":"Hublot","model":"Classic Fusion 42mm","category":"watches","slug":"hublot/classic-fusion-42mm","retail_price_usd":6600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"longines-master-40","brand":"Longines","model":"Master Collection 40mm","category":"watches","slug":"longines/master-collection-40mm","retail_price_usd":2050,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chopard-happy-sport-bracelet","brand":"Chopard","model":"Happy Sport Bracelet","category":"jewelry","slug":"chopard/happy-sport-bracelet","retail_price_usd":2600,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"van-cleef-sweet-alhambra-earrings","brand":"Van Cleef & Arpels","model":"Sweet Alhambra Earrings","category":"jewelry","slug":"van-cleef-arpels/sweet-alhambra-earrings","retail_price_usd":2350,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"bvlgari-divas-dream-ring","brand":"Bulgari","model":"Divas Dream Ring","category":"jewelry","slug":"bulgari/divas-dream-ring","retail_price_usd":2800,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"tiffany-soleste-ring","brand":"Tiffany & Co.","model":"Soleste Ring","category":"jewelry","slug":"tiffany-co/soleste-ring","retail_price_usd":3900,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-kelly-bracelet","brand":"Hermès","model":"Kelly Bracelet","category":"jewelry","slug":"hermes/kelly-bracelet","retail_price_usd":1450,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-oasis-sandal","brand":"Hermès","model":"Oasis Sandal","category":"shoes","slug":"hermes/oasis-sandal","retail_price_usd":770,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"prada-block-heel-mule","brand":"Prada","model":"Block Heel Mule","category":"shoes","slug":"prada/block-heel-mule","retail_price_usd":780,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-archlight-sneaker","brand":"Louis Vuitton","model":"Archlight Sneaker","category":"shoes","slug":"louis-vuitton/archlight-sneaker","retail_price_usd":1050,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"gucci-ace-sneaker","brand":"Gucci","model":"Ace Sneaker","category":"shoes","slug":"gucci/ace-sneaker","retail_price_usd":650,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-dway-slide","brand":"Dior","model":"Dway Slide","category":"shoes","slug":"dior/dway-slide","retail_price_usd":700,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-brazza-wallet","brand":"Louis Vuitton","model":"Brazza Wallet","category":"small-leather-goods","slug":"louis-vuitton/brazza-wallet","retail_price_usd":790,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"chanel-boy-wallet","brand":"Chanel","model":"Boy Wallet On Chain","category":"small-leather-goods","slug":"chanel/boy-wallet-on-chain","retail_price_usd":2150,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"hermes-azap-wallet","brand":"Hermès","model":"Azap Silk In Wallet","category":"small-leather-goods","slug":"hermes/azap-silk-in-wallet","retail_price_usd":820,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"lv-victorine-wallet","brand":"Louis Vuitton","model":"Victorine Wallet","category":"small-leather-goods","slug":"louis-vuitton/victorine-wallet","retail_price_usd":445,"price_ranges":{},"price_samples":[],"last_updated":""},
    {"id":"dior-30-montaigne-card","brand":"Dior","model":"30 Montaigne Card Holder","category":"small-leather-goods","slug":"dior/30-montaigne-card-holder","retail_price_usd":550,"price_ranges":{},"price_samples":[],"last_updated":""},
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
