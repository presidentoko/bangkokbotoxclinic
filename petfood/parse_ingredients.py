"""Turn a scraped ingredient panel into graded ingredient rows.

The previous implementation was ``raw.split(",")``. Product pages do not hand
over a clean panel — the scraped text runs on into marketing copy, guaranteed
analysis rows and, on Hill's pages, untranslated i18n keys. Splitting all of
that on commas produced "ingredients" like *After years of research* (published
on 384 products), *pa.mixFeedingSection.currentProduct*, and a 562-word
paragraph. Splitting inside parentheses broke real rows in half too, leaving
``Vitamins (Vitamin E Supplement`` and ``Mixed Tocopherols)`` as separate items.

So: split on top-level commas only, cut the panel at the first line that is
clearly no longer an ingredient list, and drop rows that do not look like an
ingredient name.
"""

from __future__ import annotations

import re

from petfood.ingredient_grades import grade_ingredient

# Once one of these appears the panel has ended and prose has begun. Everything
# from the match onward is discarded.
_STOP_MARKERS = (
    "after years of research",
    "experts at hill",
    "pa.mixfeeding",
    "pa.product",
    "it's a great idea",
    "it’s a great idea",
    "they get to enjoy",
    "guaranteed analysis",
    "การวิเคราะห์รับรอง",
    "ส่วนประกอบที่รับรอง",
    "feeding guide",
    "feeding instructions",
    "คำแนะนำการให้อาหาร",
    "calorie content",
    "kcal/kg",
    "may contain",
    "manufactured in",
    "made in the usa",
    "learn more",
    "shop now",
)

# A row matching any of these is not an ingredient, even in the middle of a panel.
_REJECT_PATTERNS = (
    re.compile(r"^[a-z][a-z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*){2,}$"),  # pa.mixFeeding.currentProduct
    re.compile(r"^\s*$"),
    re.compile(r"^\d+(\.\d+)?\s*%?$"),                            # a bare number
    # Thai guaranteed-analysis rows. No \b here: Thai script has no word breaks,
    # so "ไขมันไม่น้อยกว่า 14%" only matches an unanchored search.
    re.compile(r"ไม่มากกว่า|ไม่น้อยกว่า|ความชื้น|วิเคราะห์ส่วนประกอบ"),
    re.compile(r"\b(not more than|not less than|min\.|max\.)\b", re.I),
    re.compile(r"https?://|www\."),
    re.compile(r"[<>]|&[a-z]+;|^\"|^'"),   # markup that leaked out of the page
    re.compile(r"!"),                       # ad copy: "...reward for your pup!"
    # A sentence boundary, but not an abbreviation: "G.A.P. Step 2 Chicken"
    # is a real ingredient, "...research. Experts at" is prose.
    re.compile(r"[a-z]{2}[.!?]\s+[A-Z]"),
    re.compile(r"^(and|or|with|such as|that way|in the wild|it|they|we|you|"
               r"this|these|helps?|supports?|provides?|contains?)\b", re.I),
    re.compile(r"\b(is|are|was|were|has|have|helps|supports|provides|contains|"
               r"determined|research|believe|recommend)\b", re.I),
)

# An ingredient panel row is a noun phrase. Anything much longer is prose that
# happened not to contain a comma.
_MAX_WORDS = 8
_MAX_CHARS = 70

# ...except a labelled group, which is one ingredient with its contents spelled
# out inside brackets: "Vitamins (Vitamin E Supplement, Niacin Supplement, ...)".
# Top-level comma splitting keeps these whole, and they routinely run past the
# limits above, so they get their own budget rather than being thrown away.
_GROUP_ROW = re.compile(r"^[\w\s&/'-]{3,40}\([^()]{3,400}\)$")
_MAX_GROUP_CHARS = 400


def _split_top_level(raw: str) -> list[str]:
    """Split on commas that are not inside brackets."""
    parts: list[str] = []
    buf: list[str] = []
    depth = 0
    for ch in raw:
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth = max(0, depth - 1)
        if ch == "," and depth == 0:
            parts.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
    parts.append("".join(buf))
    return parts


def _truncate_at_boilerplate(raw: str) -> str:
    lowered = raw.lower()
    cut = len(raw)
    for marker in _STOP_MARKERS:
        idx = lowered.find(marker)
        if idx != -1:
            cut = min(cut, idx)
    return raw[:cut]


def is_ingredient_row(text: str) -> bool:
    """Whether a split fragment reads like an ingredient name."""
    t = text.strip().strip(".;:*-–—").strip()
    if not t or "\n" in t:
        return False
    if _GROUP_ROW.match(t):
        # A labelled group is one ingredient; judge it by its own budget.
        return len(t) <= _MAX_GROUP_CHARS
    if len(t) > _MAX_CHARS or len(t.split()) > _MAX_WORDS:
        return False
    for pattern in _REJECT_PATTERNS:
        if pattern.search(t):
            return False
    # Ingredient panels are written in Title Case. A run of three or more
    # all-lowercase Latin words is a sentence fragment the splitter picked up
    # mid-prose — "hydration and dental support", "training treats or anytime
    # rewards". Short lowercase rows ("wheat", "corn") are left alone, as are
    # Thai rows, which have no case to inspect.
    words = t.split()
    if len(words) >= 3 and t.isascii() and not any(w[:1].isupper() for w in words):
        return False
    # Needs at least one letter in some script; "10.5%" and "(a)" are not rows.
    return bool(re.search(r"[a-zA-Z฀-๿]", t))


def clean_ingredient_name(text: str) -> str:
    """Tidy a row for display without changing which ingredient it names."""
    t = text.strip().strip(".;:*").strip()
    t = re.sub(r"\s+", " ", t)
    # Balance a parenthesis the source left open, e.g. "Vitamins (Vitamin E".
    if t.count("(") > t.count(")"):
        t += ")"
    elif t.count(")") > t.count("(") and t.endswith(")"):
        t = t[:-1]
    return t.strip()


def parse_ingredients(raw: str) -> list[dict]:
    """Parse a scraped panel into graded rows, discarding non-ingredient text."""
    if not raw or not raw.strip():
        return []

    rows: list[dict] = []
    for fragment in _split_top_level(_truncate_at_boilerplate(raw)):
        if not is_ingredient_row(fragment):
            continue
        name = clean_ingredient_name(fragment)
        if not name:
            continue
        rows.append({
            "name": name,
            "grade": grade_ingredient(name),
            "position": len(rows) + 1,
        })
    return rows


def calc_dry_matter(pct: float, moisture_pct: float) -> float:
    """Convert as-fed % to dry matter basis %."""
    dm_factor = 1.0 - (moisture_pct / 100.0)
    if dm_factor <= 0:
        return 0.0
    return round(pct / dm_factor, 1)


def meets_aafco(protein_dm: float, fat_dm: float, life_stage: str) -> bool:
    """Check AAFCO minimums."""
    if life_stage in ("puppy", "kitten"):
        return protein_dm >= 22.0 and fat_dm >= 8.0
    return protein_dm >= 18.0 and fat_dm >= 5.5


def score_food(ingredients: list[dict]) -> dict:
    """Count the quality-bearing verdicts.

    ``neutral`` and ``unknown`` are deliberately absent from the counters: a
    vitamin premix is not a mediocre ingredient, and an unrecognised string is
    not an ingredient verdict at all. ``ing_total`` lets the site show how much
    of the panel the grade actually rests on.
    """
    counts = {
        "green_count": 0, "yellow_count": 0, "red_count": 0, "black_count": 0,
        "neutral_count": 0, "unknown_count": 0,
    }
    for ing in ingredients:
        key = f"{ing['grade']}_count"
        if key in counts:
            counts[key] += 1
    counts["ing_total"] = len(ingredients)
    return counts
