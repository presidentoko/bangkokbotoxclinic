"""Pantip raw HTTP probe.

Goal: validate that (a) search results are server-rendered, (b) thread bodies are
reachable (either static HTML or a discoverable JSON API endpoint).

Run: ../.venv/Scripts/python.exe probe.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import httpx
from bs4 import BeautifulSoup

OUT = Path(__file__).parent
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
}

# 검색어: "คลินิก ฟัน รีวิว" = "clinic teeth review" (덴탈 리뷰)
SEARCH_Q = "คลินิก ฟัน รีวิว"
SEARCH_URL = f"https://pantip.com/search?q={SEARCH_Q}"


def fetch(url: str, headers: dict | None = None) -> tuple[int, str, dict]:
    h = {**HEADERS, **(headers or {})}
    with httpx.Client(headers=h, follow_redirects=True, timeout=20.0) as c:
        r = c.get(url)
        return r.status_code, r.text, dict(r.headers)


def probe_search(html: str) -> dict:
    s = BeautifulSoup(html, "lxml")
    # 토픽 링크 추출
    topic_ids: set[str] = set()
    for a in s.find_all("a", href=True):
        m = re.search(r"/topic/(\d+)", a["href"])
        if m:
            topic_ids.add(m.group(1))
    # 결과 카드 selector 후보
    sel_hits = {sel: len(s.select(sel)) for sel in [
        "div.search-result", "li.search-result", "div.result-item",
        "div.post-item", "article", "div.topic-list", ".search-list-item",
    ]}
    # __NEXT_DATA__ / 인라인 JSON 탐지 (Next.js SSR?)
    next_data = s.select_one('script#__NEXT_DATA__')
    inline_jsons = [t.get_text()[:200] for t in s.select('script') if t.get_text().strip().startswith('{')][:3]
    return {
        "topic_id_count": len(topic_ids),
        "topic_id_sample": sorted(topic_ids)[:5],
        "card_selector_hits": sel_hits,
        "has_next_data": bool(next_data),
        "next_data_len": len(next_data.get_text()) if next_data else 0,
        "inline_json_samples": inline_jsons,
        "html_len": len(html),
    }


def probe_thread(html: str) -> dict:
    s = BeautifulSoup(html, "lxml")
    sel_hits = {sel: len(s.select(sel)) for sel in [
        "div.main-post", "div.display-post-wrapper", "article.post",
        "div.post-message", ".message", ".post-content",
        "div.display-post-story-block", ".display-post-message",
    ]}
    # AJAX 트리거 흔적
    has_loading = "กำลังโหลด" in html or "loading" in html.lower()
    # API/AJAX endpoint 단서
    api_refs = list(set(re.findall(r'(/forum/topic/[^"\s\']+|/api/[^"\s\']+|forum_api[^"\s\']*)', html)))[:10]
    # 토픽 ID에서 JSON 응답이 별도 endpoint 인지
    return {
        "selector_hits": sel_hits,
        "has_loading_placeholder": has_loading,
        "api_refs": api_refs,
        "html_len": len(html),
    }


def probe_thread_api(topic_id: str) -> dict:
    """Pantip 의 forum API endpoint 시도 — 알려진 패턴 몇 가지."""
    results = {}
    candidates = [
        f"https://pantip.com/forum/topic/render_comments?tid={topic_id}",
        f"https://pantip.com/api/forum_service/v1/topic/{topic_id}",
        f"https://pantip.com/forum/topic/render/{topic_id}",
        f"https://api.pantip.com/forum/topic/{topic_id}",
    ]
    for url in candidates:
        try:
            status, text, hdrs = fetch(url, {"X-Requested-With": "XMLHttpRequest",
                                              "Accept": "application/json,*/*"})
            results[url] = {
                "status": status,
                "bytes": len(text),
                "content_type": hdrs.get("content-type", ""),
                "looks_json": text.lstrip().startswith("{") or text.lstrip().startswith("["),
                "sample": text[:200],
            }
        except Exception as e:
            results[url] = {"error": f"{type(e).__name__}: {e}"}
    return results


def main() -> int:
    result: dict = {}
    print(f"[1/3] GET search: {SEARCH_URL}")
    status, html, _ = fetch(SEARCH_URL)
    (OUT / "search.html").write_text(html, encoding="utf-8")
    print(f"      -> HTTP {status}, {len(html)} bytes")
    result["search"] = {"status": status, **probe_search(html)}

    tids = result["search"].get("topic_id_sample", [])
    if not tids:
        print("!!! 토픽 ID 못 찾음")
        (OUT / "probe_result.json").write_text(
            json.dumps(result, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
        return 1

    tid = tids[0]
    thread_url = f"https://pantip.com/topic/{tid}"
    print(f"[2/3] GET thread: {thread_url}")
    status, html, _ = fetch(thread_url)
    (OUT / "thread.html").write_text(html, encoding="utf-8")
    print(f"      -> HTTP {status}, {len(html)} bytes")
    result["thread"] = {"status": status, "url": thread_url, **probe_thread(html)}

    print(f"[3/3] probe thread API endpoints for tid={tid}")
    result["thread_api_probes"] = probe_thread_api(tid)
    for url, r in result["thread_api_probes"].items():
        suffix = ""
        if isinstance(r, dict) and "status" in r:
            suffix = f" [{r['status']}, {r['bytes']}b, json={r['looks_json']}]"
        elif isinstance(r, dict) and "error" in r:
            suffix = f" [ERR {r['error'][:60]}]"
        print(f"      {url}{suffix}")

    (OUT / "probe_result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    print(f"\nresult -> {OUT / 'probe_result.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
