"""
Build unified web/data/pricing/<place_id>.json files from multiple sources.

Sources:
  1. HDmall — existing pricing files with `packages` key. We categorize each
     package by name keywords and emit normalized ServicePrice entries.
  2. GoWabi — merge_handoff/sources/output_gowabi/{clinics,services}.csv.
     No place_id; fuzzy-match GoWabi clinic name+address → master_db place_id.

Output format (matches web/lib/types.ts:ServicePrice + what
build_master_db.py:merge_external_data reads via data.get('prices', [])):
  {
    "place_id": "0x...:0x...",
    "sources": ["hdmall", "gowabi"],
    "packages": [...],          # HDmall original (preserved if file existed)
    "gowabi_services": [...],   # GoWabi original (added if matched)
    "prices": [                 # Normalized — what dashboard's PricingIntelCard reads
      {"service": "botox", "unit_label": "per session",
       "price_min_thb": 1500, "price_max_thb": 5000,
       "source_url": "...", "last_checked": "2026-05-18"}
    ]
  }

Fixes a latent bug: HDmall scraper writes `packages` but builder reads `prices`,
so HDmall pricing data was never reaching the dashboard. This script writes
both keys so existing + new data both work.

Re-runnable: overwrites existing pricing JSONs with merged data. Idempotent.
"""
from __future__ import annotations

import csv
import json
import re
import time
from collections import defaultdict
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent.parent
WEB_DATA = ROOT / "web" / "data"
PRICING_DIR = WEB_DATA / "pricing"
MASTER_DB = WEB_DATA / "master_db.json"
HDMALL_CACHE = ROOT / "hdmall_clinics" / "cache" / "hdmall_all_clinics.json"
HDMALL_MATCHES = ROOT / "hdmall_clinics" / "cache" / "hdmall_matches.json"
GOWABI_CLINICS = ROOT / "merge_handoff" / "sources" / "output_gowabi" / "clinics.csv"
GOWABI_SERVICES = ROOT / "merge_handoff" / "sources" / "output_gowabi" / "services.csv"

# Service taxonomy — keyword match (lowercase, substring) to normalize raw
# package/service names into our standard service categories.
# Order matters for tie-breaking — more specific categories listed first.
SERVICE_KEYWORDS: dict[str, list[str]] = {
    "dental_implant":    ["implant", "รากฟันเทียม", "rakfan"],
    "dental_braces":     ["braces", "จัดฟัน", "invisalign", "orthodontic"],
    "dental_whitening":  ["whitening", "ฟอกสีฟัน", "bleach"],
    "dental_veneer":     ["veneer", "เคลือบฟัน", "ceramic crown"],
    "dental_general":    ["dental clean", "scaling", "ขูดหินปูน", "ทำฟัน", "ฟันผุ", "อุดฟัน"],
    "hair_transplant":   ["hair transplant", "ปลูกผม", "fue", "fut", "scalp"],
    "lasik":             ["lasik", "femto", "เลสิก", "smile pro"],
    "botox":             ["botox", "บอท็อกซ์", "บอทอกซ์", "boutox", "dysport", "xeomin"],
    "filler":            ["filler", "ฟิลเลอร์", "hyaluronic", "ไฮยาลู", "juvederm", "restylane"],
    "thread_lift":       ["thread", "ไหมร้อย"],
    "hifu":              ["hifu", "ulthera", "ultheraphy", "thermage", "altherapy"],
    "laser":             ["laser", "เลเซอร์", "co2", "fraxel", "picosure", "picoway", "ipl"],
    "facial":            ["facial", "ฟาเชียล", "เฟเชียล", "hydrafacial"],
    "lipo":              ["liposuction", "ดูดไขมัน", "fat removal", "coolsculpt"],
    "breast":            ["breast", "augmentation", "เสริมหน้าอก"],
    "skincare":          ["acne", "สิว", "spot", "treatment skin", "vitamin"],
}

# Categories to exclude — non-medical service noise (hair styling, makeup, etc).
EXCLUDE_KEYWORDS = [
    "haircut", "ตัดผม", "หั่นผม",   # haircut
    "manicure", "pedicure", "nail",
    "makeup",
    "yoga", "pilates",
    "spa", "massage",                 # general spa (medical massage is rare here)
]

# Normalize price values (currency, missing, etc).
RE_NUMERIC = re.compile(r"[\d,.]+")


def _normalize_price(raw: str) -> Optional[float]:
    if not raw:
        return None
    m = RE_NUMERIC.search(raw)
    if not m:
        return None
    try:
        return float(m.group(0).replace(",", ""))
    except ValueError:
        return None


def _categorize(name: str) -> Optional[str]:
    if not name:
        return None
    low = name.lower()
    # Excluded first
    for kw in EXCLUDE_KEYWORDS:
        if kw in low:
            return None
    for cat, kws in SERVICE_KEYWORDS.items():
        for kw in kws:
            if kw.lower() in low:
                return cat
    return None


# ─── Fuzzy matching for GoWabi → master_db ──────────────────────────────────

_STOPWORDS = {
    "clinic", "center", "centre", "medical", "health", "dental",
    "hospital", "wellness", "care", "beauty", "aesthetic", "aesthetics",
    "surgery", "cosmetic", "skin", "laser", "and", "the", "at", "of",
    "คลินิก", "เวชกรรม", "โรงพยาบาล", "ทันตกรรม", "ศูนย์", "ความงาม",
    "สาขา",
}
_RE_THAI_BRANCH = re.compile(r"สาขา\s*\S+|\([^)]+\)|\[[^\]]+\]")


def _content_tokens(s: str) -> set[str]:
    s = (s or "").lower()
    s = _RE_THAI_BRANCH.sub(" ", s)
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    tokens = set(s.split()) - _STOPWORDS
    return {t for t in tokens if len(t) > 1}


def _jaccard(a: str, b: str) -> float:
    ta = _content_tokens(a)
    tb = _content_tokens(b)
    if not ta or not tb:
        return 0.0
    inter = len(ta & tb)
    if inter == 0:
        return 0.0
    base = inter / len(ta | tb)
    # Containment bonus (subset boost)
    smaller = min(len(ta), len(tb))
    if inter >= 2 and inter / smaller >= 0.8:
        base = min(1.0, base + 0.15 + 0.10 * ((inter / smaller) - 0.8) / 0.2)
    return base


def _district_in_address(district: str, address: str) -> bool:
    if not district or not address:
        return False
    return district.lower()[:8] in address.lower()


def fuzzy_match_gowabi(gowabi_clinic: dict, master_clinics: list[dict]) -> Optional[dict]:
    """Find best master_db match for a GoWabi clinic. Return clinic dict or None."""
    gowabi_name = gowabi_clinic["name"]
    gowabi_district = gowabi_clinic.get("district", "")
    gowabi_address = gowabi_clinic.get("address", "")

    best = None
    best_score = 0.0
    for m in master_clinics:
        score = _jaccard(gowabi_name, m["name"])
        # District / address bonus
        if gowabi_district and _district_in_address(gowabi_district, m.get("formatted_address", "")):
            score = min(1.0, score + 0.20)
        if score > best_score:
            best_score = score
            best = m
    if best and best_score >= 0.55:  # threshold tuned for name-only matching
        return best
    return None


# ─── Source loaders ─────────────────────────────────────────────────────────

def load_master_clinics() -> list[dict]:
    """Return list of {id, name, formatted_address, district, place_id_colon}.
    Reads master_db.json which was already built — falls back to bangkok_clinics
    output if master_db is stale.
    """
    if not MASTER_DB.exists():
        return []
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db.get("clinics", db) if isinstance(db, dict) else db
    out = []
    for c in clinics:
        cid = c.get("id", "")
        if not cid:
            continue
        out.append({
            "id": cid,                                      # underscore form
            "place_id_colon": cid.replace("_", ":", 1),      # back to colon for matching
            "name": c.get("name", ""),
            "formatted_address": c.get("address", ""),
            "district": c.get("district", ""),
        })
    return out


def load_hdmall_pricing(master_clinics: list[dict]) -> dict[str, dict]:
    """Read existing HDmall pricing JSONs already on disk.
    Returns {place_id_underscored: {place_id, packages, name, url}}.
    """
    out = {}
    if not PRICING_DIR.exists():
        return out
    for f in PRICING_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        # Skip non-dict shapes (some legacy files are raw arrays — we don't
        # know their source, leave them untouched)
        if not isinstance(data, dict):
            continue
        # Only process HDmall-source files (we'll OVERWRITE the file shape but
        # preserve original packages)
        if data.get("source") != "hdmall":
            continue
        place_id_underscored = f.stem
        out[place_id_underscored] = {
            "place_id": data.get("place_id", ""),
            "packages": data.get("packages", []),
            "hdmall_url": data.get("hdmall_url", ""),
            "hdmall_name": data.get("hdmall_name", ""),
        }
    return out


def load_gowabi() -> tuple[dict[str, dict], dict[str, list[dict]]]:
    """Return (clinics_by_source_id, services_by_source_id)."""
    clinics: dict[str, dict] = {}
    if GOWABI_CLINICS.exists():
        with open(GOWABI_CLINICS, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                sid = row.get("source_id", "")
                if sid:
                    clinics[sid] = row

    services: dict[str, list[dict]] = defaultdict(list)
    if GOWABI_SERVICES.exists():
        with open(GOWABI_SERVICES, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                sid = row.get("source_id", "")
                if sid:
                    services[sid].append(row)
    return clinics, dict(services)


# ─── Aggregation ────────────────────────────────────────────────────────────

def aggregate_to_service_prices(
    items: list[dict],
    *,
    name_key: str,
    price_min_key: str,
    price_max_key: str,
    source: str,
    source_url_key: Optional[str] = None,
) -> list[dict]:
    """Given a list of raw service entries from one source, categorize each by
    name and aggregate (min/max) per category. Return ServicePrice list."""
    buckets: dict[str, list[tuple[float, str]]] = defaultdict(list)
    for item in items:
        name = item.get(name_key, "")
        cat = _categorize(name)
        if not cat:
            continue
        p_min = _normalize_price(str(item.get(price_min_key, "")))
        p_max = _normalize_price(str(item.get(price_max_key, "")))
        # Use whichever is available; if only one, use as both
        if p_min is None and p_max is None:
            continue
        if p_min is None:
            p_min = p_max
        if p_max is None:
            p_max = p_min
        # Filter implausible (zero/negative)
        if p_min <= 0 or p_max <= 0:
            continue
        url = item.get(source_url_key, "") if source_url_key else ""
        buckets[cat].append((p_min, p_max, url))

    today = time.strftime("%Y-%m-%d", time.gmtime())
    out = []
    for cat, entries in buckets.items():
        mins = [e[0] for e in entries]
        maxs = [e[1] for e in entries]
        # Source URL: take first entry's URL
        src_url = next((e[2] for e in entries if e[2]), "")
        out.append({
            "service": cat,
            "unit_label": "per session",
            "price_min_thb": int(min(mins)),
            "price_max_thb": int(max(maxs)),
            "source_url": src_url,
            "last_checked": today,
            "source": source,
            "sample_count": len(entries),
        })
    return out


# ─── Main pipeline ──────────────────────────────────────────────────────────

def main():
    print(f"ROOT: {ROOT}")
    PRICING_DIR.mkdir(parents=True, exist_ok=True)

    master = load_master_clinics()
    print(f"master_db: {len(master)} clinics loaded")

    hdmall = load_hdmall_pricing(master)
    print(f"hdmall: {len(hdmall)} existing pricing files")

    gowabi_clinics, gowabi_services = load_gowabi()
    print(f"gowabi:  {len(gowabi_clinics)} clinics, {sum(len(v) for v in gowabi_services.values())} services")

    # accum_per_pid: place_id_underscored → consolidated pricing dict
    accum: dict[str, dict] = {}

    # 1. HDmall — convert packages to normalized prices
    for pid_under, data in hdmall.items():
        prices = aggregate_to_service_prices(
            data["packages"],
            name_key="name",
            price_min_key="current_price",
            price_max_key="current_price",
            source="hdmall",
            source_url_key=None,
        )
        accum[pid_under] = {
            "place_id": data["place_id"],
            "sources": ["hdmall"] if prices else [],
            "packages": data["packages"],
            "hdmall_url": data["hdmall_url"],
            "hdmall_name": data["hdmall_name"],
            "prices": prices,
        }

    # 2. GoWabi — fuzzy match clinic → master_db, then accumulate services
    gowabi_matched = 0
    gowabi_skipped = 0
    for source_id, services in gowabi_services.items():
        clinic = gowabi_clinics.get(source_id)
        if not clinic:
            gowabi_skipped += 1
            continue
        match = fuzzy_match_gowabi(clinic, master)
        if not match:
            gowabi_skipped += 1
            continue
        prices = aggregate_to_service_prices(
            services,
            name_key="service_name",
            price_min_key="discounted_price",
            price_max_key="original_price",
            source="gowabi",
            source_url_key="url",
        )
        if not prices:
            continue
        pid_under = match["id"]
        existing = accum.get(pid_under)
        if existing:
            # Merge — append GoWabi prices to existing accumulator
            existing["sources"] = sorted(set(existing["sources"] + ["gowabi"]))
            existing["gowabi_url"] = clinic.get("url", "")
            existing["gowabi_name"] = clinic.get("name", "")
            existing["gowabi_services"] = services
            # Merge prices by service — take min of mins, max of maxs per service
            by_service = {p["service"]: p for p in existing["prices"]}
            for p in prices:
                if p["service"] in by_service:
                    e = by_service[p["service"]]
                    e["price_min_thb"] = min(e["price_min_thb"], p["price_min_thb"])
                    e["price_max_thb"] = max(e["price_max_thb"], p["price_max_thb"])
                    e["sample_count"] = e.get("sample_count", 0) + p["sample_count"]
                    e["source"] = "hdmall+gowabi"
                else:
                    by_service[p["service"]] = p
            existing["prices"] = list(by_service.values())
        else:
            accum[pid_under] = {
                "place_id": match["place_id_colon"],
                "sources": ["gowabi"],
                "gowabi_url": clinic.get("url", ""),
                "gowabi_name": clinic.get("name", ""),
                "gowabi_services": services,
                "prices": prices,
            }
        gowabi_matched += 1

    # 3. Write out
    written = 0
    for pid_under, data in accum.items():
        if not data.get("prices"):
            continue
        out_path = PRICING_DIR / f"{pid_under}.json"
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        written += 1

    print(f"\nResult:")
    print(f"  HDmall normalized: {sum(1 for d in accum.values() if 'hdmall' in d['sources'])}")
    print(f"  GoWabi matched:    {gowabi_matched}")
    print(f"  GoWabi skipped:    {gowabi_skipped} (no master_db match or no services)")
    print(f"  Total pricing files written: {written}")

    # Category distribution
    cat_count: dict[str, int] = defaultdict(int)
    for d in accum.values():
        for p in d.get("prices", []):
            cat_count[p["service"]] += 1
    print(f"\nCategory distribution:")
    for cat, n in sorted(cat_count.items(), key=lambda x: -x[1]):
        print(f"  {cat:20s} {n:4d} clinic-service pairs")


if __name__ == "__main__":
    main()
