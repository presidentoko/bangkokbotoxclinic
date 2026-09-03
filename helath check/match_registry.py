#!/usr/bin/env python3
"""Link our scraped hospital pages to the official register.

Writes web/data/hospital_profiles.json — a sidecar keyed by slug, never a
rewrite of checkup_db.json. The canonical pipeline is MariaDB -> export_to_json
-> checkup_db.json, so anything written into that file is erased by the next
export. Everything derived (registry match, nearby hospitals) lives here and is
merged at read time in web/lib/db.ts.

Three tiers, strongest first. A wrong accreditation badge is worse than no
badge, so every tier has to agree on the province, and anything ambiguous is
recorded in registry/match_report.json rather than guessed.

  1. Thai name. The register is Thai-only; enrich_thai_names.py lifts the Thai
     name for 59 more hospitals out of the Apify export, taking coverage from
     24 to 83. Thai-to-Thai needs no transliteration and cannot confuse two
     chains for each other.
  2. Brand table plus a place check. For the rest, a hand-written table maps an
     English chain name to its Thai spelling, and the branch qualifier is
     validated *through Thai place names*: "Bangkok Hospital Chiang Mai" has to
     land on a row containing เชียงใหม่, and "Samitivej Nawamin" must not land
     on สมิติเวช ธนบุรี. An earlier version validated branches on English
     tokens and rejected two dozen correct pairs, because "Chiang Mai" is two
     tokens and เชียงใหม่ is one word.
  3. Coordinates, as confirmation only. Proximity never creates a match — the
     Bangkok private-hospital list puts "AMC Arix Medical Center" 200 m from
     the Bhumirajanagarindra Kidney Institute.
"""
from __future__ import annotations

import json
import math
import re
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
DB = HERE / "web" / "data" / "checkup_db.json"
REGISTRY = HERE / "web" / "data" / "registry.json"
NAMES_TH = HERE / "web" / "data" / "hospital_names_th.json"
OUT = HERE / "web" / "data" / "hospital_profiles.json"
REPORT = HERE / "registry" / "match_report.json"
OVERRIDES = HERE / "registry" / "match_overrides.json"

# English chain name -> its Thai spelling on the register.
BRANDS: list[tuple[str, str]] = [
    ("bumrungrad", "บำรุงราษฎร์"), ("samitivej", "สมิติเวช"), ("bangkok", "กรุงเทพ"),
    ("vejthani", "เวชธานี"), ("phyathai", "พญาไท"), ("paolo", "เปาโล"),
    ("kasemrad", "เกษมราษฎร์"), ("vibhavadi", "วิภาวดี"), ("praram", "พระราม"),
    ("bnh", "บีเอ็นเอช"), ("medpark", "เมดพาร์ค"), ("siriraj", "ศิริราช"),
    ("chulalongkorn", "จุฬาลงกรณ์"), ("ramathibodi", "รามาธิบดี"), ("rajavithi", "ราชวิถี"),
    ("thonburi", "ธนบุรี"), ("sikarin", "ศิครินทร์"), ("synphaet", "สินแพทย์"),
    ("nakornthon", "นครธน"), ("yanhee", "ยันฮี"), ("bangpakok", "บางปะกอก"),
    ("piyavate", "ปิยะเวท"), ("louis", "เซนต์หลุยส์"), ("chularat", "จุฬารัตน์"),
    ("ramkhamhaeng", "รามคำแหง"), ("navamin", "นวมินทร์"), ("bangna", "บางนา"),
    ("petcharavej", "เพชรเวช"), ("kluaynamthai", "กล้วยน้ำไท"), ("camillian", "คามิลเลียน"),
    ("theptarin", "เทพธารินทร์"), ("vichaiyut", "วิชัยยุทธ"), ("bangmod", "บางมด"),
    ("mongkutwattana", "มงกุฎวัฒนะ"), ("lasalle", "ลาซาล"), ("intrarat", "อินทรารัตน์"),
    ("sirindhorn", "สิรินธร"), ("lerdsin", "เลิดสิน"), ("pramongkutklao", "พระมงกุฎเกล้า"),
    ("vajira", "วชิรพยาบาล"), ("bhumibol", "ภูมิพล"), ("nopparat", "นพรัตน"),
    ("charoenkrung", "เจริญกรุง"), ("taksin", "ตากสิน"), ("chaophya", "เจ้าพระยา"),
    ("lanna", "ลานนา"), ("mccormick", "แมคคอร์มิค"), ("maharaj", "มหาราช"),
    ("maharat", "มหาราช"), ("sriphat", "ศรีพัฒน์"), ("rajavej", "ราชเวช"),
    ("siriroj", "สิริโรจน์"), ("aikchol", "เอกชล"), ("paulo", "ซานเปาโล"),
    ("nakharin", "นครินทร์"), ("bandon", "บ้านดอน"), ("songklanagarind", "สงขลานครินทร์"),
    ("srinagarind", "ศรีนครินทร์"), ("rajthanee", "ราชธานี"),
    ("pranangklao", "พระนั่งเกล้า"), ("buddhachinaraj", "พุทธชินราช"),
    ("pitsanuvej", "พิษณุเวช"), ("wattanapat", "วัฒนแพทย์"), ("khelang", "เขลางค์"),
    ("sanamchan", "สนามจันทร์"), ("ekachai", "เอกชัย"), ("mahachai", "มหาชัย"),
    ("overbrook", "โอเวอร์บรุ๊ค"), ("thainakarin", "ไทยนครินทร์"),
    ("vibharam", "วิภาราม"), ("nonthavej", "นนทเวช"), ("navavej", "นวเวช"),
    ("nakornping", "นครพิงค์"), ("chalong", "ฉลอง"), ("thalang", "ถลาง"),
    ("ruamphat", "รวมแพทย์"), ("thaksin", "ทักษิณ"), ("jetanin", "เจตนิน"),
    ("vimut", "วิมุต"), ("chulabhorn", "จุฬาภรณ์"), ("mission", "มิชชั่น"),
    # Provincial hospitals are named after their province. They need the same
    # "must read as the hospital" guard as the chains below.
    ("chonburi", "ชลบุรี"), ("krabi", "กระบี่"), ("lampang", "ลำปาง"),
    ("hatyai", "หาดใหญ่"), ("trang", "ตรัง"), ("rayong", "ระยอง"),
    ("suratthani", "สุราษฎร์ธานี"), ("phuket", "ภูเก็ต"), ("nakornping", "นครพิงค์"),
]

# Chain words that are also place names. For these the English side has to read
# as the chain, not merely mention the place: "Bangkok" alone paired the Bangkok
# Anti-Aging Center with Sikarin and the Bangkok Medical Lab with a cancer
# hospital, purely because every name in the city contains the city.
PLACE_BRANDS = {"bangkok", "lanna", "mission", "maharaj", "maharat", "chonburi",
                "krabi", "lampang", "hatyai", "trang", "rayong", "suratthani", "phuket"}

# Place words, English -> Thai, used to validate a branch qualifier. Provinces
# come from the register's own table; these are the extra destination and
# district names Google uses.
EXTRA_PLACES: dict[str, str] = {
    "pattaya": "พัทยา", "huahin": "หัวหิน", "hin": "หัวหิน",
    "hatyai": "หาดใหญ่", "yai": "หาดใหญ่", "samui": "สมุย", "chang": "ช้าง",
    "sriracha": "ศรีราชา", "racha": "ศรีราชา", "rangsit": "รังสิต",
    "ramintra": "รามอินทรา", "pinklao": "ปิ่นเกล้า", "silom": "สีลม",
    "sukhumvit": "สุขุมวิท", "srinakarin": "ศรีนครินทร์", "nawamin": "นวมินทร์",
    "chaengwattana": "แจ้งวัฒนะ", "prachachuen": "ประชาชื่น", "chokchai": "โชคชัย",
    "phaholyothin": "พหลโยธิน", "kaset": "เกษตร", "ayutthaya": "อยุธยา",
    "korat": "ราชสีมา", "udon": "อุดร", "khonkaen": "ขอนแก่น", "surat": "สุราษฎร์",
    "chiangmai": "เชียงใหม่", "chiangrai": "เชียงราย", "bangkae": "บางแค",
    "ramkhamhaeng": "รามคำแหง", "ratchasima": "ราชสีมา", "pakchong": "ปากช่อง",
    "rojana": "โรจนะ", "taweewattana": "ทวีวัฒนา", "bamrungmuang": "บำรุงเมือง", "saraburi": "สระบุรี", "chaophraya": "เจ้าพระยา",
    "ratchaphruek": "ราชพฤกษ์", "srinagarindra": "ศรีนครินทร์", "bangbuathong": "บางบัวทอง",
    "petchkasem": "เพชรเกษม", "phetkasem": "เพชรเกษม", "ratchada": "รัชดา",
    "watcharaphon": "วัชรพล", "suvarnabhumi": "สุวรรณภูมิ", "salaya": "ศาลายา",
}

# District and road names that arrive as two English words but are one Thai
# word. "Kasemrad Hospital Bang Khae" tokenises to bang + khae, so the single
# token map never sees it — and the matcher happily took the Ramkhamhaeng
# branch of the same chain instead.
PLACE_PHRASES: dict[str, str] = {
    "bang khae": "บางแค", "bang na": "บางนา", "bang bua thong": "บางบัวทอง",
    "bang pakok": "บางปะกอก", "hua hin": "หัวหิน", "hat yai": "หาดใหญ่",
    "koh samui": "สมุย", "ko samui": "สมุย", "koh chang": "ช้าง",
    "chiang mai": "เชียงใหม่", "chiang rai": "เชียงราย", "khon kaen": "ขอนแก่น",
    "surat thani": "สุราษฎร์ธานี", "nakhon pathom": "นครปฐม", "udon thani": "อุดรธานี",
    "phet kasem": "เพชรเกษม", "sanam chan": "สนามจันทร์", "chokchai 4": "โชคชัย 4",
    "si racha": "ศรีราชา", "phra ram": "พระราม",
}

GENERIC_TH = ["โรงพยาบาล", "รพ.", "ศูนย์การแพทย์", "สถาบัน", "คลินิก"]
GENERIC_EN = {
    "hospital", "hospitals", "medical", "center", "centre", "clinic", "international",
    "the", "and", "of", "co", "ltd", "public", "general", "healthcare", "health",
    "memorial", "university", "faculty", "institute", "wellness",
}

# The register lists hospitals. A business Google files as a laboratory, a
# beauty clinic or a physiotherapy practice is not on it, so letting one enter
# the matcher can only produce a false positive — the Bangkok Medical Lab was
# being paired with the Bangkok cancer hospital on the shared chain word.
# Anything Google calls a hospital, a medical centre, or nothing at all stays
# eligible; everything else is skipped before scoring.
HOSPITAL_CATEGORY = re.compile(r"hospital|medical cent(er|re)|medical facility", re.I)

NON_MEDICAL = re.compile(
    r"beauty salon|hair salon|nail salon|spa|massage|cosmetics|skin care clinic|"
    r"wellness cent|weight loss|tattoo|barber|gym|fitness",
    re.I,
)


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def norm_en(s: str) -> str:
    s = strip_accents(s or "").lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def tokens_en(s: str) -> list[str]:
    return [t for t in norm_en(s).split() if t not in GENERIC_EN and len(t) > 2]


def digits(s: str) -> set[str]:
    return set(re.findall(r"\d+", s or ""))


def norm_th(s: str) -> str:
    s = s or ""
    for g in GENERIC_TH:
        s = s.replace(g, "")
    return re.sub(r"\s+", "", s)


def haversine(a_lat, a_lng, b_lat, b_lng) -> float:
    a_lat, a_lng, b_lat, b_lng = (float(a_lat), float(a_lng), float(b_lat), float(b_lng))
    p = math.pi / 180
    h = (0.5 - math.cos((b_lat - a_lat) * p) / 2
         + math.cos(a_lat * p) * math.cos(b_lat * p) * (1 - math.cos((b_lng - a_lng) * p)) / 2)
    return 12742 * math.asin(math.sqrt(h))


def main() -> int:
    db = json.loads(DB.read_text(encoding="utf-8"))
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    hospitals = db["hospitals"]
    provinces = reg["provinces"]
    rows = reg["hospitals"]

    overrides = {"pin": {}, "block": {}}
    if OVERRIDES.exists():
        overrides = {**overrides, **json.loads(OVERRIDES.read_text(encoding="utf-8"))}

    extra_names: dict[str, str] = {}
    if NAMES_TH.exists():
        extra_names = json.loads(NAMES_TH.read_text(encoding="utf-8")).get("names", {})

    places: dict[str, str] = dict(EXTRA_PLACES)
    for p in provinces:
        en = norm_en(p["name_en"])
        if not en:
            continue
        places.setdefault(en.replace(" ", ""), p["name_th"])
        places.setdefault(en.split()[-1], p["name_th"])

    # Multi-word province names have to be recognised in a name too
    # ("Bangkok Hospital Chiang Mai" -> chiang mai -> เชียงใหม่).
    phrases: list[tuple[str, str]] = [
        (norm_en(p["name_en"]), p["name_th"]) for p in provinces if " " in norm_en(p["name_en"])
    ]

    def thai_name_of(h: dict) -> str | None:
        return h.get("name_th") or extra_names.get(h["slug"])

    DESTINATIONS = (
        ("pattaya", "chon-buri"), ("hua hin", "prachuap-khiri-khan"),
        ("hat yai", "songkhla"), ("hatyai", "songkhla"),
        ("koh samui", "surat-thani"), ("ko samui", "surat-thani"),
        ("samui", "surat-thani"), ("koh chang", "trat"),
        ("korat", "nakhon-ratchasima"), ("ayutthaya", "phra-nakhon-si-ayutthaya"),
        ("chonburi", "chon-buri"),
    )

    def province_of(h: dict) -> str | None:
        hay = norm_en(f"{h.get('city','')} {h.get('area','')} {h.get('address','')}")
        best = None
        for p in provinces:
            n = norm_en(p["name_en"])
            if n and re.search(rf"\b{re.escape(n)}\b", hay) and (best is None or len(n) > len(best[0])):
                best = (n, p)
        if best:
            return best[1]["slug"]
        # Google often gives the destination rather than the province.
        for city, prov in DESTINATIONS:
            if city in hay:
                return prov
        return None

    by_province: dict[str, list[dict]] = {}
    for r in rows:
        by_province.setdefault(r["province_slug"], []).append(r)

    th_to_en: dict[str, str] = {}
    for en, th in BRANDS:
        th_to_en.setdefault(norm_th(th), en)

    def place_check(our_tokens: set[str], our_name: str, reg_th: str,
                    brand_en: str = "", brand_th: str = "",
                    province_th: str = "") -> bool:
        """Branch qualifiers must agree, both ways, compared in Thai.

        The chain word itself is removed from both sides first. Several chains
        are named after a place — "Bangkok Hospital Chanthaburi" is
        โรงพยาบาลกรุงเทพจันทบุรี, where กรุงเทพ is the brand, not the location —
        and treating it as a branch qualifier rejected every provincial branch
        of the largest chain in the country.
        """
        th = norm_th(reg_th)
        if brand_th:
            th = th.replace(norm_th(brand_th), "", 1)
        en_name = norm_en(our_name)
        if brand_en:
            en_name = re.sub(rf"{re.escape(brand_en)}", " ", en_name)
            our_tokens = {t for t in our_tokens if t != brand_en}

        ours: set[str] = set()
        for phrase, thai in list(PLACE_PHRASES.items()) + phrases:
            if re.search(rf"\b{re.escape(phrase)}\b", en_name):
                ours.add(norm_th(thai))
        for tok in our_tokens:
            if tok in places:
                ours.add(norm_th(places[tok]))

        theirs = {norm_th(v) for v in places.values() if norm_th(v) in th}
        theirs |= {norm_th(v) for _, v in phrases if norm_th(v) in th}
        theirs |= {norm_th(v) for v in PLACE_PHRASES.values() if norm_th(v) in th}

        # A place we name must appear on the register row, and a place the row
        # names must be one we name.
        if any(o not in th for o in ours):
            return False
        # The register routinely appends the province to a hospital's name
        # ("พุทธชินราช พิษณุโลก"). That is a location, not a branch, and we
        # already agreed on the province before getting here.
        prov_th = norm_th(province_th)
        if any(t not in ours and t != prov_th for t in theirs):
            return False
        # Branch numbers: "พญาไท 2" is not "Phyathai 3".
        return digits(our_name) == digits(reg_th)

    matched: dict[str, dict] = {}
    proposals: list[tuple[int, str, dict, dict]] = []
    report: dict[str, list] = {"matched": [], "unmatched": [], "ambiguous": []}

    for h in hospitals:
        slug = h["slug"]
        prov = province_of(h)
        our_name = h["name"]
        our_tokens = set(tokens_en(our_name))
        mine_th = thai_name_of(h)

        cat = h.get("category_name")
        if cat and not HOSPITAL_CATEGORY.search(cat):
            report["unmatched"].append({"slug": slug, "why": f"not a hospital on Google ({cat})"})
            continue

        prov_th_name = next((p["name_th"] for p in provinces if p["slug"] == prov), "") if prov else ""
        cands = by_province.get(prov, []) if prov else []
        if not cands:
            report["unmatched"].append({
                "slug": slug,
                "why": "no province resolved" if not prov else "province has no register rows",
                "city": h.get("city"),
            })
            continue

        pinned = overrides["pin"].get(slug)
        if pinned:
            row = next((r for r in cands if r["name_th"] == pinned), None)
            if row:
                proposals.append((9, slug, row, h))
                continue
            report["unmatched"].append({"slug": slug, "why": f"pinned row not found: {pinned}"})
            continue
        if slug in overrides["block"]:
            report["unmatched"].append({"slug": slug, "why": "blocked by match_overrides.json"})
            continue

        hits: list[tuple[int, int, dict]] = []
        for r in cands:
            reg_th = r["name_th"]
            score = 0
            # Thai characters of the register name that our name does not
            # account for. The tiebreak used to prefer whichever row was
            # closest to a guessed length, which handed "Chonburi Hospital"
            # to สมิติเวช ชลบุรี and "Lampang Hospital" to เวชชารักษ์ ลำปาง —
            # both times a private hospital in the same province rather than
            # the province's own hospital.
            leftover = len(norm_th(reg_th))

            if mine_th:
                a, b = norm_th(mine_th), norm_th(reg_th)
                # Containment alone is too loose: the register lists Bangkok
                # Hospital as the bare chain word กรุงเทพ, which sits inside
                # กรุงเทพเมดิคัลแล็บสาขาพหลโยธิน — a laboratory, not the
                # hospital. Require the shared part to carry the name, either
                # as most of it or as a phrase long enough to be one.
                if a and b:
                    short, long = (a, b) if len(a) <= len(b) else (b, a)
                    contained = short in long and (len(short) >= 12 or len(short) / len(long) >= 0.6)
                    if (a == b or contained) and digits(mine_th) == digits(reg_th):
                        score = 6
                        leftover = abs(len(a) - len(b))

            # The register lists hospitals. If our own listing is not even
            # called one, a shared chain word is not evidence: "Bangkok
            # Medical Laboratory" was landing on the Navy hospital and
            # "Bangkok Sexual Health Center" on a district hospital, purely
            # because every Bangkok name contains กรุงเทพ.
            if not score and our_tokens and re.search(r"\bhospital\b", norm_en(our_name)):
                for th_key, en in th_to_en.items():
                    if not th_key or th_key not in norm_th(reg_th):
                        continue
                    if not all(w in our_tokens for w in en.split() if len(w) > 2):
                        continue
                    if en in PLACE_BRANDS and not re.search(
                        rf"\b{re.escape(en)}\s+(hospital|international|medical)", norm_en(our_name)
                    ):
                        continue
                    if not place_check(our_tokens, our_name, reg_th, en, th_key, prov_th_name):
                        continue
                    score = 3
                    explained = len(th_key) + sum(
                        len(norm_th(v)) for v in list(places.values()) + list(PLACE_PHRASES.values())
                        if norm_th(v) and norm_th(v) in norm_th(reg_th)
                    )
                    leftover = max(0, len(norm_th(reg_th)) - explained)
                    break

            if score and r.get("lat") and h.get("lat"):
                d = haversine(h["lat"], h["lng"], r["lat"], r["lng"])
                if d <= 0.3:
                    score += 2
                elif d <= 2.0:
                    score += 1
                elif d > 25:
                    score = 0
            if score:
                hits.append((score, leftover, r))

        if not hits:
            report["unmatched"].append({"slug": slug, "why": "no candidate in province", "province": prov})
            continue
        # Break a tie on how much of the register name our name explains.
        # "Rajthanee Hospital" and "Rajthanee Rojana Hospital" score the same
        # against ราชธานี and ราชธานี โรจนะ; the plain name leaves nothing
        # unexplained on the plain row, and Rojana leaves nothing on the Rojana
        # row. A tie that survives this is genuinely ambiguous.
        hits.sort(key=lambda x: (-x[0], x[1]))
        top = hits[0]
        if len(hits) > 1 and hits[1][0] == top[0] and hits[1][1] == top[1]:
            report["ambiguous"].append(
                {"slug": slug, "candidates": [c["name_th"] for _, _, c in hits[:3]], "score": top[0]}
            )
            continue
        proposals.append((top[0], slug, top[2], h))

    # One register row, one page. Both "Samitivej Nawamin" and "Samitivej
    # Thonburi" once claimed the single row สมิติเวช ธนบุรี; the stronger and
    # closer claim wins and the other is recorded rather than badged wrongly.
    claimed: dict[str, tuple[int, float, str]] = {}
    for score, slug, r, h in proposals:
        key = r["hcode"] or f'{r["province_slug"]}:{r["name_th"]}'
        dist = 1e9
        if r.get("lat") and h.get("lat"):
            dist = haversine(h["lat"], h["lng"], r["lat"], r["lng"])
        prev = claimed.get(key)
        if prev is None or (score, -dist) > (prev[0], -prev[1]):
            if prev is not None:
                report["ambiguous"].append(
                    {"slug": prev[2], "why": "register row claimed by a stronger match", "row": r["name_th"]}
                )
            claimed[key] = (score, dist, slug)
        else:
            report["ambiguous"].append(
                {"slug": slug, "why": "register row already claimed", "row": r["name_th"]}
            )

    winners = {slug for _, _, slug in claimed.values()}
    for score, slug, r, h in proposals:
        if slug not in winners:
            continue
        matched[slug] = {
            "hcode": r["hcode"],
            "name_th": r["name_th"],
            "province_slug": r["province_slug"],
            "province_en": r["province_en"],
            "sector": r["sector"],
            "type_en": r["type_en"],
            "type_th": r["type_th"],
            "ha_level": r["ha_level"],
            "ha_level_en": r["ha_level_en"],
            "ha_accredited_on": r["ha_accredited_on"],
            "ha_expires_on": r["ha_expires_on"],
            "ha_current": r["ha_current"],
            "beds": r["beds"],
            "match_score": score,
        }
        report["matched"].append({
            "slug": slug, "name": h["name"], "name_th": r["name_th"], "score": score,
            "via": "thai name" if score >= 6 else "brand + place",
        })

    # Nearby hospitals, from coordinates already on file. Salons and spas are
    # excluded — a salon is not somewhere to send a patient.
    def medical(h: dict) -> bool:
        if h.get("permanently_closed"):
            return False
        return not NON_MEDICAL.search(h.get("category_name") or "")

    geo = [h for h in hospitals if h.get("lat") and h.get("lng") and medical(h)]
    nearby: dict[str, list[dict]] = {}
    for h in geo:
        ds = []
        for o in geo:
            if o["slug"] == h["slug"]:
                continue
            d = haversine(h["lat"], h["lng"], o["lat"], o["lng"])
            if d <= 15:
                ds.append((d, o))
        ds.sort(key=lambda x: x[0])
        if ds:
            nearby[h["slug"]] = [
                {"slug": o["slug"], "name": o["name"], "km": round(d, 1),
                 "rating": o.get("rating"), "city": o.get("city")}
                for d, o in ds[:5]
            ]

    names_th = {h["slug"]: n for h in hospitals if (n := thai_name_of(h))}
    payload = {
        "generated_at": reg["generated_at"],
        "registry_match": matched,
        "names_th": names_th,
        "nearby": nearby,
        "province": {h["slug"]: p for h in hospitals if (p := province_of(h))},
        "non_medical": sorted(h["slug"] for h in hospitals if not medical(h)),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")

    via_th = sum(1 for m in report["matched"] if m["via"] == "thai name")
    print(
        f"[match] {len(matched)}/{len(hospitals)} matched "
        f"({via_th} by Thai name, {len(matched) - via_th} by brand + place) · "
        f"{len(report['ambiguous'])} ambiguous · {len(names_th)} Thai names · "
        f"{len(nearby)} nearby lists · {len(payload['non_medical'])} non-medical"
    )
    print(f"[match] wrote {OUT.name} and registry/match_report.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
