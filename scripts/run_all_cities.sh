#!/bin/bash
# 5개 도시 순차 수집: 방콕 → 치앙마이 → 푸켓 → 파타야 → 아유타야
#
# - VPN은 한번 기동 후 전 도시 공유
# - 각 도시: grid 완료 → review 큐 소진 확인 → 다음 도시
# - 중단 후 재실행 시 각 도시 checkpoint/기존 데이터로 자동 resume
#
# Usage:
#   bash scripts/run_all_cities.sh
#   bash scripts/run_all_cities.sh chiang_mai   # 특정 도시부터 시작

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate
export PYTHONIOENCODING=utf-8
mkdir -p logs run

START_FROM="${1:-bangkok}"
CITIES=(bangkok pattaya chiang_mai phuket ayutthaya)

declare -A CITY_LAT=( [bangkok]=13.7462890 [chiang_mai]=18.7883 [phuket]=7.8804 [pattaya]=12.9236 [ayutthaya]=14.3532 )
declare -A CITY_LNG=( [bangkok]=100.5346890 [chiang_mai]=98.9853 [phuket]=98.3923 [pattaya]=100.8825 [ayutthaya]=100.5689 )
declare -A CITY_RADIUS=( [bangkok]=30000 [chiang_mai]=20000 [phuket]=20000 [pattaya]=20000 [ayutthaya]=15000 )
declare -A CITY_OUTDIR=( [bangkok]="output" [chiang_mai]="../chiang_mai/output" [phuket]="../phuket/output" [pattaya]="../pattaya/output" [ayutthaya]="../ayutthaya/output" )

# ── VPN 기동 (전 도시 공유)
start_vpn() {
    if [ -f run/nordvpn_runner.pid ] && kill -0 "$(cat run/nordvpn_runner.pid)" 2>/dev/null; then
        echo "[all_cities] VPN 이미 실행중"
        return
    fi
    nohup python3 nordvpn_runner.py \
        --ports 8 --base-port 2080 \
        --auth nordvpn/auth.txt \
        --proto tcp \
        >> logs/nordvpn_runner.log 2>&1 &
    printf '%s' "$!" > run/nordvpn_runner.pid
    echo "[all_cities] VPN 기동 PID=$!"
    for i in $(seq 1 60); do
        if grep -q "bootstrap 완료" logs/nordvpn_runner.log 2>/dev/null; then
            echo "[all_cities] ✓ VPN ready"; return 0
        fi
        sleep 3
    done
    echo "[all_cities] ⚠ VPN bootstrap 타임아웃"
}

# ── 도시별 수집
run_city() {
    local city="$1"
    local lat="${CITY_LAT[$city]}"
    local lng="${CITY_LNG[$city]}"
    local radius="${CITY_RADIUS[$city]}"
    local outdir="${CITY_OUTDIR[$city]}"

    export CITY_LAT="$lat"
    export CITY_LNG="$lng"
    export CITY_RADIUS_M="$radius"
    export CITY_OUTPUT_DIR="$outdir"

    mkdir -p "bangkok_reviews/${outdir}/reviews"

    echo ""
    echo "════════════════════════════════════════════"
    echo "[all_cities] ▶ $city 시작"
    echo "  lat=$lat, lng=$lng, r=${radius}m"
    echo "  출력: bangkok_reviews/$outdir"
    echo "════════════════════════════════════════════"

    # Grid 기동
    cd bangkok_reviews
    nohup python3 scraper_grid.py > "../logs/${city}_grid.log" 2>&1 &
    GRID_PID=$!
    printf '%s' "$GRID_PID" > "../run/${city}_grid.pid"
    cd "$ROOT"
    echo "[all_cities] grid PID=$GRID_PID"

    # Review 기동
    cd bangkok_reviews
    nohup python3 scraper.py > "../logs/${city}_review.log" 2>&1 &
    REV_PID=$!
    printf '%s' "$REV_PID" > "../run/${city}_review.pid"
    cd "$ROOT"
    echo "[all_cities] review PID=$REV_PID"

    # Grid 완료 대기
    echo "[all_cities] grid 완료 대기 중..."
    wait $GRID_PID || true
    rm -f "run/${city}_grid.pid"
    echo "[all_cities] grid 완료. review 큐 소진 대기..."

    # Review 큐 소진 감지:
    # "대기 중" 메시지가 10분간(10회 × 60초) 연속 나오면 완료로 간주
    idle_streak=0
    while [ $idle_streak -lt 10 ]; do
        sleep 60
        if ! kill -0 "$REV_PID" 2>/dev/null; then
            echo "[all_cities] review 프로세스 종료됨"
            break
        fi
        recent=$(tail -30 "logs/${city}_review.log" 2>/dev/null | grep -c "대기 중" || true)
        if [ "$recent" -ge 3 ]; then
            idle_streak=$((idle_streak + 1))
            echo "[all_cities] review 큐 소진 감지 $idle_streak/10..."
        else
            idle_streak=0
        fi
    done

    # Review 종료
    if kill -0 "$REV_PID" 2>/dev/null; then
        echo "[all_cities] review 종료 요청..."
        kill -TERM "$REV_PID" 2>/dev/null
        sleep 5
        kill -KILL "$REV_PID" 2>/dev/null || true
    fi
    rm -f "run/${city}_review.pid"

    echo "[all_cities] ✓ $city 완료"

    unset CITY_LAT CITY_LNG CITY_RADIUS_M CITY_OUTPUT_DIR
}

# ── 메인
start_vpn

# START_FROM 도시부터 시작
skip=true
for city in "${CITIES[@]}"; do
    if [ "$city" = "$START_FROM" ]; then skip=false; fi
    if $skip; then
        echo "[all_cities] $city 건너뜀"
        continue
    fi
    run_city "$city"
done

# VPN 종료
if [ -f run/nordvpn_runner.pid ]; then
    kill "$(cat run/nordvpn_runner.pid)" 2>/dev/null || true
    rm -f run/nordvpn_runner.pid
fi

echo ""
echo "[all_cities] 전체 완료! 5개 도시 수집 끝."
