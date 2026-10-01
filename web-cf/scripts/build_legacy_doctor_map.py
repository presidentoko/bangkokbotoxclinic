"""Recover the doctor URLs that vanished when a doctor left the data.

Until 2026-07-31 a doctor page lived at `/doctor/<name>-at-<clinic name slug>`.
The shape then changed to `<name>-at-<12 hex of the place id>`, and lib/data.ts
redirects the old shape for every doctor still in master_db.

That leaves the ones that are *gone*: a doctor whose name stopped appearing in
the clinic's reviews drops out of `doctor_stats`, and their URL — which Google
still has, and still crawls — 404s. Nothing in the current data names them, so
a pattern rule is impossible: both halves of the slug contain hyphens, and a
wildcard cannot tell where the doctor's name ends.

But git does name them. Every master_db revision from before the format change
is still in history, so the vanished slugs are a finite, enumerable set: this
walks those revisions, unions the doctor slugs, drops the ones the live data
still covers, and keeps the ones whose clinic survives. 762 URLs at the time of
writing, each with a clinic to send the visitor to.

The output is committed; re-run only after a long gap, since slugs can only
leave this set (a doctor coming back is handled by legacyDoctorSlugMap).

    python scripts/build_legacy_doctor_map.py          # writes data/legacy-doctors.json
    python scripts/build_legacy_doctor_map.py --report
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import date
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
REPO = WEB.parent
DB = WEB / "data" / "master_db.json"
OUT = WEB / "data" / "legacy-doctors.json"

# The format changed on 2026-07-31; revisions after that already use the current
# shape, and revisions before 2026-05-06 are not in history.
CUTOFF = "2026-07-31"
# One revision a week is plenty — doctor_stats moves with review scrapes, not
# with individual commits, and sampling every one of the 729 revisions costs
# minutes for a handful of extra slugs.
SAMPLE_EVERY_DAYS = 7


def slugify(s: str) -> str:
    """lib/data.ts slugify: keeps Thai, collapses everything else to hyphens."""
    return re.sub(r"[^a-z0-9฀-๿]+", "-", (s or "").lower()).strip("-")


def legacy_slug(doctor_slug: str, clinic_name: str) -> str:
    return f"{doctor_slug}-at-{slugify(clinic_name)[:50]}"


def git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=REPO, capture_output=True, text=True, encoding="utf-8", check=True
    ).stdout


def revisions() -> list[tuple[str, str]]:
    """(sha, date) for the tracked master_db, thinned to one a week."""
    log = git("log", "--format=%h %ad", "--date=short", f"--until={CUTOFF}",
              "--", "web/data/master_db.json")
    rows = [line.split() for line in log.splitlines() if line.strip()]
    picked: list[tuple[str, str]] = []
    last: date | None = None
    for sha, day in rows:  # newest first
        d = date.fromisoformat(day)
        if last is None or (last - d).days >= SAMPLE_EVERY_DAYS:
            picked.append((sha, day))
            last = d
    if rows and picked[-1][0] != rows[-1][0]:
        picked.append(tuple(rows[-1]))  # always include the oldest
    return picked


def doctors_at(sha: str) -> dict[str, str]:
    """legacy doctor slug -> clinic id, as of that revision."""
    raw = subprocess.run(
        ["git", "show", f"{sha}:web/data/master_db.json"],
        cwd=REPO, capture_output=True, check=True,
    ).stdout
    db = json.loads(raw.decode("utf-8"))
    out: dict[str, str] = {}
    for c in db.get("clinics", []):
        for d in c.get("doctor_stats") or []:
            if d.get("slug"):
                out.setdefault(legacy_slug(d["slug"], c.get("name") or ""), c["id"])
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    live = json.loads(DB.read_text(encoding="utf-8"))
    live_clinics = {c["id"]: c for c in live["clinics"]}
    # Slugs the live data already answers: legacyDoctorSlugMap redirects these,
    # and the doctor's own current URL must not be shadowed either.
    covered: set[str] = set()
    for c in live["clinics"]:
        for d in c.get("doctor_stats") or []:
            if not d.get("slug"):
                continue
            covered.add(legacy_slug(d["slug"], c.get("name") or ""))
            if d.get("composite_slug"):
                covered.add(d["composite_slug"])

    seen: dict[str, str] = {}
    revs = revisions()
    for sha, day in revs:
        for slug, cid in doctors_at(sha).items():
            seen.setdefault(slug, cid)
        print(f"  {day} {sha}: {len(seen)} slugs seen")

    gone = {s: cid for s, cid in sorted(seen.items())
            if s not in covered and cid in live_clinics}
    dropped_clinic = sum(1 for s, cid in seen.items()
                         if s not in covered and cid not in live_clinics)

    OUT.write_text(json.dumps({
        "generated": date.today().isoformat(),
        "revisions": len(revs),
        "note": "legacy /doctor/<name>-at-<clinic name> slug -> clinic id, "
                "for doctors no longer in master_db. The page 301s to the clinic.",
        "doctors": gone,
    }, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"revisions {len(revs)} · slugs seen {len(seen)} · live data covers "
          f"{len(seen) - len(gone) - dropped_clinic} · clinic also gone {dropped_clinic} "
          f"· written {len(gone)}")
    if args.report:
        for s, cid in list(gone.items())[:40]:
            print(f"  /doctor/{s}  ->  {live_clinics[cid].get('name')}")


if __name__ == "__main__":
    main()
