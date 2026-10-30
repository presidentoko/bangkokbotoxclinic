"""data/pricing/*.json (HDmall 패키지 가격) 에서 치과 가격 가이드 데이터를 만든다 (2026-10-30).

검색어 "dental implants cost / teeth whitening bangkok / invisalign bangkok" 용 페이지의 원천이다.
리뷰에서 뽑은 가격(price_bands)에는 임플란트·베니어가 거의 없다(임플란트 18건, 베니어 6건) —
HDmall 에 게시된 패키지 가격이 훨씬 촘촘하다. 그래서 시술별로 "한 번에 비교 가능한" 패키지만 골라
등급·브랜드별로 묶는다:
  - implants   : 임플란트 1개. 브랜드별, 크라운 포함/미포함 구분. 엑스레이·상담은 뺀다.
  - whitening  : 클리닉 시술 단독 / 번들(스케일링·플루오라이드·홈키트 포함) / 홈키트.
  - invisalign : 등급(Express, Lite, Go, Essential, Moderate, Comprehensive, Teen). 상·하악 모두인 것만.
                 리테이너는 뺀다.
출력: data/dental_price_guide.json  — 항목마다 클리닉 id 와 HDmall 링크가 있어 근거를 바로 열 수 있다.

실행: python scripts/build_dental_price_guide.py   (web-cf/ 에서)
"""
import glob
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
DB = HERE / "data" / "master_db.json"
OUT = HERE / "data" / "dental_price_guide.json"

MIN_GROUP = 3  # 이보다 적으면 분위수 대신 최소~최대만 낸다

db = json.loads(DB.read_text(encoding="utf-8"))["clinics"]
by_pid = {c["place_id"].replace(":", "_"): c for c in db if c.get("place_id")}


def pct(sorted_vals, q):
    if not sorted_vals:
        return None
    i = (len(sorted_vals) - 1) * q
    lo, hi = int(i), min(int(i) + 1, len(sorted_vals) - 1)
    return round(sorted_vals[lo] + (sorted_vals[hi] - sorted_vals[lo]) * (i - lo))


# ---------- 분류 ----------
IMPLANT = re.compile(r"รากฟันเทียม|implant", re.I)
IMPLANT_SKIP = re.compile(r"เอกซเรย์|x-?ray|ปรึกษา|consult|ฟิล์ม|ฟันปลอมทั้งปาก|all[- ]?on", re.I)
CROWN = re.compile(r"ครอบฟัน|crown|zirconia|เซรามิก|ceramic|เซอร์โคเนีย", re.I)
BRANDS = [
    ("Straumann", r"straumann"),
    ("SIC (Swiss Invent)", r"\bSIC\b"),
    ("Neodent", r"neodent"),
    ("Osstem", r"osstem"),
    ("Dentium", r"dentium"),
    ("Neo Biotech", r"neo\s*biotech"),
]

WHITEN = re.compile(r"ฟอกสีฟัน|whiten|bleach", re.I)
HOME = re.compile(r"ที่บ้าน|take[- ]?home|home", re.I)
BUNDLE = re.compile(r"ขูดหินปูน|ขัดฟัน|ฟลูออไรด์|fluoride|air\s*flow|สปาฟัน|พร้อมชุด|\+ชุด|ชุดฟอก", re.I)
SYSTEMS = [("Zoom", r"zoom"), ("Cool Light", r"cool\s*light"), ("Laser", r"เลเซอร์|laser"), ("Crystal Smile", r"crystal\s*smile")]

INVIS = re.compile(r"invisalign|อินวิซาไลน์", re.I)
INVIS_SKIP = re.compile(r"รีเทนเนอร์|retainer|vivera", re.I)
INVIS_TIERS = [
    ("Comprehensive", r"comprehensive|full"),
    ("Moderate", r"moderate"),
    ("Essential", r"essential"),
    ("Lite", r"\blite\b"),
    ("Go", r"\bgo\b"),
    ("Express", r"express"),
    ("Teen", r"teen"),
]


def first(rules, text):
    for label, pat in rules:
        if re.search(pat, text, re.I):
            return label
    return None


def classify(name):
    """(procedure, group, subgroup) 또는 None."""
    if INVIS.search(name):
        if INVIS_SKIP.search(name):
            return None
        tier = first(INVIS_TIERS, name)
        if not tier:
            return None
        if re.search(r"บนหรือล่าง|upper or lower|single arch", name, re.I):
            return None  # 한쪽 턱 패키지는 상·하악 패키지와 가격이 섞이면 안 된다
        return ("invisalign", tier, "both arches")
    if IMPLANT.search(name):
        if IMPLANT_SKIP.search(name):
            return None
        if not re.search(r"1\s*ซี่|1\s*tooth|single", name, re.I):
            return None  # 개수가 불분명하면 비교 불가
        brand = first(BRANDS, name) or "Brand not stated"
        return ("implants", brand, "with crown" if CROWN.search(name) else "implant only")
    if WHITEN.search(name):
        if HOME.search(name):
            return ("whitening", "At-home kit", "")
        system = first(SYSTEMS, name) or "In-clinic"
        return ("whitening", system, "bundle" if BUNDLE.search(name) else "single session")
    return None


# ---------- 수집 ----------
rows = []
scraped = []
for f in glob.glob(str(HERE / "data" / "pricing" / "*.json")):
    try:
        d = json.loads(Path(f).read_text(encoding="utf-8"))
    except Exception:
        continue
    if not isinstance(d, dict):
        continue
    c = by_pid.get(d.get("place_id", "").replace(":", "_"))
    if not c or "dental" not in (c.get("categories") or []):
        continue
    if d.get("scraped_at"):
        scraped.append(d["scraped_at"][:10])
    for p in d.get("packages") or []:
        if not isinstance(p, dict) or not p.get("current_price"):
            continue
        k = classify(p.get("name") or "")
        if not k:
            continue
        proc, group, sub = k
        rows.append({
            "procedure": proc, "group": group, "sub": sub,
            "price": round(p["current_price"]),
            "listed": round(p["original_price"]) if p.get("original_price") else None,
            "clinic_id": c["id"], "clinic": c.get("display_name") or c["name"],
            "district": c.get("district") or "", "city": c.get("city_label") or "",
            "name": (p.get("name") or "").strip(),
            "url": f"https://hdmall.co.th/{p['url_slug']}" if p.get("url_slug") else d.get("hdmall_url", ""),
        })

# 같은 클리닉이 같은 이름·가격을 두 번 올린 중복(요일 한정판 등)은 한 건으로 센다.
seen, uniq = set(), []
for r in rows:
    key = (r["clinic_id"], r["procedure"], r["name"], r["price"])
    if key not in seen:
        seen.add(key)
        uniq.append(r)

out = {"generated_at": max(scraped) if scraped else "", "oldest_scrape": min(scraped) if scraped else "",
       "source": "HDmall", "procedures": {}}
for proc in ("implants", "whitening", "invisalign"):
    items = [r for r in uniq if r["procedure"] == proc and r["city"] == "Bangkok"]
    groups = {}
    for r in items:
        # 임플란트는 (브랜드, 크라운 여부) 로, 나머지는 group 하나로 묶는다.
        key = (r["group"], r["sub"]) if proc in ("implants", "whitening") else (r["group"], "")
        groups.setdefault(key, []).append(r)
    summary = []
    for (g, sub), rs in groups.items():
        prices = sorted(r["price"] for r in rs)
        n = len(prices)
        summary.append({
            "group": g, "sub": sub, "n": n, "clinics": len({r["clinic_id"] for r in rs}),
            "min": prices[0], "max": prices[-1],
            "p25": pct(prices, 0.25) if n >= MIN_GROUP else None,
            "median": pct(prices, 0.5) if n >= MIN_GROUP else None,
            "p75": pct(prices, 0.75) if n >= MIN_GROUP else None,
        })
    summary.sort(key=lambda s: (s["median"] if s["median"] is not None else s["min"]))
    out["procedures"][proc] = {
        "n_packages": len(items),
        "n_clinics": len({r["clinic_id"] for r in items}),
        "groups": summary,
        "items": sorted(items, key=lambda r: r["price"]),
    }
OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
for proc, v in out["procedures"].items():
    print(f"[price_guide] {proc}: {v['n_packages']} packages, {v['n_clinics']} clinics, {len(v['groups'])} groups")
    for g in v["groups"]:
        print("   ", g["group"], "/", g["sub"], "n=%d" % g["n"], g["min"], "-", g["max"], "median", g["median"])
sys.exit(0)
