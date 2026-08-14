"""페이지 무게 해부 — RSC 플라이트 페이로드에서 뭐가 자리를 차지하는지 실측.

2026-08-13 측정: 3사이트 모두 HTML 의 64~65% 가 RSC 페이로드다. Worker 는 매 요청
이걸 만들어 스트리밍하고, 그게 Cloudflare error 1102(Worker resource limit)로 이어진다.

실행: python scripts/_perf_payload.py
"""
from __future__ import annotations

import collections
import gzip
import re
import urllib.request

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0"

TARGETS = [
    ("dental /th", "https://www.bangkokbestclinic.com/th"),
    ("dental /en", "https://www.bangkokbestclinic.com/en"),
    ("botox /", "https://www.bangkokbotoxclinic.com/"),
    ("facial /en", "https://www.thaifacialclinic.com/en/"),
]

FLIGHT_RE = re.compile(r"self\.__next_f\.push\((.*?)\)</script>", re.S)
CLINIC_HREF_RE = re.compile(r'href="((?:/[a-z]{2})?/clinic/[^"]+)"')
CARD_KEY_RE = re.compile(r'\\"trust_score\\"')
# 플라이트 안의 className 값 (이스케이프된 따옴표 사이)
CLASSNAME_RE = re.compile(r'\\"className\\":\\"([^\\]{0,600})')
LD_RE = re.compile(r'application/ld\+json[^>]*>(.*?)</script>', re.S)


def get(url: str) -> str:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=45) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return raw.decode("utf-8", errors="ignore")


def main() -> int:
    print(f"{'페이지':14} {'HTML':>8} {'플라이트':>9} {'className':>11} "
          f"{'JSONLD':>8} {'클리닉링크':>9} {'카드':>5}")
    print("-" * 74)
    for name, url in TARGETS:
        try:
            html = get(url)
        except Exception as e:
            print(f"{name:14} ERR {type(e).__name__}")
            continue
        flight = "".join(FLIGHT_RE.findall(html))
        cns = CLASSNAME_RE.findall(flight)
        cn_bytes = sum(len(c) for c in cns)
        ld = sum(len(m) for m in LD_RE.findall(html))
        links = len(set(CLINIC_HREF_RE.findall(html)))
        cards = len(CARD_KEY_RE.findall(flight))
        print(f"{name:14} {len(html)//1024:6}KB {len(flight)//1024:7}KB "
              f"{cn_bytes//1024:6}KB×{len(cns):<4} {ld//1024:5}KB "
              f"{links:8} {cards:5}")

    # 가장 무거운 페이지 하나를 깊이 판다
    html = get(TARGETS[0][1])
    flight = "".join(FLIGHT_RE.findall(html))
    print(f"\n=== {TARGETS[0][0]} 플라이트 {len(flight)//1024}KB 내역 ===")
    cns = CLASSNAME_RE.findall(flight)
    top = collections.Counter(cns).most_common(8)
    print("  반복되는 className 상위 8 (같은 문자열이 몇 번이나 직렬화되는가)")
    for c, n in top:
        print(f"    {n:5}회 × {len(c):4}자 = {n*len(c)//1024:4}KB  {c[:70]}")
    dup = sum(n * len(c) for c, n in collections.Counter(cns).items() if n > 1)
    print(f"  → 2회 이상 반복되는 className 총합 {dup//1024}KB "
          f"(플라이트의 {dup*100//max(1,len(flight))}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
