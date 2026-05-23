"""클리닉명 정리 + Thai/English 매칭 유틸.

master_db 의 name 필드는 다양한 형태로 들어옴:
  - 'Vincent Clinic Asok (วินเซนต์คลินิก สาขาอโศก)'   영문(태국문)
  - 'Asavanant Dental Clinic'                          영문만
  - 'Aura Bangkok Clinic Sathon'                       브랜드+지점
  - '32 Dental Clinic - คลินิกทันตกรรม 32 สาขาลาดกระบัง'  영문 - 태국문 지점
  - 'LABX Clinic สาขาฟิวเจอร์พาร์ค รังสิต Future Park Rangsit FL.1'
  - 'Bangkok Hospital Sukhumvit Branch'                지점명 포함

목적:
  1) 검색 쿼리 후보를 progressive (full → brand core → brand stem) 로 생성
     검색 hit 늘리려면 더 짧은 쿼리가 필요하지만 정확도는 매칭으로 잡음.
  2) 본문 매칭 토큰은 풀네임 변형들 — 본문에 풀네임이 실제로 등장해야 mention 으로 판정.
"""
from __future__ import annotations

import re
import unicodedata

# 흔히 붙는 회사형 접미사 / 지점 표기 — 검색 노이즈
SUFFIX_PATTERNS = [
    r"\bCo\.?,?\s*Ltd\.?$",
    r"\bInc\.?$",
    r"\bBranch$",
    r"\bSaha$",
    r"\(.+?\)$",    # 끝에 붙은 괄호 (마지막에 따로 추출하므로 제거)
]

# 너무 generic 해서 검색하면 안 되는 단독 단어
GENERIC_TOKENS = {
    "clinic", "hospital", "dental", "beauty", "medical", "center",
    "คลินิก", "โรงพยาบาล",
}

# Thai 문자 범위
RE_THAI = re.compile(r"[฀-๿]")
# 영문/숫자
RE_LATIN = re.compile(r"[A-Za-z0-9]")


def has_thai(s: str) -> bool:
    return bool(RE_THAI.search(s))


def has_latin(s: str) -> bool:
    return bool(RE_LATIN.search(s))


def normalize(s: str) -> str:
    """공백/특수문자 정리, lowercased."""
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def extract_paren(s: str) -> tuple[str, str | None]:
    """'A (B)' → ('A', 'B'). 괄호 없으면 (s, None).
    중첩/여러 괄호는 마지막 것만."""
    m = re.search(r"^(.+?)\s*\(([^()]+)\)\s*$", s.strip())
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return s.strip(), None


def strip_suffixes(s: str) -> str:
    for pat in SUFFIX_PATTERNS:
        s = re.sub(pat, "", s, flags=re.IGNORECASE).strip()
    s = re.sub(r"[\s,\-—–]+$", "", s).strip()
    return s


# Pantip 검색은 너무 긴 쿼리에 hit 없으니, branch 표시 떼고 brand core/stem 추출.
# 지점/위치를 가리키는 단어들 — 이 단어 이후는 검색 쿼리에서 자름.
BRANCH_MARKERS_TH = ["สาขา", "ชั้น"]   # 'branch', 'floor'
BRANCH_MARKERS_EN = [r"\bBranch\b", r"\bFL\.\d+\b", r"\bFloor\s*\d+\b"]

# 자주 나오는 방콕/태국 지역명 (브랜드 다음에 붙으면 지점) — exact word boundary 매치
DISTRICT_MARKERS = [
    # 영문
    "Sukhumvit", "Asok", "Thonglor", "Thonglo", "Sathon", "Sathorn", "Silom",
    "Siam", "Phrom Phong", "Ekamai", "Onnut", "Pratunam", "Ratchadamri",
    "Ratchaprasong", "Ratchada", "Ratchayothin", "Bangkae", "Bang Kae",
    "Bang Na", "Bangna", "Lat Phrao", "Latphrao", "Lat Krabang", "Latkrabang",
    "Min Buri", "Bang Khen", "Bangkhen", "Don Muang", "Don Mueang",
    "Phaya Thai", "Phayathai", "Huai Khwang", "Chinatown", "Yaowarat",
    "Future Park", "Rangsit", "Pattaya", "Pattaya Central", "Naklua",
    "Jomtien", "Hua Hin", "Phuket", "Patong", "Karon", "Kata", "Chiang Mai",
    "Chiang Rai", "Krabi", "Koh Samui", "Hat Yai", "Khon Kaen", "Korat",
    "Udon Thani", "Surat Thani", "Nakhon Si Thammarat", "Pattana",
    # 태국문 지명 일부 (자주)
    "อโศก", "ทองหล่อ", "สาทร", "สีลม", "สยาม", "พร้อมพงษ์", "เอกมัย", "อ่อนนุช",
    "ปทุมวัน", "บางแค", "บางนา", "ลาดพร้าว", "ลาดกระบัง", "พญาไท", "ห้วยขวาง",
    "ฟิวเจอร์พาร์ค", "รังสิต", "พัทยา", "หัวหิน", "ภูเก็ต", "เชียงใหม่", "เชียงราย",
    "กระบี่", "เกาะสมุย", "หาดใหญ่", "ขอนแก่น", "โคราช", "อุดรธานี",
]


def _strip_branch(s: str) -> str:
    """문자열에서 'สาขา', 'Branch', 'FL.1', '- <태국문 지점명>' 같은 패턴 이후 제거."""
    if not s:
        return s
    # 1) 'สาขา' 또는 그 후의 모든 것 제거
    for m in BRANCH_MARKERS_TH:
        idx = s.find(m)
        if idx != -1:
            s = s[:idx]
    # 2) 'Branch', 'FL.\d+' 같은 명시적 영문 표기 이후 제거
    for pat in BRANCH_MARKERS_EN:
        s = re.split(pat, s, maxsplit=1, flags=re.IGNORECASE)[0]
    # 3) ' - <뒤쪽 부분>' 패턴 (대시로 분리된 별칭/지점)
    # 단, '32 Dental Clinic - คลินิก...' 의 경우 영문/태국문이 둘 다 동등한 별칭일 수 있으므로
    # 대시 이전이 이미 길이가 충분(>=5)할 때만 자른다.
    if " - " in s and len(s.split(" - ")[0].strip()) >= 5:
        s = s.split(" - ")[0]
    # 4) 끝에 붙은 district 단어 제거 (예: 'Aura Bangkok Clinic Sathon' → 'Aura Bangkok Clinic')
    changed = True
    while changed:
        changed = False
        s = s.strip().rstrip(",;:-– ")
        for d in DISTRICT_MARKERS:
            pat = re.compile(rf"\s+{re.escape(d)}\s*$", re.IGNORECASE)
            new = pat.sub("", s)
            if new != s:
                s = new
                changed = True
                break
    return s.strip()


def _brand_stem(s: str, n_words: int = 2) -> str:
    """첫 N단어 (브랜드 stem). 영문/숫자/태국문 혼합 처리."""
    if not s:
        return ""
    # 단어 토크나이즈 — 공백 기준, 단 태국어는 공백 없이 붙어있을 수 있어서 일단 공백 split.
    parts = s.split()
    return " ".join(parts[:n_words]).strip()


def build_queries(name: str) -> list[str]:
    """progressive 검색 쿼리: full → brand-no-branch → brand stem.

    실제 본문 매칭은 build_match_tokens 의 토큰들로 검증 → 정확도 보존.
    """
    name = normalize(name)
    base, paren = extract_paren(name)
    base = strip_suffixes(base)
    paren = strip_suffixes(paren) if paren else None

    cands: list[str] = []
    for v in [base, paren]:
        if not v:
            continue
        v = v.strip()
        if not v or v.lower() in GENERIC_TOKENS:
            continue
        # 0) 풀
        cands.append(v)
        # 1) 지점/위치 제거 버전
        no_branch = _strip_branch(v)
        if no_branch and no_branch != v and no_branch.lower() not in GENERIC_TOKENS:
            cands.append(no_branch)
        # 2) brand stem (2-3 단어) — 단, 4글자 이상이고 generic 아닐 때
        for n in (3, 2):
            stem = _brand_stem(no_branch or v, n_words=n)
            if (stem and len(stem) >= 4 and stem.lower() not in GENERIC_TOKENS
                    and stem != v and stem != no_branch):
                cands.append(stem)

    # dedup 순서 유지, 너무 짧은 거 제외
    queries = []
    for c in cands:
        if len(c) < 4:
            continue
        if c.lower() in GENERIC_TOKENS:
            continue
        if c not in queries:
            queries.append(c)
    return queries


def build_match_tokens(name: str) -> list[str]:
    """본문 매칭용 토큰. 정확도 우선 — 너무 짧거나 generic 한 stem 은 제외.

    포함:
      - full name (원형)
      - branch 제거 버전 (Pantip 사용자가 지점 빼고 쓰는 경우 자주)
      - 위 두 가지의 '공백 제거' 변형 (태국문자 사이 공백 차이 흡수)

    제외:
      - brand stem 2단어/3단어 — fp 가 너무 많아져서 (예: 'Aura Bangkok' 만으로
        매칭하면 다른 'Aura Bangkok' 도 잡힘). 단어 5 글자 이상 + 고유성 보장
        안 되니 정확도 위해 컷.
    """
    name = normalize(name)
    base, paren = extract_paren(name)
    base = strip_suffixes(base)
    paren = strip_suffixes(paren) if paren else None

    raw_variants: list[str] = []
    for v in [base, paren]:
        if not v:
            continue
        v = v.strip()
        if not v or v.lower() in GENERIC_TOKENS:
            continue
        raw_variants.append(v)
        nb = _strip_branch(v)
        if nb and nb != v and nb.lower() not in GENERIC_TOKENS and len(nb) >= 6:
            raw_variants.append(nb)

    tokens: list[str] = []
    for v in raw_variants:
        if len(v) < 5:  # 너무 짧은 매칭 토큰은 fp 위험
            continue
        if v not in tokens:
            tokens.append(v)
        no_space = re.sub(r"\s+", "", v)
        if no_space != v and len(no_space) >= 5 and no_space not in tokens:
            tokens.append(no_space)
    return tokens


def _token_matches(text: str, token: str) -> bool:
    """단일 token 이 text 에 등장하는지 (word boundary aware).

    - 토큰이 영문/숫자로 시작/끝나는 경우: word boundary 요구 (regex \b).
      '32 Dental Clinic' 토큰이 'Smile32 Dental Clinic' 에 매칭되는 fp 방지.
    - 토큰이 태국문자만 으로 구성: substring 허용 (태국문은 공백이 단어경계 아님).
    - 공백제거 변형: word boundary 어려우니, 인접 latin/digit 문자 없을 때만 매칭으로 인정.
    """
    if not text or not token:
        return False
    text_l = text.lower()
    tok_l = token.lower()

    starts_alnum = bool(re.match(r"^[A-Za-z0-9]", token))
    ends_alnum = bool(re.search(r"[A-Za-z0-9]$", token))

    if starts_alnum or ends_alnum:
        # 영문/숫자 경계 요구
        lb = r"(?<![A-Za-z0-9])" if starts_alnum else ""
        rb = r"(?![A-Za-z0-9])" if ends_alnum else ""
        pat = re.compile(lb + re.escape(tok_l) + rb)
        return bool(pat.search(text_l))
    else:
        # 순수 태국문자/기타 → substring OK
        return tok_l in text_l


def text_contains_any(text: str, tokens: list[str]) -> tuple[bool, list[str]]:
    """text 에 tokens 중 하나라도 등장하는지. word boundary 적용.

    매칭에 사용된 토큰 목록도 함께 리턴 (디버깅/신뢰도용).
    """
    if not text:
        return False, []
    text_n = normalize(text)
    text_no_space_n = re.sub(r"\s+", "", text_n)
    hits: list[str] = []
    for tok in tokens:
        tok_n = normalize(tok)
        # 1) 그대로 매칭 (word boundary)
        if _token_matches(text_n, tok_n):
            hits.append(tok)
            continue
        # 2) 공백 제거 변형 매칭 — 단, 영문/숫자 경계 까다로움
        # (영문 토큰 공백 제거 'AuraBangkokClinic' 은 'XAuraBangkokClinicY' 에도 매칭됨 → fp 위험)
        # 그래서 공백 제거 매칭은 토큰에 태국문자가 포함되거나 길이 8+ 일 때만 허용.
        tok_ns = re.sub(r"\s+", "", tok_n)
        if tok_ns == tok_n:
            continue  # 공백 없는 토큰이라 이미 위에서 처리
        if len(tok_ns) < 8 and not RE_THAI.search(tok_ns):
            continue
        if _token_matches(text_no_space_n, tok_ns):
            hits.append(tok)
    return bool(hits), hits


if __name__ == "__main__":
    # 단위 테스트 ─ master_db 의 실제 케이스
    cases = [
        "Vincent Clinic Asok (วินเซนต์คลินิก สาขาอโศก)",
        "Asavanant Dental Clinic",
        "คลินิกหมอตา",
        "Bangkok Hospital Sukhumvit Branch",
        "Grace Clinic",
        "Central Rama 9",
        "Clinic",
        "Co., Ltd.",
    ]
    for c in cases:
        q = build_queries(c)
        t = build_match_tokens(c)
        print(f"{c!r}\n  queries: {q}\n  tokens:  {t}")
