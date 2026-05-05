#!/bin/bash
# 방콕 review 완료 감지 → 파타야부터 순차 자동 시작
# Usage: bash scripts/wait_and_continue.sh
#
# 완료 감지 조건:
#   review 프로세스가 죽고, 로그 마지막 30줄에 "처리 대상 없음" 또는
#   워커가 60분간 "신규" 0건이면 완료로 판단

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOG="logs/bangkok_review.log"
PID_FILE="run/bangkok_review.pid"

echo "[wait] 방콕 review 완료 감지 대기 중..."
echo "[wait] 로그: $LOG"

idle_streak=0
while true; do
    sleep 120  # 2분마다 체크

    # PID 파일이 없거나 프로세스가 죽으면 완료
    if [ ! -f "$PID_FILE" ] || ! kill -0 "$(cat "$PID_FILE" 2>/dev/null)" 2>/dev/null; then
        echo "[wait] 방콕 review 프로세스 종료 감지"
        break
    fi

    # 로그에서 완료 키워드 체크
    if tail -50 "$LOG" 2>/dev/null | grep -q "처리 대상 없음\|큐 소진\|전체 완료\|남은 작업: 0"; then
        echo "[wait] 방콕 review 완료 키워드 감지"
        break
    fi

    # 120분간 신규 수집 0건이면 완료로 간주
    recent_new=$(tail -200 "$LOG" 2>/dev/null | grep -c "신규 [1-9]" || true)
    if [ "$recent_new" -eq 0 ]; then
        idle_streak=$((idle_streak + 1))
        echo "[wait] 신규 수집 없음 감지 $idle_streak/60..."
    else
        idle_streak=0
    fi

    if [ $idle_streak -ge 60 ]; then
        echo "[wait] 방콕 신규 수집 120분 없음 → 완료로 판단"
        break
    fi

    # 현재 상태 출력 (30분마다)
    if [ $((idle_streak % 15)) -eq 0 ] && [ $idle_streak -gt 0 ]; then
        echo "[wait] 계속 대기 중... (idle=$idle_streak)"
        tail -3 "$LOG" 2>/dev/null
    fi
done

echo ""
echo "[wait] ✓ 방콕 완료! 파타야부터 순차 시작합니다..."
echo "[wait] 순서: 파타야 → 치앙마이 → 푸켓 → 아유타야"
echo ""

bash scripts/run_all_cities.sh pattaya
