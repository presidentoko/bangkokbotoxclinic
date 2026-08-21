#!/usr/bin/env python3
"""
Rewrite non-ASCII venue slugs in web-thaigle's niche data to ASCII.

Why: every activity detail page whose slug contains Thai script is dead in
production. Verified against the live site — 663 qualifying pages return
HTTP 200 carrying Next's NEXT_HTTP_ERROR_FALLBACK;404 marker and an empty
loading skeleton, while an ASCII-slugged control on the same route returns a
full page. It is not an encoding or a Unicode-normalisation problem (raw,
NFC and NFD requests all fail identically) and it is not filename length (a
31-character slug fails the same way as a 616-byte one). Non-ASCII static
params simply are not served on this route.

So the URLs are worthless as they stand: they cannot rank, they cannot be
read, and because they answer 200 they are worse than a clean 404 — Google
can index them as empty pages. Rewriting them to ASCII costs no indexing
(there is none to lose) and returns 663 pages to the site.

The trailing unique suffix each slug already carries is preserved, so the new
slug stays unique without inventing anything. A slug that collapses to just
the niche prefix keeps its suffix and is therefore still distinct.

Usage:
    python scripts/ascii_niche_slugs.py [--dry-run]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"

NON_ASCII_RUN = re.compile(r"[^\x00-\x7F]+")


def asciify(slug: str) -> str:
    # Decompose first so accented Latin (café -> cafe) survives as letters
    # rather than being deleted wholesale with the Thai.
    decomposed = unicodedata.normalize("NFKD", slug)
    stripped = "".join(c for c in decomposed if not unicodedata.combining(c))
    out = NON_ASCII_RUN.sub("-", stripped)
    out = re.sub(r"[^a-zA-Z0-9-]+", "-", out)
    out = re.sub(r"-{2,}", "-", out).strip("-").lower()
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    grand_total = grand_changed = 0
    for path in sorted(NICHE_DIR.glob("*.json")):
        db = json.loads(path.read_text(encoding="utf-8"))
        places = db["places"]
        taken = {p["slug"] for p in places}
        changed = 0
        collisions = 0

        for p in places:
            old = p["slug"]
            if old.isascii():
                continue
            new = asciify(old)
            if not new:
                # Nothing survived. Fall back to the place id, which is
                # already unique and already ASCII.
                new = f"{db.get('niche', path.stem)}-{p['id'][-8:].lower()}"
            if new in taken and new != old:
                collisions += 1
                base = new
                i = 2
                while new in taken:
                    new = f"{base}-{i}"
                    i += 1
            taken.discard(old)
            taken.add(new)
            p["slug"] = new
            changed += 1

        grand_total += len(places)
        grand_changed += changed
        if changed:
            print(f"[slug] {path.stem}: {changed} rewritten"
                  + (f" ({collisions} collision(s) resolved)" if collisions else ""))
            # Assert uniqueness survived, per file.
            slugs = [p["slug"] for p in places]
            assert len(slugs) == len(set(slugs)), f"{path.stem}: duplicate slugs after rewrite"
            assert all(s.isascii() and s for s in slugs), f"{path.stem}: non-ascii or empty slug remains"
            if not args.dry_run:
                db["generated_at"] = (
                    dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
                )
                path.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"\n[slug] {grand_changed} rewritten across {grand_total} places")
    if args.dry_run:
        print("[slug] --dry-run, nothing written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
