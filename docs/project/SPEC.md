# SPEC — Bangkok Google Maps Scraper

> 이 문서는 **AI/자동화 에이전트가 시스템을 이해하고 판단/수정할 수 있게** 작성된 구조적 스펙입니다. 사람 친화 개요는 `README.md` 참조.

## 1. Goal

- 방콕 반경 30 km 내 Google Maps 식당 **발견** (place_id 단위 dedup)
- `review_count ≥ 30` 식당만 **상세 + 리뷰** 수집
- 리뷰는 `Most relevant` + `Newest` 두 정렬 순회 → 중복 제거
- **resume-safe**: 중단 후 재실행해도 완료된 항목 스킵, partial/failed 재시도

## 2. Components (3 processes)

| 프로세스 | 파일 | 역할 | SOCKS 포트 |
|---|---|---|---|
| `nordvpn_runner` | `nordvpn_runner.py` | NordVPN API 기반 8 × OpenVPN 터널 + 로컬 SOCKS5 listener | 2080–2087 (bind) |
| `scraper_grid` | `bangkok_reviews/scraper_grid.py` | 좌표별 Google Maps 카드 스크랩 → `discovered_places.csv` | client of 2080 |
| `scraper` (review) | `bangkok_reviews/scraper.py` | 상세 페이지 + 리뷰 수집, `discovered_places.csv` producer 재스캔 | client of 2081–2087 |

의존 관계:
```
nordvpn_runner (출력: /tmp/vpn_status.json, 입력: /tmp/rotate_port_<idx>)
    ↑ (rotate 신호)
    ├── scraper_grid (포트 2080, worker idx=0)
    └── scraper     (포트 2081-2087, worker idx=1..7)
```

## 3. Data Flow

```
NordVPN API (v1/servers)
    │ ↓ fetch every 15 min
    │
nordvpn_runner.py
    │
    │  spawn 8× `node node-openvpn-socks/dist/cli.js` with per-port config
    │      flags: --port <P> --remote <IP>:<PORT> --proto tcp --auth-file nordvpn/auth.txt
    │  health-check via `curl --socks5 127.0.0.1:<P> http://httpbin.org/ip`
    │  on /tmp/rotate_port_<idx> touched → kill + respawn with new IP
    │
    ▼
  8 local SOCKS5 ports
    ├── 2080 ─ used by scraper_grid (1 worker)
    │          │ scans Google Maps /maps/search/restaurant/@lat,lng,17z
    │          │ → div.Nv2PK 카드 → extract_place_id, rating, review_count, price_symbol
    │          │ → discovered_places.csv (append via merge)
    │          │ checkpoint: discovered_places.checkpoint (coord set)
    │          │
    └── 2081-2087 ─ used by scraper.py (7 workers)
               │ producer thread: every 30s re-read discovered_places.csv
               │ filter: review_count < MIN_REVIEW_COUNT → skip (don't visit)
               │ enqueue new hrefs
               │ worker: page.goto detail → parse Restaurant + Features + Hours
               │       → "Most relevant" tab → collect up to N per star
               │       → "Newest" tab → union; dedup by review_id
               │       → merge into restaurants.csv + save reviews/<pid>_reviews.csv
```

## 4. Output Files (`bangkok_reviews/output/`)

### 4.1 `discovered_places.csv`

grid 가 발견한 모든 place 목록. review_count=0 은 grid 카드에서 리뷰수 미노출된 경우 (실제 0 일 수도, 데이터 부족일 수도).

| column | 예 | 비고 |
|---|---|---|
| `place_id` | `0x30e29ed2ca35c80f:0xa84258856b372950` | hex pair, unique |
| `name` | `Cheung Hing Kee เชิง เฮง เก ...` | aria-label 우선 |
| `href` | `https://www.google.com/maps/place/.../data=!4m7!3m6!1s...` | 상세 페이지 URL |
| `rating` | `4.7` | "" if unknown |
| `review_count` | `244` | 카드 `span.UY7F9` 또는 aria-label 파싱. **0 = 미확정** |
| `price_symbol` | `฿400–500` 또는 `""` | 카드에 노출된 경우만 |
| `primary_type` | `Italian restaurant` | 카테고리 |
| `address_hint` | `G Floor, Siam Paragon, ...` | 카드에 보이는 일부 |
| `status_hint` | `Open · Closes 10 PM` | 영업상태 문자열 |
| `raw_card_text` | (500자 컷) | 파싱 실패 대비 백업 |
| `first_seen_lat/lng` | 13.746289, 100.534689 | grid 포인트 좌표 |

### 4.2 `restaurants.csv`

review 수집기가 상세 페이지에서 확보한 메타. `place_id` 별 1행.

```
place_id, name, primary_type, formatted_address, plus_code,
latitude, longitude, phone, website, rating, total_reviews,
price_level, price_symbol, business_status, editorial_summary,
menu_url, maps_url
```

### 4.3 `restaurant_features.csv`

About 탭의 feature list (정규화 long format).

```
place_id, section, feature, present
```

`section` 예: `Service options`, `Offerings`, `Dining options`, `Amenities`, `Atmosphere`, `Crowd`, `Planning`, `Payments`, `Accessibility`, `Children`, `Pets`, `Parking`.

### 4.4 `restaurant_hours.csv`

요일별 영업시간 long format.

```
place_id, day, hours_text
```

`day`: `Monday` ~ `Sunday`. `hours_text`: `"11 AM to 11 PM"` 또는 `"Closed"`.

### 4.5 `reviews/<pid>_reviews.csv`

식당당 1파일. 같은 `review_id` 중복 제거.

```
review_id, place_id, rating, text,
author_name, author_id, author_uri, author_photo_uri,
author_is_local_guide, author_review_count, author_photo_count,
relative_date, spent_amount, sort_source
```

- `author_id`: Google contributor UUID (author_uri 에서 추출) — 동일 유저 식별 가능
- `sort_source`: `"relevant"` or `"newest"` — resume 판정 키 (둘 다 있으면 complete)
- `spent_amount`: 리뷰 구조화 메타 "Price per person" 있을 때만

### 4.6 `reviews/<pid>_meta.csv`

리뷰 구조화 메타 (Google Maps 가 유저 리뷰에서 자동 추출한 필드).

```
review_id, place_id, food_score, service_score, atmosphere_score,
meal_type, price_per_person, group_size, wait_time, recommended_dishes
```

## 5. Resume Logic

### 5.1 Grid

- `discovered_places.checkpoint`: 텍스트 파일, 줄 = `"lat,lng"` (소수점 5자리, ≈ 1 m)
- 런치 시 로드 → `done_coords` set
- 큐 생성 시 `done_coords` 에 있는 좌표는 건너뜀
- 30포인트 처리마다 체크포인트 저장

### 5.2 Review

`existing_ids` = 이미 완료된 place_id. 판정 함수 `_review_status(pid)`:

```
if not reviews/<pid>_reviews.csv: return "none"
sources = { row.sort_source for row in csv }
if "relevant" in sources and "newest" in sources: return "complete"
if sources: return "partial"
return "none"
```

- `complete` → 스킵
- `partial` → 재시도 (이미 있는 source 는 덮어쓰고 병합)
- `none` + `review_count ≥ 30` → 완전 실패 재시도
- `none` + `review_count < 30` → 정상 (적은 리뷰는 파일 생성 안 함)

## 6. VPN Rotation Protocol

### 6.1 Runner status file `/tmp/vpn_status.json`

```json
{
  "ports": [
    { "idx": 0, "port": 2080, "alive": true,
      "server": "jp522.nordvpn.com (89.187.175.54:443)",
      "exit_ip": "86.48.13.32" },
    ...
  ]
}
```

### 6.2 Rotate 신호

스크래퍼가 `/tmp/rotate_port_<idx>` 파일 생성(touch) → `nordvpn_runner` 가 2초 주기 폴링 시 감지 → 해당 idx 포트만 kill + NordVPN 풀에서 새 서버 선택 → respawn → status.json 갱신.

스크래퍼의 rotate 대기 로직 (`_rotate_vpn_and_wait`):
1. rotate 전 server 값 기억
2. marker 파일 touch
3. status.json 폴링 — `server != 이전` AND `alive == true` 확인
4. 최대 45초 대기

### 6.3 Rotate 트리거

| 조건 | 구현 위치 | 예 |
|---|---|---|
| SOCKS 죽음 감지 | `is_socks_dead_error()` | `ERR_SOCKS_CONNECTION_FAILED`, `ERR_PROXY_*`, `ERR_TUNNEL_*`, `ERR_EMPTY_RESPONSE`, `ERR_CONNECTION_CLOSED/RESET/REFUSED/TIMED_OUT` |
| 작업 실패 후 | worker `except` | 예외 발생 → rotate + 재큐잉 |
| 느린 작업 | `SLOW_THRESHOLD_SEC=120` | 1건 처리 > 120s → 다음 작업 전 pending_rotate |
| 주기 | `ROTATE_EVERY_TASKS=15` | 15 성공마다 강제 rotate |
| Grid 연속 0건 | `_grid_worker` | 2포인트 연속 0건 → rotate |

## 7. Pre-filter by review_count

**중요**: `scraper.py` 의 producer 는 `discovered_places.csv` 에서 읽을 때 **`review_count < MIN_REVIEW_COUNT` 인 행을 큐에 넣지 않음**. `review_count = 0` (미확정) 인 행은 통과 (grid 가 카드에서 못 뽑은 경우, 상세에서 확인).

→ 그리드가 재스캔되면서 리뷰수 정보가 채워지는 대로 파이프라인이 자연스럽게 필터링 강화됨.

## 8. Extension Points

### 8.1 다른 도시

`config.py` 의 `GRID_CENTER_LAT/LNG`, `GRID_ZONES` 만 변경. spiral 함수는 좌표 무관.

### 8.2 리뷰 별점 분포 가중치

`config.py`:
- `MIN_REVIEW_COUNT` — 필터링 기준
- `REVIEWS_PER_RATING` — 별점당 최대 건수 (1~5점 각 10건 = 최대 50건)

### 8.3 VPN 교체 정책

`scraper.py` 상단 상수:
```python
MAX_TASK_RETRIES = 2
SLOW_THRESHOLD_SEC = 120
ROTATE_TIMEOUT_SEC = 45
ROTATE_EVERY_TASKS = 15
```

## 9. Known Limitations

- Google Maps UI 변경 시 selector 깨질 수 있음 (`div.Nv2PK`, `span.UY7F9`, `div.F7nice` 등)
- `node-openvpn-socks` 는 AES-256-CBC/SHA512 + auth-user-pass + TCP/UDP 지원. 다른 cipher 요구 서버는 실패할 수 있음 (NordVPN 대부분 OK).
- NordVPN 동시접속 한도 초과 시 일부 포트가 AUTH_FAILED 루프. 플랜 확인 후 `run.sh` 의 `--ports` 조정.
- 카드에서 리뷰수를 못 뽑는 경우가 있음 (식당에 리뷰가 적거나 Google UI 가 해당 zoom 에서 안 내려줌). 이 경우 `review_count=0` 으로 저장되고, 상세 페이지에서 실제 수치 확인.
- Playwright Chromium 메모리 — 워커 8개 병렬이면 ~2 GB RAM 권장.

## 10. File Map

```
deliverable/
├── README.md                     # 사람 가이드
├── SPEC.md                       # 이 문서
├── requirements.txt              # Python deps
├── nordvpn_runner.py             # VPN orchestrator
├── nordvpn/
│   ├── auth.txt                  # (사용자가 작성) NordVPN service creds, 2 lines
│   ├── auth.txt.example
│   └── template.ovpn             # NordVPN 템플릿 (remote 오버라이드됨)
├── node-openvpn-socks/           # Pure Node.js OpenVPN SOCKS5 client
│   ├── package.json
│   ├── src/                      # TS source
│   └── dist/                     # built JS (npm run build)
├── bangkok_reviews/
│   ├── config.py
│   ├── scraper_grid.py           # grid discovery (1 worker)
│   ├── scraper.py                # review collector (7 workers)
│   ├── requirements.txt
│   └── output/                   # created at first run
│       ├── discovered_places.csv
│       ├── discovered_places.checkpoint
│       ├── restaurants.csv
│       ├── restaurant_features.csv
│       ├── restaurant_hours.csv
│       └── reviews/
│           ├── <pid>_reviews.csv
│           └── <pid>_meta.csv
└── scripts/
    ├── setup.sh                  # 1회성 환경 구성
    ├── run.sh                    # 전체 기동
    └── stop.sh                   # graceful 종료
```

## 11. Invariants (for safe modification)

- `VPN_PORT_BASE` 는 `nordvpn_runner --base-port` 와 **반드시** 일치해야 함 (rotate marker idx 계산 기준)
- `config.PROXY_PORT_BASE` 는 `VPN_PORT_BASE + GRID_N_WORKERS` 와 일치 (grid 가 먼저 차지하는 포트 이후)
- `config.N_WORKERS + GRID_N_WORKERS` ≤ `nordvpn_runner --ports` (총 포트 수 초과 금지)
- `discovered_places.csv` 의 `href` 는 수정하지 말 것 (place_id 추출 파싱 기반)
