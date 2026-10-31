"""data/pricing/*.json (HDmall 패키지 가격) 에서 보톡스·필러·HIFU 가격 가이드 데이터를 만든다 (2026-10-31).

사이트 문구의 "From ฿80/unit", "฿8,000–25,000 per syringe", "HIFU ฿8,000–80,000+" 는 출처가 없었다.
HDmall 에 방콕 클리닉이 올린 패키지 가격이 있으니, 시술별로 "한 번에 비교 가능한" 패키지만 골라
브랜드·기계별로 묶는다 (web-cf/scripts/build_dental_price_guide.py 와 같은 방식):
  - botox  : 유닛 수가 적힌 패키지 → 유닛당 가격. 브랜드별. 유닛 수 없이 부위로 파는 것은 "per area".
             필러 묶음·코스(여러 회)는 뺀다.
  - filler : 1 cc(1 syringe) 단일 패키지만. 브랜드별. 보톡스 끼워팔기·여러 cc 는 뺀다.
  - hifu   : 1회 시술만(코스 제외). 기계별. Thermage 는 RF 라 따로 묶는다.
출력: data/aesthetic_price_guide.json — 항목마다 클리닉 id 와 HDmall 링크가 있어 근거를 바로 열 수 있다.

실행: python scripts/build_aesthetic_price_guide.py   (web/ 에서)
"""
import glob
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
DB = HERE / "data" / "master_db.json"
OUT = HERE / "data" / "aesthetic_price_guide.json"

MIN_GROUP = 3  # 이보다 적으면 분위수 대신 최소~최대만 낸다

db = json.loads(DB.read_text(encoding="utf-8"))["clinics"]
by_pid = {c["place_id"].replace(":", "_"): c for c in db if c.get("place_id")}


def pct(sorted_vals, q):
    if not sorted_vals:
        return None
    i = (len(sorted_vals) - 1) * q
    lo, hi = int(i), min(int(i) + 1, len(sorted_vals) - 1)
    return round(sorted_vals[lo] + (sorted_vals[hi] - sorted_vals[lo]) * (i - lo))


def first(rules, text):
    for label, pat in rules:
        if re.search(pat, text, re.I):
            return label
    return None


COURSE = re.compile(r"คอร์ส|course|[2-9]\s*ครั้ง|[2-9]\s*sessions?", re.I)

BOTOX = re.compile(r"botox|โบท็อก|โบท๊อก|โบทอก|botulinum|dysport|xeomin|nabota|aestox|botulax|hutox|neuronox", re.I)
FILLER = re.compile(r"filler|ฟิลเลอร์", re.I)
UNITS = re.compile(r"(\d{2,3})\s*(?:ยูนิต|units?|u\b)", re.I)
BOTOX_BRANDS = [
    ("Allergan (Botox)", r"allergan|อัลเลอร์แกน|botox\s*(?:usa|อเมริกา)|อเมริกา"),
    ("Dysport", r"dysport|ดิสพอร์ต"),
    ("Xeomin", r"xeomin|ซีโอมิน|เยอรมัน"),
    ("Korean brand", r"nabota|aestox|botulax|hutox|neuronox|innotox|coretox|เกาหลี|korea"),
]

FILLER_ONE = re.compile(r"(?<!\d)1\s*(?:ซีซี|cc|ml|มล\.?)", re.I)
FILLER_BRANDS = [
    ("Juvederm", r"juvederm|จูวีเดิร์ม"),
    ("Restylane", r"restylane|เรสทิเลน"),
    ("Belotero", r"belotero|เบลโลเทโร"),
    ("Neuramis", r"neuramis|นูรามิส"),
    ("Yvoire", r"yvoire|อีวอร์"),
    ("e.p.t.q.", r"e\.?p\.?t\.?q"),
]

HIFU = re.compile(r"hifu|ไฮฟู|ulthera|ultherapy|ultraformer|thermage|เทอร์มาจ|v\s*sonic", re.I)
HIFU_MACHINES = [
    # "Soft Thermage"·"Mini-Thermage" 는 다른 RF 기계다 — 진짜 Thermage(FLX/CPT)만.
    ("Thermage FLX (RF)", r"(?<!soft )(?<!mini-)thermage\s*(?:flx|cpt)"),
    ("Ulthera", r"ulthera|ultherapy|อัลเทอร่า"),
    ("Ultraformer", r"ultraformer|ultra\s*former"),
]
SHOTS = re.compile(r"(\d{2,4})\s*(?:ช็อต|shots?)", re.I)


def classify(name):
    """(procedure, group, sub, per_unit_basis) 또는 None."""
    if COURSE.search(name):
        return None  # 여러 회 코스는 1회 가격과 섞이면 안 된다
    if "+" in name:
        return None  # 두 시술 묶음은 어느 쪽 가격인지 나눌 수 없다
    # "Ulthera ... ฟรี! 보톡스 50유닛" 처럼 덤으로 붙은 시술로 분류하면 안 된다 — 본품(ฟรี 앞)만 본다.
    name = re.split(r"ฟรี|free", name, maxsplit=1, flags=re.I)[0]
    if BOTOX.search(name) and not FILLER.search(name):
        brand = first(BOTOX_BRANDS, name) or "Brand not stated"
        m = UNITS.search(name)
        if m:
            return ("botox", brand, "per unit", int(m.group(1)))
        return ("botox", "Units set by doctor", "per area", None)
    if FILLER.search(name) and not BOTOX.search(name):
        if not FILLER_ONE.search(name):
            return None  # 여러 cc 패키지는 1 cc 가격과 비교가 안 된다
        return ("filler", first(FILLER_BRANDS, name) or "Brand not stated", "1 cc", None)
    if HIFU.search(name):
        machine = first(HIFU_MACHINES, name) or "Other HIFU machines"
        m = SHOTS.search(name)
        return ("hifu", machine, f"{m.group(1)} shots" if m else "shots set by doctor", None)
    return None


rows, scraped = [], []
for f in glob.glob(str(HERE / "data" / "pricing" / "*.json")):
    try:
        d = json.loads(Path(f).read_text(encoding="utf-8"))
    except Exception:
        continue
    if not isinstance(d, dict):
        continue
    c = by_pid.get(d.get("place_id", "").replace(":", "_"))
    if not c:
        continue
    if d.get("scraped_at"):
        scraped.append(d["scraped_at"][:10])
    for p in d.get("packages") or []:
        if not isinstance(p, dict) or not p.get("current_price") or p.get("category") != "beauty":
            continue
        name = (p.get("name") or "").strip()
        k = classify(name)
        if not k:
            continue
        proc, group, sub, units = k
        price = round(p["current_price"])
        rows.append({
            "procedure": proc, "group": group, "sub": sub,
            "price": price,
            # 보톡스 유닛 패키지는 유닛당 가격으로 비교한다 (100유닛 ฿5,819 → ฿58/unit).
            "units": units, "per_unit": round(price / units) if units else None,
            "listed": round(p["original_price"]) if p.get("original_price") else None,
            "clinic_id": c["id"], "clinic": c.get("display_name") or c["name"],
            "district": c.get("district") or "", "city": c.get("city_label") or "",
            "name": name,
            "url": f"https://hdmall.co.th/{p['url_slug']}" if p.get("url_slug") else d.get("hdmall_url", ""),
            "source": "HDmall",
        })

seen, uniq = set(), []
for r in rows:
    key = (r["clinic_id"], r["procedure"], r["name"], r["price"])
    if key not in seen:
        seen.add(key)
        uniq.append(r)

lo_d, hi_d = (min(scraped), max(scraped)) if scraped else ("", "")
out = {"generated_at": hi_d, "oldest_scrape": lo_d, "source": "HDmall", "procedures": {}}
for proc in ("botox", "filler", "hifu"):
    items = [r for r in uniq if r["procedure"] == proc and r["city"] == "Bangkok"]
    groups = {}
    for r in items:
        # HIFU 는 기계별로만 묶는다 — 샷 수는 표에서 개별 항목으로 보여준다.
        key = (r["group"], "" if proc == "hifu" else r["sub"])
        groups.setdefault(key, []).append(r)
    summary = []
    for (g, sub), rs in groups.items():
        prices = sorted((r["per_unit"] if r["per_unit"] is not None else r["price"]) for r in rs)
        n = len(prices)
        summary.append({
            "group": g, "sub": sub, "n": n, "clinics": len({r["clinic_id"] for r in rs}),
            "basis": "per unit" if sub == "per unit" else "package",
            "min": prices[0], "max": prices[-1],
            "p25": pct(prices, 0.25) if n >= MIN_GROUP else None,
            "median": pct(prices, 0.5) if n >= MIN_GROUP else None,
            "p75": pct(prices, 0.75) if n >= MIN_GROUP else None,
        })
    summary.sort(key=lambda s: (s["basis"] != "per unit", s["median"] if s["median"] is not None else s["min"]))
    out["procedures"][proc] = {
        "source": "HDmall", "captured_from": lo_d, "captured_to": hi_d,
        "n_packages": len(items),
        "n_clinics": len({r["clinic_id"] for r in items}),
        "groups": summary,
        "items": sorted(items, key=lambda r: (r["per_unit"] is None, r["per_unit"] or r["price"])),
    }
OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
for proc, v in out["procedures"].items():
    print(f"[price_guide] {proc}: {v['n_packages']} packages, {v['n_clinics']} clinics, {len(v['groups'])} groups")
    for g in v["groups"]:
        print("   ", g["group"], "/", g["sub"], "n=%d" % g["n"], g["min"], "-", g["max"], "median", g["median"])
sys.exit(0)
