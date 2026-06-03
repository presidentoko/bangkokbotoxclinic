"""Discovery pagination: seeds must page through ?page=N, not just page 1.

Root cause of the 415-product plateau was that discovery fetched exactly one
page (~32 products) per seed. Konvy paginates via ?page=N (the skincare hub
alone has ~201 pages), so these tests pin the paginated URL/seed construction.
"""
from cosmetics import config


def test_paged_url_page1_is_base_unchanged():
    base = "https://www.konvy.com/list/?title=x"
    assert config.paged_url(base, 1) == base


def test_paged_url_appends_with_ampersand_when_query_present():
    base = "https://www.konvy.com/list/?title=x"
    assert config.paged_url(base, 2) == base + "&page=2"
    base2 = "https://www.konvy.com/mall/list.php?param=113-0-0-0&from=category"
    assert config.paged_url(base2, 3) == base2 + "&page=3"


def test_paged_url_appends_with_question_mark_when_no_query():
    base = "https://www.konvy.com/list/skincare/"
    assert config.paged_url(base, 2) == base + "?page=2"


def test_listing_seed_bases_are_page1_pairs():
    bases = config.listing_seed_bases()
    assert len(bases) > 0
    for url, concern in bases:
        assert "page=" not in url            # bases carry no page param
        assert concern in config.CONCERNS


def test_pages_per_seed_is_conservative_positive():
    assert isinstance(config.DISCOVER_PAGES_PER_SEED, int)
    assert 1 < config.DISCOVER_PAGES_PER_SEED <= config.MAX_LIST_PAGES


def test_search_listing_urls_paginates_each_base():
    bases = config.listing_seed_bases()
    pages = 3
    seeds = config.search_listing_urls(pages=pages)
    # every base expanded to `pages` pages, concern preserved
    assert len(seeds) == len(bases) * pages
    # page-1 entries equal the bare bases
    page1 = [(u, c) for (u, c) in seeds if "page=" not in u]
    assert sorted(page1) == sorted(bases)
    # deeper pages exist and are well-formed
    assert any(u.endswith("page=2") for u, _ in seeds)
    assert any(u.endswith("page=3") for u, _ in seeds)


def test_search_listing_urls_defaults_to_pages_per_seed():
    seeds = config.search_listing_urls()
    bases = config.listing_seed_bases()
    assert len(seeds) == len(bases) * config.DISCOVER_PAGES_PER_SEED
