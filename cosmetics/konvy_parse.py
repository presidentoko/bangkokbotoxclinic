"""Konvy 응답 → 도메인 객체. 순수 함수(네트워크 없음)라 fixture로 테스트 가능."""
from __future__ import annotations
import json
import re
import time
from bs4 import BeautifulSoup
from cosmetics.models import KonvyReview, Product

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


def parse_reviews(raw: str) -> list[KonvyReview]:
    """Konvy ajax_comment JSON 응답 → KonvyReview 리스트.

    JSON shape: {"comments": [...]} or bare list.
    Each comment: id, score (1-5 rating), content (body), user.username (author),
    create_time (timestamp), like (helpful_count).
    """
    # Strip BOM if present
    raw = raw.lstrip("﻿").strip()
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return []

    # Accept dict with "comments" key, or bare list
    if isinstance(data, dict):
        comments = data.get("comments", [])
    elif isinstance(data, list):
        comments = data
    else:
        return []

    reviews: list[KonvyReview] = []
    for c in comments:
        if not isinstance(c, dict):
            continue
        body: str = (c.get("content") or "").strip()
        if not body:
            continue  # skip empty reviews

        review_id: str = str(c.get("id", ""))
        rating: float = _safe_float(c.get("score", 0))
        helpful_count: int = _safe_int(c.get("like", 0))
        timestamp: str = str(c.get("create_time") or "")

        # Author: prefer user.username (nested dict); fall back to user_id str
        user_obj = c.get("user")
        if isinstance(user_obj, dict):
            author = str(user_obj.get("username") or "").strip()
        else:
            author = ""
        if not author:
            author = str(c.get("user_id") or "")

        reviews.append(KonvyReview(
            review_id=review_id,
            rating=rating,
            body=body,
            author=author,
            timestamp=timestamp,
            helpful_count=helpful_count,
        ))
    return reviews


# size/volume at end of a product name: "15ml", "30 ml", "50g", "60 tablets", "1 set"...
_VOL_RE = re.compile(
    r"(\d+(?:\.\d+)?)\s?"
    r"(ml|ML|cc|g|G|kg|l|L|มล\.?|กรัม|ก\.|ชิ้น|แคปซูล|เม็ด|ซอง|หลอด|ขวด|แผ่น|"
    r"tablets?|capsules?|caps?|pcs?|sheets?|pairs?|set)\b",
    re.IGNORECASE,
)


def extract_volume(name: str) -> str:
    """제품명 끝의 용량 표기 추출 ('...Serum 30ml' → '30ml'). 못 찾으면 ''."""
    matches = list(_VOL_RE.finditer(name or ""))
    if not matches:
        return ""
    m = matches[-1]  # 보통 마지막에 옴
    return f"{m.group(1)}{m.group(2)}"


def parse_product(html: str, url: str) -> Product:
    """제품 상세 페이지 HTML + URL → Product 도메인 객체 (가능한 모든 필드 추출)."""
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
        images: list[str] = [str(i) for i in image_raw if i]
    elif image_raw:
        images = [str(image_raw)]
    else:
        images = []
    image_url: str = images[0] if images else ""

    sku: str = str(ld.get("sku") or "")
    gtin8: str = str(ld.get("gtin8") or "")
    description: str = (ld.get("description") or "").strip()

    offers = ld.get("offers") or {}
    price_thb: float = _safe_float(offers.get("price", 0))

    ar = ld.get("aggregateRating") or {}
    konvy_rating: float = _safe_float(ar.get("ratingValue", 0))
    konvy_rating_best: float = _safe_float(ar.get("bestRating", 5)) or 5.0
    konvy_review_count: int = _safe_int(ar.get("reviewCount", 0))

    # --- ingredients from HTML (anchors already split per-ingredient) ---
    ing_anchors = soup.select("#ingredient_data_main a.ingredientFont")
    ingredients: list[str] = [a.get_text(strip=True) for a in ing_anchors if a.get_text(strip=True)]
    ingredients_raw: str = ", ".join(ingredients)

    # --- sold count ("สั่งแล้ว"): span.pro_dotteh_Bought ---
    sold_count = 0
    sold_el = soup.select_one(".pro_dotteh_Bought")
    if sold_el:
        sold_count = _safe_int(re.sub(r"[^\d]", "", sold_el.get_text()))

    # --- original price + discount: <span style="...line-through...">฿1690</span> ... -25% ---
    list_price_thb = 0.0
    discount_pct = 0
    strike = soup.find("span", style=lambda s: bool(s) and "line-through" in s)
    if strike:
        list_price_thb = _safe_float(re.sub(r"[^\d.]", "", strike.get_text()) or 0)
        # discount % usually in the sibling text right after the strike price
        tail = strike.find_next(string=re.compile(r"-?\d+\s*%"))
        if tail:
            mdisc = re.search(r"(\d+)\s*%", tail)
            if mdisc:
                discount_pct = _safe_int(mdisc.group(1))
    if not discount_pct and list_price_thb and price_thb and list_price_thb > price_thb:
        discount_pct = int(round((list_price_thb - price_thb) / list_price_thb * 100))

    return Product(
        product_id=_product_id_from_url(url) or sku,
        url=url,
        name=name,
        brand=brand,
        price_thb=price_thb,
        list_price_thb=list_price_thb,
        discount_pct=discount_pct,
        volume=extract_volume(name),
        image_url=image_url,
        images=images,
        sku=sku,
        gtin8=gtin8,
        description=description,
        ingredients_raw=ingredients_raw,
        ingredients=ingredients,
        ingredient_count=len(ingredients),
        konvy_rating=konvy_rating,
        konvy_rating_best=konvy_rating_best,
        konvy_review_count=konvy_review_count,
        sold_count=sold_count,
        fetched_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    )
