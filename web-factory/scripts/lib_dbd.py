"""DBD DataWarehouse+ 클라이언트.

usage:
    cli = DbdClient()
    hits = cli.search("PRESIDENTBAKERY")
    full = cli.profile("7", "0107545000144")

Anonymous JWT 자동 갱신 (30분 만료 시 /api/refresh 재호출).
"""
from __future__ import annotations

import base64
import json
import logging
import time
from dataclasses import dataclass
from typing import Any

import requests

from dbd_decrypt import decrypt_envelope, b64url

log = logging.getLogger("dbd")

BASE = "https://datawarehouse.dbd.go.th"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"


def _jwt_exp(jwt: str) -> int:
    payload = json.loads(b64url(jwt.split(".")[1]).decode("utf-8"))
    return int(payload.get("exp", 0))


@dataclass
class DbdClient:
    polite_delay: float = 0.5         # 요청 간 sleep (초)
    refresh_buffer: int = 60          # 만료 N초 전 미리 갱신
    timeout: float = 25.0

    def __post_init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": UA,
            "Referer": f"{BASE}/",
            "Origin": BASE,
            "Accept": "application/json",
        })
        self._jwt: str | None = None
        self._jwt_exp: int = 0
        self._last_request_at: float = 0.0

    # ── auth ──────────────────────────────────────────────
    def _sleep_polite(self) -> None:
        dt = time.monotonic() - self._last_request_at
        if dt < self.polite_delay:
            time.sleep(self.polite_delay - dt)
        self._last_request_at = time.monotonic()

    def _ensure_session(self) -> None:
        # incap_ses / dbd_cookie 쿠키 한 번 세팅
        if not self.session.cookies:
            self._sleep_polite()
            r = self.session.get(f"{BASE}/", timeout=self.timeout)
            r.raise_for_status()

    def _ensure_jwt(self) -> str:
        now = int(time.time())
        if self._jwt and (self._jwt_exp - self.refresh_buffer) > now:
            return self._jwt
        self._ensure_session()
        self._sleep_polite()
        r = self.session.post(f"{BASE}/api/refresh", timeout=self.timeout)
        r.raise_for_status()
        body = r.json()
        jwt = body.get("idToken") or body.get("accessToken")
        if not jwt:
            raise RuntimeError(f"no token in refresh response: {body}")
        self._jwt = jwt
        self._jwt_exp = _jwt_exp(jwt)
        self.session.headers["Authorization"] = f"Bearer {jwt}"
        log.info(f"refreshed JWT, exp in {self._jwt_exp - now}s")
        return jwt

    # ── api calls ─────────────────────────────────────────
    def _call(self, method: str, path: str, *, json_body: Any | None = None) -> Any:
        jwt = self._ensure_jwt()
        self._sleep_polite()
        kwargs: dict = {"timeout": self.timeout}
        if json_body is not None:
            kwargs["json"] = json_body
            self.session.headers["Content-Type"] = "application/json"
        url = f"{BASE}{path}"
        r = self.session.request(method, url, **kwargs)
        if r.status_code == 401:
            # token rejected → force refresh + retry once
            self._jwt = None
            jwt = self._ensure_jwt()
            r = self.session.request(method, url, **kwargs)
        r.raise_for_status()
        envelope = r.json()
        if not isinstance(envelope, dict) or "ct" not in envelope:
            return envelope  # not encrypted (e.g. /api/refresh)
        return decrypt_envelope(envelope, path, jwt)

    # ── public ────────────────────────────────────────────
    def search(self, keyword: str, *, sort_by: str = "jpName", page: int = 1) -> list[dict]:
        """검색. keyword 는 보통 uppercase + 공백제거 형식.
        Returns list of hits (jpNo, jpTypeCode, jpName, capAmt, ...)."""
        data = self._call("POST", "/api/v1/company-profiles/infos", json_body={
            "keyword": keyword, "type": "", "sortBy": sort_by, "currentPage": page,
        })
        if isinstance(data, dict):
            return data.get("contents") or []
        return data or []

    def info(self, jp_type: str, jp_no: str) -> dict:
        return self._call("GET", f"/api/v1/company-profiles/info/{jp_type}/{jp_no}")

    def committees(self, jp_type: str, jp_no: str) -> list[dict]:
        return self._call("GET", f"/api/v1/company-profiles/committees/{jp_type}/{jp_no}")

    def committee_signs(self, jp_type: str, jp_no: str) -> list[dict]:
        return self._call("GET", f"/api/v1/company-profiles/committee-signs/{jp_type}/{jp_no}")

    def mergers(self, jp_type: str, jp_no: str) -> dict:
        return self._call("GET", f"/api/v1/company-profiles/mergers/{jp_type}/{jp_no}")

    def full_profile(self, jp_type: str, jp_no: str) -> dict:
        """info + committees + signs + mergers 한 번에 묶어서."""
        return {
            "info":             self.info(jp_type, jp_no),
            "committees":       self.committees(jp_type, jp_no),
            "committee_signs":  self.committee_signs(jp_type, jp_no),
            "mergers":          self.mergers(jp_type, jp_no),
        }


# ── keyword 정규화 ────────────────────────────────────────
import re

_SUFFIXES = [
    "public company limited", "public co., ltd.", "public co ltd",
    "co., ltd.", "co.,ltd.", "co.ltd.", "co ltd", "company limited",
    "company ltd", "co., ltd", "co.", "ltd.", "ltd", "pcl", "plc",
    "limited", "inc.", "inc", "corp.", "corp", "corporation",
    "company", "(thailand)", "thailand", "( thailand )",
]


def normalize_keyword(name: str) -> str:
    """Google Maps 회사명 → DBD 검색 키워드. (uppercase, 공백제거, 일반 접미사 strip)"""
    s = name.lower().strip()
    # strip 흔한 접미사 (반복 적용 — 'Co., Ltd. (Thailand)' 같은거)
    changed = True
    while changed:
        changed = False
        for suf in _SUFFIXES:
            if s.endswith(suf):
                s = s[: -len(suf)].rstrip(" ,.()&")
                changed = True
    # 공백 + 비영숫자 제거 후 uppercase
    s = re.sub(r"[^a-zA-Z0-9ก-๙]", "", s)
    return s.upper()


def name_variants(name: str) -> list[str]:
    """검색용 키워드 후보 — 정확히 일치 못 찾을 때 fallback 용."""
    base = normalize_keyword(name)
    out = [base]
    # 첫 2~3 단어 조합
    words = re.split(r"\s+", name.strip())
    cleaned = [re.sub(r"[^a-zA-Z0-9ก-๙]", "", w).upper() for w in words]
    cleaned = [w for w in cleaned if w]
    if len(cleaned) >= 2:
        out.append("".join(cleaned[:2]))
    if len(cleaned) >= 3:
        out.append("".join(cleaned[:3]))
    # dedupe, preserve order
    seen = set()
    return [v for v in out if v and not (v in seen or seen.add(v))]


# ── 매칭 점수 ────────────────────────────────────────────
def score_match(supplier: dict, dbd_hit: dict) -> int:
    """0~100. supplier (master_db row) vs dbd_hit (search result)."""
    score = 0
    sup_name_norm = normalize_keyword(supplier.get("name", ""))
    dbd_name = (dbd_hit.get("jpName") or "")
    dbd_name_e = (dbd_hit.get("jpNameE") or "")
    dbd_norm = normalize_keyword(dbd_name)
    dbd_e_norm = normalize_keyword(dbd_name_e)

    if sup_name_norm and (sup_name_norm == dbd_norm or sup_name_norm == dbd_e_norm):
        score += 70
    elif sup_name_norm and (sup_name_norm in dbd_norm or sup_name_norm in dbd_e_norm):
        score += 50
    elif sup_name_norm and (dbd_norm in sup_name_norm or dbd_e_norm in sup_name_norm):
        score += 40

    # district / province 매칭
    addr = (dbd_hit.get("address") or "").lower()
    addr_e = (dbd_hit.get("addressE") or "").lower()
    if supplier.get("district"):
        d = supplier["district"].lower().replace(" district", "").strip()
        if d and (d in addr or d in addr_e):
            score += 15
    if supplier.get("city_label"):
        c = supplier["city_label"].lower()
        if c and (c in addr or c in addr_e):
            score += 10

    # 자본금 큰 회사는 신뢰 boost
    cap = dbd_hit.get("capAmt") or 0
    if cap >= 100_000_000: score += 5  # 1억바트+

    return min(score, 100)


if __name__ == "__main__":
    # smoke test
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    import sys
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    cli = DbdClient(polite_delay=0.3)
    for kw in ("PRESIDENTBAKERY", "OISHI", "CPALL"):
        hits = cli.search(kw)
        print(f"\n  search '{kw}' → {len(hits)} hits")
        for h in hits[:3]:
            print(f"    jpNo={h.get('jpNo')} {h.get('jpTypeCode')} cap={h.get('capAmt')} name={h.get('jpName')!r}")
