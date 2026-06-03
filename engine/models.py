from __future__ import annotations

from dataclasses import dataclass, field, asdict


@dataclass
class Review:
    author: str
    rating: float
    text: str
    source: str           # "google" | "pantip" | "reddit" | "naver" | "youtube"
    lang: str = "en"
    spent_amount: str = ""  # raw price signal from the review row, e.g. "฿30,000"


@dataclass
class Clinic:
    place_id: str
    name: str
    city: str
    lat: float
    lng: float
    address: str = ""
    phone: str = ""
    website: str = ""
    rating: float = 0.0
    total_reviews: int = 0
    primary_type: str = ""
    procedures: list[str] = field(default_factory=list)
    reviews: list[Review] = field(default_factory=list)
    sources: list[str] = field(default_factory=lambda: ["google"])

    def to_dict(self) -> dict:
        return asdict(self)
