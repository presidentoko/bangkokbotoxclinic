"""IndexNow protocol ping — Bing/Yandex/Naver instant indexing.

When new content is pushed, ping IndexNow with the URLs that changed.
Search engines that subscribe to IndexNow (Bing, Yandex, Naver) will fetch
the URL faster than waiting for next crawl.

Usage:
    # Ping clinic site homepage + sitemap
    python scripts/indexnow_ping.py clinic
    # Ping restaurant site
    python scripts/indexnow_ping.py restaurants
    # Both
    python scripts/indexnow_ping.py both
    # 사이트 전역이 실제로 바뀐 날 — 사이트맵 전체를 제출
    python scripts/indexnow_ping.py golf --full

Auto: hook into auto_push_loop.py after a successful push so every data
update triggers an IndexNow ping.

API: POST https://api.indexnow.org/indexnow
Body: { host, key, keyLocation, urlList }
- key: 8-128 char hex (verification file at https://<host>/<key>.txt must serve key text)
- urlList: max 10,000 URLs per request (we send a few prioritized)
"""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime

SITES = {
    "clinic": {
        "host": "www.bangkokbotoxclinic.com",
        "key": "f52836b80b1348e996c2357e82ff8e5b",
        "key_location": "https://www.bangkokbotoxclinic.com/f52836b80b1348e996c2357e82ff8e5b.txt",
        "urls": [
            "https://www.bangkokbotoxclinic.com/",
            "https://www.bangkokbotoxclinic.com/sitemap.xml",
            "https://www.bangkokbotoxclinic.com/c/botox",
            "https://www.bangkokbotoxclinic.com/c/filler",
            "https://www.bangkokbotoxclinic.com/c/hifu",
            "https://www.bangkokbotoxclinic.com/c/facial",
            "https://www.bangkokbotoxclinic.com/c/laser",
            "https://www.bangkokbotoxclinic.com/c/dental",
            "https://www.bangkokbotoxclinic.com/guide/trust-score-explained",
            "https://www.bangkokbotoxclinic.com/guide/verifying-clinic-before-booking",
        ],
    },
    "restaurants": {
        "host": "snsstopper.com",
        "key": "5188f7f54e254b7ead74e46621b6f829",
        "key_location": "https://snsstopper.com/5188f7f54e254b7ead74e46621b6f829.txt",
        "urls": [
            "https://snsstopper.com/",
            "https://snsstopper.com/sitemap.xml",
            "https://snsstopper.com/c/thai",
            "https://snsstopper.com/c/japanese",
            "https://snsstopper.com/c/italian",
            "https://snsstopper.com/c/korean",
            "https://snsstopper.com/c/cafe",
            "https://snsstopper.com/c/noodles",
        ],
    },
    # thailandgolfguide.com — 한국 골퍼가 주 타깃이라 Naver 즉시 색인이 특히 유효하다.
    # URL 목록은 2026-08-18 색인 재건에서 새로 생기거나 크게 바뀐 페이지 위주.
    "golf": {
        "host": "www.thailandgolfguide.com",
        "key": "c86f7edf50b24a9bb6599e09ca82cf68",
        "key_location": "https://www.thailandgolfguide.com/c86f7edf50b24a9bb6599e09ca82cf68.txt",
        "urls": [
            "https://www.thailandgolfguide.com/",
            "https://www.thailandgolfguide.com/sitemap.xml",
            # 목적지 별칭으로 되살아난 도시 페이지 (hua_hin 은 코스 1개 -> 24개)
            "https://www.thailandgolfguide.com/city/hua_hin",
            "https://www.thailandgolfguide.com/city/pattaya",
            "https://www.thailandgolfguide.com/city/koh_samui",
            "https://www.thailandgolfguide.com/city/bangkok",
            "https://www.thailandgolfguide.com/city/phuket",
            "https://www.thailandgolfguide.com/city/chiang_mai",
            # 새로 발행된 상업적 의도 페이지
            "https://www.thailandgolfguide.com/green-fees/bangkok",
            "https://www.thailandgolfguide.com/green-fees/chon_buri",
            "https://www.thailandgolfguide.com/green-fees/phuket",
            "https://www.thailandgolfguide.com/price-compare",
            "https://www.thailandgolfguide.com/c/course",
            "https://www.thailandgolfguide.com/ko",
        ],
    },
    # secondluxuryitems.com — GSC 기준 색인 1페이지 / 인지 URL 19개뿐인데
    # 사이트맵에는 468개가 있다. 구글이 아직 안 온 상태라 최소한 Bing/Yandex
    # 쪽이라도 허브부터 밀어넣는다. 전체 사이트맵 투척은 스팸 취급이라 안 함.
    "luxury2nd": {
        "host": "www.secondluxuryitems.com",
        "key": "cfa6e36624ce9ec9194f4829dbf961a3",
        "key_location": "https://www.secondluxuryitems.com/cfa6e36624ce9ec9194f4829dbf961a3.txt",
        "urls": [
            "https://www.secondluxuryitems.com/",
            "https://www.secondluxuryitems.com/sitemap.xml",
            "https://www.secondluxuryitems.com/handbags",
            "https://www.secondluxuryitems.com/watches",
            "https://www.secondluxuryitems.com/brands",
            "https://www.secondluxuryitems.com/guides",
            "https://www.secondluxuryitems.com/compare",
            "https://www.secondluxuryitems.com/value-guide",
            "https://www.secondluxuryitems.com/market-overview",
            # 브랜드 허브 — 여기서 모델 페이지 전부로 뻗어나간다
            "https://www.secondluxuryitems.com/chanel",
            "https://www.secondluxuryitems.com/rolex",
            "https://www.secondluxuryitems.com/louis-vuitton",
            "https://www.secondluxuryitems.com/hermes",
            "https://www.secondluxuryitems.com/dior",
            "https://www.secondluxuryitems.com/gucci",
        ],
    },
    # chicpreowned.com — 노출은 나오는데 순위가 25위권이라 페이지2~3에 갇혀 있다.
    # GSC 상위 쿼리(patek philippe / omega 태국 가격)가 실제로 착지하는 페이지를
    # 양 로케일로 밀어준다. apex -> www 리다이렉트가 붙은 직후라 재크롤도 필요.
    "chicpreowned": {
        "host": "www.chicpreowned.com",
        "key": "88a93f35a6ee072c944cf2327d46acb7",
        "key_location": "https://www.chicpreowned.com/88a93f35a6ee072c944cf2327d46acb7.txt",
        "urls": [
            "https://www.chicpreowned.com/en",
            "https://www.chicpreowned.com/th",
            "https://www.chicpreowned.com/sitemap.xml",
            "https://www.chicpreowned.com/en/brands",
            "https://www.chicpreowned.com/th/brands",
            "https://www.chicpreowned.com/en/watches",
            "https://www.chicpreowned.com/th/watches",
            "https://www.chicpreowned.com/en/handbags",
            "https://www.chicpreowned.com/th/handbags",
            # 노출 1~3위 쿼리 착지 페이지
            "https://www.chicpreowned.com/en/patek-philippe",
            "https://www.chicpreowned.com/th/patek-philippe",
            "https://www.chicpreowned.com/en/brands/patek-philippe",
            "https://www.chicpreowned.com/en/omega",
            "https://www.chicpreowned.com/th/omega",
            "https://www.chicpreowned.com/en/brands/omega",
            # 신규 섹션 — 판매자 인텐트("ขาย X ได้เท่าไหร่")와 출처 공개 페이지.
            # 태국 딜러는 전부 "รับซื้อ"만 광고하고 가격을 안 밝히므로 이 쿼리에는
            # 정보성 결과가 사실상 없다. 색인 우선 확보가 목적.
            "https://www.chicpreowned.com/th/sell",
            "https://www.chicpreowned.com/en/sell",
            "https://www.chicpreowned.com/th/dealers",
            "https://www.chicpreowned.com/en/dealers",
            "https://www.chicpreowned.com/th/sell/rolex",
            "https://www.chicpreowned.com/th/sell/chanel",
            "https://www.chicpreowned.com/th/sell/louis-vuitton",
            "https://www.chicpreowned.com/th/sell/hermes",
        ],
    },
}


def sitemap_urls(host: str) -> list[str]:
    """사이트맵의 URL 전체. 대규모 개편 직후 한 번 밀어넣을 때 쓴다."""
    req = urllib.request.Request(
        f"https://{host}/sitemap.xml",
        headers={"User-Agent": "indexnow-ping/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        xml = r.read().decode("utf-8", errors="replace")
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def ping(site_id: str, full: bool = False) -> int:
    cfg = SITES.get(site_id)
    if not cfg:
        print(f"unknown site: {site_id}")
        return 1

    urls = cfg["urls"]
    if full:
        # 평소에는 바뀐 몇 개만 보낸다 — 안 바뀐 URL 을 반복 제출하면 스팸으로 취급된다.
        # full 은 실제로 사이트 전역이 바뀐 날에만 쓴다. 2026-08-19 가 그런 날이었다:
        # 전 코스 페이지에 요약 문단이 새로 붙었고 리뷰/좌표/영업시간/가격이 갱신됐다.
        try:
            urls = sitemap_urls(cfg["host"])[:10000]  # 요청당 상한
            print(f"  sitemap 에서 {len(urls)} URL 수집")
        except Exception as e:
            print(f"  sitemap 읽기 실패, 기본 목록으로 진행: {e}")

    body = {
        "host": cfg["host"],
        "key": cfg["key"],
        "keyLocation": cfg["key_location"],
        "urlList": urls,
    }
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "indexnow-ping/1.0"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            code = r.status
            text = r.read().decode("utf-8", errors="replace")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {site_id}: HTTP {code} — pinged {len(urls)} URLs")
        if text.strip():
            print(f"  body: {text[:200]}")
        return 0
    except urllib.error.HTTPError as e:
        # 200=ok, 202=accepted, 400=bad req, 403=key not valid, 422=urls invalid, 429=too many
        text = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {site_id}: HTTP {e.code} — {e.reason}. body: {text[:200]}")
        return 1 if e.code >= 400 and e.code != 422 else 0
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {site_id}: error {e}")
        return 1


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    full = "--full" in sys.argv          # 사이트 전역이 바뀐 날에만
    target = args[0] if args else "both"
    if target == "both":
        return ping("clinic", full) | ping("restaurants", full)
    return ping(target, full)


if __name__ == "__main__":
    sys.exit(main())
