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

WEB = HERE.parent
DATA = WEB / "data"
DBD_OUT = DATA / "dbd"
DBD_OUT.mkdir(exist_ok=True)
LOGS = WEB / "logs"
LOGS.mkdir(exist_ok=True)

OUT_ALL  = DBD_OUT / "rematch_results.json"
OUT_HIGH = DBD_OUT / "rematch_candidates.json"
LOG_FILE = LOGS / "dbd_rematch.log"

# 강화된 매칭 점수 ≥ THIS 만 candidate 로
HIGH_THRESHOLD = 90


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
    log.info(f"loaded {len(suppliers)} suppliers, {len(unverified)} unverified — starting rematch")

    cli = DbdClient(polite_delay=0.7)
    results: list[dict] = []
    candidates: list[dict] = []
    cnt_attempted = 0
    cnt_matched_high = 0
    cnt_matched_low = 0
    cnt_no_hits = 0
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
            if best_score >= HIGH_THRESHOLD:
                break  # 충분히 좋음

        rec = {
            "supplier_id": sup_id,
            "supplier_name": name,
            "supplier_city": sup.get("city_label"),
            "supplier_district": sup.get("district"),
            "variants_tried": tried,
            "score": best_score,
            "reasons": best_reasons,
        }
        if best:
            rec.update({
                "dbd_jpNo": best.get("jpNo"),
                "dbd_jpType": best.get("jpTypeCode"),
                "dbd_name": best.get("jpName"),
                "dbd_capAmt": best.get("capAmt"),
                "dbd_address": best.get("address"),
            })

        results.append(rec)

        if best_score >= HIGH_THRESHOLD:
            cnt_matched_high += 1
            candidates.append(rec)
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
                f"  [{i:4d}/{len(unverified)}] high={cnt_matched_high} low={cnt_matched_low} no={cnt_no_hits} err={cnt_errors}  "
                f"rate={rate:.1f}/s eta={eta_sec/60:.0f}min"
            )
            OUT_ALL.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
            OUT_HIGH.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")

    # 최종 저장
    OUT_ALL.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_HIGH.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")

    log.info("=" * 60)
    log.info(f"DONE — {cnt_attempted} attempted")
    log.info(f"  high confidence (≥{HIGH_THRESHOLD}): {cnt_matched_high}")
    log.info(f"  low conf (60-{HIGH_THRESHOLD-1}):     {cnt_matched_low}")
    log.info(f"  no hits:                {cnt_no_hits}")
    log.info(f"  errors:                 {cnt_errors}")
    log.info(f"  → {OUT_HIGH}")


if __name__ == "__main__":
    main()
