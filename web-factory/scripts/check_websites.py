"""공급사 website 필드 전수 링크 체크.

배경: 외부 제보(2026-09-01)로 suksunsteel.com / tdem.toyota-asia.com /
sumitomorubber.co.th (DNS 소멸), shop.line.me/@jaenice88 (404) 4건 확인.
Google 프로필에서 가져온 website 가 폐업/도메인 만료 후에도 리빌드에서
계속 살아남는 구조라 주기적 전수 검사가 필요하다.

사용:
  python web-factory/scripts/check_websites.py
결과:
  web-factory/data/website_check.json  (URL별 판정 — 리포트/정리 스크립트가 읽음)

판정 분류:
  DNS_FAIL   도메인 자체가 소멸 — 확실히 죽은 링크, 제거 대상
  CONN_FAIL  DNS 는 살아있으나 접속 불가(거부/타임아웃) — 재검 후 제거 후보
  HTTP_404   404/410 — 페이지 소멸 (facebook 은 로그인벽 오탐 있어 별도 취급)
  HTTP_ERR   기타 4xx/5xx
  SSL_ERR    인증서 문제 (verify=False 로는 열림 — 사용자 브라우저 경고)
  PARKED     도메인 판매/파킹 페이지 감지
  OK         정상 응답
  PLATFORM_* facebook/instagram 등 로그인벽 플랫폼 — 하드 실패만 신뢰
"""
from __future__ import annotations

import json
import socket
import ssl
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "master_db.json"
OUT = ROOT / "data" / "website_check.json"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
HEADERS = {"User-Agent": UA, "Accept-Language": "en,th;q=0.8"}

# 로그인벽/봇차단 때문에 페이지 존재 여부를 신뢰성 있게 판정 못 하는 도메인.
# DNS/접속 실패만 죽은 걸로 본다 (플랫폼 자체가 죽을 일은 없으니 사실상 항상 OK).
LOGIN_WALL = {"facebook.com", "instagram.com", "tiktok.com", "linkedin.com"}

# 파킹/판매 페이지 시그니처 (본문 앞부분 소문자 검색)
PARKED_SIGNS = [
    "sedoparking", "this domain is for sale", "buy this domain",
    "hugedomains", "domain has expired", "dan.com", "afternic",
    "parked free", "godaddy.com/domainsearch",
]


def registrable(host: str) -> str:
    parts = host.lower().lstrip("www.").split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else host.lower()


def check_one(url: str) -> dict:
    r: dict = {"url": url}
    try:
        p = urlparse(url)
        host = p.netloc.split(":")[0]
    except Exception:
        return {**r, "verdict": "BAD_URL"}
    if not host:
        return {**r, "verdict": "BAD_URL"}

    login_wall = registrable(host) in LOGIN_WALL

    # 1) DNS
    try:
        socket.getaddrinfo(host, None)
    except socket.gaierror:
        return {**r, "verdict": "DNS_FAIL"}

    # 2) HTTP GET (HEAD 거부하는 서버 많아 GET + 본문 32KB 만)
    def fetch(verify: bool):
        return requests.get(url, headers=HEADERS, timeout=(10, 15),
                            allow_redirects=True, stream=True, verify=verify)

    last_exc = None
    for attempt in range(2):
        try:
            resp = fetch(verify=True)
            break
        except requests.exceptions.SSLError:
            try:
                resp = fetch(verify=False)
                r["ssl_broken"] = True
                break
            except Exception as e:
                last_exc = e
        except requests.exceptions.RequestException as e:
            last_exc = e
        time.sleep(1)
    else:
        kind = "CONN_FAIL"
        return {**r, "verdict": ("PLATFORM_" + kind) if login_wall else kind,
                "error": type(last_exc).__name__}

    r["status"] = resp.status_code
    r["final_url"] = resp.url
    try:
        body = next(resp.iter_content(32768, decode_unicode=False), b"") or b""
        text = body.decode("utf-8", "ignore").lower()
    except Exception:
        text = ""
    finally:
        resp.close()

    final_host = urlparse(resp.url).netloc.split(":")[0]
    if registrable(final_host) != registrable(host):
        r["redirected_offsite"] = registrable(final_host)

    if resp.status_code in (404, 410):
        verdict = "HTTP_404"
    elif resp.status_code >= 400:
        verdict = "HTTP_ERR"
    elif any(sig in text for sig in PARKED_SIGNS):
        verdict = "PARKED"
    elif r.get("ssl_broken"):
        verdict = "SSL_ERR"
    else:
        verdict = "OK"
    if login_wall and verdict not in ("OK",):
        verdict = "PLATFORM_" + verdict
    r["verdict"] = verdict
    return r


def main():
    db = json.loads(DATA.read_text(encoding="utf-8"))
    url_to_ids: dict[str, list[str]] = {}
    for s in db["suppliers"]:
        w = (s.get("website") or "").strip()
        if w:
            url_to_ids.setdefault(w, []).append(s["id"])

    urls = list(url_to_ids)
    print(f"unique URLs: {len(urls)}  (suppliers with website: "
          f"{sum(len(v) for v in url_to_ids.values())})", flush=True)

    results = []
    done = 0
    with ThreadPoolExecutor(max_workers=40) as ex:
        futs = {ex.submit(check_one, u): u for u in urls}
        for fut in as_completed(futs):
            try:
                res = fut.result()
            except Exception as e:
                res = {"url": futs[fut], "verdict": "CHECK_ERROR",
                       "error": repr(e)[:200]}
            res["supplier_ids"] = url_to_ids[res["url"]]
            results.append(res)
            done += 1
            if done % 200 == 0:
                print(f"  {done}/{len(urls)}", flush=True)

    from collections import Counter
    counts = Counter(x["verdict"] for x in results)
    print("verdicts:", dict(counts.most_common()), flush=True)
    OUT.write_text(json.dumps(
        {"checked_at": time.strftime("%Y-%m-%d %H:%M"),
         "counts": dict(counts.most_common()), "results": results},
        ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {OUT}", flush=True)


if __name__ == "__main__":
    main()
