"""Pantip 클리닉 리뷰/언급 수집기.

설계 원칙 (영업 데이터 — 정확도 우선):
  1. 검색 결과 ≠ 클리닉 언급. 본문에 클리닉명이 실제로 등장하는 토픽만 저장.
  2. 토픽은 canonical 하게 1번만 저장 (output/threads/<tid>.json).
     여러 클리닉이 같은 토픽 언급 가능 → 클리닉별 인덱스에서 referencing.
  3. 클리닉명 변형 처리: Thai/English 양쪽 query 다 시도, 공백제거 substring 으로 fuzzy match.
  4. 진행상태 checkpoint → 재시작 안전.

Flow:
  for clinic in eligible_clinics:
    for q in build_queries(name):
      for page in 1..MAX_SEARCH_PAGES:
        hits = fetch_search(q, page)
        for hit in hits:
          if tid already in clinic.checked_tids: skip
          thread = fetch_thread_full(tid)  # OP + 모든 댓글
          score, matched_in = relevance(thread, match_tokens)
          if score >= 1:
            save_thread_canonical(thread)
            add_to_clinic_index(clinic_id, tid, score, matched_in, snippets)
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Iterator
from urllib.parse import quote

import httpx
from bs4 import BeautifulSoup

import config
import namekit

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("pantip")

# ── 데이터 클래스 ─────────────────────────────────────────────


@dataclass
class SearchHit:
    topic_id: str
    title: str
    snippet: str = ""
    forum: str = ""
    reply_count: int = 0
    timestamp: str = ""


@dataclass
class Comment:
    comment_no: int
    body: str
    author: str
    author_mid: int = 0
    timestamp: str = ""
    vote_score: int = 0
    reply_count: int = 0


@dataclass
class Thread:
    topic_id: str
    title: str
    op_body: str
    op_author: str
    op_author_mid: int = 0
    op_timestamp: str = ""
    forum: str = ""
    tags: list[str] = field(default_factory=list)
    comments: list[Comment] = field(default_factory=list)
    fetched_at: str = ""


@dataclass
class Mention:
    """클리닉 X가 토픽 T에서 언급된 사실."""
    topic_id: str
    title: str
    relevance_score: int           # 0~4
    matched_tokens: list[str]
    op_mentioned: bool
    title_mentioned: bool
    comment_count_with_mention: int
    sample_snippets: list[str]     # 매칭된 컨텍스트 발췌 (최대 3개)
    # 지점 매칭: full name 토큰 (브랜드+지점 포함) 이 매칭되면 True.
    # False 면 브랜드만 매칭 → 같은 브랜드의 다른 지점일 수 있음 (영업 자료엔 분리 사용).
    branch_specific: bool = False
    fetched_at: str = ""


# ── HTTP 클라이언트 ─────────────────────────────────────────────


def make_client() -> httpx.Client:
    return httpx.Client(
        headers=config.HEADERS,
        follow_redirects=True,
        timeout=30.0,
    )


def fetch_with_retry(client: httpx.Client, url: str, ajax: bool = False) -> tuple[int, str]:
    """재시도 포함 GET. 마지막 status 와 body 반환 (성공시 200)."""
    headers = config.HEADERS_AJAX if ajax else None
    last_status = 0
    last_body = ""
    for attempt in range(config.MAX_RETRIES):
        try:
            r = client.get(url, headers=headers) if headers else client.get(url)
            last_status, last_body = r.status_code, r.text
            if r.status_code == 200:
                return r.status_code, r.text
            if r.status_code in (429, 502, 503, 504):
                wait = config.RETRY_BACKOFF_SEC[min(attempt, len(config.RETRY_BACKOFF_SEC) - 1)]
                log.warning(f"  HTTP {r.status_code} on {url} — backoff {wait}s")
                time.sleep(wait)
                continue
            return r.status_code, r.text  # 4xx 등 즉시 중단
        except (httpx.RequestError, httpx.TimeoutException) as e:
            wait = config.RETRY_BACKOFF_SEC[min(attempt, len(config.RETRY_BACKOFF_SEC) - 1)]
            log.warning(f"  {type(e).__name__} on {url} — backoff {wait}s")
            time.sleep(wait)
    return last_status, last_body


# ── 검색 ─────────────────────────────────────────────────────


_RE_SEARCH_EM = re.compile(r"\{\{e?em\}\}")     # 검색 하이라이트 토큰 제거
_RE_TOPIC_URL = re.compile(r"pantip\.com/topic/(\d+)")


def _clean_em(s: str) -> str:
    return _RE_SEARCH_EM.sub("", s or "").strip()


def parse_search_next_data(html: str) -> tuple[list[SearchHit], int]:
    """검색페이지의 __NEXT_DATA__ 에서 hits[] 와 total_pages 추출.

    실제 shape (2026 기준):
      { "id": "<topic_id>", "url": "https://pantip.com/topic/<id>",
        "title": "... {{em}}highlighted{{eem}} ...",
        "snippet" or "description": "...",
        "author_name": ..., "total_comment": N, "rooms": [..],
        "created_time": "<unix>" or "last_modified": "..." }
    """
    s = BeautifulSoup(html, "lxml")
    tag = s.select_one('script#__NEXT_DATA__')
    if not tag:
        return [], 0
    try:
        data = json.loads(tag.get_text())
    except Exception:
        return [], 0

    hits: list[SearchHit] = []
    total_pages = 0

    def walk(o):
        nonlocal total_pages
        if isinstance(o, dict):
            url = o.get("url") or ""
            tid_match = _RE_TOPIC_URL.search(url) if isinstance(url, str) else None
            if tid_match and o.get("title"):
                tid = tid_match.group(1)
                rooms = o.get("rooms") or []
                forum = ""
                if isinstance(rooms, list) and rooms:
                    forum = str(rooms[0])
                ts = o.get("last_modified") or o.get("created_time") or ""
                hits.append(SearchHit(
                    topic_id=tid,
                    title=_clean_em(o.get("title")),
                    snippet=_clean_em(o.get("snippet") or o.get("description") or ""),
                    forum=forum,
                    reply_count=int(o.get("total_comment") or o.get("comment_count") or 0),
                    timestamp=str(ts),
                ))
                return
            # 페이지네이션
            if "paging" in o and isinstance(o["paging"], dict):
                p = o["paging"]
                tp = p.get("total_page") or p.get("totalPages") or p.get("totalPage")
                if isinstance(tp, int):
                    total_pages = max(total_pages, tp)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(data)
    # dedup by topic_id
    seen: set[str] = set()
    uniq: list[SearchHit] = []
    for h in hits:
        if h.topic_id and h.topic_id not in seen:
            seen.add(h.topic_id)
            uniq.append(h)
    return uniq, total_pages


def search(client: httpx.Client, query: str, max_pages: int) -> list[SearchHit]:
    """쿼리로 검색 → 모든 페이지 (최대 max_pages) hit 누적."""
    all_hits: list[SearchHit] = []
    seen: set[str] = set()
    for page in range(1, max_pages + 1):
        sep = "&" if "?" in "" else "?"
        url = f"https://pantip.com/search?q={quote(query)}&page={page}"
        status, html = fetch_with_retry(client, url)
        if status != 200:
            log.warning(f"  search HTTP {status} for {query!r} p{page}")
            break
        hits, total_pages = parse_search_next_data(html)
        new = [h for h in hits if h.topic_id not in seen]
        for h in new:
            seen.add(h.topic_id)
        all_hits.extend(new)
        log.info(f"  search {query!r} p{page}: +{len(new)} (total {len(all_hits)})")
        if not new:
            break  # 새 결과 없으면 끝
        if total_pages and page >= total_pages:
            break
        time.sleep(config.DELAY_SEARCH_SEC)
    return all_hits


# ── 토픽 본문 + 댓글 ────────────────────────────────────────


def parse_thread_html(html: str, topic_id: str) -> Thread | None:
    """토픽 첫 페이지 HTML 에서 OP 본문/제목/작성자 추출."""
    s = BeautifulSoup(html, "lxml")
    title_el = s.select_one("h1.display-post-title, h2.display-post-title, .display-post-title")
    title = title_el.get_text(strip=True) if title_el else ""

    body_el = s.select_one(".display-post-story, .display-post-message-box, .main-post .display-post-story-wrapper")
    op_body = body_el.get_text(" ", strip=True) if body_el else ""

    author_el = s.select_one(".display-post-name-base, .main-post .display-post-name")
    op_author = author_el.get_text(strip=True) if author_el else ""

    # 작성자 mid (profile/<mid>)
    op_author_mid = 0
    if author_el:
        a = author_el.find("a", href=True) or author_el.find_parent("a", href=True)
        if a:
            m = re.search(r"/profile/(\d+)", a["href"])
            if m:
                op_author_mid = int(m.group(1))

    ts_el = s.select_one(".main-post .display-post-timestamp, .display-post-timestamp")
    op_ts = ts_el.get("abbrtitle") if ts_el and ts_el.get("abbrtitle") else (ts_el.get_text(strip=True) if ts_el else "")

    forum_el = s.select_one("a[href*='/forum/']")
    forum = forum_el.get_text(strip=True) if forum_el else ""

    tags = [a.get_text(strip=True) for a in s.select("a[href*='/tag/']")][:10]

    if not title and not op_body:
        return None

    return Thread(
        topic_id=topic_id, title=title, op_body=op_body,
        op_author=op_author, op_author_mid=op_author_mid,
        op_timestamp=op_ts, forum=forum, tags=tags,
    )


def _safe_int(v, default: int = 0) -> int:
    """타입 모호한 값 → int. 실패시 default."""
    try:
        if v is None or v == "":
            return default
        return int(v)
    except (TypeError, ValueError):
        return default


def fetch_comments_page(client: httpx.Client, topic_id: str, page: int) -> tuple[list[Comment], int]:
    """댓글 JSON API 호출. (comments, total_count) 반환."""
    url = f"https://pantip.com/forum/topic/render_comments?tid={topic_id}&page={page}"
    status, body = fetch_with_retry(client, url, ajax=True)
    if status != 200:
        return [], 0
    # BOM 제거
    if body.startswith("﻿"):
        body = body[1:]
    try:
        data = json.loads(body)
    except Exception:
        log.warning(f"  comments JSON parse fail tid={topic_id} p{page}")
        return [], 0
    if not isinstance(data, dict):
        return [], 0
    paging = data.get("paging") if isinstance(data.get("paging"), dict) else {}
    total = _safe_int(paging.get("max_comments")) or _safe_int(paging.get("count")) or _safe_int(data.get("count"))
    comments: list[Comment] = []
    for c in (data.get("comments") or []):
        if not isinstance(c, dict):
            continue
        try:
            msg_html = c.get("message", "") or ""
            msg = BeautifulSoup(msg_html, "lxml").get_text(" ", strip=True) if msg_html else ""
            user = c.get("user") if isinstance(c.get("user"), dict) else {}
            gbv = c.get("good_bad_vote") if isinstance(c.get("good_bad_vote"), dict) else {}
            comments.append(Comment(
                comment_no=_safe_int(c.get("comment_no")),
                body=msg,
                author=str(user.get("name") or ""),
                author_mid=_safe_int(user.get("mid")),
                timestamp=str(c.get("last_mod_iso_time") or c.get("data_utime") or ""),
                vote_score=_safe_int(gbv.get("point")),
                reply_count=_safe_int(c.get("reply_count")),
            ))
            # 대댓글도 동일 schema 로 평탄화
            for rep in (c.get("replies") or []):
                if not isinstance(rep, dict):
                    continue
                try:
                    r_html = rep.get("message", "") or ""
                    r_msg = BeautifulSoup(r_html, "lxml").get_text(" ", strip=True) if r_html else ""
                    r_user = rep.get("user") if isinstance(rep.get("user"), dict) else {}
                    r_gbv = rep.get("good_bad_vote") if isinstance(rep.get("good_bad_vote"), dict) else {}
                    comments.append(Comment(
                        comment_no=_safe_int(rep.get("comment_no")),
                        body=r_msg,
                        author=str(r_user.get("name") or ""),
                        author_mid=_safe_int(r_user.get("mid")),
                        timestamp=str(rep.get("last_mod_iso_time") or rep.get("data_utime") or ""),
                        vote_score=_safe_int(r_gbv.get("point")),
                        reply_count=0,
                    ))
                except Exception:
                    continue   # 대댓글 1개 실패가 전체 댓글 처리를 죽이면 안 됨
        except Exception as e:
            log.warning(f"  comment parse skip: {type(e).__name__}: {str(e)[:80]}")
            continue
    return comments, total


def fetch_thread_full(client: httpx.Client, topic_id: str) -> Thread | None:
    """토픽 본문 + 모든 댓글 페이지 수집."""
    # 1) OP 본문 HTML
    url = f"https://pantip.com/topic/{topic_id}"
    status, html = fetch_with_retry(client, url)
    if status != 200:
        log.warning(f"  thread HTTP {status} tid={topic_id}")
        return None
    thread = parse_thread_html(html, topic_id)
    if not thread:
        log.warning(f"  thread parse fail tid={topic_id}")
        return None

    # 2) 댓글 페이지네이션
    time.sleep(config.DELAY_COMMENTS_SEC)
    all_comments: list[Comment] = []
    seen_no: set[int] = set()
    total: int | None = None
    for page in range(1, config.MAX_COMMENT_PAGES + 1):
        comments, t = fetch_comments_page(client, topic_id, page)
        if total is None:
            total = t
        new = [c for c in comments if c.comment_no and c.comment_no not in seen_no]
        for c in new:
            seen_no.add(c.comment_no)
        all_comments.extend(new)
        if not new:
            break
        if total and len(all_comments) >= total:
            break
        time.sleep(config.DELAY_COMMENTS_SEC)
    thread.comments = all_comments
    thread.fetched_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    return thread


# ── 관련도 스코어링 ─────────────────────────────────────────


def _split_tokens_by_specificity(tokens: list[str]) -> tuple[list[str], list[str]]:
    """tokens 리스트를 (full=브랜드+지점, brand_only=지점 떼낸것) 두 그룹으로 분리.

    namekit.build_match_tokens 가 두 종류를 동일 리스트에 넣어줌. 길이 긴 토큰을
    full 로 간주 (지점/세부정보 포함됨).
    공백 제거 변형은 base 토큰의 길이 기반 그룹에 따라간다.
    """
    # 토큰을 길이 내림차순 정렬해서 가장 긴 게 full, 그 외엔 brand_only 로 분류
    if not tokens:
        return [], []
    # 'NoSpace' 변형은 짝이 되는 spaced 토큰의 길이 따라감
    spaced = [t for t in tokens if " " in t or namekit.RE_THAI.search(t)]
    if not spaced:
        return tokens, []
    max_len = max(len(t) for t in spaced)
    full: list[str] = []
    brand: list[str] = []
    for t in tokens:
        # 공백 제거 토큰은 길이 비교가 살짝 다르지만, 같은 family 안에서 비교
        # 간단히: 토큰 길이가 spaced 의 max_len 보다 짧으면 brand-only
        if " " in t or namekit.RE_THAI.search(t):
            if len(t) == max_len:
                full.append(t)
            else:
                brand.append(t)
        else:
            # 공백제거 변형: 길이 기준으로 분류 (max_len - 차이)
            if len(t) >= max_len - 2:   # max_len 의 공백 떼면 2~3 정도 줄어듦
                full.append(t)
            else:
                brand.append(t)
    return full, brand


def score_relevance(thread: Thread, tokens: list[str]) -> tuple[int, Mention | None]:
    """클리닉이 이 토픽에서 진짜 언급되는지 판정.

    score:
      0 → 언급 없음 (저장 안 함)
      1 → 본문 OR 댓글 1+ 에 등장 (브랜드만, 지점 미확인)
      2 → 본문 AND 댓글 1+ (브랜드만)
      3 → 제목에 등장 (+본문 OR 댓글)
      4 → 제목 + 본문 + 댓글 모두 등장
    """
    title_hit, title_tokens = namekit.text_contains_any(thread.title, tokens)
    op_hit, op_tokens = namekit.text_contains_any(thread.op_body, tokens)
    matched_in_comments: list[Comment] = []
    comment_tokens_all: set[str] = set()
    for c in thread.comments:
        hit, toks = namekit.text_contains_any(c.body, tokens)
        if hit:
            matched_in_comments.append(c)
            comment_tokens_all.update(toks)

    if not (title_hit or op_hit or matched_in_comments):
        return 0, None

    score = 0
    if op_hit or matched_in_comments:
        score = 1
    if op_hit and matched_in_comments:
        score = 2
    if title_hit:
        score = 3 if (op_hit or matched_in_comments) else 1
    if title_hit and op_hit and matched_in_comments:
        score = 4

    # snippet 발췌 (앞뒤 80자)
    snippets: list[str] = []
    for txt, label in [(thread.title, "title"), (thread.op_body, "op")] + \
                      [(c.body, f"c#{c.comment_no}") for c in matched_in_comments[:3]]:
        for tok in tokens:
            idx = txt.lower().find(tok.lower())
            if idx == -1:
                # 공백제거 매칭이라 안 잡힐 수 있음 — 그러면 첫 단어로 fallback
                first_word = tok.split()[0] if tok else ""
                if first_word and len(first_word) >= 4:
                    idx = txt.lower().find(first_word.lower())
            if idx != -1:
                start = max(0, idx - 60)
                end = min(len(txt), idx + len(tok) + 60)
                snippet = txt[start:end].replace("\n", " ")
                snippets.append(f"[{label}] ...{snippet}...")
                break
        if len(snippets) >= 3:
            break

    matched_tokens = sorted(set(title_tokens + op_tokens + list(comment_tokens_all)))
    # 지점 정확도: full(브랜드+지점) 토큰이 하나라도 매칭됐는지
    full_tokens, _ = _split_tokens_by_specificity(tokens)
    branch_specific = any(mt in full_tokens for mt in matched_tokens)
    return score, Mention(
        topic_id=thread.topic_id,
        title=thread.title,
        relevance_score=score,
        matched_tokens=matched_tokens,
        op_mentioned=op_hit,
        title_mentioned=title_hit,
        comment_count_with_mention=len(matched_in_comments),
        sample_snippets=snippets[:3],
        branch_specific=branch_specific,
        fetched_at=thread.fetched_at,
    )


# ── 영속화 ───────────────────────────────────────────────────


def save_thread_canonical(thread: Thread) -> Path:
    """토픽 1개를 canonical 저장. 이미 있으면 갱신."""
    config.THREADS_DIR.mkdir(parents=True, exist_ok=True)
    p = config.THREADS_DIR / f"{thread.topic_id}.json"
    payload = asdict(thread)
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    return p


def load_clinic_index(clinic_id: str) -> dict:
    config.CLINICS_DIR.mkdir(parents=True, exist_ok=True)
    p = config.CLINICS_DIR / f"{clinic_id}.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_clinic_index(clinic_id: str, payload: dict) -> Path:
    config.CLINICS_DIR.mkdir(parents=True, exist_ok=True)
    p = config.CLINICS_DIR / f"{clinic_id}.json"
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    return p


def load_progress() -> dict:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    p = config.STATE_DIR / "progress.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_progress(prog: dict) -> Path:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    p = config.STATE_DIR / "progress.json"
    p.write_text(json.dumps(prog, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    return p


# ── 시드 ─────────────────────────────────────────────────────


def _assign_buckets(cats: set[str]) -> list[str]:
    """카테고리 set → bucket 이름 리스트 (hair/dental/cosmetic 중 0~3 개)."""
    out: list[str] = []
    for bucket, bcats in config.BUCKETS.items():
        if cats & bcats:
            out.append(bucket)
    return out


def eligible_clinics() -> list[dict]:
    """master_db 에서 대상 클리닉만 골라낸다.

    필터:
      1) primary_type 이 의료/뷰티/덴탈 계열 (쇼핑몰/호텔 제외)
      2) categories 에 dental/facial/laser/botox/... 중 하나 포함
      3) name 이 사용 가능한 검색 쿼리/매칭 토큰 생성 가능

    정렬: bucket(hair/cosmetic/dental) 별로 total_reviews 내림차순 정렬 후
          round-robin 으로 interleave. hair 클리닉이 가장 적어서(121개)
          이렇게 안 하면 cosmetic/dental 만 채워지고 hair 가 starvation.
    """
    db = json.loads(config.MASTER_DB.read_text(encoding="utf-8"))
    per_bucket: dict[str, list[dict]] = {b: [] for b in config.BUCKET_ORDER}
    seen_ids: set[str] = set()

    for c in db.get("clinics", []):
        cats = set(c.get("categories") or [])
        if not (cats & config.TARGET_CATEGORIES):
            continue
        ptype = c.get("primary_type", "")
        if ptype not in config.TARGET_PRIMARY_TYPES:
            continue
        name = (c.get("name") or "").strip()
        if not name or name in config.GENERIC_BLOCKLIST:
            continue
        if not namekit.build_queries(name):
            continue
        buckets = _assign_buckets(cats)
        if not buckets:
            continue
        # bucket 정보를 clinic record 에 임시 attach (출력 메타에 사용)
        c["_buckets"] = buckets
        # primary bucket — round-robin 순서에 한 번만 들어가야 하니까
        # 가장 작은 bucket 우선 (hair > cosmetic > dental).
        primary = sorted(buckets, key=lambda b: config.BUCKET_ORDER.index(b))[0]
        if c["id"] in seen_ids:
            continue
        seen_ids.add(c["id"])
        per_bucket[primary].append(c)

    # bucket 내 정렬: total_reviews 내림차순
    for b in per_bucket:
        per_bucket[b].sort(key=lambda c: c.get("total_reviews", 0), reverse=True)

    # round-robin interleave
    out: list[dict] = []
    iters = {b: iter(per_bucket[b]) for b in config.BUCKET_ORDER}
    while any(iters[b] is not None for b in config.BUCKET_ORDER):
        for b in config.BUCKET_ORDER:
            it = iters[b]
            if it is None:
                continue
            try:
                out.append(next(it))
            except StopIteration:
                iters[b] = None
    return out


# ── 메인 루프 ────────────────────────────────────────────────


def scrape_clinic(client: httpx.Client, clinic: dict, progress: dict,
                  thread_cache: dict[str, Thread]) -> dict:
    """클리닉 1개 처리. 결과 dict 반환 (mention 리스트 등)."""
    clinic_id = clinic["id"]
    name = clinic["name"]
    queries = namekit.build_queries(name)
    tokens = namekit.build_match_tokens(name)
    if not queries or not tokens:
        return {"status": "skipped", "reason": "no usable name"}

    log.info(f"[{clinic_id}] {name}")
    log.info(f"  queries={queries}  tokens={tokens}")

    # 검색 → 후보 토픽 집합
    candidate_tids: dict[str, SearchHit] = {}
    for q in queries:
        hits = search(client, q, config.MAX_SEARCH_PAGES)
        for h in hits[:config.MAX_THREADS_PER_SEARCH]:
            candidate_tids.setdefault(h.topic_id, h)
        time.sleep(config.DELAY_SEARCH_SEC)

    log.info(f"  candidate topics: {len(candidate_tids)}")

    mentions: list[Mention] = []
    fetched_new = 0
    cache_hits = 0
    topic_errors = 0
    for tid, hit in candidate_tids.items():
        # 토픽 1개 처리 실패가 클리닉 전체 처리를 죽이면 안 됨 — per-topic 격리.
        try:
            if tid in thread_cache:
                thread = thread_cache[tid]
                cache_hits += 1
            else:
                existing_path = config.THREADS_DIR / f"{tid}.json"
                if existing_path.exists():
                    try:
                        payload = json.loads(existing_path.read_text(encoding="utf-8"))
                        thread = Thread(
                            topic_id=payload["topic_id"], title=payload["title"],
                            op_body=payload["op_body"], op_author=payload["op_author"],
                            op_author_mid=payload.get("op_author_mid", 0),
                            op_timestamp=payload.get("op_timestamp", ""),
                            forum=payload.get("forum", ""),
                            tags=payload.get("tags", []),
                            comments=[Comment(**c) for c in payload.get("comments", [])],
                            fetched_at=payload.get("fetched_at", ""),
                        )
                        thread_cache[tid] = thread
                        cache_hits += 1
                    except Exception:
                        thread = None
                else:
                    thread = None
                if thread is None:
                    time.sleep(config.DELAY_THREAD_SEC)
                    thread = fetch_thread_full(client, tid)
                    if thread is None:
                        continue
                    save_thread_canonical(thread)
                    thread_cache[tid] = thread
                    fetched_new += 1

            score, mention = score_relevance(thread, tokens)
            if score >= 1 and mention:
                mentions.append(mention)
                log.info(f"  ✓ tid={tid} score={score} title_hit={mention.title_mentioned} op_hit={mention.op_mentioned} c_hits={mention.comment_count_with_mention}")
        except Exception as e:
            topic_errors += 1
            log.warning(f"  topic {tid} fail: {type(e).__name__}: {str(e)[:120]}")
            continue

    log.info(f"  mentions: {len(mentions)} / fetched_new: {fetched_new} / cache_hits: {cache_hits}")

    # 클리닉 인덱스 저장
    buckets = clinic.get("_buckets") or _assign_buckets(set(clinic.get("categories") or []))
    payload = {
        "clinic_id": clinic_id,
        "name": name,
        "city_label": clinic.get("city_label", ""),
        "categories": clinic.get("categories", []),
        "buckets": buckets,          # 자매 사이트 분류: hair / dental / cosmetic
        "queries_used": queries,
        "tokens_used": tokens,
        "candidates_total": len(candidate_tids),
        "mentions": [asdict(m) for m in mentions],
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    save_clinic_index(clinic_id, payload)
    return {
        "status": "ok",
        "candidates": len(candidate_tids),
        "mentions": len(mentions),
        "fetched_new": fetched_new,
        "cache_hits": cache_hits,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="처리할 클리닉 수 제한 (테스트용)")
    ap.add_argument("--skip-done", action="store_true", default=True,
                    help="progress.json 에 'ok' 상태인 클리닉은 스킵 (기본 ON)")
    ap.add_argument("--redo", action="store_true",
                    help="--skip-done 무시하고 모두 재처리")
    ap.add_argument("--clinic-id", help="특정 clinic_id 만 처리")
    args = ap.parse_args()

    progress = load_progress()
    thread_cache: dict[str, Thread] = {}

    clinics = eligible_clinics()
    log.info(f"eligible clinics: {len(clinics)}")
    if args.clinic_id:
        clinics = [c for c in clinics if c["id"] == args.clinic_id]
        log.info(f"  filtered to clinic_id={args.clinic_id} → {len(clinics)}")
    if args.limit:
        clinics = clinics[:args.limit]
        log.info(f"  limit={args.limit} → {len(clinics)}")

    consecutive_fails = 0
    n_ok = 0
    n_skip = 0
    n_fail = 0

    with make_client() as client:
        for i, clinic in enumerate(clinics, 1):
            cid = clinic["id"]
            if not args.redo and progress.get(cid, {}).get("status") == "ok":
                n_skip += 1
                continue
            try:
                result = scrape_clinic(client, clinic, progress, thread_cache)
                progress[cid] = {
                    "status": result["status"],
                    "name": clinic["name"],
                    "buckets": clinic.get("_buckets", []),
                    "candidates": result.get("candidates", 0),
                    "mentions": result.get("mentions", 0),
                    "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                }
                if result["status"] == "ok":
                    n_ok += 1
                    consecutive_fails = 0
                else:
                    n_skip += 1
            except KeyboardInterrupt:
                log.warning("KeyboardInterrupt — 진행상태 저장 후 중단")
                save_progress(progress)
                return 130
            except Exception as e:
                n_fail += 1
                consecutive_fails += 1
                log.error(f"[{cid}] FAILED: {type(e).__name__}: {e}")
                progress[cid] = {
                    "status": "error",
                    "name": clinic["name"],
                    "error": f"{type(e).__name__}: {e}",
                    "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                }
                if consecutive_fails >= config.CIRCUIT_BREAKER_FAILS:
                    log.error(f"  circuit breaker tripped — pause {config.CIRCUIT_BREAKER_PAUSE_SEC}s")
                    save_progress(progress)
                    time.sleep(config.CIRCUIT_BREAKER_PAUSE_SEC)
                    consecutive_fails = 0

            # 매 클리닉 progress 저장 (재시작 안전성 우선 — I/O 비용 < 데이터 손실 비용)
            save_progress(progress)
            # heartbeat: health 모니터가 이 파일 mtime 체크
            try:
                (config.STATE_DIR / "heartbeat").write_text(
                    time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), encoding="utf-8")
            except Exception:
                pass  # heartbeat 실패가 스크래퍼를 죽이면 안 됨
            if i % 10 == 0:
                log.info(f"=== checkpoint i={i}/{len(clinics)} ok={n_ok} skip={n_skip} fail={n_fail} ===")

    save_progress(progress)
    log.info(f"=== DONE: ok={n_ok} skip={n_skip} fail={n_fail} / total={len(clinics)} ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
