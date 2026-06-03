"""Konvy 스크래퍼 데이터 모델 — 모든 모듈이 공유하는 단일 진실 소스."""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class KonvyReview:
    review_id: str
    rating: float            # 1~5 별점
    body: str
    author: str = ""
    timestamp: str = ""      # 원문 표기 그대로(파싱은 집계기에서)
    helpful_count: int = 0


@dataclass
class Product:
    product_id: str          # Konvy 제품 식별자 (URL slug 또는 내부 id)
    url: str
    name: str
    brand: str = ""
    price_thb: float = 0.0           # 현재 판매가 (ld+json offers.price)
    list_price_thb: float = 0.0      # 정가/할인 전 (line-through). 없으면 0
    discount_pct: int = 0            # 할인율 % (예: 25). 없으면 0
    volume: str = ""                 # "30ml", "50g" 등 (이름에서 파싱)
    image_url: str = ""
    images: list[str] = field(default_factory=list)  # 추가 갤러리 이미지
    sku: str = ""                    # Konvy SKU
    gtin8: str = ""                  # 바코드(들) — 추후 Watsons/Boots 교차매칭용
    description: str = ""            # ld+json 설명(태국어 마케팅/효능/성분 언급) — AEO 핵심
    ingredients_raw: str = ""        # INCI 원문 문자열 (파싱 전)
    ingredients: list[str] = field(default_factory=list)  # 분해된 INCI 리스트
    ingredient_count: int = 0        # 성분 개수 (편의)
    concern_seeds: list[str] = field(default_factory=list)  # 어떤 고민 시드에서 발견됐나
    konvy_rating: float = 0.0        # 제품 평균 별점
    konvy_rating_best: float = 5.0   # 별점 척도 상한 (보통 5)
    konvy_review_count: int = 0      # 총 리뷰 수 (aggregateRating)
    sold_count: int = 0              # 누적 주문 수 ("สั่งแล้ว") — 인기 신호
    reviews_scraped: int = 0         # 실제로 수집·저장한 개별 리뷰 개수
    fetched_at: str = ""
