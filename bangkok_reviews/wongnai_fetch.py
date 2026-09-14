"""이미 website 필드에 Wongnai 링크가 있는 식당의 현지 평점을 받아온다.

목적은 수집이 아니라 검증이다. 이 사이트는 구글 하나만 보고 점수를 매기는데,
그건 검증이 아니라 재계산이다. 태국 현지 플랫폼이 같은 가게를 어떻게 보는지
붙여야 "외국인 평가와 현지인 평가가 갈린다"는 말을 할 수 있다.

Wongnai 상세 페이지는 서버 렌더링이고 JSON-LD 에 aggregateRating 과
telephone 이 들어 있다. telephone 이 있다는 게 중요하다 — 예전 조사에서
검색 결과 광고 슬롯 때문에 8개 식당 전부에 엉뚱한 평점이 붙을 뻔했다.
전화번호를 대조하면 그 사고가 구조적으로 불가능해진다.

발견(discovery)은 아직 못 푼다. sitemap 은 404, /_api 는 403, 검색 결과는
클라이언트 렌더라 링크가 안 나온다. 그래서 지금은 이미 링크를 가진 277곳만
받는다. 나머지 8,348곳은 Wongnai 공식 데이터 서비스를 보는 편이 맞다
(robots.txt 첫 줄이 그걸 안내한다).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

RATING = re.compile(r'"ratingValue"\s*:\s*([0-9.]+)')
RCOUNT = re.compile(r'"ratingCount"\s*:\s*([0-9]+)')
VCOUNT = re.compile(r'"reviewCount"\s*:\s*([0-9]+)')
PHONE = re.compile(r'"telephone"\s*:\s*"([^"]*)"')


def digits(s: str) -> str:
    d = re.sub(r"\D", "", s or "")
    # 태국 번호: +66 81 649 4890 → 66816494890, 사이트는 0816494890 로 쓴다.
    if d.startswith("66"):
        d = "0" + d[2:]
    return d


def phone_set(s: str) -> set[str]:
    """한 필드에 번호가 여러 개 들어온다.

    Wongnai 는 "telephone":"0816494890, 0943542462" 처럼 쉼표로 이어 쓴다.
    통째로 숫자만 뽑아 비교하면 08164948900943542462 가 되어 무조건 불일치가
    나온다 — 12곳 시험에서 6곳이 이 이유로 '다른 가게' 로 잘못 찍혔다.
    구분자로 쪼개고, 하나라도 겹치면 같은 가게로 본다.
    """
    out = set()
    for part in re.split(r"[,;/|]| or |\s{2,}", s or ""):
        d = digits(part)
        if len(d) >= 8:
            out.add(d)
    return out


def fetch(url: str, timeout: int = 25) -> tuple[str | None, str]:
    """(본문, 상태) 를 돌려준다.

    403 과 404 를 구분하는 게 중요하다. 처음 277곳을 1초 간격으로 돌렸을 때
    83곳에서 403 이 쏟아졌는데, 잠시 뒤 같은 URL 이 200 으로 돌아왔다 —
    영구 차단이 아니라 속도 제한이었다. 반면 404 는 구글에 등록된 Wongnai
    링크가 낡아 페이지가 사라진 것이라 몇 번을 다시 불러도 소용없다.
    둘을 뭉뚱그리면 살릴 수 있는 것까지 버리거나, 없는 걸 계속 두드린다.
    """
    from urllib.error import HTTPError
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": UA,
                                        "Accept-Language": "en-US,en;q=0.9"})
            with urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "replace"), "ok"
        except HTTPError as e:
            if e.code == 404:
                return None, "gone"
            if e.code in (403, 429):
                time.sleep(20 * (attempt + 1))  # 속도 제한 — 물러섰다 다시
                continue
            return None, f"http_{e.code}"
        except Exception:
            time.sleep(5)
    return None, "rate_limited"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path,
                    default=Path("../web-restaurants/data/master_db.json"))
    ap.add_argument("--out", type=Path, default=Path("wongnai/wongnai.json"))
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--delay", type=float, default=1.2)
    args = ap.parse_args()

    db = json.loads(args.db.read_text(encoding="utf-8"))["restaurants"]
    targets = [r for r in db if "wongnai.com/restaurants/" in (r.get("website") or "")]
    if args.limit:
        targets = targets[: args.limit]
    print(f"대상 {len(targets)}곳", flush=True)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    done = {}
    if args.out.exists():
        done = json.loads(args.out.read_text(encoding="utf-8"))

    ok = phone_ok = phone_bad = no_rating = failed = 0
    for i, r in enumerate(targets, 1):
        pid = r["place_id"]
        if pid in done:
            continue
        html, why = fetch(r["website"])
        if not html:
            failed += 1
            done[pid] = {"status": why}
        else:
            m = RATING.search(html)
            if not m:
                no_rating += 1
                done[pid] = {"status": "no_rating"}
            else:
                wp = phone_set((PHONE.search(html) or [None, ""])[1])
                gp = phone_set(r.get("phone") or "")
                # 양쪽에 번호가 있는데 겹치는 게 하나도 없으면 다른 가게다.
                match = "unknown" if not (wp and gp) else ("yes" if wp & gp else "no")
                if match == "no":
                    phone_bad += 1
                elif match == "yes":
                    phone_ok += 1
                done[pid] = {
                    "status": "ok",
                    "name": r["name"],
                    "wongnai_rating": float(m.group(1)),
                    "wongnai_rating_count": int((RCOUNT.search(html) or [0, 0])[1]),
                    "wongnai_review_count": int((VCOUNT.search(html) or [0, 0])[1]),
                    "google_rating": r.get("rating"),
                    "trust_score": r.get("trust_score"),
                    "phone_match": match,
                    "url": r["website"],
                }
                ok += 1
        if i % 25 == 0:
            args.out.write_text(json.dumps(done, ensure_ascii=False, indent=1),
                                encoding="utf-8")
            print(f"  {i}/{len(targets)} · 성공 {ok} · 전화일치 {phone_ok} "
                  f"· 불일치 {phone_bad} · 평점없음 {no_rating} · 실패 {failed}",
                  flush=True)
        time.sleep(args.delay)

    args.out.write_text(json.dumps(done, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n완료 · 성공 {ok} · 전화일치 {phone_ok} · 불일치 {phone_bad} "
          f"· 평점없음 {no_rating} · 실패 {failed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
