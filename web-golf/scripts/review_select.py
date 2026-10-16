#!/usr/bin/env python3
"""Which reviews a course page quotes, and in what language bucket.

Extracted so the two writers cannot drift apart: apify_to_master_db.py (full
rebuild from a places + reviews export) and merge_review_dataset.py (reviews
only, improve-only top-up). Keeping a second copy of this is how a catalogue
silently reverts — the newer selection rule lives here and nowhere else.
"""
from __future__ import annotations

import re
from collections import defaultdict

# ── 언어 감지 ─────────────────────────────────────────────────
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")
_KOREAN_RE = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ]")


def detect_lang(text: str) -> str:
    if not text:
        return "other"
    total = len(text)
    ko = len(_KOREAN_RE.findall(text)) / total
    if ko > 0.15:
        return "ko"
    th = len(_THAI_RE.findall(text)) / total
    if th > 0.3:
        return "th"
    ja = len(_JAPANESE_RE.findall(text)) / total
    if ja > 0.2 and ko < 0.05:
        return "ja"
    lt = len(_LATIN_RE.findall(text)) / total
    if lt > 0.3 and th < 0.05 and ko < 0.05:
        return "en"
    return "other"


MIN_CHARS = 80
MAX_CHARS = 1200
QUOTES_PER_LANG = 8


def pick_samples(chunks: list[tuple[str, int, str]], n: int = QUOTES_PER_LANG):
    """이 함수가 코스 페이지의 고유 텍스트 대부분을 결정한다. 두 번 고쳤다.

    1) 상한 300자: 가장 자세히 쓴 리뷰만 골라서 버리고 있었다. 2026-08-19
       수집분 2,066건 중 301자 이상 고평점 리뷰 208건(13%)이 그렇게 날아갔다.
       하한만 남기고 상한은 1,200자로 올렸다.

    2) `stars >= 4` 게이트 + 길이순 정렬: 서로 다른 방향으로 둘 다 틀렸다.
       - 왜곡: 2026-10-16 실측, 인용문이 있는 417개 코스에서 인용문 평균 별점이
         구글 평점보다 중앙값 +0.40 높았고 255개 코스가 실제보다 좋게 보였다.
         리뷰 분석을 판다는 사이트가 좋은 리뷰만 인용하고 있었다.
       - 반대 함정: petbkk 실측으로 길이순 선택은 1성을 과대표집한다
         (1성 평균 426자 vs 5성 134자 → 가용 9.0%가 발행 13.2%로). 그쪽은
         124곳이 구글 평점보다 1성 이상 낮은 인용문을 달고 있었다.

       그래서 길이도 별점도 선택 기준으로 쓰지 않는다. n자리를 그 코스가 실제로
       받은 별점 분포대로 배분하고(최대잉여법), 각 별점 구간 안에서만 긴 것부터
       쓴다. 모의 실측(306개 코스, 코스별 실제 분포에서 30건 추출): 발행 평균
       별점과 가용 평균의 괴리가 +0.73(218곳이 0.5 이상 어긋남) → +0.04(0곳),
       동시에 코스당 글자수 1,896 → 3,115.

    chunks 는 (text, stars, author) 이고 한 언어 분량만 받는다.
    """
    good = [c for c in chunks if MIN_CHARS <= len(c[0]) <= MAX_CHARS]
    if not good:
        return []

    by_star: dict[int, list[tuple[str, int, str]]] = defaultdict(list)
    for c in good:
        by_star[c[1]].append(c)
    for v in by_star.values():
        v.sort(key=lambda x: -len(x[0]))

    # 최대잉여법: 내림한 몫을 먼저 주고, 남은 자리는 소수부가 큰 구간부터.
    exact = {s: len(v) * n / len(good) for s, v in by_star.items()}
    quota = {s: min(len(by_star[s]), int(e)) for s, e in exact.items()}
    order = sorted(by_star, key=lambda s: (-(exact[s] % 1), -s))
    left = n - sum(quota.values())
    i = 0
    while left > 0 and any(quota[s] < len(by_star[s]) for s in by_star):
        s = order[i % len(order)]
        if quota[s] < len(by_star[s]):
            quota[s] += 1
            left -= 1
        i += 1

    picked = [c for s in by_star for c in by_star[s][: quota[s]]]
    # 페이지에는 높은 별점부터, 같은 별점이면 긴 것부터 보인다.
    picked.sort(key=lambda x: (-x[1], -len(x[0])))
    return [{"text": t, "rating": r, "author": a or "Google reviewer"}
            for t, r, a in picked]


def sample_chars(course: dict) -> int:
    """코스가 현재 발행 중인 인용문 글자수. 병합의 improve-only 판정 기준."""
    return sum(
        len(r.get("text") or "")
        for k in ("sample_reviews_en", "sample_reviews_th", "sample_reviews_ko")
        for r in (course.get(k) or [])
    )
