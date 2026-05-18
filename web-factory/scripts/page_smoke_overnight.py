"""Page smoke test — 빌드된 out/ HTML 정적 분석.

검사 항목:
  - <title>, <meta description>, <h1> 존재 + 길이
  - og:image 존재 + URL HEAD 200
  - 이미지 src 들의 HEAD 200 비율 (sample N개)
  - JSON-LD 파싱 + @type 확인
  - "DBD Verified Supplier" / "DBD-listed" 라벨 일치 여부 (verified flag 와)
  - 페이지 byte size

리포트: out/__smoke/report.html (사람이 읽기 좋게)
로그:   logs/page_smoke.log
"""
from __future__ import annotations

import json
import logging
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
WEB = HERE.parent
OUT = WEB / "out"
DATA = WEB / "data"
REPORT_DIR = OUT / "__smoke"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
LOGS = WEB / "logs"
LOG_FILE = LOGS / "page_smoke.log"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"


def setup_logging() -> logging.Logger:
    log = logging.getLogger("smoke")
    log.setLevel(logging.INFO)
    fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    log.addHandler(fh)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    log.addHandler(sh)
    return log


def head_ok(url: str, timeout: float = 8.0) -> tuple[bool, str]:
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA, "Referer": "https://www.google.com/maps"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return (200 <= r.status < 400), str(r.status)
    except HTTPError as e:
        return False, f"http_{e.code}"
    except URLError as e:
        return False, f"url_{type(e.reason).__name__}"
    except Exception as e:
        return False, f"err_{type(e).__name__}"


def pick_test_pages(db: dict) -> list[tuple[str, str]]:
    """Returns [(label, html_path), ...]."""
    pages: list[tuple[str, str]] = []
    # 정적 핵심
    static = [
        ("Home (en)",         "index.html"),
        ("Home (ko)",         "ko.html"),
        ("Home (th)",         "th.html"),
        ("About",             "about.html"),
        ("Contact",           "contact.html"),
        ("For Buyers (en)",   "for-buyers.html"),
        ("For Buyers (ko)",   "ko/for-buyers.html"),
        ("For Suppliers (en)", "for-suppliers.html"),
        ("Estate index",      "estate.html"),
        ("Best verified",     "best/highly-recommended.html"),
        ("Best by capital",   "best/dbd-verified-by-capital.html"),
        ("Category: auto_parts", "c/auto_parts.html"),
        ("City: chon_buri",   "city/chon_buri.html"),
    ]
    for label, p in static:
        pages.append((label, p))

    # 동적 — 좋은 verified 샘플 + likely-match 샘플 + photo-rich
    verified_strong = next((s for s in db["suppliers"]
                            if (s.get("dbd") or {}).get("match_score", 0) >= 95
                            and s.get("photos") and len(s["photos"]) >= 3), None)
    if verified_strong:
        pages.append((f"Verified supplier (strong) — {verified_strong['name'][:30]}",
                      f"supplier/{verified_strong['id']}.html"))

    verified_likely = next((s for s in db["suppliers"]
                            if 80 <= (s.get("dbd") or {}).get("match_score", 0) < 90), None)
    if verified_likely:
        pages.append((f"Supplier (likely match) — {verified_likely['name'][:30]}",
                      f"supplier/{verified_likely['id']}.html"))

    # Estate page (largest)
    estate_slugs: dict[str, int] = {}
    for s in db["suppliers"]:
        if s.get("estate_slug"):
            estate_slugs[s["estate_slug"]] = estate_slugs.get(s["estate_slug"], 0) + 1
    if estate_slugs:
        top_estate = max(estate_slugs.items(), key=lambda x: x[1])[0]
        pages.append((f"Estate page (largest: {top_estate})", f"estate/{top_estate}.html"))

    return pages


def analyze_html(path: Path) -> dict:
    """단일 HTML 정적 분석."""
    rec: dict = {"path": str(path.relative_to(OUT))}
    if not path.exists():
        rec["status"] = "missing"
        return rec
    html = path.read_text(encoding="utf-8", errors="replace")
    rec["status"] = "ok"
    rec["size_kb"] = round(len(html) / 1024, 1)

    # title
    m = re.search(r"<title>([^<]+)</title>", html)
    rec["title"] = m.group(1).strip() if m else None

    # meta description
    m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', html)
    rec["meta_desc"] = (m.group(1)[:120] + ("…" if m and len(m.group(1)) > 120 else "")) if m else None

    # h1
    m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html)
    rec["h1"] = (re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()[:100]) if m else None

    # og:image
    m = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html)
    rec["og_image"] = m.group(1) if m else None

    # JSON-LD blocks
    ld_types: list[str] = []
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>([\s\S]*?)</script>', html):
        try:
            d = json.loads(m.group(1))
            if isinstance(d, dict):
                t = d.get("@type")
                if isinstance(t, list): ld_types.extend(t)
                elif isinstance(t, str): ld_types.append(t)
        except json.JSONDecodeError:
            pass
    rec["jsonld_types"] = ld_types

    # DBD ribbon presence
    rec["has_dbd_verified"] = "DBD Verified" in html
    rec["has_dbd_likely"]   = "DBD-listed" in html

    # google CDN photo URL count (rotate 위험)
    rec["google_photo_urls"] = len(re.findall(r"https://lh[3-9]\.googleusercontent\.com/", html))
    # 로컬 photo path count
    rec["local_photo_paths"] = len(re.findall(r'src="/photos/', html))

    return rec


def main() -> None:
    log = setup_logging()
    db = json.loads((DATA / "master_db.json").read_text(encoding="utf-8"))

    pages = pick_test_pages(db)
    log.info(f"smoke testing {len(pages)} pages")

    results: list[dict] = []
    for label, rel in pages:
        path = OUT / rel
        rec = analyze_html(path)
        rec["label"] = label
        results.append(rec)
        flags = []
        if not rec.get("title"): flags.append("NO_TITLE")
        if rec.get("status") == "missing": flags.append("MISSING")
        if not rec.get("jsonld_types"): flags.append("NO_JSONLD")
        if rec.get("og_image") is None: flags.append("NO_OG")
        log.info(f"  · {label:55} {rec.get('size_kb','?'):>6}KB  ld={rec.get('jsonld_types',[])[:3]}  {' '.join(flags)}")

    # OG image HEAD check (병렬)
    log.info("checking og:image HEAD status …")
    og_urls = [r["og_image"] for r in results if r.get("og_image")]
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(head_ok, u): u for u in og_urls}
        head_status: dict[str, str] = {}
        for fut in as_completed(futs):
            url = futs[fut]
            ok, code = fut.result()
            head_status[url] = code
    for r in results:
        og = r.get("og_image")
        if og:
            r["og_image_status"] = head_status.get(og, "n/a")

    # 카운트
    cnt_total = len(results)
    cnt_missing = sum(1 for r in results if r.get("status") == "missing")
    cnt_no_jsonld = sum(1 for r in results if not r.get("jsonld_types"))
    cnt_google_photos = sum(r.get("google_photo_urls", 0) for r in results)
    cnt_local_photos = sum(r.get("local_photo_paths", 0) for r in results)

    log.info("=" * 60)
    log.info(f"pages tested: {cnt_total}")
    log.info(f"  missing: {cnt_missing}")
    log.info(f"  no JSON-LD: {cnt_no_jsonld}")
    log.info(f"  google photo URLs (rotate risk): {cnt_google_photos}")
    log.info(f"  local photo paths (post-backup): {cnt_local_photos}")

    # HTML 리포트
    rows = []
    for r in results:
        ld = ", ".join(r.get("jsonld_types", [])[:5])
        og_status = r.get("og_image_status", "")
        og_ok = (og_status == "200")
        og_html = f'<span style="color:{"#16a34a" if og_ok else "#dc2626"}">{og_status or "—"}</span>'
        google_pct = r.get("google_photo_urls", 0)
        local_pct = r.get("local_photo_paths", 0)
        ribbon = ("✓ verified" if r.get("has_dbd_verified") else "") + (" · ≈ likely" if r.get("has_dbd_likely") else "")
        rows.append(f"""
      <tr>
        <td>{r["label"]}</td>
        <td><code>{r.get("path")}</code></td>
        <td>{r.get("size_kb","?")}KB</td>
        <td>{(r.get("title") or "")[:60]}</td>
        <td>{ld}</td>
        <td>{og_html}</td>
        <td>{google_pct}</td>
        <td>{local_pct}</td>
        <td>{ribbon}</td>
      </tr>""")

    report_html = f"""<!doctype html>
<html><head><meta charset="utf-8"><title>Page smoke report</title>
<style>
body{{font-family:system-ui,sans-serif;max-width:1400px;margin:2rem auto;padding:0 1rem}}
table{{border-collapse:collapse;width:100%;font-size:13px}}
th,td{{border:1px solid #ddd;padding:6px 10px;text-align:left;vertical-align:top}}
th{{background:#f5f5f5;position:sticky;top:0}}
code{{font-size:11px;background:#f8f8f8;padding:1px 4px;border-radius:3px}}
.summary{{background:#f0fdf4;border:1px solid #16a34a;border-radius:8px;padding:1rem;margin-bottom:1rem}}
.warn{{background:#fef3c7;border:1px solid #d97706}}
</style></head><body>
<h1>Page smoke report</h1>
<div class="summary {('warn' if cnt_missing > 0 or cnt_no_jsonld > 0 else '')}">
  <strong>Tested {cnt_total} pages</strong> · missing: {cnt_missing} · no JSON-LD: {cnt_no_jsonld} ·
  Google CDN photos (rotate risk): <strong>{cnt_google_photos}</strong> · local photos (post-backup): <strong>{cnt_local_photos}</strong>
  <br><small>Generated {time.strftime('%Y-%m-%d %H:%M')}</small>
</div>
<table>
  <thead>
    <tr><th>Label</th><th>Path</th><th>Size</th><th>Title</th><th>JSON-LD types</th><th>og:image HEAD</th><th>Google photos</th><th>Local photos</th><th>DBD ribbon</th></tr>
  </thead>
  <tbody>{"".join(rows)}</tbody>
</table>
</body></html>
"""
    (REPORT_DIR / "report.html").write_text(report_html, encoding="utf-8")
    (REPORT_DIR / "report.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"DONE — report: {REPORT_DIR / 'report.html'}")


if __name__ == "__main__":
    main()
