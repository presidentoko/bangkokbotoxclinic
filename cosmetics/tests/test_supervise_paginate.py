"""discover() pagination/early-stop logic, extracted as a pure helper so the
fan-out (subprocess fetch) can be injected and tested without a browser/tunnel."""
from cosmetics import konvy_supervise as sup


def _faker(pages):
    """pages: dict {page_int: list[str] | None}. Returns a fetch_page(url, page)."""
    def fetch(url, page):
        return pages.get(page, [])
    return fetch


def test_collects_new_urls_across_pages():
    seen = {}
    pages = {1: ["a", "b", "c"], 2: ["c", "d"], 3: []}
    got = sup.paginate_base("base", "acne", _faker(pages), max_pages=8, seen=seen)
    assert got == [("a", "acne"), ("b", "acne"), ("c", "acne"), ("d", "acne")]
    assert set(seen) == {"a", "b", "c", "d"}


def test_early_stop_on_zero_new_before_max_pages():
    # page 2 repeats page 1 entirely (0 new) -> must stop, never fetch page 3
    fetched = []

    def fetch(url, page):
        fetched.append(page)
        return {1: ["a", "b"], 2: ["a", "b"], 3: ["x"]}.get(page, [])

    got = sup.paginate_base("base", "acne", fetch, max_pages=8, seen={})
    assert [u for u, _ in got] == ["a", "b"]
    assert fetched == [1, 2]            # stopped after the 0-new page 2; page 3 untouched


def test_respects_seen_from_other_seeds():
    seen = {"a": "whitening"}           # already claimed by an earlier seed
    got = sup.paginate_base("base", "acne", _faker({1: ["a", "b"]}), max_pages=8, seen=seen)
    assert got == [("b", "acne")]       # 'a' not re-claimed
    assert seen["a"] == "whitening"     # first claimer wins


def test_max_pages_cap():
    # every page yields something new, but cap bounds the fetches
    fetch = lambda url, page: [f"p{page}"]
    got = sup.paginate_base("base", "acne", fetch, max_pages=3, seen={})
    assert [u for u, _ in got] == ["p1", "p2", "p3"]


def test_failed_fetch_stops():
    def fetch(url, page):
        return None if page == 2 else ["a"]   # page 1 ok, page 2 fails
    got = sup.paginate_base("base", "acne", fetch, max_pages=8, seen={})
    assert [u for u, _ in got] == ["a"]
