#!/usr/bin/env python3
"""Scrape hero photos from each course's website.

For each course with a `website` field in master_db.json:
  1. Fetch the homepage HTML
  2. Extract og:image (or twitter:image, or first large hero <img>)
  3. Download, compress to JPEG 80, max 1200x800
  4. Save to public/course-photos/{course_id}.jpg
  5. Maintain an index at data/course_photos.json mapping id -> "/course-photos/{id}.jpg"

Resumable: skips courses that already have a photo file.
Concurrent: 10 workers.
"""
from __future__ import annotations

import io
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}. Install with: pip install requests beautifulsoup4 pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
MASTER_DB = ROOT / "data" / "master_db.json"
PHOTOS_INDEX = ROOT / "data" / "course_photos.json"
PHOTOS_DIR = ROOT / "public" / "course-photos"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
}
TIMEOUT_HTML = 10
TIMEOUT_IMG = 15
MAX_W, MAX_H = 1200, 800
JPEG_QUALITY = 80
MIN_IMG_W, MIN_IMG_H = 400, 200  # minimum to be a "hero"

# Domain skip list — these sites either block scraping or have no useful imagery
SKIP_DOMAINS = {
    "facebook.com", "m.facebook.com", "www.facebook.com",
    "instagram.com", "www.instagram.com",
    "tiktok.com", "www.tiktok.com",
    "youtube.com", "youtu.be",
    "lin.ee",  # LINE
}


def get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update(HEADERS)
    return s


def find_image_url(html: str, base_url: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")

    # 1. og:image
    for prop in ("og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"):
        tag = soup.find("meta", attrs={"property": prop}) or soup.find("meta", attrs={"name": prop})
        if tag and tag.get("content"):
            return urljoin(base_url, tag["content"].strip())

    # 2. <link rel="image_src">
    link = soup.find("link", rel="image_src")
    if link and link.get("href"):
        return urljoin(base_url, link["href"].strip())

    # 3. First large <img> with width/height attrs in header/main/section
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if not src:
            continue
        if src.startswith("data:"):
            continue
        try:
            w = int(img.get("width", 0))
            h = int(img.get("height", 0))
        except (ValueError, TypeError):
            w = h = 0
        if (w >= MIN_IMG_W and h >= MIN_IMG_H) or "hero" in (img.get("class") or [""])[0].lower() if isinstance(img.get("class"), list) else False:
            return urljoin(base_url, src.strip())

    # 4. Fallback: first <img> in <main>, <header>, <section> with src
    for tag_name in ("main", "header", "section", "body"):
        section = soup.find(tag_name)
        if not section:
            continue
        for img in section.find_all("img"):
            src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
            if not src or src.startswith("data:"):
                continue
            return urljoin(base_url, src.strip())

    return None


def fetch_and_save_photo(session: requests.Session, course_id: str, website: str) -> tuple[str, str | None, str]:
    """Returns (course_id, photo_path or None, status_msg)."""
    out_path = PHOTOS_DIR / f"{course_id}.jpg"
    if out_path.exists():
        return course_id, f"/course-photos/{course_id}.jpg", "skipped (exists)"

    try:
        host = urlparse(website).netloc.lower()
        if any(host == d or host.endswith("." + d) for d in SKIP_DOMAINS):
            return course_id, None, f"skip domain ({host})"

        # Fetch HTML
        resp = session.get(website, timeout=TIMEOUT_HTML, allow_redirects=True)
        if resp.status_code >= 400:
            return course_id, None, f"http {resp.status_code}"
        if "text/html" not in resp.headers.get("Content-Type", ""):
            return course_id, None, "not html"

        img_url = find_image_url(resp.text, resp.url)
        if not img_url:
            return course_id, None, "no image found"

        # Download image
        img_resp = session.get(img_url, timeout=TIMEOUT_IMG, stream=True)
        if img_resp.status_code >= 400:
            return course_id, None, f"img http {img_resp.status_code}"

        ctype = img_resp.headers.get("Content-Type", "")
        if "image" not in ctype.lower():
            return course_id, None, f"not image ({ctype})"

        # Process with Pillow
        img = Image.open(io.BytesIO(img_resp.content))
        if img.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")

        if img.width < MIN_IMG_W or img.height < MIN_IMG_H:
            return course_id, None, f"too small ({img.width}x{img.height})"

        img.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
        img.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        return course_id, f"/course-photos/{course_id}.jpg", f"saved ({img.width}x{img.height})"

    except requests.exceptions.Timeout:
        return course_id, None, "timeout"
    except requests.exceptions.RequestException as e:
        return course_id, None, f"req error: {type(e).__name__}"
    except Exception as e:
        return course_id, None, f"error: {type(e).__name__}: {str(e)[:60]}"


def main(limit: int | None = None) -> None:
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    courses = db.get("courses") or db.get("restaurants") or []

    # Existing index (resume)
    if PHOTOS_INDEX.exists():
        index = json.loads(PHOTOS_INDEX.read_text(encoding="utf-8"))
    else:
        index = {}

    # Pick courses to process
    candidates = [c for c in courses if c.get("website") and c["website"].startswith("http")]
    if limit:
        candidates = candidates[:limit]

    print(f"Total courses: {len(courses)}, with website: {len(candidates)}")

    session = get_session()
    success = skip = fail = 0
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {
            pool.submit(fetch_and_save_photo, session, c["id"], c["website"]): c
            for c in candidates
        }
        for fut in as_completed(futures):
            course = futures[fut]
            cid, photo_path, status = fut.result()
            if photo_path:
                if "skipped" in status or "saved" in status:
                    index[cid] = photo_path
                if "saved" in status:
                    success += 1
                else:
                    skip += 1
            else:
                fail += 1
            tag = "OK " if photo_path else "--"
            safe_name = course["name"][:50].encode("ascii", "replace").decode("ascii")
            try:
                print(f"  [{tag}] {safe_name:50s} {status}")
            except Exception:
                print(f"  [{tag}] <name-unprintable> {status}")
            # Persist index incrementally so a crash doesn't lose progress
            if len(index) % 10 == 0:
                PHOTOS_INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    PHOTOS_INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")
    elapsed = time.time() - t0
    print(f"\nDone in {elapsed:.1f}s. Success: {success}, Skip: {skip}, Fail: {fail}")
    print(f"Index: {PHOTOS_INDEX}")
    print(f"Photos dir: {PHOTOS_DIR}")


if __name__ == "__main__":
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    main(limit)
