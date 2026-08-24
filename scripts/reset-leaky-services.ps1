<#
  Acer/MediaTek 기본 서비스 핸들 누수 자동 정리.

  왜 필요한가 (2026-08-21 규명, 08-23 재측정):
    mtkbtsvc / AcerSystemCentralService / AcerCentralService 가 핸들을 계속
    누수한다. 핸들은 커널 nonpaged pool 을 먹는데 이 셋의 WorkingSet 은 1~3MB
    라 작업관리자·프로세스 목록에서는 완전히 무해해 보인다.
      2026-08-21: 업타임 8.5일 → 총 핸들 1,186만, nonpaged pool 2.4GB,
                  여유 RAM 0.6GB → ram_manager 가 스크래퍼를 상시 pause.
      서비스 재시작 후: 총 핸들 19만, 여유 RAM 1.8GB 로 즉시 회복.
      2026-08-23: 24시간 만에 다시 273만 (하루 약 250만 증가) → 4~5일이면 재발.

  이 스크립트는 임계를 넘은 서비스만 재시작한다. 넘지 않으면 아무것도 안 한다.
  관리자 권한 필요(서비스 제어). Task Scheduler 에 SYSTEM 으로 등록해 쓴다.
#>
[CmdletBinding()]
param(
  # 프로세스 하나가 이 핸들 수를 넘으면 그 서비스만 재시작.
  # 정상값은 수천 단위다. 100만으로 시작했다가 30만으로 내렸다 —
  # 2026-08-23 첫 실행에서 mtkbtsvc(148만)만 정리되고 Acer 둘은
  # 62만/54만이라 건너뛰었는데, 이 둘은 합쳐 하루 110만씩 늘어서
  # 100만을 기다릴 이유가 없다. 30만이면 매일 확실히 정리된다.
  [int]$ThresholdHandles = 300000,
  # SYSTEM 계정으로 실행되므로 상대경로/현재디렉터리에 의존하면 안 된다.
  # Resolve-Path 로 실제 경로를 확정한다.
  [string]$LogPath = (Join-Path (Split-Path $PSScriptRoot -Parent) "logs\leaky-services.log")
)

$map = @{
  'mtkbtsvc'                 = 'MTKBTSVC'
  'AcerSystemCentralService' = 'ASMSvc'
  'AcerCentralService'       = 'AASSvc'
}

function Write-Log([string]$m) {
  $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m
  Write-Output $line
  try { Add-Content -Path $LogPath -Value $line -Encoding utf8 } catch {}
}

# 2026-08-24: 시작 즉시 한 줄 남긴다.
# 08-24 04:00 자동 실행이 로그를 하나도 남기지 않았는데, 그때 "돌았지만 임계
# 미만이라 조치 없음"인지 "아예 시작도 안 함"인지 구분할 수가 없었다
# (작업 스케줄러 Operational 로그가 꺼져 있어 이력 조회도 불가).
# 실측: 그 시점 핸들이 726K/933K/817K 로 셋 다 임계(300K)를 넘고 있었으므로
# 돌았다면 반드시 재시작 로그가 남았어야 한다 → 시작 자체를 못 한 것으로 판단.
Write-Log ("시작 (실행 계정: {0})" -f [Security.Principal.WindowsIdentity]::GetCurrent().Name)

$total = (Get-Process | Measure-Object Handles -Sum).Sum
$acted = $false

foreach ($procName in $map.Keys) {
  $p = Get-Process -Name $procName -ErrorAction SilentlyContinue
  if (-not $p) { continue }
  $h = ($p | Measure-Object Handles -Sum).Sum
  if ($h -lt $ThresholdHandles) { continue }
  $svc = $map[$procName]
  Write-Log "$procName 핸들 $('{0:N0}' -f $h) — 임계 $('{0:N0}' -f $ThresholdHandles) 초과, 서비스 '$svc' 재시작"
  try {
    Restart-Service -Name $svc -Force -ErrorAction Stop
    Start-Sleep -Seconds 3
    $after = (Get-Process -Name $procName -ErrorAction SilentlyContinue | Measure-Object Handles -Sum).Sum
    Write-Log "  → 완료. 핸들 $('{0:N0}' -f $h) → $('{0:N0}' -f $after)"
    $acted = $true
  } catch {
    Write-Log "  → 실패: $($_.Exception.Message)"
  }
}

if ($acted) {
  $newTotal = (Get-Process | Measure-Object Handles -Sum).Sum
  $free = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB
  Write-Log ("총 핸들 {0:N0} → {1:N0} · 여유 RAM {2:N1} GB" -f $total, $newTotal, $free)
} else {
  Write-Log ("임계 미만 — 조치 없음 (총 핸들 {0:N0})" -f $total)
}
