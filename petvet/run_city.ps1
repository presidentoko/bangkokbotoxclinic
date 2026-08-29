# Launches a petvet grid scan for one city, fully detached from the calling shell.
# Usage: powershell -File run_city.ps1 -City pattaya -Lat 12.9236 -Lng 100.8825 -RadiusM 15000 -PortBase 2080
param(
  [string]$City,
  [string]$Lat,
  [string]$Lng,
  [string]$RadiusM,
  [int]$PortBase,
  [int]$Workers = 2,
  # Default 500 matches scraper_grid.py's own default: stop after 500
  # consecutive zero-new-result cells, on the assumption that means the grid
  # is exhausted. That assumption broke on Phuket: the island's clinics sit in
  # separated pockets (Patong/Kamala/Surin on the west coast, Rawai/Chalong/
  # Kata/Karon in the south, Phuket Town/Chalong Bay inland) with long empty
  # stretches of hill, forest and sea between them, so a genuine 500-point dry
  # spell can occur mid-island with real clinics still unvisited further out.
  # Pass 0 to disable the early exit and force a full pass over every
  # remaining grid point.
  [int]$SaturationStreak = 500
)
$root = 'C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable'
$py   = 'C:\Users\yn\AppData\Local\Programs\Python\Python312\python.exe'
# SEARCH_QUERY is deliberately NOT set here. Passing the Thai string
# "โรงพยาบาลสัตว์" through PowerShell -> SetEnvironmentVariable -> a child
# process's environment block corrupted it into mojibake ("à¹‚à¸£à¸‡..."),
# which produced a Google Maps search for garbage text and silently zero real
# results for hours across three city runs. petvet/config.py's own default
# for SEARCH_QUERY is the same Thai string as a literal in a UTF-8-declared
# .py file, which Python decodes correctly on import — so leaving the env var
# unset sidesteps the whole corruption path instead of trying to fix the
# encoding hop-by-hop.
$env2 = @{
  CITY_OUTPUT_DIR = "petvet_output_$City"
  CITY_LAT        = $Lat
  CITY_LNG        = $Lng
  CITY_RADIUS_M   = $RadiusM
  GRID_N_WORKERS  = "$Workers"
  GRID_PROXY_PORT = "$PortBase"
  SATURATION_ZERO_STREAK = "$SaturationStreak"
}
foreach ($k in $env2.Keys) { [Environment]::SetEnvironmentVariable($k, $env2[$k], "Process") }
$p = Start-Process -FilePath $py -ArgumentList @('-u','-m','petvet.scraper_grid') `
     -WorkingDirectory $root `
     -RedirectStandardOutput "$root\petvet\${City}_grid.log" `
     -RedirectStandardError  "$root\petvet\${City}_grid.err" `
     -WindowStyle Hidden -PassThru
Write-Output "$City PID $($p.Id)"
