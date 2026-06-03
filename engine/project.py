from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def slugify(text: str) -> str:
    """Convert text to a URL-safe ASCII slug. Thai/non-ASCII characters are stripped."""
    text = text.lower().strip()
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def project(procedure: str, canonical_path: Path, out_path: Path) -> int:
    """Filter canonical.json to clinics tagged with `procedure`, add unique slugs."""
    data = json.loads(canonical_path.read_text(encoding="utf-8"))
    filtered = [c for c in data if procedure in c.get("procedures", [])]

    seen: dict[str, int] = {}
    for c in filtered:
        base = slugify(f"{c['name']}-{c['city']}") or c["place_id"][:12]
        count = seen.get(base, 0)
        c["slug"] = base if count == 0 else f"{base}-{count}"
        seen[base] = count + 1

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(filtered, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return len(filtered)


def main() -> None:
    procedure = sys.argv[1] if len(sys.argv) > 1 else "dental"
    repo_root = Path(__file__).resolve().parent.parent
    canonical = repo_root / "engine" / "data" / "canonical.json"
    out = repo_root / f"web-{procedure}" / "data" / f"{procedure}.json"
    count = project(procedure, canonical, out)
    print(f"[project] {procedure}: {count} clinics → {out}")


if __name__ == "__main__":
    sys.exit(main())
