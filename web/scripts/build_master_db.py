"""Master DB builder — enriched.

Reads bangkok_clinics scraper output and produces web/data/master_db.json
with full review analysis: language breakdown (TH/EN), mentioned phrases,
service mentions, rating trend. Re-runnable while scraper is live.
"""
from __future__ import annotations

import csv
import json
import math
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web" / "data"

# 멀티시티 클리닉 데이터 소스. 도시 추가 시 여기 한 줄.
# 외국인 인기 순서. Pattaya 클리닉 scraper 가동 후 자동으로 합쳐짐.
SOURCES: list[dict] = [
    {
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "bangkok_clinics" / "output" / "clinics.csv",
        "reviews_dir": ROOT / "bangkok_clinics" / "output" / "reviews",
    },
    {
        # Bangkok dental-targeted scrape (dental_grid_runner + dental_review_bangkok).
        # Same city as above — net new clinics dedupe by place_id; overlapping clinics
        # merge fields (review data is identical from GMaps anyway).
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "dental_output" / "bangkok" / "clinics.csv",
        "reviews_dir": ROOT / "dental_output" / "bangkok" / "reviews",
    },
    {
        # merge_handoff dental — pre-scraped GMaps dental clinics (1,484 + 1,392 reviews).
        # Converted from merge_handoff/sources/output_dental via scripts/ingest_merge_handoff.py.
        # place_id collisions with the live dental_output above dedupe at the master_db_builder
        # level — net new clinics flow through.
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "merge_handoff" / "_export" / "dental" / "clinics.csv",
        "reviews_dir": ROOT / "merge_handoff" / "_export" / "dental" / "reviews",
    },
    {
        # merge_handoff hair transplant clinics (75 + 2,429 reviews).
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "merge_handoff" / "_export" / "hair" / "clinics.csv",
        "reviews_dir": ROOT / "merge_handoff" / "_export" / "hair" / "reviews",
    },
    {
        "city_label": "Pattaya",
        "city_slug": "pattaya",
        "clinics_csv": ROOT / "pattaya" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "pattaya" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Phuket",
        "city_slug": "phuket",
        "clinics_csv": ROOT / "phuket" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "phuket" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Chiang Mai",
        "city_slug": "chiang-mai",
        "clinics_csv": ROOT / "chiang_mai" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "chiang_mai" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Koh Samui",
        "city_slug": "koh-samui",
        "clinics_csv": ROOT / "koh_samui" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "koh_samui" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Krabi",
        "city_slug": "krabi",
        "clinics_csv": ROOT / "krabi" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "krabi" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Hua Hin",
        "city_slug": "hua-hin",
        "clinics_csv": ROOT / "hua_hin" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "hua_hin" / "clinics_output" / "reviews",
    },
]

# hair_v2 — from hair-project (thaihairguide_master.csv) → merge_handoff/_export/hair_v2_<city>.
# 569 Google-place_id hair-related clinics across 15 cities (FUE/DHI/SMP/Bookimed enriched).
# Ingested via scripts/convert_hair_project_to_handoff.py + scripts/ingest_hair_v2.py.
# place_id collisions with existing SOURCES dedupe at master_db level → enriches existing rows.
_HAIR_V2_CITIES: list[tuple[str, str, str]] = [
    # (city_label, city_slug, source_slug)
    ("Bangkok", "bangkok", "bangkok"),
    ("Pattaya", "pattaya", "pattaya"),
    ("Phuket", "phuket", "phuket"),
    ("Chiang Mai", "chiang-mai", "chiang_mai"),
    ("Chiang Rai", "chiang-rai", "chiang_rai"),
    ("Koh Samui", "koh-samui", "koh_samui"),
    ("Krabi", "krabi", "krabi"),
    ("Hua Hin", "hua-hin", "hua_hin"),
    ("Khon Kaen", "khon-kaen", "khon_kaen"),
    ("Korat", "korat", "korat"),
    ("Hat Yai", "hat-yai", "hat_yai"),
    ("Udon Thani", "udon-thani", "udon_thani"),
    ("Nakhon Si Thammarat", "nakhon-si-thammarat", "nakhon_si_thammarat"),
    ("Surat Thani", "surat-thani", "surat_thani"),
    ("Rayong", "rayong", "rayong"),
]
for _label, _slug, _src in _HAIR_V2_CITIES:
    SOURCES.append({
        "city_label": _label,
        "city_slug": _slug,
        "clinics_csv": ROOT / "merge_handoff" / "_export" / f"hair_v2_{_src}" / "clinics.csv",
        "reviews_dir": ROOT / "merge_handoff" / "_export" / f"hair_v2_{_src}" / "reviews",
    })

csv.field_size_limit(min(2**31 - 1, sys.maxsize))


# ── District 추출 ─────────────────────────────────────────────
_DISTRICT_KEYS: list[tuple[str, list[str]]] = [
    # 2026-08-20: 태국어 표기 주소용 별칭(เขต… = 방콕 구)을 기존 항목에 얹었다.
    # 새 district 이름을 만들지 않고 별칭만 늘리는 방식이라 /d/ 페이지가 쪼개지지
    # 않는다. 실제 데이터에 나타난 토큰만 넣었고, 관측된 오타 표기
    # (วัตนา←วัฒนา, หนองเเขม←หนองแขม)도 그대로 포함한다.
    ("Pathum Wan", ["pathum wan", "pathumwan", "siam", "ปทุมวัน"]),
    ("Watthana", ["watthana", "wattana", "วัฒนา", "วัตนา", "thong lor", "thonglor", "ekkamai",
                  "asok", "asoke", "phrom phong", "promphong", "nana"]),
    ("Khlong Toei", ["khlong toei", "klongtoey", "klong toey"]),
    ("Bang Rak", ["bang rak", "bangrak", "silom", "sala daeng"]),
    ("Sathon", ["sathon", "sathorn"]),
    ("Phaya Thai", ["phaya thai", "phayathai", "ari", "saphan khwai", "พญาไท"]),
    ("Ratchathewi", ["ratchathewi", "victory monument", "ราชเทวี"]),
    ("Huai Khwang", ["huai khwang", "huaykhwang", "ratchada", "ห้วยขวาง"]),
    ("Din Daeng", ["din daeng", "din deang", "ดินแดง"]),   # din deang: 실데이터 오타 표기
    ("Chatuchak", ["chatuchak", "lat yao", "phahonyothin"]),
    ("Bang Kapi", ["bang kapi"]),
    ("Lat Phrao", ["lat phrao", "latphrao"]),
    ("Wang Thonglang", ["wang thonglang"]),
    ("Phra Khanong", ["phra khanong", "prakhanong", "on nut", "onnut", "พระโขนง"]),
    ("Bang Na", ["bang na", "bangna"]),
    ("Suan Luang", ["suan luang"]),
    ("Yan Nawa", ["yan nawa", "yannawa", "ยานนาวา"]),
    ("Bang Kho Laem", ["bang kho laem"]),
    ("Khlong San", ["khlong san"]),
    ("Thon Buri", ["thon buri", "thonburi"]),
    ("Bang Phlat", ["bang phlat", "บางพลัด"]),
    ("Phasi Charoen", ["phasi charoen"]),
    ("Bangkok Noi", ["bangkok noi", "bangkoknoi", "บางกอกน้อย"]),
    ("Bangkok Yai", ["bangkok yai"]),
    ("Don Mueang", ["don mueang", "donmueang", "ดอนเมือง"]),
    ("Lak Si", ["lak si", "หลักสี่"]),
    ("Bang Sue", ["bang sue"]),
    ("Dusit", ["dusit", "ดุสิต"]),
    ("Pom Prap Sattru Phai", ["pom prap"]),
    ("Samphanthawong", ["samphanthawong", "yaowarat", "chinatown"]),
    ("Phra Nakhon", ["phra nakhon", "rattanakosin"]),
    ("Min Buri", ["min buri", "minburi"]),
    ("Nong Chok", ["nong chok", "หนองจอก"]),
    ("Khan Na Yao", ["khan na yao"]),
    ("Saphan Sung", ["saphan sung"]),
    ("Bueng Kum", ["bueng kum"]),
    ("Lat Krabang", ["lat krabang", "latkrabang"]),
    ("Prawet", ["prawet"]),
    ("Bang Bon", ["bang bon"]),
    ("Nong Khaem", ["nong khaem", "หนองแขม", "หนองเเขม"]),
    ("Bang Khae", ["bang khae"]),
    ("Taling Chan", ["taling chan"]),
    ("Thawi Watthana", ["thawi watthana"]),
    ("Khlong Sam Wa", ["khlong sam wa"]),
    ("Sai Mai", ["sai mai"]),
    ("Bang Khen", ["bang khen"]),
    # 2026-08-20: 방콕 50개 khet 중 누락돼 있던 4개.
    ("Bang Khun Thian", ["bang khun thian"]),
    ("Rat Burana", ["rat burana"]),
    ("Chom Thong", ["chom thong"]),
    ("Thung Khru", ["thung khru"]),
]

# 다른 도시의 district / 관광지 키워드. 외국인 인기 도시 위주.
_PATTAYA_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Naklua", ["naklua", "wong amat"]),
    ("Central Pattaya", ["central pattaya", "pattaya central", "soi buakhao"]),
    ("South Pattaya", ["south pattaya", "walking street"]),
    ("Pratamnak", ["pratamnak", "pratumnak"]),
    ("Jomtien", ["jomtien", "jomthien", "dongtan"]),
    ("Bang Lamung", ["bang lamung", "banglamung"]),
    ("Nong Prue", ["nong prue"]),
    ("Huai Yai", ["huai yai", "huay yai"]),
]

_PHUKET_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Patong", ["patong"]),
    ("Karon", ["karon"]),
    ("Kata", ["kata noi", "kata yai", " kata "]),
    ("Kamala", ["kamala"]),
    ("Surin", ["surin beach", "bang tao"]),
    ("Cherng Talay", ["cherng talay", "cherngtalay", "laguna phuket"]),
    ("Rawai", ["rawai", "naiharn", "nai harn"]),
    ("Chalong", ["chalong"]),
    ("Phuket Town", ["phuket town", "muang phuket", "old town phuket"]),
    ("Kathu", ["kathu"]),
    ("Mai Khao", ["mai khao", "nai yang"]),
]

_CHIANG_MAI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Old City", ["old city chiang mai", "tha phae", "ratchadamnoen"]),
    ("Nimman", ["nimman", "nimmanhaemin", "nimmanahaeminda", "nimmana haeminda", "santitham"]),
    ("Chang Khlan", ["chang khlan", "night bazaar"]),
    ("Hang Dong", ["hang dong"]),
    ("Mae Rim", ["mae rim"]),
    ("San Sai", ["san sai", "sansai"]),
    ("Saraphi", ["saraphi"]),
    ("Mueang Chiang Mai", ["mueang chiang mai"]),
]

_KOH_SAMUI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Chaweng", ["chaweng"]),
    ("Lamai", ["lamai"]),
    ("Bophut", ["bophut", "fisherman's village"]),
    ("Maenam", ["maenam", "mae nam"]),
    ("Choeng Mon", ["choeng mon"]),
    ("Nathon", ["nathon", "na thon"]),
    ("Lipa Noi", ["lipa noi"]),
]

_KRABI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Ao Nang", ["ao nang", "aonang"]),
    ("Krabi Town", ["krabi town", "muang krabi"]),
    ("Klong Muang", ["klong muang", "khlong muang"]),
    ("Tubkaek", ["tubkaek", "tub kaek"]),
    ("Railay", ["railay", "rai leh"]),
]

_HUA_HIN_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Hua Hin Town", ["hua hin town", "muang hua hin"]),
    ("Khao Tao", ["khao tao"]),
    ("Cha-am", ["cha-am", "cha am", "chaam"]),
    ("Pranburi", ["pranburi", "pran buri"]),
]

# city_label → districts dict. extract_district 가 사용.
_DISTRICTS_BY_CITY: dict[str, list[tuple[str, list[str]]]] = {
    "Bangkok": _DISTRICT_KEYS,
    "Pattaya": _PATTAYA_DISTRICTS,
    "Phuket": _PHUKET_DISTRICTS,
    "Chiang Mai": _CHIANG_MAI_DISTRICTS,
    "Koh Samui": _KOH_SAMUI_DISTRICTS,
    "Krabi": _KRABI_DISTRICTS,
    "Hua Hin": _HUA_HIN_DISTRICTS,
}


# 2026-09-02: 구 이름이 아니라 "도로·동네·랜드마크" 별칭. 위 표에서 이것들만 골라낸
# 집합이다. 이걸 구분해야 하는 이유(실측 173건 오배정):
#   "157 Ratchadaphisek Rd, Din Daeng, Bangkok" → 'ratchada' 가 먼저 걸려 Huai Khwang.
#   실제 구는 주소에 Din Daeng 이라고 쓰여 있는데도 도로명이 이겼다. 방콕의 간선도로
#   (Ratchadaphisek·Phahonyothin·On Nut)는 여러 구를 관통하므로 도로명은 구를 특정하지
#   못한다. 주소가 구 이름을 명시하면 그게 언제나 정답이고, 도로명은 구 이름이 아예
#   없을 때만 쓰는 추정치다.
_LANDMARK_ALIASES: set[str] = {
    "siam",                                                  # Pathum Wan
    "thong lor", "thonglor", "ekkamai", "asok", "asoke",
    "phrom phong", "promphong", "nana",                      # Watthana
    "silom", "sala daeng",                                   # Bang Rak
    "ari", "saphan khwai",                                   # Phaya Thai
    "victory monument",                                      # Ratchathewi
    "ratchada",                                              # Huai Khwang
    "lat yao", "phahonyothin",                               # Chatuchak
    "on nut", "onnut",                                       # Phra Khanong
    "yaowarat", "chinatown",                                 # Samphanthawong
    "rattanakosin",                                          # Phra Nakhon
    "wong amat",                                             # Naklua (Pattaya)
}

# 라틴 별칭은 단어 경계로 맞춘다. 'ari'(Phaya Thai) 가 "Arun Amarin"·"Charin" 안에서
# 걸려 46건을 엉뚱한 구로 보냈다. 태국어는 단어 경계 개념이 없으므로 그대로 부분매칭.
_ALIAS_RE_CACHE: dict[str, "re.Pattern[str]"] = {}


def _alias_hit(alias: str, addr_lower: str) -> bool:
    if not alias.isascii():
        return alias in addr_lower
    rx = _ALIAS_RE_CACHE.get(alias)
    if rx is None:
        rx = re.compile(r"(?<![a-z])" + re.escape(alias) + r"(?![a-z])")
        _ALIAS_RE_CACHE[alias] = rx
    return bool(rx.search(addr_lower))


_DISTRICT_SUFFIX_RE = re.compile(r"([A-Za-z][A-Za-z\-' ]{2,30}?)\s+[Dd]istrict\b")

# 2026-08-20: 태국어 주소의 "เมือง(=อำเภอเมือง, 도청 소재 군)" 처리용.
# 남은 미할당 182건 중 95건이 "…เมือง Chiang Mai 50200" / "…อำเภอเมือง, Samut
# Sakhon 74000" 형태였다. 이건 이미 존재하는 "Mueang {도}" 와 같은 대상이므로,
# 새 이름을 만들지 않고 그 표기로 정규화해야 /d/ 페이지가 쪼개지지 않는다
# (실측: 93건이 전부 기존 district 로 흡수됨).
# 도 이름은 보통 우편번호 5자리 바로 앞의 라틴 토큰이다.
_TH_PROVINCE_BEFORE_ZIP_RE = re.compile(r"([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\s+\d{5}\b")
# 순수 태국어 주소용 최소 매핑(관측된 것만).
_TH_PROVINCE_NAMES = {
    "เชียงใหม่": "Chiang Mai", "นนทบุรี": "Nonthaburi", "สมุทรปราการ": "Samut Prakan",
    "สมุทรสาคร": "Samut Sakhon", "ปทุมธานี": "Pathum Thani", "ภูเก็ต": "Phuket",
    "กระบี่": "Krabi", "ชลบุรี": "Chon Buri", "นครปฐม": "Nakhon Pathom",
}


def _mueang_district(address: str) -> str:
    """"เมือง" 가 있으면 "Mueang {도}" 로 정규화. 못 찾으면 빈 문자열."""
    if "เมือง" not in address:
        return ""
    m = _TH_PROVINCE_BEFORE_ZIP_RE.search(address)
    prov = m.group(1).strip() if m else ""
    # "จังหวัด"(=Province) 가 라틴으로 섞여 들어오면 이름이 아니라 라벨이다.
    for label in ("Chang Wat ", "Changwat ", "Province "):
        if prov.startswith(label):
            prov = prov[len(label):].strip()
    if not prov:
        for th, en in _TH_PROVINCE_NAMES.items():
            if th in address:
                prov = en
                break
    return f"Mueang {prov}" if prov else ""


def _district_by_structure(
    address: str, city_label: str, keys: list[tuple[str, list[str]]]
) -> str:
    """도시 토큰 앞 세그먼트에서 구 이름을 찾는다. 못 찾으면 빈 문자열."""
    parts = [p.strip() for p in address.split(",")]
    city_tokens = [city_label.lower()]
    if city_label == "Bangkok":
        city_tokens.append("กรุงเทพ")
    city_idx = -1
    for i, p in enumerate(parts):
        pl = p.lower()
        if any(pl.startswith(t) for t in city_tokens):
            city_idx = i
            break
    if city_idx <= 0:
        return ""
    for j in range(city_idx - 1, -1, -1):
        seg = parts[j].lower()
        for canonical, aliases in keys:
            for alias in aliases:
                if alias in _LANDMARK_ALIASES:
                    continue          # 도로·랜드마크는 구 세그먼트의 근거가 못 된다
                if _alias_hit(alias, seg):
                    return canonical
    return ""


def extract_district(address: str, city_label: str = "Bangkok") -> str:
    """주소에서 도시별 district 추출. 도시 매핑 없으면 빈 문자열.

    2026-08-20 감사: dental 클리닉 742곳(34%)이 district 미할당 → /d/[district]
    페이지에 실릴 수 없어 내부링크가 하나도 없는 고아가 됐다(filterByDistrict 는
    c.district 정확매칭). 원인 두 가지:
      (1) 방콕 50개 khet 중 4개가 위 목록에서 빠져 있었다.
      (2) 방콕 그리드 검색이 인접 도(Nonthaburi/Samut Sakhon/Pathum Thani/
          Samut Prakan)나 타 도시(Phuket/Krabi)로 새서, city_label 매핑에 없는
          "<이름> District" 형식 주소가 대량으로 들어왔다.
    알려진 키워드에서 못 찾으면 이 접미사 패턴으로 한 번 더 시도한다 —
    "Thalang District" 같은 걸 일일이 열거하지 않고 일반적으로 복구한다.
    실측 복구율 75%(742 → 181).
    """
    if not address:
        return ""
    a = address.lower()
    keys = _DISTRICTS_BY_CITY.get(city_label, _DISTRICT_KEYS)
    # 0차: 주소 구조. 태국 주소는 "…, <동/แขวง>, <구/เขต>, <도시> <우편번호>" 순이라
    # 도시 토큰 바로 앞 세그먼트가 구다. 이게 가장 강한 신호다 — 단순 부분매칭은
    # 같은 이름이 동·도로명으로 앞쪽에 나오면 그걸 집는다(실측):
    #   "270 Rama VI Rd, Thung Phaya Thai, Ratchathewi, Bangkok 10400"
    #     → 'phaya thai' 가 동 이름에서 걸려 Ratchathewi 를 놓쳤다. 102건.
    #   "2539 Lat Phrao Rd, Wang Thonglang, Bangkok 10310" → 도로명이 이겼다. 15건.
    # 구조 판정 정확도는 실측 2,457곳에서 100%, 단순 별칭 매칭은 88% 였다.
    hit = _district_by_structure(address, city_label, keys)
    if hit:
        return hit
    # 1차: 구 이름 별칭만. 주소가 구를 명시하면 그게 정답이다.
    for canonical, aliases in keys:
        for alias in aliases:
            if alias not in _LANDMARK_ALIASES and _alias_hit(alias, a):
                return canonical
    # 2차: 도로·랜드마크 별칭 (구 이름이 주소에 없을 때만 쓰는 추정치).
    for canonical, aliases in keys:
        for alias in aliases:
            if alias in _LANDMARK_ALIASES and _alias_hit(alias, a):
                return canonical
    m = _DISTRICT_SUFFIX_RE.search(address)
    if m:
        return m.group(1).strip()
    # 태국어 "เมือง" 폴백은 마지막이다 — 위 키워드 패스가 먼저 돌아야
    # "ดอนเมือง"(방콕 돈므앙, 이름 안에 เมือง 가 들어있다)이 "Mueang …" 로
    # 오분류되지 않는다.
    return _mueang_district(address)


# ── 언어 감지 (TH / EN / other) ───────────────────────────────
# 태국어 unicode block: U+0E00-U+0E7F (Thai script).
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")
_KOREAN_RE = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ㐀-䷿一-龯]")


# 2026-09-02: 검색결과에 내보낼 표시용 이름.
#
# 구글맵 상호를 그대로 title 에 쓰면 SERP 에서 이렇게 나간다:
#   "PLUS Dental Clinic | สาขาพระราม 2 | คลินิกทันตกรรมและจัดฟัน ขูดหินปูน …"
# 파이프 뒤는 업주가 넣은 키워드 나열이고, 잘린 꼬리는 스팸처럼 보인다.
# 실측(5,489곳): 80자 초과 236 · 파이프 96 · 괄호 짝 안맞음 5 · "..." 잘림 2.
#
# ⚠ 원본 name 은 절대 건드리지 않는다. H1 과 JSON-LD name 에 그대로 쓰여서
# "상호 전체를 복사해 붙이는" 정확 일치 검색을 받아내야 하기 때문이다.
# 이 값은 title 전용이다.
def display_name(name: str) -> str:
    if not name:
        return name
    s = name.split("|")[0]                      # 파이프 뒤 = 키워드 나열
    s = re.sub(r"\.{3,}|…", " ", s)             # 잘림 표시
    for op, cl in (("(", ")"), ("（", "）"), ("[", "]")):
        if s.count(op) < s.count(cl):
            s = s.replace(cl, "")               # 여는 괄호 없이 닫힘
        elif s.count(op) > s.count(cl):
            s = s[: s.rfind(op)]                # 열린 채 끝남
    s = re.sub(r'["""]', "", s)
    s = re.sub(r"\s{2,}", " ", s).strip(" -–—:,/")
    if len(s) > 60:                             # SERP 가 자르기 전에 우리가 자른다
        cut = s[:60]
        sp = cut.rfind(" ")
        s = (cut[:sp] if sp > 35 else cut).rstrip(" -–—:,/")
    return s or name


def detect_lang(text: str) -> str:
    """간단 분류: th / en / other.
    태국/한국/일본/영어/기타 분류."""
    if not text:
        return "other"
    total = len(text)
    if total == 0:
        return "other"
    ko = len(_KOREAN_RE.findall(text)) / total
    if ko > 0.15:
        return "ko"
    th = len(_THAI_RE.findall(text)) / total
    if th > 0.3:
        return "th"
    ja = len(_JAPANESE_RE.findall(text)) / total
    if ja > 0.2 and ko < 0.05:
        return "ja"
    lt = len(_LATIN_RE.findall(text)) / total
    if lt > 0.3 and th < 0.05 and ko < 0.05:
        return "en"
    return "other"


# ── 카테고리 키워드 (review 텍스트 매칭에도 재사용) ───────────
_CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "botox": ["botox", "botulinum", "botulax", "dysport", "xeomin",
              "บอท็อกซ์", "โบท็อกซ์", "โบ"],
    "filler": ["filler", "juvederm", "restylane", "belotero", "fillers",
               "ฟิลเลอร์", "ฟิล"],
    "hifu": ["hifu", "ulthera", "ultherapy", "thermage", "termage", "ultraformer"],
    "facial": ["facial", "skin care", "skincare", "skin treatment", "aesthetic",
               "beauty clinic", "ผิว"],
    "laser": ["laser", "ipl", "co2 laser", "fraxel", "pico", "เลเซอร์"],
    "dental": ["dental", "dentist", "tooth", "ทันตกรรม", "ฟัน"],
    "hair_transplant": ["hair transplant", "hair restoration", "scalp transplant"],
    "eye": ["lasik", "ophthalmology", "eye clinic"],
}


# GMaps primary_type 은 모호한 텍스트 매칭보다 정확. "Orthodontist" 같은 type 은
# 키워드 (dental/dentist/tooth) 에 직접 매칭 안 되지만 명백히 dental.
_PRIMARY_TYPE_TO_CATEGORY: dict[str, str] = {
    "dental clinic": "dental",
    "dentist": "dental",
    "dental school": "dental",
    "orthodontist": "dental",
    "dental implants periodontist": "dental",
    "pediatric dentist": "dental",
    "cosmetic dentist": "dental",
    "endodontist": "dental",
    "periodontist": "dental",
    "oral surgeon": "dental",
    "hair transplantation clinic": "hair_transplant",
    "hair replacement service": "hair_transplant",
    "ophthalmologist": "eye",
    "lasik surgeon": "eye",
}


def tag_categories_from_text(text: str, primary_type: str | None = None) -> set[str]:
    text_l = text.lower()
    found: set[str] = set()
    for cat, kws in _CATEGORY_KEYWORDS.items():
        if any(kw in text_l for kw in kws):
            found.add(cat)
    if primary_type:
        pt_l = primary_type.strip().lower()
        if pt_l in _PRIMARY_TYPE_TO_CATEGORY:
            found.add(_PRIMARY_TYPE_TO_CATEGORY[pt_l])
    return found


def count_service_mentions(text: str) -> dict[str, int]:
    """리뷰 전체 텍스트에서 시술명 언급 횟수."""
    text_l = text.lower()
    counts: dict[str, int] = {}
    for cat, kws in _CATEGORY_KEYWORDS.items():
        n = 0
        for kw in kws:
            n += text_l.count(kw)
        if n > 0:
            counts[cat] = n
    return counts


# ── 토픽 / 멘션 구절 추출 ─────────────────────────────────────
# 자주 언급되는 클리닉 평가 키워드 (한국 사용자가 검색할 만한 것 제외 — TH/EN 만)
_TOPIC_PATTERNS: dict[str, list[str]] = {
    "genuine_brand":      ["genuine", "authentic", "original brand", "ของแท้", "แท้"],
    "english_speaking":   ["english", "english speaking", "speaks english", "พูดภาษาอังกฤษ"],
    "clean_facility":     ["clean", "cleanliness", "hygienic", "sterile", "สะอาด"],
    "long_wait":          ["long wait", "wait time", "waited", "ต้องรอ", "รอนาน"],
    "expensive":          ["expensive", "pricey", "overpriced", "แพง"],
    "affordable":         ["affordable", "cheap", "reasonable price", "good price",
                           "ไม่แพง", "ราคาดี", "ราคาถูก"],
    "professional":       ["professional", "experienced doctor", "professional staff",
                           "หมอเก่ง", "หมอดี", "มืออาชีพ"],
    "friendly_staff":     ["friendly", "kind staff", "polite", "พนักงานดี", "เป็นกันเอง"],
    "results_satisfied":  ["satisfied", "great results", "happy with", "พอใจ", "ผลลัพธ์ดี"],
    "no_pain":            ["no pain", "painless", "doesn't hurt", "ไม่เจ็บ"],
    "recommend":          ["recommend", "recommended", "would come back",
                           "แนะนำ", "จะมาอีก"],
    "korean_doctor":      ["korean doctor", "korean trained", "หมอเกาหลี"],
    "promotion":          ["promotion", "discount", "package deal", "โปรโมชั่น", "โปร"],
    "premium":            ["premium", "luxury", "high-end", "หรู"],
}


def extract_mentioned_topics(text: str) -> list[dict]:
    """리뷰 텍스트에서 토픽 매칭. 각 토픽당 매칭 횟수 리턴."""
    text_l = text.lower()
    found: list[dict] = []
    for topic, patterns in _TOPIC_PATTERNS.items():
        n = 0
        for pat in patterns:
            n += text_l.count(pat)
        if n > 0:
            found.append({"topic": topic, "count": n})
    found.sort(key=lambda x: -x["count"])
    return found


# ── 평점 트렌드 ───────────────────────────────────────────────
# Google Maps relative_date 패턴: "a week ago", "2 months ago", "a year ago", etc.
def _bucket_relative_date(rel: str) -> str:
    """recent (<3mo) / midterm (3-12mo) / old (>1yr) / unknown."""
    if not rel:
        return "unknown"
    r = rel.lower().strip()
    # Day / week / month / year 단위 + 숫자 또는 'a'
    if "day" in r or "hour" in r:
        return "recent"
    if "week" in r:
        return "recent"
    m = re.search(r"(\d+|a)\s*month", r)
    if m:
        n = 1 if m.group(1) == "a" else int(m.group(1))
        return "recent" if n < 3 else "midterm"
    m = re.search(r"(\d+|a)\s*year", r)
    if m:
        n = 1 if m.group(1) == "a" else int(m.group(1))
        return "midterm" if n < 1 else "old"  # "a year ago" 는 midterm 경계
    if "yesterday" in r or "today" in r:
        return "recent"
    return "unknown"


def compute_rating_trend(rows: list[dict]) -> dict:
    buckets: dict[str, list[float]] = {"recent": [], "midterm": [], "old": [], "unknown": []}
    for row in rows:
        try:
            rt = float(row.get("rating") or 0)
        except ValueError:
            continue
        if rt <= 0:
            continue
        b = _bucket_relative_date(row.get("relative_date", ""))
        buckets[b].append(rt)
    out = {}
    for k in ("recent", "midterm", "old"):
        ratings = buckets[k]
        out[k] = {
            "count": len(ratings),
            "avg": round(sum(ratings) / len(ratings), 2) if ratings else None,
        }
    # trend label
    rec = out["recent"]["avg"]
    old = out["old"]["avg"] if out["old"]["avg"] is not None else out["midterm"]["avg"]
    if rec is not None and old is not None:
        if rec - old >= 0.3:
            out["trend"] = "improving"
        elif old - rec >= 0.3:
            out["trend"] = "declining"
        else:
            out["trend"] = "stable"
    else:
        out["trend"] = "insufficient_data"
    return out


# ── 신뢰도 점수 ───────────────────────────────────────────────
def trust_score(rating: float, total_reviews: int,
                local_guide_count: int, scraped_review_count: int,
                avg_author_review_count: float) -> float:
    """0-100 친화. rating/volume/local-guide 비율/리뷰어 권위 가중."""
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50  # 0-50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)  # 0-40
    lg_ratio = (local_guide_count / scraped_review_count) if scraped_review_count > 0 else 0
    lg_part = min(10, lg_ratio * 20)  # 0-10
    # 리뷰어 평균 리뷰수 100+ 면 추가 신뢰
    authority_part = min(5, math.log10(max(1, avg_author_review_count)) * 2)
    # 0-100 캡 (rating 50 + volume 40 + lg 10 + authority 5 = 최대 105 산술합)
    return round(min(100.0, rating_part + volume_part + lg_part + authority_part), 1)


# ── 좌표 fallback ─────────────────────────────────────────────
_COORDS_RE = re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)")


def coords_from_maps_url(url: str) -> tuple[float | None, float | None]:
    if not url:
        return None, None
    m = _COORDS_RE.search(url)
    if m:
        return float(m.group(1)), float(m.group(2))
    return None, None


# ── 리뷰 분석 (메인 enrichment) ───────────────────────────────
# ── Doctor mention extraction ─────────────────────────────────
# 리뷰 텍스트에서 의사 이름 추출. EN/TH/KO 패턴.
# 영어: "Dr. Sirikul" / "Doctor Park Min" / "Dr Bhumi"
# 태국어: "หมอ Sirikul" / "นพ.ภูมิ" / "พญ.สิริกุล"
# 한국어: "박 선생님" / "민준 선생님"
DR_EN_RE = re.compile(r"\b(?:Dr\.?|Doctor)\s+([A-Z][\w'\-]+(?:\s+[A-Z][\w'\-]+){0,2})\b")
DR_TH_RE = re.compile(r"(?:หมอ|นพ\.|พญ\.|แพทย์)\s*([ก-๛A-Za-z]+(?:\s+[ก-๛A-Za-z]+)?)")
DR_KO_RE = re.compile(r"([가-힣]{2,4})\s*선생(?:님)?")

# 흔한 false positive (영어 인사말/대명사/장소명)
DOCTOR_BLOCKLIST = {
    "the", "this", "that", "but", "and", "for", "with", "she", "her", "him", "his",
    "you", "they", "their", "very", "really", "so", "all", "every", "highly",
    "bangkok", "thailand", "korea", "japan", "asia", "clinic", "doctor", "medical",
    "smith", "john", "jane",  # generic placeholders sometimes appearing in templates
}


def _normalize_doctor_name(raw: str) -> str:
    """공백 정리, title case, max 3 단어, blocklist 필터."""
    s = re.sub(r"\s+", " ", raw).strip().rstrip(".,;:!?")
    if not s or len(s) > 50:
        return ""
    tokens = s.split()
    if not tokens:
        return ""
    # blocklist 첫 token 제거
    if tokens[0].lower() in DOCTOR_BLOCKLIST:
        return ""
    # English 일 때 title case
    if all(re.fullmatch(r"[A-Za-z'\-]+", t) for t in tokens):
        tokens = [t.capitalize() for t in tokens[:3]]
    else:
        tokens = tokens[:3]
    return " ".join(tokens)


def extract_doctors(text: str) -> list[str]:
    """텍스트에서 의사 이름 추출 (normalized)."""
    if not text:
        return []
    names = []
    for m in DR_EN_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    for m in DR_TH_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    for m in DR_KO_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    return names


def doctor_slug(name: str) -> str:
    """URL 슬러그 — ASCII transliteration 없이 lowercase + dash."""
    s = name.lower()
    s = re.sub(r"[^\w\s가-힣ก-๛-]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    return s[:50]


def slugify_match_ts(s: str) -> str:
    """lib/data.ts 의 slugify 와 정확히 동일하게 작동.
    TS: .toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "-").replace(/^-+|-+$/g, "")
    의사 composite_slug 만들 때 클리닉 이름 부분 — Python/TS 일관성 유지."""
    s = s.lower()
    s = re.sub(r"[^a-z0-9฀-๿]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s


def composite_doctor_slug(doc_slug: str, place_id: str) -> str:
    """`{doctor_slug}-at-{place_id 축약}` — globally unique.
    2026-07-31 이전엔 클리닉 이름을 슬러그로 썼는데, 구글맵 상호명이 바뀔
    때마다(프로모션 문구 추가, 지점명 변경 등) 그 클리닉의 의사 URL이 전부
    영구 고아가 됐음 (2,302개 중 1,505개가 사이트맵에서 이탈 — 2026-07-31
    감사). place_id는 스크래핑 대상이 바뀌지 않는 한 안정적이라 대신 사용.
    TS의 makeCompositeDoctorSlug 와 동일 로직 유지해야 함."""
    short_id = re.sub(r"[^0-9a-fA-F]", "", place_id)[-12:].lower()
    return f"{doc_slug}-at-{short_id}" if short_id else doc_slug


# ── 의사 경력 / 트레이닝 시그널 추출 ───────────────────────
# 의사 mention 된 리뷰에서 의사에게 attribute 할 수 있는 keyword phrase 추출.
EXP_PATTERNS = [
    # "15 years experience", "10+ yrs of practice"
    re.compile(r'\b\d{1,2}\+?\s*(?:years?|yrs?)\b(?:\s*(?:of\s*)?(?:experience|practice|expertise))?', re.I),
    # "Korea trained", "US board certified", "Harvard fellowship", "Japan residency"
    re.compile(r'\b(?:Korea[- ]?(?:n)?|Japan(?:ese)?|Harvard|Stanford|Yale|Mayo|Hopkins|US|American|British|UK|German|French)[- ]?(?:trained|board[- ]?certified|fellowship|residency|graduate|certified)\b', re.I),
    # generic "board certified"
    re.compile(r'\bboard[- ]?certified\b', re.I),
]


def extract_experience_signals(text: str) -> set[str]:
    """리뷰 텍스트에서 경력 시그널 phrase 추출 (대소문자 정규화, dedup)."""
    sigs: set[str] = set()
    for pattern in EXP_PATTERNS:
        for m in pattern.finditer(text):
            phrase = re.sub(r'\s+', ' ', m.group(0).strip())
            if 4 <= len(phrase) <= 60:
                # 정규화: lowercase + 첫 글자만 대문자 (display friendly)
                sigs.add(phrase.lower())
    return sigs


def analyze_reviews(reviews_dir: Path, place_id: str, clinic_name: str = "") -> dict:
    """reviews/<pid>_reviews.csv 분석.
    리턴: scraped_count, local_guide_count, avg_author_review_count,
    language_breakdown, service_mentions, mentioned_topics, rating_trend,
    sample_reviews_th, sample_reviews_en, derived_categories."""
    fn = place_id.replace(":", "_")
    p = reviews_dir / f"{fn}_reviews.csv"
    empty = {
        "scraped_count": 0,
        "local_guide_count": 0,
        "avg_author_review_count": 0.0,
        "language_breakdown": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
        "service_mentions": {},
        "mentioned_topics": [],
        "rating_trend": {"recent": {"count": 0, "avg": None},
                         "midterm": {"count": 0, "avg": None},
                         "old": {"count": 0, "avg": None},
                         "trend": "insufficient_data"},
        "sample_reviews_th": [],
        "sample_reviews_en": [],
        "sample_reviews_ko": [],
        "doctor_stats": [],
        "derived_categories": [],
    }
    if not p.exists():
        return empty

    rows: list[dict] = []
    try:
        with open(p, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                rows.append(row)
    except Exception:
        return empty

    if not rows:
        return empty

    scraped = len(rows)
    lg = sum(1 for r in rows
             if str(r.get("author_is_local_guide", "0")).strip() in ("1", "1.0"))
    arc_list: list[int] = []
    for r in rows:
        try:
            arc_list.append(int(float(r.get("author_review_count") or 0)))
        except ValueError:
            pass
    avg_arc = sum(arc_list) / len(arc_list) if arc_list else 0.0

    # 언어 분류 + 텍스트 누적 + 의사 mention 집계
    lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0}
    text_chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {
        "th": [], "en": [], "ko": [], "ja": [], "other": []
    }
    # doctor name → { ratings: [], lang_count: {}, sample: str }
    doctor_data: dict[str, dict] = {}
    for r in rows:
        text = (r.get("text") or "").strip()
        if not text:
            continue
        lang = detect_lang(text)
        lang_count[lang] += 1
        try:
            rt = int(float(r.get("rating") or 0))
        except ValueError:
            rt = 0
        text_chunks_by_lang[lang].append((text, rt, r.get("author_name", "")))

        # 의사 mention — 한 리뷰에 여러 의사 가능
        mentioned = set(extract_doctors(text))
        if mentioned:
            # 같은 리뷰의 시술 + 경력 시그널을 mentioned 의사 모두에게 attribute
            review_services = set(count_service_mentions(text).keys())
            review_exp_sigs = extract_experience_signals(text)
        else:
            review_services = set()
            review_exp_sigs = set()
        for doc in mentioned:
            d = doctor_data.setdefault(doc, {
                "ratings": [], "lang_count": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
                "samples": [], "procedures": {}, "exp_signals": {},
            })
            d["ratings"].append(rt)
            d["lang_count"][lang] += 1
            for svc in review_services:
                d["procedures"][svc] = d["procedures"].get(svc, 0) + 1
            for sig in review_exp_sigs:
                d["exp_signals"][sig] = d["exp_signals"].get(sig, 0) + 1
            # 짧고 좋은 sample 후보 (50-250자, rating ≥ 4)
            if 50 <= len(text) <= 250 and rt >= 4 and len(d["samples"]) < 2:
                d["samples"].append({"text": text, "rating": rt, "lang": lang})

    # 전체 텍스트 통합 (서비스 멘션/토픽 추출용)
    all_text = " ".join(t for chunks in text_chunks_by_lang.values()
                        for t, _, _ in chunks)

    services = count_service_mentions(all_text)
    topics = extract_mentioned_topics(all_text)
    categories = sorted(tag_categories_from_text(all_text))

    # 샘플 리뷰: 언어별 평점 4-5점 우선, 길이 80-300자.
    def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3):
        good = [c for c in chunks if 80 <= len(c[0]) <= 300 and c[1] >= 4]
        good.sort(key=lambda x: -x[1])
        return [{"text": t, "rating": r, "author": a} for t, r, a in good[:n]]

    # 부정 리뷰 샘플 — B2B dashboard 의 review-reply 초안 + competitor weakness 용.
    # 평점 1-3, 길이 60-400자. 가장 낮은 평점 우선 (최악 먼저).
    def pick_negative(chunks: list[tuple[str, int, str]], n: int = 3):
        all_lang: list[tuple[str, int, str]] = []
        for _lang, lst in text_chunks_by_lang.items():
            all_lang.extend(lst)
        bad = [c for c in all_lang if 60 <= len(c[0]) <= 400 and c[1] <= 3 and c[1] >= 1]
        bad.sort(key=lambda x: (x[1], -len(x[0])))  # rating asc, length desc
        return [{"text": t, "rating": r, "author": a} for t, r, a in bad[:n]]

    # 의사별 집계 — mention 2회 이상만 채택, top 10
    # 클리닉 이름과 겹치는 단어는 false positive (예: "Dr.Balance Clinic" → "Balance")
    clinic_words = set()
    if clinic_name:
        clinic_words = {w.lower() for w in re.findall(r"[A-Za-z]{2,}", clinic_name)}
    doctor_stats: list[dict] = []
    for doc_name, d in doctor_data.items():
        if len(d["ratings"]) < 2:
            continue  # 1회 mention 은 노이즈
        # 클리닉 이름 단어와 매칭되면 skip
        doc_tokens = {t.lower() for t in doc_name.split() if re.fullmatch(r"[A-Za-z]+", t)}
        if doc_tokens and doc_tokens.issubset(clinic_words):
            continue
        avg = sum(d["ratings"]) / len(d["ratings"])
        primary_lang = max(d["lang_count"].items(), key=lambda kv: kv[1])[0]
        ds = doctor_slug(doc_name)
        # top 시술 (review_count desc, 6개)
        procs = d.get("procedures", {})
        top_procedures = [
            {"service": s, "review_count": c}
            for s, c in sorted(procs.items(), key=lambda kv: -kv[1])[:6]
        ]
        # 경력 시그널 (review_count ≥ 2 만 — noise filter; top 5)
        exp = d.get("exp_signals", {})
        exp_signals = [
            s for s, c in sorted(exp.items(), key=lambda kv: -kv[1])
            if c >= 2
        ][:5]
        doctor_stats.append({
            "name": doc_name,
            "slug": ds,
            "composite_slug": composite_doctor_slug(ds, place_id) if place_id else ds,
            "mentions": len(d["ratings"]),
            "rating_avg": round(avg, 2),
            "language_count": d["lang_count"],
            "primary_lang": primary_lang,
            "samples": d["samples"],
            "procedures": top_procedures,
            "experience_signals": exp_signals,
        })
    doctor_stats.sort(key=lambda x: -x["mentions"])
    doctor_stats = doctor_stats[:10]

    return {
        "scraped_count": scraped,
        "local_guide_count": lg,
        "avg_author_review_count": round(avg_arc, 1),
        "language_breakdown": lang_count,
        "service_mentions": services,
        "mentioned_topics": topics,
        "rating_trend": compute_rating_trend(rows),
        "sample_reviews_th": pick_samples(text_chunks_by_lang["th"]),
        "sample_reviews_en": pick_samples(text_chunks_by_lang["en"]),
        "sample_reviews_ko": pick_samples(text_chunks_by_lang["ko"]),
        "sample_reviews_negative": pick_negative(text_chunks_by_lang, n=3),
        "doctor_stats": doctor_stats,
        "derived_categories": categories,
    }


# ── 단일 도시 처리 ────────────────────────────────────────────
def process_source(
    source: dict,
    clinics: list[dict],
    district_counter: Counter,
    category_counter: Counter,
    city_counter: Counter,
    lang_total: Counter,
    seen_place_ids: set[str],
) -> int:
    """source 한 도시의 clinics.csv 읽어 clinics 리스트에 append. 처리 건수 반환.
    csv 없으면 0 반환 (Pattaya 등 아직 scrape 안 된 도시).
    seen_place_ids: 이미 다른 도시에서 처리한 place_id 는 skip (CSV 내 또는 도시간 중복). """
    csv_path: Path = source["clinics_csv"]
    reviews_dir: Path = source["reviews_dir"]
    city_label: str = source["city_label"]
    city_slug: str = source["city_slug"]
    if not csv_path.exists():
        return 0

    n = 0
    with open(csv_path, encoding="utf-8-sig", errors="replace", newline="") as f:
        for row in csv.DictReader(f):
            place_id = (row.get("place_id") or "").strip()
            name = (row.get("name") or "").strip()
            if not place_id or not name:
                continue
            if place_id in seen_place_ids:
                continue
            seen_place_ids.add(place_id)

            try:
                rating = float(row.get("rating") or 0)
            except ValueError:
                rating = 0.0
            try:
                total_reviews = int(float(row.get("total_reviews") or 0))
            except ValueError:
                total_reviews = 0

            address = (row.get("formatted_address") or "").strip()
            district = extract_district(address, city_label)
            if district:
                district_counter[district] += 1
            city_counter[city_label] += 1

            review_sig = analyze_reviews(reviews_dir, place_id, clinic_name=name)

            base_cat_set = tag_categories_from_text(
                f"{row.get('primary_type', '')} {name}",
                primary_type=row.get('primary_type', ''),
            )
            categories = sorted(base_cat_set | set(review_sig["derived_categories"]))
            for c in categories:
                category_counter[c] += 1

            for lang, k in review_sig["language_breakdown"].items():
                lang_total[lang] += k

            ts = trust_score(
                rating, total_reviews,
                review_sig["local_guide_count"],
                review_sig["scraped_count"],
                review_sig["avg_author_review_count"],
            )

            lat, lng = None, None
            try:
                if row.get("latitude"):
                    lat = float(row["latitude"])
                if row.get("longitude"):
                    lng = float(row["longitude"])
            except ValueError:
                pass
            if lat is None:
                lat, lng = coords_from_maps_url(row.get("maps_url", ""))

            name_lang = detect_lang(name)

            clinics.append({
                "id": place_id.replace(":", "_"),
                "place_id": place_id,
                "name": name,
                "display_name": display_name(name),
                "name_lang": name_lang,
                "primary_type": row.get("primary_type", ""),
                "address": address,
                "city_label": city_label,
                "city_slug": city_slug,
                "district": district,
                "phone": row.get("phone", ""),
                "website": row.get("website", ""),
                "lat": lat,
                "lng": lng,
                "rating": rating,
                "total_reviews": total_reviews,
                "trust_score": ts,
                "categories": categories,
                "scraped_review_count": review_sig["scraped_count"],
                "local_guide_count": review_sig["local_guide_count"],
                "avg_author_review_count": review_sig["avg_author_review_count"],
                "language_breakdown": review_sig["language_breakdown"],
                "service_mentions": review_sig["service_mentions"],
                "mentioned_topics": review_sig["mentioned_topics"],
                "rating_trend": review_sig["rating_trend"],
                "sample_reviews_th": review_sig["sample_reviews_th"],
                "sample_reviews_en": review_sig["sample_reviews_en"],
                "sample_reviews_negative": review_sig.get("sample_reviews_negative", []),
                "doctor_stats": review_sig.get("doctor_stats", []),
                "business_status": row.get("business_status", ""),
                "maps_url": row.get("maps_url", ""),
            })
            n += 1
    return n


def merge_pantip_data(clinics: list[dict]) -> None:
    """pantip/output/clinics/{clinic_id}.json 의 mention 데이터를 각 clinic record 에 머지.

    추가하는 필드: `pantip` (없으면 미존재).
    Schema:
      pantip: {
        fetched_at: ISO8601,
        candidates_total: int,       # 검색에 잡힌 총 토픽 수 (mention 여부 무관)
        mention_count: int,           # 실제 클리닉명이 본문/제목에 나온 토픽 수
        branch_specific_count: int,   # 풀네임(브랜드+지점) 매칭 토픽 수 (영업 자료 신뢰도↑)
        score_distribution: {1: N, 2: N, 3: N, 4: N},
        top_mentions: [               # 최대 5개, score 내림차순
          {topic_id, url, title, score, branch_specific, op_mentioned,
           title_mentioned, comment_count_with_mention, sample_snippet}
        ],
      }

    풀 thread 본문/댓글은 pantip/output/threads/<tid>.json 에 그대로 보관됨
    (master_db.json 비대화 방지). 위키 페이지는 top_mentions[].topic_id 로 lazy-load.
    """
    pantip_dir = ROOT / "pantip" / "output" / "clinics"
    if not pantip_dir.exists():
        return
    merged_n = 0
    for c in clinics:
        cid = c["id"]
        f = pantip_dir / f"{cid}.json"
        if not f.exists():
            continue
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[merge pantip] {cid} err: {e}", file=sys.stderr)
            continue
        mentions = d.get("mentions") or []
        # score distribution
        score_dist: dict[int, int] = {}
        branch_n = 0
        for m in mentions:
            sc = m.get("relevance_score", 0)
            score_dist[sc] = score_dist.get(sc, 0) + 1
            if m.get("branch_specific"):
                branch_n += 1
        # top mentions (score 내림차순, branch_specific 가산점)
        ranked = sorted(
            mentions,
            key=lambda m: (
                m.get("relevance_score", 0),
                1 if m.get("branch_specific") else 0,
                len(m.get("matched_tokens") or []),
            ),
            reverse=True,
        )
        top: list[dict] = []
        for m in ranked[:5]:
            snippets = m.get("sample_snippets") or []
            top.append({
                "topic_id": m.get("topic_id"),
                "url": f"https://pantip.com/topic/{m.get('topic_id')}",
                "title": m.get("title", ""),
                "score": m.get("relevance_score", 0),
                "branch_specific": bool(m.get("branch_specific")),
                "op_mentioned": bool(m.get("op_mentioned")),
                "title_mentioned": bool(m.get("title_mentioned")),
                "comment_count_with_mention": int(m.get("comment_count_with_mention", 0) or 0),
                "sample_snippet": snippets[0] if snippets else "",
            })
        c["pantip"] = {
            "fetched_at": d.get("updated_at", ""),
            "candidates_total": int(d.get("candidates_total", 0) or 0),
            "mention_count": len(mentions),
            "branch_specific_count": branch_n,
            "score_distribution": score_dist,
            "top_mentions": top,
        }
        merged_n += 1
    if merged_n:
        print(f"[merge] pantip: {merged_n} clinics enriched")


def merge_external_data(clinics: list[dict]) -> None:
    """data/external_reviews/{clinic_id}.json + data/pricing/{clinic_id}.json + data/doctor_xref/{clinic_id}.json merge."""
    ext_dir = WEB_DATA / "external_reviews"
    price_dir = WEB_DATA / "pricing"
    xref_dir = WEB_DATA / "doctor_xref"
    ext_n = 0
    price_n = 0
    xref_n = 0
    for c in clinics:
        cid = c["id"]
        ext_file = ext_dir / f"{cid}.json"
        if ext_file.exists():
            try:
                c["external_reviews"] = json.loads(ext_file.read_text(encoding="utf-8"))
                ext_n += 1
            except Exception as e:
                print(f"[merge ext] {cid} err: {e}", file=sys.stderr)
        price_file = price_dir / f"{cid}.json"
        if price_file.exists():
            try:
                data = json.loads(price_file.read_text(encoding="utf-8"))
                c["pricing"] = data if isinstance(data, list) else data.get("prices", [])
                price_n += 1
            except Exception as e:
                print(f"[merge price] {cid} err: {e}", file=sys.stderr)
        xref_file = xref_dir / f"{cid}.json"
        if xref_file.exists():
            try:
                xref = json.loads(xref_file.read_text(encoding="utf-8"))
                if xref and c.get("doctor_stats"):
                    for d in c["doctor_stats"]:
                        if d["name"] in xref:
                            d["clinic_doctor_url"] = xref[d["name"]]
                            xref_n += 1
            except Exception as e:
                print(f"[merge xref] {cid} err: {e}", file=sys.stderr)
    if ext_n or price_n or xref_n:
        print(f"[merge] external_reviews={ext_n}, pricing={price_n}, doctor_xref={xref_n}")


# ── 메인 ──────────────────────────────────────────────────────
def main():
    bangkok_csv = SOURCES[0]["clinics_csv"]
    if not bangkok_csv.exists():
        print(f"NOT FOUND: {bangkok_csv}", file=sys.stderr)
        sys.exit(1)

    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    clinics: list[dict] = []
    district_counter: Counter[str] = Counter()
    category_counter: Counter[str] = Counter()
    city_counter: Counter[str] = Counter()
    lang_total = Counter()
    seen_place_ids: set[str] = set()

    per_city_counts: list[tuple[str, int]] = []
    for source in SOURCES:
        n = process_source(
            source, clinics, district_counter, category_counter,
            city_counter, lang_total, seen_place_ids,
        )
        per_city_counts.append((source["city_label"], n))

    # External reviews + pricing 통합 (scraper가 채워두는 데이터 merge)
    merge_external_data(clinics)
    # Pantip mention 통합 (pantip/output/clinics/<id>.json 머지)
    merge_pantip_data(clinics)

    clinics.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_clinics": len(clinics),
        "with_district": sum(1 for c in clinics if c["district"]),
        "with_categories": sum(1 for c in clinics if c["categories"]),
        "with_reviews_scraped": sum(1 for c in clinics if c["scraped_review_count"] > 0),
        "with_pantip_mentions": sum(1 for c in clinics if c.get("pantip", {}).get("mention_count", 0) > 0),
        "language_total": dict(lang_total),
        "city_counts": dict(city_counter.most_common()),
        "district_counts": dict(district_counter.most_common()),
        "category_counts": dict(category_counter.most_common()),
        "clinics": clinics,
    }
    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, out_path)

    print(f"[OK] wrote {out_path}")
    print(f"  clinics: {len(clinics)}")
    for label, n in per_city_counts:
        print(f"    {label}: {n}")
    print(f"  with district: {payload['with_district']}")
    print(f"  with categories: {payload['with_categories']}")
    print(f"  with reviews scraped: {payload['with_reviews_scraped']}")
    print(f"  review languages (TH/EN/other): {dict(lang_total)}")
    print(f"  top districts: {list(district_counter.most_common(5))}")
    print(f"  category counts: {dict(category_counter.most_common())}")


if __name__ == "__main__":
    main()
