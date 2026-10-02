"""도시·버티컬별 "지금 켜면 실제 재시도 큐에 편입될 수" — scraper.py 로직 그대로.

첫 시도는 "미수집 = 건질 것" 으로 셌는데 그게 틀렸다. scraper.py(1960~2150행)는
리뷰 파일이 없어도 **total_reviews < MIN_REVIEW_COUNT(5) 면 "정상적으로 비어있음"
으로 보고 완료 처리**한다. 파타야가 8시간 돌고 커버리지 +0 이었던 이유가 이것이다
— 미수집 108곳 대부분이 리뷰 5개 미만이라 애초에 큐에 들어가지 않는다.

재현하는 판정 (scraper.py 와 1:1):
  리뷰파일의 sort_source 집합으로 status 결정
    없음/빈값                      → none
    relevant + newest 둘 다        → complete
    그 외                          → partial
  partial 수렴: total<=10 or n_rows>=total*0.8 or n_rows>=100 → complete
  complete  → 파일 mtime 이 7일 경과면 refresh(재스캔), 아니면 existing
  partial   → retry  (부분수집)
  none & total>=5 → retry  (완전실패)
  none & total<5  → existing  ("리뷰 적어서 비어있는 건 정상")
  그 다음 retry_attempts>=3 제외, skipped 사유가 "closed" 면 제외.
"""
import csv
import json
import pathlib
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(r"C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable")
MIN_REVIEW_COUNT = 5
REFRESH_DAYS = 7

TARGETS = [
    ("스파", "spa_output/bangkok"), ("스파", "spa_output/chiang_mai"),
    ("스파", "spa_output/hua_hin"), ("스파", "spa_output/koh_samui"),
    ("스파", "spa_output/krabi"), ("스파", "spa_output/pattaya"),
    ("스파", "spa_output/phuket"),
    ("덴탈", "dental_output/bangkok"), ("덴탈", "dental_output/chiang_mai"),
    ("덴탈", "dental_output/pattaya"), ("덴탈", "dental_output/phuket"),
    ("헤어", "hair_output/bangkok"), ("헤어", "hair_output/chiang_mai"),
    ("헤어", "hair_output/pattaya"), ("헤어", "hair_output/phuket"),
    ("클리닉", "bangkok_clinics/output"),
]


def pid_to_fn(pid: str) -> str:
    return pid.replace(":", "_")


def review_status(f: pathlib.Path):
    if not f.exists():
        return "none", 0, None
    try:
        with open(f, newline="", encoding="utf-8", errors="replace") as fh:
            r = csv.DictReader(fh)
            sources, n = set(), 0
            for row in r:
                n += 1
                sources.add((row.get("sort_source") or "").strip())
    except OSError:
        return "none", 0, None
    sources.discard("")
    mt = f.stat().st_mtime
    if not sources:
        return "none", 0, mt
    if "relevant" in sources and "newest" in sources:
        return "complete", n, mt
    return "partial", n, mt


def analyze(d: pathlib.Path):
    cl = d / "clinics.csv"
    if not cl.exists():
        return None
    reviews = d / "reviews"
    cutoff = time.time() - REFRESH_DAYS * 86400

    existing = retry = refresh = 0
    retry_pids, low_empty = [], 0
    with open(cl, newline="", encoding="utf-8-sig", errors="replace") as f:
        for row in csv.DictReader(f):
            pid = row.get("place_id", "")
            if not pid:
                continue
            try:
                total = int(float(row.get("total_reviews") or 0))
            except (ValueError, TypeError):
                total = 0
            status, n_rows, mt = review_status(reviews / f"{pid_to_fn(pid)}_reviews.csv")
            if status == "partial" and (total <= 10 or n_rows >= total * 0.8 or n_rows >= 100):
                status = "complete"
            if status == "complete":
                if mt is not None and mt < cutoff and row.get("maps_url"):
                    refresh += 1
                else:
                    existing += 1
            elif status == "partial":
                retry += 1
                retry_pids.append(pid_to_fn(pid))
            elif total >= MIN_REVIEW_COUNT:
                retry += 1
                retry_pids.append(pid_to_fn(pid))
            else:
                existing += 1
                low_empty += 1

    budget = {}
    bf = d / "retry_attempts.json"
    if bf.exists():
        try:
            budget = json.loads(bf.read_text(encoding="utf-8"))
        except ValueError:
            pass
    exhausted = sum(1 for p in retry_pids if budget.get(p, 0) >= 3 or budget.get(p.replace("_", ":"), 0) >= 3)
    return existing, retry, refresh, exhausted, retry - exhausted, low_empty


print(f"{'버티컬':6s} {'출력':24s} {'완료':>6s} {'재스캔':>6s} {'재시도':>6s} "
      f"{'예산소진':>8s} {'지금건질수':>9s} {'리뷰<5':>7s}")
print("-" * 88)
tot = [0] * 6
rows = []
for vert, p in TARGETS:
    r = analyze(ROOT / p)
    if r is None:
        print(f"{vert:6s} {p:24s}  clinics.csv 없음")
        continue
    ex, rt, rf, exh, rec, low = r
    for i, v in enumerate((ex, rt, rf, exh, rec, low)):
        tot[i] += v
    rows.append((rec, vert, p, exh))
    print(f"{vert:6s} {p:24s} {ex:6d} {rf:6d} {rt:6d} {exh:8d} {rec:9d} {low:7d}")
print("-" * 88)
print(f"{'합계':6s} {'':24s} {tot[0]:6d} {tot[2]:6d} {tot[1]:6d} {tot[3]:8d} {tot[4]:9d} {tot[5]:7d}")

print("\n지금 켜서 건질 게 많은 순:")
for rec, vert, p, exh in sorted(rows, reverse=True)[:8]:
    extra = f"  (+예산리셋하면 {rec + exh})" if exh else ""
    print(f"   {rec:5d}  {vert} {p}{extra}")
