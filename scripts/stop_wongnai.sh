#!/bin/bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CITY="${1:-bangkok}"

# 워치독 종료 신호
touch "run/stop_wongnai_${CITY}"

pidfile="run/wongnai_${CITY}.pid"
if [ -f "$pidfile" ]; then
    pid=$(cat "$pidfile")
    if kill -0 "$pid" 2>/dev/null; then
        echo "[stop_wongnai] wongnai[$CITY] PID=$pid 종료"
        kill -TERM "$pid" 2>/dev/null
    fi
    rm -f "$pidfile"
fi

sleep 3
pkill -KILL -f "wongnai/scraper.py" 2>/dev/null
echo "[stop_wongnai] 완료"
