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
TUNNEL_UP_TIMEOUT = 15  # tunnel up 대기. 정상 노드는 4-8s 안에 뜸; 안 뜨면 죽은 노드라 다음 시도로
FAILED_HOST_COOLDOWN = 45  # 120→45s: 죽은 서버 빠르게 스킵

# 태국에서 잘 연결되는 아시아 서버 우선. hostname 앞 2자리 국가코드 기준.
# 이 목록에 없는 서버(US/DE/CA/UK 등)는 풀백으로만 사용.
_PREFER_CC = {"kr", "th", "de", "nl", "gb", "fr", "hk", "tw", "my", "vn", "ph", "id"}
# sg/jp/au 제거(반복 실패), EU(de/nl/gb/fr) 추가(안정적)

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
            "--host", "0.0.0.0",
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
    def boot_port(self, p: Port, max_attempts: int = 6) -> bool:
        if p.server_ip:
            self.used_ips.discard(p.server_ip)
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
                p.stop(); continue
            exit_ip = p.check_health()
            if exit_ip:
                log(f"port {p.port}: READY exit={exit_ip} via {s['host']}")
                return True
            log(f"port {p.port}: health check 실패 (host={s['host']}) — {FAILED_HOST_COOLDOWN}s cooldown")
            self._mark_failed(s["host"])
            p.stop()
        return False

    def rotate_port(self, idx: int):
        p = self.ports[idx]
        old = p.server_host
        log(f"port {p.port}: rotate (was {old})")
        self.boot_port(p)

    def _cleanup_zombie_listeners(self):
        """startup 직전에 우리가 쓸 모든 포트(2080+) 위에 listener 있는지 체크.
        있으면 그건 이전 runner 의 child 좀비 — taskkill /F. 없으면 no-op.
        Windows: netstat -ano + taskkill 사용. 다른 OS는 no-op."""
        if os.name != "nt":
            return
        target_ports = {p.port for p in self.ports}
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
            if now - last_health > 30:
                last_health = now
                for p in self.ports:
                    if not p.is_alive():
                        log(f"port {p.port}: process died → respawn")
                        self.boot_port(p)
                        self._write_status()

            if now - self.last_refresh > REFRESH_INTERVAL:
                self.fetch_servers()

            time.sleep(2)

        for p in self.ports: p.stop()
        log("all stopped")


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

    r = Runner(args.ports, args.base_port, args.auth, args.proto)
    r.run()


if __name__ == "__main__":
    main()
