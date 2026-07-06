// Sync audit — ตรวจว่า snapshot ที่เว็บออนไลน์ใช้ยังตรงกับ HDC live หรือเริ่ม stale
//
// รันบนเครื่องที่เรียก HDC API ได้:
//   node scripts/sync-audit.mjs
//
// ผลลัพธ์:
//   data/sync-audit.json

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SNAPSHOT_DIR = join(ROOT, "data", "snapshot");
const OUT_FILE = join(ROOT, "data", "sync-audit.json");

const HDC_BASE = "https://api-hdc.moph.go.th/v1/";
const YEAR = process.env.HDC_YEAR || "2569";
const HDC_CONFIG = { zone: "09", provinceCode: "30", districtCode: "3021" };

const ALLOWED_SERVICE_UNIT_CODES = new Set([
  "02803", "02804", "02805", "02806", "02807", "02808", "02809", "02810",
  "02811", "02812", "02813", "02814", "02815", "02816", "02817", "02818",
  "02819", "02820", "02821", "10890", "23012", "24641", "24642", "77498",
]);

const CONTROL_REPORTS = [
  {
    group: "Service Plan สาขาอายุรกรรม",
    name: "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired",
    reportCode: "00366a85bd3c2b6932a228df29137252",
  },
  {
    group: "Service Plan สาขาสุขภาพช่องปาก",
    name: "ร้อยละของเด็กอายุ 0-5 ปี ฟันดีไม่มีผุ (Cavity Free)",
    reportCode: "abt2t2k4z4xeqzytwbave",
  },
  {
    group: "Service Plan สาขาโรคไม่ติดต่อ (NCD DM,HT,CVD)",
    name: "อัตราผู้ป่วยความดันโลหิตสูงและเบาหวานรายใหม่",
    reportCode: "418ae93a872547ebe2fbf0ff4f73e65e",
  },
];

const UPSTREAM_HEADERS = {
  domain: "nma",
  "User-Agent": "HDC-Pakchong-sync-audit/1.0",
  Accept: "application/json,*/*",
  "Cache-Control": "no-cache",
};

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

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function findValueByPrefix(row, prefix) {
  const exact = toNumber(row[prefix]);
  if (exact !== null) return exact;
  const key = Object.keys(row).find((name) => name.startsWith(`${prefix}_`) && toNumber(row[name]) !== null);
  return key ? toNumber(row[key]) : null;
}

function getRatio(row, target, result) {
  for (const key of ["F3", "F1", "ratio", "percent", "rate"]) {
    const value = toNumber(row[key]);
    if (value !== null) return value;
  }
  const formulaKey = Object.keys(row).find((key) => /^F\d+$/.test(key) && toNumber(row[key]) !== null);
  if (formulaKey) return toNumber(row[formulaKey]);
  if (target && result !== null) return (result / target) * 100;
  return null;
}

function normalizeRow(row) {
  const [codeFromName, nameFromName] = String(row.a_name || "").split(/:(.*)/s);
  const target = findValueByPrefix(row, "target") ?? toNumber(row.c);
  const result = findValueByPrefix(row, "result") ?? toNumber(row.b);
  return {
    code: String(row.a_code || codeFromName || "").trim(),
    name: String(nameFromName || row.a_name || "").trim(),
    target,
    result,
    ratio: getRatio(row, target, result),
  };
}

function summarizeProviderResponse(response) {
  const source = response?.rows?.[0] || {};
  const rows = (Array.isArray(source.data) ? source.data : [])
    .map(normalizeRow)
    .filter((row) => ALLOWED_SERVICE_UNIT_CODES.has(row.code));

  const target = rows.reduce((sum, row) => sum + (row.target || 0), 0);
  const result = rows.reduce((sum, row) => sum + (row.result || 0), 0);
  const ratios = rows.map((row) => row.ratio).filter((value) => Number.isFinite(value));
  const ratio = target > 0
    ? (result / target) * 100
    : ratios.length
      ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length
      : null;

  return {
    datecom: source.datecom || "",
    units: rows.length,
    target,
    result,
    ratio: ratio === null ? null : Number(ratio.toFixed(4)),
  };
}

function sameSummary(a, b) {
  if (!a || !b) return false;
  return a.datecom === b.datecom
    && a.units === b.units
    && a.target === b.target
    && a.result === b.result
    && Math.abs((a.ratio ?? -1) - (b.ratio ?? -1)) < 0.01;
}

async function fetchJson(url, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: UPSTREAM_HEADERS,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function readSnapshot(manifest, kind, path) {
  const file = manifest?.entries?.[`${kind} ${path}`];
  if (!file) return null;
  const raw = await readFile(join(SNAPSHOT_DIR, file), "utf8");
  return JSON.parse(raw);
}

function ageHours(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return Math.round(((Date.now() - date.getTime()) / 3_600_000) * 100) / 100;
}

async function main() {
  const manifest = JSON.parse(await readFile(join(SNAPSHOT_DIR, "manifest.json"), "utf8"));
  const checks = [];

  for (const control of CONTROL_REPORTS) {
    const providerPath = buildProviderDataPath(control.reportCode);
    const liveUrl = HDC_BASE + providerPath;
    const item = {
      ...control,
      path: providerPath,
      status: "error",
      live: null,
      snapshot: null,
      diff: [],
      error: "",
    };

    try {
      const [liveResponse, snapshotResponse] = await Promise.all([
        fetchJson(liveUrl),
        readSnapshot(manifest, "hdc", providerPath),
      ]);

      item.live = summarizeProviderResponse(liveResponse);
      item.snapshot = snapshotResponse ? summarizeProviderResponse(snapshotResponse) : null;

      if (!item.snapshot) {
        item.status = "missing-snapshot";
        item.diff.push("ไม่มี snapshot ของ report นี้");
      } else if (sameSummary(item.live, item.snapshot)) {
        item.status = "synced";
      } else {
        item.status = "stale";
        for (const key of ["datecom", "units", "target", "result", "ratio"]) {
          if (item.live?.[key] !== item.snapshot?.[key]) item.diff.push(key);
        }
      }
    } catch (error) {
      item.status = "error";
      item.error = error instanceof Error ? error.message : String(error);
    }

    checks.push(item);
  }

  const synced = checks.filter((item) => item.status === "synced").length;
  const stale = checks.filter((item) => item.status === "stale").length;
  const missing = checks.filter((item) => item.status === "missing-snapshot").length;
  const errors = checks.filter((item) => item.status === "error").length;

  const status = errors > 0
    ? "audit-error"
    : stale > 0 || missing > 0
      ? "stale"
      : "synced";

  const output = {
    generatedAt: new Date().toISOString(),
    year: YEAR,
    status,
    summary: {
      total: checks.length,
      synced,
      stale,
      missing,
      errors,
      snapshotGeneratedAt: manifest.generatedAt || "",
      snapshotAgeHours: ageHours(manifest.generatedAt),
      snapshotErrorCount: manifest.errorCount ?? 0,
      snapshotEntries: Object.keys(manifest.entries || {}).length,
    },
    checks,
  };

  await writeFile(OUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`[sync-audit] ${status}: synced ${synced}/${checks.length}, stale ${stale}, missing ${missing}, errors ${errors}`);

  if (process.env.SYNC_AUDIT_STRICT === "1" && status !== "synced") process.exitCode = 2;
}

main().catch((error) => {
  console.error("[sync-audit fatal]", error);
  process.exit(1);
});
