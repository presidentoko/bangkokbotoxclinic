#!/usr/bin/env bash
# Vercel "Ignore Build Step" 훅. exit 0 = 빌드 스킵, exit 1 = 빌드 진행.
#
# 왜 필요한가 (2026-08-21):
#   auto_push_loop 이 master_db/clinics.json 을 하루 11회 커밋하는데, git 연동이
#   그때마다 프로덕션 배포를 태운다. 덴탈·보톡스는 배포 한 번에 프리렌더 7,952
#   페이지를 다시 굽고 ISR 캐시가 통째로 무효화되며, 그걸 Googlebot 이 다시
#   채우는 게 전부 ISR Write 로 계산된다 — Hobby 한도 200K 에 981K 가 찍힌
#   직접적인 원인이다. chillanel 은 같은 병을 refresh-and-deploy.mjs 의 정숙
#   구간 + 24h 상한으로 이미 고쳤는데, 클리닉 3사이트는 git 연동이라 아무
#   제어도 없었다.
#
# 규칙:
#   1) 소스(코드) 변경이 있으면 항상 빌드한다 — 사람이 고친 건 즉시 나가야 한다.
#   2) 데이터 파일만 바뀐 커밋은 하루 한 번(UTC 02~04시)만 빌드한다.
#      상태 파일 없이 판정하려고 시간창을 쓴다. 자동 커밋이 약 2시간 간격이라
#      이 3시간 창에는 거의 매일 하나가 들어온다. 창을 놓친 날은 데이터 반영이
#      하루 밀릴 뿐이고, 급하면 대시보드에서 Redeploy 하면 된다.
#   3) 판정 불가(얕은 클론으로 HEAD^ 없음)면 안전하게 빌드한다.
set -u
site="${1:-}"
case "$site" in
  botox)  inc=':(top)web'                       exc=':(exclude,top)web/data' ;;
  facial) inc=':(top)thaifacialclinic-portable' exc=':(exclude,top)thaifacialclinic-portable/public/data' ;;
  *) echo "build: unknown site '$site' — 판정 불가라 빌드"; exit 1 ;;
esac
git rev-parse --verify -q HEAD^ >/dev/null || { echo "build: HEAD^ 없음(얕은 클론)"; exit 1; }
if ! git diff --quiet HEAD^ HEAD -- "$inc" "$exc"; then
  echo "build: $site 소스 변경 감지"; exit 1
fi
case "$(date -u +%H)" in
  02|03|04) echo "build: $site 데이터 일일 창(UTC $(date -u +%H)시)"; exit 1 ;;
esac
echo "skip: $site 데이터 전용 커밋, 일일 창(UTC 02-04) 밖 — 현재 UTC $(date -u +%H)시"
exit 0
