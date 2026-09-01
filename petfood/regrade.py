"""Re-apply the current ingredient dictionary to every stored panel.

Grades are cached on each product as ``green_count``/``yellow_count``/... at
scrape time, so extending ``ingredient_grades.py`` changes nothing on the site
until those counts are recomputed. Every dictionary edit needs this run after
it, or the new terms only affect products scraped from then on.

This deliberately does *not* re-parse the panels the way
``rebuild_ingredients.py`` does. That script rejoins the stored rows and runs
the splitter over them again, which re-segments panels and costs ~33 products
their grade for reasons unrelated to the dictionary. Here the row text is
untouched and only the verdicts are recomputed.

    python -m petfood.regrade --dry-run
    python -m petfood.regrade
"""

from __future__ import annotations

import argparse
import json
import shutil
from collections import Counter

from petfood.ingredient_grades import grade_ingredient
from petfood.paths import FOODS

# Mirrors lib/grading.ts. The TS side is the one users see.
MIN_SCORED = 3
MIN_COVERAGE = 0.5


def grade_of(c: dict) -> str | None:
    g, y, r, b = c["green_count"], c["yellow_count"], c["red_count"], c["black_count"]
    scored = g + y + r + b
    if scored < MIN_SCORED:
        return None
    total = c.get("ing_total") or scored
    if total > 0 and (scored + c.get("neutral_count", 0)) / total < MIN_COVERAGE:
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
    return "C" if y > g else "B"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    foods = json.loads(FOODS.read_text(encoding="utf-8"))
    before = Counter(grade_of(f) or "-" for f in foods)
    moved = Counter()
    changed_products = 0

    for f in foods:
        rows = f.get("ingredients") or []
        if not rows:
            continue
        counts = Counter()
        product_changed = False
        for row in rows:
            new = grade_ingredient(row["name"])
            if new != row.get("grade"):
                moved[f"{row.get('grade')} -> {new}"] += 1
                product_changed = True
                if not args.dry_run:
                    row["grade"] = new
            counts[new] += 1
        if product_changed:
            changed_products += 1
        new_counts = {
            "green_count": counts["green"], "yellow_count": counts["yellow"],
            "red_count": counts["red"], "black_count": counts["black"],
            "neutral_count": counts["neutral"], "unknown_count": counts["unknown"],
            "ing_total": len(rows),
        }
        if not args.dry_run:
            f.update(new_counts)
        else:
            f["_after"] = new_counts

    after = Counter(
        grade_of(f.pop("_after") if args.dry_run and "_after" in f else f) or "-"
        for f in foods
    )

    order = ["A", "B", "C", "D", "F", "-"]
    print(f"products            {len(foods)}")
    print(f"products re-graded  {changed_products}")
    print("\ngrade before  " + "  ".join(f"{k}:{before[k]}" for k in order))
    print("grade after   " + "  ".join(f"{k}:{after[k]}" for k in order))
    print("\nverdict moves:")
    for k, n in moved.most_common(15):
        print(f"  {n:>5}  {k}")

    if args.dry_run:
        print("\n--dry-run: no file written")
        return

    shutil.copy2(FOODS, FOODS.with_suffix(".json.regradebak"))
    FOODS.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWritten → {FOODS}")


if __name__ == "__main__":
    main()
