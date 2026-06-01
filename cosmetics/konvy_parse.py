"""Konvy 응답 → 도메인 객체. 순수 함수(네트워크 없음)라 fixture로 테스트 가능."""
from __future__ import annotations
import json
import re
import time
from bs4 import BeautifulSoup
from cosmetics.models import Product

_PRODUCT_URL_RE = re.compile(r"^https://www\.konvy\.com/[\w%.-]+/[\w%.-]+-\d+\.html$")
_EXCLUDE = ("/brand/", "/list/", "list.php", "team", "cart", "static")


def parse_listing(html: str) -> list[str]:
    """제품 목록 페이지 HTML → 제품 상세 URL 리스트 (dedup, 순서 보존)."""
    soup = BeautifulSoup(html, "lxml")
    out: list[str] = []
    seen: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip().split("#")[0].split("?")[0]
        if href.startswith("/"):
            href = "https://www.konvy.com" + href
        if any(x in href for x in _EXCLUDE):
            continue
        if _PRODUCT_URL_RE.match(href) and href not in seen:
            seen.add(href)
            out.append(href)
    return out


# ---------------------------------------------------------------------------
# INCI helpers
# ---------------------------------------------------------------------------

_INCI_SEP = re.compile(r"[,\n;•·]+")


def split_inci(raw: str) -> list[str]:
    """INCI 원문 문자열 → 성분명 리스트 (콤마/줄바꿈/세미콜론/불릿 구분, 공백 제거, 빈 항목 제거)."""
    parts = _INCI_SEP.split(raw)
    return [p.strip() for p in parts if len(p.strip()) >= 2]


# ---------------------------------------------------------------------------
# Product detail parser
# ---------------------------------------------------------------------------

def _product_id_from_url(url: str) -> str:
    m = re.search(r"-(\d+)\.html", url)
    return m.group(1) if m else ""


def _safe_float(val: object) -> float:
    try:
        return float(val)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return 0.0


def _safe_int(val: object) -> int:
    try:
        return int(val)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return 0


def _find_ldjson_product(soup: BeautifulSoup) -> dict:
    """soup から @type==Product の ld+json ブロックを返す。見つからなければ {}."""
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or script.get_text())
        except (json.JSONDecodeError, TypeError):
            continue
        # Handle list / @graph wrapping
        candidates: list[dict] = []
        if isinstance(data, list):
            candidates = data
        elif isinstance(data, dict):
            if data.get("@type") == "Product":
                return data
            # @graph pattern
            candidates = data.get("@graph", [])
        for item in candidates:
            if isinstance(item, dict) and item.get("@type") == "Product":
                return item
    return {}


def parse_product(html: str, url: str) -> Product:
    """제품 상세 페이지 HTML + URL → Product 도메인 객체."""
    soup = BeautifulSoup(html, "lxml")
    ld = _find_ldjson_product(soup)

    # --- core fields from ld+json ---
    name: str = ld.get("name") or ""

    brand_raw = ld.get("brand")
    if isinstance(brand_raw, dict):
        brand: str = brand_raw.get("name") or ""
    else:
        brand = brand_raw or ""

    image_raw = ld.get("image")
    if isinstance(image_raw, list):
        image_url: str = image_raw[0] if image_raw else ""
    else:
        image_url = image_raw or ""

    sku: str = ld.get("sku") or ""

    offers = ld.get("offers") or {}
    price_thb: float = _safe_float(offers.get("price", 0))

    ar = ld.get("aggregateRating") or {}
    konvy_rating: float = _safe_float(ar.get("ratingValue", 0))
    konvy_review_count: int = _safe_int(ar.get("reviewCount", 0))

    # --- ingredients from HTML ---
    ing_anchors = soup.select("#ingredient_data_main a.ingredientFont")
    ingredients: list[str] = [a.get_text(strip=True) for a in ing_anchors if a.get_text(strip=True)]
    ingredients_raw: str = ", ".join(ingredients)

    return Product(
        product_id=_product_id_from_url(url) or sku,
        url=url,
        name=name,
        brand=brand,
        price_thb=price_thb,
        image_url=image_url,
        ingredients_raw=ingredients_raw,
        ingredients=ingredients,
        konvy_rating=konvy_rating,
        konvy_review_count=konvy_review_count,
        fetched_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    )
