"""Wongnai 지역 리스팅을 훑어 식당 URL 을 모으고, 상세에서 현지 평점을 받는다.

발견(discovery) 경로: 검색(?q=)은 클라이언트 렌더라 링크가 안 나오고 /_api 는
403 이다. 그런데 지역 리스팅은 서버 렌더링이라 curl 로도 링크가 뽑힌다.
  /restaurants?regions=<region>&categoryGroupId=9&page.size=20&page.number=N
regions 는 wongnai/config.py 에 이미 조사돼 있던 값이다(방콕 9681 등).

브라우저를 쓰지 않는다. 필요한 건 평점·평가자수·전화번호 셋뿐이고, 그건 전부
상세 HTML 의 JSON-LD 에 있다. 4월에 만들어둔 wongnai/scraper.py 는 Playwright
로 리뷰 본문까지 긁는 물건이라 이 목적엔 과하다.

속도: 1초 간격으로 돌렸을 때 83건째부터 403 이 쏟아졌고 몇 분 뒤 같은 URL 이
200 으로 돌아왔다 — 영구 차단이 아니라 속도 제한이다. 403 은 물러섰다 재시도,
404 는 즉시 포기한다(구글에 등록된 Wongnai 링크 중 죽은 게 섞여 있다).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError
import socket
import tempfile
from urllib.request import Request, urlopen, build_opener, HTTPSHandler

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
HEADERS = {
    "User-Agent": UA,
    "Accept": ("text/html,application/xhtml+xml,application/xml;q=0.9,"
               "image/avif,image/webp,*/*;q=0.8"),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "identity",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}
# User-Agent 만 보내면 Wongnai 가 403 을 준다 — curl 은 통과하는데 urllib 은
# 막혀서 한동안 속도 제한으로 오해했다. Sec-Fetch-* 와 Accept 까지 갖춘
# 브라우저 헤더 묶음이어야 200 이 온다.

BASE = "https://www.wongnai.com"
REGIONS = {"bangkok": "9681", "chiang_mai": "9722", "phuket": "9736", "pattaya": "9727"}

LINK = re.compile(r'/restaurants/([A-Za-z0-9%_-]+)')
RATING = re.compile(r'"ratingValue"\s*:\s*([0-9.]+)')
RCOUNT = re.compile(r'"ratingCount"\s*:\s*([0-9]+)')
VCOUNT = re.compile(r'"reviewCount"\s*:\s*([0-9]+)')
PHONE = re.compile(r'"telephone"\s*:\s*"([^"]*)"')
NAME = re.compile(r'"name"\s*:\s*"([^"]{2,120})"')
LAT = re.compile(r'"latitude"\s*:\s*(-?[0-9.]+)')
LNG = re.compile(r'"longitude"\s*:\s*(-?[0-9.]+)')
ADDR = re.compile(r'"streetAddress"\s*:\s*"([^"]{0,200})"')


class SocksiPyHandler(HTTPSHandler):
    """SOCKS5 프록시를 통해 https 를 연다.

    requests[socks] 를 새로 깔지 않으려고 PySocks 를 직접 물린다 — 이 레포엔
    이미 들어 있다. 포트마다 핸들러를 새로 만들어야 연결이 섞이지 않는다.
    """

    def __init__(self, port: int):
        self.port = port
        super().__init__()

    def https_open(self, req):
        import socks

        def build(host, timeout=None, **kw):
            s = socks.socksocket()
            s.set_proxy(socks.SOCKS5, "127.0.0.1", self.port, rdns=True)
            if timeout:
                s.settimeout(timeout)
            s.connect((host[0], host[1]) if isinstance(host, tuple) else host)
            return s

        import http.client

        class Conn(http.client.HTTPSConnection):
            def connect(inner):
                inner.sock = build((inner.host, inner.port), inner.timeout)
                if inner._tunnel_host:
                    inner._tunnel()
                import ssl
                ctx = ssl.create_default_context()
                inner.sock = ctx.wrap_socket(inner.sock, server_hostname=inner.host)

        return self.do_open(Conn, req)


# ── VPN 터널 순환 ────────────────────────────────────────────
#
# 집 IP 로 2.5초 간격으로 200페이지쯤 돌리면 Wongnai 가 403 을 주기 시작하고,
# 그 뒤로는 리스팅도 상세도 전부 막힌다(2026-09-14 실측: 180페이지까지 정상,
# 212페이지부터 전량 403, 이후 집 IP 는 상세 페이지도 403).
#
# 같은 시각 NordVPN 터널 8개는 전부 200 을 돌려줬다. 차단은 IP 단위라
# 요청마다 터널을 바꾸면 각 출구가 받는 요청 수가 1/8 로 떨어진다.
# 터널 목록은 nordvpn_runner 가 쓰는 vpn_status.json 을 그대로 읽는다 —
# 죽은 터널로 요청하면 그냥 실패하므로 alive 만 쓴다.
_TMPDIR = Path(tempfile.gettempdir())
_ports: list[int] = []
_port_i = 0


def live_ports() -> list[int]:
    global _ports
    try:
        data = json.loads((_TMPDIR / "vpn_status.json").read_text())
        _ports = [p["port"] for p in data.get("ports", []) if p.get("alive")]
    except Exception:
        pass
    return _ports


def opener_for(port: int | None):
    if port is None:
        return build_opener()
    return build_opener(SocksiPyHandler(port))


def get(url: str, timeout: int = 25) -> tuple[str | None, str]:
    global _port_i
    for attempt in range(4):
        ports = live_ports()
        port = ports[_port_i % len(ports)] if ports else None
        _port_i += 1
        try:
            req = Request(url, headers=HEADERS)
            with opener_for(port).open(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "replace"), "ok"
        except HTTPError as e:
            if e.code == 404:
                return None, "gone"
            if e.code in (403, 429):
                # 이 출구가 막혔다는 뜻 — 다음 터널로 바로 넘어간다.
                time.sleep(2)
                continue
            return None, f"http_{e.code}"
        except Exception:
            time.sleep(3)
    return None, "rate_limited"


def discover(region: str, pages: int, delay: float, out: Path,
             start_page: int = 1) -> dict:
    """지역 리스팅을 훑어 slug 를 모은다.

    start_page 가 필요한 이유: 이어받기 할 때 1페이지부터 다시 돌면 앞쪽은
    전부 이미 아는 slug 라 "새 항목 없음" 이 연속으로 뜨고, 끝에 닿았다고
    오판해 즉시 중단된다. 실제 미수집 구간은 훨씬 뒤에 있는데도 그렇다.
    진행 페이지를 sidecar 에 적어두고 거기서 이어간다.
    """
    found: dict[str, str] = {}
    if out.exists():
        found = json.loads(out.read_text(encoding="utf-8"))
    prog = out.with_suffix(".progress")
    if start_page <= 1 and prog.exists():
        try:
            start_page = max(1, int(prog.read_text().strip()))
        except Exception:
            start_page = 1
    if start_page > 1:
        print(f"  {start_page}페이지부터 이어감 (기존 {len(found)}곳)", flush=True)
    rid = REGIONS[region]
    empty_streak = 0
    for n in range(start_page, pages + 1):
        url = (f"{BASE}/restaurants?regions={rid}&categoryGroupId=9"
               f"&page.size=20&page.number={n}")
        html, why = get(url)
        if not html:
            print(f"  page {n}: {why}", flush=True)
            continue
        slugs = set(LINK.findall(html))
        new = 0
        for s in slugs:
            if s not in found:
                found[s] = region
                new += 1
        # 같은 페이지가 계속 새 게 없으면 끝에 닿은 것으로 본다.
        empty_streak = empty_streak + 1 if new == 0 else 0
        if n % 20 == 0 or new == 0:
            print(f"  page {n}: +{new} (누적 {len(found)})", flush=True)
            out.write_text(json.dumps(found, ensure_ascii=False), encoding="utf-8")
            prog.write_text(str(n), encoding="utf-8")
        if empty_streak >= 5:
            print(f"  새 항목 없음 5페이지 연속 — 중단", flush=True)
            break
        time.sleep(delay)
    out.write_text(json.dumps(found, ensure_ascii=False), encoding="utf-8")
    return found


def fetch_details(slugs: dict, delay: float, out: Path) -> None:
    done: dict = {}
    if out.exists():
        done = json.loads(out.read_text(encoding="utf-8"))
    todo = [s for s in slugs if s not in done]
    print(f"상세 수집 대상 {len(todo)}곳 (완료 {len(done)})", flush=True)
    ok = 0
    for i, slug in enumerate(todo, 1):
        html, why = get(f"{BASE}/restaurants/{slug}")
        if not html:
            done[slug] = {"status": why}
        else:
            m = RATING.search(html)
            if not m:
                done[slug] = {"status": "no_rating"}
            else:
                done[slug] = {
                    "status": "ok",
                    "name": (NAME.search(html) or [None, ""])[1],
                    "rating": float(m.group(1)),
                    "rating_count": int((RCOUNT.search(html) or [0, 0])[1]),
                    "review_count": int((VCOUNT.search(html) or [0, 0])[1]),
                    "phone": (PHONE.search(html) or [None, ""])[1],
                    # 좌표가 전화번호보다 강한 결합 키다. 태국은 같은 이름의
                    # 지점이 수십 개라 이름만으로는 못 가르고, 전화는 대표번호
                    # 하나만 적힌 경우가 많아 전화 매칭이 18% 에 그쳤다.
                    "lat": float((LAT.search(html) or [0, 0])[1]) or None,
                    "lng": float((LNG.search(html) or [0, 0])[1]) or None,
                    "address": (ADDR.search(html) or [None, ""])[1],
                    "region": slugs[slug],
                    "url": f"{BASE}/restaurants/{slug}",
                }
                ok += 1
        if i % 25 == 0:
            out.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")
            print(f"  {i}/{len(todo)} · 성공 {ok}", flush=True)
        time.sleep(delay)
    out.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")
    print(f"완료 · 성공 {ok}/{len(todo)}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--region", default="bangkok", choices=list(REGIONS))
    ap.add_argument("--pages", type=int, default=500)
    ap.add_argument("--delay", type=float, default=2.5)
    ap.add_argument("--stage", choices=["discover", "details", "both"], default="both")
    ap.add_argument("--start-page", type=int, default=1)
    ap.add_argument("--dir", type=Path, default=Path("wongnai"))
    args = ap.parse_args()

    args.dir.mkdir(parents=True, exist_ok=True)
    slug_path = args.dir / f"slugs_{args.region}.json"
    det_path = args.dir / "details.json"

    slugs: dict = {}
    if args.stage in ("discover", "both"):
        print(f"[discover] {args.region} 최대 {args.pages}페이지", flush=True)
        slugs = discover(args.region, args.pages, args.delay, slug_path, args.start_page)
        print(f"[discover] 완료 · {len(slugs)}곳", flush=True)
    if not slugs and slug_path.exists():
        slugs = json.loads(slug_path.read_text(encoding="utf-8"))
    if args.stage in ("details", "both"):
        fetch_details(slugs, args.delay, det_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
