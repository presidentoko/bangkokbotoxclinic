"""Unit tests for iherb_scraper pure helpers (no network/browser)."""
import pytest
from cosmetics.iherb_scraper import (
    parse_product_ldjson,
    extract_ingredients_from_description,
    iherb_slug_to_id,
    normalize_iherb_product,
)

SAMPLE_LDJSON = {
    "@type": "Product",
    "productID": "105017",
    "name": "Idealove, Bee Ageless, Snail & Bee Venom Serum, 1 fl oz (30 ml)",
    "sku": "IDE-01958",
    "brand": {"name": "Idealove"},
    "aggregateRating": {"ratingValue": "4.5", "reviewCount": "3955"},
    "offers": {"priceSpecification": [
        {"price": "467.73", "priceCurrency": "THB"},
        {"price": "550.27", "priceCurrency": "THB", "priceType": "StrikethroughPrice"},
    ]},
    "description": "Water, Glycerin, Niacinamide, Centella Asiatica Extract, Hyaluronic Acid, Fragrance",
    "image": "https://cloudinary.iherb.com/img/ide-01958.jpg",
    "gtin12": "898220019588",
    "url": "https://th.iherb.com/pr/idealove-bee-ageless/105017",
    "category": "Beauty/Treatments & Serums/Face Serums",
}

def test_parse_product_ldjson_extracts_core_fields():
    p = parse_product_ldjson(SAMPLE_LDJSON, "https://th.iherb.com/pr/idealove/105017")
    assert p["product_id"] == "iherb_105017"
    assert p["name"] == "Idealove, Bee Ageless, Snail & Bee Venom Serum, 1 fl oz (30 ml)"
    assert p["brand"] == "Idealove"
    assert p["price_thb"] == 467.73
    assert p["list_price_thb"] == 550.27
    assert p["konvy_rating"] == 4.5
    assert p["konvy_review_count"] == 3955
    assert p["source"] == "iherb"

def test_parse_product_ldjson_extracts_discount():
    p = parse_product_ldjson(SAMPLE_LDJSON, "https://th.iherb.com/pr/idealove/105017")
    assert p["discount_pct"] > 0  # (550.27 - 467.73) / 550.27 ≈ 15%

def test_extract_ingredients_from_description():
    desc = "Water, Glycerin, Niacinamide (10%), Centella Asiatica Extract, Hyaluronic Acid."
    ingredients = extract_ingredients_from_description(desc)
    assert "Water" in ingredients
    assert "Glycerin" in ingredients
    assert "Niacinamide (10%)" in ingredients
    assert len(ingredients) >= 3

def test_extract_ingredients_empty():
    assert extract_ingredients_from_description("") == []
    assert extract_ingredients_from_description("Great moisturizer for dry skin") == []

def test_iherb_slug_to_id():
    assert iherb_slug_to_id("https://th.iherb.com/pr/brand-product-name/105017") == "105017"
    assert iherb_slug_to_id("https://th.iherb.com/pr/some/thing/99999") == "99999"
    assert iherb_slug_to_id("/pr/product/12345") == "12345"

def test_normalize_iherb_product_has_required_fields():
    p = parse_product_ldjson(SAMPLE_LDJSON, "https://th.iherb.com/pr/idealove/105017")
    p["concern_seeds"] = ["whitening"]
    norm = normalize_iherb_product(p)
    # Must have all CSV fields
    required = ["product_id", "url", "name", "brand", "price_thb", "source",
                "ingredients", "konvy_rating", "konvy_review_count", "concern_seeds"]
    for f in required:
        assert f in norm, f"missing field: {f}"
