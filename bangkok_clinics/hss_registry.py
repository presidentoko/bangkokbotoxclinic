"""Thailand's register of licensed private healthcare facilities (สถานพยาบาลเอกชน).

Every private clinic in Thailand operates under a licence issued by the
Department of Health Service Support (กรมสนับสนุนบริการสุขภาพ, สบส.) under the
Sanatorium Act B.E. 2541. The department runs a public lookup at

    https://hosp.hss.moph.go.th/

which answers with the registered name, the address, the operating licence
number, and — unlike most registers — the date the licence runs to.

That last field is the point. A directory built from Google Maps can repeat a
clinic's rating and opening hours; it cannot say whether the place is licensed
and until when. For a dental clinic, where an unlicensed operator is a real and
widely-reported hazard, that is the fact a patient actually wants.

The lookup is an XHR endpoint (`POST /key-searchs`) that requires the session
cookie and the per-page token, and returns rendered HTML cards, so this holds a
session, reads the token, and parses the cards. One request at a time with a
pause between them: this is a small government service and the whole run is a
few thousand requests.

Results are cached per clinic id, so the run is resumable and a second pass only
fetches what is missing.

Usage:
    python -m bangkok_clinics.hss_registry              # all dental clinics
    python -m bangkok_clinics.hss_registry --limit 20   # smoke test
"""

from __future__ import annotations

import argparse
import html
import http.cookiejar
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUT_RAW = Path(__file__).resolve().parent / "output" / "hss_registry_raw.json"

BASE = "https://hosp.hss.moph.go.th"
PAUSE_SECONDS = 0.8

# The dental site's own filter (web/lib/site.ts DENTAL_PRIMARY_TYPES).
DENTAL_TYPES = {
    "Dental clinic", "Dentist", "Orthodontist", "Pediatric dentist",
    "Dental school", "Dental implants periodontist", "Dental hygienist",
    "Oral surgeon",
}

THAI = re.compile(r"[฀-๿][฀-๿0-9\s./-]*")
# Words that appear in thousands of registered names and make a search useless.
TOO_GENERIC = {"คลินิก", "ทันตกรรม", "คลินิกทันตกรรม", "ศูนย์ทันตกรรม", "สาขา"}


def thai_query(name: str) -> str | None:
    """The longest Thai run in a clinic's name, as the search key."""
    runs = [m.group(0).strip(" ./-") for m in THAI.finditer(name or "")]
    runs = [r for r in runs if len(r) >= 4]
    if not runs:
        return None
    q = max(runs, key=len)
    q = re.sub(r"\s+", " ", q).strip()
    return None if q in TOO_GENERIC else q[:60]


class Registry:
    def __init__(self) -> None:
        self.cj = http.cookiejar.CookieJar()
        self.op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cj))
        self.op.addheaders = [
            ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                           "(KHTML, like Gecko) Chrome/128.0 Safari/537.36"),
            ("X-Requested-With", "XMLHttpRequest"),
            ("Origin", BASE),
            ("Referer", BASE + "/"),
            ("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
        ]
        self.token = ""
        self.refresh()

    def refresh(self) -> None:
        """New session cookie and page token; the POST is rejected without both."""
        page = self.op.open(BASE + "/", timeout=60).read().decode("utf-8", "replace")
        m = re.search(r'id="token" value="([^"]+)"', page)
        if not m:
            raise RuntimeError("token not found on the lookup page")
        self.token = m.group(1)

    def search(self, keyword: str) -> list[dict]:
        data = urllib.parse.urlencode(
            {"keyword": keyword, "type": "name", "token": self.token}
        ).encode()
        raw = self.op.open(BASE + "/key-searchs", data=data, timeout=60).read().decode("utf-8", "replace")
        res = json.loads(raw)
        if res.get("code") != 200:
            return []
        return [card for card in (parse_card(c) for c in res.get("data") or []) if card]


def parse_card(card_html: str) -> dict | None:
    """Label/value pairs out of one rendered result card."""
    parts = [html.unescape(x).strip() for x in re.findall(r'text1-\d+">([^<]*)</span>', card_html)]
    fields: dict[str, str] = {}
    for i in range(0, len(parts) - 1, 2):
        fields[parts[i].rstrip(" :")] = parts[i + 1]
    name = fields.get("ชื่อสถานพยาบาล")
    if not name:
        return None
    return {
        "name": re.sub(r"\s+", " ", name),
        "address": re.sub(r"\s+", " ", fields.get("สถานที่ตั้ง", "")),
        "license_no": fields.get("เลขที่ใบอนุญาตประกอบกิจการ", ""),
        "valid_until": fields.get("ใช้ได้ถึงวันที่", ""),
    }


def dental_clinics() -> list[dict]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db["clinics"] if isinstance(db, dict) and "clinics" in db else db
    return [c for c in clinics if c.get("primary_type") in DENTAL_TYPES]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--retry-empty", action="store_true",
                    help="query again for clinics whose last search returned nothing")
    args = ap.parse_args()

    cache: dict[str, dict] = {}
    if OUT_RAW.exists():
        cache = json.loads(OUT_RAW.read_text(encoding="utf-8"))

    targets = []
    for c in dental_clinics():
        q = thai_query(c.get("name") or "")
        if not q:
            continue
        hit = cache.get(c["id"])
        if hit and (hit.get("rows") or not args.retry_empty):
            continue
        targets.append((c["id"], q))
    if args.limit:
        targets = targets[: args.limit]

    print(f"{len(targets)} clinics to query (cache holds {len(cache)})")
    reg = Registry()
    done = 0
    try:
        for cid, q in targets:
            for attempt in (1, 2):
                try:
                    rows = reg.search(q)
                    break
                except Exception as e:  # expired token or a blip: re-handshake once
                    if attempt == 2:
                        print(f"  ! {q}: {e}", file=sys.stderr)
                        rows = []
                    else:
                        time.sleep(3)
                        reg.refresh()
            cache[cid] = {"query": q, "rows": rows}
            done += 1
            if done % 25 == 0:
                OUT_RAW.parent.mkdir(parents=True, exist_ok=True)
                OUT_RAW.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
                found = sum(1 for v in cache.values() if v.get("rows"))
                print(f"  {done}/{len(targets)} queried · {found} with at least one result")
            time.sleep(PAUSE_SECONDS)
    finally:
        OUT_RAW.parent.mkdir(parents=True, exist_ok=True)
        OUT_RAW.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
        found = sum(1 for v in cache.values() if v.get("rows"))
        print(f"cached {len(cache)} queries, {found} with results -> {OUT_RAW}")


if __name__ == "__main__":
    main()
