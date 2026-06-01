from cosmetics import konvy_parse
from cosmetics.models import Product


def test_parse_listing_extracts_product_links(fixture_text):
    html = fixture_text("list_acne_p1.html")
    links = konvy_parse.parse_listing(html)
    # The captured listing has ~31 real products
    assert len(links) >= 20
    assert all(u.startswith("https://www.konvy.com/") for u in links)
    assert all(u.endswith(".html") for u in links)
    # excludes brand/category/nav links
    assert not any("/brand/" in u or "/list/" in u or "list.php" in u for u in links)
    # product links have a trailing -<id>.html
    import re
    assert all(re.search(r"-\d+\.html$", u) for u in links)
    # no duplicates
    assert len(links) == len(set(links))


PRODUCT_URL = "https://www.konvy.com/anessa/anessa-perfect-uv-sunscreen-milk-na-spf50%2b-pa%2b%2b%2b%2b-60ml-95356.html"


def test_parse_product_core_fields_from_ldjson(fixture_text):
    html = fixture_text("product_sample.html")
    p = konvy_parse.parse_product(html, url=PRODUCT_URL)
    assert isinstance(p, Product)
    assert p.product_id == "95356"
    assert p.name
    assert p.brand            # non-empty
    assert p.price_thb == 729.0
    assert p.konvy_rating == 5.0
    assert p.konvy_review_count == 170
    assert p.image_url.startswith("http")


def test_parse_product_extracts_ingredients(fixture_text):
    html = fixture_text("product_sample.html")
    p = konvy_parse.parse_product(html, url=PRODUCT_URL)
    assert len(p.ingredients) >= 3
    assert "Water" in p.ingredients
    # raw mirrors the list
    assert "Water" in p.ingredients_raw


def test_split_inci_helper():
    assert konvy_parse.split_inci("Water, Niacinamide,  , Salicylic Acid\nGlycerin") == \
        ["Water", "Niacinamide", "Salicylic Acid", "Glycerin"]


from cosmetics.models import KonvyReview


def test_parse_reviews_from_json(fixture_text):
    raw = fixture_text("reviews_sample.json")
    reviews = konvy_parse.parse_reviews(raw)
    assert len(reviews) >= 1
    r = reviews[0]
    assert isinstance(r, KonvyReview)
    assert 1 <= r.rating <= 5
    assert r.body                      # non-empty review text
    assert r.review_id


def test_parse_reviews_handles_bom_and_garbage():
    # BOM-prefixed + non-JSON should not crash
    assert konvy_parse.parse_reviews("﻿not json") == []
    assert konvy_parse.parse_reviews("") == []
