from __future__ import annotations

from engine.models import Clinic


def _merge_into(base: Clinic, other: Clinic) -> None:
    """Fold `other` into `base` (same place_id)."""
    # Prefer the record with more total_reviews as the canonical name/identity.
    if other.total_reviews > base.total_reviews:
        base.name = other.name
        base.total_reviews = other.total_reviews
        base.rating = other.rating
        base.address = other.address or base.address
        base.phone = other.phone or base.phone
        base.website = other.website or base.website
    base.reviews.extend(other.reviews)
    for s in other.sources:
        if s not in base.sources:
            base.sources.append(s)


def dedupe_clinics(clinics: list[Clinic]) -> list[Clinic]:
    """Collapse clinics sharing a place_id into one record, unioning reviews/sources."""
    by_id: dict[str, Clinic] = {}
    for c in clinics:
        existing = by_id.get(c.place_id)
        if existing is None:
            by_id[c.place_id] = c
        else:
            _merge_into(existing, c)
    return list(by_id.values())
