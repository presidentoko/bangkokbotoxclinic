"""Deciding which Thai listings describe which catalogue item.

The failure this guards against is on record: the old scraper asked a search
API for "Patek Philippe Aquanaut 5168G Green Dial", got 30 results of which 7
were Patek, and published a Michael Kors watch as the floor price of a
1.5M baht Patek. Nothing here trusts a result because it came back from a
query — every listing has to earn its match against the title we can read.

Two tiers, because Thai dealers title things tersely:

    our catalogue          typical dealer title
    Hermès Birkin 25       "HERMES  BIRKIN"
    Chanel Classic Flap M  "Used Like New Chanel Coco 10.5 Chevron Caviar"
    Rolex Datejust 41      "Datejust 126334 Blue Dial White Gold Jubilee 41mm."

Tier 1 (variant) demands every token of the model, so "Birkin 25" will not
match a bare "BIRKIN" — a Birkin 25 and a Birkin 35 are different prices and
presenting one as the other is the same lie as the Michael Kors.

Tier 2 (family) drops the size and matches the family, and is published as a
separate, differently-labelled figure: "Birkin, all sizes, 12 listings,
389,000-1,290,000". That is a true statement and a useful one. It is never
used as the item's price.
"""
from __future__ import annotations

import re
import statistics
import unicodedata

# --- normalisation ---------------------------------------------------------

def norm(s: str) -> str:
    """Casefold, strip accents, reduce everything else to single spaces.

    Accent stripping is what lets "Hermès" match a dealer's "HERMES", and the
    punctuation pass handles "Datejust 126334 ... 41mm." and the emoji some
    dealers put in titles ("Tudor Clair de Rose Ref. 35800 🔸Size 34 mm").
    """
    s = unicodedata.normalize('NFD', s or '')
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()


# Dealers write the brand the way their customers search for it.
#
# Every entry is matched as a plain substring of the normalised title, so a
# short one is a loaded gun: "AP" for Audemars Piguet normalised down to the
# bare two letters "ap" and matched "classic FLAP card holder", "BALENCIAGA
# PAPIER" and "damier GRAPHITE" — 164 listings, a tenth of them handbags, and
# a brand "price range" running from a 10,900 baht Gucci wallet to a
# 34,149,000 baht Royal Oak. MIN_NEEDLE is what stops that happening again.
MIN_NEEDLE = 5

BRAND_ALIASES: dict[str, list[str]] = {
    'Hermès': ['hermes'],
    'Saint Laurent': ['saint laurent', 'yves saint laurent'],
    'Van Cleef & Arpels': ['van cleef'],
    'Christian Louboutin': ['louboutin'],
    'Bulgari': ['bulgari', 'bvlgari'],
    'Audemars Piguet': ['audemars piguet', 'audemars'],
    'Bottega Veneta': ['bottega veneta', 'bottega'],
    'Celine': ['celine'],
    'Salvatore Ferragamo': ['ferragamo'],
}

# Watch dealers drop the maison and title by reference: Conrad Time lists
# "Royal Oak 15550ST" and "Nautilus 7118/1200A-010" with no brand anywhere in
# the title, which is 64 of the 91 Audemars Piguet listings on the site. These
# model names are exclusive to one maison, so reading them as the brand is
# safe in a way that a two-letter abbreviation is not.
EXCLUSIVE_MODEL_NAMES: dict[str, list[str]] = {
    'Audemars Piguet': ['royal oak'],
    'Patek Philippe': ['nautilus', 'aquanaut', 'calatrava', 'grand complications'],
    'Rolex': ['datejust', 'submariner', 'daytona', 'gmt master', 'oyster perpetual',
              'sea dweller', 'yacht master', 'explorer ii', 'sky dweller', 'day date'],
    'Omega': ['speedmaster', 'seamaster', 'constellation', 'de ville'],
    'Cartier': ['ballon bleu', 'santos de', 'panthere de'],
    'TAG Heuer': ['carrera', 'aquaracer', 'monaco'],
}

# Words that carry no identifying power in a product title. "bag" and "watch"
# appear in half the catalogue; requiring them costs matches and buys nothing.
STOPWORDS = {
    'bag', 'handbag', 'bags', 'watch', 'the', 'and', 'with', 'de', 'in',
    'size', 'mm', 'cm', 'inch', 'new', 'used',
}

# Trailing qualifiers that name a size rather than a model. Stripping these
# turns a variant into its family: "Birkin 25" -> "birkin", "Evelyne TPM" ->
# "evelyne", "Classic Flap Medium" -> "classic flap".
SIZE_WORDS = {
    'mini', 'small', 'medium', 'large', 'jumbo', 'maxi', 'micro', 'nano',
    'pm', 'mm', 'gm', 'tpm', 'bb', 'pochette', 'compact', 'long',
}


def brand_needles(brand: str) -> list[str]:
    """Substrings that identify this maison in a dealer's title.

    Anything shorter than MIN_NEEDLE is dropped rather than trusted — see the
    note on BRAND_ALIASES for what a two-letter needle did to the data.
    """
    raw = BRAND_ALIASES.get(brand, [brand]) + EXCLUSIVE_MODEL_NAMES.get(brand, [])
    return [n for n in (norm(x) for x in raw) if len(n) >= MIN_NEEDLE]


def model_tokens(model: str) -> list[str]:
    return [t for t in norm(model).split() if t not in STOPWORDS and len(t) > 1]


def family_tokens(model: str) -> list[str]:
    """The model with its size stripped, e.g. "Birkin 25" -> ["birkin"].

    Numbers go too: a bare number in a model name is almost always the size in
    cm or mm (Birkin 25, Kelly 28, Datejust 41, Carré 90). The exceptions are
    references that ARE the model — Chanel's "19", Prada's "Re-Edition 2005" —
    so a token list that empties out falls back to keeping the numbers.
    """
    toks = model_tokens(model)
    trimmed = [t for t in toks if t not in SIZE_WORDS and not t.isdigit()]
    return trimmed or toks


def _token_in(token: str, haystack: str) -> bool:
    """Digits must sit on a token boundary, optionally with a unit suffix.

    Without the boundary, "Kelly 25" matches a listing for a Kelly priced at
    "259,000"; with a bare boundary, "Datejust 41" misses "...Jubilee 41mm."
    """
    if token.isdigit():
        return re.search(r'\b' + re.escape(token) + r'\s?(mm|cm|inch|in|")?\b', haystack) is not None
    return token in haystack


def matches(listing_norm: str, needles: list[str], tokens: list[str]) -> bool:
    if not tokens or not any(n and n in listing_norm for n in needles):
        return False
    return all(_token_in(t, listing_norm) for t in tokens)


# --- size notation ---------------------------------------------------------
#
# Thai dealers size Chanel in inches, the way their customers ask for it: a
# "Classic 10" is the 10-inch Medium, a "Boy 8" is the Small, a "Coco 9.5" is
# the Small Coco Handle. The 19 is sized in centimetres instead ("19 Size 26").
# Every listing quoted below was read off these dealers' live catalogues on
# 2026-08-25; this is a unit conversion, not an inference about unlabelled
# stock. Where a dealer states no size at all — "LOUIS VUITTON SPEEDY", with
# no 25/30/35 — nothing here guesses one, and the item falls to the
# family tier where the label says so.
#
# Patterns run against the normalised title, so they must tolerate the glued
# form: four of the nine Mini 8 listings are written "Mini8". They must also
# be adjacent rather than two loose tokens — "mini" plus a stray "7" pulled in
# a "Messenger Bag 7.5”", which is not a Mini Flap at any price.

ALIAS_PATTERNS: dict[str, re.Pattern] = {
    slug: re.compile(pattern)
    for slug, pattern in {
        'chanel/classic-flap-medium': r'classic\s?10\b',
        'chanel/classic-flap-small': r'classic\s?9\b',
        'chanel/classic-flap-jumbo': r'\bjumbo\b|classic\s?12\b',
        'chanel/classic-flap-mini': r'mini\s?7\b',
        'chanel/mini-rectangular-flap': r'mini\s?8\b',
        'chanel/mini-rectangular-classic-flap': r'mini\s?8\b',
        'chanel/boy-bag-medium': r'boy\s?10\b',
        'chanel/boy-bag-small': r'boy\s?8\b',
        'chanel/coco-handle-small': r'coco\s?9\b',
        'chanel/19-bag-small': r'\b19\s?(?:size\s?)?26\b',
        'chanel/19-bag-medium': r'\b19\s?(?:size\s?)?30\b',
    }.items()
}


# --- accessories wearing a bag's name --------------------------------------
#
# Chanel puts "Classic Flap" on a card holder as well as on the bag, and a
# dealer titles it exactly that way: "CHANEL CLASSIC FLAP CARD HOLDER,
# 15,900". Matching on the family name alone therefore priced the Classic
# Flap — a 299,000 baht bag — at 53,900, because four of its eight family
# listings were wallets and card holders.
#
# The catalogue already knows what each item is, so use it: a handbag is
# never priced from a listing that announces itself as small leather goods,
# jewellery or footwear. The rule is skipped for the small-leather-goods and
# jewellery items themselves, where those words are the point.

ACCESSORY_TERMS = (
    'card holder', 'cardholder', 'card case', 'wallet', 'coin purse', 'pouch',
    'key holder', 'keychain', 'key ring', 'key case', 'passport',
    'necklace', 'bracelet', 'earring', 'brooch', 'ring ', 'pendant',
    'sunglass', 'sneaker', 'sandal', 'espadrille', 'scarf', 'twilly',
    'phone case', 'airpod',
)

# Watch listings legitimately describe their strap ("Blue rubber strap"), so
# only outright parts and services are excluded here.
WATCH_PART_TERMS = ('strap only', 'bracelet only', 'buckle', 'deployant', 'service only')

_EXCLUSIONS: dict[str, tuple[str, ...]] = {
    'handbags': ACCESSORY_TERMS,
    'shoes': tuple(t for t in ACCESSORY_TERMS if t not in ('sneaker', 'sandal', 'espadrille')),
    'watches': WATCH_PART_TERMS,
    'clothing': ACCESSORY_TERMS,
}


def _is_wrong_kind(listing_norm: str, category: str) -> bool:
    return any(term in listing_norm for term in _EXCLUSIONS.get(category, ()))


def variant_listings(listings: list[dict], item: dict) -> list[dict]:
    """Listings that are this exact variant — by model tokens or by the
    dealer's own size notation for it."""
    needles = brand_needles(item['brand'])
    tokens = model_tokens(item['model'])
    alias = ALIAS_PATTERNS.get(item['slug'])
    category = item.get('category', '')
    out = []
    for listing in listings:
        text = listing['n']
        if not any(n and n in text for n in needles):
            continue
        if _is_wrong_kind(text, category):
            continue
        if all(_token_in(t, text) for t in tokens) or (alias and alias.search(text)):
            out.append(listing)
    return out


def family_listings(listings: list[dict], item: dict) -> list[dict]:
    """Listings of the model family, size unknown."""
    needles = brand_needles(item['brand'])
    tokens = family_tokens(item['model'])
    category = item.get('category', '')
    return [
        l for l in listings
        if not _is_wrong_kind(l['n'], category) and matches(l['n'], needles, tokens)
    ]


# --- condition -------------------------------------------------------------
#
# Only one of the five dealers states condition in the title, and it does so
# in a fixed vocabulary. Everything else stays None: an unlabelled listing is
# unknown, not "good". Guessing here would put invented grades on the site.

CONDITION_PATTERNS = [
    ('excellent', re.compile(r'\b(like new|keep unused|unused|never worn|nib)\b')),
    ('very_good', re.compile(r'\bvery good\b')),
    ('good', re.compile(r'\b(good condition|fair condition)\b')),
]


def condition_of(listing_norm: str) -> str | None:
    for grade, pattern in CONDITION_PATTERNS:
        if pattern.search(listing_norm):
            return grade
    return None


# --- aggregation -----------------------------------------------------------
#
# A price the site prints has to survive all of these. They are deliberately
# strict: an item with no Thai figure falls back to the international one and
# says so, which is recoverable. A wrong baht number is not.

MIN_VARIANT = 3       # listings needed to publish a variant-level price
MIN_FAMILY = 4        # more, because a family mixes sizes
RETAIL_WINDOW = (0.15, 6.0)
SANITY_WINDOW = (0.10, 10.0)


def _clean(prices: list[float], retail: float) -> list[float]:
    """Drop listings that cannot plausibly be this product.

    A dealer's Hermès page carries belts and bracelets next to the Birkins,
    and a title match on "hermes" plus a family token will pull some of them
    in. Anchoring to retail removes them without needing to understand what
    they are.
    """
    prices = sorted(p for p in prices if p > 0)
    if not prices or retail <= 0:
        return prices
    low, high = retail * RETAIL_WINDOW[0], retail * RETAIL_WINDOW[1]
    windowed = [p for p in prices if low <= p <= high]
    return windowed if len(windowed) >= MIN_VARIANT else prices


def summarise_brand(listings: list[dict]) -> dict | None:
    """A whole maison's Thai shelf, described by its middle rather than its ends.

    A brand summary spans everything these dealers stock under that name — a
    card holder and a Grand Complication are both "Patek Philippe" — so min
    and max say nothing a reader can use, and printing them invites exactly
    the sort of 10,900-to-34,149,000 "range" that made the first version of
    this file worthless. The quartiles describe where the brand actually sits.
    """
    prices = sorted(l['price'] for l in listings if l['price'] > 0)
    if len(prices) < MIN_FAMILY:
        return None
    return {
        'n': len(prices),
        'p25': int(_quantile(prices, 0.25)),
        'median': int(statistics.median(prices)),
        'p75': int(_quantile(prices, 0.75)),
    }


def _quantile(sorted_prices: list[float], q: float) -> float:
    """Nearest-rank quantile, clamped to the observed data.

    statistics.quantiles interpolates and runs outside the sample on small
    inputs — on the international dataset that produced a -9,500 baht price.
    Nearest-rank cannot: every value it returns is a price somebody is asking.
    """
    if not sorted_prices:
        return 0.0
    index = min(len(sorted_prices) - 1, max(0, round(q * (len(sorted_prices) - 1))))
    return sorted_prices[index]


def summarise(listings: list[dict], retail: float, minimum: int) -> dict | None:
    """min / median / max over the credible listings, or None.

    p10-p90 is deliberately NOT used here. On the Vestiaire data it earned its
    place by trimming junk out of 30 noisy search results; these are curated
    dealer listings where the extremes are real offers a reader can click, and
    a band that excludes the cheapest listing on the page while linking to it
    reads as broken.
    """
    prices = _clean([l['price'] for l in listings], retail)
    if len(prices) < minimum:
        return None
    median = statistics.median(prices)
    if retail > 0 and not (SANITY_WINDOW[0] * retail <= median <= SANITY_WINDOW[1] * retail):
        return None
    return {
        'n': len(prices),
        'min': int(min(prices)),
        'median': int(median),
        'max': int(max(prices)),
    }
