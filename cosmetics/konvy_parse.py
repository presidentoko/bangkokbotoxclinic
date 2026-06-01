"""Konvy 응답 → 도메인 객체. 순수 함수(네트워크 없음)라 fixture로 테스트 가능."""
from __future__ import annotations
import re
from bs4 import BeautifulSoup

_PRODUCT_URL_RE = re.compile(r"^https://www\.konvy\.com/[\w%.-]+/[\w%.-]+-\d+\.html$")
_EXCLUDE = ("/brand/", "/list/", "list.php", "team", "cart", "static")


def parse_listing(html: str) -> list[str]:
    """제품 목록 페이지 HTML → 제품 상세 URL 리스트 (dedup, 순서 보존)."""
    soup = BeautifulSoup(html, "lxml")
    out: list[str] = []
    seen: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip().split("#")[0].split("?")[0]
        if href.startswith("/"):
            href = "https://www.konvy.com" + href
        if any(x in href for x in _EXCLUDE):
            continue
        if _PRODUCT_URL_RE.match(href) and href not in seen:
            seen.add(href)
            out.append(href)
    return out
