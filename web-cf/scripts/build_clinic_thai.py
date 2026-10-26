#!/usr/bin/env python3
"""태국어 리뷰 원문을 /th 클리닉 페이지에 붙인다 — master_db 재빌드 없이.

## 왜 별도 파일인가 (사용자 결정 2026-10-26)

토픽을 다시 계산하려면 보통 master_db.json 을 재빌드해야 하는데 그건 모든
스크래퍼의 현재 상태에 의존한다. 이 레포에는 그 위험이 기록돼 있다 — 옛 사본이
커밋을 되돌린 사고, blind copy 가 신규분을 롤백한 사고. 게다가
build_master_db.py 가 web/ 과 web-cf/ 두 벌이고 **둘 다 web/data/ 에 쓰는데**
덴탈 사이트가 읽는 건 web-cf/data/master_db.json 이다(현재 10-16자).

그래서 data/clinic-reviews.json 과 같은 패턴을 쓴다: 빌드 타임에 fs 로만 읽히고
copy-db-assets.mjs 가 Worker 자산으로 복사하지 않으므로 런타임 비용 0, 자산
크기 변화 0.

## 무엇을 싣고 무엇을 안 싣는가

**토픽은 교체하고 더하지 않는다.** TopicCluster 가 개수를 `×12` 로 표시하는데,
영어 코퍼스는 같은 리뷰의 구글 번역본이다. 더하면 같은 문장을 두 번 센다.
태국어 원문이 번역본보다 원본에 가까우므로 있는 곳은 교체한다.

**인용문은 3개까지만.** 2026-10-22 에 8개 전문 → 3개 발췌로 줄인 결정을 그대로
따른다. 구글 지도에 그대로 있는 글을 많이 싣는 것은 고유 콘텐츠가 아니라 복제
콘텐츠이고, 이 사이트는 바로 그 이유로 8/18 에 강등됐다. 태국어 원문의 가치는
글자수가 아니라 /th 페이지가 영어 리뷰 대신 **태국 사람이 쓴 문장**을 인용하는
것이다 (태국어가 1.9~3.1위에서 클릭 62%를 번다).

**자리는 그 클리닉의 실제 별점 분포대로 나눈다.** 수집 표본에서 5성이 압도적
(87곳 1,881건 중 63/72 표본)이라 길이순으로 고르면 불만 리뷰를, ★4 게이트를
걸면 칭찬만 과대표집한다. build_clinic_reviews.py 의 pick() 을 그대로 쓴다 —
같은 규칙을 두 번 쓰면 두 벌이 갈라진다.

사용법:
    python web-cf/scripts/build_clinic_thai.py [--dry-run] [--max-quotes 3]
"""
from __future__ import annotations

import argparse
import csv
import importlib.util
import json
import re
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB_CF = ROOT / "web-cf"
MASTER = WEB_CF / "data" / "master_db.json"
THAI_DIR = ROOT / "dental_output" / "reviews_th"
MAPPING = ROOT / "apify_inputs" / "dental_thai_reviews" / "chij_to_clinic.json"
OUT = WEB_CF / "data" / "clinic-thai.json"

csv.field_size_limit(min(sys.maxsize, 2**31 - 1))

THAI_RE = re.compile(r"[฀-๿]")
MIN_QUOTE_CHARS = 60  # 태국어 리뷰 중앙값이 65자다. 영어용 80자를 쓰면 절반이 빠진다.


def _load(path: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


# 인용문 선택(별점 분포 배분 + 평점 앵커)과 토픽 가드를 재구현하지 않는다.
_sel = _load(WEB_CF / "scripts" / "build_clinic_reviews.py", "clinic_reviews_sel")
_bmd = _load(ROOT / "web" / "scripts" / "build_master_db.py", "bmd_canonical")


def read_thai(path: Path) -> tuple[list[dict], dict[int, int]]:
    """(인용 후보, 전체 별점 분포).

    분포는 본문 길이와 무관하게 전체 행에서 센다 — 후보에서 재면 불만 리뷰가
    길어서 1성이 과대표집된다 (build_clinic_reviews.star_counts 와 같은 이유).
    """
    rows: list[dict] = []
    dist: dict[int, int] = {}
    with path.open(encoding="utf-8-sig", newline="") as fh:
        for r in csv.DictReader(fh):
            try:
                rating = int(float(r.get("rating") or 0))
            except (TypeError, ValueError):
                rating = 0
            if 1 <= rating <= 5:
                dist[rating] = dist.get(rating, 0) + 1
            text = _sel.clean_quote((r.get("text") or "").strip())
            # 태국어 글자가 없는 행은 영어 리뷰다. /th 페이지에 실을 이유가 없고,
            # 영어 페이지는 이미 자기 소스를 갖고 있다.
            if len(text) < MIN_QUOTE_CHARS or not THAI_RE.search(text):
                continue
            if rating < 1:
                continue
            rows.append({"text": text, "rating": rating, "author": ""})
    return rows, dist


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-quotes", type=int, default=3)
    args = ap.parse_args()

    if not THAI_DIR.is_dir():
        print(f"없음: {THAI_DIR}")
        return 2

    mapping = json.load(MAPPING.open(encoding="utf-8"))
    db = json.loads(MASTER.read_text(encoding="utf-8"))
    # 조인은 place_id 로, 출력 키는 id 로. master_db 는 둘을 모두 들고 있는데
    # 구분자가 다르다 — id 는 '0x..._0x...', place_id 는 '0x...:0x...' — 그리고
    # 페이지가 리뷰를 찾을 때 쓰는 건 id 다(clinic-reviews.json 과 같은 키).
    by_place = {str(c.get("place_id") or ""): c for c in db["clinics"]}

    files = sorted(THAI_DIR.glob("*.csv"))
    print(f"태국어 CSV {len(files)}개")

    out: dict[str, dict] = {}
    unmapped = no_quotes = not_in_db = skewed = 0
    quote_chars: list[int] = []
    topic_replaced = 0
    expensive_before = expensive_after = 0

    for f in files:
        chij = f.stem
        info = mapping.get(chij)
        if not info:
            unmapped += 1
            continue
        pid = info.get("place_id") or ""
        clinic = by_place.get(pid)
        if not clinic:
            # master_db 에 없는 곳은 페이지가 없으므로 실을 자리도 없다.
            not_in_db += 1
            continue

        rows, dist = read_thai(f)
        all_text = " ".join(r["text"] for r in rows)

        # 토픽 — 가드된 추출기로. 영어 코퍼스 토픽과 더하지 않고 교체한다.
        topics = _bmd.extract_mentioned_topics(all_text) if all_text else []

        rating = clinic.get("rating") or None
        quotes = _sel.pick(rows, args.max_quotes, dist, rating)

        # 고를 것이 없었던 경우에만 인용을 버린다.
        #
        # 후보가 자리 수 이하면 pick() 은 분포 배분도 앵커도 하지 않고 있는 것을
        # 그대로 돌려준다. 태국어 리뷰 5건 중 60자를 넘는 게 3건이고 둘이 1성이면,
        # 구글 평점 3.5 인 클리닉이 인용 평균 2.33 으로 보인다 — 실측된 사례다.
        # _anchor 는 최소 3개를 남기므로 이 경우 바꿀 수가 없다.
        #
        # 반대로 **선택이 실제로 일어난 경우에는 허용치를 걸지 않는다.** 처음에는
        # 모든 클리닉에 걸었는데 그게 ★4 게이트와 같은 짓이 됐다: 평점 4.8 에
        # 자리가 3개면 1성 하나만 들어가도 평균이 3.67 이라 무조건 탈락해서, 인용이
        # 100% 5성이 되고 코퍼스의 1성 5% 가 전멸했다. 치우침을 고치려다 반대로
        # 치우친 것이다 — 이 레포에 양쪽 다 기록돼 있다.
        if quotes and rating and len(rows) <= args.max_quotes:
            mean = sum(q["rating"] for q in quotes) / len(quotes)
            if abs(mean - rating) > _sel.TOLERANCE:
                # 토픽은 싣는다 — 전체 코퍼스 집계라 표본 치우침에 흔들리지 않는다.
                # 리뷰를 고르는 것만 포기하고 지어내지는 않는다.
                skewed += 1
                quotes = []

        if not quotes and not topics:
            no_quotes += 1
            continue

        entry: dict = {"n": sum(dist.values())}
        if quotes:
            # author 는 안 싣는다 — 2026-10-22 에 페이지에서 뺐다.
            entry["quotes"] = [{"text": q["text"], "rating": q["rating"]} for q in quotes]
            quote_chars.append(sum(len(q["text"]) for q in quotes))
        if topics:
            entry["topics"] = topics
            topic_replaced += 1
            old = {t["topic"]: t["count"] for t in (clinic.get("mentioned_topics") or [])}
            if "expensive" in old:
                expensive_before += 1
            if any(t["topic"] == "expensive" for t in topics):
                expensive_after += 1
        out[str(clinic["id"])] = entry

    print()
    print(f"  매핑에 없는 CSV        {unmapped}")
    print(f"  master_db 에 없는 곳   {not_in_db}")
    print(f"  인용·토픽 둘 다 없음   {no_quotes}")
    print(f"  인용 치우쳐서 버림     {skewed}  (토픽은 유지)")
    print(f"  수록                   {len(out)}")
    if quote_chars:
        print(f"  인용 글자수 중앙값     {int(statistics.median(quote_chars))} "
              f"(클리닉 {len(quote_chars)}곳, 최대 {max(quote_chars)})")
    print(f"  토픽 교체              {topic_replaced}곳")
    print(f"    그 중 expensive 보유  영어기준 {expensive_before} → 태국어기준 {expensive_after}")

    if args.dry_run:
        print("\n--dry-run, 아무것도 안 썼다")
        return 0

    payload = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text(payload, encoding="utf-8")
    kb = len(payload.encode("utf-8")) / 1024
    print(f"\nwrote {OUT.relative_to(ROOT)} ({kb:.0f} KB, {len(out)} clinics)")
    print("  Worker 자산으로 복사하지 않는다 — 클리닉 페이지는 프리렌더되므로")
    print("  빌드 타임에 fs 로만 읽힌다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
