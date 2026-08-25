# -*- coding: utf-8 -*-
"""
reclassify_found.py — recompute the accept/reject verdict for every scraped
hospital from the raw fields, using the current rules in
scrape_missing_hospitals.py.

The guards were tightened several times while looking at the output — each one
added because a wrong match got through the previous set — and patching
statuses in place as each rule arrived left the file carrying verdicts from
different generations of the rules. This recomputes all of them from the
scraped data, so the file always reflects one consistent set and re-running it
after another rule change is safe.

Nothing here re-fetches anything: name, address and category are already
stored, which is the whole reason the verdict can be replayed offline.

    python reclassify_found.py --found found.json
"""

from __future__ import annotations

import argparse
import collections
import importlib.util
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent


def load_rules():
    spec = importlib.util.spec_from_file_location(
        "scrape_missing_hospitals", HERE / "scrape_missing_hospitals.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def verdict(rules, rec: dict) -> tuple[str, str | None]:
    name = rec.get("name")
    if not name:
        return "no_result", None
    wrong = rules.wrong_kind_of_business(rec["query"], name, rec.get("category"))
    if wrong:
        return "rejected", f"different kind of business ({wrong})"
    if rules.city_mismatch(rec["city"], rec.get("address")):
        return "rejected", f"address is not in {rec['city']}"
    lost = rules.loses_distinctive_word(rec["query"], rec["city"], name)
    if lost:
        return "rejected", f"result does not carry '{lost}'"
    score = rules.match_score(rec["query"], name)
    if score < 0:
        return "needs_review", "non-Latin name, cannot compare automatically"
    if score < rules.MATCH_FLOOR:
        return "rejected", f"name mismatch ({score:.2f})"
    return "ok", None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--found", required=True)
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    rules = load_rules()
    path = pathlib.Path(args.found)
    rows = json.loads(path.read_text(encoding="utf-8"))

    changed = []
    for r in rows:
        before = r.get("status")
        status, reason = verdict(rules, r)
        if status != before:
            changed.append((r, before, status, reason))
        r["status"] = status
        r["reject_reason"] = reason
        if reason is None:
            r.pop("reject_reason", None)
        if status == "ok":
            r["match_score"] = round(rules.match_score(r["query"], r["name"]), 3)
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

    counts = collections.Counter(r["status"] for r in rows)
    print(f"{len(rows)} records: " + ", ".join(f"{k}={v}" for k, v in counts.most_common()))
    if changed and not args.quiet:
        print(f"\n{len(changed)} verdicts changed:")
        for r, before, after, reason in sorted(changed, key=lambda x: -x[0].get("impr", 0)):
            print(f"  {before or '-':<12} -> {after:<12} {r['query'][:32]:<32} "
                  f"-> {str(r.get('name'))[:30]:<30} {reason or ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
