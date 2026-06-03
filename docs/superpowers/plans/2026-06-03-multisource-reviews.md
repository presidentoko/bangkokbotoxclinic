# Multi-Source Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich existing 870+ products with YouTube video comment reviews and (later) Watsons Thailand reviews, displayed alongside Konvy + Pantip on product pages.

**Architecture:** Two new pure-Python fetcher modules (`cosmetics/youtube_reviews.py`, `cosmetics/watsons_reviews.py`) mirroring the `pantip_reviews.py` pattern — fetch → save JSON per product → `build_master_db` aggregates all sources → web renders new modules. Each source is independent and resumable.

**Tech Stack:** Python 3.12, `httpx` (already installed), YouTube Data API v3 (free tier, 10,000 units/day). Watsons requires Playwright + VPN (Task 2 — deferred). Tests: pytest, matching `cosmetics/tests/` pattern.

**Run tests with:** `PYTHONUTF8=1 PYTHONIOENCODING=utf-8 C:/Users/yn/AppData/Local/Programs/Python/Python312/python.exe -m pytest cosmetics/tests/ -q` from worktree root.

**Env vars needed:**
- `YOUTUBE_API_KEY` — Google Cloud Console → YouTube Data API v3 → API Key

---

## File Structure

- Create: `cosmetics/youtube_reviews.py` — fetch YouTube video comments per product
- Create: `cosmetics/tests/test_youtube_reviews.py` — unit tests (inject fake responses)
- Modify: `cosmetics/build_master_db.py` — merge YouTube snippets into product records
- Modify: `cosmetics/web/lib/types.ts` — add `youtube` field to Product
- Create: `cosmetics/web/components/YoutubeModule.tsx` — product page UI for YouTube snippets
- Modify: `cosmetics/web/app/[locale]/product/[slug]/page.tsx` — render YoutubeModule

---

## Task 1: YouTube reviews fetcher

**Files:**
- Create: `cosmetics/youtube_reviews.py`
- Create: `cosmetics/tests/test_youtube_reviews.py`

### Step 1: Write the failing test

Create `cosmetics/tests/test_youtube_reviews.py`:

```python
from cosmetics import youtube_reviews as yr

# ── search_videos ──────────────────────────────────────────────────────────

def test_search_videos_returns_list(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/search",
        json={"items": [
            {"id": {"videoId": "abc123"}, "snippet": {"title": "รีวิว Niacinamide", "channelTitle": "BeautyTH"}},
            {"id": {"videoId": "def456"}, "snippet": {"title": "Test Product Review", "channelTitle": "SkinTH"}},
        ]}
    )
    results = yr.search_videos("Niacinamide serum", "TEST_KEY", max_results=2)
    assert len(results) == 2
    assert results[0]["video_id"] == "abc123"
    assert results[0]["title"] == "รีวิว Niacinamide"

def test_search_videos_empty_response(requests_mock):
    requests_mock.get("https://www.googleapis.com/youtube/v3/search", json={"items": []})
    assert yr.search_videos("unknown product xyz", "KEY") == []

# ── fetch_comments ─────────────────────────────────────────────────────────

def test_fetch_comments_returns_snippets(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        json={"items": [
            {"snippet": {"topLevelComment": {"snippet": {
                "textOriginal": "ดีมาก ผิวขาวขึ้น",
                "authorDisplayName": "UserA",
                "likeCount": 5,
                "publishedAt": "2025-01-01T00:00:00Z",
            }}}},
            {"snippet": {"topLevelComment": {"snippet": {
                "textOriginal": "ใช้แล้วสิวยุบ แนะนำเลย",
                "authorDisplayName": "UserB",
                "likeCount": 2,
                "publishedAt": "2025-02-01T00:00:00Z",
            }}}},
        ]}
    )
    comments = yr.fetch_comments("abc123", "TEST_KEY", max_comments=5)
    assert len(comments) == 2
    assert comments[0]["text"] == "ดีมาก ผิวขาวขึ้น"
    assert comments[0]["author"] == "UserA"
    assert comments[0]["like_count"] == 5

def test_fetch_comments_api_error(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        status_code=403, json={"error": {"message": "disabled"}}
    )
    assert yr.fetch_comments("xyz", "KEY") == []

# ── find_reviews ───────────────────────────────────────────────────────────

def test_find_reviews_aggregates(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/search",
        json={"items": [{"id": {"videoId": "v1"}, "snippet": {"title": "รีวิว Product", "channelTitle": "Ch"}}]}
    )
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        json={"items": [{"snippet": {"topLevelComment": {"snippet": {
            "textOriginal": "ดีมากๆ",
            "authorDisplayName": "U",
            "likeCount": 1,
            "publishedAt": "2025-01-01T00:00:00Z",
        }}}}]}
    )
    result = yr.find_reviews("Some Product", "Brand", "KEY")
    assert result["source"] == "youtube"
    assert result["video_count"] >= 1
    assert result["comment_count"] >= 1
    assert len(result["snippets"]) >= 1
    assert result["snippets"][0]["video_id"] == "v1"

def test_find_reviews_no_key_returns_empty():
    result = yr.find_reviews("Product", "Brand", api_key="")
    assert result["video_count"] == 0
    assert result["snippets"] == []
```

- [ ] **Step 2: Run test, verify FAIL**

```
PYTHONUTF8=1 python -m pytest cosmetics/tests/test_youtube_reviews.py -q
```
Expected: `ModuleNotFoundError: cosmetics.youtube_reviews` (+ possibly `requests_mock` not installed).

Install if needed: `pip install requests-mock`

- [ ] **Step 3: Implement `cosmetics/youtube_reviews.py`**

```python
"""YouTube Data API v3 — fetch video comments for a cosmetics product.

Mirrors pantip_reviews.py pattern: find_reviews() -> save_youtube() -> batch main().

API costs (free tier: 10,000 units/day):
  search.list  = 100 units  (1 search per product)
  commentThreads.list = 1 unit per page
  At 3 videos × 1 page each = 3 units + 100 = 103 units/product
  → ~97 products/day on free tier (spread over multiple days for 870 products)
"""
from __future__ import annotations
import json, logging, os, time
from pathlib import Path

import httpx

from cosmetics import config

log = logging.getLogger("cosmetics.youtube_reviews")

SEARCH_URL   = "https://www.googleapis.com/youtube/v3/search"
COMMENTS_URL = "https://www.googleapis.com/youtube/v3/commentThreads"


def search_videos(
    query: str,
    api_key: str,
    max_results: int = 3,
) -> list[dict]:
    """Search YouTube for videos matching query. Returns list of {video_id, title, channel}."""
    if not api_key:
        return []
    try:
        r = httpx.get(SEARCH_URL, params={
            "part": "snippet", "q": query, "type": "video",
            "maxResults": max_results, "relevanceLanguage": "th",
            "key": api_key,
        }, timeout=10)
        r.raise_for_status()
        return [
            {"video_id": item["id"]["videoId"],
             "title": item["snippet"]["title"],
             "channel": item["snippet"]["channelTitle"]}
            for item in r.json().get("items", [])
            if item.get("id", {}).get("videoId")
        ]
    except Exception as e:
        log.warning(f"search_videos error: {e}")
        return []


def fetch_comments(
    video_id: str,
    api_key: str,
    max_comments: int = 10,
) -> list[dict]:
    """Fetch top-level comments for a video. Returns list of {text, author, like_count, published_at}."""
    if not api_key:
        return []
    try:
        r = httpx.get(COMMENTS_URL, params={
            "part": "snippet", "videoId": video_id,
            "maxResults": max_comments, "order": "relevance",
            "key": api_key,
        }, timeout=10)
        r.raise_for_status()
        out = []
        for item in r.json().get("items", []):
            s = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
            text = (s.get("textOriginal") or "").strip()
            if text and len(text) >= 10:
                out.append({
                    "text": text[:300],
                    "author": s.get("authorDisplayName", ""),
                    "like_count": int(s.get("likeCount", 0)),
                    "published_at": s.get("publishedAt", ""),
                    "video_id": video_id,
                })
        return out
    except Exception as e:
        log.warning(f"fetch_comments {video_id} error: {e}")
        return []


def find_reviews(
    product_name: str,
    brand: str,
    api_key: str | None = None,
    max_videos: int = 3,
    max_comments: int = 10,
) -> dict:
    """Search YouTube for product reviews and collect comments.

    Returns dict matching the pantip_reviews schema shape so build_master_db
    can handle both sources uniformly:
      source, video_count, comment_count, snippets (list), fetched_at
    """
    key = api_key or os.getenv("YOUTUBE_API_KEY", "")
    if not key:
        log.info(f"YOUTUBE_API_KEY not set — skip {product_name!r}")
        return _empty(product_name)

    query = f"{brand} {product_name} รีวิว".strip()
    videos = search_videos(query, key, max_results=max_videos)
    log.info(f"[youtube] {product_name!r} → {len(videos)} videos")

    all_comments: list[dict] = []
    for v in videos:
        time.sleep(0.3)
        comments = fetch_comments(v["video_id"], key, max_comments=max_comments)
        all_comments.extend(comments)
        log.info(f"[youtube]   {v['video_id']} '{v['title'][:40]}' → {len(comments)} comments")

    # Sort by like_count desc, cap at 12 snippets
    all_comments.sort(key=lambda c: c.get("like_count", 0), reverse=True)
    snippets = all_comments[:12]

    return {
        "source": "youtube",
        "product_name": product_name,
        "video_count": len(videos),
        "comment_count": len(all_comments),
        "snippets": snippets,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _empty(product_name: str) -> dict:
    return {"source": "youtube", "product_name": product_name,
            "video_count": 0, "comment_count": 0, "snippets": [],
            "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}


def save_youtube(product_id: str, data: dict) -> Path:
    """Write to cosmetics/output/reviews/<product_id>_youtube.json."""
    out = config.REVIEWS_DIR / f"{product_id}_youtube.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"[youtube] saved → {out}")
    return out


def main() -> int:
    """Batch: fetch YouTube reviews for all products missing _youtube.json.

    Polite and resumable. Run:
        YOUTUBE_API_KEY=... python -m cosmetics.youtube_reviews
    """
    logging.basicConfig(level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s")

    key = os.getenv("YOUTUBE_API_KEY", "")
    if not key:
        print("ERROR: set YOUTUBE_API_KEY"); return 1

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    ) if db_path.exists() else []

    done = skip = fail = 0
    for i, p in enumerate(products, 1):
        pid = str(p.get("product_id", ""))
        if not pid:
            continue
        out = config.REVIEWS_DIR / f"{pid}_youtube.json"
        if out.exists():
            skip += 1; continue
        print(f"[{i}/{len(products)}] {pid}: {p.get('name','')[:50]}")
        try:
            data = find_reviews(p.get("name",""), p.get("brand",""), key)
            save_youtube(pid, data)
            done += 1
            print(f"  → videos={data['video_count']} comments={data['comment_count']}")
            time.sleep(1.5)   # polite; ~103 units/product, stay under 10k/day
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"{pid}: {e}"); fail += 1
    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
```

- [ ] **Step 4: Run tests, verify PASS**

```
PYTHONUTF8=1 python -m pytest cosmetics/tests/test_youtube_reviews.py -q
```
Expected: 6 tests PASS.

- [ ] **Step 5: Run full suite, confirm no regressions**

```
PYTHONUTF8=1 python -m pytest cosmetics/tests/ -q
```
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add cosmetics/youtube_reviews.py cosmetics/tests/test_youtube_reviews.py
git commit -m "feat(cosmetics): YouTube Data API review collector"
```

---

## Task 2: Integrate YouTube into build_master_db

**Files:**
- Modify: `cosmetics/build_master_db.py`
- Modify: `cosmetics/tests/test_build_master_db.py`

- [ ] **Step 1: Add failing test**

Append to `cosmetics/tests/test_build_master_db.py`:

```python
def test_build_db_includes_youtube_reviews():
    youtube = {"1": {"source":"youtube","video_count":2,"comment_count":5,
                     "snippets":[{"text":"ดีมาก","author":"U","like_count":3,
                                  "video_id":"v1","published_at":"2025-01-01T00:00:00Z"}]}}
    db = b.build_db(PRODUCTS, REVIEWS, youtube_by_id=youtube)
    yt = db["products"]["1"].get("youtube")
    assert yt is not None
    assert yt["video_count"] == 2
    assert len(yt["snippets"]) == 1
```

- [ ] **Step 2: Run test, verify FAIL**

```
PYTHONUTF8=1 python -m pytest cosmetics/tests/test_build_master_db.py -q
```
Expected: FAIL (`TypeError: build_db() got unexpected keyword argument 'youtube_by_id'`).

- [ ] **Step 3: Update `build_db` in `cosmetics/build_master_db.py`**

Add `youtube_by_id` parameter and a `_load_youtube()` helper:

```python
# Add after _load_reviews():
def _load_youtube() -> dict:
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_youtube.json"):
            pid = f.name.split("_youtube")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                out[pid] = {}
    return out
```

Change `build_db` signature to accept optional `youtube_by_id`:

```python
def build_db(products: list[dict], reviews_by_id: dict,
             youtube_by_id: dict | None = None) -> dict:
```

Inside `build_db`, after `rec.update({...})` add:

```python
        yt = (youtube_by_id or {}).get(p["product_id"])
        if yt and yt.get("video_count", 0) > 0:
            rec["youtube"] = yt
```

Update `main()` to pass `_load_youtube()`:

```python
    db = build_db(products, _load_reviews(), _load_youtube())
```

- [ ] **Step 4: Run tests, verify PASS**

```
PYTHONUTF8=1 python -m pytest cosmetics/tests/ -q
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add cosmetics/build_master_db.py cosmetics/tests/test_build_master_db.py
git commit -m "feat(cosmetics): merge YouTube reviews into master_db"
```

---

## Task 3: Web — YoutubeModule on product page

**Files:**
- Modify: `cosmetics/web/lib/types.ts`
- Create: `cosmetics/web/components/YoutubeModule.tsx`
- Modify: `cosmetics/web/app/[locale]/product/[slug]/page.tsx`

- [ ] **Step 1: Add `youtube` to Product type in `cosmetics/web/lib/types.ts`**

```typescript
export interface YoutubeSnippet {
  text: string; author?: string; like_count?: number;
  video_id: string; published_at?: string;
}
export interface YoutubeData {
  video_count: number; comment_count: number; snippets: YoutubeSnippet[];
}
```

Add to the `Product` interface (after `pantip?:`):

```typescript
  youtube?: YoutubeData;
```

- [ ] **Step 2: Create `cosmetics/web/components/YoutubeModule.tsx`**

```tsx
import type { Locale } from "@/lib/i18n";
import type { YoutubeData } from "@/lib/types";

export function YoutubeModule({
  data,
  locale,
}: {
  data: YoutubeData;
  locale: Locale;
}) {
  if (!data || data.comment_count === 0) return null;
  const isTh = locale === "th";

  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {isTh ? "คอมเมนต์จาก YouTube" : "YouTube comments"}
      </h2>

      {/* Stats row */}
      <div className="flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-red-600 leading-none">
            {data.video_count}
          </span>
          <span className="text-[10px] text-red-500 mt-0.5 uppercase tracking-wide">
            {isTh ? "วิดีโอ" : "videos"}
          </span>
        </div>
        <div className="w-px h-8 bg-red-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-red-600 leading-none">
            {data.comment_count}
          </span>
          <span className="text-[10px] text-red-500 mt-0.5 uppercase tracking-wide">
            {isTh ? "คอมเมนต์" : "comments"}
          </span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-red-400 font-medium">▶ YouTube</span>
      </div>

      {/* Top comment cards */}
      {data.snippets.slice(0, 4).map((s, i) => (
        <a
          key={i}
          href={`https://www.youtube.com/watch?v=${s.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-[#f5e6d3] bg-[#fffaf5] px-5 py-4 shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors group"
        >
          <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">
            &ldquo;{s.text.trim()}&rdquo;
          </p>
          <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
            {s.author && <span className="text-[#b08050]">{s.author}</span>}
            {(s.like_count ?? 0) > 0 && (
              <span>👍 {s.like_count}</span>
            )}
            <span className="ml-auto text-red-400 group-hover:text-red-600 transition-colors">
              {isTh ? "ดูวิดีโอ →" : "Watch →"}
            </span>
          </footer>
        </a>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Add YoutubeModule to product page**

In `cosmetics/web/app/[locale]/product/[slug]/page.tsx`:

Add import at top:
```tsx
import { YoutubeModule } from "@/components/YoutubeModule";
```

Insert after `<PantipModule>` (around line 705):
```tsx
        {/* ══════════════════════════════════════
            MODULE 1c — YOUTUBE COMMENTS
        ══════════════════════════════════════ */}
        {p.youtube && <YoutubeModule data={p.youtube} locale={locale} />}
```

- [ ] **Step 4: Build check**

```
cd cosmetics/web && npm run build
```
Expected: `✓ Generating static pages` (same count as before — no YouTube data yet).

- [ ] **Step 5: Commit**

```bash
git add cosmetics/web/lib/types.ts cosmetics/web/components/YoutubeModule.tsx \
        "cosmetics/web/app/[locale]/product/[slug]/page.tsx"
git commit -m "feat(web): YoutubeModule — YouTube comments on product pages"
```

---

## Task 4: Batch fetch + full pipeline smoke

- [ ] **Step 1: Set `YOUTUBE_API_KEY` and run a smoke test (5 products)**

```bash
set YOUTUBE_API_KEY=AIza...
python -m cosmetics.youtube_reviews
# Ctrl+C after 5 products to test
```

Expected: `output/reviews/<id>_youtube.json` files with `video_count >= 1`.

- [ ] **Step 2: Rebuild master_db and verify YouTube data included**

```bash
python -m cosmetics.build_master_db
```

Open `cosmetics/web/data/master_db.json` → find a product with YouTube data:
```bash
python -c "
import json
db=json.load(open('cosmetics/web/data/master_db.json',encoding='utf-8'))
yt=[p for p in db['products'].values() if p.get('youtube',{}).get('video_count',0)>0]
print(len(yt), 'products with YouTube reviews')
print(yt[0]['name'] if yt else 'none')
"
```

- [ ] **Step 3: Check dev server renders YoutubeModule**

```bash
cd cosmetics/web && npm run dev
```

Visit `http://localhost:3000/th/product/<id-with-youtube>` — confirm red stats box + comment cards appear between PantipModule and KeyIngredientsModule.

- [ ] **Step 4: Commit data + deploy**

```bash
git add cosmetics/web/data/master_db.json cosmetics/output/reviews/*_youtube.json
git commit -m "data: YouTube reviews batch — <N> products"
cd cosmetics/web && vercel deploy --prod
```

---

## Task 5 (Deferred): Watsons Thailand reviews

> **Note:** Watsons.co.th is a JavaScript SPA — requires Playwright + VPN proxy (same infrastructure as Konvy). Implement after YouTube is stable.

**Approach when ready:**
- `cosmetics/watsons_reviews.py` — Playwright + VPN, search by product name, match by name similarity
- Match heuristic: Levenshtein distance between normalized product names (Python `difflib.SequenceMatcher`)
- Save as `{product_id}_watsons.json` (same pattern)
- Integrate into `build_master_db._load_watsons()` (same pattern as `_load_youtube()`)

---

## Open Items
- `YOUTUBE_API_KEY` must be set before running `youtube_reviews.py` — add to `ensure_collector.ps1` environment block once key is obtained
- `auto_deploy.py` should also run `youtube_reviews` before `build_master_db` when API key is available (add to `build_and_deploy()`)
- YouTube free tier: 10,000 units/day = ~97 products/day → full 870-product batch takes ~9 days; resumable by design
