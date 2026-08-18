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

Auto: hook into auto_push_loop.py after a successful push so every data
update triggers an IndexNow ping.

API: POST https://api.indexnow.org/indexnow
Body: { host, key, keyLocation, urlList }
- key: 8-128 char hex (verification file at https://<host>/<key>.txt must serve key text)
- urlList: max 10,000 URLs per request (we send a few prioritized)
"""
from __future__ import annotations

import json
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
}


def ping(site_id: str) -> int:
    cfg = SITES.get(site_id)
    if not cfg:
        print(f"unknown site: {site_id}")
        return 1

    body = {
        "host": cfg["host"],
        "key": cfg["key"],
        "keyLocation": cfg["key_location"],
        "urlList": cfg["urls"],
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
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {site_id}: HTTP {code} — pinged {len(cfg['urls'])} URLs")
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
    target = sys.argv[1] if len(sys.argv) > 1 else "both"
    if target == "both":
        rc = ping("clinic") | ping("restaurants")
        return rc
    return ping(target)


if __name__ == "__main__":
    sys.exit(main())
