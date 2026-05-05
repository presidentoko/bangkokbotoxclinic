@echo off
REM Idempotent watchdog launcher.
REM watchdog.py writes its own PID to run/watchdog.pid on startup.
REM This bat checks if it's alive; if not, relaunches.

setlocal EnableDelayedExpansion
set ROOT=C:\Users\yn\Desktop\deliverable\deliverable
set VENVPY=%ROOT%\.venv\Scripts\python.exe
set PIDFILE=%ROOT%\run\watchdog.pid
set LOGFILE=%ROOT%\logs\watchdog.log

if exist "%PIDFILE%" (
    set /p PID=<"%PIDFILE%"
    tasklist /FI "PID eq !PID!" 2>nul | find "!PID!" >nul
    if not errorlevel 1 (
        exit /b 0
    )
)

if not exist "%VENVPY%" (
    echo [%DATE% %TIME%] venv python not found at %VENVPY% >> "%LOGFILE%"
    exit /b 1
)

cd /d "%ROOT%"
set PYTHONIOENCODING=utf-8
echo [%DATE% %TIME%] ensure_watchdog: relaunching watchdog >> "%LOGFILE%"
start "" /B "%VENVPY%" scripts\watchdog.py >> "%LOGFILE%" 2>&1
exit /b 0
