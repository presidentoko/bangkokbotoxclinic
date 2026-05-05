#!/bin/bash
# 파이프라인 기동:
#   1) nordvpn_runner.py — 8개 SOCKS5 포트 (2080-2087)
#   2) scraper_grid.py   — 1 워커 (포트 2080) 그리드 스캔
#   3) scraper.py        — 7 워커 (포트 2081-2087) 상세 + 리뷰 수집
#
# Usage:
#   bash scripts/run.sh [mode] [city]
#   mode: all (기본) | grid-only | rev-only
#   city: bangkok (기본) | chiang_mai | phuket | pattaya | ayutthaya
#
# 예시:
#   bash scripts/run.sh all bangkok
#   bash scripts/run.sh all chiang_mai

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p logs run
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate
export PYTHONIOENCODING=utf-8

MODE="${1:-all}"
CITY="${2:-bangkok}"

# ── 도시별 환경변수 설정
case "$CITY" in
    bangkok)
        export CITY_LAT=13.7462890 CITY_LNG=100.5346890 CITY_RADIUS_M=30000
        export CITY_OUTPUT_DIR="output"
        ;;
    chiang_mai)
        export CITY_LAT=18.7883 CITY_LNG=98.9853 CITY_RADIUS_M=20000
        export CITY_OUTPUT_DIR="../chiang_mai/output"
        mkdir -p bangkok_reviews/../chiang_mai/output/reviews
        ;;
    phuket)
        export CITY_LAT=7.8804 CITY_LNG=98.3923 CITY_RADIUS_M=20000
        export CITY_OUTPUT_DIR="../phuket/output"
        mkdir -p bangkok_reviews/../phuket/output/reviews
        ;;
    pattaya)
        export CITY_LAT=12.9236 CITY_LNG=100.8825 CITY_RADIUS_M=20000
        export CITY_OUTPUT_DIR="../pattaya/output"
        mkdir -p bangkok_reviews/../pattaya/output/reviews
        ;;
    ayutthaya)
        export CITY_LAT=14.3532 CITY_LNG=100.5689 CITY_RADIUS_M=15000
        export CITY_OUTPUT_DIR="../ayutthaya/output"
        mkdir -p bangkok_reviews/../ayutthaya/output/reviews
        ;;
    *)
        echo "알 수 없는 도시: $CITY"; exit 1 ;;
esac
echo "[run] 도시: $CITY (lat=$CITY_LAT, lng=$CITY_LNG, r=${CITY_RADIUS_M}m)"

free_vpn_ports() {
    # 좀비 node 프로세스가 포트를 점유하고 있으면 강제 해제
    for port in 2080 2081 2082 2083 2084 2085 2086 2087; do
        pid=$(netstat -ano 2>/dev/null | grep ":${port} " | grep LISTENING | awk '{print $5}' | head -1)
        if [ -n "$pid" ] && [ "$pid" != "0" ]; then
            echo "[run] 포트 ${port} 점유 PID=${pid} 해제"
            taskkill //F //PID "$pid" 2>/dev/null || true
        fi
    done
    pkill -f "node.*dist/cli" 2>/dev/null || true
    sleep 1
}

start_vpn() {
    if [ -f run/nordvpn_runner.pid ] && kill -0 "$(cat run/nordvpn_runner.pid)" 2>/dev/null; then
        echo "[run] nordvpn_runner 이미 실행중 (PID $(cat run/nordvpn_runner.pid))"
        return
    fi
    free_vpn_ports
    nohup python3 nordvpn_runner.py \
        --ports 8 --base-port 2080 \
        --auth nordvpn/auth.txt \
        --proto tcp \
        > logs/nordvpn_runner.log 2>&1 &
    printf '%s' "$!" > run/nordvpn_runner.pid
    echo "[run] nordvpn_runner 기동 PID=$! (포트 2080-2087)"
    echo "[run] VPN 8포트 bootstrap 대기..."
    for i in $(seq 1 60); do
        if grep -q "bootstrap 완료" logs/nordvpn_runner.log 2>/dev/null; then
            echo "[run] ✓ VPN ready"; return 0
        fi
        sleep 3
    done
    echo "[run] ⚠ VPN bootstrap 타임아웃"
}

start_grid() {
    local pidfile="run/${CITY}_grid.pid"
    local logfile="logs/${CITY}_grid.log"
    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[run] grid[$CITY] 이미 실행중"; return
    fi
    cd bangkok_reviews
    nohup python3 scraper_grid.py > "../$logfile" 2>&1 &
    printf '%s' "$!" > "../$pidfile"
    cd "$ROOT"
    echo "[run] scraper_grid[$CITY] 기동 PID=$(cat "$pidfile")"
}

start_review() {
    local pidfile="run/${CITY}_review.pid"
    local logfile="logs/${CITY}_review.log"
    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
        echo "[run] review[$CITY] 이미 실행중"; return
    fi
    cd bangkok_reviews
    nohup python3 scraper.py > "../$logfile" 2>&1 &
    printf '%s' "$!" > "../$pidfile"
    cd "$ROOT"
    echo "[run] scraper(review)[$CITY] 기동 PID=$(cat "$pidfile")"
}

case "$MODE" in
    all)       start_vpn; start_grid; start_review ;;
    grid-only) start_vpn; start_grid ;;
    rev-only)  start_vpn; start_review ;;
    *) echo "unknown mode: $MODE"; exit 1 ;;
esac

echo ""
echo "──────────────────────────────────────────"
echo "도시: $CITY"
echo "모니터링:"
echo "  tail -f logs/${CITY}_grid.log"
echo "  tail -f logs/${CITY}_review.log"
echo "중단: bash scripts/stop.sh $CITY"
echo "──────────────────────────────────────────"

# ── 워치독: 프로세스 죽으면 자동 재시작 ──────────────────────
echo "[watchdog] 시작 (10초 주기 감시)"
while true; do
    sleep 10
    # stop 파일 있으면 워치독 종료
    if [ -f "run/stop_${CITY}" ]; then
        echo "[watchdog] stop 신호 감지, 종료"
        break
    fi
    # VPN runner 감시
    if [ -f run/nordvpn_runner.pid ]; then
        if ! kill -0 "$(cat run/nordvpn_runner.pid)" 2>/dev/null; then
            echo "[watchdog] nordvpn_runner 죽음 → 재시작"
            start_vpn
            sleep 15  # VPN 안정화 대기
        fi
    fi
    # grid 감시
    if [ "$MODE" = "all" ] || [ "$MODE" = "grid-only" ]; then
        pidfile="run/${CITY}_grid.pid"
        if [ -f "$pidfile" ] && ! kill -0 "$(cat "$pidfile")" 2>/dev/null; then
            echo "[watchdog] grid[$CITY] 죽음 → 재시작"
            start_grid
        fi
    fi
    # review 감시
    if [ "$MODE" = "all" ] || [ "$MODE" = "rev-only" ]; then
        pidfile="run/${CITY}_review.pid"
        if [ -f "$pidfile" ] && ! kill -0 "$(cat "$pidfile")" 2>/dev/null; then
            echo "[watchdog] review[$CITY] 죽음 → 재시작"
            start_review
        fi
    fi
done
