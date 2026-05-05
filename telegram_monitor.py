#!/usr/bin/env python3
"""
텔레그램 모니터 — 다중 도시 스크래퍼 원격 컨트롤.

- 30분마다 자동 상태 리포트 (4개 서비스 통합)
- 프로세스 죽음/부활 즉시 알림
- 명령:
    /status                — 현재 상태
    /restart <service>     — 해당 서비스 강제 종료 (watchdog 이 부활)
    /log <service> [N]     — 로그 마지막 N줄 (기본 30, 최대 80)
    /help
"""
import json
import logging
import os
import re
import threading
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

BOT_TOKEN = "8651817046:AAFK0gSQjdnB9mKoahvP2NfjELRr1QEZsas"
CHAT_ID   = "8488265054"
ROOT      = Path(__file__).parent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

STATUS_INTERVAL = 30 * 60   # 30분마다 자동 리포트
WATCH_INTERVAL  = 30        # 30초마다 프로세스 감시

# 감시 대상: name -> (pid_file, log_file, kind)
# kind: "vpn" | "grid" | "review"
SERVICES = {
    "nordvpn":        ("nordvpn_runner.pid",  "nordvpn_runner.log", "vpn"),
    "bangkok_review": ("bangkok_review.pid",  "bangkok_review.log", "review"),
    "pattaya_grid":   ("pattaya_grid.pid",    "pattaya_grid.log",   "grid"),
    "pattaya_review": ("pattaya_review.pid",  "pattaya_review.log", "review"),
}


# ── Telegram API ──────────────────────────────────────────────

def send(text: str):
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        data = urllib.parse.urlencode({
            "chat_id":    CHAT_ID,
            "text":       text,
            "parse_mode": "HTML",
        }).encode()
        urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=10)
    except Exception as e:
        log.warning(f"텔레그램 전송 실패: {e}")


def get_updates(offset: int = 0) -> list:
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates?offset={offset}&timeout=5"
        resp = urllib.request.urlopen(url, timeout=10)
        return json.loads(resp.read()).get("result", [])
    except Exception:
        return []


# ── 상태 수집 ─────────────────────────────────────────────────

def is_pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except (OSError, ProcessLookupError):
        return False


def read_pid(pid_file: str) -> int | None:
    p = ROOT / "run" / pid_file
    if not p.exists():
        return None
    try:
        return int(p.read_text().strip())
    except (ValueError, OSError):
        return None


def service_alive(name: str) -> bool:
    pid_file, _, _ = SERVICES[name]
    pid = read_pid(pid_file)
    return pid is not None and is_pid_alive(pid)


def read_log_tail(log_file: str, n_bytes: int = 8192) -> str:
    p = ROOT / "logs" / log_file
    try:
        with open(p, "rb") as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - n_bytes))
            return f.read().decode("utf-8", errors="ignore")
    except Exception:
        return ""


def parse_grid(log_file: str) -> dict | None:
    """grid 로그에서 마지막 진행 라인 파싱."""
    tail = read_log_tail(log_file)
    last = None
    for line in tail.splitlines():
        if "★ 진행" in line:
            last = line
    if not last:
        return None
    m = re.search(
        r"processed=(\d+).*pending=(\d+).*식당=(\d+).*속도=([\d.]+)/분.*ETA ([\d.]+)분",
        last,
    )
    if not m:
        return None
    return {
        "processed":   int(m.group(1)),
        "pending":     int(m.group(2)),
        "restaurants": int(m.group(3)),
        "speed":       float(m.group(4)),
        "eta_min":     float(m.group(5)),
    }


def parse_review(log_file: str) -> dict | None:
    """review 로그에서 마지막 진행 단서 파싱."""
    tail = read_log_tail(log_file)
    done = remaining = speed = None
    for line in tail.splitlines():
        m = re.search(
            r"\[(\d+)\].*남은 후보 (\d+).*처리율 ([\d.]+)/분", line
        )
        if m:
            done = int(m.group(1))
            remaining = int(m.group(2))
            speed = float(m.group(3))
    if done is None:
        return None
    return {"done": done, "remaining": remaining, "speed": speed}


def parse_vpn(log_file: str) -> dict | None:
    tail = read_log_tail(log_file, 4096)
    alive_count = 0
    for line in tail.splitlines()[-30:]:
        m = re.search(r"alive=(\d+)/(\d+)", line)
        if m:
            alive_count = int(m.group(1))
            total = int(m.group(2))
            return {"alive": alive_count, "total": total}
    return None


def build_status_msg() -> str:
    now = datetime.now().strftime("%m/%d %H:%M")
    lines = [f"🤖 <b>스크래퍼 상태</b> [{now}]"]

    for name, (pid_file, log_file, kind) in SERVICES.items():
        alive = service_alive(name)
        icon = "✅" if alive else "❌"
        head = f"\n<b>{name}</b> {icon}"

        if not alive:
            lines.append(head + " — 죽음 (watchdog 이 부활 시도 중)")
            continue

        if kind == "vpn":
            v = parse_vpn(log_file)
            if v:
                head += f" — {v['alive']}/{v['total']} 포트"
            lines.append(head)
        elif kind == "grid":
            g = parse_grid(log_file)
            if g:
                total = g["processed"] + g["pending"]
                pct = g["processed"] / total * 100 if total else 0
                head += (
                    f"\n  📍 {g['processed']:,}/{total:,} ({pct:.0f}%)"
                    f" | 식당 {g['restaurants']:,}"
                    f"\n  속도 {g['speed']:.1f}/분 | ETA {g['eta_min']/60:.1f}h"
                )
            lines.append(head)
        elif kind == "review":
            r = parse_review(log_file)
            if r:
                head += (
                    f"\n  📝 {r['done']:,}개 완료"
                    f" | 남은 {r['remaining']:,}"
                    f" | {r['speed']:.1f}/분"
                )
            lines.append(head)

    return "\n".join(lines)


# ── 자동 리포트 ───────────────────────────────────────────────

def status_reporter():
    time.sleep(10)
    while True:
        send(build_status_msg())
        time.sleep(STATUS_INTERVAL)


# ── 프로세스 감시 ─────────────────────────────────────────────

def process_watcher():
    prev = {name: True for name in SERVICES}
    time.sleep(60)
    while True:
        time.sleep(WATCH_INTERVAL)
        for name in SERVICES:
            now_alive = service_alive(name)
            if prev[name] and not now_alive:
                send(f"⚠️ <b>{name}</b> 죽음 — watchdog 부활 대기")
            elif not prev[name] and now_alive:
                send(f"✅ <b>{name}</b> 부활")
            prev[name] = now_alive


# ── 명령 처리 ─────────────────────────────────────────────────

HELP_TEXT = (
    "📋 <b>명령어</b>\n\n"
    "/status — 현재 상태\n"
    "/restart &lt;서비스&gt; — 강제 종료 (watchdog 이 부활)\n"
    "/log &lt;서비스&gt; [N] — 로그 마지막 N줄 (기본 30)\n"
    "/help\n\n"
    "<b>서비스 이름:</b>\n"
    "  nordvpn, bangkok_review, pattaya_grid, pattaya_review\n\n"
    "예: <code>/log pattaya_grid 50</code>"
)


def cmd_restart(arg: str) -> str:
    name = arg.strip().lower()
    if name not in SERVICES:
        return f"❓ 알 수 없는 서비스: <code>{name}</code>\n사용 가능: {', '.join(SERVICES)}"
    pid_file, _, _ = SERVICES[name]
    pid = read_pid(pid_file)
    if pid is None:
        return f"❌ <b>{name}</b> PID 파일 없음"
    if not is_pid_alive(pid):
        return f"ℹ️ <b>{name}</b> 이미 죽음 (PID {pid}). watchdog 곧 부활시킬 거야."
    try:
        os.kill(pid, 9)  # SIGKILL
    except Exception as e:
        return f"❌ <b>{name}</b> kill 실패: {e}"
    return f"💀 <b>{name}</b> (PID {pid}) 종료. watchdog 이 20초 안에 부활."


def cmd_log(arg: str) -> str:
    parts = arg.strip().split()
    if not parts:
        return "사용법: <code>/log &lt;서비스&gt; [N]</code>"
    name = parts[0].lower()
    if name not in SERVICES:
        return f"❓ 알 수 없는 서비스: <code>{name}</code>"
    n = 30
    if len(parts) >= 2:
        try:
            n = max(1, min(80, int(parts[1])))
        except ValueError:
            pass
    _, log_file, _ = SERVICES[name]
    p = ROOT / "logs" / log_file
    try:
        with open(p, "rb") as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - 16384))
            tail_lines = f.read().decode("utf-8", errors="ignore").splitlines()[-n:]
    except Exception as e:
        return f"❌ 로그 읽기 실패: {e}"
    body = "\n".join(tail_lines)
    if len(body) > 3500:
        body = body[-3500:]
    return f"📜 <b>{name}.log</b> (마지막 {len(tail_lines)}줄)\n<pre>{_escape(body)}</pre>"


def _escape(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def command_listener():
    last_id = 0
    while True:
        for upd in get_updates(offset=last_id + 1):
            last_id = upd["update_id"]
            msg = upd.get("message", {})
            text = msg.get("text", "").strip()
            cid = str(msg.get("chat", {}).get("id", ""))
            if cid != CHAT_ID or not text:
                continue

            head, _, arg = text.partition(" ")
            head = head.lower().lstrip("/")

            if head in ("status", "s"):
                send(build_status_msg())
            elif head == "restart":
                send(cmd_restart(arg))
            elif head == "log":
                send(cmd_log(arg))
            elif head in ("help", "h"):
                send(HELP_TEXT)
            else:
                send(f"❓ 모르는 명령어: /{head}\n/help 참고")
        time.sleep(3)


# ── 메인 ─────────────────────────────────────────────────────

def main():
    send("🚀 <b>모니터 시작</b>\n4개 서비스 감시. /help")
    log.info("텔레그램 모니터 시작")

    threads = [
        threading.Thread(target=status_reporter,  daemon=True),
        threading.Thread(target=process_watcher,  daemon=True),
        threading.Thread(target=command_listener, daemon=True),
    ]
    for t in threads:
        t.start()

    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        send("🛑 모니터 종료")


if __name__ == "__main__":
    main()
