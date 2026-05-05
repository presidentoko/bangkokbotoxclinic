#!/bin/bash
# 일회성 환경 구성. 실행 전 1번만.
# - Python venv 생성 + playwright 설치 + 브라우저 다운로드
# - node-openvpn-socks 빌드 (npm install + tsc)
# - NordVPN OpenVPN 템플릿 준비 (이미 포함돼 있지만 최신화 원하면 재다운로드)
# - nordvpn/auth.txt 확인 (없으면 에러)
#
# 사전 요구사항:
#   - Python 3.10+
#   - Node.js 18+ (node-openvpn-socks 빌드/실행용)
#   - curl
#
# Usage:
#   bash scripts/setup.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[setup] 루트: $ROOT"

# ── 1. auth 체크
if [ ! -f nordvpn/auth.txt ]; then
    echo ""
    echo "❌ nordvpn/auth.txt 가 없습니다."
    echo "   NordVPN 대시보드 → Services → NordVPN → 'Set up NordVPN manually'"
    echo "   에서 service credentials (username/password) 확인 후 아래 형식으로 저장:"
    echo ""
    echo "     <username>"
    echo "     <password>"
    echo ""
    echo "   예시 파일: nordvpn/auth.txt.example 참고"
    exit 1
fi
chmod 600 nordvpn/auth.txt
echo "[setup] nordvpn/auth.txt OK (2 줄 확인됨)"

# ── 2. Python 가상환경
if [ ! -d .venv ]; then
    python3 -m venv .venv
    echo "[setup] .venv 생성"
fi
source .venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "[setup] Python 의존성 설치 완료"

# playwright 브라우저 다운로드 (chromium 만)
python3 -m playwright install chromium
echo "[setup] Playwright Chromium 설치 완료"

# ── 3. node-openvpn-socks 빌드
cd node-openvpn-socks
if [ ! -d node_modules ]; then
    npm install --silent
    echo "[setup] npm install 완료"
fi
if [ ! -f dist/cli.js ] || [ src/cli.ts -nt dist/cli.js ]; then
    npm run build
    echo "[setup] node-openvpn-socks 빌드 완료"
fi
cd "$ROOT"

# ── 4. NordVPN 템플릿 확인 (없으면 다운로드)
if [ ! -f nordvpn/template.ovpn ]; then
    curl -sfL -o nordvpn/template.ovpn \
        https://downloads.nordcdn.com/configs/files/ovpn_legacy/servers/jp522.nordvpn.com.tcp443.ovpn
    echo "[setup] nordvpn/template.ovpn 다운로드"
fi

# ── 5. 출력 디렉토리
mkdir -p bangkok_reviews/output/reviews

echo ""
echo "✅ setup 완료"
echo "   다음: bash scripts/run.sh"
