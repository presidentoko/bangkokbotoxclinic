"""Unit tests for boots_scraper pure helpers."""
from cosmetics.boots_scraper import (
    parse_product_from_ldjson,
    parse_product_from_api,
    boots_slug_to_id,
    normalize_boots_product,
)

def test_boots_slug_to_id_from_url():
    assert boots_slug_to_id("https://www.boots.co.th/p/beauty-of-joseon-calming-serum") == "beauty-of-joseon-calming-serum"
    assert boots_slug_to_id("/p/some-product-name-here") == "some-product-name-here"

def test_parse_product_from_ldjson():
    ld = {
        "@type": "Product",
        "name": "Beauty of Joseon Calming Serum",
        "brand": {"name": "Beauty of Joseon"},
        "offers": {"price": "450", "priceCurrency": "THB"},
        "aggregateRating": {"ratingValue": "4.8", "reviewCount": "256"},
        "image": "https://boots.co.th/img/product.jpg",
        "description": "Water, Glycerin, Niacinamide, Centella Asiatica Extract",
    }
    p = parse_product_from_ldjson(ld, "https://www.boots.co.th/p/beauty-of-joseon-calming-serum")
    assert p["product_id"] == "boots_beauty-of-joseon-calming-serum"
    assert p["name"] == "Beauty of Joseon Calming Serum"
    assert p["brand"] == "Beauty of Joseon"
    assert p["price_thb"] == 450.0
    assert p["konvy_rating"] == 4.8
    assert p["source"] == "boots"

def test_parse_product_from_api_dict():
    api_data = {
        "name": "COSRX Snail Mucin Essence",
        "brand": "COSRX",
        "price": {"value": 890, "currencyIso": "THB"},
        "averageRating": 4.7,
        "numberOfReviews": 120,
        "images": [{"url": "/medias/cosrx.jpg", "format": "product"}],
        "url": "/p/cosrx-snail-mucin-essence",
    }
    p = parse_product_from_api(api_data, "https://www.boots.co.th/p/cosrx-snail-mucin-essence")
    assert p["name"] == "COSRX Snail Mucin Essence"
    assert p["price_thb"] == 890.0
    assert p["konvy_rating"] == 4.7
    assert p["source"] == "boots"

def test_normalize_has_required_fields():
    p = parse_product_from_ldjson({
        "@type": "Product", "name": "Test", "brand": {"name": "Brand"},
        "offers": {"price": "100", "priceCurrency": "THB"},
    }, "https://www.boots.co.th/p/test-product")
    p["concern_seeds"] = ["acne"]
    norm = normalize_boots_product(p)
    for f in ["product_id", "url", "name", "brand", "price_thb", "source", "ingredients"]:
        assert f in norm, f"missing: {f}"
