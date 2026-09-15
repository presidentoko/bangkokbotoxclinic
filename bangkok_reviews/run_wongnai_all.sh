#!/bin/bash
# 방콕이 끝나면 나머지 도시를 순서대로. 각 단계는 이어받기가 되므로
# 중간에 죽어도 같은 명령을 다시 넣으면 된다.
set -u
cd "$(dirname "$0")"
LOG=../logs/wongnai_crawl.log
for CITY in bangkok pattaya chiang_mai phuket; do
  echo "=== $CITY 시작 $(date '+%F %T') ===" >> "$LOG"
  python wongnai_crawl.py --region "$CITY" --pages 600 --delay 2.5 --stage both >> "$LOG" 2>&1
  echo "=== $CITY 종료 $(date '+%F %T') ===" >> "$LOG"
done
echo "=== 전체 완료 $(date '+%F %T') ===" >> "$LOG"
