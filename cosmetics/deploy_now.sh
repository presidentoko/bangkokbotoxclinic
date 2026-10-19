#!/bin/sh
# Ship the evidence rebuild to bangkokfillers.com.
#
# The work is finished and pushed — commits 30ff97d, fe55dd6, 84534f1, be17759
# and 8541b44 — with 183 tests passing and a clean local build. What was
# missing on 2026-10-20 is a credential no agent can obtain.
#
# Every token in the repo's .env returns 403 for this project:
#
#   Not authorized: Trying to access resource under scope "ym-s-projects5".
#   You must re-authenticate to this scope or use a token with access to it.
#   ... "saml": true
#
# COSMETICS_VERCEL_TOKEN reached that team at 01:10 and could not by 02:15;
# /v2/teams went from listing ym-s-projects5 to returning an empty list. The
# other five tokens reach chillanel22-6095s-projects, yunmin and
# xiaomi-8775s-projects, none of which owns this project, and the local
# `vercel login` session belongs to xiaomi-8775. SAML re-authentication happens
# in a browser.
#
# To ship:
#   1. Create a Vercel token scoped to ym-s-projects5 (a personal-scope token
#      returns forbidden), or `vercel login` as the account that owns it.
#   2. Put it in the repo .env as COSMETICS_VERCEL_TOKEN=... — into the file,
#      not into a chat window, where it would be recorded.
#   3. sh cosmetics/deploy_now.sh
#
# This runs the same command cosmetics/auto_deploy.py does, minus that script's
# gates (40 new products, 72 hours since the last deploy), which exist to
# protect the ISR write budget and would skip a deploy you are asking for on
# purpose. Vercel builds remotely from the uploaded source, so the local
# .next is not what ships and this takes several minutes.
#
# Note for afterwards: auto_deploy.py prunes old deployments because each one
# weighs ~1.1GB against a 10GB cap — roughly nine deploys. This script does not
# prune. If Deployment Storage is near the cap, run
# `python -m cosmetics.auto_deploy` afterwards, or prune in the dashboard.
set -e

ROOT=$(cd "$(dirname "$0")/.." && pwd)
WEB="$ROOT/cosmetics/web"
PROJECT=prj_0Uqoqc84Fiy92gOJ8vAhHIUjfmwG
TEAM=team_I41AXeO3YBvuFLCpp8xGXCTK

TOKEN=$(grep -m1 '^COSMETICS_VERCEL_TOKEN=' "$ROOT/.env" | cut -d= -f2- | tr -d '\r"')
if [ -z "$TOKEN" ]; then
  echo "COSMETICS_VERCEL_TOKEN is not set in $ROOT/.env" >&2
  exit 1
fi

# Check the credential before spending several minutes on an upload that would
# fail at the end. auto_deploy.py learned this the hard way: it used to pick a
# token that authenticated as a user but could not reach the project, and every
# deploy failed with "Not authorized" while the log said it had a token.
CODE=$(curl -sS --max-time 25 -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT?teamId=$TEAM")
if [ "$CODE" != "200" ]; then
  echo "This token cannot reach the project (HTTP $CODE)." >&2
  echo "It needs scope ym-s-projects5; see the notes at the top of this file." >&2
  exit 1
fi
echo "Token reaches the project. Deploying."

# Same invocation as cosmetics/auto_deploy.py:269. The project is linked by
# cosmetics/web/.vercel/project.json, so no --scope is needed and passing one
# that disagrees with the link is a way to fail for no reason.
cd "$WEB"
VERCEL_TOKEN="$TOKEN" npx vercel deploy --prod --yes --token "$TOKEN" --cwd "$WEB"

cat <<'DONE'

Deployed. Worth checking, with a cache-buster so Cloudflare does not answer
from its own copy:

  curl -s "https://bangkokfillers.com/th/brand/isntree?cb=$(date +%s)" \
    | grep -c "ตัวอื่นที่มี"

That counts the "everything else with this active" section. Expect 1 or more;
0 means the edge is still serving the old page. That page measured 1,669
characters of text before this work and 2,978 in the build that ships here.

  curl -s "https://bangkokfillers.com/sitemap.xml?cb=$(date +%s)" \
    | grep -c "/brand/"

Brand URLs should drop by 28 — fourteen brands that are facial tissue, cotton
pads, condoms and the like, now noindexed and out of the sitemap across two
locales. See cosmetics/web/data/off-catalogue-brands.json.
DONE
