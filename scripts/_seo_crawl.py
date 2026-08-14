"""3사이트 사이트맵 전수 크롤 — 404 / 5xx / 리다이렉트 / soft-404 를 **실측**한다.

GSC 가 보고한 404 5,625건·5xx 692건이 어디인지 추측하지 않고 직접 센다.
사이트맵에 있는 URL 이 404 라면 그건 우리가 구글에게 죽은 URL 을 먹이고 있다는 뜻이다.

실행: python scripts/_seo_crawl.py <site> [동시요청수] [표본상한]
  site: dental | facial | botox | all
결과: docs/reports/seo-crawl-<site>-<날짜>.csv  +  요약을 stdout 으로
"""
from __future__ import annotations

import csv
import re
import sys
import time
import urllib.request
import urllib.error
import gzip
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "reports"

SITES = {
    "dental": "https://www.bangkokbestclinic.com",
    "facial": "https://www.thaifacialclinic.com",
    "botox": "https://www.bangkokbotoxclinic.com",
}
UA = ("Mozilla/5.0 (compatible; SEOAudit/1.0; +internal) "
      "AppleWebKit/537.36 Chrome/122.0 Safari/537.36")


def fetch(url: str, timeout: float = 30.0) -> tuple[int, bytes, str]:
    """(status, body, final_url). 리다이렉트는 따라간다."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            if r.headers.get("Content-Encoding") == "gzip" or url.endswith(".gz"):
                try:
                    body = gzip.decompress(body)
                except Exception:
                    pass
            return r.status, body, r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, b"", url
    except Exception:
        return 0, b"", url


def sitemap_urls(root: str) -> list[str]:
    """sitemap-index 또는 sitemap.xml 을 재귀적으로 펼쳐 모든 <loc> 를 모은다."""
    seen: set[str] = set()
    out: list[str] = []
    queue = [f"{root}/sitemap-index.xml", f"{root}/sitemap.xml"]
    while queue:
        sm = queue.pop(0)
        if sm in seen:
            continue
        seen.add(sm)
        st, body, _ = fetch(sm)
        if st != 200 or not body:
            continue
        text = body.decode("utf-8", errors="ignore")
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", text)
        if "<sitemapindex" in text:
            queue.extend(locs)
        else:
            out.extend(locs)
    return list(dict.fromkeys(out))


SOFT404_RE = re.compile(
    r"(page not found|404|not found|존재하지 않|ไม่พบ)", re.I)


def check(url: str) -> dict:
    st, body, final = fetch(url, timeout=25.0)
    row = {"url": url, "status": st, "final": final,
           "redirected": int(final.rstrip("/") != url.rstrip("/")),
           "soft404": 0, "title": "", "bytes": len(body)}
    if st == 200 and body:
        head = body[:20000].decode("utf-8", errors="ignore")
        m = re.search(r"<title[^>]*>(.*?)</title>", head, re.S | re.I)
        if m:
            row["title"] = " ".join(m.group(1).split())[:90]
        # soft 404: 200 인데 제목이 404 를 말한다
        if row["title"] and SOFT404_RE.search(row["title"]):
            row["soft404"] = 1
    return row


def run(site: str, workers: int, cap: int) -> None:
    root = SITES[site]
    print(f"\n=== {site} ({root}) ===")
    urls = sitemap_urls(root)
    print(f"  사이트맵 URL {len(urls)}개")
    if not urls:
        print("  사이트맵을 못 읽음 — 중단")
        return
    if cap and len(urls) > cap:
        step = len(urls) / cap
        urls = [urls[int(i * step)] for i in range(cap)]
        print(f"  균등 표본 {len(urls)}개로 축소")

    rows: list[dict] = []
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=workers) as ex:
        for i, r in enumerate(ex.map(check, urls), 1):
            rows.append(r)
            if i % 200 == 0:
                print(f"  … {i}/{len(urls)}  ({time.time()-t0:.0f}s)")

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"seo-crawl-{site}-2026-08-13.csv"
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    n = len(rows)
    c404 = [r for r in rows if r["status"] == 404]
    c5xx = [r for r in rows if 500 <= r["status"] < 600]
    cerr = [r for r in rows if r["status"] == 0]
    cred = [r for r in rows if r["redirected"] and r["status"] == 200]
    csoft = [r for r in rows if r["soft404"]]
    print(f"  ── 결과 {n}건 ({time.time()-t0:.0f}s) → {path.name}")
    print(f"     200 정상 {n-len(c404)-len(c5xx)-len(cerr)}")
    print(f"     404      {len(c404)}")
    print(f"     5xx      {len(c5xx)}")
    print(f"     연결실패  {len(cerr)}")
    print(f"     리다이렉트 {len(cred)}  ← 사이트맵이 최종 URL 이 아님")
    print(f"     soft404  {len(csoft)}")
    for label, group in (("404", c404), ("5xx", c5xx), ("리다이렉트", cred)):
        for r in group[:5]:
            print(f"       [{label}] {r['url'][:100]}")


def main() -> int:
    site = sys.argv[1] if len(sys.argv) > 1 else "all"
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    cap = int(sys.argv[3]) if len(sys.argv) > 3 else 1500
    targets = list(SITES) if site == "all" else [site]
    for s in targets:
        run(s, workers, cap)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
