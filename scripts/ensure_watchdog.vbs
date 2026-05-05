' Hidden launcher for ensure_watchdog.bat — suppresses console flash
' on every scheduled task run / startup.
Set sh = CreateObject("Wscript.Shell")
sh.Run "cmd /c """"C:\Users\yn\Desktop\deliverable\deliverable\scripts\ensure_watchdog.bat""""", 0, False
