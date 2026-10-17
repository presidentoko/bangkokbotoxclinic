#!/bin/bash
# 치앙마이(목록 2,900 이미 확보 → 상세만) → 푸켓(목록+상세).
# 9월에 180페이지쯤부터 IP 차단이 걸렸다. 간격을 3초로 늘리고, 403 이 나면
# 크롤러가 해당 터널 교체를 요청한다(wongnai_crawl.py request_rotation).
cd "$(dirname "$0")"
echo "=== chiang_mai details 시작 $(date '+%F %T') ===" >> ../logs/wongnai_chiang_mai.log
python wongnai_crawl.py --region chiang_mai --delay 3.0 --stage details >> ../logs/wongnai_chiang_mai.log 2>&1
echo "=== chiang_mai 종료 $(date '+%F %T') ===" >> ../logs/wongnai_chiang_mai.log
echo "=== phuket 시작 $(date '+%F %T') ===" >> ../logs/wongnai_phuket.log
python wongnai_crawl.py --region phuket --pages 600 --delay 3.0 --stage both >> ../logs/wongnai_phuket.log 2>&1
echo "=== phuket 종료 $(date '+%F %T') ===" >> ../logs/wongnai_phuket.log
