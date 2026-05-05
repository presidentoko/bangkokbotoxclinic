#!/bin/bash
# 방콕 클리닉 수집 파이프라인 (수동 기동용; watchdog 에도 등록되어 있음).
#
# Phase 1 (영문):  SEARCH_QUERY=clinic    SEARCH_TAG=en
# Phase 2 (태국어): SEARCH_QUERY=คลินิก   SEARCH_TAG=th
#
# Usage:
#   bash scripts/run_clinics.sh           # phase 1 (default)
#   bash scripts/run_clinics.sh phase2    # phase 2 — phase 1 grid 완료 후 실행
#
# 주의:
#   - nordvpn_runner 가 살아있어야 함 (없으면 scripts/run.sh 로 먼저 띄울 것)
#   - 동시에 다른 도시 grid 가 돌면 안 됨 (port 2080 공유) — 식당 grid 들 .disabled 확인
#
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p logs run bangkok_clinics/output/reviews
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate
export PYTHONIOENCODING=utf-8

PHASE="${1:-phase1}"
case "$PHASE" in
    phase1)
        export SEARCH_QUERY="clinic"
        export SEARCH_TAG="en"
        ;;
    phase2)
        export SEARCH_QUERY="คลินิก"
        export SEARCH_TAG="th"
        ;;
    *)
        echo "unknown phase: $PHASE (use phase1 or phase2)"; exit 1 ;;
esac

# 방콕 좌표 + 30km
export CITY_LAT=13.7462890 CITY_LNG=100.5346890 CITY_RADIUS_M=30000
export CITY_OUTPUT_DIR="output"

echo "[run_clinics] phase=$PHASE query='$SEARCH_QUERY' tag='$SEARCH_TAG'"

start_grid() {
    local pidfile="run/bangkok_clinics_grid.pid"
    local logfile="logs/bangkok_clinics_grid.log"
    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[run_clinics] grid 이미 실행중"; return
    fi
    cd bangkok_clinics
    nohup python3 scraper_grid.py > "../$logfile" 2>&1 &
    printf '%s' "$!" > "../$pidfile"
    cd "$ROOT"
    echo "[run_clinics] grid 기동 PID=$(cat "$pidfile")"
}

start_review() {
    local pidfile="run/bangkok_clinics_review.pid"
    local logfile="logs/bangkok_clinics_review.log"
    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[run_clinics] review 이미 실행중"; return
    fi
    cd bangkok_clinics
    nohup python3 scraper.py > "../$logfile" 2>&1 &
    printf '%s' "$!" > "../$pidfile"
    cd "$ROOT"
    echo "[run_clinics] review 기동 PID=$(cat "$pidfile")"
}

start_grid
start_review

echo ""
echo "──────────────────────────────────────────"
echo "phase: $PHASE"
echo "모니터링:"
echo "  tail -f logs/bangkok_clinics_grid.log"
echo "  tail -f logs/bangkok_clinics_review.log"
echo "출력: bangkok_clinics/output/"
echo "──────────────────────────────────────────"
