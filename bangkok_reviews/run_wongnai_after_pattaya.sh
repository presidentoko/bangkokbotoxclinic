#!/bin/bash
# 파타야가 끝나길 기다렸다가 치앙마이 → 푸켓. 동시에 돌리면 같은 VPN 출구를
# 나눠 써서 속도 제한이 더 자주 걸린다.
cd "$(dirname "$0")"
while powershell -NoProfile -Command "if (Get-Process -Id 12852 -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"; do
  sleep 60
done
for CITY in chiang_mai phuket; do
  echo "=== $CITY 시작 $(date '+%F %T') ===" >> ../logs/wongnai_$CITY.log
  python wongnai_crawl.py --region "$CITY" --pages 600 --delay 1.5 --stage both >> ../logs/wongnai_$CITY.log 2>&1
done
echo "=== 치앙마이·푸켓 완료 $(date '+%F %T') ===" >> ../logs/wongnai_chiang_mai.log
