"""Thailand's official register of licensed animal clinics (สถานพยาบาลสัตว์).

Every animal clinic in Thailand needs a licence under the Animal Clinic Act
B.E. 2533, issued by the Department of Livestock Development. DLD's veterinary
service bureau publishes the full list, one Looker Studio report per livestock
region, at:

    https://vetservice.dld.go.th/index.php/th/sthan-phyabal-satw/khx-cad-tang-danein-kar-sthan-phyabal-satw

Each row carries province / district / sub-district, the clinic's registered
name, its licence class and the licence number:

    01  no overnight stay for sick animals        (outpatient clinic)
    02  overnight stay, up to ten places
    03  overnight stay, more than ten places      (what people call a hospital)
    04  no overnight stay, run by a second-class veterinary licensee
    ม4  government animal clinic                  (stored as "gov")

That is the one thing the Google Maps listing a directory page is built from
cannot say: whether the place is licensed at all, and whether it can keep an
animal overnight.

Looker Studio has no export for anonymous viewers, and its data RPC is gated on
a reCAPTCHA token minted by the page, so this drives the real report in a
headless browser, listens for the table's `batchedDataV2` responses and pages
through the table. Nothing is read off the rendered DOM.

The report also names the licensee and the operating veterinarian. Those stay
in the raw output (for matching and auditing) and are not written to the web
dataset: the site does not publish personal names.

Usage:
    python -m petvet.dld_registry               # all regions
    python -m petvet.dld_registry --only krung  # one region, for testing
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_RAW = Path(__file__).resolve().parent / "output" / "dld_registry_raw.json"
OUT_WEB = ROOT / "web-petbkk" / "data" / "vet-registry.json"

BASE = "https://vetservice.dld.go.th"
INDEX = BASE + "/index.php/th/sthan-phyabal-satw/khx-cad-tang-danein-kar-sthan-phyabal-satw"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128 Safari/537.36")

# Column order of the detail table (verified against the Bangkok report,
# 2026-09-16): province, district, sub-district, name, class, licence number,
# licensee, operator.
FIELDS = ["province", "district", "subdistrict", "name", "license_class",
          "license_no", "licensee", "operator"]

# The table pager sits below a 100-row table; in a normal-height viewport it is
# outside the report canvas and a click lands on nothing, so the page is opened
# very tall and the control is clicked directly.
NEXT_PAGE = ".pageForward:not(.disabled)"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def region_reports() -> list[tuple[str, str, str]]:
    """(slug, title, looker embed url) for every region article."""
    html = fetch(INDEX)
    arts = re.findall(
        r'<a href="(/index\.php/th/sthan-phyabal-satw/khx-cad-tang-danein-kar-sthan-phyabal-satw/[^"]+)">\s*([^<]+?)\s*</a>',
        html)
    out = []
    for href, title in arts:
        page = fetch(BASE + href)
        m = re.search(r'<iframe[^>]+src="(https://lookerstudio\.google\.com/embed/reporting/[^"]+)"', page)
        if not m:
            print(f"  ! no report embedded in {title}", file=sys.stderr)
            continue
        out.append((href.rsplit("/", 1)[-1], title.strip(), m.group(1)))
    return out


def _tables(body: str) -> list[dict]:
    data = json.loads(body[body.index("{"):])
    tables = []
    for resp in data.get("dataResponse", []):
        for sub in resp.get("dataSubset", []):
            t = sub.get("dataset", {}).get("tableDataset")
            if t:
                tables.append(t)
    return tables


def _rows(table: dict) -> list[list[str]]:
    cols = []
    for c in table.get("column", []):
        kind = next((k for k in c if k != "nullIndex"), None)
        vals = list(c[kind].get("values", [])) if kind else []
        # Nulls are left out of `values` and listed by position instead.
        for idx in sorted(c.get("nullIndex", [])):
            vals.insert(idx, "")
        cols.append(vals)
    return [list(r) for r in zip(*cols)] if cols else []


def _detail_rows(bodies: list[str]) -> list[tuple[str, ...]]:
    """Every row of every 8-column table in the captured responses.

    Looker does not fetch one page per click: the first response can already
    hold the next page, and a click that is served from that cache makes no
    request at all. So rows are pooled across every response and de-duplicated,
    and progress is judged by the pager label rather than by network traffic.
    """
    rows: list[tuple[str, ...]] = []
    for body in bodies:
        try:
            tables = _tables(body)
        except Exception:
            continue
        for t in tables:
            if len(t.get("column", [])) == len(FIELDS):
                rows.extend(tuple((v or "").strip() for v in r) for r in _rows(t))
    return rows


def _total(bodies: list[str]) -> int:
    for body in bodies:
        try:
            for t in _tables(body):
                if len(t.get("column", [])) == len(FIELDS):
                    return int(t.get("totalCount", 0))
        except Exception:
            continue
    return 0


def scrape_report(url: str, title: str) -> list[dict]:
    from playwright.sync_api import sync_playwright

    bodies: list[str] = []

    def on_response(resp):
        if "batchedDataV2" in resp.url:
            try:
                bodies.append(resp.text())
            except Exception:
                pass

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1500, "height": 4200}, locale="th-TH", user_agent=UA)
        page.on("response", on_response)
        page.goto(url, wait_until="networkidle", timeout=180_000)
        time.sleep(5)

        total = _total(bodies)
        if not total:
            browser.close()
            raise RuntimeError(f"{title}: detail table never loaded")

        label = page.locator(".pageLabel").first
        turns = 0
        while turns < 300:
            text = label.inner_text() if label.count() else ""
            m = re.search(r"(\d[\d,]*)\s*-\s*(\d[\d,]*)\s*/\s*(\d[\d,]*)", text)
            if not m or int(m.group(2).replace(",", "")) >= int(m.group(3).replace(",", "")):
                break
            turns += 1
            btn = page.locator(NEXT_PAGE).first
            box = btn.bounding_box() if btn.count() else None
            if not box:
                break
            # A synthetic element click moves the label but can skip the data
            # request; a real mouse click at the control's centre does both.
            page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            deadline = time.time() + 45
            while time.time() < deadline and label.inner_text() == text:
                time.sleep(0.4)
            if label.inner_text() == text:
                print(f"  ! {title}: pager stuck at {text}", file=sys.stderr)
                break
            page.wait_for_load_state("networkidle", timeout=60_000)
            time.sleep(0.6)
        browser.close()

    unique = list(dict.fromkeys(_detail_rows(bodies)))
    rows = [dict(zip(FIELDS, r)) for r in unique]
    if len(rows) < total:
        # A partial table must never quietly shrink the register downstream.
        raise RuntimeError(f"{title}: got {len(rows)} of {total} rows")
    return rows


def normalise(row: dict, region: str) -> dict:
    # 01-03 are the three private-clinic classes; 04 is an outpatient clinic run
    # by a second-class veterinary licensee; "ม4" marks a government facility.
    cls = re.match(r"\s*(0[1234]|ม4)", row["license_class"])
    lic = re.sub(r"\s+", "", row["license_no"])
    year = re.search(r"/(\d{4})$", lic)
    return {
        "license_no": lic,
        "license_class": ("gov" if cls.group(1) == "ม4" else cls.group(1)) if cls else "",
        "license_year_be": int(year.group(1)) if year else None,
        "name": re.sub(r"\s+", " ", row["name"]),
        "province": row["province"],
        "district": row["district"],
        "subdistrict": row["subdistrict"],
        "region": region,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="substring of the region slug or title")
    args = ap.parse_args()

    reports = region_reports()
    print(f"{len(reports)} region reports")
    raw: dict[str, list[dict]] = {}
    if OUT_RAW.exists():
        raw = json.loads(OUT_RAW.read_text(encoding="utf-8"))
    for slug, title, url in reports:
        if args.only and args.only not in slug and args.only not in title:
            continue
        print(f"- {title[:70]}")
        raw[slug] = scrape_report(url, title)
        print(f"    {len(raw[slug])} rows")
        OUT_RAW.parent.mkdir(parents=True, exist_ok=True)
        OUT_RAW.write_text(json.dumps(raw, ensure_ascii=False, indent=1), encoding="utf-8")

    records, seen = [], set()
    for slug, rows in raw.items():
        for r in rows:
            n = normalise(r, slug)
            key = (n["license_no"], n["name"])
            if not n["license_no"] or key in seen:
                continue
            seen.add(key)
            records.append(n)
    OUT_WEB.write_text(json.dumps({
        "source": INDEX,
        "publisher": "กองสวัสดิภาพสัตว์และสัตวแพทย์บริการ กรมปศุสัตว์",
        "retrieved": time.strftime("%Y-%m-%d"),
        "regions": sorted(raw),
        "records": records,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {len(records)} licensed clinics -> {OUT_WEB}")


if __name__ == "__main__":
    main()
