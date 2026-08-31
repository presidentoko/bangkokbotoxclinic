# -*- coding: utf-8 -*-
"""Builds cosmetics/web/data/trending.json — what Thai Pantip is discussing.

WHY THIS EXISTS
The catalogue is a Konvy crawl, so it answers well for what Konvy stocks and
not at all for what people are actually talking about this month. The moment
the site exists for — someone checking a claim before buying — happens right
after a product gets discussed. A static catalogue always arrives late to it.

WHAT THE DATA ACTUALLY SUPPORTS
This started out aimed at "this week's viral products". Pantip does not support
that, and the measurements are in the code for the next person:

  - /forum/beauty returns the latest 50 topics with real timestamps, but the
    room is mostly K-pop, fashion and hair. Exactly 1 of 50 titles mentioned a
    brand this catalogue carries.
  - Category searches ("รีวิว เซรั่ม") are ranked by relevance, not date: of
    ~400 hits across 40 queries, 7 were inside a 45-day window.
  - Brand searches are the productive shape. Each brand returns roughly 5-9
    threads per year and 1-3 per quarter, each with a usable date.

So the honest unit is a 90-day rolling window per brand, not a weekly chart.
The page built on this says "recently discussed", because that is what the
evidence is.

Searching the Latin brand and the mined Thai spelling returns overlapping but
different threads ("Eucerin" and "ยูเซอริน" do not agree), so both are queried
where a Thai spelling exists.

ATTRIBUTION
A thread is attributed to a brand when the brand name appears in its title or
snippet. It is attributed to a specific product only when at least two of that
product's distinctive words appear as well — a thread titled "รีวิวเซรั่ม COSRX"
is evidence about COSRX, not about any one of the 13 COSRX products, and
picking one would file a real discussion behind the wrong page.

STATE
Every run merges into output/pantip_trending_state.json keyed by topic_id, so
repeated scheduled runs accumulate a window rather than re-deriving it from a
single snapshot.

SCHEDULING
This refreshes data/trending.json and stops there. It must never deploy: a
deploy rebuilds every prerendered page and costs roughly 14K ISR writes against
a 200K monthly budget — about 14 deploys a month, which is why
cosmetics/auto_deploy.py gates them behind a product-count and an interval.
The refreshed file rides along on auto_deploy's next scheduled deploy.

Usage
-----
    python -m cosmetics.pantip_trending                  # all brands, once
    python -m cosmetics.pantip_trending --top-brands 80  # the big ones only
    python -m cosmetics.pantip_trending --offline        # rebuild from state
    python -m cosmetics.pantip_trending --watch          # daily loop, for the watchdog
"""
from __future__ import annotations

import argparse
import json
import logging
import math
import re
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_REPO_ROOT = Path(__file__).parent.parent
_PANTIP_DIR = _REPO_ROOT / "pantip"
for _p in (str(_REPO_ROOT), str(_PANTIP_DIR)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from pantip.scraper import make_client, search  # noqa: E402

log = logging.getLogger("cosmetics.pantip_trending")

WEB = _REPO_ROOT / "cosmetics" / "web"
MASTER_DB = WEB / "data" / "master_db.json"
BRAND_TH = WEB / "data" / "brand_th.json"
OUT = WEB / "data" / "trending.json"
STATE = _REPO_ROOT / "cosmetics" / "output" / "pantip_trending_state.json"

FORUM_URL = "https://pantip.com/forum/beauty"
NEXT_DATA = re.compile(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', re.S)

# Category words shared by nearly every product name. Two products that agree
# only on these are not the same product.
_STOP_TOKENS = {
    "serum", "cream", "gel", "lotion", "toner", "essence", "mask", "foam",
    "cleanser", "cleansing", "scrub", "oil", "balm", "sunscreen", "spf", "pa",
    "acne", "skin", "face", "body", "care", "review", "the", "and", "for",
    "with", "new", "set", "pro", "plus", "vitamin", "spray", "powder", "pad",
    "water", "milk", "wash", "soap", "patch", "moisturizer", "sun", "uv",
    "white", "whitening", "bright", "brightening", "clear", "anti", "daily",
}

# Brand names that are ordinary words; a substring match on them fires on
# unrelated threads. Only queried and matched in their Thai spelling.
_AMBIGUOUS_BRANDS = {
    "BK", "ES", "KA", "Oni", "Konvy", "Chubby", "Naturista", "The original",
    "Cica", "Club", "Ashley", "Jabs", "Leaders", "Mille", "Sewa", "Venita",
}

# Thai is written without spaces, so a short brand string is a substring of
# longer ordinary words. Measured on the first real run: "ศศิ" (SASI) matched
# threads about the volleyball player ศศิภาพร and took the #1 slot, and "คลับ"
# (Club) matched แฟนคลับ, "fan club". These spellings are never matched.
_AMBIGUOUS_TH = {"ศศิ", "คลับ", "เอส", "เคเอ", "บีเค", "รัน", "วาย", "เอด"}

# A thread only counts as cosmetics discussion if it also carries one of these.
# Without it, "ยันฮี" pulled in Yanhee Hospital's LGBTQ medical-hub press and an
# eye-muscle surgery question — the right brand, the wrong subject.
_CONTEXT_TERMS = [
    "ครีม", "เซรั่ม", "เอสเซนส์", "โลชั่น", "โทนเนอร์", "กันแดด", "สกินแคร์",
    "บำรุงผิว", "ล้างหน้า", "โฟม", "มาส์ก", "สิว", "ฝ้า", "รอยดำ", "ผิวขาว",
    "ผิวหน้า", "รูขุมขน", "มอยส์เจอ", "เครื่องสำอาง", "รองพื้น", "คุชชั่น",
    "แป้ง", "ลิป", "สครับ", "เรตินอล", "ไนอา", "วิตามินซี", "ผลัดเซลล์",
    "serum", "sunscreen", "spf", "skincare", "moisturizer", "cleanser",
    "toner", "essence", "retinol", "niacinamide", "cushion", "foundation",
]


def has_cosmetics_context(blob: str) -> bool:
    return any(term in blob for term in _CONTEXT_TERMS)


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip().lower()


_TRAILING_PAREN = re.compile(r"\s*\([^)]*\)\s*$")


def match_key(s: str) -> str:
    """Punctuation-insensitive form used on both sides of a brand lookup.

    Thai posters drop the punctuation a brand puts in its own name: the thread
    "ใช้Clean clearแล้วสิวเห่อ" is about Clean & Clear, but a literal search for
    "clean & clear" never finds it. The same gap hides SK-II written "SK II",
    ACNE-AID as "ACNE AID" and Jula's Herb as "Julas Herb".

    A trailing parenthetical is dropped as well, so "Dr.PONG (Skincare)"
    reduces to what a poster would actually type.
    """
    s = _TRAILING_PAREN.sub("", (s or "").strip())
    s = re.sub(r"[^0-9a-zA-Zก-๙]+", " ", s.lower())
    return re.sub(r"\s+", " ", s).strip()


def _tokens(s: str) -> set[str]:
    s = re.sub(r"[^a-z0-9ก-๙]+", " ", (s or "").lower())
    return {w for w in s.split() if len(w) > 1}


def load_catalogue() -> tuple[dict, dict[str, str]]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    try:
        brand_th = json.loads(BRAND_TH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        brand_th = {}
    return db, brand_th


def build_brand_index(db: dict, brand_th: dict[str, str]) -> dict[str, str]:
    """Search string -> canonical brand, for both spellings.

    Keys are punctuation-insensitive (see match_key) and are indexed both with
    and without spaces, so "SK-II" is found whether a poster writes "SK II" or
    "SKII". A key two different brands share — "Dr.PONG (Skincare)" and
    "Dr.PONG (Supplement)" both reduce to "dr pong" — is dropped rather than
    guessed at; those brands remain reachable by their Thai spelling.
    """
    idx: dict[str, str] = {}
    collisions: set[str] = set()
    for p in db["products"].values():
        b = (p.get("brand") or "").strip()
        if not b:
            continue
        th = brand_th.get(b)
        if b not in _AMBIGUOUS_BRANDS:
            n = match_key(b)
            if len(n.replace(" ", "")) >= 4:
                for k in (n, n.replace(" ", "")):
                    if idx.get(k, b) != b:
                        collisions.add(k)
                    idx[k] = b
        # Thai spellings shorter than five characters are substrings of ordinary
        # words far more often than they are brand mentions: "คีน" (KENE) matched
        # a football thread through "สิวะ", "ศศิ" (SASI) matched the volleyball
        # player ศศิภาพร. Those brands are still reachable by their Latin name.
        if th and _norm(th) not in _AMBIGUOUS_TH and len(_norm(th).replace(" ", "")) >= 5:
            idx[_norm(th)] = b
            idx[_norm(th).replace(" ", "")] = b
    for k in collisions:
        idx.pop(k, None)
    return idx


def product_index(db: dict) -> dict[str, list[tuple[frozenset, str]]]:
    """brand -> [(distinctive tokens, product_id)]."""
    out: dict[str, list[tuple[frozenset, str]]] = defaultdict(list)
    for pid, p in db["products"].items():
        brand = (p.get("brand") or "").strip()
        toks = _tokens(p.get("name") or "") - _tokens(brand) - _STOP_TOKENS
        toks = {t for t in toks if not t.isdigit()}
        if len(toks) >= 2:
            out[brand].append((frozenset(toks), pid))
    return out


def brand_queries(db: dict, brand_th: dict[str, str], top: int | None) -> list[str]:
    counts = Counter((p.get("brand") or "").strip() for p in db["products"].values())
    counts.pop("", None)
    brands = [b for b, _ in counts.most_common(top)] if top else list(counts)
    qs: list[str] = []
    for b in brands:
        if b not in _AMBIGUOUS_BRANDS and len(b) >= 4:
            qs.append(b)
        th = brand_th.get(b)
        if th:
            qs.append(th)
    seen, uniq = set(), []
    for q in qs:
        k = _norm(q)
        if k and k not in seen:
            seen.add(k)
            uniq.append(q)
    return uniq


def load_state() -> dict[str, dict]:
    if STATE.exists():
        try:
            return json.loads(STATE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            log.warning("state file unreadable; starting fresh")
    return {}


def save_state(state: dict[str, dict]) -> None:
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=1), encoding="utf-8")


def fetch_forum(client) -> list[dict]:
    """Latest topics in the beauty room. Low brand-hit rate, but it is the only
    source that is genuinely fresh, and it is one request."""
    try:
        r = client.get(FORUM_URL)
        m = NEXT_DATA.search(r.text)
        if not m:
            return []
        data = json.loads(m.group(1))
        topics = data["props"]["initialProps"]["pageProps"]["topics"]["data"]
    except Exception as e:
        log.warning("forum fetch failed: %s", e)
        return []
    out = []
    for t in topics:
        try:
            ts = int(datetime.strptime(
                t["created_time"], "%Y-%m-%dT%H:%M:%SZ"
            ).replace(tzinfo=timezone.utc).timestamp())
        except Exception:
            continue
        tags = " ".join(
            x.get("name", "") if isinstance(x, dict) else str(x)
            for x in (t.get("tags") or [])
        )
        out.append({
            "topic_id": str(t["topic_id"]),
            "title": t.get("title", ""),
            "snippet": tags,
            "ts": ts,
            "replies": int(t.get("comments_count") or 0),
            "src": "forum",
        })
    return out


def collect(queries: list[str], pages: int) -> list[dict]:
    client = make_client()
    found: dict[str, dict] = {}
    for t in fetch_forum(client):
        found[t["topic_id"]] = t
    log.info("beauty room: %d topics", len(found))
    for i, q in enumerate(queries, 1):
        try:
            hits = search(client, q, pages)
        except Exception as e:
            log.warning("query %r failed: %s", q, e)
            continue
        added = 0
        for h in hits:
            try:
                ts = int(h.timestamp)
            except (TypeError, ValueError):
                continue                    # undated hit: unusable for recency
            if h.topic_id in found:
                continue
            found[h.topic_id] = {
                "topic_id": h.topic_id,
                "title": h.title,
                "snippet": h.snippet,
                "ts": ts,
                "replies": h.reply_count,
                "src": "search",
            }
            added += 1
        if i % 20 == 0 or added:
            log.info("[%d/%d] %r -> %d hits, %d new", i, len(queries), q, len(hits), added)
    return list(found.values())


def heat(threads: list[dict], now: float) -> float:
    """Recency-weighted engagement, two-week half-life: a thread from this week
    with 20 replies should outrank a year-old one with 200."""
    total = 0.0
    for t in threads:
        age_days = max(0.0, (now - t["ts"]) / 86400)
        total += (1 + math.log1p(max(0, t["replies"]))) * math.exp(-age_days / 14)
    return round(total, 4)


def attribute(threads, brand_idx, prod_idx):
    by_brand: dict[str, list[dict]] = defaultdict(list)
    by_product: dict[str, list[dict]] = defaultdict(list)
    for t in threads:
        raw = f"{t['title']} {t.get('snippet','')}"
        blob = _norm(raw)
        if not has_cosmetics_context(blob):
            continue                        # right brand, wrong subject
        keyed = match_key(raw)
        keyed_nospace = keyed.replace(" ", "")
        blob_toks = _tokens(blob)
        for needle, brand in brand_idx.items():
            if needle not in keyed and needle not in keyed_nospace:
                continue
            by_brand[brand].append(t)
            for toks, pid in prod_idx.get(brand, []):
                if len(toks & blob_toks) >= 2:
                    by_product[pid].append(t)
    return by_brand, by_product


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=90,
                    help="rolling window for the published ranking")
    ap.add_argument("--pages", type=int, default=1, help="search pages per query")
    ap.add_argument("--top-brands", type=int, default=None,
                    help="query only the N largest brands")
    ap.add_argument("--limit-brands", type=int, default=20)
    ap.add_argument("--limit-products", type=int, default=20)
    ap.add_argument("--offline", action="store_true",
                    help="rebuild trending.json from saved state, no requests")
    ap.add_argument("--watch", action="store_true",
                    help="loop forever, refreshing on --interval (for watchdog)")
    ap.add_argument("--interval", type=int, default=86400,
                    help="seconds between refreshes in --watch mode")
    args = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    if args.watch:
        # The watchdog keeps this process alive and reads the progress line; the
        # sleep lives here rather than in a scheduler, matching the other
        # periodic collectors in this repo.
        while True:
            try:
                run_once(args)
            except Exception as e:                     # never let the loop die
                log.exception("[pantip_trending] refresh failed: %s", e)
            log.info("[pantip_trending] sleeping %ds", args.interval)
            time.sleep(args.interval)

    return run_once(args)


def run_once(args) -> int:
    log.info("[pantip_trending] refresh start")
    db, brand_th = load_catalogue()
    brand_idx = build_brand_index(db, brand_th)
    prod_idx = product_index(db)
    state = load_state()

    if not args.offline:
        queries = brand_queries(db, brand_th, args.top_brands)
        log.info("querying %d brand spellings", len(queries))
        for t in collect(queries, args.pages):
            prev = state.get(t["topic_id"], {})
            # Keep the highest reply count ever seen: search results lag.
            t["replies"] = max(t.get("replies", 0), prev.get("replies", 0))
            t["first_seen"] = prev.get("first_seen") or datetime.now(timezone.utc).strftime("%Y-%m-%d")
            state[t["topic_id"]] = t
        save_state(state)
    log.info("state holds %d threads", len(state))

    now = time.time()
    cutoff = now - args.days * 86400
    recent = [t for t in state.values() if t.get("ts", 0) >= cutoff]
    log.info("%d threads inside the %d-day window", len(recent), args.days)

    by_brand, by_product = attribute(recent, brand_idx, prod_idx)

    def thread_out(t):
        return {
            "topic_id": t["topic_id"],
            "title": t["title"],
            "url": f"https://pantip.com/topic/{t['topic_id']}",
            "date": datetime.fromtimestamp(t["ts"], timezone.utc).strftime("%Y-%m-%d"),
            "replies": t.get("replies", 0),
        }

    brands = sorted(
        (
            {
                "brand": b,
                "brand_th": brand_th.get(b),
                "heat": heat(ts, now),
                "thread_count": len({t["topic_id"] for t in ts}),
                "threads": [thread_out(t) for t in sorted(
                    {t["topic_id"]: t for t in ts}.values(), key=lambda x: -x["ts"])[:4]],
            }
            for b, ts in by_brand.items()
        ),
        key=lambda x: (-x["heat"], x["brand"]),
    )[: args.limit_brands]

    products = sorted(
        (
            {
                "product_id": pid,
                "name": db["products"][pid]["name"],
                "brand": db["products"][pid]["brand"],
                "heat": heat(ts, now),
                "thread_count": len({t["topic_id"] for t in ts}),
                "threads": [thread_out(t) for t in sorted(
                    {t["topic_id"]: t for t in ts}.values(), key=lambda x: -x["ts"])[:3]],
            }
            for pid, ts in by_product.items()
            # One thread naming a product line matched six near-identical pack
            # variants of it on the first run, which is one discussion, not six
            # trending products. Require corroboration from separate threads.
            if pid in db["products"] and len({t["topic_id"] for t in ts}) >= 2
        ),
        key=lambda x: (-x["heat"], x["name"]),
    )[: args.limit_products]

    attributed = {t["topic_id"] for ts in by_brand.values() for t in ts}
    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "window_days": args.days,
        "threads_in_window": len(recent),
        "threads_attributed": len(attributed),
        "brands": brands,
        "products": products,
        # Cosmetics threads naming no brand we carry. Not rendered — this is the
        # coverage-gap signal for deciding what to crawl next.
        "unattributed": [
            thread_out(t)
            for t in sorted(recent, key=lambda x: -x["ts"])
            if t["topic_id"] not in attributed
        ][:60],
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    log.info("wrote %s — %d brands, %d products, %d/%d threads attributed",
             OUT, len(brands), len(products), len(attributed), len(recent))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
