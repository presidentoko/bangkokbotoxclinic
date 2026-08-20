#!/usr/bin/env python3
"""
NordVPN multi-port runner — vpn_runner.py 와 같은 인터페이스.

- NordVPN API 에서 전체 online 서버 pull (openvpn_tcp/udp)
- N 포트, 각 포트마다 node-openvpn-socks 1개 프로세스
- 전체 서버 리스트에서 진짜 랜덤 pick (load/국가 무관; 중복 IP 는 dedup)
- /tmp/vpn_status.json 기록 (scraper 가 읽음)
- /tmp/rotate_port_<idx> touch → 해당 포트 서버 교체
- 파일 없이 stdin auth: --auth-file 로 credentials 전달

Usage:
    python3 nordvpn_runner.py --ports 8 --auth /Users/yanagi/freevpn/.nordvpn_auth
"""
from __future__ import annotations

import argparse
import json
import os
import random
import signal
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
from pathlib import Path

TMPDIR = Path(tempfile.gettempdir())

BASE = Path(__file__).parent
OVPN_DIR = BASE / "node-openvpn-socks"
OVPN_CLI = OVPN_DIR / "dist" / "cli.js"
# NordVPN template: 기본 .ovpn 아무거나 (verify-x509-name 은 JS 구현이 무시함)
OVPN_TEMPLATE = BASE / "nordvpn" / "template.ovpn"

_WIN_NO_WINDOW: dict = {"creationflags": 0x08000000} if os.name == "nt" else {}

NORDAPI_TCP = "https://api.nordvpn.com/v1/servers?limit=10000&filters[servers_technologies][identifier]=openvpn_tcp"
NORDAPI_UDP = "https://api.nordvpn.com/v1/servers?limit=10000&filters[servers_technologies][identifier]=openvpn_udp"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/130.0.0.0"
HEALTH_URL = "https://api.ipify.org?format=json"  # httpbin.org 불안정 → ipify로 교체
REFRESH_INTERVAL = 900  # 15분마다 리스트 재조회
TUNNEL_UP_TIMEOUT = 15  # 정상 노드는 4-8s 안에 뜸; 15s→실패로 간주 (45→15→10→15)
FAILED_HOST_COOLDOWN = 15  # 45→15s: rotate 90s 안에 5+ 서버 시도 가능
# 2026-08-20: rotate 로 놓아준 서버를 이 시간 동안 재선택에서 뺀다.
# 왜 필요한가 — pick_server() 는 servers 리스트를 **앞에서부터** 훑어 첫 적격
# 서버를 준다. used_ips 에는 활성 터널 8개뿐이고 FAILED_HOST_COOLDOWN 은
# "연결 실패" 에만 걸린다. 그런데 구글이 출구 IP 를 앱레벨 차단해도 터널 연결
# 자체는 멀쩡하므로 실패로 기록되지 않는다 → boot_port 가 used_ips 에서 옛 IP 를
# 즉시 빼면, 리스트 상단에 있던 그 서버가 곧바로 다시 뽑힌다. 차단된 출구를
# 계속 되돌려 받는 오실레이션이고, 로테이션이 잦은 서비스일수록 심하다
# (2026-08-20 실측: bangkok_clinics_review 1.3건/h/워커 vs 나머지 14.7~16,
#  no_name 94%. 같은 URL 을 건강한 터널로 재시도하면 5/6 성공 — URL·대상·설정이
#  아니라 출구 IP 가 원인임이 확인됐다).
# 풀은 8,650 서버이고 로테이션은 시간당 ~200회라, 30분 쿨다운이 잡아두는 건
# 최대 ~100개다. 고갈 위험이 없다(pick_server 에 고갈 시 무시 경로도 이미 있다).
ROTATED_HOST_COOLDOWN = 1800
SOCKS_HEALTH_INTERVAL = 300  # 5분마다 살아있는 포트도 SOCKS 실제 동작 확인

# 태국에서 잘 연결되는 서버 우선. hostname 앞 2자리 국가코드 기준.
# 실측 성공률(2026-06): tw=24%, th=23%, fr=22%, vn=21%, de=20%, hk=20%, nl=19%
# 제거: sg/jp/au(반복 실패), gb=12%/my=13%(낮은 성공률)
_PREFER_CC = {"tw", "th", "fr", "vn", "de", "hk", "nl", "kr", "id", "ph"}

def _country_code(host: str) -> str:
    """sg629.nordvpn.com → 'sg'"""
    import re
    m = re.match(r"^([a-z]{2})\d", host)
    return m.group(1) if m else ""

_log_lock = threading.Lock()
def log(msg: str):
    with _log_lock:
        print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def fetch_api(url: str) -> list:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


class Port:
    """SOCKS5 포트 하나를 감싸는 node-openvpn-socks 프로세스."""

    def __init__(self, idx: int, port: int, auth_file: Path):
        self.idx = idx
        self.port = port
        self.auth_file = auth_file
        self.proc: subprocess.Popen | None = None
        self.server_host = ""
        self.server_ip = ""
        self.server_port = 0
        self.server_proto = "tcp"
        self.exit_ip = ""
        self.log_path = TMPDIR / f"nord_port_{port}.log"

    def start(self, host: str, ip: str, srv_port: int, proto: str):
        self.stop()
        self.server_host = host
        self.server_ip = ip
        self.server_port = srv_port
        self.server_proto = proto
        cmd = [
            "node", str(OVPN_CLI),
            str(OVPN_TEMPLATE),
            "--port", str(self.port),
            # Bind to loopback only. These are unauthenticated SOCKS5 proxies:
            # on 0.0.0.0 anything that can reach this machine — every device on
            # the LAN, plus the internet if a firewall rule or port forward ever
            # allows node.exe inbound — can route traffic out through the
            # NordVPN account. That burns exit-IP reputation (the exits are
            # already being refused by Konvy's WAF), consumes the account's
            # connection limit, and attributes a stranger's traffic to us.
            #
            # Nothing is lost by narrowing it: every consumer connects to
            # 127.0.0.1 (PROXY_HOST in cosmetics/, bangkok_clinics/,
            # bangkok_reviews/, cooking_classes/ and petvet/ config.py).
            "--host", "127.0.0.1",
            "--remote", f"{ip}:{srv_port}",
            "--proto", proto,
            "--auth-file", str(self.auth_file),
        ]
        logf = open(self.log_path, "w")
        kwargs = dict(cwd=str(OVPN_DIR), stdout=logf, stderr=subprocess.STDOUT)
        if hasattr(os, 'setsid'):
            kwargs['start_new_session'] = True
        if os.name == 'nt':
            kwargs['creationflags'] = 0x08000000
        self.proc = subprocess.Popen(cmd, **kwargs)
        log(f"port {self.port}: spawn {host} ({ip}:{srv_port}/{proto}) pid={self.proc.pid}")

    def stop(self):
        if self.proc and self.proc.poll() is None:
            try:
                if hasattr(os, 'killpg'):
                    os.killpg(os.getpgid(self.proc.pid), signal.SIGTERM)
                else:
                    self.proc.terminate()
                self.proc.wait(timeout=3)
            except Exception:
                try:
                    if hasattr(os, 'killpg'):
                        os.killpg(os.getpgid(self.proc.pid), signal.SIGKILL)
                    else:
                        self.proc.kill()
                except Exception: pass
        self.proc = None
        self.exit_ip = ""

    def is_alive(self) -> bool:
        return self.proc is not None and self.proc.poll() is None

    def check_health(self, timeout: float = 8.0) -> str | None:
        try:
            r = subprocess.run(
                ["curl", "--socks5", f"127.0.0.1:{self.port}",
                 "--max-time", str(timeout), "-sf", HEALTH_URL],
                capture_output=True, text=True, timeout=timeout + 2,
                **_WIN_NO_WINDOW,
            )
            if r.returncode == 0:
                j = json.loads(r.stdout)
                self.exit_ip = (j.get("ip") or j.get("origin", "")).split(",")[0].strip()
                return self.exit_ip
        except Exception:
            pass
        return None


class Runner:
    def __init__(self, n_ports: int, base_port: int, auth_file: Path, proto: str):
        self.n_ports = n_ports
        self.proto = proto
        self.auth_file = auth_file
        self.ports: list[Port] = [Port(i, base_port + i, auth_file) for i in range(n_ports)]
        self.servers: list[dict] = []   # {host, ip, port, proto}
        self.used_ips: set[str] = set()
        # host -> 이 timestamp 까지 pick 제외. tunnel/health 실패한 노드는 잠시 쉬게.
        self.failed_until: dict[str, float] = {}
        # 포트 idx -> 연속 부팅실패 스트릭 / 백오프 만료 시각
        self._backoff_streak: dict[int, int] = {}
        self._backoff_until: dict[int, float] = {}
        # 포트 idx -> SOCKS 헬스체크 연속 실패 횟수 (단발성 오탐으로 멀쩡한
        # 터널을 재부팅하지 않기 위함 — 2026-07-29 사고: 8포트를 순차로 체크하며
        # 5s 타임아웃 1번 실패로 바로 재부팅 → 체크 자체의 지연/오탐이 포트를
        # 연쇄적으로 재기동시키는 "웨이브" 패턴 유발).
        self._socks_fail_streak: dict[int, int] = {}
        self._stop = False
        self.rotate_ptr = 0
        self.last_refresh = 0.0

    # ── 서버 리스트 ──────────────────────────────────────
    def fetch_servers(self):
        log(f"NordVPN 서버 리스트 fetch (proto={self.proto})...")
        seen: set[str] = set()
        merged: list[dict] = []
        protos = ("tcp",) if self.proto == "tcp" else ("udp",) if self.proto == "udp" else ("tcp", "udp")
        for p in protos:
            url = NORDAPI_TCP if p == "tcp" else NORDAPI_UDP
            try:
                data = fetch_api(url)
            except Exception as e:
                log(f"  fetch {p} 실패: {e}")
                continue
            port = 443 if p == "tcp" else 1194
            added = 0
            for s in data:
                if s.get("status") != "online":
                    continue
                ip = s.get("station") or ""
                host = s.get("hostname") or ""
                if not ip or not host or ip in seen:
                    continue
                seen.add(ip)
                merged.append({"host": host, "ip": ip, "port": port, "proto": p})
                added += 1
            log(f"  {p}: {added} 신규 (중복 IP dedup 후)")
        if merged:
            random.shuffle(merged)
            # 아시아 서버를 앞으로 (태국에서 연결 성공률 높음)
            preferred = [s for s in merged if _country_code(s["host"]) in _PREFER_CC]
            fallback  = [s for s in merged if _country_code(s["host"]) not in _PREFER_CC]
            self.servers = preferred + fallback
            self.used_ips.clear()
            self.last_refresh = time.time()
            log(f"총 {len(self.servers)} 서버 확보 (아시아 {len(preferred)}개 우선)")
        else:
            log(f"  fetch 전부 실패 — 기존 {len(self.servers)} 서버 유지")

    def pick_server(self) -> dict | None:
        """used_ips + 실패 cooldown 피해서 하나 뽑기. 풀 소진 시 used 리셋."""
        if not self.servers:
            return None
        now = time.time()
        # 만료된 cooldown 정리
        if self.failed_until:
            self.failed_until = {h: t for h, t in self.failed_until.items() if t > now}
        for s in self.servers:
            if s["ip"] in self.used_ips:
                continue
            if self.failed_until.get(s["host"], 0) > now:
                continue
            self.used_ips.add(s["ip"])
            return s
        # 모두 used — cooldown 은 그대로 두고 used 만 리셋
        log("모든 IP used. used set 리셋 (cooldown 유지)")
        self.used_ips.clear()
        for s in self.servers:
            if self.failed_until.get(s["host"], 0) > now:
                continue
            self.used_ips.add(s["ip"])
            return s
        # cooldown 까지 전부 차면 어쩔 수 없이 cooldown 도 무시
        log("cooldown 풀까지 소진 → cooldown 무시하고 pick")
        s = self.servers[0]
        self.used_ips.add(s["ip"])
        return s

    def _mark_failed(self, host: str):
        self.failed_until[host] = time.time() + FAILED_HOST_COOLDOWN

    # ── 포트 관리 ────────────────────────────────────────
    # ── 포트별 지수 백오프 ─────────────────────────────────────
    # 터널이 1초 만에 즉사하는 시기(NordVPN 측 거부/차단)에 쉼 없이
    # 재시도하면 분당 수십 회 접속 폭탄이 되어 차단이 더 길어짐
    # (2026-07-11: 최근 1000줄 기준 실패 411 vs 성공 37). 연속 실패 시
    # 30s→60s→120s→...→최대 600s 로 쉬어서 플러딩을 멈춘다.
    def _backoff_active(self, idx: int) -> bool:
        return time.time() < self._backoff_until.get(idx, 0.0)

    def _backoff_bump(self, idx: int):
        streak = self._backoff_streak.get(idx, 0) + 1
        self._backoff_streak[idx] = streak
        wait = min(30 * (2 ** (streak - 1)), 600) + random.uniform(0, 10)
        self._backoff_until[idx] = time.time() + wait
        log(f"port {self.ports[idx].port}: 연속실패 {streak}회 → {wait:.0f}s 백오프")

    def _backoff_reset(self, idx: int):
        self._backoff_streak[idx] = 0
        self._backoff_until[idx] = 0.0

    def boot_port(self, p: Port, max_attempts: int = 3) -> bool:
        if p.server_ip:
            self.used_ips.discard(p.server_ip)
            # 방금 놓아준 서버를 즉시 다시 뽑지 않도록 쿨다운 (ROTATED_HOST_COOLDOWN
            # 주석 참고). rotate 사유가 "구글 차단 의심" 인지 여기선 알 수 없으므로
            # 사유를 가리지 않고 건다 — 정기 교체로 놓아준 멀쩡한 서버까지 30분
            # 쉬게 되지만, 8,650 풀에서 그 대가는 무시할 수준이고 차단된 출구를
            # 되돌려 받는 쪽이 훨씬 비싸다.
            if p.server_host:
                self.failed_until[p.server_host] = time.time() + ROTATED_HOST_COOLDOWN
        for attempt in range(max_attempts):
            s = self.pick_server()
            if not s:
                return False
            p.start(s["host"], s["ip"], s["port"], s["proto"])
            # tunnel up 대기 (node-openvpn-socks 로그에 "tunnel up")
            deadline = time.time() + TUNNEL_UP_TIMEOUT
            ok = False
            while time.time() < deadline:
                if not p.is_alive():
                    break
                try:
                    txt = p.log_path.read_text()
                    if "tunnel up" in txt:
                        ok = True; break
                    # AUTH_FAILED 감지
                    if "AUTH_FAILED" in txt or "auth-failure" in txt:
                        break
                except Exception: pass
                time.sleep(1)
            if not ok:
                log(f"port {p.port}: tunnel 실패 (host={s['host']}) — {FAILED_HOST_COOLDOWN}s cooldown")
                self._mark_failed(s["host"])
                p.stop()
                time.sleep(3)  # 즉사 시 1초 간격 연타 방지
                continue
            exit_ip = p.check_health()
            if exit_ip:
                log(f"port {p.port}: READY exit={exit_ip} via {s['host']}")
                self._backoff_reset(p.idx)
                return True
            log(f"port {p.port}: health check 실패 (host={s['host']}) — {FAILED_HOST_COOLDOWN}s cooldown")
            self._mark_failed(s["host"])
            p.stop()
            time.sleep(3)
        self._backoff_bump(p.idx)
        return False

    def rotate_port(self, idx: int):
        p = self.ports[idx]
        if self._backoff_active(idx):
            log(f"port {p.port}: rotate 요청 무시 — 백오프 중 (연속실패 {self._backoff_streak.get(idx, 0)}회)")
            return
        old = p.server_host
        log(f"port {p.port}: rotate (was {old})")
        self.boot_port(p)

    def _cleanup_zombie_listeners(self, skip_alive: bool = False):
        """우리가 쓸 포트(2080+) 위에 남의 listener 가 있으면 taskkill /F.
        Windows: netstat -ano + taskkill 사용. 다른 OS는 no-op.

        skip_alive=False (startup): 아직 아무것도 안 띄운 상태이므로 그 포트
        위의 listener 는 전부 이전 runner 의 좀비다 — 전 포트 검사.

        skip_alive=True (메인 루프): 살아있는 우리 포트는 검사에서 제외한다.
        2026-08-07 사고: 루프에서 이 함수를 예외 없이 호출하고 있어서, 우리가
        방금 띄운 멀쩡한 터널 8개가 매 5분마다 "좀비"로 분류돼 전멸했다.
        (로그: `zombie listener 감지 → 정리: {2080: 109304, ...}` 직후 8포트
        전부 `process died → respawn`.) 5분 주기로 전 터널이 40초씩 사라지니
        스크래퍼가 ERR_PROXY_CONNECTION_FAILED / ERR_SOCKS_CONNECTION_FAILED
        로 실패율 60%대를 찍었다. 이 함수의 원래 의도는 docstring 대로
        "죽은 프로세스가 포트를 점유해 rebind 를 막는 경우" 해소이므로,
        프로세스가 살아있는 포트는 애초에 대상이 아니다."""
        if os.name != "nt":
            return
        target_ports = {p.port for p in self.ports
                        if not (skip_alive and p.is_alive())}
        if not target_ports:
            return
        try:
            out = subprocess.check_output(
                ["netstat", "-ano", "-p", "TCP"],
                stderr=subprocess.DEVNULL, text=True, timeout=10,
                creationflags=0x08000000,
            )
        except (subprocess.SubprocessError, OSError):
            return

        zombies: dict[int, int] = {}  # port -> pid
        for line in out.splitlines():
            parts = line.split()
            if len(parts) < 5 or parts[0] != "TCP":
                continue
            local = parts[1]
            state = parts[3]
            if state != "LISTENING":
                continue
            # local format: "0.0.0.0:2080" or "[::]:2080"
            try:
                port = int(local.rsplit(":", 1)[1])
                pid = int(parts[4])
            except ValueError:
                continue
            if port in target_ports:
                zombies[port] = pid

        if not zombies:
            return
        log(f"zombie listener 감지 → 정리: {zombies}")
        for port, pid in zombies.items():
            try:
                subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(pid)],
                    stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=5,
                    creationflags=0x08000000,
                )
            except (subprocess.SubprocessError, OSError):
                pass
        time.sleep(2)  # OS port release grace

    # ── signals ──────────────────────────────────────────
    def _on_usr1(self, *_):
        idx = self.rotate_ptr % len(self.ports)
        self.rotate_ptr += 1
        log(f"SIGUSR1 → rotate port idx={idx}")
        self.rotate_port(idx)
        self._write_status()

    def _on_term(self, *_):
        log("SIGTERM: shutting down"); self._stop = True

    def _write_status(self):
        status = {
            "ports": [
                {"idx": p.idx, "port": p.port, "alive": p.is_alive(),
                 "server": f"{p.server_host} ({p.server_ip}:{p.server_port})" if p.server_host else "",
                 "exit_ip": p.exit_ip}
                for p in self.ports
            ]
        }
        with open(str(TMPDIR / "vpn_status.json"), "w") as f:
            json.dump(status, f, indent=2)

    # ── 메인 루프 ────────────────────────────────────────
    def run(self):
        if hasattr(signal, 'SIGUSR1'):
            signal.signal(signal.SIGUSR1, self._on_usr1)
        signal.signal(signal.SIGINT, self._on_term)
        if hasattr(signal, 'SIGTERM'):
            signal.signal(signal.SIGTERM, self._on_term)

        # 좀비 listener 자동 정리 — 이전 nordvpn_runner의 child node-openvpn-socks
        # process가 parent kill 후 살아남아 EADDRINUSE 일으키는 경우 fix.
        self._cleanup_zombie_listeners()

        self.fetch_servers()
        if not self.servers:
            log("서버 없음. 중단"); return

        log(f"bootstrap {self.n_ports} ports (base {self.ports[0].port})")
        for p in self.ports:
            self.boot_port(p)
        alive = sum(1 for p in self.ports if p.is_alive())
        log(f"bootstrap 완료. alive={alive}/{self.n_ports}")
        self._write_status()

        last_health = 0.0
        last_socks_check = 0.0
        last_zombie_clean = 0.0
        while not self._stop:
            # 파일 트리거 rotate
            for i, p in enumerate(self.ports):
                marker = TMPDIR / f"rotate_port_{i}"
                if marker.exists():
                    try:
                        marker.unlink()
                    except PermissionError:
                        # Windows: 다른 프로세스가 일시적으로 잡고 있을 수 있음 → 다음 틱에 재시도
                        continue
                    except FileNotFoundError:
                        pass
                    log(f"file trigger rotate port idx={i}")
                    self.rotate_port(i)
                    self._write_status()

            now = time.time()
            # 5분마다 좀비 listener 정리 (죽은 node 프로세스가 포트 점유하는 경우)
            # skip_alive=True 필수 — 없으면 우리 터널을 우리가 죽인다(위 주석 참고).
            if now - last_zombie_clean > 300:
                last_zombie_clean = now
                self._cleanup_zombie_listeners(skip_alive=True)

            if now - last_health > 15:
                last_health = now
                for p in self.ports:
                    if not p.is_alive() and not self._backoff_active(p.idx):
                        log(f"port {p.port}: process died → respawn")
                        self.boot_port(p)
                        self._write_status()

            # 프로세스는 살아있지만 SOCKS 터널이 죽은 경우 감지.
            # 병렬로 체크(순차면 8포트 x 최대 5-8s = 최대 90s 걸려서, 체크
            # 자체가 뒤쪽 포트일수록 지연되고, 그 지연이 실제 장애처럼 보이는
            # "웨이브" 재기동을 유발했다). 단발성 타임아웃(HEALTH_URL 일시
            # 지연, subprocess 스폰 지연 등)으로 멀쩡한 터널을 죽이지 않도록
            # 연속 2회 실패해야만 재부팅 — 1회 실패는 그냥 스트릭만 올리고 넘어감.
            if now - last_socks_check > SOCKS_HEALTH_INTERVAL:
                last_socks_check = now
                alive_ports = [p for p in self.ports if p.is_alive()]
                results: dict[int, str | None] = {}

                def _check(p: Port):
                    results[p.idx] = p.check_health(timeout=8.0)

                threads = [threading.Thread(target=_check, args=(p,)) for p in alive_ports]
                for t in threads: t.start()
                for t in threads: t.join(timeout=15)

                for p in alive_ports:
                    if results.get(p.idx):
                        self._socks_fail_streak[p.idx] = 0
                        continue
                    streak = self._socks_fail_streak.get(p.idx, 0) + 1
                    self._socks_fail_streak[p.idx] = streak
                    if streak < 2:
                        log(f"port {p.port}: SOCKS 헬스체크 실패 (1회, 재확인 대기)")
                        continue
                    log(f"port {p.port}: SOCKS dead (process alive, 연속 {streak}회) → rotate")
                    self._socks_fail_streak[p.idx] = 0
                    self._mark_failed(p.server_host)
                    if not self._backoff_active(p.idx):
                        self.boot_port(p)
                    self._write_status()

            if now - self.last_refresh > REFRESH_INTERVAL:
                self.fetch_servers()

            time.sleep(2)

        for p in self.ports: p.stop()
        log("all stopped")


def _takeover_guard():
    """다른 nordvpn_runner 인스턴스를 전부 강제 종료 — 포트 소유권 단일화.

    2026-07-07 사고 재발방지: watchdog 중복으로 runner 가 10개까지 누적되어
    NordVPN 계정 동시연결이 폭주, 서버들이 접속을 거부하며 전 터널 붕괴.
    runner 는 시스템 전역 자원(SOCKS 포트 + VPN 계정)을 관리하므로
    반드시 1개만 존재해야 한다. 신규 인스턴스가 기존 것을 밀어낸다
    (watchdog 은 죽은 것을 감지해 재시작하므로 최신 설정이 항상 승리)."""
    me, my_parent = os.getpid(), os.getppid()
    try:
        out = subprocess.check_output(
            ["wmic", "process", "where", "name='python.exe'",
             "get", "ProcessId,ParentProcessId,CommandLine", "/format:csv"],
            text=True, errors="replace", timeout=30, **_WIN_NO_WINDOW,
        )
    except (subprocess.SubprocessError, OSError):
        return
    for line in out.splitlines():
        if "nordvpn_runner.py" not in line:
            continue
        parts = line.rsplit(",", 2)
        try:
            ppid, pid = int(parts[-2]), int(parts[-1])
        except (ValueError, IndexError):
            continue
        if pid in (me, my_parent) or ppid in (me, my_parent):
            continue
        log(f"takeover: 기존 nordvpn_runner(PID {pid}) 종료")
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)],
                       capture_output=True, **_WIN_NO_WINDOW)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ports", type=int, default=8)
    ap.add_argument("--base-port", type=int, default=2080)
    ap.add_argument("--auth", type=Path, required=True,
                    help="NordVPN auth file (username\\npassword\\n)")
    ap.add_argument("--proto", choices=["tcp", "udp", "mixed"], default="tcp")
    args = ap.parse_args()

    args.auth = args.auth.resolve()
    if not args.auth.exists():
        print(f"auth file 없음: {args.auth}", file=sys.stderr); sys.exit(1)
    if not OVPN_CLI.exists():
        print(f"node-openvpn-socks build 안됨: {OVPN_CLI}", file=sys.stderr); sys.exit(1)
    if not OVPN_TEMPLATE.exists():
        print(f"template 없음: {OVPN_TEMPLATE}\n"
              "  curl -sfL -o nordvpn/template.ovpn "
              "https://downloads.nordcdn.com/configs/files/ovpn_legacy/servers/jp522.nordvpn.com.tcp443.ovpn",
              file=sys.stderr); sys.exit(1)

    _takeover_guard()
    r = Runner(args.ports, args.base_port, args.auth, args.proto)
    r.run()


if __name__ == "__main__":
    main()
