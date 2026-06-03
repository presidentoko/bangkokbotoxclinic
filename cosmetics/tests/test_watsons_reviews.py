"""Unit tests for watsons_reviews pure helpers (no network/browser)."""
from cosmetics.watsons_reviews import _normalize, _similarity, _empty


def test_normalize_strips_volume():
    assert "niacinamide serum" == _normalize("Niacinamide Serum 30ml")
    assert "retinol cream" == _normalize("Retinol Cream 50g")


def test_similarity_exact():
    assert _similarity("Niacinamide", "Niacinamide") == 1.0


def test_similarity_partial():
    s = _similarity("CeraVe Hydrating Cleanser", "cerave hydrating facial cleanser")
    assert s > 0.7


def test_empty_returns_correct_schema():
    r = _empty("Test Product")
    assert r["source"] == "watsons"
    assert r["review_count"] == 0
    assert r["snippets"] == []
    assert "fetched_at" in r
