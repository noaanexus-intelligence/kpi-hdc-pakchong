# scripts/ — snapshot ข้อมูล HDC สำหรับใช้งานออนไลน์

## ทำไมต้องมี

HDC API (`api-hdc.moph.go.th`, `api-center-hdc.moph.go.th`) **เข้าถึงได้เฉพาะจากในประเทศไทย**
- จากเครื่องในไทย → `200 OK`
- จาก Vercel (สิงคโปร์/สหรัฐฯ) → proxy ตอบ `502 {"ok":false,"error":"internal error"}` (fetch ไป upstream ไม่ได้เลย)

เพราะ proxy (`api/hdc-proxy.ts`) รันบน Vercel เอง การแก้โค้ด proxy จึงไม่ช่วย — request ยังออกจาก IP ต่างประเทศ

**วิธีแก้:** ดึงข้อมูลล่วงหน้าจากเครื่อง IP ไทยเก็บเป็น snapshot ใน `data/snapshot/`
แล้วหน้าเว็บ (`script.js` → `hdcGet`) จะ **fallback** มาอ่าน snapshot เมื่อเรียก proxy ไม่ได้
→ เปิดออนไลน์บน Vercel ก็เห็นข้อมูลครบ (เปิดจากเครื่องไทยผ่าน `server.py` ยังได้ข้อมูลสดเหมือนเดิม)

## แนวทาง Hybrid: snapshot vs live

| ส่วน | แหล่งข้อมูล | เหตุผล |
|---|---|---|
| Dashboard, Insight (Gap/Ranking), HDC Intelligence Brief, Trend 5 ปี | **snapshot เป็นหลัก** | โหลดเร็ว/เสถียร ไม่ต้องรอ (หรือพึ่ง) HDC API ทุกครั้งที่เปิดหน้า — แม้ HDC ต้นทางช้า/ล่ม หน้าเว็บก็เปิดได้เสมอ |
| ตารางรายงานรายหน่วย ตอนผู้ใช้กดดู (ปุ่ม "โหลดข้อมูลรายหน่วย" / เปลี่ยนรายงาน) | **ดึงสดจาก HDC ก่อนเสมอ** (`fetchProviderRows(..., { preferLive: true })`) | ผู้ใช้กดดูเอง = ต้องการเห็นข้อมูลล่าสุดจริง ไม่ต้องรอ snapshot รอบถัดไป |

ถ้าดึงสดไม่ได้ (เช่น เปิดบน Vercel ที่เข้า HDC ไม่ได้เลยตามที่อธิบายด้านบน) จะ fallback มาอ่าน snapshot ล่าสุดแทนทันที
พร้อมขึ้นข้อความ "ไม่สามารถดึงข้อมูลสดจาก HDC ได้ในขณะนี้ แสดงข้อมูลจาก snapshot ล่าสุดแทน" — dashboard จึงไม่มีวันล่ม
แม้ HDC ต้นทางช้า/ล่ม เพราะอย่างน้อยก็เปิดได้จาก snapshot เสมอ

หน้าเว็บแสดงเวลาทั้งสองแหล่งให้เห็นตลอด:
- **"อัปเดต snapshot ล่าสุด: ..."** — จาก `data/snapshot/manifest.json` (`generatedAt`) ที่ `briefStatusBadge` และ `#tableDataStatus`
- **"ดึงข้อมูลสดล่าสุด: ..."** — เวลาที่ดึงสดจาก HDC สำเร็จจริงล่าสุดในเซสชันนี้ (ที่ `#tableDataStatus`)

(การประมวลผลแบบ batch อย่าง "ประมวลผลทั้งหมด" / "ตรวจครบทุก Service Plan" ที่ไล่ดึงหลายร้อยรายงาน
ยังใช้ `hdcGet` เดิม snapshot-first เมื่อออนไลน์ — ไม่อยากให้รอ live timeout ทุกรายงานตอนสแกนจำนวนมาก)

## ไฟล์

- `snapshot.mjs` — ดึงทุก endpoint ที่หน้าเว็บใช้ในโหมด standard (lookup + 17 Service Plan + provider data ทุกรายงาน)
  เก็บเป็น `data/snapshot/snap_*.json` + `manifest.json` (map `"<kind> <path>" → ไฟล์`)
  - รันเอง: `node scripts/snapshot.mjs`  (ต้องอยู่ในไทย)
  - retry 5xx อัตโนมัติ 4 ครั้ง
- `refresh-and-push.ps1` — รัน snapshot แล้ว `git commit` + `git push` (สำหรับ Task Scheduler)

> หมายเหตุ: บางรายงาน HDC ต้นทาง **พังเอง** (ตอบ 502/500 แม้ดึงจากไทย) รายงานพวกนั้นจะไม่มีใน snapshot
> = ข้อมูลครบ "เท่าที่ต้นทางมีจริง" ซึ่งเท่ากับที่เปิดสดในเครื่องไทยจะได้

## ตั้ง Task Scheduler ให้รันทุกคืน (รันครั้งเดียวใน PowerShell)

แนะนำให้รันช่วง **01:00–03:00 น.** (ดึกพอที่จะไม่ชนช่วงคนเปิดดูหน้าเว็บ/แก้ข้อมูลในเครื่อง) ตัวอย่างตั้งไว้ 02:00 น.:

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$HOME\OneDrive\เอกสาร\KPI_HDC_PC\scripts\refresh-and-push.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun
Register-ScheduledTask -TaskName "KPI-HDC-Snapshot" -Action $action -Trigger $trigger `
  -Settings $settings -Description "รีเฟรช HDC snapshot ปากช่อง แล้ว push ขึ้น GitHub"
```

- รันทดสอบทันที: `Start-ScheduledTask -TaskName "KPI-HDC-Snapshot"`
- ดู log: `Get-Content "$HOME\OneDrive\เอกสาร\KPI_HDC_PC\scripts\refresh.log" -Tail 30`
- ลบ: `Unregister-ScheduledTask -TaskName "KPI-HDC-Snapshot" -Confirm:$false`

> เครื่องต้องเปิดตอนถึงเวลา และ git ต้อง push ได้โดยไม่ถามรหัส (credential manager จำไว้แล้ว)
