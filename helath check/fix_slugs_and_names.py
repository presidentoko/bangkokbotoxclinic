# -*- coding: utf-8 -*-
"""
fix_slugs_and_names.py — make every hospital row addressable and readable.

Three defects, all created by `hdmall_insert.py` writing
`db_slug = 'hdm-' + slug[:45]` where `slug` was a percent-encoded Thai
filename:

1. 19 slugs end mid-escape ("...-%E0%B8%94%E0%B8%AD%E0"). Requesting one makes
   Next.js decode the path segment, which raises URIError, so the page returns
   500 — Search Console reports 40 of those. Six locales each, and they are in
   the sitemap.
2. 33 slugs contain "%" at all. `app/sitemap.ts` percent-encodes every dynamic
   segment (correctly — a <loc> must be a valid URI), which turns "%E0" into
   "%25E0". Google then fetches a URL whose canonical tag points somewhere
   else, which is the "Alternate page with proper canonical" and "Duplicate,
   Google chose a different canonical" buckets: 288 sitemap URLs are affected.
3. Clinics whose HDmall storefront is titled in Thai got a Thai `name`, so an
   English-language site renders "โรงพยาบาลกล้วยน้ำไท" as the H1 and title.
   HDmall's own product links carry the romanisation, so it can be recovered.

Old slugs are written to `slug_redirects.json` for next.config.ts, so anything
already indexed keeps working through a 308.
"""
import json
import re
import unicodedata
import urllib.parse
from pathlib import Path

import pymysql

from config import DB_CONFIG
from hdmall_reparse import BRAND_SUFFIX, CACHE, learn_brand_suffixes, parse_cards

OUT = Path(__file__).parent / "slug_redirects.json"

STOPWORDS = {"the", "a", "an", "of", "and"}


def clean_slug(name: str, taken: set[str]) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    s = "-".join(w for w in s.split("-") if w and w not in STOPWORDS)
    s = s[:60].strip("-")
    if not s:
        return ""
    base, n = s, 2
    while s in taken:
        s = f"{base}-{n}"
        n += 1
    return s


def romanised_names() -> dict[str, str]:
    """Thai brand -> English name, learned from HDmall product link suffixes."""
    cards = []
    for f in sorted(CACHE.glob("*.html")):
        cards.extend(parse_cards(f))
    learn_brand_suffixes(cards)
    out = {}
    for brand, suffix in BRAND_SUFFIX.items():
        if not re.search(r"[฀-๿]", brand):
            continue  # already Latin
        if not suffix or len(suffix) < 4:
            continue
        words = [w for w in suffix.split("-") if w]
        if not words or any(w.isdigit() for w in words[:1]):
            continue
        out[brand.strip()] = " ".join(w.capitalize() for w in words)
    return out


def main() -> None:
    conn = pymysql.connect(**{**DB_CONFIG, "autocommit": False}, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        cur.execute("SELECT id, slug, name, name_th FROM hospitals ORDER BY id")
        rows = cur.fetchall()

    taken = {r["slug"] for r in rows}
    roman = romanised_names()
    redirects: dict[str, str] = {}
    renamed = reslugged = 0

    with conn.cursor() as cur:
        # 1. HDmall's "Header" row is the page banner, not a clinic.
        cur.execute("SELECT id FROM hospitals WHERE name IN ('Header', 'Footer')")
        junk = [r["id"] for r in cur.fetchall()]
        for hid in junk:
            cur.execute("DELETE FROM package_price_snapshots WHERE package_id IN"
                        " (SELECT id FROM checkup_packages WHERE hospital_id=%s)", (hid,))
            cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (hid,))
            cur.execute("DELETE FROM hospital_reviews WHERE hospital_id=%s", (hid,))
            cur.execute("DELETE FROM hospitals WHERE id=%s", (hid,))
        if junk:
            print(f"removed {len(junk)} non-clinic rows (HDmall page furniture)")

        # 2. Romanise Thai-only names.
        for r in rows:
            if r["id"] in junk or not re.search(r"[฀-๿]", r["name"] or ""):
                continue
            if re.search(r"[A-Za-z]{4}", r["name"] or ""):
                continue  # already has a Latin part, e.g. "BG Clinic (บีจี...)"
            english = roman.get(r["name"].strip())
            if not english:
                continue
            cur.execute(
                "UPDATE hospitals SET name=%s, name_th=COALESCE(name_th,%s) WHERE id=%s",
                (english, r["name"], r["id"]),
            )
            r["name"] = english
            renamed += 1
        print(f"romanised {renamed} Thai-only hospital names")

        # 3. Re-slug anything that is not a clean ASCII path segment.
        for r in rows:
            if r["id"] in junk:
                continue
            old = r["slug"]
            if re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", old):
                continue
            taken.discard(old)
            new = clean_slug(r["name"] or old, taken)
            if not new or new == old:
                taken.add(old)
                continue
            taken.add(new)
            cur.execute("UPDATE hospitals SET slug=%s WHERE id=%s", (new, r["id"]))
            # Redirect from the URL-safe form Google actually has. The raw slug
            # is what the page canonicalised to; the doubly-encoded form is
            # what the sitemap submitted. Both must land on the new slug.
            redirects[old] = new
            enc = urllib.parse.quote(old, safe="")
            if enc != old:
                redirects[enc] = new
            reslugged += 1
        print(f"re-slugged {reslugged} hospitals")

    conn.commit()

    with conn.cursor() as cur:
        cur.execute("SELECT slug FROM hospitals WHERE slug NOT REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'")
        left = cur.fetchall()
    print("slugs still not URL-safe:", len(left))
    for r in left[:10]:
        print("  ", r["slug"])

    OUT.write_text(json.dumps(redirects, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {len(redirects)} redirect pairs -> {OUT.name}")
    conn.close()


if __name__ == "__main__":
    main()
