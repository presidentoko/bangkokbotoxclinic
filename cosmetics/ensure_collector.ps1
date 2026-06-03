# ensure_collector.ps1 — keep the cosmetics collector (and its dedicated tunnels)
# alive. Mirrors the clinic engine's watchdog pattern: a Scheduled Task runs this
# every few minutes; it relaunches anything that died. Idempotent (no double-spawn).
# Stop everything by creating cosmetics\state\STOP.
$ErrorActionPreference = 'SilentlyContinue'
$repo  = 'C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable'
$wt    = Join-Path $repo '.claude\worktrees\cosmetics-aeo'
$py    = 'C:\Users\yn\AppData\Local\Programs\Python\Python312\python.exe'
$state = Join-Path $wt 'cosmetics\state'
$logs  = Join-Path $repo 'logs'

if (Test-Path (Join-Path $state 'STOP')) { exit 0 }

function Running($pat) {
  return ((Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
           Where-Object { $_.CommandLine -like "*$pat*" } | Measure-Object).Count -gt 0)
}

# 1) Dedicated NordVPN tunnels 2090/2091 (run from MAIN repo — node-openvpn-socks build is there).
if (-not (Running 'base-port 2090')) {
  $env:PYTHONUTF8 = '1'; $env:PYTHONIOENCODING = 'utf-8'
  Start-Process -FilePath $py `
    -ArgumentList 'nordvpn_runner.py','--ports','2','--base-port','2090','--auth','nordvpn/auth.txt','--proto','tcp' `
    -WorkingDirectory $repo -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logs 'nordvpn_cosmetics.log') `
    -RedirectStandardError  (Join-Path $logs 'nordvpn_cosmetics.err')
  Start-Sleep -Seconds 2
}

# 2) The durable collector loop.
if (-not (Running 'run_forever')) {
  $env:PYTHONUTF8 = '1'; $env:PYTHONIOENCODING = 'utf-8'
  $env:COSMETICS_PORT_LIST = '2090,2091,2086,2087'
  Start-Process -FilePath $py -ArgumentList '-m','cosmetics.run_forever' `
    -WorkingDirectory $wt -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $state 'forever.stdout') `
    -RedirectStandardError  (Join-Path $state 'forever.stderr')
}
exit 0
