"""Lighthouse / PageSpeed Insights baseline measurement.

Hits Google PageSpeed Insights API for production URLs.
Outputs Performance / Accessibility / SEO / Best-Practices scores +
Core Web Vitals (LCP, FCP, CLS, TBT). Saves JSON baseline.

PSI API is free but rate-limited:
  - anonymous: ~25 calls / 100s (often hit 429 quickly)
  - with API key: 25,000 calls / day

To get API key (recommended):
  1. https://console.cloud.google.com → new project
  2. APIs & Services → Library → enable "PageSpeed Insights API"
  3. APIs & Services → Credentials → Create Credentials → API key
  4. export PSI_KEY=AIza...

Usage:
    PSI_KEY=AIza... python scripts/measure_lighthouse.py
    # 또는 key 없이 (rate limit 위험):
    python scripts/measure_lighthouse.py
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API_KEY = os.environ.get("PSI_KEY", "")
DELAY_SEC = 8 if not API_KEY else 1  # anonymous: 8s 사이, key 있으면 1s

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "lighthouse_baseline.json"

URLS = [
    "https://www.bangkokbotoxclinic.com",
    "https://www.bangkokbotoxclinic.com/c/botox",
    "https://snsstopper.com",
]


def measure(url: str) -> dict:
    """PSI API 호출 → score + vitals dict 반환. 실패 시 error 키."""
    api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = [
        ("url", url),
        ("strategy", "mobile"),
        ("category", "performance"),
        ("category", "accessibility"),
        ("category", "seo"),
        ("category", "best-practices"),
    ]
    if API_KEY:
        params.append(("key", API_KEY))
    qs = urllib.parse.urlencode(params)
    full = f"{api}?{qs}"
    # 1회 retry on 429
    for attempt in range(2):
        try:
            with urllib.request.urlopen(full, timeout=90) as r:
                data = json.loads(r.read())
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt == 0:
                print(f"  (429 rate-limited, sleep 30s...)")
                time.sleep(30)
                continue
            return {"url": url, "error": f"HTTP {e.code}: {e.reason}"}
        except Exception as e:
            return {"url": url, "error": str(e)[:200]}
    else:
        return {"url": url, "error": "rate limit retries exhausted"}

    lr = data.get("lighthouseResult") or {}
    cats = lr.get("categories") or {}
    auds = lr.get("audits") or {}

    def score(cat: str) -> int:
        c = cats.get(cat) or {}
        s = c.get("score")
        return round(s * 100) if isinstance(s, (int, float)) else 0

    def vital(audit_id: str) -> str:
        a = auds.get(audit_id) or {}
        return a.get("displayValue") or "n/a"

    return {
        "url": url,
        "measured_at": datetime.now(timezone.utc).isoformat(),
        "scores": {
            "performance": score("performance"),
            "accessibility": score("accessibility"),
            "seo": score("seo"),
            "best_practices": score("best-practices"),
        },
        "vitals": {
            "lcp": vital("largest-contentful-paint"),
            "fcp": vital("first-contentful-paint"),
            "cls": vital("cumulative-layout-shift"),
            "tbt": vital("total-blocking-time"),
        },
    }


def main() -> int:
    if not API_KEY:
        print("(no PSI_KEY env — anonymous mode, slow due to rate limits. See script header for API key setup.)")
    results = []
    for i, url in enumerate(URLS):
        if i > 0:
            time.sleep(DELAY_SEC)
        print(f"\n[Measuring] {url}")
        r = measure(url)
        results.append(r)
        if "error" in r:
            print(f"  X error: {r['error']}")
            continue
        s = r["scores"]
        v = r["vitals"]
        print(f"  Performance: {s['performance']:>3}  Accessibility: {s['accessibility']:>3}  "
              f"SEO: {s['seo']:>3}  Best Practices: {s['best_practices']:>3}")
        print(f"  LCP: {v['lcp']:<8}  FCP: {v['fcp']:<8}  CLS: {v['cls']:<6}  TBT: {v['tbt']}")

    OUT.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nsaved -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
