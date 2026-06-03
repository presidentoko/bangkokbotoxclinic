"""Unit tests for konvy_scraper I/O helpers (no network, no browser)."""
import csv

from cosmetics import konvy_scraper
from cosmetics.models import Product


def test_write_products_csv(tmp_path, monkeypatch):
    out = tmp_path / "products.csv"
    monkeypatch.setattr(konvy_scraper.config, "PRODUCTS_CSV", out)
    monkeypatch.setattr(konvy_scraper.config, "OUTPUT_DIR", tmp_path)
    p = Product(product_id="95356", url="https://www.konvy.com/anessa/x-95356.html",
                name="Anessa Sunscreen", brand="Anessa", price_thb=729.0, volume="60ml",
                ingredients=["Water","Niacinamide"], concern_seeds=["acne"],
                konvy_rating=5.0, konvy_review_count=170)
    konvy_scraper.write_products_csv([p])
    rows = list(csv.DictReader(out.open(encoding="utf-8")))
    assert rows[0]["product_id"] == "95356"
    assert rows[0]["name"] == "Anessa Sunscreen"
    assert rows[0]["ingredients"] == "Water|Niacinamide"
    assert rows[0]["concern_seeds"] == "acne"
    assert "ingredients_raw" not in rows[0]
