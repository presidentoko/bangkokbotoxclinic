#!/usr/bin/env bash
# Vercel "Ignore Build Step" 훅. exit 0 = 빌드 스킵, exit 1 = 빌드 진행.
#
# 왜 필요한가 (2026-08-21):
#   auto_push_loop 이 master_db/clinics.json 을 하루 11회 커밋하는데, git 연동이
#   그때마다 프로덕션 배포를 태운다. 덴탈·보톡스는 배포 한 번에 프리렌더 7,952
#   페이지를 다시 굽고 ISR 캐시가 통째로 무효화되며, 그걸 Googlebot 이 다시
#   채우는 게 전부 ISR Write 로 계산된다 — Hobby 한도 200K 에 981K 가 찍힌
#   직접적인 원인이다.
#
# 2026-10-03 재작성 — 이 게이트는 배포해야 할 걸 놓치고, 안 해도 될 걸 배포했다.
#   ISR Writes 414K/200K(2배 초과) 를 조사하다 찾았다.
#
#   (a) 놓침: `git diff HEAD^ HEAD` 는 **마지막 커밋 하나**만 본다. Vercel 은 push
#       묶음의 끝 커밋만 빌드하는데, auto_push_loop 이 데이터 커밋을 끝에 붙여
#       올리면 그 앞의 소스 변경은 "데이터 전용"으로 판정돼 버려진다. 실제로
#       fc06871(web/ 소스)·394340e(thaifacial 소스)가 origin 에 올라갔는데 두
#       프로젝트 모두 그 뒤 배포가 0건이다.
#   (b) 과잉: `scripts/` **폴더 전체**를 빌드 트리거로 봤다. 거기엔 watchdog·
#       ram_manager·스크래퍼 인프라가 다 있어서, 사이트와 무관한 인프라 커밋이
#       보톡스·thaifacial 을 둘 다 재빌드시켰다. 머지 커밋도 무조건 빌드였는데
#       auto_push_loop 이 머지를 일상적으로 만든다. 10-01 하루 보톡스 배포 3회.
#
#   고친 방법: 비교 기준을 HEAD^ 가 아니라 **마지막 성공 배포 커밋**
#   (VERCEL_GIT_PREVIOUS_SHA, Vercel 이 이 훅에 넘겨준다)으로 바꾼다. 그러면 묶음
#   안의 모든 커밋과 머지의 양쪽 부모가 한 번에 비교된다. 트리거 파일도 이 게이트
#   자체와 그 사이트의 빌드 스크립트로 좁힌다.
#
# 규칙:
#   0) scripts/deploy-hold 에 사이트명이 있으면 무조건 스킵 — ISR 한도 초과 중
#      배포를 멈추는 수동 브레이크. 줄을 지우고 커밋하면 풀린다.
#   1) 마지막 배포 이후 소스(코드) 변경이 있으면 빌드한다.
#   2) 데이터 파일만 바뀌었으면 하루 한 번(UTC 02~04시)만 빌드한다.
#   3) 판정 불가(기준 커밋을 못 구함)면 안전하게 빌드한다.
set -u
site="${1:-}"
here="$(cd "$(dirname "$0")" && pwd)"

case "$site" in
  botox)  inc=':(top)web'                       exc=':(exclude,top)web/data'
          build_files=':(top)scripts/vercel-ignore-build.sh' ;;
  facial) inc=':(top)thaifacialclinic-portable' exc=':(exclude,top)thaifacialclinic-portable/public/data'
          build_files=':(top)scripts/vercel-ignore-build.sh' ;;
  *) echo "build: unknown site '$site' — 판정 불가라 빌드"; exit 1 ;;
esac

# 0) 수동 브레이크
if [ -f "$here/deploy-hold" ] && grep -qxE "[[:space:]]*$site[[:space:]]*" "$here/deploy-hold"; then
  echo "skip: $site 는 scripts/deploy-hold 로 배포 보류 중"
  exit 0
fi

# 기준 커밋: 마지막 성공 배포. 얕은 클론이라 없으면 한 번 깊게 받아본다.
base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -n "$base" ] && ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  git fetch -q --deepen=300 2>/dev/null || git fetch -q --unshallow 2>/dev/null || true
fi
if [ -z "$base" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  # 이전 배포를 모르면 예전 방식으로 — 단 머지는 판정 불가라 빌드
  echo "build-gate: 이전 배포 커밋 없음(${base:-unset}) — HEAD^ 기준으로 판정"
  git rev-parse --verify -q HEAD^ >/dev/null || { echo "build: HEAD^ 없음(얕은 클론)"; exit 1; }
  if git rev-parse --verify -q HEAD^2 >/dev/null; then
    echo "build: 머지 커밋 + 기준 없음 — 판정 불가"; exit 1
  fi
  base="HEAD^"
fi

echo "build-gate: $site 비교 범위 ${base:0:7}..HEAD"
if ! git diff --quiet "$base" HEAD -- "$inc" "$exc"; then
  echo "build: $site 소스 변경 감지"; exit 1
fi
if ! git diff --quiet "$base" HEAD -- "$build_files"; then
  echo "build: 빌드 게이트 변경 감지"; exit 1
fi
if git diff --quiet "$base" HEAD -- "$inc"; then
  echo "skip: $site 관련 변경 없음"; exit 0
fi
case "$(date -u +%H)" in
  02|03|04) echo "build: $site 데이터 일일 창(UTC $(date -u +%H)시)"; exit 1 ;;
esac
echo "skip: $site 데이터 전용 변경, 일일 창(UTC 02-04) 밖 — 현재 UTC $(date -u +%H)시"
exit 0
