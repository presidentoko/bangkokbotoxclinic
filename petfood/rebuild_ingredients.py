"""Re-parse and re-grade every stored ingredient panel in place.

The panels in ``data/petfood.json`` were produced by the old comma-splitter, so
they carry marketing prose, guaranteed-analysis rows and i18n keys as if those
were ingredients. The rows are still in source order, so joining them back with
", " reconstructs the panel closely enough to run the corrected parser over it —
no re-scrape needed to stop publishing the junk.

Run with --dry-run first; it prints the before/after grade distribution and the
rows it would drop, without touching the file.

    python -m petfood.rebuild_ingredients --dry-run
    python -m petfood.rebuild_ingredients
"""

from __future__ import annotations

import argparse
import json
import shutil
from collections import Counter
from pathlib import Path

from petfood.parse_ingredients import parse_ingredients, score_food

DATA = Path(__file__).resolve().parent.parent / "web-petbkk" / "data" / "petfood.json"

# Mirrors lib/grading.ts. Kept in sync by hand; the TS side is the one users see.
MIN_SCORED = 3
MIN_COVERAGE = 0.5


def grade(counts: dict) -> str | None:
    g = counts["green_count"]
    y = counts["yellow_count"]
    r = counts["red_count"]
    b = counts["black_count"]
    scored = g + y + r + b
    total = counts.get("ing_total", 0)
    # Coverage counts neutral rows as recognised: a vitamin premix is understood,
    # it just carries no quality signal. Only `unknown` rows count against us.
    recognized = scored + counts.get("neutral_count", 0)
    if scored < MIN_SCORED:
        return None
    if total and recognized / total < MIN_COVERAGE:
        return None
    if b >= 2:
        return "F"
    if b == 1 or r > 3:
        return "D"
    if r > 1:
        return "C"
    if r == 1:
        return "B"
    ratio = g / scored
    if ratio >= 0.7:
        return "A"
    if ratio >= 0.4:
        return "B"
    if y > g:
        return "C"
    return "B"


def old_grade(f: dict) -> str | None:
    g, y, r, b = (f.get(k, 0) for k in
                  ("green_count", "yellow_count", "red_count", "black_count"))
    if g + y + r + b == 0:
        return None
    if b >= 2:
        return "F"
    if b == 1 or r > 3:
        return "D"
    if r > 1:
        return "C"
    if r == 1:
        return "B"
    if g / (g + y + r + b) >= 0.7:
        return "A"
    if y > g:
        return "C"
    return "B"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--show", type=int, default=12, help="sample rows to print")
    args = ap.parse_args()

    foods = json.loads(DATA.read_text(encoding="utf-8"))

    before = Counter(old_grade(f) for f in foods)
    dropped: Counter[str] = Counter()
    kept_rows = 0
    old_rows = 0
    emptied = 0

    for f in foods:
        old = f.get("ingredients") or []
        old_rows += len(old)
        if not old:
            f.update(score_food([]))
            continue

        raw = ", ".join(i["name"] for i in old)
        new = parse_ingredients(raw)
        kept_rows += len(new)

        kept_names = {i["name"] for i in new}
        for i in old:
            if i["name"] not in kept_names:
                dropped[i["name"][:70]] += 1

        if old and not new:
            emptied += 1

        f["ingredients"] = new
        f.update(score_food(new))

    after = Counter(grade(f) for f in foods)

    def fmt(c: Counter) -> str:
        order = ["A", "B", "C", "D", "F", None]
        return "  ".join(f"{k or '–'}:{c.get(k, 0)}" for k in order)

    print(f"products            {len(foods)}")
    print(f"ingredient rows     {old_rows} -> {kept_rows}  "
          f"({old_rows - kept_rows} dropped)")
    print(f"panels emptied      {emptied}")
    print(f"distinct junk rows  {len(dropped)}")
    print()
    print(f"grade before   {fmt(before)}")
    print(f"grade after    {fmt(after)}")
    print()
    print("most-published junk rows now dropped:")
    for name, n in dropped.most_common(args.show):
        print(f"  {n:4}  {name}")

    if args.dry_run:
        print("\n--dry-run: no file written")
        return

    backup = DATA.with_suffix(".json.bak")
    shutil.copy2(DATA, backup)
    DATA.write_text(json.dumps(foods, ensure_ascii=False), encoding="utf-8")
    print(f"\nwrote {DATA}  (backup at {backup.name})")


if __name__ == "__main__":
    main()
