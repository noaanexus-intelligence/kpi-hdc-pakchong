import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAKCHONG_UNIT_CODES } from "./lib/pakchong-units.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const approvedPath = join(root, "data", "kpi-rpst-approved.json");
const manifestPath = join(root, "data", "snapshot", "manifest.json");
const approved = JSON.parse(await readFile(approvedPath, "utf8"));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const errors = [];
const reportCodes = new Set();
let checkedRows = 0;
let comparedFormulaRows = 0;
let verifiedItems = 0;
let directHdcItems = 0;
let chartEnabledItems = 0;
let noChartItems = 0;

if (approved.items.length !== approved.selectionTotal) errors.push(`selectionTotal=${approved.selectionTotal} แต่พบ items=${approved.items.length}`);
if (approved.selectionTotal !== 62) errors.push(`ต้องมี KPI 62 ข้อ แต่พบ ${approved.selectionTotal}`);

for (const item of approved.items) {
  if (reportCodes.has(item.reportCode)) errors.push(`${item.id}: reportCode ซ้ำ ${item.reportCode}`);
  reportCodes.add(item.reportCode);

  const manifestEntry = Object.entries(manifest.entries)
    .find(([key]) => key.startsWith("hdc reports/province/data/") && key.includes(item.reportCode));
  if (!manifestEntry) {
    errors.push(`${item.id}: ไม่พบ snapshot ของ ${item.reportCode}`);
    continue;
  }

  const response = JSON.parse(await readFile(join(root, "data", "snapshot", manifestEntry[1]), "utf8"));
  const source = response?.rows?.[0] || {};
  const rows = source.data;
  if (!Array.isArray(rows)) {
    errors.push(`${item.id}: snapshot ไม่มี rows[0].data`);
    continue;
  }

  const providerRows = rows.filter((row) => PAKCHONG_UNIT_CODES.has(String(row.a_code || "")));
  const providerCodes = new Set(providerRows.map((row) => String(row.a_code)));
  if (providerRows.length !== PAKCHONG_UNIT_CODES.size || providerCodes.size !== PAKCHONG_UNIT_CODES.size) {
    errors.push(`${item.id}: พบหน่วยบริการ ${providerCodes.size}/${PAKCHONG_UNIT_CODES.size}`);
  }

  const formulaVerified = item.status === "approved-single-formula";
  const formulaDefinitions = Array.isArray(item.formulaDefinitions) ? item.formulaDefinitions : [];
  if (formulaDefinitions.length !== item.formulaCount) {
    errors.push(`${item.id}: formulaDefinitions=${formulaDefinitions.length} แต่ formulaCount=${item.formulaCount}`);
  }
  const chartFields = (Array.isArray(source.jsonc) ? source.jsonc : [])
    .filter((column) => column?.type === "F" && Number(column.is_chart) === 1);
  if (chartFields.length) chartEnabledItems += 1;
  else noChartItems += 1;

  if (formulaVerified) {
    verifiedItems += 1;
    if (!item.numeratorField || !item.denominatorField || !item.formulaField) {
      errors.push(`${item.id}: สถานะตรวจสูตรแล้วแต่ระบุ field สูตรไม่ครบ`);
    }
  } else if (item.status === "hdc-direct-multi-formula") {
    directHdcItems += 1;
    if (item.formulaCount <= 1) errors.push(`${item.id}: ใช้ผล HDC หลายสูตรแต่ formulaCount=${item.formulaCount}`);
  } else {
    errors.push(`${item.id}: status ไม่ถูกต้อง (${item.status})`);
  }

  for (const row of providerRows) {
    checkedRows += 1;
    if (!formulaVerified) continue;
    const numerator = Number(row[item.numeratorField]);
    const denominator = Number(row[item.denominatorField]);
    const hdcRatio = Number(row[item.formulaField]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
      errors.push(`${item.id}/${row.a_code}: ตัวตั้งหรือตัวหารไม่ใช่ตัวเลข`);
      continue;
    }
    if (denominator <= 0 || !Number.isFinite(hdcRatio)) continue;
    comparedFormulaRows += 1;
    const calculated = (numerator / denominator) * 100;
    if (Math.abs(calculated - hdcRatio) > 0.01) {
      errors.push(`${item.id}/${row.a_code}: คำนวณ ${calculated} ไม่ตรง ${item.formulaField}=${hdcRatio}`);
    }
  }
}

if (verifiedItems !== approved.approvedTotal) errors.push(`approvedTotal=${approved.approvedTotal} แต่ตรวจพบ ${verifiedItems}`);
if (directHdcItems !== approved.directHdcTotal) errors.push(`directHdcTotal=${approved.directHdcTotal} แต่ตรวจพบ ${directHdcItems}`);
if (verifiedItems !== 13 || directHdcItems !== 49) errors.push(`สถานะสูตรต้องเป็น 13 ตรวจแล้ว / 49 ใช้ผล HDC แต่พบ ${verifiedItems}/${directHdcItems}`);
if (chartEnabledItems !== 55 || noChartItems !== 7) errors.push(`สถานะกราฟ HDC ต้องเป็น 55 มีกราฟ / 7 ไม่มีกราฟ แต่พบ ${chartEnabledItems}/${noChartItems}`);

if (errors.length) {
  console.error(`ตรวจ KPI ไม่ผ่าน ${errors.length} จุด`);
  errors.slice(0, 50).forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`ตรวจผ่าน ${approved.items.length} KPI (${verifiedItems} ตรวจสูตรแล้ว / ${directHdcItems} ใช้ผล HDC), กราฟ HDC ${chartEnabledItems} ข้อ / ไม่มีกราฟ ${noChartItems} ข้อ, ${checkedRows} แถวหน่วยบริการ, เทียบสูตรสำเร็จ ${comparedFormulaRows} แถว`);
