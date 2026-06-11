# Bangkok Clinics & Dental Network — Repo Guide

이 레포는 **스크래퍼 + 웹사이트 모노레포**입니다.
운영 사이트: bangkokbotoxclinic.com · thaidentalclinic.com · thaifacialclinic.com

---

## ⚠️ 헷갈리기 쉬운 것들

- **petbkk (thailandpethub.com)** 는 이 레포와 **완전히 별개 프로젝트** — Vercel 팀도 다름 (`umma-5829s-projects`). 이 레포에서 절대 건드리지 말 것.
- Vercel 배포 프로젝트 2개가 같은 `web/` 폴더 공유:
  - `dental` → thaidentalclinic.com (project.json: `web/.vercel/project.json`)
  - `bangkokbotoxclinic` → bangkokbotoxclinic.com (root `.vercel/project.json`)
  - 둘 다 team: `chillanel22-6095s-projects`

---

## 📁 폴더 구조

### 웹 프론트엔드
| 폴더 | 사이트 | 비고 |
|------|--------|------|
| `web/` | bangkokbotoxclinic.com + thaidentalclinic.com | Next.js, Vercel 배포 |
| `thaifacialclinic-portable/` | thaifacialclinic.com | 정적 사이트 |
| `cosmetics/web/` | bangkokfillers.com | Next.js, 별도 Vercel |

### 스크래퍼 (활성)
| 폴더 | 역할 |
|------|------|
| `bangkok_clinics/` | 🔥 핵심 — 클리닉 grid + review 스크래퍼 |
| `bangkok_reviews/` | 방콕 리뷰 스크래퍼 |
| `cosmetics/` | 코스메틱 리뷰 스크래퍼 (Watsons, Pantip) |
| `petfood/` | 펫푸드 스크래퍼 |
| `petvet/` | 펫 병원 스크래퍼 |
| `pantip/` | Pantip 포럼 스크래퍼 |
| `hdmall_clinics/` | HDmall 클리닉 가격 스크래퍼 |
| `clinic-enrichment/` | 클리닉 보강 (DNS, email, Instagram) |
| `dbd-scraper/` | 사업자등록 데이터 |
| `korean-data/` | 한국 마켓 데이터 |

### 도시별 스크래퍼 폴더 (watchdog이 관리)
`ayutthaya/ chiang_mai/ chiang_rai/ hat_yai/ hua_hin/ khon_kaen/ koh_samui/ korat/ krabi/ pattaya/ phuket/ udon_thani/`
→ 각 폴더 안에 `scraper.py` / `scraper_grid.py` 포함

### 데이터 / 출력
| 폴더 | 내용 |
|------|------|
| `data/` | master_db.json, hospitals.json, pantip 스레드 |
| `dental_output/` | 덴탈 스크래핑 결과 (build_canonical 참조) |
| `dental_export/` | 덴탈 export 데이터 |
| `dental_pattaya/` `dental_chiangmai/` | 도시별 덴탈 데이터 |
| `hair_bangkok/` `hair_output/` `hair_phuket/` | 헤어 스크래핑 결과 |
| `merge_handoff/` | ⚠️ build_master_db.py 가 직접 참조 — 절대 이동 금지 |

### 인프라
| 폴더/파일 | 역할 |
|-----------|------|
| `scripts/watchdog.py` | 모든 스크래퍼 프로세스 관리 (PID 확인, 재시작) |
| `run/` | 프로세스 플래그 (`.pid`, `.disabled`, `.state`) |
| `engine/` | build_canonical.py — master_db 빌드 엔진 |
| `shared/` | 공용 유틸리티 |
| `nordvpn_runner.py` | VPN 프록시 관리 (watchdog이 ROOT에서 직접 실행) |
| `nordvpn/` `node-openvpn-socks/` | VPN 관련 |
| `logs/` | 스크래퍼 로그 |

### 기타
| 폴더 | 내용 |
|------|------|
| `docs/` | 플랜, 스펙, 프로젝트 문서 |
| `_archive/` | poc 실험들, 미사용 프로젝트 |
| `data/outreach/` | 클리닉 outreach CSV 파일들 |

---

## 🚀 배포 방법

```bash
# bangkokbotoxclinic 배포 (루트에서)
vercel --prod --archive=tgz

# dental 배포 (web/.vercel/project.json 사용)
cd web && vercel --prod --archive=tgz   # ← 이렇게 하면 web/web 에러
# 올바른 방법: 루트에서 web/.vercel/project.json 으로 링크 교체 후 배포
```

## ⚙️ 스크래퍼 관리

```bash
# watchdog 시작
python scripts/watchdog.py

# 특정 스크래퍼 중단 (재시작 방지)
echo "" > run/<이름>.disabled

# 상태 확인
cat run/<이름>.pid
```

## 🔑 환경변수

`.env` 파일 또는 `web/.vercel/.env.production.local` 참조.
주요 변수: `GOOGLE_MAPS_API_KEY`, `ADMIN_PASSCODE`, `ADMIN_USERNAME`, `UPSTASH_REDIS_REST_URL`
