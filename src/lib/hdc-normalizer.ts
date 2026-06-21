import type { HdcColumnSchema, HdcDataSource, HdcRawRow, NormalizedHdcRow } from "./hdc-types";
import { getPakchongUnitName, PAKCHONG_UNIT_CODES } from "./pakchong-units";

const UNIT_CODE_KEYS = [
  "hoscode",
  "hospcode",
  "hcode",
  "provider_code",
  "hospital_code",
  "unit_code",
  "a_code",
  "code",
  "รหัสหน่วยบริการ"
];

const UNIT_NAME_KEYS = [
  "hosname",
  "hospname",
  "hospital_name",
  "provider_name",
  "unit_name",
  "a_name",
  "name",
  "ชื่อหน่วยบริการ"
];

const TARGET_KEYS = ["target", "goal", "total", "denominator", "B", "b", "เป้าหมาย"];
const RESULT_KEYS = ["result", "value", "amount", "numerator", "A", "a", "ผลงาน"];
const RATE_KEYS = ["rate", "percent", "percentage", "pct", "ratio", "F3", "C", "c", "ร้อยละ"];

export function normalizeHdcSources(
  sources: HdcDataSource[] | undefined,
  reportCode: string,
  title: string
): NormalizedHdcRow[] {
  if (!Array.isArray(sources)) {
    return [];
  }

  const rows = sources.flatMap((source) => {
    const data = Array.isArray(source.data) ? source.data : [];
    return data.map((row) => normalizeHdcRow(row, source.jsonc ?? [], reportCode, title, source.datecom ?? null));
  });

  return rows.filter((row) => PAKCHONG_UNIT_CODES.has(row.unitCode));
}

export function normalizeHdcRow(
  row: HdcRawRow,
  columns: HdcColumnSchema[],
  reportCode: string,
  title: string,
  processedDate: string | null
): NormalizedHdcRow {
  const unitCode = normalizeCode(getFirstValue(row, UNIT_CODE_KEYS));
  const unitName = extractUnitName(String(getFirstValue(row, UNIT_NAME_KEYS) ?? ""), unitCode);
  const targetKey = findColumnKey(row, columns, TARGET_KEYS, "N", 1);
  const resultKey = findColumnKey(row, columns, RESULT_KEYS, "N", 2);
  const rateKey = findColumnKey(row, columns, RATE_KEYS, "F", 3);

  return {
    reportCode,
    title,
    unitCode,
    unitName: unitName || getPakchongUnitName(unitCode),
    target: coerceMetric(targetKey ? row[targetKey] : getFirstValue(row, TARGET_KEYS)),
    result: coerceMetric(resultKey ? row[resultKey] : getFirstValue(row, RESULT_KEYS)),
    rate: coerceMetric(rateKey ? row[rateKey] : getFirstValue(row, RATE_KEYS)),
    processedDate,
    raw: row
  };
}

export function getUnitCode(row: HdcRawRow) {
  return normalizeCode(getFirstValue(row, UNIT_CODE_KEYS));
}

function getFirstValue(row: HdcRawRow, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }

  return undefined;
}

function findColumnKey(
  row: HdcRawRow,
  columns: HdcColumnSchema[],
  fallbackKeys: string[],
  preferredType: string,
  preferredPosition: number
) {
  const exactFallback = fallbackKeys.find((key) => row[key] !== undefined);
  if (exactFallback) {
    return exactFallback;
  }

  const byPosition = columns.find((column) => {
    return String(column.type ?? "") === preferredType && Number(column.position) === preferredPosition && column.column_name;
  });

  if (byPosition?.column_name && row[byPosition.column_name] !== undefined) {
    return byPosition.column_name;
  }

  const byName = columns.find((column) => {
    return column.column_name && fallbackKeys.some((key) => column.column_name?.toLowerCase() === key.toLowerCase());
  });

  if (byName?.column_name && row[byName.column_name] !== undefined) {
    return byName.column_name;
  }

  return undefined;
}

function normalizeCode(value: unknown) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/\d{5}/);
  return match ? match[0] : raw.padStart(5, "0");
}

function extractUnitName(value: string, unitCode: string) {
  if (!value) {
    return "";
  }

  return value.replace(new RegExp(`^${unitCode}\\s*:?\\s*`), "").trim();
}

function coerceMetric(value: unknown): string | number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = String(value).replace(/,/g, "").trim();
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : String(value);
}
