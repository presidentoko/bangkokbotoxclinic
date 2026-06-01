"""Konvy 전용 VPN 터널 기동 + 시분할 폴백 판정.

전략:
  1) 전용 2090–2091 기동 시도 → 살아나면 그걸 쓴다.
  2) (계정 동시접속 한도 초과 등으로) 안 살아나면 기존 풀 꼬리(2086–2087)로 폴백.
"""
from __future__ import annotations
import os
import socket
import subprocess
import time
import logging
from pathlib import Path
from . import config

log = logging.getLogger("cosmetics.vpn")

def _port_open(port: int, host: str | None = None) -> bool:
    host = host or config.PROXY_HOST
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        return s.connect_ex((host, port)) == 0
    finally:
        s.close()

def ports_alive(ports: list[int]) -> set[int]:
    return {p for p in ports if _port_open(p)}

def dedicated_ports() -> list[int]:
    return [config.PROXY_PORT_BASE + i for i in range(config.N_TUNNELS)]

def fallback_ports() -> list[int]:
    return [config.FALLBACK_PORT_BASE + i for i in range(config.N_TUNNELS)]

def start_dedicated(auth: Path, wait_sec: int = 90) -> bool:
    """전용 터널 runner 기동. wait_sec 안에 전 포트가 살아나면 True.
    nordvpn_runner.py 는 repo 루트에 있고, UTF-8 강제 env 필수(없으면 crash).
    """
    env = dict(os.environ, PYTHONUTF8="1", PYTHONIOENCODING="utf-8")
    subprocess.Popen(
        ["python", "nordvpn_runner.py",
         "--ports", str(config.N_TUNNELS),
         "--base-port", str(config.PROXY_PORT_BASE),
         "--auth", str(auth), "--proto", "tcp"],
        env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    target = set(dedicated_ports())
    deadline = time.time() + wait_sec
    while time.time() < deadline:
        if ports_alive(dedicated_ports()) == target:
            return True
        time.sleep(3)
    return False

def pick_active_ports() -> list[int]:
    """현재 사용할 포트 결정. 전용이 전부 살아있으면 전용, 아니면 살아있는 폴백, 그것도 없으면 전용(추후 기동 대기)."""
    ded = dedicated_ports()
    if ports_alive(ded) == set(ded):
        return ded
    fb = ports_alive(fallback_ports())
    if fb:
        log.warning("전용 터널 불가 → 시분할 폴백 %s", sorted(fb))
        return sorted(fb)
    return ded
