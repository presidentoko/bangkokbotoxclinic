"""3사이트 SEO/AEO 전면 감사 — 사이트맵 전체 크롤 + 페이지 레벨 검증.

표본이 아니라 **전수**다. 페이지마다 뽑는 것:
  status / 리다이렉트 / title / meta description / canonical / robots meta /
  hreflang 수 / h1 수 / og:image / JSON-LD @type / 본문 단어수 / 내부링크

집계:
  중복 title·description, 길이 문제, canonical 불일치, 사이트맵 내 noindex,
  스키마 없는 페이지, thin 페이지, 고아 페이지(내부링크 0), 깨진 내부링크,
  llms.txt/robots/OG 실존, TTFB

dental 은 Workers Free CPU 한계로 동시요청에 503 을 뱉으므로 동시 3 + 재시도로
살살 긁는다 (2026-08-13 실측: 동시 8 에서 2.4% 503).

실행: python scripts/_seo_full_audit.py <site|all>
결과: docs/reports/audit-<site>-2026-08-14.json / .csv
"""
from __future__ import annotations

import csv
import gzip
import html as html_mod
import json
import re
import sys
import time
import urllib.request
import urllib.error
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "reports"
DATE = "2026-08-14"

SITES = {
    "dental": {"base": "https://www.bangkokbestclinic.com", "workers": 3, "retry503": 3},
    "botox": {"base": "https://www.bangkokbotoxclinic.com", "workers": 8, "retry503": 1},
    "facial": {"base": "https://www.thaifacialclinic.com", "workers": 8, "retry503": 1},
}
UA = ("Mozilla/5.0 (compatible; SEOAudit/2.0; internal) "
      "AppleWebKit/537.36 Chrome/122.0 Safari/537.36")

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.S | re.I)
DESC_RE = re.compile(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', re.S | re.I)
DESC_RE2 = re.compile(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']', re.S | re.I)
CANON_RE = re.compile(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', re.I)
CANON_RE2 = re.compile(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', re.I)
ROBOTS_RE = re.compile(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']', re.I)
HREFLANG_RE = re.compile(r'<link[^>]+hreflang', re.I)
H1_RE = re.compile(r"<h1[\s>]", re.I)
OG_IMG_RE = re.compile(r'<meta[^>]+property=["\']og:image["\']', re.I)
LD_RE = re.compile(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)
A_RE = re.compile(r'<a[^>]+href=["\']([^"\'#?]+)[^"\']*["\']', re.I)
TAG_RE = re.compile(r"<script.*?</script>|<style.*?</style>|<[^>]+>", re.S)
SPACE_RE = re.compile(r"\s+")


def fetch(url: str, retry503: int = 1, timeout: float = 35.0):
    """(status, html, final_url, ttfb). 503 은 재시도."""
    last_st = 0
    for i in range(retry503 + 1):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                ttfb = time.time() - t0
                raw = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
                return r.status, raw.decode("utf-8", "ignore"), r.geturl(), ttfb
        except urllib.error.HTTPError as e:
            last_st = e.code
            if e.code == 503 and i < retry503:
                time.sleep(3.0)
                continue
            return e.code, "", url, time.time() - t0
        except Exception:
            return 0, "", url, time.time() - t0
    return last_st, "", url, 0.0


def sitemap_urls(base: str, retry503: int) -> list[str]:
    seen, out = set(), []
    queue = [f"{base}/sitemap-index.xml", f"{base}/sitemap.xml"]
    while queue:
        sm = queue.pop(0)
        if sm in seen:
            continue
        seen.add(sm)
        st, body, _, _ = fetch(sm, retry503)
        if st != 200 or not body:
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)
        if "<sitemapindex" in body:
            queue.extend(locs)
        else:
            out.extend(locs)
    return list(dict.fromkeys(out))


def ld_types(block: str):
    try:
        obj = json.loads(block)
    except Exception:
        return ["(파싱실패)"]
    objs = obj if isinstance(obj, list) else [obj]
    out = []
    for o in objs:
        if isinstance(o, dict):
            t = o.get("@type", "?")
            out.append("/".join(t) if isinstance(t, list) else str(t))
    return out


def analyze(url: str, retry503: int, host: str) -> dict:
    st, html, final, ttfb = fetch(url, retry503)
    row = {"url": url, "status": st, "final": final, "ttfb": round(ttfb, 2),
           "redirected": int(final.split("#")[0].rstrip("/") != url.rstrip("/")),
           "title": "", "title_len": 0, "desc": "", "desc_len": 0,
           "canonical": "", "canon_mismatch": 0, "noindex": 0,
           "hreflang_n": 0, "h1_n": 0, "og_image": 0,
           "ld_types": "", "words": 0, "internal_links": ""}
    if st != 200 or not html:
        return row
    m = TITLE_RE.search(html)
    if m:
        row["title"] = SPACE_RE.sub(" ", html_mod.unescape(m.group(1))).strip()[:200]
        row["title_len"] = len(row["title"])
    m = DESC_RE.search(html) or DESC_RE2.search(html)
    if m:
        row["desc"] = SPACE_RE.sub(" ", html_mod.unescape(m.group(1))).strip()[:400]
        row["desc_len"] = len(row["desc"])
    m = CANON_RE.search(html) or CANON_RE2.search(html)
    if m:
        row["canonical"] = m.group(1).strip()
        cu = row["canonical"].rstrip("/")
        row["canon_mismatch"] = int(cu != url.rstrip("/") and cu != final.split("#")[0].rstrip("/"))
    m = ROBOTS_RE.search(html)
    if m and "noindex" in m.group(1).lower():
        row["noindex"] = 1
    row["hreflang_n"] = len(HREFLANG_RE.findall(html))
    row["h1_n"] = len(H1_RE.findall(html))
    row["og_image"] = int(bool(OG_IMG_RE.search(html)))
    types = []
    for b in LD_RE.findall(html):
        types.extend(ld_types(b))
    row["ld_types"] = "|".join(sorted(set(types)))[:200]
    text = SPACE_RE.sub(" ", TAG_RE.sub(" ", html))
    row["words"] = len(text.split())
    links = set()
    for href in A_RE.findall(html):
        if href.startswith("/") and not href.startswith("//"):
            links.add(href.rstrip("/") or "/")
        elif host in href:
            p = urlparse(href).path.rstrip("/") or "/"
            links.add(p)
    # ⚠️ 통째로 자르지 말 것: [:8000] 으로 문자열을 자르면 경계에 걸린 링크가
    # 반토막 나서 존재하지 않는 '유령 URL' 이 생기고, 그게 깨진-링크 검사에서
    # 가짜 404 로 잡힌다 (2026-08-14 dental /clinic/0x…848d1b22 오탐이 이것).
    # 링크 단위로 누적하며 한도를 지킨다.
    acc: list[str] = []
    total = 0
    for l in sorted(links):
        if total + len(l) + 1 > 8000:
            break
        acc.append(l)
        total += len(l) + 1
    row["internal_links"] = "|".join(acc)
    return row


def run(site: str) -> None:
    cfg = SITES[site]
    base, host = cfg["base"], urlparse(cfg["base"]).netloc
    print(f"\n=== {site} ({base}) ===", flush=True)
    urls = sitemap_urls(base, cfg["retry503"])
    print(f"  사이트맵 {len(urls)} URL — 전수 크롤 시작 (동시 {cfg['workers']})", flush=True)
    t0 = time.time()
    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=cfg["workers"]) as ex:
        for i, r in enumerate(ex.map(lambda u: analyze(u, cfg["retry503"], host), urls), 1):
            rows.append(r)
            if i % 250 == 0:
                print(f"  … {i}/{len(urls)} ({time.time()-t0:.0f}s)", flush=True)
    print(f"  크롤 완료 {len(rows)}건 ({time.time()-t0:.0f}s)", flush=True)

    OUT.mkdir(parents=True, exist_ok=True)
    csv_path = OUT / f"audit-{site}-{DATE}.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    ok = [r for r in rows if r["status"] == 200]
    sitemap_paths = {urlparse(u).path.rstrip("/") or "/" for u in urls}

    # 내부링크 그래프 → 인바운드 0 = 고아
    inbound: Counter = Counter()
    all_out: set = set()
    for r in ok:
        src = urlparse(r["url"]).path.rstrip("/") or "/"
        for l in r["internal_links"].split("|"):
            if l and l != src:
                inbound[l] += 1
                all_out.add(l)
    orphans = [p for p in sitemap_paths if inbound[p] == 0]

    # 사이트맵 밖으로 나가는 내부링크 → 상태 점검 (상한 120)
    external_to_sitemap = sorted(l for l in all_out if l not in sitemap_paths)
    check = external_to_sitemap[:120]
    broken = []
    with ThreadPoolExecutor(max_workers=cfg["workers"]) as ex:
        for path, st in zip(check, ex.map(
                lambda p: fetch(base + p, cfg["retry503"])[0], check)):
            if st in (404, 410):
                broken.append((path, st))

    dup_titles = {t: c for t, c in Counter(r["title"] for r in ok if r["title"]).items() if c > 1}
    dup_descs = {d: c for d, c in Counter(r["desc"] for r in ok if r["desc"]).items() if c > 1}
    ld_cov = Counter()
    for r in ok:
        for t in (r["ld_types"].split("|") if r["ld_types"] else ["(없음)"]):
            ld_cov[t or "(없음)"] += 1

    summary = {
        "site": site, "base": base, "total_urls": len(urls),
        "status_dist": dict(Counter(r["status"] for r in rows)),
        "redirect_in_sitemap": sum(r["redirected"] for r in ok),
        "noindex_in_sitemap": sum(r["noindex"] for r in ok),
        "canon_mismatch": sum(r["canon_mismatch"] for r in ok),
        "missing_title": sum(1 for r in ok if not r["title"]),
        "missing_desc": sum(1 for r in ok if not r["desc"]),
        "missing_canonical": sum(1 for r in ok if not r["canonical"]),
        "missing_og_image": sum(1 for r in ok if not r["og_image"]),
        "no_h1": sum(1 for r in ok if r["h1_n"] == 0),
        "multi_h1": sum(1 for r in ok if r["h1_n"] > 1),
        "no_hreflang": sum(1 for r in ok if r["hreflang_n"] == 0),
        "no_jsonld": sum(1 for r in ok if not r["ld_types"]),
        "title_too_long": sum(1 for r in ok if r["title_len"] > 60),
        "desc_too_long": sum(1 for r in ok if r["desc_len"] > 165),
        "desc_too_short": sum(1 for r in ok if 0 < r["desc_len"] < 60),
        "thin_pages_lt300w": sum(1 for r in ok if r["words"] < 300),
        "dup_title_groups": len(dup_titles),
        "dup_title_pages": sum(dup_titles.values()),
        "dup_title_top": sorted(dup_titles.items(), key=lambda x: -x[1])[:8],
        "dup_desc_groups": len(dup_descs),
        "dup_desc_pages": sum(dup_descs.values()),
        "ld_coverage": dict(ld_cov.most_common(15)),
        "orphan_pages": len(orphans),
        "orphan_sample": sorted(orphans)[:15],
        "internal_links_offsitemap": len(external_to_sitemap),
        "broken_internal_links": broken[:30],
        "ttfb_p50": round(sorted(r["ttfb"] for r in ok)[len(ok)//2], 2) if ok else 0,
        "ttfb_p90": round(sorted(r["ttfb"] for r in ok)[int(len(ok)*0.9)], 2) if ok else 0,
    }

    # AEO 자산 실존
    for name, path in [("llms_txt", "/llms.txt"), ("llms_full", "/llms-full.txt"),
                       ("robots_txt", "/robots.txt"), ("og_root", "/opengraph-image")]:
        st, body, _, _ = fetch(base + path, cfg["retry503"])
        summary[f"asset_{name}"] = {"status": st, "bytes": len(body)}

    (OUT / f"audit-{site}-{DATE}.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  → audit-{site}-{DATE}.json / .csv 저장", flush=True)
    for k in ("status_dist", "noindex_in_sitemap", "canon_mismatch", "dup_title_pages",
              "thin_pages_lt300w", "orphan_pages", "broken_internal_links"):
        v = summary[k]
        print(f"    {k}: {v if not isinstance(v, list) else len(v)}", flush=True)


def main() -> int:
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    for s in (list(SITES) if target == "all" else [target]):
        run(s)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
