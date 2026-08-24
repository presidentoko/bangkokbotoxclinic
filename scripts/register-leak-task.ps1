# ResetLeakyOEMServices 작업을 올바르게 (재)등록한다.

# 관리자 PowerShell 에서 이 파일을 직접 실행한다.

#

# 왜 파일로 만드는가: 명령을 붙여넣으면 터미널이 77자 부근에서 줄을 자른다.

# 2026-08-23 첫 등록이 그렇게 깨져 -File 경로가 두 줄로 쪼개진 채 저장돼

# ("reset-leaky-se" + "rvices.ps1") 스크립트가 실행조차 되지 않았다.

$ErrorActionPreference = "Stop"

$script = Join-Path $PSScriptRoot "reset-leaky-services.ps1"

if (-not (Test-Path $script)) { throw "스크립트 없음: $script" }

$name = "ResetLeakyOEMServices"

$argStr = '-NoProfile -ExecutionPolicy Bypass -File "' + $script + '"'

# 4시 시작 + 6시간마다 반복(하루 동안) = 04/10/16/22시.
$trigger = New-ScheduledTaskTrigger -Daily -At 4am
$trigger.Repetition = (New-ScheduledTaskTrigger -Once -At 4am `
    -RepetitionInterval (New-TimeSpan -Hours 6) `
    -RepetitionDuration (New-TimeSpan -Hours 24)).Repetition

$params = @{

    TaskName    = $name

    Action      = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argStr

    # 2026-08-24: 하루 1회 → 6시간 간격 반복.
    # 08-24 04:00 실행이 통째로 누락됐고(원인 미상, 스케줄러 이력 로그가 꺼져
    # 있어 사후 확인 불가) 그 사이 핸들이 265만까지 쌓였다. 하루 1회면 한 번
    # 놓칠 때 24시간을 잃는다. 임계 미만이면 아무것도 안 하므로 자주 도는 비용은
    # 사실상 0이다.
    Trigger     = $trigger

    Principal   = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

    Settings    = New-ScheduledTaskSettingsSet -StartWhenAvailable

    Description = "Acer/MTK handle leak - restart leaking services daily"

}

if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) {

    Unregister-ScheduledTask -TaskName $name -Confirm:$false

    Write-Host "기존 작업 삭제"

}

Register-ScheduledTask @params | Out-Null

$t = Get-ScheduledTask -TaskName $name

$hasNewline = $t.Actions[0].Arguments.Contains([char]10)

Write-Host ""

Write-Host "등록 완료"

Write-Host ("  계정   : {0} / {1}" -f $t.Principal.UserId, $t.Principal.RunLevel)

Write-Host ("  트리거 : {0}" -f $t.Triggers[0].StartBoundary)

Write-Host ("  인자에 줄바꿈 있음: {0}   (False 여야 정상)" -f $hasNewline)

Write-Host ""

Write-Host ("지금 실행: schtasks /Run /TN " + $name)

