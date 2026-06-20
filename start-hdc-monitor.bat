@echo off
setlocal

cd /d "%~dp0"

:: ตั้งค่า ANTHROPIC_API_KEY ที่นี่ (หรือตั้งใน System Environment Variables)
:: ถ้าไม่ต้องการใช้ Claude AI ให้ปล่อยว่างไว้ iQ จะใช้โหมด keyword แทน
if not defined ANTHROPIC_API_KEY (
  set /p ANTHROPIC_API_KEY="ANTHROPIC_API_KEY (กด Enter ถ้าไม่มี): "
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = 4173; $root = (Resolve-Path '.').Path;" ^
  "$listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique;" ^
  "foreach ($pidValue in $listeners) { Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue };" ^
  "$python = (Get-Command python -ErrorAction SilentlyContinue);" ^
  "if ($python) { Start-Process -FilePath $python.Source -ArgumentList 'server.py' -WorkingDirectory $root -WindowStyle Minimized }" ^
  "else { $py = (Get-Command py -ErrorAction SilentlyContinue); if ($py) { Start-Process -FilePath $py.Source -ArgumentList 'server.py' -WorkingDirectory $root -WindowStyle Minimized } else { Write-Host 'Python not found'; pause; exit 1 } };" ^
  "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:4173/'"
