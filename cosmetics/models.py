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
    price_thb: float = 0.0
    volume: str = ""         # "30ml", "50g" 등 원문 표기
    image_url: str = ""
    ingredients_raw: str = ""        # INCI 원문 문자열 (파싱 전)
    ingredients: list[str] = field(default_factory=list)  # 분해된 INCI 리스트
    concern_seeds: list[str] = field(default_factory=list)  # 어떤 고민 시드에서 발견됐나
    konvy_rating: float = 0.0        # 제품 평균 별점
    konvy_review_count: int = 0
    fetched_at: str = ""
