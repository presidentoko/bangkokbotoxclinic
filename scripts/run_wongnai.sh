#!/bin/bash
# 웡나이 스크래퍼 기동 (VPN 불필요)
#
# Usage:
#   bash scripts/run_wongnai.sh [city]
#   city: bangkok (기본) | chiang_mai | phuket | pattaya

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p logs run

source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate
export PYTHONIOENCODING=utf-8

CITY="${1:-bangkok}"

case "$CITY" in
    bangkok)
        export CITY=bangkok
        export WONGNAI_OUTPUT_DIR="wongnai/output"
        ;;
    chiang_mai)
        export CITY=chiang_mai
        export WONGNAI_OUTPUT_DIR="wongnai/chiang_mai_output"
        ;;
    phuket)
        export CITY=phuket
        export WONGNAI_OUTPUT_DIR="wongnai/phuket_output"
        ;;
    pattaya)
        export CITY=pattaya
        export WONGNAI_OUTPUT_DIR="wongnai/pattaya_output"
        ;;
    *)
        echo "알 수 없는 도시: $CITY"; exit 1 ;;
esac

mkdir -p "$WONGNAI_OUTPUT_DIR/reviews"
echo "[run_wongnai] 도시: $CITY → 출력: $WONGNAI_OUTPUT_DIR"

start_wongnai() {
    local pidfile="run/wongnai_${CITY}.pid"
    local logfile="logs/wongnai_${CITY}.log"

    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[run_wongnai] 이미 실행중 (PID $(cat "$pidfile"))"
        return
    fi

    cd wongnai
    nohup python3 scraper.py > "../$logfile" 2>&1 &
    printf '%s' "$!" > "../$pidfile"
    cd "$ROOT"
    echo "[run_wongnai] 기동 PID=$(cat "$pidfile") → 로그: $logfile"
}

start_wongnai

echo ""
echo "──────────────────────────────────────────"
echo "도시: $CITY"
echo "모니터링: tail -f logs/wongnai_${CITY}.log"
echo "중단:     bash scripts/stop_wongnai.sh $CITY"
echo "──────────────────────────────────────────"

# ── 워치독: 죽으면 자동 재시작 ──────────────────────────────
echo "[watchdog] 시작 (15초 주기 감시)"
while true; do
    sleep 15

    if [ -f "run/stop_wongnai_${CITY}" ]; then
        echo "[watchdog] stop 신호 감지, 종료"
        rm -f "run/stop_wongnai_${CITY}"
        break
    fi

    pidfile="run/wongnai_${CITY}.pid"
    if [ -f "$pidfile" ] && ! kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[watchdog] wongnai[$CITY] 죽음 → 재시작"
        rm -f "$pidfile"
        start_wongnai
    fi
done
