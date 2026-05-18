"""thaisupplyhub_{premium,verified}_final.csv → data/master_db.json (신스키마).

기존 apify 베이스 master_db (2,919 mostly-B2C 잡식) 를 폐기하고
DBD-검증 + 사진/리뷰/공단/Halal 풍부 enrichment 된 premium 풀(3,347) 을 source-of-truth 로 사용.

verified_final(890) 의 회사는 verified=true 로 마킹.
premium_final 에만 있는 회사는 verified=false 지만 풀 데이터 보유.

산출:
    data/master_db.json
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
WEB = HERE.parent
EXPORT = WEB / "export"
OUT = WEB / "data" / "master_db.json"

VERIFIED_CSV = EXPORT / "thaisupplyhub_verified_final.csv"
PREMIUM_CSV  = EXPORT / "thaisupplyhub_premium_final.csv"

# Yellow Pages 카테고리별 파일 → 내부 카테고리 slug 매핑.
# 이 파일들은 name 만 가지고 있어서 name fuzzy match 로 master_db enrichment 만 수행.
YP_CATEGORY_FILES = {
    "yp_Automobile_Manufacturers.csv":           "auto_parts",
    "yp_Chemical_Manufacturers.csv":             "chemical",
    "yp_Electrical_and_Electronic_Products.csv": "electronics",
    "yp_Electronic_Components_Manufacturers.csv":"electronics",
    "yp_Food_and_Food_Products_Manufacturers.csv":"food_mfg",
    "yp_Freight_Forwarder.csv":                  "logistics",
    "yp_Logistic_Services.csv":                  "logistics",
    "yp_Metal_Manufacturers.csv":                "steel",
    "yp_Packing_Materials.csv":                  "packaging",
    "yp_Plastic_Products.csv":                   "plastic",
    "yp_Plastic_and_Plastic_Products_Manufacturers.csv": "plastic",
    "yp_Rubber_and_Rubber_Products.csv":         "rubber",
    "yp_Steel_and_Steel_Products.csv":           "steel",
    "yp_Warehouses.csv":                         "warehouse",
}


# Google Maps category → 내부 카테고리 slug 매핑
_CAT_MAP = [
    (r"auto.{0,5}part",           "auto_parts"),
    (r"food|beverage|bakery|dairy|brew", "food_mfg"),
    (r"electronic|semiconductor", "electronics"),
    (r"machin",                   "machining"),
    (r"chemic",                   "chemical"),
    (r"plastic|polymer|polypropylene|polyethylene|molding|injection", "plastic"),
    (r"steel|metal|iron|alumin",  "steel"),
    (r"rubber",                   "rubber"),
    (r"textile|apparel|garment|fabric", "textile"),
    (r"package|packing|carton|bottling", "packaging"),
    (r"logistic|freight|forward|courier|cargo|trucking|shipping", "logistics"),
    (r"warehouse|storage",        "warehouse"),
    (r"industrial estate|industrial park", "industrial_estate"),
    (r"equipment|tool",           "equipment"),
    (r"machinery",                "machinery"),
    (r"export",                   "exporter"),
    (r"corporate office|head office", "corporate_office"),
    (r"manufactur|factory|plant|production|industry|industrial", "manufacturer"),
]
_CAT_MAP_C = [(re.compile(p, re.I), slug) for p, slug in _CAT_MAP]


def map_categories(google_cat: str, yp_sub: str | None = None) -> list[str]:
    cats: list[str] = []
    seen: set[str] = set()
    for src in (google_cat, yp_sub):
        if not src:
            continue
        for rx, slug in _CAT_MAP_C:
            if rx.search(src) and slug not in seen:
                cats.append(slug); seen.add(slug)
    return cats


def slugify(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s


def parse_float(s: str | None) -> float | None:
    if s is None:
        return None
    t = str(s).strip().lower()
    if not t or t in ("nan", "none", "null", "n/a", "na"):
        return None
    try:
        v = float(t.replace(",", ""))
    except (TypeError, ValueError):
        return None
    if math.isnan(v) or math.isinf(v):
        return None
    return v


def parse_int(s: str | None) -> int | None:
    v = parse_float(s)
    if v is None:
        return None
    return int(v)


def parse_bool(s: str | None) -> bool:
    return str(s or "").strip().lower() in ("true", "1", "yes")


def parse_json_field(s: str | None):
    if not s:
        return None
    try:
        return json.loads(s)
    except (json.JSONDecodeError, TypeError):
        return None


def parse_reg_no(s: str | None) -> str | None:
    """13-digit reg_no — CSV 가 float 으로 파싱하면 leading-zero 손실. 13자리로 패딩."""
    if not s or str(s).lower() in ("nan", "none", ""):
        return None
    raw = str(s).split(".")[0]  # "115567021436.0" → "115567021436"
    raw = re.sub(r"\D", "", raw)
    if not raw:
        return None
    return raw.zfill(13)


def parse_external_reviews(s: str | None) -> list[dict]:
    """reviews_json 컬럼 → 표준화된 review list."""
    raw = parse_json_field(s)
    if not isinstance(raw, list):
        return []
    out: list[dict] = []
    for r in raw:
        if not isinstance(r, dict):
            continue
        text = r.get("text") or r.get("review_text") or ""
        if not text:
            continue
        out.append({
            "reviewer": r.get("reviewer") or r.get("author") or "Anonymous",
            "rating": float(r.get("rating") or 0),
            "date": r.get("date") or r.get("review_date") or "",
            "text": text,
        })
    return out


def parse_photos(s: str | None) -> list[str]:
    raw = parse_json_field(s)
    if isinstance(raw, list):
        return [u for u in raw if isinstance(u, str) and u.startswith("http")]
    return []


def yp_name_key(name: str) -> str:
    """YP name fuzzy match key — Thai/English 회사명 정규화."""
    s = (name or "").lower().strip()
    # 흔한 prefix/suffix 제거
    for prefix in ("บริษัท ", "บจก. ", "บจก.", "บมจ. ", "บมจ.", "หจก. ", "หจก."):
        if s.startswith(prefix.lower()):
            s = s[len(prefix):]
    for suf in ("co., ltd.", "co.,ltd.", "co.ltd.", "co ltd", "company limited",
                "co., ltd", "co.", "ltd.", "ltd", "pcl", "plc", "limited",
                "inc.", "inc", "corporation", "company", "จำกัด (มหาชน)", "จำกัด(มหาชน)", "จำกัด"):
        while s.endswith(suf):
            s = s[: -len(suf)].rstrip(" ,.()&")
    s = re.sub(r"[^a-zA-Z0-9ก-๙]", "", s)
    return s


# DBD purpose 텍스트 (Thai 위주) → 카테고리 매핑 키워드.
_PURPOSE_KEYWORDS: list[tuple[list[str], str]] = [
    (["ชิ้นส่วนรถยนต์", "ยานยนต์", "auto part", "automotive", "รถยนต์"], "auto_parts"),
    (["บรรจุภัณฑ์", "packaging", "กระสอบ", "ถุง", "carton", "บรรจุ"], "packaging"),
    (["พลาสติก", "plastic", "polymer", "polypropylene", "polyethylene", "โพลี"], "plastic"),
    (["เหล็ก", "steel", "iron", "โลหะ", "metal", "alumin"], "steel"),
    (["ยาง", "rubber"], "rubber"),
    (["สิ่งทอ", "เสื้อผ้า", "textile", "garment", "fabric", "apparel"], "textile"),
    (["อาหาร", "เครื่องดื่ม", "food", "beverage", "bakery", "เบเกอรี่"], "food_mfg"),
    (["เคมี", "chemical", "เคมีภัณฑ์"], "chemical"),
    (["อิเล็กทรอนิกส์", "electronic", "semiconductor", "อิเล็กโทรนิคส์"], "electronics"),
    (["เครื่องจักร", "machinery"], "machinery"),
    (["machining", "fabrication", "กลึง", "แมชชีน"], "machining"),
    (["คลังสินค้า", "warehouse", "storage", "โกดัง"], "warehouse"),
    (["โลจิสติกส์", "ขนส่ง", "logistics", "freight", "forward", "shipping", "logistic"], "logistics"),
    (["industrial estate", "นิคมอุตสาหกรรม"], "industrial_estate"),
    (["export", "ส่งออก", "exporter"], "exporter"),
]


def categories_from_purpose(purpose: str) -> list[str]:
    if not purpose:
        return []
    p = purpose.lower()
    out: list[str] = []
    for kws, slug in _PURPOSE_KEYWORDS:
        for kw in kws:
            if kw in p:
                out.append(slug); break
    return out


def load_yp_category_map(export_dir: Path) -> dict[str, list[str]]:
    """{normalized_name: [yp_category_slug...]}. 한 회사가 여러 YP 카테고리에 있을 수 있음."""
    out: dict[str, list[str]] = {}
    for fname, slug in YP_CATEGORY_FILES.items():
        path = export_dir / fname
        if not path.exists():
            continue
        with open(path, encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                k = yp_name_key(r.get("name", ""))
                if not k or len(k) < 3:
                    continue
                if k not in out:
                    out[k] = []
                if slug not in out[k]:
                    out[k].append(slug)
    return out


def derive_district(address: str, city: str) -> str:
    """address 에서 district 추측 — '..., XX District, City, ...' 패턴."""
    if not address:
        return ""
    parts = [p.strip() for p in address.split(",")]
    for p in parts:
        if "district" in p.lower() or "amphoe" in p.lower():
            return re.sub(r"\s+district\s*$", "", p, flags=re.I).strip()
    return ""


def row_to_supplier(row: dict, is_verified: bool) -> dict | None:
    place_id = row.get("place_id", "").strip()
    if not place_id:
        return None
    if parse_bool(row.get("dbd_is_dissolved")):
        return None  # 폐업 → 제외
    if parse_bool(row.get("is_consumer")):
        return None  # B2C → 제외

    name = (row.get("name") or "").strip()
    if not name:
        return None

    google_cat = (row.get("google_category") or "").strip()
    yp_sub = (row.get("yp_sub_category") or "").strip()
    categories = map_categories(google_cat, yp_sub)
    if not categories:
        categories = ["manufacturer"]  # fallback

    # CSV 의 city_field 는 실제로 district 단위 ("Si Racha District"), province_en 이 city 단위.
    province = re.sub(r"[^\w\s\-ก-๙]", "", (row.get("province_en") or "").strip()).strip()
    raw_district = re.sub(r"[^\w\s\-ก-๙]", "", (row.get("city_field") or "").strip()).strip()
    city_label = province or raw_district or ""
    city_slug = slugify(city_label) or "thailand"
    address = (row.get("address_street") or "").strip()
    # district 정리 — "Si Racha District" 같은 표기는 그대로, 그 외엔 address 에서 추측 fallback
    district = raw_district if raw_district and raw_district != city_label else derive_district(address, city_label)
    phone = (row.get("phone") or "").strip()
    website = (row.get("website") or row.get("yp_website") or "").strip()
    maps_url = (row.get("google_maps_url") or f"https://www.google.com/maps/place/?q=place_id:{place_id}").strip()

    rating = parse_float(row.get("rating")) or 0.0
    total_reviews = parse_int(row.get("review_count")) or 0
    b2b_score = parse_float(row.get("b2b_score")) or 0.0
    legacy_trust = parse_float(row.get("trust_score"))

    reviews = parse_external_reviews(row.get("reviews_json"))
    photos = parse_photos(row.get("photo_urls_json"))
    top_photo = (row.get("top_photo_url") or "").strip() or (photos[0] if photos else None)

    # DBD enrichment
    reg_no = parse_reg_no(row.get("dbd_reg_no"))
    dbd_match_score = parse_float(row.get("dbd_match_score")) or 0.0
    dbd_block = None
    if reg_no:
        dbd_block = {
            "reg_no": reg_no,
            "legal_name": (row.get("dbd_legal_name") or "").strip() or None,
            "capital_thb": parse_float(row.get("dbd_capital_thb")),
            "registered_date": (row.get("dbd_registered_date") or "").strip() or None,
            "tsic_code": (row.get("dbd_tsic_code") or "").strip() or None,
            "purpose": (row.get("dbd_purpose") or "").strip() or None,
            "address": (row.get("dbd_address") or "").strip() or None,
            "match_score": dbd_match_score,
        }

    yp_block = None
    yp_biz_id = (row.get("yp_biz_id") or "").strip()
    if yp_biz_id:
        yp_block = {
            "biz_id": yp_biz_id,
            "sub_category": yp_sub or None,
            "description": (row.get("yp_description") or "").strip() or None,
            "website": (row.get("yp_website") or "").strip() or None,
        }

    years = parse_int(row.get("years_in_business"))
    estate_name_raw = (row.get("estate_name") or "").strip()
    estate_slug_raw = (row.get("estate_slug") or "").strip()
    # "unknown_en" / "unknown" 같은 sentinel 은 estate 없는 걸로
    estate_name = estate_name_raw if estate_name_raw and not estate_name_raw.lower().startswith("unknown") else None
    estate_slug = estate_slug_raw if estate_slug_raw and not estate_slug_raw.lower().startswith("unknown") else None
    halal = parse_bool(row.get("is_halal_certified"))

    # sample_reviews_* — 언어별 분류
    sample_th, sample_en, sample_ko = [], [], []
    for r in reviews:
        text = r["text"]
        if not text: continue
        bucket = sample_en
        if any(0xAC00 <= ord(c) <= 0xD7A3 for c in text[:50]): bucket = sample_ko
        elif any(0x0E00 <= ord(c) <= 0x0E7F for c in text[:50]): bucket = sample_th
        if len(bucket) >= 5: continue
        bucket.append({"text": text, "rating": r["rating"], "author": r["reviewer"]})

    return {
        # identity
        "id": place_id,
        "place_id": place_id,
        "name": name,
        "primary_type": google_cat or "Manufacturer",

        # location
        "address": address,
        "city": city_slug,
        "city_label": city_label,
        "district": district,
        "province_en": (row.get("province_en") or "").strip(),
        "lat": parse_float(row.get("lat")),
        "lng": parse_float(row.get("lng")),

        # contact
        "phone": phone,
        "website": website,
        "menu_url": "",
        "maps_url": maps_url,

        # reviews + ratings
        "rating": rating,
        "total_reviews": total_reviews,
        "scraped_review_count": len(reviews),
        "external_reviews": reviews,
        "sample_reviews_th": sample_th,
        "sample_reviews_en": sample_en,
        "sample_reviews_ko": sample_ko,
        "language_breakdown": {"th": len(sample_th), "en": len(sample_en), "ko": len(sample_ko), "ja": 0, "other": 0},

        # categories
        "categories": categories,
        "raw_categories": [google_cat] if google_cat else [],
        "mentioned_topics": [],
        "rating_trend": {
            "recent":  {"count": 0, "avg": None},
            "midterm": {"count": 0, "avg": None},
            "old":     {"count": 0, "avg": None},
            "trend":   "insufficient_data",
        },

        # photos
        "hero_image": top_photo,
        "photos": photos,

        # enrichment
        "verified": is_verified,
        "dbd": dbd_block,
        "yp": yp_block,
        "halal_certified": halal,
        "estate_name": estate_name,
        "estate_slug": estate_slug,
        "years_in_business": years,
        "is_consumer": False,

        # scores
        "b2b_score": b2b_score,
        "trust_score": b2b_score if b2b_score > 0 else (legacy_trust or 0.0),

        # legacy fields (compat)
        "business_status": "Open",
        "price_level": "",
        "price_symbol": "",
        "local_guide_count": 0,
        "avg_author_review_count": 0,
        "cuisine_mentions": {},
    }


def main() -> None:
    if not PREMIUM_CSV.exists():
        sys.exit(f"missing: {PREMIUM_CSV}")
    if not VERIFIED_CSV.exists():
        sys.exit(f"missing: {VERIFIED_CSV}")

    # Verified IDs (890) → set
    verified_ids: set[str] = set()
    with open(VERIFIED_CSV, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            pid = r.get("place_id", "").strip()
            if pid:
                verified_ids.add(pid)
    print(f"verified ids: {len(verified_ids):,}")

    # premium 풀 (3,347) → suppliers list
    suppliers: list[dict] = []
    skipped_dissolved = skipped_consumer = skipped_empty = 0
    seen: set[str] = set()
    with open(PREMIUM_CSV, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            pid = r.get("place_id", "").strip()
            if not pid or pid in seen:
                continue
            seen.add(pid)
            if parse_bool(r.get("dbd_is_dissolved")):
                skipped_dissolved += 1; continue
            if parse_bool(r.get("is_consumer")):
                skipped_consumer += 1; continue
            sup = row_to_supplier(r, is_verified=(pid in verified_ids))
            if sup is None:
                skipped_empty += 1; continue
            suppliers.append(sup)

    # verified 에만 있는 (premium 에 없는) 행 — INTEGRATION.md 상 verified ⊆ premium 이지만 안전하게 처리
    with open(VERIFIED_CSV, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            pid = r.get("place_id", "").strip()
            if not pid or pid in seen:
                continue
            seen.add(pid)
            sup = row_to_supplier(r, is_verified=True)
            if sup is None:
                continue
            suppliers.append(sup)

    # === 카테고리 enrichment ===
    # 1) DBD purpose 텍스트 키워드 매칭 — 압도적으로 가장 강한 시그널.
    purpose_enriched = 0
    for s in suppliers:
        if any(c != "manufacturer" for c in s["categories"]):
            continue
        purpose = (s.get("dbd") or {}).get("purpose") or ""
        if not purpose:
            continue
        cats_new = categories_from_purpose(purpose)
        if cats_new:
            for c in cats_new:
                if c not in s["categories"]:
                    s["categories"].append(c)
            purpose_enriched += 1
    print(f"\nDBD-purpose enriched suppliers: {purpose_enriched:,}")

    # 2) YP 카테고리별 파일 name fuzzy match — 보조 시그널 (hit rate 낮음)
    yp_map = load_yp_category_map(EXPORT)
    yp_enriched = 0
    for s in suppliers:
        if any(c != "manufacturer" for c in s["categories"]):
            continue
        candidates = [s["name"]]
        if s.get("dbd") and s["dbd"].get("legal_name"):
            candidates.append(s["dbd"]["legal_name"])
        for cand in candidates:
            k = yp_name_key(cand)
            if not k:
                continue
            cats = yp_map.get(k)
            if cats:
                for c in cats:
                    if c not in s["categories"]:
                        s["categories"].append(c)
                yp_enriched += 1
                break
    print(f"YP-name enriched suppliers: {yp_enriched:,}")

    # === stats ===
    city_counts = Counter(s["city_label"] for s in suppliers if s["city_label"])
    cat_counts = Counter(c for s in suppliers for c in s["categories"])
    # district_counts 키는 legacy 와 호환 "{city_slug}/{district}" 형식
    district_counts = Counter(f"{s['city']}/{s['district']}" for s in suppliers if s["district"])
    primary_type_counts = Counter(s["primary_type"] for s in suppliers if s["primary_type"])

    verified_count = sum(1 for s in suppliers if s["verified"])
    with_photos    = sum(1 for s in suppliers if s["photos"])
    with_phone     = sum(1 for s in suppliers if s["phone"])
    with_website   = sum(1 for s in suppliers if s["website"])
    with_dbd       = sum(1 for s in suppliers if s["dbd"])
    with_reviews   = sum(1 for s in suppliers if s["external_reviews"])
    with_estate    = sum(1 for s in suppliers if s["estate_name"])
    halal_cnt      = sum(1 for s in suppliers if s["halal_certified"])

    db = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "schema_version": 2,
        "source": "thaisupplyhub_premium_final.csv + verified_final.csv",
        "total_suppliers": len(suppliers),
        "verified_count": verified_count,
        "with_dbd": with_dbd,
        "with_photos": with_photos,
        "with_phone": with_phone,
        "with_website": with_website,
        "with_reviews_scraped": with_reviews,
        "with_estate": with_estate,
        "halal_count": halal_cnt,
        "with_district": sum(1 for s in suppliers if s["district"]),
        "with_categories": sum(1 for s in suppliers if s["categories"]),
        "language_total": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
        "city_counts": dict(city_counts.most_common()),
        "district_counts": dict(district_counts.most_common()),
        "category_counts": dict(cat_counts.most_common()),
        "primary_type_counts": dict(primary_type_counts.most_common()),
        "suppliers": suppliers,
    }

    # Defense: deep-walk and coerce any NaN/Inf to None (some nested values may slip through).
    def clean(v):
        if isinstance(v, float):
            return None if (math.isnan(v) or math.isinf(v)) else v
        if isinstance(v, dict):
            return {k: clean(x) for k, x in v.items()}
        if isinstance(v, list):
            return [clean(x) for x in v]
        return v
    db = clean(db)

    OUT.write_text(json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False), encoding="utf-8")
    print(f"\nwrote {OUT}  ({OUT.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"  total      : {len(suppliers):,}")
    print(f"  verified   : {verified_count:,}  (DBD-confirmed)")
    print(f"  with DBD   : {with_dbd:,}")
    print(f"  with photos: {with_photos:,}")
    print(f"  with phone : {with_phone:,}")
    print(f"  with reviews: {with_reviews:,}")
    print(f"  with estate: {with_estate:,}")
    print(f"  skipped (dissolved): {skipped_dissolved}, (consumer): {skipped_consumer}, (empty): {skipped_empty}")
    print(f"  top cities : {list(city_counts.most_common(5))}")
    print(f"  top cats   : {list(cat_counts.most_common(8))}")


if __name__ == "__main__":
    main()
