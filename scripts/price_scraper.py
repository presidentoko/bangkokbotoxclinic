#!/usr/bin/env python3
"""Collect green fees from every booking provider, then rebuild the registry.

This used to be a scraper of its own: it read Golfdigg's *area listing* pages,
took the one headline price each card shows, and manufactured the rest —

    caddy   = 400          (constant, on every course)
    cart    = 800          (constant, on every course)
    weekend = weekday x 1.30
    source_url = a slug guessed from the course name

None of those four things were true. Nikanti Golf Club charges 6,500 at the
weekend, not 7,150, and its rate already includes the cart and the caddy; the
site was publishing the invented figures into schema.org Offers. Golfdigg's own
course pages carry greenFeeWD, greenFeeWE, holes, par and an inclusions list,
and ThaiGolfBooking publishes weekday, weekend, caddy, cart and club rental —
so the guessing was never necessary.

This file is now a thin orchestrator, kept at its old path because
.github/workflows/scrape-prices.yml calls it by name.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STEPS = [
    ("golfdigg", HERE / "golf_providers" / "golfdigg_scraper.py"),
    ("thaigolfbooking", HERE / "golf_providers" / "thaigolfbooking_scraper.py"),
    ("registry", HERE / "golf_providers" / "build_registry.py"),
]


def main() -> int:
    failures = []
    for name, script in STEPS:
        print(f"\n=== {name} ===", flush=True)
        rc = subprocess.call([sys.executable, str(script)])
        if rc != 0:
            print(f"[price_scraper] {name} exited {rc}", file=sys.stderr)
            failures.append(name)
    if failures:
        # A provider being unreachable must not wipe the data we already have:
        # each scraper leaves its own file untouched when it parses nothing, and
        # the registry step still runs against whatever is on disk.
        print(f"[price_scraper] failed steps: {', '.join(failures)}", file=sys.stderr)
        return 1
    print("\n[price_scraper] all providers refreshed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
