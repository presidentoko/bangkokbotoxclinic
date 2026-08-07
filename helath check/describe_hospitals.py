"""Write hospital descriptions and specialty lists from the cached websites.

The paid half of the site-parsing pipeline. parse_hospital_sites.py already
pulls the fields that are stated as plain facts (email, founding year, bed
count, accreditations) with regexes, for free — this handles the two that are
genuinely prose and need summarising: `description` and `specialties`.

    python describe_hospitals.py --estimate        # token/cost estimate, no API calls
    python describe_hospitals.py --limit 5         # try a handful first
    python describe_hospitals.py                   # the rest

Input is capped at MAX_CHARS per hospital, which is what keeps this affordable:
the About page's first few thousand characters carry the profile, while the
rest of a hospital site is navigation, promotions and news. Only hospitals with
a blank description are processed, so re-runs cost nothing for work already done
and an interrupted run resumes where it stopped.
"""

import argparse
import html as htmllib
import json
import os
import re
import sys
from pathlib import Path

import pymysql

from config import DB_CONFIG

HERE = Path(__file__).parent
CACHE = HERE / "site_cache"

# Haiku, chosen deliberately: the job is "read this About page and say what
# this clinic is" — reading comprehension over short, capped input, not
# reasoning. Roughly a fifth the cost of Opus across ~200 providers. Override
# with --model if a spot-check shows the summaries are too thin.
MODEL = "claude-haiku-4-5"
MAX_CHARS = 6000

SCRIPT_STYLE = re.compile(r"<(script|style|noscript)\b[^>]*>.*?</\1>", re.S | re.I)
TAG = re.compile(r"<[^>]+>")

SYSTEM = """You summarise Thai hospital and clinic websites for a health check-up
price-comparison directory. Work only from the page text you are given. If the
text does not support a field, return null for it rather than guessing — a wrong
detail about a medical provider is worse than a missing one."""

SCHEMA = {
    "type": "object",
    "properties": {
        "description": {
            "type": ["string", "null"],
            "description": "2-3 plain sentences on what this provider is and who it serves. No marketing language, no superlatives. Null if the text doesn't say.",
        },
        "specialties": {
            "type": ["string", "null"],
            "description": "Comma-separated medical specialties actually offered, e.g. 'Cardiology, Oncology, Dermatology'. Max 8. Null if the text doesn't say.",
        },
    },
    "required": ["description", "specialties"],
    "additionalProperties": False,
}


def visible_text(raw: str) -> str:
    raw = SCRIPT_STYLE.sub(" ", raw)
    raw = TAG.sub(" ", raw)
    return re.sub(r"\s+", " ", htmllib.unescape(raw)).strip()


def page_text(d: Path) -> str:
    """Prefer the about page — it carries the profile; index pages are chrome."""
    files = sorted(d.glob("*.html"), key=lambda f: (0 if "about" in f.name else 1, f.name))
    out = []
    total = 0
    for f in files:
        t = visible_text(f.read_text(encoding="utf-8", errors="replace"))
        if len(t) < 200:
            continue
        out.append(t[: MAX_CHARS - total])
        total += len(out[-1])
        if total >= MAX_CHARS:
            break
    return " ".join(out)[:MAX_CHARS]


def collect(cur, limit: int) -> list[tuple[int, str, str]]:
    cur.execute(
        "SELECT slug, id, name FROM hospitals "
        "WHERE (description IS NULL OR description = '') AND permanently_closed = 0"
    )
    wanted = {r[0]: (r[1], r[2]) for r in cur.fetchall()}
    jobs = []
    for d in sorted(CACHE.iterdir()):
        if not d.is_dir() or d.name not in wanted:
            continue
        text = page_text(d)
        if len(text) < 400:
            continue
        hid, name = wanted[d.name]
        jobs.append((hid, name, text))
        if limit and len(jobs) >= limit:
            break
    return jobs


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--estimate", action="store_true", help="print cost estimate, make no API calls")
    ap.add_argument("--model", default=MODEL)
    args = ap.parse_args()

    if not CACHE.exists():
        return print("no site_cache/ — run fetch_hospital_sites.py first") or 1

    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()
    jobs = collect(cur, args.limit)
    print(f"hospitals to describe: {len(jobs)}")

    if args.estimate:
        chars = sum(len(t) for _, _, t in jobs)
        # ~4 chars/token is the usual English rule of thumb; Thai runs denser,
        # so treat this as a floor, not a promise.
        tok_in = chars / 4 + len(jobs) * 300   # + system prompt and schema per call
        tok_out = len(jobs) * 250
        print(f"  input chars   : {chars:,}")
        print(f"  est. input tok: {tok_in:,.0f}")
        print(f"  est. output tok: {tok_out:,.0f}")
        for name, i, o in [("claude-opus-5", 5, 25), ("claude-sonnet-5", 3, 15), ("claude-haiku-4-5", 1, 5)]:
            cost = tok_in / 1e6 * i + tok_out / 1e6 * o
            print(f"  {name:<18} ~${cost:,.2f}")
        conn.close()
        return 0

    try:
        import anthropic
    except ImportError:
        return print("pip install anthropic") or 1
    if not os.getenv("ANTHROPIC_API_KEY"):
        for line in (HERE / ".env").read_text(encoding="utf-8").splitlines():
            if line.startswith("ANTHROPIC_API_KEY="):
                os.environ["ANTHROPIC_API_KEY"] = line.split("=", 1)[1].strip()
    client = anthropic.Anthropic()

    done = 0
    for hid, name, text in jobs:
        try:
            resp = client.messages.create(
                model=args.model,
                max_tokens=1024,
                system=SYSTEM,
                output_config={"format": {"type": "json_schema", "schema": SCHEMA}},
                messages=[{"role": "user", "content": f"Provider: {name}\n\nPage text:\n{text}"}],
            )
            block = next(b for b in resp.content if b.type == "text")
            got = json.loads(block.text)
        except Exception as exc:
            print(f"  ✗ {name[:44]}: {str(exc)[:90]}")
            continue

        desc = (got.get("description") or "").strip() or None
        spec = (got.get("specialties") or "").strip() or None
        if not desc and not spec:
            continue
        # COALESCE: never overwrite a curated value with a generated one.
        cur.execute(
            "UPDATE hospitals SET description = COALESCE(description, %s), "
            "specialties = COALESCE(specialties, %s) WHERE id = %s",
            (desc, spec[:255] if spec else None, hid),
        )
        conn.commit()
        done += 1
        print(f"  ✓ {name[:44]:<44} {(desc or '')[:60]}")

    for label, sql in [
        ("with description", "SELECT COUNT(*) FROM hospitals WHERE description IS NOT NULL AND description<>''"),
        ("with specialties", "SELECT COUNT(*) FROM hospitals WHERE specialties IS NOT NULL AND specialties<>''"),
    ]:
        cur.execute(sql)
        print(f"  {label:>18}: {cur.fetchone()[0]}")
    conn.close()
    print(f"\ndescribed {done} hospital(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
