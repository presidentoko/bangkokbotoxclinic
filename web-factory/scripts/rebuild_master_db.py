"""master_db.json 전체 재생성 — 단 하나의 진입점.

왜 이 파일이 생겼는가
---------------------
파이프라인이 세 조각으로 흩어져 있었고 순서와 후처리가 사람 머릿속에만 있었다.

    build_db_from_csv.py     CSV(premium/verified) → master_db 를 *덮어씀*
    apify_to_master_db.py    Apify raw → master_db 를 *덮어씀* (기존 것과 머지)
    merge_contact_emails.py  contact scraper → email 필드만 채움
    (+ dead-lead 필터는 아무 스크립트에도 없는 손작업이었다)

auto_rebuild.py 는 이 중 첫 번째만 호출했다. 2026-08-09 새 데이터가 감지되자
build_db_from_csv.py 가 돌면서 Apify 병합분을 통째로 날렸다 — 9,083 → 3,305.
그대로 빌드·배포까지 나가서 supplier 페이지 5,778 개가 프로덕션에서 사라졌고,
Search Console 에 404 668 건 / discovered-not-indexed 6,989 건으로 찍혔다.

그래서 순서를 코드로 고정한다. 어느 단계를 어떤 순서로 도는지가 이 파일이다.

    1. CSV        DBD·사진·공단·좌표가 붙은 3.3k enrichment 베이스
    2. Apify      Google Maps 커버리지 확장 (기존 enrichment 는 보존하며 머지)
    3. 이메일      contact-info-scraper 결과를 website 호스트로 매칭
    4. 링크수정    죽은 website 링크 교정/제거 (website_corrections.json)
    5. dead-lead  연락 수단도 신호도 없는 레코드 제거
    6. 통계        최종 목록 기준으로 전 카운터 재계산

멱등이다. 몇 번을 돌려도 같은 결과가 나오고, 중간에 뭘 빠뜨려도 다음 실행이 복구한다.

실행:
    python scripts/rebuild_master_db.py
    python scripts/rebuild_master_db.py --skip-apify   # CSV 만 빠르게 (배포 금지)
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
WEB = HERE.parent
MASTER_DB = WEB / "data" / "master_db.json"
APIFY_RAW = WEB / "data" / "apify_raw"
WEBSITE_CORRECTIONS = WEB / "data" / "website_corrections.json"

# 배포 사고 후 이 선 아래로 떨어지면 뭔가 잘못된 것이다. 2026-08-09 사고 당시
# 3,305 까지 떨어졌는데 아무도 못 막았다. 이제 여기서 막는다.
MIN_SUPPLIERS = 7000


def run(script: str, *args: str) -> None:
    print(f"\n{'=' * 60}\n▶ {script} {' '.join(args)}\n{'=' * 60}")
    proc = subprocess.run(
        [sys.executable, str(HERE / script), *args],
        cwd=str(WEB),
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if proc.returncode != 0:
        sys.exit(f"ABORT — {script} 실패 (exit {proc.returncode})")


def count() -> int:
    return len(json.loads(MASTER_DB.read_text(encoding="utf-8"))["suppliers"])


def has_signal(s: dict) -> bool:
    """dead lead 판정 — 바이어가 접촉할 방법도, 우리가 보여줄 것도 없는 레코드.

    이름과 별점만 있는 항목은 Google Maps 를 그대로 베낀 것이라 검색엔진에
    줄 게 없다. 크롤 예산만 먹고 discovered-not-indexed 로 쌓인다.
    """
    score = s.get("b2b_score") or s.get("trust_score") or 0
    return bool(s.get("verified") or s.get("website") or s.get("phone") or score >= 8)


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", (s or "").lower()).strip("_")


def apply_website_corrections(suppliers: list[dict]) -> None:
    """죽은 website 링크 교정·제거. suppliers 를 제자리에서 수정한다.

    왜 리빌드 안에 있어야 하는가: master_db.json 을 직접 고쳐봐야
    apify_to_master_db.py 의 PRESERVE_IF_EMPTY 가 다음 리빌드에서 옛 website 를
    되살린다 (새 스크랩에 website 가 비어 와도 기존 값을 보존하는 규칙).
    그래서 교정 목록이 리빌드 파이프라인의 마지막에 매번 다시 적용돼야 한다.

    2026-09-01 외부 제보로 시작 — 도메인 만료·폐업 후에도 구글 프로필에서 온
    링크가 계속 실려 나가고 있었다. 전수 검사 결과 3,595 개 중 ~5% 가 죽어 있었다.
    목록 생성: check_websites.py → recheck_websites.py → repair_websites.py
    """
    if not WEBSITE_CORRECTIONS.exists():
        print("\n[skip] website_corrections.json 없음 — 링크 교정 건너뜀")
        return
    c = json.loads(WEBSITE_CORRECTIONS.read_text(encoding="utf-8"))
    replace, remove = c.get("replace", {}), c.get("remove", {})
    n_rep = n_del = n_mail = 0
    for s in suppliers:
        w = (s.get("website") or "").strip()
        if not w:
            continue
        if w in replace:
            s["website"] = replace[w]
            n_rep += 1
        elif w in remove:
            s["website"] = ""
            n_del += 1
            # 이메일은 website 호스트로 매칭해 채운 값이다(merge_contact_emails.py).
            # 도메인이 DNS 에서 사라졌으면 그 주소로는 메일이 가지 않는다 —
            # 죽은 링크를 지우면서 죽은 메일함을 남겨두면 같은 버그가 남는다.
            if remove[w].get("verdict") == "DNS_FAIL" and s.get("email"):
                host = re.sub(r"^www\.", "", (w.split("//")[-1].split("/")[0]).lower())
                if s["email"].split("@")[-1].lower().endswith(host.split(":")[0]):
                    s["email"] = ""
                    n_mail += 1
    print(f"\n링크 교정 ({c.get('generated_at', '?')}): "
          f"수리 {n_rep:,} · 제거 {n_del:,} · 죽은 도메인 이메일 제거 {n_mail:,}")


def finalize() -> dict:
    """dead-lead 필터 + 전 통계 재계산.

    통계를 여기서 다시 계산하는 이유: apify_to_master_db.py 는 city_counts 를
    이번 배치에서 읽은 Apify place 로만 집계한다. 머지로 살아남은 기존 supplier 는
    빠져서, CSV 에만 있는 도시가 city_counts 에서 통째로 사라졌다. sitemap.ts 와
    /city/[name] 이 둘 다 city_counts 를 순회하므로 그 도시 페이지들이 조용히
    사이트맵에서 빠지고 있었다.
    """
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    before = db["suppliers"]
    # dead-lead 필터보다 먼저 — website 가 유일한 신호였던 레코드는 링크가
    # 죽은 순간 dead lead 다. 순서가 뒤집히면 그런 레코드가 살아남는다.
    apply_website_corrections(before)
    suppliers = [s for s in before if has_signal(s)]
    print(f"\ndead-lead 제거: {len(before):,} → {len(suppliers):,}  (-{len(before) - len(suppliers):,})")

    for s in suppliers:
        if not s.get("city") and s.get("city_label"):
            s["city"] = slugify(s["city_label"])

    city_counts = Counter(s["city_label"] for s in suppliers if s.get("city_label"))
    cat_counts = Counter(c for s in suppliers for c in (s.get("categories") or []))
    district_counts = Counter(
        f"{s.get('city')}/{s.get('district')}" for s in suppliers if s.get("district")
    )
    primary_counts = Counter(s["primary_type"] for s in suppliers if s.get("primary_type"))

    db.update({
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_suppliers": len(suppliers),
        "verified_count": sum(1 for s in suppliers if s.get("verified")),
        "with_dbd": sum(1 for s in suppliers if s.get("dbd")),
        "with_photos": sum(1 for s in suppliers if s.get("photos") or s.get("hero_image")),
        "with_phone": sum(1 for s in suppliers if s.get("phone")),
        "with_website": sum(1 for s in suppliers if s.get("website")),
        "with_email": sum(1 for s in suppliers if s.get("email")),
        "with_estate": sum(1 for s in suppliers if s.get("estate_name")),
        "with_district": sum(1 for s in suppliers if s.get("district")),
        "with_categories": sum(1 for s in suppliers if s.get("categories")),
        "with_reviews_scraped": sum(1 for s in suppliers if (s.get("scraped_review_count") or 0) > 0),
        "halal_count": sum(1 for s in suppliers if s.get("halal_certified")),
        "city_counts": dict(city_counts.most_common()),
        "district_counts": dict(district_counts.most_common()),
        "category_counts": dict(cat_counts.most_common()),
        "primary_type_counts": dict(primary_counts.most_common(50)),
        "suppliers": suppliers,
    })
    MASTER_DB.write_text(
        json.dumps(db, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    return db


def main() -> int:
    skip_apify = "--skip-apify" in sys.argv

    run("build_db_from_csv.py")
    print(f"  CSV 베이스: {count():,}")

    if skip_apify:
        print("\n--skip-apify — Apify 병합 건너뜀. 이 결과로 배포하지 말 것.")
    else:
        run("apify_to_master_db.py")
        print(f"  Apify 병합 후: {count():,}")
        if APIFY_RAW.exists():
            run("merge_contact_emails.py", str(APIFY_RAW))
        # Apify 가 준 사진 URL 은 Google 서명이 만료되면 403 이 된다 (표본 절반이
        # 이미 죽어 있었다). 캐시가 있어서 새 URL 만 확인한다 — 평소엔 몇 초.
        run("validate_photo_urls.py")

    db = finalize()
    total = db["total_suppliers"]

    print(f"\n{'=' * 60}")
    for k in ("total_suppliers", "verified_count", "with_dbd", "with_phone",
              "with_website", "with_email", "with_photos", "with_estate",
              "with_reviews_scraped"):
        print(f"  {k:22} {db[k]:>7,}")
    print(f"  {'provinces':22} {len(db['city_counts']):>7,}")

    if not skip_apify and total < MIN_SUPPLIERS:
        sys.exit(
            f"\nABORT — supplier {total:,} 개는 하한 {MIN_SUPPLIERS:,} 미만입니다.\n"
            f"data/apify_raw/ 가 비었거나 CSV 가 잘렸을 가능성이 높습니다.\n"
            f"이 상태로 빌드·배포하면 2026-08-09 사고가 반복됩니다."
        )
    print("\n[OK] master_db.json 재생성 완료")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    raise SystemExit(main())
