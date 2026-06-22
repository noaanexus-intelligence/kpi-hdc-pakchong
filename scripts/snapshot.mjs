// Snapshot generator — ดึงข้อมูล HDC จากเครื่อง IP ไทย เก็บเป็น static cache
// เหตุผล: api-hdc.moph.go.th / api-center-hdc.moph.go.th เข้าถึงได้เฉพาะ IP ไทย
// Vercel (สิงคโปร์/สหรัฐฯ) เรียก upstream ไม่ได้ -> proxy ตอบ 502 "internal error"
// จึง snapshot ทุก endpoint ที่หน้าเว็บเรียกในโหมด standard (ปี default) ไว้ใน data/snapshot/
// แล้วหน้าเว็บจะ fallback มาอ่าน snapshot เมื่อเรียก proxy ไม่ได้ (ดู hdcGet ใน script.js)
//
// เดิมดึงเฉพาะหมวด "Service Plan" — ตอนนี้ดึงครบทุกหมวดของ standard catalog แล้ว
// พร้อมคำนวณสถานะ success/no_data/error ต่อรายงาน เขียนเป็น data/snapshot/coverage.json
// (coverage.js ใช้แสดงผลบนหน้าเว็บ — อ่านไฟล์นี้เฉยๆ ไม่เรียก live proxy)
//
// system/subcatalog/reports ตอบเป็นต้นไม้ (node กลุ่มมี children ซ้อนรายงานอยู่ข้างใน) — เดิมโค้ด
// อ่านแค่แถวบนสุด ทำให้รายงานที่ซ้อนอยู่ใต้กลุ่มหลุดไปทั้งหมด (พบจาก audit สาขา Service Plan,
// ดู data/audit/service-plan-tree-summary.json) ตอนนี้ flattenReportTree() recurse ลงทุกชั้นแล้ว
//
// รัน: node scripts/snapshot.mjs   (ต้องรันบนเครื่องที่อยู่ในไทย)
// จำกัดจำนวนหมวดตอนทดสอบได้ด้วย: HDC_CATEGORY_LIMIT=2 node scripts/snapshot.mjs

import { writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalizePakchongRows } from "./lib/hdc-normalize.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "data", "snapshot");

const HDC_BASE = "https://api-hdc.moph.go.th/v1/";
const CENTER_BASE = "https://api-center-hdc.moph.go.th/v1/";
const HDC_CONFIG = { zone: "09", provinceCode: "30", districtCode: "3021" };
const YEAR = process.env.HDC_YEAR || "2569"; // ปีงบประมาณ default ของหน้าเว็บ (โหมด standard)
const CATEGORY_LIMIT = process.env.HDC_CATEGORY_LIMIT ? Number(process.env.HDC_CATEGORY_LIMIT) : Infinity;

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
const dataCache = new Map(); // key -> parsed JSON (เก็บไว้กันซ้ำ คืนข้อมูลจริงได้แม้ key เคย snap แล้วในรอบนี้)
const errors = [];
let counter = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_TRIES = 4; // upstream HDC flaky — retry 5xx/timeout
// HTTP 500/502 จาก HDC ต้นทางมักเป็นปัญหาชั่วคราว (ดู scripts/README.md) — รอนานขึ้นกว่า error อื่นก่อน retry
// เป็นแค่ background sync (รันแยกจากหน้าเว็บหลักเสมอ) ดังนั้นรอนานขึ้นตรงนี้ไม่กระทบผู้ใช้ที่เปิดหน้าเว็บ
const UPSTREAM_5XX_BACKOFF_MS = [2000, 5000, 10000];

async function snap(kind, path) {
  const key = `${kind} ${path}`;
  if (manifest.entries[key]) return dataCache.get(key) ?? null; // กันซ้ำ แต่คืนข้อมูลที่เคยดึงได้ในรอบนี้
  const target = baseFor(kind) + path;
  let lastErr = "";
  for (let attempt = 1; attempt <= MAX_TRIES; attempt += 1) {
    try {
      const res = await fetch(target, { headers: UPSTREAM_HEADERS });
      if (!res.ok) {
        lastErr = `HTTP ${res.status}`;
        if (res.status >= 500 && attempt < MAX_TRIES) {
          const delay = (res.status === 500 || res.status === 502)
            ? UPSTREAM_5XX_BACKOFF_MS[attempt - 1]
            : 600 * attempt;
          await sleep(delay);
          continue;
        }
        throw new Error(lastErr);
      }
      const data = await res.json();
      counter += 1;
      const file = `snap_${String(counter).padStart(4, "0")}.json`;
      await writeFile(join(OUT_DIR, file), JSON.stringify(data), "utf8");
      manifest.entries[key] = file;
      dataCache.set(key, data);
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

// ---- flatten: ต้นไม้ system/subcatalog/reports มี node กลุ่ม (children) ซ้อนรายงานอยู่ข้างใน
// เดิมโค้ดอ่านแค่แถวบนสุด (top-level) ทำให้รายงานที่ซ้อนอยู่ใต้กลุ่มหลุดไปทั้งหมด (ดู scripts/README.md)
// recurse ลงทุกชั้นเพื่อไม่ให้รายงานที่ซ้อนอยู่หลุดหาย — ต้องตรงกับ flattenReportTree ใน script.js
function flattenReportTree(rows, { groupPath = [], depth = 0 } = {}) {
  const leaves = [];
  for (const node of rows || []) {
    const children = Array.isArray(node.children) ? node.children : null;
    if (node.report_code) {
      leaves.push({ ...node, groupPath: [...groupPath], depth });
    }
    if (children && children.length) {
      const label = stripHtmlTags(node.label || node.report_name || "");
      leaves.push(...flattenReportTree(children, { groupPath: [...groupPath, label].filter(Boolean), depth: depth + 1 }).leaves);
    }
  }
  return { leaves };
}

// HDC ใช้ reportCode ซ้ำได้ในหลายตำแหน่งของ catalog เดียวกัน — กันไม่ให้ดึง/แสดงซ้ำ
function dedupeByReportCode(reports) {
  const seen = new Set();
  return reports.filter((r) => {
    const code = String(r.report_code ?? "").trim();
    if (!code || seen.has(code)) return false;
    seen.add(code);
    return true;
  });
}

// ---- coverage: สถานะ success/no_data/error ต่อรายงาน (ครบทุกหมวด ไม่ใช่แค่ Service Plan) ----
const coverageReports = [];

async function snapReportAndTrackCoverage(category, sub, report) {
  const reportCode = String(report.report_code).trim();
  const startedAt = Date.now();
  const errorsBefore = errors.length;
  const data = await snap("hdc", buildProviderDataPath(reportCode));
  const durationMs = Date.now() - startedAt;
  const failed = errors.length > errorsBefore;

  let status = "error";
  let rowCount = 0;
  let error;
  if (failed) {
    error = errors[errors.length - 1]?.error;
  } else {
    rowCount = normalizePakchongRows(data?.rows).length;
    status = rowCount > 0 ? "success" : "no_data";
  }

  coverageReports.push({
    category: category.name,
    subcategory: optionText(sub),
    subcatalogId: sub.code,
    reportCode,
    title: stripHtmlTags(report.report_name || report.title_name || report.report_names || report.label || reportCode),
    groupPath: (report.groupPath || []).join(" > ") || null,
    depth: report.depth ?? 0,
    status,
    rowCount,
    error,
    durationMs,
  });
}

function buildCoverageSummary(reports) {
  return {
    total: reports.length,
    success: reports.filter((r) => r.status === "success").length,
    noData: reports.filter((r) => r.status === "no_data").length,
    error: reports.filter((r) => r.status === "error").length,
  };
}

function buildCoverageGroups(reports) {
  const byCategory = new Map();
  for (const report of reports) {
    const list = byCategory.get(report.category) ?? [];
    list.push(report);
    byCategory.set(report.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, items]) => ({
    category,
    ...buildCoverageSummary(items),
  }));
}

async function writeCoverageFile() {
  const coverage = {
    generatedAt: new Date().toISOString(),
    year: YEAR,
    summary: buildCoverageSummary(coverageReports),
    groups: buildCoverageGroups(coverageReports),
    errors: coverageReports
      .filter((r) => r.status === "error")
      .map((r) => ({ reportCode: r.reportCode, title: r.title, category: r.category, error: r.error })),
    reports: coverageReports,
  };
  await writeFile(join(OUT_DIR, "coverage.json"), JSON.stringify(coverage), "utf8");
  return coverage;
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

  // 2) ทุกหมวดของ standard catalog -> ทุกหมวดย่อย -> รายการรายงาน -> provider data ของแต่ละรายงาน
  //    (เดิมดึงเฉพาะหมวด "Service Plan" หมวดเดียว ตอนนี้ครบทุกหมวดเพื่อให้ตรวจ KPI ได้สมบูรณ์ขึ้น)
  const categories = (standardCatalog?.rows || []).filter((c) => c.code).slice(0, CATEGORY_LIMIT);
  console.log(`[snapshot] standard catalog: ${categories.length} หมวด`);

  let reportTotal = 0;
  for (const category of categories) {
    const subcatalogs = category.sub_menu || [];
    for (const sub of subcatalogs) {
      const reportsResp = await snap("center", `system/subcatalog/reports?subcatalogId=${encodeURIComponent(sub.code)}`);
      const { leaves } = flattenReportTree(reportsResp?.rows || []);
      const sourceReportCount = leaves.length;
      const reports = dedupeByReportCode(leaves.filter((r) => r.report_code && r.active !== false));
      reportTotal += reports.length;
      for (const report of reports) {
        await snapReportAndTrackCoverage(category, sub, report);
      }
      console.log(`  ✓ [${category.name}] ${optionText(sub)} — ${reports.length}/${sourceReportCount} รายงานที่มี report_code`);
    }
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.errorCount = errors.length;
  manifest.errors = errors;
  await writeFile(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  const coverage = await writeCoverageFile();
  console.log(
    `[snapshot] เสร็จ: ${counter} ไฟล์, ${categories.length} หมวด, ${reportTotal} รายงาน, lookup error ${errors.length}` +
      ` | coverage: สำเร็จ ${coverage.summary.success}, ไม่มีข้อมูล ${coverage.summary.noData}, error ${coverage.summary.error}`,
  );

  // ถ้าดึง lookup เริ่มต้นไม่ได้เลย = upstream ใช้ไม่ได้ -> exit 1 (กัน push ของเสีย)
  if (!manifest.entries["hdc lookup/standard/catalog"]) {
    console.error("[snapshot] ดึง lookup เริ่มต้นไม่สำเร็จ — upstream อาจใช้ไม่ได้");
    process.exit(1);
  }
}

function optionText(item) {
  return item.name || item.text || item.code_name || item.value || item.code;
}

function stripHtmlTags(value) {
  return String(value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
