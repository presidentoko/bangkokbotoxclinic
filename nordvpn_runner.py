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

NORDAPI_TCP = "https://api.nordvpn.com/v1/servers?limit=10000&filters[servers_technologies][identifier]=openvpn_tcp"
NORDAPI_UDP = "https://api.nordvpn.com/v1/servers?limit=10000&filters[servers_technologies][identifier]=openvpn_udp"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/130.0.0.0"
HEALTH_URL = "http://httpbin.org/ip"
REFRESH_INTERVAL = 900  # 15분마다 리스트 재조회

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
            )
            if r.returncode == 0:
                self.exit_ip = json.loads(r.stdout).get("origin", "").split(",")[0].strip()
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
            self.servers = merged
            self.used_ips.clear()
            self.last_refresh = time.time()
            log(f"총 {len(self.servers)} 서버 확보 (shuffled)")
        else:
            log(f"  fetch 전부 실패 — 기존 {len(self.servers)} 서버 유지")

    def pick_server(self) -> dict | None:
        """used_ips 피해서 하나 뽑기. 풀 소진 시 used 리셋."""
        if not self.servers:
            return None
        for s in self.servers:
            if s["ip"] not in self.used_ips:
                self.used_ips.add(s["ip"])
                return s
        log("모든 IP used. used set 리셋")
        self.used_ips.clear()
        s = self.servers[0]
        self.used_ips.add(s["ip"])
        return s

    # ── 포트 관리 ────────────────────────────────────────
    def boot_port(self, p: Port, max_attempts: int = 4) -> bool:
        if p.server_ip:
            self.used_ips.discard(p.server_ip)
        for attempt in range(max_attempts):
            s = self.pick_server()
            if not s:
                return False
            p.start(s["host"], s["ip"], s["port"], s["proto"])
            # tunnel up 대기 (node-openvpn-socks 로그에 "tunnel up")
            deadline = time.time() + 25
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
                log(f"port {p.port}: tunnel 실패 (host={s['host']})")
                p.stop(); continue
            exit_ip = p.check_health()
            if exit_ip:
                log(f"port {p.port}: READY exit={exit_ip} via {s['host']}")
                return True
            log(f"port {p.port}: health check 실패 (host={s['host']})")
            p.stop()
        return False

    def rotate_port(self, idx: int):
        p = self.ports[idx]
        old = p.server_host
        log(f"port {p.port}: rotate (was {old})")
        self.boot_port(p)

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
