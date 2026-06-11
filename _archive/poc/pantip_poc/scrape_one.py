"""Pantip: 클리닉 1개를 끝까지 긁어보기.

Flow:
  1) /search?q=<clinic name> 페이지를 받아 __NEXT_DATA__ JSON 에서 결과 리스트 추출
  2) 각 토픽 ID 별로 /forum/topic/render/<tid> 호출 → OP + 댓글 풀-HTML
  3) BeautifulSoup 로 OP/댓글 텍스트 + 작성자 + 날짜 추출

샘플 클리닉 5개에 대해 실행하고 결과를 sample_output.json 으로 저장.
"""
from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import quote

import httpx
from bs4 import BeautifulSoup

OUT = Path(__file__).parent
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
      "AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124.0.0.0 Safari/537.36")
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
}
DELAY_SEC = 2.0  # 매너있게


def fetch(client: httpx.Client, url: str) -> tuple[int, str]:
    r = client.get(url)
    return r.status_code, r.text


def extract_next_data(html: str) -> dict | None:
    s = BeautifulSoup(html, "lxml")
    tag = s.select_one('script#__NEXT_DATA__')
    if not tag:
        return None
    try:
        return json.loads(tag.get_text())
    except Exception:
        return None


def parse_search_results(next_data: dict) -> list[dict]:
    """__NEXT_DATA__ 에서 검색결과 list 추출. 정확한 path 은 nested 탐색으로 발견."""
    # 일반적 Next.js shape: props.initialState.<feature>.results / list
    hits: list[dict] = []

    def walk(obj, path=""):
        if isinstance(obj, dict):
            # 검색 결과 카드 같은 shape 발견: title + topic_id 또는 id
            if all(k in obj for k in ("title", "topic_id")):
                hits.append({**obj, "_path": path})
                return
            if "id" in obj and ("title" in obj or "topic_id" in obj):
                hits.append({**obj, "_path": path})
                return
            for k, v in obj.items():
                walk(v, f"{path}.{k}")
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                walk(v, f"{path}[{i}]")

    walk(next_data)
    # 중복 제거
    seen, uniq = set(), []
    for h in hits:
        tid = h.get("topic_id") or h.get("id")
        if tid and tid not in seen:
            seen.add(tid)
            uniq.append(h)
    return uniq


def parse_thread_html(html: str) -> dict:
    """/forum/topic/render/<tid> 응답에서 OP + 댓글 추출."""
    s = BeautifulSoup(html, "lxml")
    op = {}
    main = s.select_one("div.main-post")
    if main:
        title_el = main.select_one("h2, .display-post-title, .topic-title")
        body_el = main.select_one(".display-post-story, .post-content, .display-post-message-box, [class*='story']")
        author_el = main.select_one(".display-post-name-base, .display-post-name, [class*='owner-name']")
        date_el = main.select_one(".display-post-timestamp, time, [class*='timestamp']")
        op = {
            "title": title_el.get_text(strip=True) if title_el else "",
            "body": body_el.get_text(" ", strip=True) if body_el else "",
            "author": author_el.get_text(strip=True) if author_el else "",
            "date": date_el.get_text(strip=True) if date_el else "",
        }
    # 댓글
    comments: list[dict] = []
    for wrap in s.select("div.display-post-wrapper"):
        # main-post 안에 있는 경우 OP 본인이라 스킵
        if wrap.find_parent("div", class_="main-post"):
            continue
        body_el = wrap.select_one(".display-post-story, .display-post-message-box, [class*='story']")
        author_el = wrap.select_one(".display-post-name-base, .display-post-name, [class*='owner-name']")
        date_el = wrap.select_one(".display-post-timestamp, time, [class*='timestamp']")
        text = body_el.get_text(" ", strip=True) if body_el else ""
        if not text:
            continue
        comments.append({
            "body": text,
            "author": author_el.get_text(strip=True) if author_el else "",
            "date": date_el.get_text(strip=True) if date_el else "",
        })
    return {"op": op, "comments": comments, "comment_count": len(comments)}


def scrape_clinic(client: httpx.Client, name: str, max_threads: int = 3) -> dict:
    """클리닉 1개에 대해 검색 → 토픽 N개 fetch → 본문/댓글 파싱."""
    print(f"\n  search: {name!r}")
    search_url = f"https://pantip.com/search?q={quote(name)}"
    status, html = fetch(client, search_url)
    print(f"    -> HTTP {status}, {len(html)} bytes")
    if status != 200:
        return {"name": name, "search_status": status, "hits": []}
    nd = extract_next_data(html)
    if not nd:
        return {"name": name, "error": "no __NEXT_DATA__", "hits": []}
    hits = parse_search_results(nd)
    print(f"    hits: {len(hits)}")

    threads: list[dict] = []
    for h in hits[:max_threads]:
        tid = h.get("topic_id") or h.get("id")
        if not tid:
            continue
        time.sleep(DELAY_SEC)
        url = f"https://pantip.com/forum/topic/render/{tid}"
        status, html = fetch(client, url)
        print(f"    thread {tid}: HTTP {status}, {len(html)} bytes")
        if status != 200:
            continue
        parsed = parse_thread_html(html)
        threads.append({"topic_id": tid, "title": h.get("title", ""), **parsed})

    return {"name": name, "search_status": 200, "hits_total": len(hits), "threads": threads}


def main() -> int:
    # master_db 에서 클리닉명 5개 추출 (이름 단순화 — '&', 'Co., Ltd.' 등 제거는 우선 생략)
    db_path = OUT.parent / "web" / "data" / "master_db.json"
    db = json.loads(db_path.read_text(encoding="utf-8"))
    clinics = db["clinics"]
    # Bangkok 클리닉 중 review_count 높은 상위 5개
    bangkok = [c for c in clinics if c.get("city_label") == "Bangkok"]
    bangkok.sort(key=lambda c: c.get("total_reviews", 0), reverse=True)
    sample = bangkok[:5]

    print(f"sampling {len(sample)} Bangkok clinics (by total_reviews):")
    for c in sample:
        print(f"  - {c['name']} (reviews={c.get('total_reviews', 0)})")

    out: list[dict] = []
    with httpx.Client(headers=HEADERS, follow_redirects=True, timeout=30.0) as c:
        for clinic in sample:
            result = scrape_clinic(c, clinic["name"], max_threads=2)
            result["clinic_id"] = clinic["id"]
            result["clinic_total_reviews"] = clinic.get("total_reviews", 0)
            out.append(result)
            time.sleep(DELAY_SEC)

    (OUT / "sample_output.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    print(f"\nresult -> {OUT / 'sample_output.json'}")
    # 요약
    total_threads = sum(len(r.get("threads", [])) for r in out)
    total_comments = sum(sum(t["comment_count"] for t in r.get("threads", [])) for r in out)
    print(f"summary: {len(out)} clinics, {total_threads} threads, {total_comments} comments")
    return 0


if __name__ == "__main__":
    sys.exit(main())
