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
# 2026-08-24: scripts/ 도 소스로 친다.
# 빌드 게이트(이 파일)와 build-data 스크립트가 scripts/ 에 있는데 이걸 소스로
# 안 봐서, 게이트를 고치는 커밋이 **자기 자신을 스킵**했다. 머지 처리 누락을
# 고친 cad39e6 이 scripts/ 만 건드려 "데이터 전용" 으로 판정됐고, 그래서
# 보톡스 소관 확대가 여전히 배포되지 않았다.
# 빌드 동작을 바꾸는 파일이 빌드를 못 태우면 고칠 방법이 없어진다.
case "$site" in
  botox)  inc=':(top)web'                       exc=':(exclude,top)web/data' ;;
  facial) inc=':(top)thaifacialclinic-portable' exc=':(exclude,top)thaifacialclinic-portable/public/data' ;;
  *) echo "build: unknown site '$site' — 판정 불가라 빌드"; exit 1 ;;
esac
git rev-parse --verify -q HEAD^ >/dev/null || { echo "build: HEAD^ 없음(얕은 클론)"; exit 1; }

# 2026-08-24: 머지 커밋이면 무조건 빌드한다.
# `git diff HEAD^ HEAD` 는 **첫 부모** 기준이라, 다른 브랜치에서 온 변경이
# 머지로 들어오면 첫 부모 대비로는 안 보인다. 실제로 이것 때문에 보톡스
# 소관 확대(web/lib/site.ts)가 origin/main 에 올라갔는데도 빌드가 스킵됐다
# (머지 85d264c: 첫 부모 대비 "변경 없음", 두 번째 부모 대비 "변경 있음").
# 이 레포는 auto_push_loop 이 diverge 시 fetch+merge 후 푸시하므로 머지 커밋이
# 일상적으로 생긴다 — 즉 흔한 경로에서 조용히 배포가 누락된다.
# 교체 전 보톡스 설정에 있던 `HEAD^2 && exit 1` 를 옮겨오지 못한 것이 원인이다.
if git rev-parse --verify -q HEAD^2 >/dev/null; then
  echo "build: 머지 커밋 — 첫 부모 diff 로는 판정 불가"
  exit 1
fi
if ! git diff --quiet HEAD^ HEAD -- "$inc" "$exc"; then
  echo "build: $site 소스 변경 감지"; exit 1
fi
if ! git diff --quiet HEAD^ HEAD -- ':(top)scripts'; then
  echo "build: 빌드 스크립트 변경 감지"; exit 1
fi
case "$(date -u +%H)" in
  02|03|04) echo "build: $site 데이터 일일 창(UTC $(date -u +%H)시)"; exit 1 ;;
esac
echo "skip: $site 데이터 전용 커밋, 일일 창(UTC 02-04) 밖 — 현재 UTC $(date -u +%H)시"
exit 0
