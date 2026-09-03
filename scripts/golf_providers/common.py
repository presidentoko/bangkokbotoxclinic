"""Shared helpers for the golf booking-provider scrapers.

Every number written by these scrapers must come from the provider page.
There are no defaults, multipliers or fallbacks for prices — a field the
page does not state is written as null.
"""
from __future__ import annotations

import os
import re
import time
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
WEB_GOLF = REPO_ROOT / "web-golf"
PROVIDERS_DIR = WEB_GOLF / "data" / "providers"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

# Raw HTML cache. Default lives in the scratchpad so re-parsing needs no
# re-fetch; override with GOLF_PROVIDER_CACHE (GitHub Actions leaves it unset
# and gets a throwaway dir under the runner's temp).
_DEFAULT_CACHE = Path(os.environ.get("GOLF_PROVIDER_CACHE") or (
    Path(os.environ.get("TEMP") or os.environ.get("TMPDIR") or "/tmp")
    / "claude" / "C--Users-yn-Desktop-Work-0-main-deliverable-deliverable-helath-check"
    / "800f9cc6-32f4-4a3f-b1b8-20acbc897bc1" / "scratchpad" / "golf" / "cache"
))


def cache_dir(provider: str) -> Path:
    d = _DEFAULT_CACHE / provider
    d.mkdir(parents=True, exist_ok=True)
    return d


def fetch(url: str, *, cache_file: Path | None = None, refresh: bool = False,
          retries: int = 3, min_interval: float = 1.0, _state={"last": 0.0}) -> str | None:
    """Polite GET: ≤1 req/s, retries with backoff, optional on-disk cache."""
    if cache_file and cache_file.exists() and not refresh and cache_file.stat().st_size > 5000:
        return cache_file.read_text(encoding="utf-8", errors="ignore")
    for attempt in range(retries):
        wait = min_interval - (time.time() - _state["last"])
        if wait > 0:
            time.sleep(wait)
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            _state["last"] = time.time()
            if r.status_code == 404:
                print(f"  404 {url}")
                return None
            r.raise_for_status()
            text = r.text
            if cache_file:
                cache_file.write_text(text, encoding="utf-8")
            return text
        except Exception as e:  # noqa: BLE001
            _state["last"] = time.time()
            print(f"  retry {attempt + 1}/{retries} {url}: {e}")
            time.sleep(2 * (attempt + 1))
    return None


def to_int(s: str | None) -> int | None:
    """'5,500' / '5500.00' / '7,015 yards' -> 5500 / 7015. Anything else -> None."""
    if s is None:
        return None
    m = re.search(r"\d[\d,]*(?:\.\d+)?", str(s))
    if not m:
        return None
    try:
        v = int(float(m.group().replace(",", "")))
    except ValueError:
        return None
    return v


def to_float(s: str | None) -> float | None:
    if s is None:
        return None
    try:
        return float(str(s).strip())
    except ValueError:
        return None


def strip_tags(s: str) -> str:
    import html as _html
    s = re.sub(r"<script.*?</script>|<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<br\s*/?>|</p>|</li>|</div>|</tr>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = _html.unescape(s)
    return s


def utc_now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
