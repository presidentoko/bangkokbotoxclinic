# -*- coding: utf-8 -*-
"""
scrape_missing_hospitals.py — rebuild the hospital rows the 2026-08 catalogue
rebuild deleted, from Google Maps, with Playwright.

Why this exists
---------------
Search Console's 2026-08-25 export lists 211 indexed /hospital/:slug URLs, of
which only 62 still resolve. 67 of the dead ones were re-slugged and are
handled by a redirect; the remaining 82 are hospitals that left the dataset
entirely when the HDmall reparse dropped every row without a priced package.
Those 82 still carry 65 clicks and 3,812 impressions a quarter.

They cannot simply be re-added from the old data, because the old provincial
rows were not real: `mega_scrape.py` carries hard-coded package literals like
('Basic Health Check', 2500, 'basic') for hospitals it never scraped. This
script therefore collects only what Google Maps actually publishes — name,
address, phone, website, coordinates, rating, review count, category, hours —
and writes NOTHING for a field it did not find. Prices are deliberately out of
scope: a hospital page with no price is honest, a hospital page with an invented
price is what got us here.

Two guards that exist because of previous incidents
--------------------------------------------------
1. Name matching. A Maps search for a business that does not exist happily
   returns a different one nearby, which is how a fabricated hospital acquires
   a real address and looks verified. Every result is scored against the query
   and anything below MATCH_FLOOR is written out as `rejected` instead of
   being kept. That also makes this script a test: the guide entries invented
   names like "Bangkok Hospital Lampang", and those should come back rejected.
2. No filled-in defaults. `petvet` shipped coordinates that were 92% grid
   points because a missing value silently became a plausible one. Missing
   stays None here, and report_distribution() prints the per-field fill rate so
   the gap is visible before anything reaches the database.

Usage
-----
    python scrape_missing_hospitals.py --targets targets.json --out found.json
    python scrape_missing_hospitals.py --out found.json --report

Resumable: re-running skips slugs already present in --out.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import random
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

from playwright.async_api import async_playwright, Page

MATCH_FLOOR = 0.55          # below this the result is a different business
NAV_TIMEOUT = 45_000
SETTLE_MS = 2_600
# A confident search redirects itself to the place page, but the hop happens
# client-side and takes 3-5s. Deciding at 2.6s reported "no result" for
# hospitals that were about to load perfectly well, so this polls instead.
RESOLVE_TIMEOUT_MS = 16_000
RETRY_FAILURES = False   # set by --retry
POLL_MS = 700


# ── name matching ────────────────────────────────────────────────────────────

_NOISE = re.compile(
    r"\b(hospital|clinic|medical|center|centre|international|the|and|co|ltd"
    r"|public|general|university|memorial|โรงพยาบาล)\b",
    re.I,
)


def _norm(s: str) -> str:
    s = _NOISE.sub(" ", s.lower())
    return re.sub(r"[^a-z0-9]+", "", s)


# Words that make a result a different *kind* of business. Maps answers a
# search for a hospital it does not have with the nearest thing that shares the
# words, and "Bangkok Hospital Krabi" came back as "Bangkok Krabi Animal
# Hospital" — which scored a perfect 1.0 on name containment alone, because the
# query is literally a substring of the answer. A veterinary clinic entering
# the catalogue as a human hospital is the same class of error as the invented
# hospitals this script is meant to expose, so it is checked separately from
# the score and is decisive.
_DISQUALIFYING = re.compile(
    r"\b(animal|animals|veterinar\w*|vet|pet|pets|dental|dentist\w*|orthodont\w*"
    r"|optic\w*|beauty|aesthetic\w*|spa|massage|nail|salon|pharmacy|school)\b",
    re.I,
)


# City names as they appear in a Thai postal address, keyed by the city we
# searched in. Google writes the province, which is often not the town.
_CITY_ALIASES = {
    "Hua Hin": ("hua hin", "prachuap"),
    "Krabi": ("krabi",),
    "Koh Samui": ("samui", "surat thani"),
    "Pattaya": ("pattaya", "chon buri", "chonburi", "bang lamung", "banglamung"),
    "Chonburi": ("chon buri", "chonburi", "si racha", "sriracha", "pattaya"),
    "Surat Thani": ("surat thani", "suratthani"),
    "Khon Kaen": ("khon kaen",),
    "Hat Yai": ("hat yai", "songkhla"),
    "Udon Thani": ("udon thani",),
    "Chiang Rai": ("chiang rai",),
    "Koh Chang": ("koh chang", "ko chang", "trat"),
    "Trat": ("trat", "ko chang", "koh chang"),
    "Nakhon Ratchasima": ("nakhon ratchasima", "korat"),
    "Rayong": ("rayong",),
    "Trang": ("trang",),
    "Lampang": ("lampang",),
    "Phitsanulok": ("phitsanulok",),
    "Nakhon Si Thammarat": ("nakhon si thammarat",),
    "Ayutthaya": ("ayutthaya", "phra nakhon si"),
    "Phuket": ("phuket",),
    "Chiang Mai": ("chiang mai",),
    "Nakhon Pathom": ("nakhon pathom",),
    "Chanthaburi": ("chanthaburi",),
    "Samut Prakan": ("samut prakan",),
    "Bangkok": ("bangkok", "krung thep", "khet ", "nonthaburi", "pathum thani", "samut prakan"),
}


def city_mismatch(target_city: str, address: str | None) -> bool:
    """True when the result is demonstrably in a different city than asked for.

    Name similarity cannot separate a branch from its parent: "Bangkok Hospital
    Ayutthaya" (a name the old guides invented) scores 0.61 against plain
    "Bangkok Hospital", which is enough to pass, and the import would then have
    redirected an Ayutthaya URL to the Bangkok headquarters as though a branch
    existed there. "San Paulo Hospital Hua Hin" -> "San Paulo Hospital" has the
    identical shape and *is* correct. The address is what tells them apart, so
    it decides.

    Unknown cities and missing addresses return False — this only rejects on
    positive evidence of a different place, never on absence of evidence.
    """
    if not address:
        return False
    aliases = _CITY_ALIASES.get(target_city)
    if not aliases:
        return False
    low = address.lower()
    return not any(a in low for a in aliases)


def loses_distinctive_word(query: str, target_city: str, found_name: str) -> str | None:
    """The word that identifies *which* hospital, missing from the result.

    Two hospitals in the same town pass both the name score and the address
    check: "Karunvej Ayutthaya Hospital" against "Phra Nakhon Si Ayutthaya
    Hospital" shares the province in both name and address, and a private
    hospital would have been imported as the government one. What separates
    them is the word that is neither the city nor a word every hospital has —
    here "karunvej" — so that word has to survive into the result.

    Returns None when the query has no distinctive word left to check (a query
    that is only a city name), since there is then nothing to be wrong about.
    """
    city_words = set()
    for alias in _CITY_ALIASES.get(target_city, ()) + (target_city,):
        city_words.update(re.findall(r"[a-z]+", alias.lower()))
    stop = city_words | {"bangkok"}          # "Bangkok Hospital" is a brand, not a place here
    distinctive = [
        w for w in re.findall(r"[a-z]+", _NOISE.sub(" ", query.lower()))
        if len(w) >= 4 and w not in stop
    ]
    if not distinctive:
        return None
    # Compare with spacing and punctuation removed, and allow a couple of
    # characters of slack. Thai names are transliterated inconsistently even by
    # the hospitals themselves — "Samutprakarn" against "Samut Prakan",
    # "Sanamchan" against "Sanam Chan" — and a strict comparison rejected those
    # as different hospitals when only the romanisation differed.
    found = _norm(found_name or "")
    for w in distinctive:
        if w in found:
            return None
        longest = SequenceMatcher(None, w, found).find_longest_match(
            0, len(w), 0, len(found)
        ).size
        if longest >= max(5, len(w) - 2):
            return None
    return distinctive[0]


def wrong_kind_of_business(query: str, found_name: str, category: str | None) -> str | None:
    """Return the disqualifying word if `found` is a different kind of place."""
    asked = set(w.lower() for w in _DISQUALIFYING.findall(query))
    for text in (found_name or "", category or ""):
        for hit in _DISQUALIFYING.findall(text):
            if hit.lower() not in asked:
                return hit.lower()
    return None


def match_score(query: str, found: str) -> float:
    """How confident we are that `found` is the business `query` asked for.

    Compared on the distinctive part of the name: every result is called
    "... Hospital", so leaving that in would score two unrelated hospitals at
    0.8 and wave them both through. Containment is strong evidence but not
    proof — it is scaled by how much of the longer name it fails to explain,
    so a query buried inside a much longer name does not score a clean 1.0.

    Returns -1.0 when the found name is not in Latin script at all. Google
    answers with a place's primary name, which for Thai government hospitals is
    Thai ("โรงพยาบาลตรัง" for Trang Hospital), and stripping non-ASCII scored
    those a flat 0.0 — a correct result thrown away as a mismatch. There is no
    way to compare the two strings here, so it is reported as unknown and left
    for review rather than silently accepted or silently dropped.
    """
    q, f = _norm(query), _norm(found)
    if not q:
        return 0.0
    if not f:
        return -1.0 if re.search(r"[^\x00-\x7f]", found or "") else 0.0
    ratio = SequenceMatcher(None, q, f).ratio()
    if q in f or f in q:
        ratio = max(ratio, min(len(q), len(f)) / max(len(q), len(f)))
    return ratio


# ── extraction ───────────────────────────────────────────────────────────────

async def _aria(page: Page, selector: str, strip: str) -> str | None:
    el = await page.query_selector(selector)
    if not el:
        return None
    label = await el.get_attribute("aria-label")
    if not label:
        return None
    return label.split(strip, 1)[-1].strip() or None


async def extract(page: Page) -> dict:
    """Read a Maps place page. Every value is optional and stays None if absent."""
    out: dict = {}

    # The place title, not the results-panel heading. An ambiguous search can
    # land on a /maps/place/ URL while still rendering a list, and the first h1
    # on that layout is the literal word "Results" — which then sails through
    # any name check that only asks whether a name was found. The URL segment
    # is authoritative, so it wins and the h1 is the fallback.
    out["name"] = None
    m = re.search(r"/maps/place/([^/@]+)", page.url)
    if m:
        from urllib.parse import unquote_plus

        candidate = unquote_plus(m.group(1)).strip()
        if candidate and candidate.lower() != "results":
            out["name"] = candidate
    if not out["name"]:
        h1 = await page.query_selector("h1.DUwDvf") or await page.query_selector("h1")
        if h1:
            text = (await h1.inner_text()).strip()
            out["name"] = text if text.lower() != "results" else None

    out["address"] = await _aria(page, 'button[data-item-id="address"]', "Address:")
    out["phone"] = await _aria(page, 'button[data-item-id^="phone"]', "Phone:")

    site = await page.query_selector('a[data-item-id="authority"]')
    out["website"] = await site.get_attribute("href") if site else None

    plus = await _aria(page, 'button[data-item-id="oloc"]', "Plus code:")
    out["plus_code"] = plus

    # Rating and review count sit in one block; the review count carries a
    # thousands separator in some locales.
    out["rating"] = out["review_count"] = None
    block = await page.query_selector("div.F7nice")
    if block:
        text = await block.inner_text()
        m = re.search(r"([0-5][.,]\d)", text)
        if m:
            out["rating"] = float(m.group(1).replace(",", "."))
        m = re.search(r"\(([\d,\.\s]+)\)", text)
        if m:
            digits = re.sub(r"\D", "", m.group(1))
            out["review_count"] = int(digits) if digits else None
    if out["review_count"] is None:
        # The parenthesised count is missing on some layouts; the reviews
        # control still carries it in an aria-label ("1,234 reviews").
        for sel in ('button[aria-label*="review"]', 'a[aria-label*="review"]',
                    '[jsaction*="reviewChart"]'):
            el = await page.query_selector(sel)
            if not el:
                continue
            label = await el.get_attribute("aria-label") or ""
            m = re.search(r"([\d,\.]+)\s*review", label, re.I)
            if m:
                digits = re.sub(r"\D", "", m.group(1))
                if digits:
                    out["review_count"] = int(digits)
                    break

    cat = await page.query_selector('button[jsaction*="category"]')
    out["category"] = (await cat.inner_text()).strip() if cat else None

    # Coordinates live in the URL. "!3d<lat>!4d<lng>" is the place's own pin;
    # the "@lat,lng" form is only the viewport centre, so it is a fallback.
    out["lat"] = out["lng"] = None
    url = page.url
    m = re.search(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)", url) or re.search(
        r"@(-?\d+\.\d+),(-?\d+\.\d+)", url
    )
    if m:
        out["lat"], out["lng"] = float(m.group(1)), float(m.group(2))
    out["maps_url"] = url if "/maps/place/" in url else None

    # Opening hours: the collapsed table exposes each row as "Day, hours".
    hours = []
    for row in await page.query_selector_all('div[jsaction*="openhours"] table tr, table.eK4R0e tr'):
        cells = await row.query_selector_all("td")
        if len(cells) >= 2:
            day = (await cells[0].inner_text()).strip()
            val = (await cells[1].inner_text()).strip().replace(" ", " ")
            if day and val:
                hours.append({"day": day, "hours": val})
    out["opening_hours"] = hours or None

    return out


async def scrape_one(page: Page, target: dict) -> dict:
    query = f"{target['query']} {target['city']} Thailand"
    url = "https://www.google.com/maps/search/" + query.replace(" ", "+") + "?hl=en"
    rec = {**target, "query_sent": query}

    await page.goto(url, wait_until="domcontentloaded", timeout=NAV_TIMEOUT)

    # Either the search resolves itself to one place, or it renders a list to
    # pick from. Poll for whichever arrives first rather than guessing a delay.
    waited = 0
    while waited < RESOLVE_TIMEOUT_MS and "/maps/place/" not in page.url:
        if await page.query_selector('a[href*="/maps/place/"]'):
            break
        await page.wait_for_timeout(POLL_MS)
        waited += POLL_MS

    if "/maps/place/" not in page.url:
        # Take the best-matching result, not the first one. Maps puts paid
        # placements at the top of a list, and clicking blindly sent both
        # Ramathibodi and Siriraj — two of the largest hospitals in Thailand —
        # to the same advertised private clinic. The place name is in the link
        # href, so every candidate can be scored before anything is clicked.
        from urllib.parse import unquote_plus

        links = await page.query_selector_all('a[href*="/maps/place/"]')
        best, best_score = None, -2.0
        for el in links[:12]:
            href = await el.get_attribute("href") or ""
            m = re.search(r"/maps/place/([^/@?]+)", href)
            if not m:
                continue
            cand = unquote_plus(m.group(1)).strip()
            s = match_score(target["query"], cand)
            if s > best_score:
                best, best_score = el, s
        if best is None:
            rec["status"] = "no_result"
            return rec
        rec["picked_from_list"] = round(best_score, 3)
        await best.click()
        waited = 0
        while waited < RESOLVE_TIMEOUT_MS and "/maps/place/" not in page.url:
            await page.wait_for_timeout(POLL_MS)
            waited += POLL_MS
        if "/maps/place/" not in page.url:
            rec["status"] = "no_result"
            return rec

    # The place panel paints after the URL changes.
    await page.wait_for_timeout(SETTLE_MS)

    data = await extract(page)
    if not data.get("name"):
        rec["status"] = "no_result"
        return rec

    score = match_score(target["query"], data["name"])
    rec.update(data)
    rec["match_score"] = round(score, 3)

    wrong = wrong_kind_of_business(target["query"], data["name"], data.get("category"))
    if wrong:
        rec["status"] = "rejected"
        rec["reject_reason"] = f"different kind of business ({wrong})"
    elif city_mismatch(target["city"], data.get("address")):
        rec["status"] = "rejected"
        rec["reject_reason"] = f"address is not in {target['city']}"
    elif (lost := loses_distinctive_word(target["query"], target["city"], data["name"])):
        rec["status"] = "rejected"
        rec["reject_reason"] = f"result does not carry '{lost}'"
    elif score < 0:
        rec["status"] = "needs_review"
        rec["reject_reason"] = "non-Latin name, cannot compare automatically"
    elif score < MATCH_FLOOR:
        rec["status"] = "rejected"
        rec["reject_reason"] = f"name mismatch ({score:.2f})"
    else:
        rec["status"] = "ok"
    return rec


# ── driver ───────────────────────────────────────────────────────────────────

async def run(targets: list[dict], out_path: Path, limit: int | None) -> None:
    done: dict[str, dict] = {}
    if out_path.exists():
        done = {r["slug"]: r for r in json.loads(out_path.read_text(encoding="utf-8"))}
        print(f"resuming: {len(done)} already scraped")

    if RETRY_FAILURES:
        # A "Results" name means the run landed on the search list, not a
        # place — a scraper failure rather than a verdict about the hospital.
        # Those, and everything else that did not resolve, are worth another
        # pass once the extraction is fixed; genuine rejections are cheap to
        # re-confirm too, so the whole non-ok set goes back in.
        retry = {s for s, r in done.items() if r.get("status") != "ok"}
        for s in retry:
            del done[s]
        print(f"retrying {len(retry)} that did not resolve")

    todo = [t for t in targets if t["slug"] not in done]
    if limit:
        todo = todo[:limit]
    if not todo:
        print("nothing to do")
        return
    print(f"scraping {len(todo)} hospitals")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1360, "height": 900},
        )
        page = await ctx.new_page()

        for i, t in enumerate(todo, 1):
            try:
                rec = await scrape_one(page, t)
            except Exception as exc:                       # noqa: BLE001
                rec = {**t, "status": "error", "error": f"{type(exc).__name__}: {exc}"[:200]}
            done[t["slug"]] = rec
            flag = {"ok": "OK  ", "rejected": "REJ ", "no_result": "MISS", "error": "ERR "}.get(
                rec["status"], "??  "
            )
            print(
                f"[{i}/{len(todo)}] {flag} {t['query'][:38]:<38} "
                f"-> {str(rec.get('name'))[:38]:<38} {rec.get('match_score', '')}",
                flush=True,
            )
            out_path.write_text(
                json.dumps(list(done.values()), ensure_ascii=False, indent=1), encoding="utf-8"
            )
            # Maps starts serving empty shells if this goes much faster.
            await page.wait_for_timeout(random.randint(1800, 3400))

        await ctx.close()
        await browser.close()


def report_distribution(out_path: Path) -> None:
    """Per-field fill rate. Read this before importing anything."""
    rows = json.loads(out_path.read_text(encoding="utf-8"))
    by_status: dict[str, int] = {}
    for r in rows:
        by_status[r["status"]] = by_status.get(r["status"], 0) + 1
    print(f"\n{len(rows)} scraped: " + ", ".join(f"{k}={v}" for k, v in sorted(by_status.items())))

    ok = [r for r in rows if r["status"] == "ok"]
    if not ok:
        return
    print(f"\nfield fill rate over {len(ok)} accepted rows:")
    for f in ("name", "address", "phone", "website", "lat", "rating", "review_count",
              "category", "opening_hours", "maps_url"):
        n = sum(1 for r in ok if r.get(f) not in (None, "", []))
        print(f"  {f:<15} {n:>3}/{len(ok)}  {n / len(ok) * 100:5.1f}%")

    rej = [r for r in rows if r["status"] in ("rejected", "no_result")]
    if rej:
        print(f"\nnot accepted ({len(rej)}) — these are the names to treat as unverified:")
        for r in sorted(rej, key=lambda x: -x.get("impr", 0)):
            print(f"  {r['status']:<10} {r['query'][:40]:<40} -> {str(r.get('name'))[:36]}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--targets")
    ap.add_argument("--out", required=True)
    ap.add_argument("--limit", type=int)
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--retry", action="store_true",
                    help="re-scrape every record that is not already ok")
    args = ap.parse_args()

    global RETRY_FAILURES
    RETRY_FAILURES = args.retry
    out_path = Path(args.out)
    if args.report:
        report_distribution(out_path)
        return 0

    if not args.targets:
        ap.error("--targets is required unless --report")
    targets = json.loads(Path(args.targets).read_text(encoding="utf-8"))
    asyncio.run(run(targets, out_path, args.limit))
    report_distribution(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
