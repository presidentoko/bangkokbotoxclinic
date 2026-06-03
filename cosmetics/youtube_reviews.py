"""YouTube Data API v3 — fetch video comments for a cosmetics product.

Mirrors pantip_reviews.py pattern: find_reviews() -> save_youtube() -> batch main().

API costs (free tier: 10,000 units/day):
  search.list  = 100 units  (1 search per product)
  commentThreads.list = 1 unit per page
  At 3 videos × 1 page each = 3 units + 100 = 103 units/product
  → ~97 products/day on free tier
"""
from __future__ import annotations
import json, logging, os, time
from pathlib import Path

import requests

from cosmetics import config

log = logging.getLogger("cosmetics.youtube_reviews")

SEARCH_URL   = "https://www.googleapis.com/youtube/v3/search"
COMMENTS_URL = "https://www.googleapis.com/youtube/v3/commentThreads"


def search_videos(query: str, api_key: str, max_results: int = 3) -> list[dict]:
    """Search YouTube for videos matching query. Returns list of {video_id, title, channel}."""
    if not api_key:
        return []
    try:
        r = requests.get(SEARCH_URL, params={
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


def fetch_comments(video_id: str, api_key: str, max_comments: int = 10) -> list[dict]:
    """Fetch top-level comments for a video. Returns list of {text, author, like_count, published_at, video_id}."""
    if not api_key:
        return []
    try:
        r = requests.get(COMMENTS_URL, params={
            "part": "snippet", "videoId": video_id,
            "maxResults": max_comments, "order": "relevance",
            "key": api_key,
        }, timeout=10)
        r.raise_for_status()
        out = []
        for item in r.json().get("items", []):
            s = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
            text = (s.get("textOriginal") or "").strip()
            if text:
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


def find_reviews(product_name: str, brand: str, api_key: str | None = None,
                 max_videos: int = 3, max_comments: int = 10) -> dict:
    """Search YouTube for product reviews and collect comments."""
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
    """Batch: fetch YouTube reviews for all products missing _youtube.json."""
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
            time.sleep(1.5)
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"{pid}: {e}"); fail += 1
    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
