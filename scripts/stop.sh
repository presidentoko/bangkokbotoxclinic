#!/bin/bash
# 프로세스 종료.
#
# Usage:
#   bash scripts/stop.sh           # 전체 종료 (VPN 포함)
#   bash scripts/stop.sh bangkok   # 특정 도시만

set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CITY="${1:-}"

stop_city() {
    local city="$1"
    for name in review grid; do
        local pidfile="run/${city}_${name}.pid"
        if [ -f "$pidfile" ]; then
            local pid
            pid=$(cat "$pidfile")
            if kill -0 "$pid" 2>/dev/null; then
                echo "[stop] ${name}[$city] PID=$pid 종료"
                kill -TERM "$pid" 2>/dev/null
            fi
            rm -f "$pidfile"
        fi
    done
}

if [ -n "$CITY" ]; then
    touch "run/stop_${CITY}"  # 워치독 종료 신호
    stop_city "$CITY"
    sleep 3
    rm -f "run/stop_${CITY}"
    pkill -KILL -f "scraper_grid.py" 2>/dev/null
    pkill -KILL -f "python3 scraper.py" 2>/dev/null
else
    for city in bangkok chiang_mai phuket pattaya ayutthaya; do
        touch "run/stop_${city}"  # 워치독 종료 신호
        stop_city "$city"
    done
    sleep 1
    rm -f run/stop_*
    # 레거시 PID 파일도 처리
    for name in review grid nordvpn_runner; do
        pidfile="run/${name}.pid"
        if [ -f "$pidfile" ]; then
            pid=$(cat "$pidfile")
            if kill -0 "$pid" 2>/dev/null; then
                echo "[stop] $name PID=$pid 종료"
                kill -TERM "$pid" 2>/dev/null
            fi
            rm -f "$pidfile"
        fi
    done
    sleep 5
    pkill -KILL -f "node.*dist/cli" 2>/dev/null
    pkill -KILL -f "scraper_grid.py" 2>/dev/null
    pkill -KILL -f "python3 scraper.py" 2>/dev/null
    pkill -KILL -f "nordvpn_runner" 2>/dev/null
fi

echo "[stop] 완료"
