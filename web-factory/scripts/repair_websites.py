"""죽은 website URL 을 지우기 전에 자동 수리를 먼저 시도한다.

왜: "링크가 죽었다 → 필드를 지운다" 는 손해가 크다. 실제로 많은 경우
회사 사이트는 멀쩡한데 딥링크(제품 페이지·구 URL)만 죽었거나, www 유무 /
http-https 만 어긋나 있다. 그런 건 지울 게 아니라 고쳐야 바이어가 공급사에
닿는다. 그리고 구글 프로필 website 필드에 리뷰 텍스트·주소·이모지가 섞여
들어온 오염 URL 도 잘라내면 살아난다.

후보 URL 을 순서대로 시도해서 처음 OK 가 나오는 것을 채택하고,
전부 실패하면 그때 제거 대상으로 확정한다.

입력: data/website_check.json + data/website_recheck.json (둘 다 실패한 것만)
출력: data/website_corrections.json
        replace  {구 URL: 새 URL}   — 수리 성공
        remove   {URL: {verdict}}   — 수리 실패, 필드 제거 (확정)
        watch    {URL: {verdict}}   — 판단 보류. 다음 실행에서 또 실패하면 remove
                                      로 승격. 일시 장애로 살아있는 링크를 지우는
                                      쪽이 죽은 링크를 남기는 쪽보다 손해가 크다.

사용:
  python web-factory/scripts/repair_websites.py
"""
from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse, urlunparse, unquote

from check_websites import check_one

ROOT = Path(__file__).resolve().parents[1]
CHECK = ROOT / "data" / "website_check.json"
RECHECK = ROOT / "data" / "website_recheck.json"
OUT = ROOT / "data" / "website_corrections.json"

# 재검조차 없는(=재검 대상이 아니었던) 확정 실패 판정.
HARD_DEAD = {"DNS_FAIL"}

# 수리 실패 시 바로 제거해도 되는 판정 — 되돌릴 여지가 없는 부재.
REMOVE_ON_FAIL = {"DNS_FAIL", "HTTP_404", "PARKED", "PLATFORM_HTTP_404"}

# 여러 회사가 공유하는 플랫폼 도메인. 여기서는 "루트로 폴백" 이 무의미하다 —
# shop.line.me/@jaenice88 이 죽었다고 shop.line.me 를 그 공급사 홈페이지라고
# 보여주면 바이어를 엉뚱한 곳으로 보낸다. 회사 고유 서브도메인
# (unicorp.yellowpages.co.th) 은 예외로 살린다.
PLATFORM_HOSTS = ("line.me", "facebook.com", "instagram.com", "shopee.",
                  "lazada.", "tiktok.com", "wixsite.com", "blogspot.com",
                  "weebly.com", "business.site", "wordpress.com", "linktr.ee",
                  "alibaba.com", "made-in-china.com", "taobao.")
GENERIC_SUBS = {"shop", "www", "m", "web", "line", "facebook", "instagram",
                "shopee", "lazada", "th", "store", "sites", "profile"}


def is_useless_root(url: str) -> bool:
    """공용 플랫폼의 루트라 공급사를 특정하지 못하는 URL 인가."""
    p = urlparse(url)
    if p.path not in ("", "/") or p.query:
        return False
    host = p.netloc.lower()
    if not any(t in host for t in PLATFORM_HOSTS):
        return False
    sub = host.replace("www.", "").split(".")[0]
    return sub in GENERIC_SUBS
# 그 외(타임아웃·접속거부 등)는 watch 로 보류한다. 서버가 잠깐 죽은 것과
# 영영 죽은 것을 두 번의 검사로는 구분할 수 없다.


def candidates(url: str) -> list[str]:
    """수리 후보를 좋은 것부터. 원본은 이미 실패했으니 넣지 않는다."""
    out: list[str] = []
    try:
        p = urlparse(url)
    except Exception:
        return out
    host = p.netloc.split(":")[0]
    if not host:
        return out

    # 1) 두 URL 이 콤마/공백으로 붙어 들어온 경우 — 앞의 것만.
    dec = unquote(url)
    second = [m.start() for m in re.finditer(r"https?://", dec)][1:]
    if second:
        first = dec[: second[0]].rstrip(", \t")
        if first != url:
            out.append(first)

    # 2) 경로에 공백/%20 뒤로 리뷰·주소 텍스트가 붙은 경우 — 공백 앞에서 자른다.
    m = re.search(r"(%20|\s)", url[len(f"{p.scheme}://{p.netloc}"):])
    if m:
        cut = url[: len(f"{p.scheme}://{p.netloc}") + m.start()]
        if cut != url and cut not in out:
            out.append(cut)

    # 3) 도메인 루트 — 딥링크만 죽은 흔한 경우.
    for scheme in (p.scheme, "https" if p.scheme == "http" else "http"):
        root = urlunparse((scheme, p.netloc, "/", "", "", ""))
        if root != url and root not in out:
            out.append(root)

    # 4) www 유무 스왑 (DNS 가 한쪽에만 걸린 경우).
    alt_host = host[4:] if host.startswith("www.") else f"www.{host}"
    for scheme in ("https", "http"):
        alt = urlunparse((scheme, alt_host, "/", "", "", ""))
        if alt not in out:
            out.append(alt)
    return out


def repair(entry: dict) -> dict:
    url = entry["url"]
    for cand in candidates(url):
        if is_useless_root(cand):
            continue
        res = check_one(cand)
        if res["verdict"] == "OK":
            # 루트로 갔더니 완전히 다른 회사/파킹이면 채택하지 않는다 —
            # check_one 이 PARKED 를 잡지만 리다이렉트로 튄 것도 거른다.
            if res.get("redirected_offsite"):
                continue
            return {"url": url, "action": "replace", "new_url": cand,
                    "verdict": entry["verdict"]}
    return {"url": url, "action": "remove", "verdict": entry["verdict"],
            "supplier_ids": entry.get("supplier_ids", [])}


def main():
    check = json.loads(CHECK.read_text(encoding="utf-8"))
    by_url = {x["url"]: x for x in check["results"]}

    dead: list[dict] = [x for x in check["results"] if x["verdict"] in HARD_DEAD]

    if RECHECK.exists():
        re_ = json.loads(RECHECK.read_text(encoding="utf-8"))
        for x in re_["results"]:
            # 재검에서도 실패 = 확정. 플랫폼 로그인벽(PLATFORM_*)은 제외 —
            # facebook 400 은 봇 차단이지 페이지 부재가 아니다.
            if x["verdict"] != "OK" and not x["verdict"].startswith("PLATFORM_"):
                # 403(봇차단)·5xx(일시 장애)는 두 번 실패해도 지우지 않는다.
                # 사람 브라우저에선 열리는 경우가 대부분이라 오탐 위험이 크다.
                if x["verdict"] == "HTTP_ERR" and x.get("status") in (403, 401, 429,
                                                                     500, 502, 503):
                    continue
                if x["verdict"] == "SSL_ERR":
                    continue  # 열리긴 함 — 별도 리포트로만
                e = dict(by_url.get(x["url"], x))
                e["verdict"] = x["verdict"]
                dead.append(e)
    else:
        print("WARN: website_recheck.json 없음 — DNS_FAIL 만 처리")

    seen, uniq = set(), []
    for e in dead:
        if e["url"] not in seen:
            seen.add(e["url"])
            uniq.append(e)
    print(f"repair candidates: {len(uniq)}", flush=True)

    results = []
    done = 0
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [ex.submit(repair, e) for e in uniq]
        for fut in as_completed(futs):
            results.append(fut.result())
            done += 1
            if done % 25 == 0:
                print(f"  {done}/{len(uniq)}", flush=True)

    # 이전 실행의 watch 목록을 읽어, 이번에도 실패하면 remove 로 승격한다.
    prev_watch = {}
    if OUT.exists():
        prev_watch = json.loads(OUT.read_text(encoding="utf-8")).get("watch", {})

    replace = {r["url"]: r["new_url"] for r in results if r["action"] == "replace"}
    remove, watch = {}, {}
    for r in results:
        if r["action"] != "remove":
            continue
        v = r["verdict"]
        entry = {"verdict": v, "confirmed": time.strftime("%Y-%m-%d")}
        if v in REMOVE_ON_FAIL:
            remove[r["url"]] = entry
        elif r["url"] in prev_watch:
            # 3번째 실패 (1·2차 검사 + 이전 실행의 watch) — 이제 확정한다.
            entry["was_watched_since"] = prev_watch[r["url"]].get("confirmed")
            remove[r["url"]] = entry
        else:
            watch[r["url"]] = entry

    print(f"\nrepaired: {len(replace)}   remove: {len(remove)}   watch: {len(watch)}")

    OUT.write_text(json.dumps({
        "generated_at": time.strftime("%Y-%m-%d %H:%M"),
        "note": ("check_websites.py + recheck_websites.py 로 2회 확인해 두 번 다 "
                 "실패한 URL. rebuild_master_db.py 의 finalize() 가 매 리빌드마다 "
                 "적용한다 — master_db 를 직접 고치면 apify 머지의 PRESERVE_IF_EMPTY "
                 "때문에 다음 리빌드에서 되살아난다. "
                 "watch 는 아직 제거하지 않는다 — 다음 실행에서 또 실패하면 승격."),
        "replace": replace,
        "remove": remove,
        "watch": watch,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
