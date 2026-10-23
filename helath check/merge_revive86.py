"""Turn the 86 hospital URLs that still earn impressions back into real pages.

Search Console's 2026-10-22 export has 2,609 impressions landing on 86
/hospital/<slug> URLs this site no longer holds — the August catalogue rebuild
dropped them, and they are exactly the searches that still convert here:
somebody typing a hospital's name. The slugs currently 308 to a city page,
which answers a different question than the one asked.

This merges one Apify `crawler-google-places` run (86 search terms, one place
each, no reviews and no images) back into the catalogue as unpriced listings:
name, address, phone, opening hours, coordinates, rating and review count.

The gate is the whole point. A previous attempt at the same job matched
"Bangkok Hospital Krabi" to the Bangkok head office, Banglamung Hospital to a
VD clinic and Rayong Hospital to a private hospital of a similar name, and
those are the errors a medical directory cannot publish. So a place is
accepted only when

  1. one of its Google categories is a health category and none is on the
     blocklist — this run came back with two ATMs and an animal hospital;
  2. its name is the name we asked for, by one of three tests: the slug with
     punctuation removed appears in the title the same way ("surat-thani-
     hospital" / "Suratthani Hospital"), or every significant token of the
     slug appears in the title or the address, allowing one letter of
     transliteration drift per token ("taksin" / "Thaksin", "samutprakarn" /
     "Samut Prakan"), or the slug's distinctive token is the registered domain
     of the place's own website ("semed-living-care" / semed.co.th);
  3. the province or city named in the slug is the province in the address;
  4. it is not permanently closed.

Everything rejected is printed with the reason. Rejecting a right answer costs
one page; accepting a wrong one publishes a hospital's phone number under
another hospital's name.
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB = ROOT / "web" / "data" / "checkup_db.json"
TARGETS = ROOT / "registry" / "revive86_targets.json"

# Categories that make a place a health facility. Checked against every entry
# in `categories`, not just the primary one: the Biomed diagnostics lab lists
# "Equipment importer" first and "Diagnostic center" third.
HEALTH = (
    "hospital", "clinic", "medical", "doctor", "physician", "dentist", "dental",
    "laborator", "diagnostic", "health", "wellness", "fertility", "surgery",
    "surgeon", "aesthetic", "dermatolog", "obstetric", "gynecolog", "pediatric",
    "cardiolog", "oncolog", "urolog", "orthopedic", "radiolog", "pharmac",
    "physiotherap", "rehabilitation", "aged care", "nursing", "sleep clinic",
    "cancer", "diabet", "chiropractor", "alternative medicine", "midwife",
)

# Categories that disqualify a place whatever else it lists. An animal hospital
# is a hospital by every string test and is not what a reader searching a
# hospital's name wants.
#
# Matched on whole words. Written as substrings, "atm" blocked four real
# hospitals because it is inside "treatment", and "beauty shop" blocked a
# genetics lab Google happens to file under "Health and beauty shop" — the
# blocklist was rejecting more right answers than wrong ones.
BLOCK = (
    "animal", "animals", "veterinary", "veterinarian", "pet", "pets",
    "hotel", "restaurant", "cafe", "salon", "spa", "gym", "fitness",
    "school", "shopping", "mall", "supermarket",
)

# Words that carry no identity: they appear in half the names in the catalogue,
# so requiring them would reject correct matches whose Google title spells the
# same facility differently.
GENERIC = {
    "hospital", "clinic", "center", "centre", "medical", "wellness", "health",
    "healthcare", "the", "and", "co", "ltd", "international", "thailand", "dr",
    "bangkok" if False else "",  # bangkok is a city token, handled separately
    "hdm", "amp",
}
GENERIC.discard("")

# Province and city tokens that must agree with the address when the slug
# names one. This is the guard that catches a provincial branch matched to the
# chain's head office in Bangkok.
PLACES = {
    "bangkok": "bangkok", "krabi": "krabi", "phuket": "phuket",
    "pattaya": "chon buri", "chonburi": "chon buri", "chon": "chon buri",
    "buri": None, "rayong": "rayong", "huahin": "prachuap", "hua": None,
    "hin": None, "chiangmai": "chiang mai", "chiang": "chiang mai",
    "mai": None, "chiangrai": "chiang rai", "rai": None, "korat": "ratchasima",
    "ratchasima": "ratchasima", "khonkaen": "khon kaen", "khon": "khon kaen",
    "kaen": None, "udon": "udon thani", "hatyai": "songkhla",
    "hat": None, "yai": None, "songkhla": "songkhla", "samui": "surat thani",
    "suratthani": "surat thani", "surat": "surat thani", "thani": None,
    "ayutthaya": "ayutthaya", "lampang": "lampang", "nonthaburi": "nonthaburi",
    "samutprakarn": "samut prakan", "samutprakan": "samut prakan",
    "pathumthani": "pathum thani", "nakhonpathom": "nakhon pathom",
    "trang": "trang", "phitsanulok": "phitsanulok", "ubon": "ubon",
    "chumphon": "chumphon", "sriracha": "chon buri", "pakkred": "nonthaburi",
    "pakkret": "nonthaburi", "trat": "trat", "ratchaburi": "ratchaburi",
    "thammarat": "nakhon si thammarat", "nakhon": None, "si": None,
    "koh": None, "ko": None, "chang": None,
}


def collapse(s: str) -> str:
    """Letters and digits only, lowercased — spelling without the spacing."""
    s = unicodedata.normalize("NFKD", s or "")
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def words(s: str) -> list[str]:
    return [w for w in re.split(r"[^a-z0-9]+", (s or "").lower()) if w]


def close(a: str, b: str) -> bool:
    """One or two letters of transliteration drift, not a different word."""
    if a == b:
        return True
    if abs(len(a) - len(b)) > 2 or min(len(a), len(b)) < 4:
        return False
    return SequenceMatcher(None, a, b).ratio() >= 0.85


def ngrams(ws: list[str], n: int) -> list[str]:
    return ["".join(ws[i:i + n]) for i in range(len(ws) - n + 1)]


def token_present(tok: str, haystacks: list[str]) -> bool:
    """Is this slug token in the title or address, spacing and spelling aside?

    A place word also counts as present when the province it stands for is:
    Google writes the Korat branch "Bangkok Hospital Ratchasima".
    """
    want = PLACES.get(tok)
    for h in haystacks:
        if want and want in (h or "").lower():
            return True
    for h in haystacks:
        hw = words(h)
        for n in (1, 2, 3):
            for g in ngrams(hw, n):
                if close(tok, g):
                    return True
    return False


def domain(url: str | None) -> str:
    m = re.search(r"https?://([^/]+)", url or "")
    if not m:
        return ""
    host = m.group(1).lower()
    # A social profile is not the place's own domain and proves nothing.
    if any(s in host for s in ("facebook", "instagram", "line.me", "linktr", "google")):
        return ""
    return collapse(host.split(".")[0] if not host.startswith("www.") else host.split(".")[1])


def province_ok(slug_tokens: list[str], address: str) -> tuple[bool, str]:
    """Does the place sit where the slug says it does?

    Only the *last* place word in the slug is a claim about location. The
    earlier ones are brand: "Bangkok Hospital Krabi" is a Krabi hospital owned
    by a chain named after Bangkok, and reading its first word as the location
    rejected seven correct branches — including the 172-impression slug this
    whole exercise is for.

    Reading the last word is also what catches the error this gate exists to
    prevent. Asked for "Bangkok Hospital Krabi" the actor returned Bangkok
    International Hospital on Petchaburi Road in Bangkok; asked for Vejthani
    Pattaya it returned Vejthani in Bang Kapi, and for Phyathai Rayong it
    returned Phyathai Sriracha. The address decides, and either the place word
    itself or its province has to be in it.
    """
    addr = (address or "").lower()
    claims = [t for t in slug_tokens if PLACES.get(t)]
    if not claims:
        return True, ""
    tok = claims[-1]
    want = PLACES[tok]
    if tok in addr or want in addr:
        return True, ""
    return False, f"slug says {tok} but the address is in neither {tok} nor {want}"


def judge(slug: str, place: dict) -> tuple[bool, str]:
    title = place.get("title") or ""
    address = place.get("address") or ""
    cats = [c.lower() for c in (place.get("categories") or [])]
    if place.get("categoryName"):
        cats.append(place["categoryName"].lower())
    if not cats:
        return False, "no Google category at all"
    blocked = [c for c in cats if set(words(c)) & set(BLOCK)]
    if blocked:
        return False, f"blocked category: {blocked[0]}"
    # Google's primary category is wrong often enough that it cannot be the
    # only evidence: Trang Hospital and Samut Prakan Hospital — two provincial
    # government hospitals — are filed under "ATM" and nothing else, and BTL
    # LAB under "Training center". A place whose own name says hospital, clinic
    # or laboratory is one, and the name and address tests below still have to
    # agree that it is the one we asked for.
    if not any(h in c for c in cats for h in HEALTH):
        if not any(h in title.lower() for h in HEALTH):
            return False, f"neither category nor name is health: {cats}"
    if place.get("permanentlyClosed"):
        return False, "permanently closed"

    toks = [w for w in words(slug) if w not in GENERIC]
    ok, why = province_ok(toks, address)
    if not ok:
        return False, why

    # Test 1 — same spelling, different spacing.
    if collapse(slug) and collapse(slug) in collapse(title):
        return True, "name: spelling matches title"

    # Test 2 — every distinctive token present in the title.
    #
    # The title, not the address. Allowed to read the address too, this test
    # accepted "Pattaya Bhattamakun Hospital" for banglamung-hospital-pattaya,
    # because that hospital sits in Bang Lamung District and the district name
    # in its address satisfied the only distinctive word in the slug. Bang
    # Lamung Hospital is a different hospital a few kilometres away — the same
    # mistake, almost the same two places, as the match that got this whole
    # approach thrown out in September. A place word may be confirmed by the
    # address; a name may only be confirmed by the name.
    identity = [t for t in toks if t not in PLACES]
    if identity and all(token_present(t, [title]) for t in identity):
        return True, "name: all distinctive tokens present"

    # Test 2b — a name made only of place words and generic ones.
    #
    # "bangkok-pattaya-hospital" has no distinctive token at all: every word in
    # it is either a place or a word half the catalogue shares. The chain name
    # is the only thing left to check, so it has to be in the *title* — the
    # address cannot stand in for it. That is what separates Bangkok Hospital
    # Pattaya, which is the right answer, from Lampang Hospital and Koh Chang
    # Hospital, which are public hospitals the actor returned for a Bangkok
    # Hospital branch that has no Google listing of its own.
    if not identity:
        places = [t for t in toks if t in PLACES]
        brand = places[0] if places else None
        if brand and token_present(brand, [title]) and all(
            token_present(t, [title, address]) for t in places if PLACES.get(t)
        ):
            return True, "name: chain name in title, branch in address"

    # Test 3 — the place's own domain carries the name.
    dom = domain(place.get("website"))
    if dom:
        for tok in identity:
            if len(tok) >= 5 and (tok in dom or close(tok, dom)):
                return True, f"name: own domain is {dom}"

    return False, f"name mismatch: wanted {toks} got {title!r}"


# A handful of names whose Google title is an initialism of ours. Each one was
# checked by hand against the address; the list is short on purpose.
ALIASES = {
    "bangkok-nursing-home-hospital": "bnh hospital",
}


def duplicate_of(place: dict, rows: list[dict]) -> dict | None:
    """Is this place already in the catalogue under some other slug?

    Checking the slug is not enough. The redirect maps sent
    bangkok-nursing-home-hospital and taksin-hospital-surat-thani to a city
    page, so both looked like gaps — but the catalogue already holds BNH
    Hospital as `bnh` and Thaksin Hospital as `thaksin-hospital`, and creating
    a page for each would have published two URLs for one hospital on a site
    whose Search Console problem is duplicate low-value pages.

    The name settles it, and the coordinates settle the cases where the name
    is spelled differently.
    """
    title = collapse(place.get("title") or "")
    loc = place.get("location") or {}
    for row in rows:
        name = collapse(row.get("name") or "")
        if title and name and (title == name or title in name or name in title):
            return row
        try:
            if (abs(float(row["lat"]) - float(loc["lat"])) < 0.001
                    and abs(float(row["lng"]) - float(loc["lng"])) < 0.001):
                return row
        except (TypeError, ValueError, KeyError):
            continue
    return None


def as_hospital(hid: int, slug: str, place: dict) -> dict:
    """A catalogue row for a hospital we hold no page for.

    Unpriced on purpose: there is no package behind any of these, and
    `hosp_meta_title` already has an unpriced variant for this case. Address,
    phone and opening hours are what somebody typing a hospital's name into
    Google is after.
    """
    loc = place.get("location") or {}
    return {
        "id": hid,
        "name": place.get("title"),
        "name_th": None,
        "slug": slug,
        "tier": None,
        "area": place.get("city"),
        "city": place.get("city"),
        "jci": 0,
        "checkup_url": None,
        "lat": str(loc["lat"]) if loc.get("lat") is not None else None,
        "lng": str(loc["lng"]) if loc.get("lng") is not None else None,
        "address": place.get("address"),
        "phone": place.get("phone"),
        "website": place.get("website"),
        "description": None,
        "founded_year": None,
        "bed_count": None,
        "specialties": None,
        "accreditations": None,
        "email": None,
        "rating": f"{place['totalScore']:.2f}" if place.get("totalScore") else None,
        "review_count": place.get("reviewsCount") or 0,
        "category_name": place.get("categoryName"),
        # A list, not a JSON string: db.ts types this as OpeningHours and the
        # page maps over it. Encoding it cost one failed build.
        "opening_hours": place.get("openingHours") or None,
        "google_maps_url": place.get("url"),
        "permanently_closed": 0,
    }


def fill_gaps(row: dict, place: dict) -> list[str]:
    """Fill only the fields the catalogue leaves empty, and say which.

    Never overwrites. A name or an address already in the catalogue was read
    off the hospital's own page; a Google place record is the weaker source and
    has no business replacing it.
    """
    loc = place.get("location") or {}
    candidates = {
        "address": place.get("address"),
        "phone": place.get("phone"),
        "website": place.get("website"),
        "lat": str(loc["lat"]) if loc.get("lat") is not None else None,
        "lng": str(loc["lng"]) if loc.get("lng") is not None else None,
        "rating": f"{place['totalScore']:.2f}" if place.get("totalScore") else None,
        "category_name": place.get("categoryName"),
        "google_maps_url": place.get("url"),
        "opening_hours": place.get("openingHours") or None,
    }
    filled = []
    for key, value in candidates.items():
        if value and not row.get(key):
            row[key] = value
            filled.append(key)
    if not row.get("review_count") and place.get("reviewsCount"):
        row["review_count"] = place["reviewsCount"]
        filled.append("review_count")
    return filled


def main(dataset: str, apply: bool) -> int:
    D = json.loads(Path(dataset).read_text(encoding="utf-8"))
    T = json.loads(TARGETS.read_text(encoding="utf-8"))
    db = json.loads(DB.read_text(encoding="utf-8"))
    have = {h["slug"] for h in db["hospitals"]}

    by_q: dict[str, dict] = {}
    for r in D:
        by_q.setdefault(r.get("searchString"), r)

    accepted: list[tuple[str, int, dict, str]] = []
    rejected: list[tuple[str, int, str]] = []
    for t in T:
        slug, q = t["slug"], t["q"]
        place = by_q.get(q)
        if not place:
            rejected.append((slug, t["impressions"], "no place returned for the query"))
            continue
        if slug in have:
            rejected.append((slug, t["impressions"], "already in the catalogue"))
            continue
        alias = ALIASES.get(slug)
        if alias and collapse(alias) == collapse(place.get("title") or ""):
            accepted.append((slug, t["impressions"], place, "name: hand-checked alias"))
            continue
        ok, why = judge(slug, place)
        if ok:
            accepted.append((slug, t["impressions"], place, why))
        else:
            rejected.append((slug, t["impressions"], why))

    print(f"accepted {len(accepted)}  rejected {len(rejected)}")
    print(f"impressions behind accepted slugs {sum(a[1] for a in accepted):,} "
          f"of {sum(t['impressions'] for t in T):,}\n")
    print("--- REJECTED")
    for slug, imp, why in sorted(rejected, key=lambda x: -x[1]):
        print(f"  {imp:>4}  {slug:<42} {why}")

    # What the run was actually for, discovered only after it ran: 64 of the 86
    # slugs already resolve to a live hospital page through RENAMED_HOSPITALS,
    # and those pages are all but complete — across all 64 there are two
    # missing phone numbers, three missing opening hours and one missing
    # address. The Search Console reading that set this job up ("86 URLs we do
    # not hold") was counting redirects as gaps. They are not gaps: a 308 to
    # the right hospital answers the search.
    #
    # So the accepted places split three ways. The few whose slug leads nowhere
    # but a city page get a real page. The ones already held get only their
    # empty fields filled. A slug carrying a percent-encoded Thai fragment gets
    # nothing, because a non-ASCII hospital slug is how 663 pages on a sister
    # site came to answer 200 with a 404 body.
    src = (ROOT / "web" / "lib" / "hospital-redirects.ts").read_text(encoding="utf-8")
    i = src.index("export const RENAMED_HOSPITALS")
    j = src.index("export const MOVED_TO_GUIDE")
    renamed = dict(re.findall(r'"([^"]+)":\s*"([^"]+)"', src[i:j]))
    by_slug = {h["slug"]: h for h in db["hospitals"]}

    created: list[tuple[str, int, str]] = []
    enriched: list[tuple[str, int, str]] = []
    nothing: list[tuple[str, int, str]] = []
    next_id = max(h["id"] for h in db["hospitals"]) + 1
    for slug, imp, place, _why in accepted:
        if not slug.isascii() or "%" in slug:
            nothing.append((slug, imp, "slug is not ASCII"))
            continue
        target = (by_slug.get(renamed.get(slug, ""))
                  or duplicate_of(place, db["hospitals"]))
        if target:
            filled = fill_gaps(target, place)
            row = (slug, imp,
                   f"{target['slug']}: filled {', '.join(filled)}" if filled
                   else f"{target['slug']}: already complete")
            (enriched if filled else nothing).append(row)
            continue
        db["hospitals"].append(as_hospital(next_id, slug, place))
        created.append((slug, imp, place.get("title") or ""))
        next_id += 1

    print(f"\n--- NEW PAGES {len(created)} ({sum(c[1] for c in created):,} impressions)")
    for slug, imp, title in sorted(created, key=lambda x: -x[1]):
        print(f"  {imp:>4}  {slug:<42} {title}")
    print(f"\n--- FIELDS FILLED ON EXISTING PAGES {len(enriched)}")
    for slug, imp, why in sorted(enriched, key=lambda x: -x[1]):
        print(f"  {imp:>4}  {slug:<42} {why}")
    print(f"\n--- ALREADY COMPLETE, NOTHING WRITTEN {len(nothing)}")

    if not apply:
        print("\n(dry run — pass --apply to write)")
        return 0

    DB.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {DB} ({len(db['hospitals'])} hospitals)")
    if created:
        print("\nNow remove these from MOVED_TO_GUIDE in lib/hospital-redirects.ts:")
        for slug, _imp, _t in created:
            print(f'  "{slug}"')
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    sys.exit(main(args[0], "--apply" in sys.argv))
