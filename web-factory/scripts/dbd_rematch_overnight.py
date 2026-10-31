"""DBD rematch — premium 풀의 unverified suppliers 다시 도전.

기존 verified CSV 의 fuzzy match 가 놓친 곳들을 우리 lib_dbd 로 직접 재시도.
강화된 시그널: phone normalization, address Thai-script token overlap,
capital-range sanity (큰 회사 → 작은 등록자본금 매칭 거부).

매치 score ≥ 90 만 머지 후보로 별도 JSON 으로 저장 (사용자 검수 후 머지).

산출:
    data/dbd/rematch_results.json — 매치 시도 결과 전수
    data/dbd/rematch_candidates.json — score ≥ 90 만, 머지 후보
    logs/dbd_rematch.log — 진행 로그
"""
from __future__ import annotations

import json
import logging
import re
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from lib_dbd import DbdClient, normalize_keyword, name_variants

# 이름 일치 규칙은 rebuild_master_db.py 가 매 rebuild 마다 집행하는 것과 **같은
# 함수여야 한다.** 여기서 따로 구현하면, 이 매처가 후보로 올린 것이 다음
# rebuild 에서 조용히 떨어져 나가는 상태로 갈린다. (그쪽은 `if __name__` 가드가
# 있어 import 해도 아무것도 실행되지 않는다.)
from rebuild_master_db import _norm_company, dbd_name_ok

WEB = HERE.parent
DATA = WEB / "data"
DBD_OUT = DATA / "dbd"
DBD_OUT.mkdir(exist_ok=True)
LOGS = WEB / "logs"
LOGS.mkdir(exist_ok=True)

OUT_ALL  = DBD_OUT / "rematch_results.json"
OUT_HIGH = DBD_OUT / "rematch_candidates.json"
# 포함일치만으로 통과한 건 — 자동 머지 대상이 아니라 사람이 보는 목록.
OUT_REVIEW = DBD_OUT / "rematch_review.json"
LOG_FILE = LOGS / "dbd_rematch.log"

# 강화된 매칭 점수 ≥ THIS 만 candidate 로
HIGH_THRESHOLD = 90

# 상호에 법인 표기가 있는가 — DBD 에 등기가 존재할 수 있는 이름인지의 사전 판정.
# rebuild_master_db.py 의 _LEGAL 과 같은 어휘를 쓰지만 역할이 반대다: 저쪽은
# 이름을 비교하기 전에 이 토큰들을 **지우고**, 이쪽은 토큰이 **있는지** 본다.
# 그래서 ร้าน(개인 상점)은 저쪽 패턴에는 들어 있지만 여기서는 제외한다 —
# 등기가 있을 근거가 아니라 없을 근거다.
def name_strength(supplier_name: str, hit: dict) -> str | None:
    """이 등기 기록이 상호와 얼마나 맞는가 — "exact", "loose", 또는 None.

    태국어 법인명과 영문 법인명 둘 다 본다. 같은 문자 체계끼리만 비교해야 해서
    jpNameE 가 필요하다: `Thai Onono Public Company Limited` ↔
    `ไทย โอโนโน่ จำกัด (มหาชน)` (등록번호 0107537002133) 는 같은 회사인데
    라틴↔태국 문자열 비교로는 원리적으로 통과할 수 없다.

    exact 와 loose 를 가르는 이유 — dbd_name_ok 는 한쪽 이름이 다른 쪽에
    포함되고 남는 토막이 숫자나 몇몇 접미사일 때도 통과시킨다. 그 구멍은
    `วีที แหนมเนือง ↔ วีที แหนมเนือง 2023 จำกัด`(같은 회사의 연도 표기) 를 위한
    것인데, 접두사가 같은 **다른** 회사도 같이 통과한다. 2026-10-31 실측으로
    후보 946 건 중 23 건이 이 경로였고 그 안에 분명한 오매치가 있었다:

        Nikon (Thailand) Co., Ltd.  ↔ นิกร789 จำกัด        ฿1M
        YS TECH (THAILAND) CO.,LTD  ↔ ซิสเทค (ประเทศไทย)   ฿140M
        ALUCON Public Company Ltd   ↔ อลูคอน 1990          ฿5M

    ALUCON 은 같은 검색 결과 안에 정답(`อลูคอน จำกัด (มหาชน)`, ฿432M,
    0107537001854)이 있었는데도 순서상 1990 쪽이 먼저 걸렸다. 그래서 호출부는
    exact 를 loose 보다 **우선**해야 하고, loose 는 자동 후보가 아니라 사람이
    볼 목록으로 빠진다.
    """
    best = None
    for legal in (hit.get("jpName"), hit.get("jpNameE")):
        if not legal or not dbd_name_ok(supplier_name, legal):
            continue
        if _norm_company(supplier_name) == _norm_company(legal):
            return "exact"
        best = "loose"
    return best


_JURISTIC = re.compile(
    r"บริษัท|บจก\.?|บจ\.|ห้างหุ้นส่วนจำกัด|ห้างหุ้นส่วนสามัญ|ห้างหุ้นส่วน|หจก\.?|หจ\.|"
    r"จำกัด|\(?มหาชน\)?|"
    r"co\.?,?\s*ltd|company\s+limited|public\s+company|\bpcl\b|corporation|corp\.",
    re.I,
)


def normalize_phone(p: str) -> str:
    """+66 81-234-5678 → 0812345678 (Thai 표준)"""
    d = re.sub(r"\D", "", p or "")
    if d.startswith("66"):
        d = "0" + d[2:]
    return d


def address_tokens_th(addr: str) -> set[str]:
    """Thai script tokens — 매칭용. 짧은 토큰 / 숫자 제거."""
    if not addr: return set()
    # Thai 문자 시퀀스만 추출
    tokens = re.findall(r"[฀-๿]{3,}", addr)
    return set(tokens)


def enhanced_score(supplier: dict, dbd_hit: dict) -> tuple[int, list[str]]:
    """0-100. 매칭 시그널별 reason 도 같이 반환."""
    reasons = []
    score = 0

    # 1) 이름 매칭 (기존 lib_dbd 점수 그대로)
    sup_name_norm = normalize_keyword(supplier.get("name", ""))
    dbd_name = (dbd_hit.get("jpName") or "")
    dbd_name_e = (dbd_hit.get("jpNameE") or "")
    dbd_norm = normalize_keyword(dbd_name)
    dbd_e_norm = normalize_keyword(dbd_name_e)
    if sup_name_norm and (sup_name_norm == dbd_norm or sup_name_norm == dbd_e_norm):
        score += 70; reasons.append("name_exact")
    elif sup_name_norm and (sup_name_norm in dbd_norm or sup_name_norm in dbd_e_norm):
        score += 55; reasons.append("name_contains")
    elif sup_name_norm and (dbd_norm in sup_name_norm or dbd_e_norm in sup_name_norm):
        score += 50; reasons.append("name_contained")

    # 2) Thai-script 주소 토큰 overlap (강력)
    sup_addr_tokens = address_tokens_th(supplier.get("address", ""))
    dbd_addr_tokens = address_tokens_th(dbd_hit.get("address", "") or "")
    if sup_addr_tokens and dbd_addr_tokens:
        common = sup_addr_tokens & dbd_addr_tokens
        if len(common) >= 3:
            score += 20; reasons.append(f"addr_tokens({len(common)})")
        elif len(common) >= 1:
            score += 8; reasons.append(f"addr_tokens({len(common)})")

    # 3) district / city 매칭
    sup_dist = (supplier.get("district") or "").lower().replace(" district", "").strip()
    dbd_addr_low = (dbd_hit.get("address") or "").lower()
    dbd_addr_e_low = (dbd_hit.get("addressE") or "").lower()
    if sup_dist and (sup_dist in dbd_addr_low or sup_dist in dbd_addr_e_low):
        score += 8; reasons.append("district")
    sup_city = (supplier.get("city_label") or "").lower()
    if sup_city and (sup_city in dbd_addr_low or sup_city in dbd_addr_e_low):
        score += 5; reasons.append("city")

    # 4) provinceCode (숫자) 매칭 — DBD has numeric province codes
    # supplier 의 province_en + Bangkok=10, Chon Buri=20, ... — skip for now

    # 5) capAmt sanity — 큰 회사 (high reviews) → 작은 자본금 매칭 reject
    cap = dbd_hit.get("capAmt") or 0
    reviews = supplier.get("total_reviews") or 0
    if reviews >= 100 and cap > 5_000_000:
        score += 5; reasons.append("cap_consistent")

    return min(score, 100), reasons


def setup_logging() -> logging.Logger:
    log = logging.getLogger("rematch")
    log.setLevel(logging.INFO)
    fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    log.addHandler(fh)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    log.addHandler(sh)
    return log


def main() -> None:
    log = setup_logging()
    db = json.loads((DATA / "master_db.json").read_text(encoding="utf-8"))
    suppliers = db["suppliers"]
    unverified = [s for s in suppliers if not s.get("verified")]

    # 전체 unverified 는 8,000곳 넘고 polite delay 0.7초라 몇 시간이 걸린다.
    # 표적만 돌릴 수 있게 한다.
    #
    #   --no-contact  전화·웹사이트가 모두 없는 곳만. 이 페이지들은 바이어가
    #                 연락할 방법이 없어서, DBD 등기 정보가 전화번호를 대신할
    #                 유일한 신뢰 근거다 (2026-10-03: 해당 1,664곳 중 758곳은
    #                 이미 검증돼 있고, 나머지에서 상호에 법인 표기가 있는
    #                 144곳이 재시도 가치가 있다).
    #   --untried     DBD 파이프라인에 한 번도 들어가 본 적 없는 곳만
    #                 (`verified` 키 자체가 없는 레코드). 2026-10-31 실측으로
    #                 시도된 곳은 2,742 곳뿐이고 11,456 곳은 미시도다. 이미
    #                 실패한 잔여물을 다시 돌리는 건 값이 없다 — 2026-10-03 에
    #                 906 곳(잔여물)을 돌려서 ≥90 이 0 건, 89%가 아예 검색
    #                 결과조차 없었다(no hits 810).
    #   --juristic    상호에 법인 표기가 있는 곳만. DBD 는 법인 등기부라서
    #                 `ร้าน…`(개인 상점)은 애초에 기록이 없다. 시도된 집단에서
    #                 법인 표기가 있는 쪽 성공률은 13.9%(247/1,781), 없는 쪽은
    #                 6.0%(58/961) — 요청당 수확이 2.3 배다.
    #                 이 성공률은 2026-10-26 교정(이름 일치만 인정, 퍼지 점수
    #                 무시) **이후** 수치라 부풀려져 있지 않다.
    if "--untried" in sys.argv:
        before = len(unverified)
        unverified = [s for s in unverified if "verified" not in s]
        log.info(f"--untried: {before} -> {len(unverified)}")
    if "--juristic" in sys.argv:
        before = len(unverified)
        unverified = [s for s in unverified if _JURISTIC.search(s.get("name", ""))]
        log.info(f"--juristic: {before} -> {len(unverified)}")
    if "--no-contact" in sys.argv:
        before = len(unverified)
        unverified = [s for s in unverified if not s.get("phone") and not s.get("website")]
        log.info(f"--no-contact: {before} -> {len(unverified)}")
    if "--limit" in sys.argv:
        n = int(sys.argv[sys.argv.index("--limit") + 1])
        unverified = unverified[:n]
        log.info(f"--limit: {len(unverified)}")

    log.info(f"loaded {len(suppliers)} suppliers, {len(unverified)} to attempt — starting rematch")

    cli = DbdClient(polite_delay=0.7)
    results: list[dict] = []
    candidates: list[dict] = []
    review: list[dict] = []
    cnt_attempted = 0
    cnt_matched_high = 0
    cnt_matched_low = 0
    cnt_no_hits = 0
    cnt_review = 0
    cnt_errors = 0

    t0 = time.time()
    for i, sup in enumerate(unverified, 1):
        cnt_attempted += 1
        sup_id = sup.get("id")
        name = sup.get("name", "")
        variants = name_variants(name)

        best = None
        best_score = 0
        best_reasons: list[str] = []
        exact = None          # 이름이 완전히 일치한 hit — 있으면 이게 답이다
        exact_score = 0
        exact_reasons: list[str] = []
        loose = None          # 포함+잔여로만 통과한 hit — 사람이 볼 목록으로
        loose_score = 0
        loose_reasons: list[str] = []
        tried: list[str] = []

        for kw in variants[:3]:  # 최대 3 variants
            tried.append(kw)
            try:
                hits = cli.search(kw)
            except Exception as e:
                log.warning(f"  [{i:4d}] search FAIL '{kw}': {type(e).__name__}")
                continue
            for h in hits[:8]:
                sc, reasons = enhanced_score(sup, h)
                if sc > best_score:
                    best_score = sc
                    best = h
                    best_reasons = reasons
                # 퍼지 점수와 **별도로** 이름 규칙을 본다. 점수가 높은 hit 가
                # 규칙을 통과한 hit 를 덮어쓰면 안 된다 — 2026-10-03 실행에서
                # ดีพีพี ซัพพลาย บางปู ↔ ดีพีพี ซัพพลาย บางปู จำกัด (글자 그대로
                # 같고 จำกัด 만 붙은 것) 이 55점이라 68점 오답에 밀려 사라졌다.
                strength = name_strength(name, h)
                if strength == "exact" and exact is None:
                    exact, exact_score, exact_reasons = h, sc, reasons
                elif strength == "loose" and loose is None:
                    loose, loose_score, loose_reasons = h, sc, reasons
            if exact is not None:
                break  # 이름이 완전히 일치했다 — 더 볼 이유가 없다
            # loose 뿐이면 계속 본다. 같은 결과 집합 안에 완전일치가 더 뒤에
            # 있을 수 있다 — ALUCON 이 정확히 그랬다.

        # 기록하는 hit 는 완전일치 > 포함일치 > 퍼지 최고점 순.
        if exact is not None:
            hit, hit_score, hit_reasons, strength = exact, exact_score, exact_reasons, "exact"
        elif loose is not None:
            hit, hit_score, hit_reasons, strength = loose, loose_score, loose_reasons, "loose"
        else:
            hit, hit_score, hit_reasons, strength = best, best_score, best_reasons, None
        rec = {
            "supplier_id": sup_id,
            "supplier_name": name,
            "supplier_city": sup.get("city_label"),
            "supplier_district": sup.get("district"),
            "variants_tried": tried,
            "score": hit_score,
            "reasons": hit_reasons,
            "name_match": strength,
        }
        if hit:
            rec.update({
                "dbd_jpNo": hit.get("jpNo"),
                "dbd_jpType": hit.get("jpTypeCode"),
                "dbd_name": hit.get("jpName"),
                # 등기부 영문명. 구글맵은 영문 상호를, DBD 는 태국어 법인명만
                # 갖는 경우가 흔해서 (이 풀의 48%) 이 필드 없이는 교차 문자
                # 체계 매치를 원리적으로 확인할 수 없다.
                "dbd_name_e": hit.get("jpNameE"),
                "dbd_capAmt": hit.get("capAmt"),
                "dbd_address": hit.get("address"),
            })

        results.append(rec)

        # 후보 기준은 이름 **완전일치** 다. 퍼지 점수가 아니다 — 2026-10-26
        # 교정의 결론이 그것이었고(506/847 이 다른 회사였다), 그 결론이 이
        # 매처에는 전파되지 않아 10-03 실행은 유효한 매치 10 건을 전부 버렸다.
        # 포함일치는 자동 승격하지 않는다 (name_strength 주석의 Nikon/ALUCON).
        if exact is not None:
            cnt_matched_high += 1
            candidates.append(rec)
        elif loose is not None:
            cnt_review += 1
            review.append(rec)
        elif best_score >= 60:
            cnt_matched_low += 1
        else:
            cnt_no_hits += 1

        # 매 50개마다 중간 저장 + 진행 로그
        if i % 50 == 0:
            elapsed = time.time() - t0
            rate = i / elapsed
            eta_sec = (len(unverified) - i) / rate
            log.info(
                f"  [{i:4d}/{len(unverified)}] exact={cnt_matched_high} review={cnt_review} low={cnt_matched_low} no={cnt_no_hits} err={cnt_errors}  "
                f"rate={rate:.1f}/s eta={eta_sec/60:.0f}min"
            )
            OUT_ALL.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
            OUT_HIGH.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")
            OUT_REVIEW.write_text(json.dumps(review, ensure_ascii=False, indent=2), encoding="utf-8")

    # 최종 저장
    OUT_ALL.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_HIGH.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_REVIEW.write_text(json.dumps(review, ensure_ascii=False, indent=2), encoding="utf-8")

    log.info("=" * 60)
    log.info(f"DONE — {cnt_attempted} attempted")
    log.info(f"  name exact (머지 후보):   {cnt_matched_high}")
    log.info(f"  name loose (검수 필요):   {cnt_review}")
    log.info(f"  low conf (60-{HIGH_THRESHOLD-1}):     {cnt_matched_low}")
    log.info(f"  no hits:                {cnt_no_hits}")
    log.info(f"  errors:                 {cnt_errors}")
    log.info(f"  → {OUT_HIGH}")
    log.info(f"  → {OUT_REVIEW}")


if __name__ == "__main__":
    main()
