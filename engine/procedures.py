from __future__ import annotations

from engine.models import Clinic

# Order matters only for deterministic output; a clinic may match several.
PROCEDURE_KEYWORDS: dict[str, list[str]] = {
    "dental": [
        "dental", "dentist", "teeth", "tooth", "implant", "orthodont",
        "braces", "veneer", "whitening", "root canal",
        "ทันตกรรม", "ฟัน", "รากฟันเทียม", "จัดฟัน",
    ],
    "botox": [
        "botox", "filler", "aesthetic", "skin booster", "ulthera",
        "dermatolog", "injectable", "mesotherapy",
        "โบท็อก", "ฟิลเลอร์", "ผิว",
    ],
    "hair": [
        "hair transplant", "fue", "dhi", "fut", "hairline", "scalp",
        "ปลูกผม",
    ],
}


def tag_procedures(clinic: Clinic) -> list[str]:
    """Return the procedure niches this clinic matches, in PROCEDURE_KEYWORDS order."""
    haystack = " ".join(
        [clinic.name, clinic.primary_type] + [r.text for r in clinic.reviews]
    ).lower()
    tags: list[str] = []
    for niche, keywords in PROCEDURE_KEYWORDS.items():
        if any(kw in haystack for kw in keywords):
            tags.append(niche)
    return tags
