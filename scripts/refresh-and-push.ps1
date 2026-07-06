# รีเฟรช snapshot HDC จากเครื่อง IP ไทย แล้ว push ขึ้น GitHub ให้ Vercel auto-deploy
# ใช้กับ Windows Task Scheduler — ตั้งให้รันทุกวัน (ดูวิธีใน scripts/README.md)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

$log = Join-Path $repo "scripts\refresh.log"
function Log($m) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m" | Tee-Object -FilePath $log -Append }

try {
  Log "=== เริ่มรีเฟรช snapshot ==="

  node scripts/snapshot.mjs 2>&1 | Tee-Object -FilePath $log -Append
  if ($LASTEXITCODE -ne 0) { Log "snapshot ล้มเหลว (exit $LASTEXITCODE) — ยกเลิก ไม่ push"; exit 1 }

  Log "=== เริ่มตรวจ sync audit ==="
  node scripts/sync-audit.mjs 2>&1 | Tee-Object -FilePath $log -Append
  if ($LASTEXITCODE -ne 0) { Log "sync-audit ล้มเหลว (exit $LASTEXITCODE) — ยกเลิก ไม่ push"; exit 1 }

  $changed = git status --porcelain -- data/snapshot data/sync-audit.json
  if (-not $changed) { Log "snapshot ไม่เปลี่ยน — ไม่ต้อง commit"; exit 0 }

  git add data/snapshot data/sync-audit.json
  git commit -m "data: รีเฟรช HDC snapshot และ sync audit ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))" 2>&1 | Tee-Object -FilePath $log -Append
  git push origin HEAD 2>&1 | Tee-Object -FilePath $log -Append
  if ($LASTEXITCODE -ne 0) { Log "git push ล้มเหลว (exit $LASTEXITCODE)"; exit 1 }

  Log "=== สำเร็จ: push snapshot และ sync audit ใหม่ Vercel จะ deploy อัตโนมัติ ==="
}
catch {
  Log "ERROR: $($_.Exception.Message)"
  exit 1
}
