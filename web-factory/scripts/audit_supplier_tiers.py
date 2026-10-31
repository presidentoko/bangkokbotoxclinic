"""supplier 등급이 실제 검색 수요를 예측하는지 채점한다.

lib/supplierTier.ts 는 두 가지를 섞어 사이트맵 제출을 정한다.

    inSitemap(r) = tier(r) in {A, B, C}  OR  hasSearchDemand(r)

뒤쪽(구글이 이미 노출해준 기록)은 실측이고, 앞쪽(기록 풍부함 등급)은 추측이다.
2026-10-24 GSC 내보내기로 앞쪽을 채점한 결과:

    등급  전체   노출받음  비율    노출   클릭
      A    305     35   11.5%    131     4     DBD 등기 — "Maps 에 없는 것"
      B   3722    274    7.4%  1,213    12
      C   1766     16    0.9%     58     1     제출 대상인데 최하위
      D   2135    220   10.3%  1,033     3
      E   2864     14    0.5%     60     0
      F   3406    241    7.1%  1,011    12     이름·전화뿐 — "Maps 미러"

읽는 법 두 가지:

  1. 등급은 수요와 상관이 없다. "Maps 에 없는 것을 가졌는가" 로 줄을 그었는데
     F(이름·전화뿐)가 클릭 12 로 A·C·D 를 합친 것(8)보다 많다. C 는 제출 대상
     중 유일하게 1% 미만이다.

  2. 규칙이 버는 페이지를 빼고 있다. 규칙상 제외인 D/E/F 475 장이 노출 2,104
     클릭 15 — supplier 노출의 60%, 클릭의 47% 다. 지금 그 페이지들을 살리는
     건 hasSearchDemand 백도어뿐이고, 백도어는 **이미 번 뒤에야** 열린다.
     한 번도 노출되지 못한 D/F 페이지는 영원히 제출되지 않는다.

왜 이런가 — 클릭을 버는 쿼리를 보면 답이 나온다. 상위는 전부 태국어 상호
검색("บจก. โอ๋ อิเล็กทรอนิกส์ อำเภอเมืองปทุมธานี", 25 노출, 8.9 위)이다.
그건 특정 회사를 찾는 내비게이션 수요이고, 이름·전화·주소로 충족된다. 그래서
F 가 작동한다. 반대로 "기록이 풍부하다"는 건 비교 검색에 필요한 성질인데,
이 사이트는 비교 검색에서 56~90 위다.

이 스크립트는 판정을 내리지 않는다. 사이트맵을 좁히는 판단은 한 번 크게
틀린 적이 있다 — 2026-08-17 에 크롤 표면을 40% 줄인 커밋이 주간 노출을
411 → 87 로 떨어뜨리고 9주 뒤에도 회복되지 않았다. 그래서 숫자만 낸다.

사용:
  python web-factory/scripts/audit_supplier_tiers.py
  python web-factory/scripts/audit_supplier_tiers.py --queries   # 쿼리 종류까지
"""
from __future__ import annotations

import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIERS = ("A", "B", "C", "D", "E", "F")
RULE_IN = ("A", "B", "C")  # lib/supplierTier.ts inSitemap 의 규칙 절반


def tier(r: dict) -> str:
    """lib/supplierTier.ts supplierTier() 와 같은 순서·같은 조건."""
    if r.get("verified"):
        return "A"
    if (
        r.get("external_reviews")
        or r.get("sample_reviews_en")
        or r.get("sample_reviews_th")
        or r.get("sample_reviews_ko")
    ):
        return "B"
    if r.get("website") and r.get("hero_image"):
        return "C"
    if r.get("website") or r.get("email"):
        return "D"
    if r.get("hero_image"):
        return "E"
    return "F"


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")

    db = json.loads((ROOT / "data" / "master_db.json").read_text(encoding="utf-8"))
    demand = json.loads((ROOT / "data" / "gsc_demand.json").read_text(encoding="utf-8"))
    pages: dict = demand["pages"]
    suppliers = db["suppliers"]

    total: collections.Counter = collections.Counter()
    seen: collections.Counter = collections.Counter()
    imp: collections.Counter = collections.Counter()
    clk: collections.Counter = collections.Counter()

    for r in suppliers:
        t = tier(r)
        total[t] += 1
        d = pages.get(f"/supplier/{r['id']}")
        if d:
            seen[t] += 1
            imp[t] += d.get("impressions", 0)
            clk[t] += d.get("clicks", 0)

    print(f"master_db generated_at : {db.get('generated_at')}")
    print(f"gsc_demand updated     : {demand.get('updated')}")
    print(f"supplier               : {len(suppliers):,}\n")

    print("등급  전체    노출받음   비율     노출     클릭    CTR   제출규칙")
    for t in TIERS:
        rate = seen[t] / total[t] * 100 if total[t] else 0.0
        ctr = clk[t] / imp[t] * 100 if imp[t] else 0.0
        mark = "포함" if t in RULE_IN else "제외"
        print(
            f"  {t} {total[t]:6,}  {seen[t]:7,}  {rate:5.1f}%  {imp[t]:7,}  "
            f"{clk[t]:6,}  {ctr:5.2f}%   {mark}"
        )
    ti, tc = sum(imp.values()), sum(clk.values())
    print(
        f"  합계 {sum(total.values()):5,}  {sum(seen.values()):7,}  "
        f"{sum(seen.values()) / len(suppliers) * 100:5.1f}%  "
        f"{ti:7,}  {tc:6,}  {tc / ti * 100 if ti else 0:5.2f}%"
    )
    print(
        "\n  CTR 이 이 표의 핵심이다. 노출을 받느냐가 아니라, 받고도 클릭되느냐가\n"
        "  등급 사이에서 갈린다 — A(DBD 등기)만 평균의 3 배를 넘고, 그 A 가\n"
        f"  전체의 {total['A'] / len(suppliers) * 100:.1f}% 다."
    )

    rule_in = [r for r in suppliers if tier(r) in RULE_IN]
    backdoor = [
        r
        for r in suppliers
        if tier(r) not in RULE_IN and f"/supplier/{r['id']}" in pages
    ]
    submitted = len(rule_in) + len(backdoor)

    def tally(rows: list[dict]) -> tuple[int, int]:
        i = c = 0
        for r in rows:
            d = pages.get(f"/supplier/{r['id']}")
            if d:
                i += d.get("impressions", 0)
                c += d.get("clicks", 0)
        return i, c

    ri, rc = tally(rule_in)
    bi, bc = tally(backdoor)

    print(f"\n사이트맵 제출 {submitted:,} / {len(suppliers):,}")
    print(f"  규칙(A·B·C)으로  {len(rule_in):6,} 장 → 노출 {ri:6,} · 클릭 {rc:4,}")
    print(f"  수요 백도어로    {len(backdoor):6,} 장 → 노출 {bi:6,} · 클릭 {bc:4,}")
    if ri + bi:
        print(
            f"  백도어가 가져오는 몫: 노출 {bi / (ri + bi) * 100:.0f}% · "
            f"클릭 {bc / (rc + bc) * 100:.0f}%"
        )

    # 규칙상 제외이면서 아직 한 번도 노출되지 못한 페이지 — 백도어가 닿지 못하는 곳
    dark = sum(
        1
        for r in suppliers
        if tier(r) not in RULE_IN and f"/supplier/{r['id']}" not in pages
    )
    print(f"\n규칙 제외 + 노출 기록 없음 : {dark:,} 장 (제출되지 않고, 백도어도 못 엶)")

    if "--queries" in sys.argv:
        print("\n노출을 받은 supplier 페이지의 순위 분포")
        buckets: collections.Counter = collections.Counter()
        for r in suppliers:
            d = pages.get(f"/supplier/{r['id']}")
            if not d:
                continue
            p = d.get("best_position") or 0
            b = (
                "1-10"
                if p <= 10
                else "11-20"
                if p <= 20
                else "21-50"
                if p <= 50
                else "51+"
            )
            buckets[b] += 1
        for b in ("1-10", "11-20", "21-50", "51+"):
            print(f"  {b:>6} : {buckets[b]:,}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
