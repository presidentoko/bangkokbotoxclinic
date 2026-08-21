#!/usr/bin/env bash
# 텔레그램 봇 토큰 일괄 교체.
#
# 왜 필요했나: 하나의 봇 토큰을 9개 프로젝트가 공유하고 있었고, 그 토큰이
# functions/api/inquiry.ts (web-factory) 와 app/api/{contact,subscribe}/route.ts
# (web-petbkk) 에 `env || '리터럴'` 폴백으로 하드코딩된 채 public GitHub 레포에
# 푸시돼 탈취됐다. 2026-08-21 확인 시점에 공격자가 봇 이름을 "BEST CASINO MINI-APP",
# description 을 크립토 광고로 바꿔놓은 상태였다.
# 하드코딩은 전부 제거했고, 이제 값은 플랫폼 환경변수에만 존재한다.
#
# 사용법:
#   1) @BotFather → /mybots → Koreaplastic_bot → API Token → Revoke current token
#   2) bash scripts/rotate_telegram_token.sh '<새토큰>'
#
# 재발급하는 순간 모든 사이트의 문의 폼이 멈추므로 1) 직후 바로 2) 를 돌릴 것.
set -euo pipefail

TOKEN="${1:-}"
CHAT_ID="${2:-8488265054}"
if [[ -z "$TOKEN" ]]; then
  echo "usage: $0 '<new-bot-token>' [chat-id]" >&2
  exit 1
fi
if [[ ! "$TOKEN" =~ ^[0-9]{8,}:[A-Za-z0-9_-]{30,}$ ]]; then
  echo "토큰 형식이 이상합니다: ${TOKEN:0:12}…" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VERCEL="/c/Users/yn/AppData/Roaming/npm/vercel"

echo "── 0. 새 토큰 유효성 확인"
BOT=$(curl -s "https://api.telegram.org/bot${TOKEN}/getMe" | python -c 'import sys,json;d=json.load(sys.stdin);print(d["result"]["username"] if d.get("ok") else "INVALID")')
if [[ "$BOT" == "INVALID" ]]; then echo "  ✗ 토큰이 유효하지 않습니다"; exit 1; fi
echo "  ✓ @$BOT"

echo "── 1. 로컬 .env.local 갱신"
for f in "$ROOT"/chillanel/.env.local \
         "$ROOT"/"helath check"/web/.env.local \
         "$ROOT"/web-factory/.env.local \
         "$ROOT"/web-golf/.env.local; do
  [[ -f "$f" ]] || continue
  python - "$f" "$TOKEN" "$CHAT_ID" <<'PY'
import re, sys
path, tok, chat = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(path, encoding='utf-8').read()
s = re.sub(r'(?m)^TELEGRAM_BOT_TOKEN=.*$', 'TELEGRAM_BOT_TOKEN=' + tok, s)
s = re.sub(r'(?m)^TELEGRAM_CHAT_ID=.*$',  'TELEGRAM_CHAT_ID='  + chat, s)
open(path, 'w', encoding='utf-8', newline='\n').write(s)
print('  ✓', path)
PY
done

echo "── 2. Cloudflare Pages (thaisupplyhub)"
cd "$ROOT/web-factory"
printf '%s' "$TOKEN" | npx --yes wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name=thaisupplyhub
printf '%s' "$CHAT_ID" | npx --yes wrangler pages secret put TELEGRAM_CHAT_ID --project-name=thaisupplyhub

echo "── 3. Vercel 프로젝트"
# 각 디렉토리의 .vercel/project.json 이 프로젝트·팀을 결정한다.
for d in web-petbkk web-thaigle "helath check/web" 3rd 2nd web-restaurants chillanel web-golf; do
  [[ -f "$ROOT/$d/.vercel/project.json" ]] || { echo "  – $d (vercel link 없음, 건너뜀)"; continue; }
  echo "  → $d"
  cd "$ROOT/$d"
  for env in production preview development; do
    "$VERCEL" env rm TELEGRAM_BOT_TOKEN "$env" --yes >/dev/null 2>&1 || true
    "$VERCEL" env rm TELEGRAM_CHAT_ID   "$env" --yes >/dev/null 2>&1 || true
    printf '%s' "$TOKEN"   | "$VERCEL" env add TELEGRAM_BOT_TOKEN "$env" >/dev/null 2>&1 || true
    printf '%s' "$CHAT_ID" | "$VERCEL" env add TELEGRAM_CHAT_ID   "$env" >/dev/null 2>&1 || true
  done
  echo "    ✓ env 갱신 (재배포해야 반영됨: vercel --prod)"
done

echo
echo "완료. 남은 일:"
echo "  - Vercel 프로젝트는 재배포해야 새 env 가 붙는다 (각 디렉토리에서 vercel --prod)"
echo "  - Cloudflare Pages 는 재배포 없이 즉시 반영된다"
echo "  - @BotFather 에서 봇 이름/description/commands 원복 (공격자가 변조해 둠)"
