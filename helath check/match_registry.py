#!/usr/bin/env python3
"""Link our scraped hospital pages to the official register.

Writes web/data/hospital_profiles.json — a sidecar keyed by slug, never a
rewrite of checkup_db.json. The canonical pipeline is MariaDB -> export_to_json
-> checkup_db.json, so anything written into that file is erased by the next
export. Everything derived (registry match, nearby hospitals) lives here and is
merged at read time in web/lib/db.ts.

Matching is deliberately conservative. A wrong accreditation badge is worse
than no badge, so a match must agree on province and on a distinctive name
token; ambiguous cases are written to the report and left unmatched.
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
OUT = HERE / "web" / "data" / "hospital_profiles.json"
REPORT = HERE / "registry" / "match_report.json"

# Thai <-> English for the hospital brands that actually appear in both files.
# The register is Thai-only; our rows are English-only. Without this table the
# overlap is close to zero, and with a loose transliteration it is full of
# false positives — so the pairs are enumerated.
BRANDS: list[tuple[str, str]] = [
    ("bumrungrad", "บำรุงราษฎร์"), ("samitivej", "สมิติเวช"), ("bangkok", "กรุงเทพ"),
    ("vejthani", "เวชธานี"), ("phyathai", "พญาไท"), ("paolo", "เปาโล"),
    ("kasemrad", "เกษมราษฎร์"), ("vibhavadi", "วิภาวดี"), ("praram", "พระรามเก้า"),
    ("bnh", "บีเอ็นเอช"), ("medpark", "เมดพาร์ค"), ("siriraj", "ศิริราช"),
    ("chulalongkorn", "จุฬาลงกรณ์"), ("ramathibodi", "รามาธิบดี"), ("rajavithi", "ราชวิถี"),
    ("thonburi", "ธนบุรี"), ("sikarin", "ศิครินทร์"), ("synphaet", "สินแพทย์"),
    ("nakornthon", "นครธน"), ("yanhee", "ยันฮี"), ("bangpakok", "บางปะกอก"),
    ("piyavate", "ปิยะเวท"), ("saint louis", "เซนต์หลุยส์"), ("mission", "มิชชั่น"),
    ("chularat", "จุฬารัตน์"), ("ramkhamhaeng", "รามคำแหง"), ("ladprao", "ลาดพร้าว"),
    ("navamin", "นวมินทร์"), ("bangna", "บางนา"), ("petcharavej", "เพชรเวช"),
    ("kluaynamthai", "กล้วยน้ำไท"), ("camillian", "คามิลเลียน"), ("theptarin", "เทพธารินทร์"),
    ("vichaiyut", "วิชัยยุทธ"), ("bangmod", "บางมด"), ("mongkutwattana", "มงกุฎวัฒนะ"),
    ("lasalle", "ลาซาล"), ("sukumvit", "สุขุมวิท"), ("intrarat", "อินทรารัตน์"),
    ("sirindhorn", "สิรินธร"), ("lerdsin", "เลิดสิน"), ("police", "ตำรวจ"),
    ("pramongkutklao", "พระมงกุฎเกล้า"), ("vajira", "วชิรพยาบาล"), ("bhumibol", "ภูมิพล"),
    ("nopparat", "นพรัตน"), ("charoenkrung", "เจริญกรุง"), ("taksin", "ตากสิน"),
    ("chaophya", "เจ้าพระยา"), ("phyathai sriracha", "พญาไทศรีราชา"),
    ("chiangmai ram", "เชียงใหม่ราม"), ("lanna", "ลานนา"), ("mccormick", "แมคคอร์มิค"),
    ("maharaj", "มหาราช"), ("sriphat", "ศรีพัฒน์"), ("rajavej", "ราชเวช"),
    ("vachira", "วชิระ"), ("siriroj", "สิริโรจน์"), ("aikchol", "เอกชล"),
    ("queen sirikit", "สมเด็จพระนางเจ้าสิริกิติ์"), ("san paulo", "ซานเปาโล"),
    ("nakharin", "นครินทร์"), ("bandon", "บ้านดอน"), ("songklanagarind", "สงขลานครินทร์"),
    ("srinagarind", "ศรีนครินทร์"), ("aek udon", "เอกอุดร"), ("rajthanee", "ราชธานี"),
    ("pranangklao", "พระนั่งเกล้า"), ("buddhachinaraj", "พุทธชินราช"),
    ("pitsanuvej", "พิษณุเวช"), ("wattanapat", "วัฒนแพทย์"), ("khelang", "เขลางค์"),
    ("sanamchan", "สนามจันทร์"), ("ekachai", "เอกชัย"), ("mahachai", "มหาชัย"),
    ("overbrook", "โอเวอร์บรุ๊ค"), ("thainakarin", "ไทยนครินทร์"),
    ("phyathai nawamin", "พญาไทนวมินทร์"), ("world medical", "เวิลด์เมดิคอล"),
    ("bangkok christian", "กรุงเทพคริสเตียน"), ("saint carlos", "เซนต์คาร์ลอส"),
    ("central general", "เซ็นทรัลเยนเนอรัล"), ("vibharam", "วิภาราม"),
    ("thonburi bamrungmuang", "ธนบุรีบำรุงเมือง"), ("phyathai 2", "พญาไท 2"),
    ("phyathai 3", "พญาไท 3"), ("kasemrad prachachuen", "เกษมราษฎร์ประชาชื่น"),
]

# Branch qualifiers. A chain name plus a branch word is a different hospital
# from the same chain plus a different branch word, and the brand table alone
# cannot see that — it paired "Samitivej Hospital Nawamin" with สมิติเวช ธนบุรี.
# When our name carries one of these, the register row must carry its Thai.
BRANCH_WORDS: dict[str, str] = {
    "thonburi": "ธนบุรี", "srinakarin": "ศรีนครินทร์", "nawamin": "นวมินทร์",
    "sukhumvit": "สุขุมวิท", "chaengwattana": "แจ้งวัฒนะ", "srinagarindra": "ศรีนครินทร์",
    "phuket": "ภูเก็ต", "pattaya": "พัทยา", "chiangmai": "เชียงใหม่", "chiang": "เชียง",
    "rayong": "ระยอง", "sriracha": "ศรีราชา", "hua": "หัวหิน", "udon": "อุดร",
    "khonkaen": "ขอนแก่น", "korat": "ราชสีมา", "ratchasima": "ราชสีมา",
    "ayutthaya": "อยุธยา", "samui": "สมุย", "krabi": "กระบี่", "trat": "ตราด",
    "chanthaburi": "จันทบุรี", "phitsanulok": "พิษณุโลก", "surat": "สุราษฎร์",
    "songkhla": "สงขลา", "yai": "หาดใหญ่", "nakhon": "นคร", "pathom": "ปฐม",
    "prachachuen": "ประชาชื่น", "petchaburi": "เพชรบุรี", "rangsit": "รังสิต",
    "ramintra": "รามอินทรา", "pinklao": "ปิ่นเกล้า", "silom": "สีลม",
}

PLACE_BRANDS = {"bangkok", "chiangmai ram", "lanna", "police", "mission", "maharaj"}

GENERIC_TH = ["โรงพยาบาล", "รพ.", "ศูนย์การแพทย์", "สถาบัน"]
GENERIC_EN = {
    "hospital", "hospitals", "medical", "center", "centre", "clinic", "international",
    "the", "and", "of", "co", "ltd", "public", "general", "healthcare", "health",
}


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def norm_en(s: str) -> str:
    s = strip_accents(s or "").lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def tokens_en(s: str) -> list[str]:
    return [t for t in norm_en(s).split() if t not in GENERIC_EN and len(t) > 2]


def norm_th(s: str) -> str:
    s = s or ""
    for g in GENERIC_TH:
        s = s.replace(g, "")
    return re.sub(r"\s+", "", s)


def haversine(a_lat, a_lng, b_lat, b_lng) -> float:
    # checkup_db stores coordinates as strings ("13.9752746"); the registry
    # stores floats. Coerce rather than assume either shape.
    a_lat, a_lng, b_lat, b_lng = (float(a_lat), float(a_lng), float(b_lat), float(b_lng))
    r = 6371.0
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp = math.radians(b_lat - a_lat)
    dl = math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


# Google's "city" for our rows is often the province, sometimes the city, and
# for 24 rows it is simply wrong (Bangkok on an address in Nonthaburi). The
# province is therefore taken from the address text when it names one.
def province_of(h: dict, provinces: list[dict]) -> str | None:
    hay = norm_en(f"{h.get('city','')} {h.get('area','')} {h.get('address','')}")
    best = None
    for p in provinces:
        n = norm_en(p["name_en"])
        if not n:
            continue
        if re.search(rf"\b{re.escape(n)}\b", hay):
            # Prefer the longest match: "Nakhon Si Thammarat" over "Nakhon".
            if best is None or len(n) > len(best[0]):
                best = (n, p)
    if best:
        return best[1]["slug"]
    city = norm_en(h.get("city", ""))
    for p in provinces:
        if norm_en(p["name_en"]) == city:
            return p["slug"]
    return None


NON_MEDICAL = re.compile(
    r"beauty salon|hair salon|nail salon|spa|massage|cosmetics|skin care clinic|"
    r"wellness cent|weight loss|tattoo|barber|gym|fitness",
    re.I,
)


def main() -> int:
    db = json.loads(DB.read_text(encoding="utf-8"))
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    hospitals = db["hospitals"]
    rows = reg["hospitals"]
    provinces = reg["provinces"]

    by_province: dict[str, list[dict]] = {}
    for r in rows:
        by_province.setdefault(r["province_slug"], []).append(r)

    th_to_en = {norm_th(th): en for en, th in BRANDS}

    matched: dict[str, dict] = {}
    proposals: list[tuple[int, str, dict, dict]] = []
    report = {"matched": [], "unmatched": [], "ambiguous": []}

    for h in hospitals:
        slug = h["slug"]
        prov = province_of(h, provinces)
        if not prov:
            report["unmatched"].append({"slug": slug, "why": "no province resolved", "city": h.get("city")})
            continue
        cands = by_province.get(prov, [])
        our_tokens = set(tokens_en(h["name"]))
        if not our_tokens:
            report["unmatched"].append({"slug": slug, "why": "name has no distinctive token"})
            continue

        hits: list[tuple[int, dict]] = []
        for r in cands:
            th = norm_th(r["name_th"])
            score = 0
            # Brand table: a Thai brand string maps to an English one; require
            # that English brand to appear in our name.
            for th_key, en in th_to_en.items():
                if not th_key or th_key not in th:
                    continue
                if not all(w in our_tokens for w in en.split() if len(w) > 2):
                    continue
                # Some brand words are also place names. "Bangkok" paired the
                # Bangkok Anti-Aging Center with Sikarin and the Bangkok Medical
                # Lab with a cancer hospital, purely because both names contain
                # the city. For those the English side must read as the chain,
                # not merely mention the place.
                if en in PLACE_BRANDS and not re.search(
                    rf"{re.escape(en)}\s+(hospital|international)", norm_en(h["name"])
                ):
                    continue
                # Branch check, both ways: a branch word we carry must appear
                # in the register row, and vice versa.
                mismatch = False
                for tok in our_tokens:
                    th_branch = BRANCH_WORDS.get(tok)
                    if th_branch and th_branch not in th:
                        mismatch = True
                        break
                if mismatch:
                    continue
                for tok, th_branch in BRANCH_WORDS.items():
                    if th_branch in th and tok not in our_tokens and th_branch not in norm_th(en):
                        # The register names a branch we do not.
                        mismatch = True
                        break
                if mismatch:
                    continue
                score = max(score, 3)
            # Coordinates confirm a name match; they never create one. Proximity
            # alone paired "AMC Arix Medical Center" with the Bhumirajanagarindra
            # Kidney Institute and "Avanti Wellness" with the Rutnin Eye Hospital
            # — different businesses that share a Bangkok block.
            if score and r.get("lat") and h.get("lat"):
                d = haversine(h["lat"], h["lng"], r["lat"], r["lng"])
                if d <= 0.3:
                    score += 2
                elif d <= 2.0:
                    score += 1
                elif d > 25:
                    # Same brand, different city: Bangkok Hospital Phuket is not
                    # Bangkok Hospital.
                    score = 0
            if score:
                hits.append((score, r))

        if not hits:
            report["unmatched"].append({"slug": slug, "why": "no candidate in province", "province": prov})
            continue
        hits.sort(key=lambda x: -x[0])
        top = hits[0]
        if len(hits) > 1 and hits[1][0] == top[0]:
            report["ambiguous"].append(
                {"slug": slug, "candidates": [c["name_th"] for _, c in hits[:3]], "score": top[0]}
            )
            continue
        r = top[1]
        proposals.append((top[0], slug, r, h))
        continue

    # One register row, one page. "Samitivej Hospital Nawamin" and "Samitivej
    # Thonburi Hospital" both matched the single row สมิติเวช ธนบุรี on the
    # brand alone; the branch word is what separates them, and the register
    # names only one of the two. Awarding it to the closer/stronger claim and
    # dropping the other is the honest outcome — a badge on the wrong branch is
    # exactly the error this whole file exists to avoid.
    claimed: dict[str, tuple[int, float, str]] = {}
    for score, slug, r, h in proposals:
        key = r["hcode"] or f'{r["province_slug"]}:{r["name_th"]}'
        dist = 1e9
        if r.get("lat") and h.get("lat"):
            dist = haversine(h["lat"], h["lng"], r["lat"], r["lng"])
        prev = claimed.get(key)
        if prev is None or (score, -dist) > (prev[0], -prev[1]):
            if prev is not None:
                report["ambiguous"].append({"slug": prev[2], "why": "register row claimed by a closer match", "row": r["name_th"]})
            claimed[key] = (score, dist, slug)
        else:
            report["ambiguous"].append({"slug": slug, "why": "register row already claimed", "row": r["name_th"]})

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
        report["matched"].append({"slug": slug, "name": h["name"], "name_th": r["name_th"], "score": score})

    # Nearby hospitals — no new data needed, 300 of 321 rows carry coordinates.
    # Only real medical facilities are offered as an alternative; a salon is not
    # somewhere to send a patient.
    def medical(h: dict) -> bool:
        if h.get("permanently_closed"):
            return False
        cat = h.get("category_name") or ""
        return not NON_MEDICAL.search(cat)

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

    provinces_for_slugs = {h["slug"]: province_of(h, provinces) for h in hospitals}

    payload = {
        "generated_at": reg["generated_at"],
        "registry_match": matched,
        "nearby": nearby,
        "province": {k: v for k, v in provinces_for_slugs.items() if v},
        "non_medical": sorted(h["slug"] for h in hospitals if not medical(h)),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")

    print(
        f"[match] {len(matched)}/{len(hospitals)} matched to the register · "
        f"{len(report['ambiguous'])} ambiguous · {len(nearby)} with nearby lists · "
        f"{len(payload['non_medical'])} classified non-medical"
    )
    print(f"[match] wrote {OUT.name} and registry/match_report.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
