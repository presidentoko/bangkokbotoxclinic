"""HDmall cache HTML 파싱 → master_db 미매칭 brands 추출.

출력: outreach_hdmall_unmatched.csv (brand_name, hdmall_html, hdmall_slug, packages_count, sample_district)

다음 단계 (별도 스크립트): Google Maps 검색 → place_id 확보 → master_db에 import.
"""
from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "hdmall_clinics" / "cache"
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
PRICING_DIR = ROOT / "web" / "data" / "pricing"
OUT_CSV = ROOT / "outreach_hdmall_unmatched.csv"

# Extract brand name from dataLayer JSON
RE_BRAND = re.compile(r'"brand"\s*:\s*"([^"]+)"')
# Extract district from page (best-effort)
RE_DISTRICT = re.compile(r'(?:district|address)[^"]*"\s*:\s*"([^"]+(?:bangkok|gokok|กรุงเทพ)[^"]*)"', re.I)
RE_HDMALL_URL = re.compile(r'href="(https?://hdmall\.co\.th/[^"]+)"')


def normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\([^)]+\)", " ", s)  # remove parenthesized
    s = re.sub(r"\[[^\]]+\]", " ", s)
    s = re.sub(r"สาขา\s*\S+", " ", s)
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


_STOPWORDS = {
    "clinic", "center", "centre", "medical", "health", "dental", "hospital",
    "wellness", "care", "beauty", "aesthetic", "aesthetics", "surgery", "skin",
    "laser", "and", "the", "at", "of",
    "คลินิก", "เวชกรรม", "ทันตกรรม", "ศูนย์", "ความงาม", "สุขภาพ", "คลีนิค", "สาขา",
}


def content_tokens(s: str) -> set[str]:
    toks = set(normalize(s).split())
    toks -= _STOPWORDS
    return {t for t in toks if len(t) > 1}


def jaccard(a: str, b: str) -> float:
    ta = content_tokens(a)
    tb = content_tokens(b)
    if not ta or not tb:
        return 0.0
    inter = len(ta & tb)
    if inter == 0:
        return 0.0
    return inter / len(ta | tb)


def main() -> int:
    if not CACHE.exists():
        print(f"CACHE NOT FOUND: {CACHE}", file=sys.stderr)
        return 1

    # Master_db brand names
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    db_names = [c.get("name", "") for c in db["clinics"] if c.get("name")]
    matched_pids = {f.stem for f in PRICING_DIR.glob("*.json")}  # 이미 매칭된 cid set

    # Parse HDmall HTML cache
    brands: dict[str, dict] = {}  # name → first occurrence info
    for h in sorted(CACHE.glob("clinic_*.html")):
        try:
            text = h.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        m = RE_BRAND.search(text)
        if not m:
            continue
        name = m.group(1).strip()
        if not name:
            continue
        if name in brands:
            continue
        # Slug from HDmall URL on the page
        url_match = re.search(r"https?://hdmall\.co\.th/[a-z\-]+/([a-z0-9\-]+)", text)
        slug = url_match.group(1) if url_match else ""
        brands[name] = {
            "hdmall_html": h.name,
            "hdmall_slug": slug,
        }

    print(f"HDmall HTMLs scanned: {sum(1 for _ in CACHE.glob('clinic_*.html'))}")
    print(f"Unique brands extracted: {len(brands)}")

    # Find matches via fuzzy
    unmatched = []
    THRESHOLD = 0.5
    for brand_name, info in brands.items():
        # Score against all master_db names
        best_score = 0.0
        for db_name in db_names:
            s = jaccard(brand_name, db_name)
            if s > best_score:
                best_score = s
                if best_score >= 0.85:
                    break
        if best_score < THRESHOLD:
            unmatched.append({
                "brand_name": brand_name,
                "best_score": round(best_score, 2),
                **info,
            })

    print(f"Unmatched (jaccard < {THRESHOLD}): {len(unmatched)}")

    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["brand_name", "best_score", "hdmall_html", "hdmall_slug"])
        w.writeheader()
        for u in sorted(unmatched, key=lambda x: -len(x["brand_name"])):
            w.writerow(u)
    print(f"Saved: {OUT_CSV}")
    print(f"Top 15 unmatched:")
    for u in unmatched[:15]:
        print(f"  ({u['best_score']:.2f}) {u['brand_name'][:60]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
