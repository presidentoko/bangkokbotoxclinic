"""1차 검사에서 실패한 URL 만 더 참을성 있게 재검한다.

왜 2단계인가: 1차(check_websites.py)는 3,595 개를 40 스레드로 훑기 때문에
타임아웃·순간 5xx 로 멀쩡한 사이트가 실패로 찍힌다. 그 오탐을 그대로 제거하면
살아있는 공급사 링크를 지우게 된다. 그래서 실패군만 뽑아 동시성을 낮추고
타임아웃을 늘려 다시 확인하고, **두 번 다 실패한 것만** 제거 후보로 올린다.

DNS_FAIL 은 재검하지 않는다 — 도메인 부재는 일시적이지 않다.

사용:
  python web-factory/scripts/recheck_websites.py
결과:
  web-factory/data/website_recheck.json
"""
from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from check_websites import check_one  # 판정 로직은 한 곳에만 둔다

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "website_check.json"
OUT = ROOT / "data" / "website_recheck.json"

RETRY_VERDICTS = {"HTTP_404", "HTTP_ERR", "CONN_FAIL", "PARKED", "CHECK_ERROR",
                  "SSL_ERR", "PLATFORM_HTTP_404", "PLATFORM_CONN_FAIL"}


def main():
    first = json.loads(SRC.read_text(encoding="utf-8"))
    targets = [x for x in first["results"] if x["verdict"] in RETRY_VERDICTS]
    print(f"rechecking {len(targets)} URLs (slower, 8 workers)", flush=True)

    out = []
    done = 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(check_one, x["url"]): x for x in targets}
        for fut in as_completed(futs):
            prev = futs[fut]
            try:
                res = fut.result()
            except Exception as e:
                res = {"url": prev["url"], "verdict": "CHECK_ERROR", "error": repr(e)[:200]}
            res["first_verdict"] = prev["verdict"]
            res["supplier_ids"] = prev["supplier_ids"]
            out.append(res)
            done += 1
            if done % 50 == 0:
                print(f"  {done}/{len(targets)}", flush=True)

    from collections import Counter
    # 두 번 다 실패 = 확정. 재검에서 OK = 1차가 오탐이었음.
    recovered = [x for x in out if x["verdict"] == "OK"]
    confirmed = [x for x in out if x["verdict"] != "OK"]
    print(f"\nrecovered (1st was false positive): {len(recovered)}")
    print(f"confirmed still failing: {len(confirmed)}")
    print("confirmed breakdown:", dict(Counter(x["verdict"] for x in confirmed).most_common()))

    OUT.write_text(json.dumps(
        {"checked_at": time.strftime("%Y-%m-%d %H:%M"),
         "recovered": len(recovered), "confirmed": len(confirmed),
         "results": out}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {OUT}", flush=True)


if __name__ == "__main__":
    main()
