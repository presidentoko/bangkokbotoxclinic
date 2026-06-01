from cosmetics import konvy_parse


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
