# Bangkok Google Maps Restaurant Scraper (NordVPN 전용)

방콕 반경 30km 의 Google Maps 식당을 500m 그리드로 발견하고, 30+ 리뷰 식당에 대해 상세 정보와 리뷰를 수집하는 파이프라인. NordVPN 서비스 인증(OpenVPN)으로 8개 SOCKS5 포트를 띄우고, 1 워커는 grid 스캔, 7 워커는 리뷰 수집을 병렬로 돈다. 각 SOCKS5 포트는 실패 시 자동으로 새 NordVPN 서버로 교체된다.

## 요구사항

- Python 3.10+
- Node.js 18+ (`node-openvpn-socks` 빌드/실행)
- macOS / Linux (Docker 불필요)
- NordVPN 구독 (service credentials 확보 필요)

## 빠른 시작

```bash
# 1) NordVPN 서비스 credentials 준비
#    https://my.nordaccount.com/dashboard/nordvpn/ → "Set up NordVPN manually"
#    2줄 파일로 저장:
cat > nordvpn/auth.txt <<EOF
YOUR_USERNAME_HERE
YOUR_PASSWORD_HERE
EOF
chmod 600 nordvpn/auth.txt

# 2) 1회성 환경 셋업 (venv + playwright + npm + 빌드)
bash scripts/setup.sh

# 3) 파이프라인 기동
bash scripts/run.sh

# 4) 진행 모니터
tail -f logs/grid.log     # 그리드 스캔
tail -f logs/review.log   # 리뷰 수집
cat /tmp/vpn_status.json  # 포트별 현재 exit IP

# 5) 중단 (언제든지 안전, resume 됨)
bash scripts/stop.sh
```

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  nordvpn_runner.py                                          │
│  ├─ NordVPN API → 9,000+ 서버 pool (랜덤 pick, IP dedup)    │
│  └─ 8 × node-openvpn-socks 프로세스 (각자 포트 2080-2087)   │
│     각 포트 = 독립 NordVPN 터널 + 로컬 SOCKS5               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴───────────────────────┐
        │                                             │
┌───────▼────────┐              ┌─────────────────────▼─────────┐
│ scraper_grid   │              │ scraper.py                    │
│ (port 2080,    │ discovered   │ (ports 2081-2087, 7 workers)  │
│  1 worker)     │─────────────▶│                               │
│                │  .csv        │ discovered_places.csv         │
│ 500m spiral    │  (30초 주기  │ 30초 주기로 재스캔하여        │
│ 11,499 points  │   재스캔)    │ review_count≥30 만 상세페이지│
│ 반경 30km      │              │ 진입 → 리뷰/메타 저장         │
└────────────────┘              └───────────────────────────────┘
        │                                             │
        └──────────────┬──────────────────────────────┘
                       ▼
              bangkok_reviews/output/
              ├── discovered_places.csv
              ├── restaurants.csv
              ├── restaurant_features.csv
              ├── restaurant_hours.csv
              └── reviews/
                  ├── <pid>_reviews.csv
                  └── <pid>_meta.csv
```

### VPN 교체(rotation) 트리거

- **즉시**: SOCKS 연결 죽음 감지 (`ERR_SOCKS_CONNECTION_FAILED`, `ERR_PROXY_*`, `ERR_CONNECTION_RESET` 등)
- **느린 작업**: 1건 처리가 120초 초과 시 다음 작업 전
- **주기**: 각 워커 15건 성공마다
- **구현**: 스크래퍼가 `/tmp/rotate_port_<idx>` 터치 → `nordvpn_runner` 가 감지 → 해당 포트 노드만 새 NordVPN 서버로 교체

### 중단 후 재개 (resume)

- `scripts/stop.sh` 또는 Ctrl+C 로 graceful 종료
- `scripts/run.sh` 다시 실행하면 이어서 진행
- Grid: `output/discovered_places.checkpoint` (처리된 좌표 기록)
- Review: `output/reviews/<pid>_reviews.csv` 의 `sort_source` 컬럼으로
  - `relevant`+`newest` 다 있으면 complete → 스킵
  - 하나만 있으면 partial → 재시도
  - 없으면 재시도 (리뷰수 30+ 확인 후)

## 설정 (`bangkok_reviews/config.py`)

| 항목 | 기본 | 설명 |
|---|---|---|
| `SEARCH_QUERIES` | `["restaurant in Sukhumvit Bangkok"]` | 현재는 grid 기반이라 의미 없음 |
| `MIN_REVIEW_COUNT` | 30 | 이 미만의 식당은 상세/리뷰 수집 안 함 |
| `REVIEWS_PER_RATING` | 10 | 1~5점 각각 최대 N건 (relevant + newest 모두) |
| `HEADLESS` | `False` | 디버깅 시 브라우저 가시 — 프로덕션은 `True` 권장 |
| `SLOW_MO` | 300 ms | 너무 빠르면 차단 위험 |
| `LANGUAGE` | `en` | Google Maps UI 영어 고정 |
| `GRID_CENTER_LAT/LNG` | Siam Paragon | 기준 좌표 |
| `GRID_ZONES` | `[(30000, 500)]` | 30km 반경 500m 균일 |
| `GRID_N_WORKERS` | 1 | grid 전용 워커 수 |
| `N_WORKERS` | 7 | review 워커 수 |
| `PROXY_PORT_BASE` | 2081 | review 워커 시작 포트 |
| `GRID_PROXY_PORT` | 2080 | grid 전용 포트 |
| `VPN_PORT_BASE` | 2080 | `nordvpn_runner` 의 idx=0 포트 |

## 출력 스키마

자세한 CSV 컬럼 설명은 [`SPEC.md`](SPEC.md) 참조.

## 트러블슈팅

| 증상 | 원인/해결 |
|---|---|
| `nordvpn_runner` 에서 `AUTH_FAILED` 반복 | service credentials 오류. NordVPN 대시보드에서 재확인 |
| 8개 중 한 두 개 포트가 계속 실패 | NordVPN 동시접속 한도 (플랜마다 6~10). 필요 시 `run.sh` 의 `--ports` 조정 |
| Grid 결과가 계속 0건 | exit IP 가 Google 에 차단됨. 자동 rotate 됨. 몇 분 기다려보기 |
| 동의 다이얼로그로 빈 결과 | 쿠키 + `dismiss_consent` 로 자동 처리. 지속되면 `scraper.py` 의 `dismiss_popups` 확장 |
| 디스크 계속 증가 | `output/reviews/` 의 각 식당당 ~60KB. 30k 식당이면 ~2GB. 정상 |

## 라이선스 / 주의

- Google Maps 이용약관을 준수하세요. 이 도구는 연구/개인 용도로 제공됩니다.
- NordVPN 약관: 자동화 사용 관련 정책 확인.
- 개인정보 포함된 리뷰 데이터 처리 시 해당 지역 법규(GDPR 등) 준수.
