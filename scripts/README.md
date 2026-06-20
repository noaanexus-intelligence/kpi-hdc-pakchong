# scripts/ — snapshot ข้อมูล HDC สำหรับใช้งานออนไลน์

## ทำไมต้องมี

HDC API (`api-hdc.moph.go.th`, `api-center-hdc.moph.go.th`) **เข้าถึงได้เฉพาะจากในประเทศไทย**
- จากเครื่องในไทย → `200 OK`
- จาก Vercel (สิงคโปร์/สหรัฐฯ) → proxy ตอบ `502 {"ok":false,"error":"internal error"}` (fetch ไป upstream ไม่ได้เลย)

เพราะ proxy (`api/hdc-proxy.ts`) รันบน Vercel เอง การแก้โค้ด proxy จึงไม่ช่วย — request ยังออกจาก IP ต่างประเทศ

**วิธีแก้:** ดึงข้อมูลล่วงหน้าจากเครื่อง IP ไทยเก็บเป็น snapshot ใน `data/snapshot/`
แล้วหน้าเว็บ (`script.js` → `hdcGet`) จะ **fallback** มาอ่าน snapshot เมื่อเรียก proxy ไม่ได้
→ เปิดออนไลน์บน Vercel ก็เห็นข้อมูลครบ (เปิดจากเครื่องไทยผ่าน `server.py` ยังได้ข้อมูลสดเหมือนเดิม)

## ไฟล์

- `snapshot.mjs` — ดึงทุก endpoint ที่หน้าเว็บใช้ในโหมด standard (lookup + 17 Service Plan + provider data ทุกรายงาน)
  เก็บเป็น `data/snapshot/snap_*.json` + `manifest.json` (map `"<kind> <path>" → ไฟล์`)
  - รันเอง: `node scripts/snapshot.mjs`  (ต้องอยู่ในไทย)
  - retry 5xx อัตโนมัติ 4 ครั้ง
- `refresh-and-push.ps1` — รัน snapshot แล้ว `git commit` + `git push` (สำหรับ Task Scheduler)

> หมายเหตุ: บางรายงาน HDC ต้นทาง **พังเอง** (ตอบ 502/500 แม้ดึงจากไทย) รายงานพวกนั้นจะไม่มีใน snapshot
> = ข้อมูลครบ "เท่าที่ต้นทางมีจริง" ซึ่งเท่ากับที่เปิดสดในเครื่องไทยจะได้

## ตั้ง Task Scheduler ให้รันทุกวัน (รันครั้งเดียวใน PowerShell)

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$HOME\OneDrive\เอกสาร\KPI_HDC_PC\scripts\refresh-and-push.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 7:00am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun
Register-ScheduledTask -TaskName "KPI-HDC-Snapshot" -Action $action -Trigger $trigger `
  -Settings $settings -Description "รีเฟรช HDC snapshot ปากช่อง แล้ว push ขึ้น GitHub"
```

- รันทดสอบทันที: `Start-ScheduledTask -TaskName "KPI-HDC-Snapshot"`
- ดู log: `Get-Content "$HOME\OneDrive\เอกสาร\KPI_HDC_PC\scripts\refresh.log" -Tail 30`
- ลบ: `Unregister-ScheduledTask -TaskName "KPI-HDC-Snapshot" -Confirm:$false`

> เครื่องต้องเปิดตอนถึงเวลา และ git ต้อง push ได้โดยไม่ถามรหัส (credential manager จำไว้แล้ว)
