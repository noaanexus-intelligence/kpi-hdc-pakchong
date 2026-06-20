// Snapshot generator — ดึงข้อมูล HDC จากเครื่อง IP ไทย เก็บเป็น static cache
// เหตุผล: api-hdc.moph.go.th / api-center-hdc.moph.go.th เข้าถึงได้เฉพาะ IP ไทย
// Vercel (สิงคโปร์/สหรัฐฯ) เรียก upstream ไม่ได้ -> proxy ตอบ 502 "internal error"
// จึง snapshot ทุก endpoint ที่หน้าเว็บเรียกในโหมด standard (ปี default) ไว้ใน data/snapshot/
// แล้วหน้าเว็บจะ fallback มาอ่าน snapshot เมื่อเรียก proxy ไม่ได้ (ดู hdcGet ใน script.js)
//
// รัน: node scripts/snapshot.mjs   (ต้องรันบนเครื่องที่อยู่ในไทย)

import { writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "data", "snapshot");

const HDC_BASE = "https://api-hdc.moph.go.th/v1/";
const CENTER_BASE = "https://api-center-hdc.moph.go.th/v1/";
const HDC_CONFIG = { zone: "09", provinceCode: "30", districtCode: "3021" };
const YEAR = process.env.HDC_YEAR || "2569"; // ปีงบประมาณ default ของหน้าเว็บ (โหมด standard)

const UPSTREAM_HEADERS = {
  domain: "nma",
  "User-Agent": "HDC-Pakchong/1.0",
  Accept: "application/json,*/*",
  "Cache-Control": "no-cache",
};

// ---- path builders (ต้องตรงกับ script.js เป๊ะ เพื่อให้ key ตรงกัน) ----
function buildProviderDataPath(reportCode) {
  const params = new URLSearchParams({
    table_display: "provider",
    year: YEAR,
    month: "ALL",
    zone: HDC_CONFIG.zone,
    province_code: HDC_CONFIG.provinceCode,
    district_code: HDC_CONFIG.districtCode,
    subdistrict_code: "ALL",
    department_code: "ALL",
    organization_type: "ALL",
    ministry: "ALL",
    hospital: "ALL",
    service_plan: "ALL",
    jurisdiction_code: "ALL",
    freeze_month: "ALL",
    mental_code: "ALL",
    mental_group_code: "ALL",
    custom: "[]",
  });
  return `reports/province/data/${reportCode}?${params.toString()}`;
}

const baseFor = (kind) => (kind === "center" ? CENTER_BASE : HDC_BASE);

// ---- fetch + เก็บไฟล์ พร้อมลงทะเบียนใน manifest ----
const manifest = { generatedAt: "", year: YEAR, entries: {} };
const errors = [];
let counter = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_TRIES = 4; // upstream HDC flaky — retry 5xx/timeout

async function snap(kind, path) {
  const key = `${kind} ${path}`;
  if (manifest.entries[key]) return null; // กันซ้ำ
  const target = baseFor(kind) + path;
  let lastErr = "";
  for (let attempt = 1; attempt <= MAX_TRIES; attempt += 1) {
    try {
      const res = await fetch(target, { headers: UPSTREAM_HEADERS });
      if (!res.ok) {
        lastErr = `HTTP ${res.status}`;
        if (res.status >= 500 && attempt < MAX_TRIES) { await sleep(600 * attempt); continue; }
        throw new Error(lastErr);
      }
      const data = await res.json();
      counter += 1;
      const file = `snap_${String(counter).padStart(4, "0")}.json`;
      await writeFile(join(OUT_DIR, file), JSON.stringify(data), "utf8");
      manifest.entries[key] = file;
      return data;
    } catch (err) {
      lastErr = err.message;
      if (attempt < MAX_TRIES) { await sleep(600 * attempt); continue; }
    }
  }
  errors.push({ key, error: lastErr });
  console.error(`  ✗ ${key} -> ${lastErr} (หลัง ${MAX_TRIES} ครั้ง)`);
  return null;
}

async function main() {
  // เริ่มใหม่ทุกครั้ง กันไฟล์ค้าง
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`[snapshot] ปีงบ ${YEAR} — เริ่มดึง`);

  // 1) lookups เริ่มต้น (loadInitialKpiData)
  await snap("hdc", "lookup/kpi/catalog");
  const standardCatalog = await snap("hdc", "lookup/standard/catalog");
  await snap(
    "hdc",
    `lookup/hospital?provinceCode=${HDC_CONFIG.provinceCode}&districtCode=${HDC_CONFIG.districtCode}&subdistrictCode=&servicePlanLV=&byear=&isRegis=`,
  );

  // 2) Service Plan subcatalogs ทั้งหมด -> รายการรายงาน -> provider data ของแต่ละรายงาน
  const servicePlan = (standardCatalog?.rows || []).find((c) => String(c.name).includes("Service Plan"));
  const subcatalogs = servicePlan?.sub_menu || [];
  console.log(`[snapshot] Service Plan: ${subcatalogs.length} สาขา`);

  let reportTotal = 0;
  for (const sub of subcatalogs) {
    const reportsResp = await snap("center", `system/subcatalog/reports?subcatalogId=${encodeURIComponent(sub.code)}`);
    const reports = (reportsResp?.rows || []).filter((r) => r.report_code);
    reportTotal += reports.length;
    for (const report of reports) {
      await snap("hdc", buildProviderDataPath(report.report_code));
    }
    console.log(`  ✓ ${optionText(sub)} — ${reports.length} รายงาน`);
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.errorCount = errors.length;
  manifest.errors = errors;
  await writeFile(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log(`[snapshot] เสร็จ: ${counter} ไฟล์, ${subcatalogs.length} สาขา, ${reportTotal} รายงาน, error ${errors.length}`);

  // ถ้าดึง lookup เริ่มต้นไม่ได้เลย = upstream ใช้ไม่ได้ -> exit 1 (กัน push ของเสีย)
  if (!manifest.entries["hdc lookup/standard/catalog"]) {
    console.error("[snapshot] ดึง lookup เริ่มต้นไม่สำเร็จ — upstream อาจใช้ไม่ได้");
    process.exit(1);
  }
}

function optionText(item) {
  return item.name || item.text || item.code_name || item.value || item.code;
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
