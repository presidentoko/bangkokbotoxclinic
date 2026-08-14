"""라이브 페이지의 JSON-LD 블록을 @type 별로 크기 분해."""
from __future__ import annotations

import gzip
import json
import re
import sys
import urllib.request

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0"
LD_RE = re.compile(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.S)


def get(url: str, retries: int = 6) -> str:
    """503 재시도 — dental 은 Worker CPU 한계(error 1102)로 단일 요청도 자주 503 난다."""
    import time
    last = None
    for i in range(retries):
        req = urllib.request.Request(
            url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                raw = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
                return raw.decode("utf-8", errors="ignore")
        except Exception as e:
            last = e
            print(f"  (재시도 {i+1}/{retries}: {type(e).__name__})")
            time.sleep(4)
    raise last  # type: ignore[misc]


def label(obj) -> str:
    if isinstance(obj, list):
        return "+".join(label(o) for o in obj[:3])
    if isinstance(obj, dict):
        t = obj.get("@type", "?")
        if isinstance(t, list):
            t = "/".join(map(str, t))
        n = 0
        for k in ("itemListElement", "mainEntity", "review", "hasPart"):
            v = obj.get(k)
            if isinstance(v, list):
                n = max(n, len(v))
        return f"{t}({n})" if n else str(t)
    return "?"


def main() -> int:
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.bangkokbestclinic.com/th"
    html = get(url)
    blocks = LD_RE.findall(html)
    total = sum(len(b) for b in blocks)
    print(f"{url}\n  JSON-LD 블록 {len(blocks)}개 · 합계 {total/1024:.1f}KB\n")
    rows = []
    for b in blocks:
        try:
            obj = json.loads(b)
            rows.append((len(b), label(obj)))
        except Exception:
            rows.append((len(b), "(파싱실패)"))
    for size, lab in sorted(rows, reverse=True):
        print(f"  {size/1024:7.1f}KB  {lab}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
