// Normalizer สำหรับจัดรูปแบบแถวข้อมูล HDC (table_display=provider) ให้เทียบสถานะได้
// ใช้เฉพาะใน scripts/snapshot.mjs เพื่อคำนวณสถานะ coverage — ไม่กระทบ snap_*.json ที่เก็บข้อมูลดิบ
// และไม่กระทบ normalizeKpiRow ใน script.js ที่ใช้ render หน้าเว็บอยู่แล้ว

import { PAKCHONG_UNIT_CODES, getPakchongUnitName } from "./pakchong-units.mjs";

const UNIT_CODE_KEYS = ["hoscode", "hospcode", "hcode", "provider_code", "hospital_code", "unit_code", "a_code", "code", "รหัสหน่วยบริการ"];
const UNIT_NAME_KEYS = ["hosname", "hospname", "hospital_name", "provider_name", "unit_name", "a_name", "name", "ชื่อหน่วยบริการ"];
const TARGET_KEYS = ["target", "goal", "total", "denominator", "B", "b", "เป้าหมาย"];
const RESULT_KEYS = ["result", "value", "amount", "numerator", "A", "a", "ผลงาน"];
const RATE_KEYS = ["rate", "percent", "percentage", "pct", "ratio", "F3", "C", "c", "ร้อยละ"];

function getFirstValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return undefined;
}

function normalizeCode(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/\d{5}/);
  return match ? match[0] : raw.padStart(5, "0");
}

function coerceMetric(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = String(value).replace(/,/g, "").trim();
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : String(value);
}

function normalizeHdcRow(row) {
  const unitCode = normalizeCode(getFirstValue(row, UNIT_CODE_KEYS));
  const unitName = String(getFirstValue(row, UNIT_NAME_KEYS) ?? "").trim();
  return {
    unitCode,
    unitName: unitName || getPakchongUnitName(unitCode),
    target: coerceMetric(getFirstValue(row, TARGET_KEYS)),
    result: coerceMetric(getFirstValue(row, RESULT_KEYS)),
    rate: coerceMetric(getFirstValue(row, RATE_KEYS))
  };
}

// dataSources คือ payload.rows ที่ได้ตรงจาก reports/province/data/{reportCode} (รูปแบบเดียวกับที่ snapshot.mjs เก็บ)
export function normalizePakchongRows(dataSources) {
  if (!Array.isArray(dataSources)) return [];
  const rows = dataSources.flatMap((source) => (Array.isArray(source.data) ? source.data : []).map(normalizeHdcRow));
  return rows.filter((row) => PAKCHONG_UNIT_CODES.has(row.unitCode));
}
