#!/usr/bin/env python3
"""build_registry.py — map master_db course ids to provider slugs.

Reads
    web-golf/data/master_db.json                  (641 courses, id = Google place id)
    web-golf/data/providers/golfdigg.json
    web-golf/data/providers/thaigolfbooking.json
    web-golf/data/provider_overrides.json         (manual block / force list)
Writes
    web-golf/data/provider_registry.json          { course_id: { golfdigg?: slug, thaigolfbooking?: slug } }
    <scratch>/registry_rejects.json               near-misses with the reason they were refused

Matching is deliberately strict — a wrong price on a course page is worse
than no price. A provider course is attached to a master course only when

  (a) the normalised core names are equal (generic words such as golf / club /
      course / resort / country club / the / and stripped), and, when both
      sides carry coordinates, they are not more than 25 km apart; or
  (b) rapidfuzz token_set_ratio >= 90 AND the first distinctive token is the
      same AND
        - both sides have coordinates and are <= 3 km apart, or
        - only an address is available and the master course's province
          appears in the provider address.

Each provider slug is attached to at most one master course and vice versa;
when several master rows compete (a course plus its driving range, say) the
nearest / highest-scoring one wins and the others are recorded as rejects.
"""
from __future__ import annotations

import json
import math
import os
import re
import sys
import unicodedata
from pathlib import Path

from rapidfuzz import fuzz

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PROVIDERS_DIR, WEB_GOLF, cache_dir  # noqa: E402

MASTER = WEB_GOLF / "data" / "master_db.json"
OVERRIDES = WEB_GOLF / "data" / "provider_overrides.json"
REGISTRY = WEB_GOLF / "data" / "provider_registry.json"
PROVIDERS = ["golfdigg", "thaigolfbooking"]

FUZZ_MIN = 90
NEAR_KM = 3.0
SAME_NAME_MAX_KM = 25.0

_GENERIC = {
    "golf", "club", "clubs", "course", "courses", "country", "resort", "resorts", "the", "and",
    "international", "co", "ltd", "spa", "hotel", "residence", "gc", "cc", "g", "c",
    # "&amp;" survives in a couple of provider names and slugifies to a token
    "amp",
    "สนามกอล์ฟ", "สนาม", "กอล์ฟ",
}
_PROVINCE_ALIASES = {
    "chon buri": ["chonburi", "chon buri", "pattaya"],
    "pathum thani": ["pathumthani", "pathum thani"],
    "prachuap khiri khan": ["prachuap", "hua hin", "huahin", "pranburi"],
    "phra nakhon si ayutthaya": ["ayutthaya"],
    "nakhon ratchasima": ["korat", "nakhon ratchasima", "khao yai"],
    "samut prakan": ["samut prakan", "samutprakan"],
    "nakhon pathom": ["nakhon pathom", "nakhonpathom"],
    "surat thani": ["samui", "surat thani"],
    "koh samui": ["samui"],
    "phetchaburi": ["phetchaburi", "cha am", "cha-am", "petchaburi"],
    "chiang mai": ["chiang mai", "chiangmai"],
    "chiang rai": ["chiang rai", "chiangrai"],
}


def _ascii(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()


# Words that name one course inside a multi-course club. Blue Canyon has a
# Canyon and a Lakes course, Siam Country Club has four, Phoenix has three —
# different layouts, different green fees. Dropping the qualifier paired
# Golfdigg's "Blue Canyon (Canyon Course)" at 4,300 with ThaiGolfBooking's
# Lakes course at 1,500 and presented them as two quotes for the same round.
VARIANTS = {
    "canyon", "lakes", "lake", "old", "new", "plantation", "waterside", "rolling",
    "hills", "east", "west", "north", "south", "mountain", "ocean", "valley",
    "highland", "lakeside", "gold", "emerald", "ruby", "jade", "pine", "palm",
    "a", "b", "c", "i", "ii", "iii",
}


def variant_tokens(name: str) -> set[str]:
    """Course-variant words anywhere in the name, including inside parentheses."""
    s = _ascii(name or "").lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return {t for t in s.split() if t in VARIANTS}


def core_tokens(name: str) -> list[str]:
    s = _ascii(name or "").lower()
    s = re.sub(r"\([^)]*\)", " ", s)           # drop "(Canyon Course)" style qualifiers
    s = s.replace("&", " ").replace("'", "")
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    toks = [t for t in s.split() if t not in _GENERIC]
    return toks


def core(name: str) -> str:
    return " ".join(core_tokens(name))


def haversine_km(lat1, lng1, lat2, lng2) -> float:
    p = math.pi / 180
    a = 0.5 - math.cos((lat2 - lat1) * p) / 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * (1 - math.cos((lng2 - lng1) * p)) / 2
    return 12742 * math.asin(math.sqrt(a))


def province_in_address(city_label: str, address: str | None) -> bool:
    if not address:
        return False
    a = _ascii(address).lower()
    a_sq = a.replace(" ", "").replace("-", "")
    label = (city_label or "").lower()
    cands = _PROVINCE_ALIASES.get(label, []) + [label]
    return any(c and (c in a or c.replace(" ", "") in a_sq) for c in cands)


def load_json(p: Path, default):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default


def evaluate(master: dict, prov: dict) -> tuple[bool, str, float]:
    """-> (accept, reason, score). score is only for ranking accepted candidates."""
    mc, pc = core(master["name"]), core(prov.get("name") or "")
    if not mc or not pc:
        return False, "empty core", 0
    has_geo = bool(master.get("lat") and master.get("lng") and prov.get("lat") and prov.get("lng"))
    dist = haversine_km(master["lat"], master["lng"], prov["lat"], prov["lng"]) if has_geo else None

    # Two courses at one club sit at the same coordinates and share every word
    # except the one that matters. When both sides name a variant they have to
    # name the same one; when only one side does, the pairing is a guess and a
    # guess here publishes one course's green fee under another's name.
    mv, pv = variant_tokens(master["name"]), variant_tokens(prov.get("name") or "")
    if mv != pv and (mv or pv):
        return False, f"course variant mismatch ({sorted(mv) or '-'} vs {sorted(pv) or '-'})", 0

    if mc == pc:
        if dist is not None and dist > SAME_NAME_MAX_KM:
            return False, f"equal core but {dist:.0f} km apart", 0
        return True, f"equal core '{mc}'" + (f", {dist:.1f} km" if dist is not None else ""), 100 + (0 if dist is None else max(0, 30 - dist))

    ratio = fuzz.token_set_ratio(mc, pc)
    if ratio < FUZZ_MIN:
        return False, f"token_set_ratio {ratio:.0f} < {FUZZ_MIN}", ratio
    mt, pt = core_tokens(master["name"]), core_tokens(prov.get("name") or "")
    if mt[0] != pt[0]:
        return False, f"first token differs ({mt[0]} vs {pt[0]}) ratio {ratio:.0f}", ratio
    if dist is not None:
        if dist <= NEAR_KM:
            return True, f"fuzzy {ratio:.0f}, first token '{mt[0]}', {dist:.1f} km", ratio + (30 - dist * 5)
        return False, f"fuzzy {ratio:.0f} but {dist:.1f} km apart (> {NEAR_KM} km)", ratio
    if province_in_address(master.get("city_label", ""), prov.get("address")):
        return True, f"fuzzy {ratio:.0f}, first token '{mt[0]}', province '{master.get('city_label')}' in address", ratio
    return False, f"fuzzy {ratio:.0f} but no coordinates and province not in address", ratio


def main() -> int:
    db = load_json(MASTER, {})
    courses = db.get("courses") or db.get("restaurants") or []
    overrides = load_json(OVERRIDES, {"block": [], "force": {}})
    blocked = {(b["provider"], b["slug"], b.get("course_id")) for b in overrides.get("block", [])}
    blocked_any = {(p, s) for (p, s, cid) in blocked if cid is None}
    forced: dict[str, dict[str, str]] = overrides.get("force", {})

    registry: dict[str, dict[str, str]] = {}
    rejects: list[dict] = []
    stats: dict[str, dict] = {}

    # forced pairs first — they own their slugs
    forced_slugs = {(p, s) for cid, m in forced.items() for p, s in m.items()}
    for cid, m in forced.items():
        registry.setdefault(cid, {}).update(m)

    by_id = {c["id"]: c for c in courses}
    for provider in PROVIDERS:
        pdata = load_json(PROVIDERS_DIR / f"{provider}.json", {"courses": []})
        pcourses = pdata.get("courses", [])
        taken_courses = {cid for cid, m in registry.items() if provider in m}
        claims: list[tuple[float, str, str, str]] = []  # (score, course_id, slug, reason)
        unmatched = 0
        for prov in pcourses:
            slug = prov["slug"]
            if (provider, slug) in forced_slugs:
                continue
            if (provider, slug) in blocked_any:
                rejects.append({"provider": provider, "slug": slug, "provider_name": prov.get("name"),
                                "reason": "blocked by provider_overrides.json"})
                continue
            best_reject = None
            found = False
            for m in courses:
                if (provider, slug, m["id"]) in blocked:
                    rejects.append({"provider": provider, "slug": slug, "provider_name": prov.get("name"),
                                    "course_id": m["id"], "course_name": m["name"],
                                    "reason": "blocked by provider_overrides.json"})
                    continue
                ok, reason, score = evaluate(m, prov)
                if ok:
                    claims.append((score, m["id"], slug, reason))
                    found = True
                elif score >= 75 and (best_reject is None or score > best_reject[0]):
                    best_reject = (score, m, reason)
            if not found:
                unmatched += 1
                rej = {"provider": provider, "slug": slug, "provider_name": prov.get("name"),
                       "provider_address": prov.get("address"), "reason": "no candidate accepted"}
                if best_reject:
                    rej.update({"nearest_course_id": best_reject[1]["id"], "nearest_course_name": best_reject[1]["name"],
                                "nearest_city": best_reject[1].get("city_label"), "nearest_reason": best_reject[2]})
                rejects.append(rej)

        # one-to-one: highest score wins, both the slug and the course are consumed
        claims.sort(key=lambda t: -t[0])
        used_slugs: set[str] = set()
        for score, cid, slug, reason in claims:
            if slug in used_slugs or cid in taken_courses:
                rejects.append({"provider": provider, "slug": slug, "course_id": cid, "course_name": by_id[cid]["name"],
                                "reason": f"lost one-to-one tie-break ({reason})"})
                continue
            used_slugs.add(slug)
            taken_courses.add(cid)
            registry.setdefault(cid, {})[provider] = slug
        stats[provider] = {"provider_courses": len(pcourses), "matched": len(used_slugs) + sum(1 for m in forced.values() if provider in m),
                           "unmatched": unmatched}

    registry = {cid: dict(sorted(m.items())) for cid, m in sorted(registry.items())}
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    scratch = Path(os.environ.get("GOLF_REGISTRY_REJECTS") or (cache_dir("golfdigg").parent / "registry_rejects.json"))
    scratch.parent.mkdir(parents=True, exist_ok=True)
    scratch.write_text(json.dumps(rejects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    both = [cid for cid, m in registry.items() if len(m) >= 2]
    print("provider stats:", json.dumps(stats))
    print(f"registry: {len(registry)} master courses with >=1 provider, {len(both)} with >=2")
    for cid in both:
        print("  BOTH", cid, by_id.get(cid, {}).get("name"), registry[cid])
    print(f"rejects: {len(rejects)} -> {scratch}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
