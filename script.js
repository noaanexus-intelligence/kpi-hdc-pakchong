const icons = {
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  clipboard: '<rect x="7" y="3" width="10" height="4" rx="1"/><path d="M9 3h6"/><path d="M7 5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M8 13h.01M12 13h4M8 17h.01M12 17h4"/>',
  gauge: '<path d="M21 12a9 9 0 1 0-18 0"/><path d="M12 12 16 8"/><path d="M7.5 12h.01M12 6.5h.01M16.5 12h.01"/>',
  upload: '<path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 15v4h14v-4"/>',
  audit: '<path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/><path d="m8 8 1.5 1.5L12 7"/>',
  exchange: '<path d="M17 3 21 7l-4 4"/><path d="M21 7H3"/><path d="m7 21-4-4 4-4"/><path d="M3 17h18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="11" width="3" height="5"/><rect x="12" y="8" width="3" height="8"/><rect x="17" y="4" width="3" height="12"/>',
  pulse: '<path d="M20.8 8.6a5.5 5.5 0 0 0-9.8-3.2L12 6.5l1-1.1a5.5 5.5 0 0 1 7.8 7.8L12 22 3.2 13.2A5.5 5.5 0 0 1 11 5.4l1 1.1"/><path d="M4 12h4l2-3 4 7 2-4h4"/>',
  hospital: '<path d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M9 21v-5h6v5"/><path d="M9 9h6"/><path d="M12 6v6"/><path d="M3 21h18"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-5"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4"/><path d="M9 13h6M9 17h6"/>',
  megaphone: '<path d="M3 11v3a2 2 0 0 0 2 2h2l4 4v-5l8-3V6l-8-3v8H5a2 2 0 0 0-2 2Z"/><path d="M19 8a3 3 0 0 1 0 6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M2 21v-2a4 4 0 0 1 3-3.87"/><path d="M8 3.13a4 4 0 0 0 0 7.75"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M8 6h8"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m5 3 .7 2.1L8 6l-2.3.9L5 9l-.7-2.1L2 6l2.3-.9Z"/><path d="m19 15 .7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9Z"/>',
  calendar: '<path d="M8 2v4M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  play: '<path d="m8 5 12 7-12 7z"/>'
};

function renderIcon(node) {
  const key = node.dataset.icon;
  if (!icons[key]) return node;
  node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
  return node;
}

document.querySelectorAll("[data-icon]").forEach(renderIcon);

const topbar = document.querySelector(".topbar");
const hamburger = document.querySelector(".hamburger");
const reportToggle = document.querySelector(".report-toggle");
const reportMega = document.querySelector("#reportMega");
const closeMega = document.querySelector(".mega-close");

function setMega(open) {
  reportMega.classList.toggle("open", open);
  reportMega.setAttribute("aria-hidden", String(!open));
  reportToggle.setAttribute("aria-expanded", String(open));
}

hamburger.addEventListener("click", () => {
  const open = topbar.classList.toggle("menu-open");
  hamburger.setAttribute("aria-expanded", String(open));
});

reportToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setMega(!reportMega.classList.contains("open"));
});

closeMega.addEventListener("click", () => setMega(false));

document.addEventListener("click", (event) => {
  if (!reportMega.contains(event.target) && !reportToggle.contains(event.target)) {
    setMega(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMega(false);
});

document.querySelectorAll(".quick-card").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    document.querySelectorAll(".quick-card").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tab));
  });
});

const timeLeft = document.querySelector("#timeLeft");

function getFiscalYearEndSeconds() {
  const now = new Date();
  const endYear = now.getFullYear();
  let end = new Date(endYear, 8, 30, 23, 59, 59); // 30 ก.ย.
  if (now > end) end = new Date(endYear + 1, 8, 30, 23, 59, 59);
  return Math.max(0, Math.floor((end - now) / 1000));
}

let seconds = getFiscalYearEndSeconds();

function tick() {
  seconds = Math.max(0, seconds - 1);
  const d = Math.floor(seconds / 86400);
  const h = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  timeLeft.textContent = d > 0 ? `${d} วัน ${h}:${m}:${s}` : `${h}:${m}:${s}`;
}

setInterval(tick, 1000);

const HDC_CONFIG = {
  zone: "09",
  provinceCode: "30",
  districtCode: "3021"
};

const DEFAULT_STANDARD_SUBCATALOG = "144fdf97a756b3f82dce197287e06316";
const LOCAL_MONITOR_URL = "http://127.0.0.1:4173/";
const ALLOWED_SERVICE_UNITS = [
  { code: "02803", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองมะค่า" },
  { code: "02804", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลกลางดง" },
  { code: "02805", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองกระทุ่ม" },
  { code: "02806", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองไข่น้ำ" },
  { code: "02807", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลวังกะทะ" },
  { code: "02808", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองขวาง" },
  { code: "02809", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลคลองดินดำ" },
  { code: "02810", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลท่าช้าง" },
  {
    code: "02811",
    name: "สถานีอนามัยเฉลิมพระเกียรติ 60 พรรษา นวมินทราชินี นิคมลำตะคอง",
    aliases: ["สถานีอนามัยเฉลิมพระเกียรติ 60 พรรษา นวมินทราชินี"]
  },
  { code: "02812", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ่อทอง" },
  { code: "02813", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลขนงพระเหนือ" },
  { code: "02814", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลขนงพระใต้" },
  { code: "02815", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองคุ้ม" },
  { code: "02816", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลคลองม่วง" },
  { code: "02817", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลซับพลู" },
  { code: "02818", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลหนองน้ำแดง" },
  { code: "02819", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลวังไทร" },
  { code: "02820", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลซับน้อย" },
  { code: "02821", name: "โรงพยาบาลส่งเสริมสุขภาพตำบลโนนกระโดน" },
  { code: "10890", name: "โรงพยาบาลปากช่องนานา" },
  { code: "23012", name: "ศูนย์สุขภาพชุมชนเทศบาลเมืองปากช่อง3(หนองสาหร่าย)" },
  { code: "24641", name: "ศูนย์สุขภาพชุมชนเทศบาลเมืองปากช่อง 1" },
  { code: "24642", name: "ศูนย์สุขภาพชุมชนเทศบาลเมืองปากช่อง 2" },
  { code: "77498", name: "โรงพยาบาลมกุฏคีรีวัน" }
];
const ALLOWED_SERVICE_UNIT_CODES = new Set(ALLOWED_SERVICE_UNITS.map((unit) => unit.code));

const kpiState = {
  mode: "standard",
  catalogs: [],
  standardCatalogs: [],
  standardSubcatalogs: [],
  servicePlanSubcatalogs: [],
  preventionSubcatalogs: [],
  reports: [],
  hospitals: [],
  currentRows: [],
  allSummary: [],
  servicePlanCoverage: [],
  reportSourceCount: 0,
  reportSkippedCount: 0,
  lastDateCom: "",
  currentReportName: ""
};

const kpiEls = {
  mode: document.querySelector("#dataModeSelect"),
  catalog: document.querySelector("#kpiCatalogSelect"),
  year: document.querySelector("#kpiYearSelect"),
  report: document.querySelector("#kpiReportSelect"),
  unit: document.querySelector("#serviceUnitSelect"),
  load: document.querySelector("#loadKpiButton"),
  processAll: document.querySelector("#processAllKpiButton"),
  checkServicePlan: document.querySelector("#checkServicePlanButton"),
  exportCsv: document.querySelector("#exportKpiButton"),
  status: document.querySelector("#kpiStatus"),
  tableBody: document.querySelector("#kpiTableBody"),
  allSummary: document.querySelector("#allKpiSummary"),
  allTableBody: document.querySelector("#allKpiTableBody"),
  coverage: document.querySelector("#servicePlanCoverage"),
  coverageTableBody: document.querySelector("#servicePlanCoverageBody"),
  coverageTotal: document.querySelector("#coverageTotal"),
  servicePlanMenu: document.querySelector("#servicePlanMenu"),
  preventionMenu: document.querySelector("#preventionMenu"),
  serviceUnitCount: document.querySelector("#serviceUnitCount"),
  kpiCatalogCount: document.querySelector("#kpiCatalogCount"),
  kpiProcessedCount: document.querySelector("#kpiProcessedCount"),
  metricUnits: document.querySelector("#metricUnits"),
  metricTarget: document.querySelector("#metricTarget"),
  metricResult: document.querySelector("#metricResult"),
  metricRatio: document.querySelector("#metricRatio"),
  metricGap: document.querySelector("#metricGap"),
  insightPanel: document.querySelector("#kpiInsightPanel"),
  insightGap: document.querySelector("#insightGap"),
  insightGapNote: document.querySelector("#insightGapNote"),
  insightLowList: document.querySelector("#insightLowList"),
  insightHighList: document.querySelector("#insightHighList"),
  insightQualityList: document.querySelector("#insightQualityList"),
  insightTrend: document.querySelector("#insightTrend"),
  insightTrendNote: document.querySelector("#insightTrendNote"),
  loadTrend: document.querySelector("#loadTrendButton")
};

const iqEls = {
  chat: document.querySelector("#iqChat"),
  toggle: document.querySelector("#iqToggle"),
  panel: document.querySelector("#iqPanel"),
  close: document.querySelector("#iqClose"),
  messages: document.querySelector("#iqMessages"),
  form: document.querySelector("#iqForm"),
  input: document.querySelector("#iqInput")
};

function setKpiStatus(message, type = "") {
  kpiEls.status.textContent = message;
  kpiEls.status.classList.toggle("error", type === "error");
  kpiEls.status.classList.toggle("success", type === "success");
}

function showLocalServerRequired() {
  setKpiStatus(`ต้องเปิดผ่าน ${LOCAL_MONITOR_URL} เพื่อให้ JavaScript เรียก Backend API ได้`, "error");
  if (kpiEls.servicePlanMenu) {
    kpiEls.servicePlanMenu.innerHTML = '<p class="mega-loading">กรุณารัน server.py แล้วเปิดผ่าน http://127.0.0.1:4173/</p>';
  }
  if (kpiEls.tableBody) {
    kpiEls.tableBody.innerHTML = '<tr><td colspan="7">เปิดไฟล์ตรงจากเครื่องไม่ได้ ต้องเปิดผ่าน backend server: http://127.0.0.1:4173/</td></tr>';
  }
  [kpiEls.load, kpiEls.processAll, kpiEls.checkServicePlan, kpiEls.exportCsv, kpiEls.loadTrend].forEach((button) => {
    if (button) button.disabled = true;
  });
}

function localApiPath(kind, path) {
  return `/api/${kind}/${path.replace(/^\/+/, "")}`;
}

// Snapshot fallback — เมื่อเรียก proxy ไม่ได้ (ออนไลน์บน Vercel เข้า HDC จาก IP ตปท.ไม่ได้)
// อ่านข้อมูลที่ดึงไว้ล่วงหน้าจากเครื่อง IP ไทย (สร้างด้วย scripts/snapshot.mjs)
let snapshotManifestPromise = null;
function loadSnapshotManifest() {
  if (!snapshotManifestPromise) {
    snapshotManifestPromise = fetch("data/snapshot/manifest.json", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null);
  }
  return snapshotManifestPromise;
}

async function getSnapshot(kind, path) {
  const manifest = await loadSnapshotManifest();
  const file = manifest?.entries?.[`${kind} ${path}`];
  if (!file) return null;
  try {
    const response = await fetch(`data/snapshot/${file}`, { cache: "no-store" });
    return response.ok ? await response.json() : null;
  } catch (_error) {
    return null;
  }
}

// เปิดในเครื่องไทย (server.py) -> proxy เข้า HDC ได้ = ข้อมูลสด
// เปิดออนไลน์ (Vercel) -> proxy เข้า HDC ไม่ได้และ "ช้ามาก" กว่าจะ timeout เป็น 502
//   จึงข้าม proxy ไปอ่าน snapshot ตรงๆ ให้โหลดไว
const IS_LOCAL = ["127.0.0.1", "localhost"].includes(location.hostname);

async function fetchProxy(kind, path, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(localApiPath(kind, path), {
      cache: "no-store",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function hdcGet(kind, path) {
  if (IS_LOCAL) {
    // ในเครื่องไทย: เอาข้อมูลสดจาก proxy ก่อน, ถ้าล้มค่อย fallback snapshot
    try {
      return await fetchProxy(kind, path, 15000);
    } catch (proxyError) {
      const snapshot = await getSnapshot(kind, path);
      if (snapshot) return snapshot;
      throw proxyError;
    }
  }
  // ออนไลน์: ใช้ snapshot ที่ดึงจากเครื่องไทยไว้ล่วงหน้า (ไว ไม่ต้องรอ proxy ที่ยังไงก็ล้ม)
  const snapshot = await getSnapshot(kind, path);
  if (snapshot) return snapshot;
  // path ที่ไม่มีใน snapshot (เช่นเปลี่ยนปี/รายงานนอกชุด) -> ลอง proxy แบบมี timeout สั้น
  return await fetchProxy(kind, path, 8000);
}

function optionText(item) {
  return item.name || item.text || item.code_name || item.value || item.code;
}

function isStandardDataMode() {
  return kpiState.mode === "standard" || kpiState.mode === "service-plan";
}

function cleanServicePlanName(value) {
  return String(value || "")
    .replace(/^ข้อมูลเพื่อตอบสนอง\s*Service Plan\s*/i, "")
    .replace(/^สาขา\s*/i, "")
    .trim();
}

function catalogOptionText(item) {
  const label = optionText(item);
  if (kpiState.mode === "service-plan") return cleanServicePlanName(label);
  return item.parentName ? `${item.parentName}: ${label}` : label;
}

function flattenStandardSubcatalogs(catalogs) {
  return (catalogs || []).flatMap((catalog) => (
    (catalog.sub_menu || []).map((subcatalog) => ({
      ...subcatalog,
      parentCode: catalog.code,
      parentName: catalog.name
    }))
  ));
}

function setOptions(select, rows, getValue, getLabel, placeholder = "") {
  select.innerHTML = "";
  if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
  }
  rows.forEach((row) => {
    const option = document.createElement("option");
    option.value = getValue(row);
    option.textContent = getLabel(row);
    select.appendChild(option);
  });
}

function getSelectedBudgetYear() {
  if (isStandardDataMode()) return kpiEls.year.value || "2569";
  const option = kpiEls.year.options[kpiEls.year.selectedIndex];
  return option?.dataset.byear || option?.textContent || "2569";
}

function normalizeUnitName(value) {
  return String(value || "")
    .replace(/^\d+\s*-\s*/, "")
    .replace(/\s+/g, "")
    .trim();
}

function isAllowedServiceUnitName(name) {
  const normalized = normalizeUnitName(name);
  return ALLOWED_SERVICE_UNITS.some((unit) => {
    const names = [unit.name, ...(unit.aliases || [])].map(normalizeUnitName);
    return names.includes(normalized);
  });
}

function isAllowedServiceUnit(unit) {
  const code = String(unit?.code || unit?.a_code || "").trim();
  return ALLOWED_SERVICE_UNIT_CODES.has(code) || isAllowedServiceUnitName(unit?.name || unit?.code_name || unit?.a_name);
}

function filterAllowedHospitals(hospitals) {
  return ALLOWED_SERVICE_UNITS
    .map((allowed) => {
      const found = hospitals.find((hospital) => (
        String(hospital.code) === allowed.code || isAllowedServiceUnitName(hospital.name) || isAllowedServiceUnitName(hospital.code_name)
      ));
      return {
        ...(found || {}),
        code: allowed.code,
        name: allowed.name,
        code_name: `${allowed.code} - ${allowed.name}`
      };
    });
}

function getHospitalCodes() {
  return new Set(kpiState.hospitals.map((hospital) => String(hospital.code)));
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
  const preferred = ["F3", "F1", "ratio", "percent", "rate"];
  for (const key of preferred) {
    const value = toNumber(row[key]);
    if (value !== null) return value;
  }
  const formulaKey = Object.keys(row).find((key) => /^F\d+$/.test(key) && toNumber(row[key]) !== null);
  if (formulaKey) return toNumber(row[formulaKey]);
  if (target && result !== null) return (result / target) * 100;
  return null;
}

function normalizeKpiRow(row) {
  const target = findValueByPrefix(row, "target") ?? toNumber(row.c);
  const result = findValueByPrefix(row, "result") ?? toNumber(row.b);
  const ratio = getRatio(row, target, result);
  const [codeFromName, nameFromName] = String(row.a_name || "").split(/:(.*)/s);
  return {
    code: String(row.a_code || codeFromName || "").trim(),
    name: String(nameFromName || row.a_name || "").trim(),
    target,
    result,
    ratio,
    raw: row
  };
}

function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return Number(value).toLocaleString("th-TH", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function ratioClass(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (value < 50) return "danger";
  if (value < 80) return "warn";
  return "";
}

function applyUnitFilter(rows) {
  const selected = kpiEls.unit.value;
  if (!selected || selected === "ALL") return rows;
  return rows.filter((row) => row.code === selected);
}

function summarizeRows(rows) {
  const target = rows.reduce((sum, row) => sum + (row.target || 0), 0);
  const result = rows.reduce((sum, row) => sum + (row.result || 0), 0);
  const ratios = rows.map((row) => row.ratio).filter((value) => Number.isFinite(value));
  const ratio = target > 0 ? (result / target) * 100 : ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null;
  const gap = target || result ? result - target : null;
  return { target, result, gap, ratio };
}

function rowGap(row) {
  if (row.target === null || row.target === undefined || row.result === null || row.result === undefined) return null;
  return row.result - row.target;
}

function gapClass(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (value < 0) return "danger";
  if (value > 0) return "success";
  return "";
}

function formatGap(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  if (value < 0) return `ขาด ${formatNumber(Math.abs(value))}`;
  if (value > 0) return `เกิน ${formatNumber(value)}`;
  return "พอดีเป้า";
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function renderInsightList(element, rows, direction) {
  if (!element) return;
  if (!rows.length) {
    element.innerHTML = '<li class="insight-empty">ยังไม่มี ratio สำหรับจัดอันดับ</li>';
    return;
  }

  element.innerHTML = rows.map((row, index) => `
    <li>
      <span>${index + 1}. ${row.name || row.code}</span>
      <strong class="${ratioClass(row.ratio)}">${formatNumber(row.ratio, 2)}%</strong>
    </li>
  `).join("");
}

function buildQualityWarnings(rows, summary) {
  if (!rows.length) return ["ยังไม่มีข้อมูลรายหน่วยบริการ"];
  const warnings = [];
  const zeroTargets = rows.filter((row) => row.target === 0 && (row.result || 0) > 0).length;
  const missingRatios = rows.filter((row) => !Number.isFinite(row.ratio)).length;
  const missingTargets = rows.filter((row) => row.target === null || row.target === undefined).length;
  const targets = rows.map((row) => row.target).filter((value) => Number.isFinite(value) && value > 0);
  const targetMedian = median(targets);
  const highDenominator = targetMedian
    ? rows.filter((row) => Number.isFinite(row.target) && row.target > targetMedian * 2.5).length
    : 0;

  if (zeroTargets) warnings.push(`มี ${formatNumber(zeroTargets)} หน่วยที่ผลงานมีค่าแต่เป้าหมายเป็นศูนย์`);
  if (missingRatios) warnings.push(`มี ${formatNumber(missingRatios)} หน่วยที่ยังคำนวณร้อยละไม่ได้`);
  if (missingTargets) warnings.push(`มี ${formatNumber(missingTargets)} หน่วยที่ไม่พบ denominator/target`);
  if (highDenominator) warnings.push(`มี ${formatNumber(highDenominator)} หน่วยที่ denominator สูงกว่าค่ากลางมาก ควรตรวจ TYPEAREA/DISCHARGE`);
  if (summary.target === 0 && summary.result > 0) warnings.push("เป้าหมายรวมเป็นศูนย์แต่มีผลงาน ควรตรวจแฟ้ม PERSON/SERVICE");
  if (!warnings.length) warnings.push("ไม่พบสัญญาณผิดปกติจาก target/result/rate ในรายงานนี้");
  return warnings.slice(0, 4);
}

function renderQualityWarnings(rows, summary) {
  if (!kpiEls.insightQualityList) return;
  const warnings = buildQualityWarnings(rows, summary);
  kpiEls.insightQualityList.innerHTML = warnings.map((warning) => `<li><span>${warning}</span></li>`).join("");
}

function renderInsightPanel(rows, summary) {
  if (!kpiEls.insightPanel) return;

  if (kpiEls.insightGap) kpiEls.insightGap.textContent = formatGap(summary.gap);
  if (kpiEls.insightGapNote) {
    const ratioText = summary.ratio === null ? "ยังไม่มีร้อยละ" : `ร้อยละรวม ${formatNumber(summary.ratio, 2)}%`;
    kpiEls.insightGapNote.textContent = `${formatNumber(rows.length)} หน่วยบริการ | ${ratioText}`;
  }

  const ranked = rows
    .filter((row) => Number.isFinite(row.ratio))
    .sort((a, b) => a.ratio - b.ratio);
  renderInsightList(kpiEls.insightLowList, ranked.slice(0, 3), "low");
  renderInsightList(kpiEls.insightHighList, [...ranked].reverse().slice(0, 3), "high");
  renderQualityWarnings(rows, summary);
}

async function getTrendProviderResponse(reportCode, budgetYear) {
  const path = buildProviderDataPath(reportCode, budgetYear);
  const snapshot = await getSnapshot("hdc", path);
  if (snapshot) return snapshot;
  if (!IS_LOCAL) return null;
  try {
    return await fetchProxy("hdc", path, 15000);
  } catch (_error) {
    return null;
  }
}

function trendYears() {
  const selected = Number(getSelectedBudgetYear());
  const current = Number.isFinite(selected) ? selected : new Date().getFullYear() + 543;
  return [current, current - 1, current - 2, current - 3, current - 4];
}

function filterTrendRows(rows) {
  const selected = kpiEls.unit.value;
  if (!selected || selected === "ALL") return rows;
  return rows.filter((row) => row.code === selected);
}

async function loadTrendSummary() {
  const report = getCurrentReport();
  if (!report?.report_code || !kpiEls.loadTrend) return;

  kpiEls.loadTrend.disabled = true;
  if (kpiEls.insightTrend) kpiEls.insightTrend.textContent = "กำลังคำนวณ";
  if (kpiEls.insightTrendNote) kpiEls.insightTrendNote.textContent = "ตรวจ snapshot และข้อมูลสดย้อนหลัง";

  const points = [];
  for (const year of trendYears()) {
    const response = await getTrendProviderResponse(report.report_code, String(year));
    if (!response) continue;
    try {
      const { rows } = normalizeProviderRowsResponse(response);
      const summary = summarizeRows(filterTrendRows(rows));
      if (Number.isFinite(summary.ratio)) {
        points.push({ year, ratio: summary.ratio });
      }
    } catch (_error) {
      // ข้ามปีที่ HDC ต้นทางไม่มีโครงข้อมูลแบบ provider
    }
  }

  if (!points.length) {
    if (kpiEls.insightTrend) kpiEls.insightTrend.textContent = "-";
    if (kpiEls.insightTrendNote) kpiEls.insightTrendNote.textContent = "ยังไม่มี snapshot หรือข้อมูลสดย้อนหลังสำหรับรายงานนี้";
    kpiEls.loadTrend.disabled = false;
    return;
  }

  const ordered = points.sort((a, b) => b.year - a.year);
  const latest = ordered[0];
  const previous = ordered[1];
  if (kpiEls.insightTrend) {
    kpiEls.insightTrend.textContent = previous
      ? `${latest.ratio >= previous.ratio ? "เพิ่ม" : "ลด"} ${formatNumber(Math.abs(latest.ratio - previous.ratio), 2)} จุด`
      : `${formatNumber(latest.ratio, 2)}%`;
  }
  if (kpiEls.insightTrendNote) {
    kpiEls.insightTrendNote.textContent = ordered
      .map((point) => `${point.year}: ${formatNumber(point.ratio, 2)}%`)
      .join(" | ");
  }
  kpiEls.loadTrend.disabled = false;
}

function resetTrendInsight() {
  if (kpiEls.insightTrend) kpiEls.insightTrend.textContent = "-";
  if (kpiEls.insightTrendNote) kpiEls.insightTrendNote.textContent = "พร้อมคำนวณเมื่อเลือกตัวชี้วัด";
  if (kpiEls.loadTrend) kpiEls.loadTrend.disabled = false;
}

function renderCurrentRows() {
  const rows = applyUnitFilter(kpiState.currentRows);
  const summary = summarizeRows(rows);

  kpiEls.metricUnits.textContent = formatNumber(rows.length);
  kpiEls.metricTarget.textContent = formatNumber(summary.target);
  kpiEls.metricResult.textContent = formatNumber(summary.result);
  kpiEls.metricRatio.textContent = summary.ratio === null ? "-" : `${formatNumber(summary.ratio, 2)}%`;
  if (kpiEls.metricGap) kpiEls.metricGap.textContent = formatGap(summary.gap);
  renderInsightPanel(rows, summary);

  if (!rows.length) {
    kpiEls.tableBody.innerHTML = '<tr><td colspan="7">ไม่พบข้อมูลรายหน่วยบริการตามเงื่อนไขที่เลือก</td></tr>';
    return;
  }

  kpiEls.tableBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.code}</td>
      <td>${row.name || row.code}</td>
      <td>${formatNumber(row.target)}</td>
      <td>${formatNumber(row.result)}</td>
      <td><span class="gap-pill ${gapClass(rowGap(row))}">${formatGap(rowGap(row))}</span></td>
      <td><span class="ratio-pill ${ratioClass(row.ratio)}">${row.ratio === null ? "-" : `${formatNumber(row.ratio, 2)}%`}</span></td>
      <td>${kpiState.lastDateCom || "-"}</td>
    </tr>
  `).join("");
}

function getCurrentReport() {
  return kpiState.reports.find((report) => String(report.report_code) === kpiEls.report.value);
}

function buildProviderDataPath(reportCode, budgetYear = getSelectedBudgetYear()) {
  const params = new URLSearchParams({
    table_display: "provider",
    year: budgetYear,
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
    custom: "[]"
  });
  return `reports/province/data/${reportCode}?${params.toString()}`;
}

function normalizeProviderRowsResponse(response) {
  if (!response.ok) throw new Error(response.error || "HDC API error");
  const source = response.rows?.[0] || {};
  const allowedCodes = getHospitalCodes();
  const data = Array.isArray(source.data) ? source.data : [];
  const rows = data
    .map(normalizeKpiRow)
    .filter((row) => !allowedCodes.size || allowedCodes.has(row.code) || isAllowedServiceUnit(row));
  return { rows, dateCom: source.datecom || "", label: source.label || "" };
}

async function fetchProviderRows(reportCode, budgetYear = getSelectedBudgetYear()) {
  const response = await hdcGet("hdc", buildProviderDataPath(reportCode, budgetYear));
  return normalizeProviderRowsResponse(response);
}

async function loadCurrentKpi() {
  const report = getCurrentReport();
  if (!report?.report_code) return;

  kpiEls.load.disabled = true;
  kpiState.currentReportName = report.report_name;
  resetTrendInsight();
  setKpiStatus(`กำลังโหลดข้อมูลรายหน่วยบริการ: ${report.report_name}`);
  try {
    const { rows, dateCom } = await fetchProviderRows(report.report_code);
    kpiState.currentRows = rows;
    kpiState.lastDateCom = dateCom;
    renderCurrentRows();
    const reportCountNote = kpiState.reportSkippedCount
      ? ` | รายงานที่ดึงข้อมูลได้ ${kpiState.reports.length}/${kpiState.reportSourceCount} (ไม่มี report code ${kpiState.reportSkippedCount})`
      : "";
    setKpiStatus(`โหลดข้อมูลสดจาก HDC Public สำเร็จ ${rows.length} หน่วยบริการ (${dateCom || "ไม่ระบุวันที่ประมวลผล"})${reportCountNote}`, "success");
  } catch (error) {
    kpiState.currentRows = [];
    renderCurrentRows();
    setKpiStatus(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`, "error");
  } finally {
    kpiEls.load.disabled = false;
  }
}

function fillYearsForCatalog(catalog) {
  if (isStandardDataMode()) {
    const currentYear = new Date().getFullYear() + 543;
    kpiEls.year.innerHTML = "";
    [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      kpiEls.year.appendChild(option);
    });
    return;
  }
  const years = Array.isArray(catalog?.sub_menu) ? catalog.sub_menu : [];
  setOptions(
    kpiEls.year,
    years,
    (year) => year.code,
    (year) => String(year.name)
  );
  if (!years.length) {
    kpiEls.year.innerHTML = '<option value="2026" data-byear="2569">2569</option>';
  } else {
    Array.from(kpiEls.year.options).forEach((option, index) => {
      option.dataset.byear = String(years[index].name);
    });
  }
}

// system/subcatalog/reports ตอบเป็นต้นไม้ — node กลุ่มมี children ซ้อนรายงานอยู่ข้างใน
// recurse ลงทุกชั้นไม่งั้นรายงานที่ซ้อนอยู่ใต้กลุ่มจะหายไปจาก dropdown ทั้งหมด
// ต้องตรงกับ flattenReportTree ใน scripts/snapshot.mjs เพื่อให้ crawler กับหน้าเว็บเห็นชุดรายงานตรงกัน
function flattenReportTree(rows, groupPath = []) {
  const leaves = [];
  for (const node of rows || []) {
    if (node.report_code) leaves.push({ ...node, report_group: groupPath.join(" > ") || null });
    if (Array.isArray(node.children) && node.children.length) {
      const label = String(node.label || node.report_name || "").trim();
      leaves.push(...flattenReportTree(node.children, label ? [...groupPath, label] : groupPath));
    }
  }
  return leaves;
}

function normalizeReports(rows) {
  const seen = new Set();
  return flattenReportTree(rows)
    .filter((report) => report.report_code && report.active !== false)
    .filter((report) => {
      const code = String(report.report_code).trim();
      if (seen.has(code)) return false;
      seen.add(code);
      return true;
    })
    .map((report) => ({
      ...report,
      report_name: report.report_name || report.report_names || report.title_name || report.label
    }));
}

// ใช้กับ lookup/kpi/subcatalog (โหมด KPI) — endpoint นี้ส่งมาแบบ flat ไม่มี children ซ้อน
// แต่ใช้ countReportItems เดิมไว้เผื่อมี children ในอนาคต
function countReportItems(rows) {
  let total = 0;

  function visit(report) {
    total += 1;
    (report.children || []).forEach(visit);
  }

  (rows || []).forEach(visit);
  return total;
}

async function fetchStandardReports(subcatalogId) {
  const response = await hdcGet("center", `system/subcatalog/reports?subcatalogId=${encodeURIComponent(subcatalogId)}`);
  return normalizeReports(response.rows);
}

async function loadKpiReports() {
  const catalogId = kpiEls.catalog.value;
  const standardMode = isStandardDataMode();
  setKpiStatus(standardMode ? "กำลังโหลดรายการรายงานมาตรฐาน..." : "กำลังโหลดรายการ KPI...");
  let sourceReportCount = 0;
  if (standardMode) {
    const response = await hdcGet("center", `system/subcatalog/reports?subcatalogId=${encodeURIComponent(catalogId)}`);
    sourceReportCount = flattenReportTree(response.rows || []).length;
    kpiState.reports = normalizeReports(response.rows);
  } else {
    const year = kpiEls.year.value || "2026";
    const response = await hdcGet("hdc", `lookup/kpi/subcatalog?catalogId=${encodeURIComponent(catalogId)}&year=${encodeURIComponent(year)}`);
    sourceReportCount = countReportItems(response.rows || []);
    kpiState.reports = normalizeReports(response.rows);
  }
  kpiState.reportSourceCount = sourceReportCount;
  kpiState.reportSkippedCount = Math.max(sourceReportCount - kpiState.reports.length, 0);
  setOptions(
    kpiEls.report,
    kpiState.reports,
    (report) => report.report_code,
    (report) => `${report.weight || report.no || ""} ${report.report_group ? report.report_group + " > " : ""}${report.report_name}`.trim(),
    "เลือกรายงาน"
  );
  if (kpiState.reports.length) kpiEls.report.selectedIndex = 1;
  kpiEls.kpiCatalogCount.textContent = formatNumber(kpiState.reports.length);
  const skippedReportCount = kpiState.reportSkippedCount;
  setKpiStatus(
    skippedReportCount
      ? `พบรายการจาก HDC ${sourceReportCount} รายการ ใช้งานได้ ${kpiState.reports.length} รายการ (ไม่มี report code ${skippedReportCount} รายการ)`
      : `พบรายงานที่มี report code ${kpiState.reports.length} รายการ`,
    "success"
  );
  if (kpiState.reports.length) {
    await loadCurrentKpi();
  } else {
    kpiState.currentRows = [];
    kpiState.currentReportName = "";
    resetTrendInsight();
    renderCurrentRows();
  }
}

async function loadInitialKpiData() {
  if (!kpiEls.catalog) return;

  try {
    const [catalogResponse, standardCatalogResponse, hospitalResponse] = await Promise.all([
      hdcGet("hdc", "lookup/kpi/catalog"),
      hdcGet("hdc", "lookup/standard/catalog"),
      hdcGet("hdc", `lookup/hospital?provinceCode=${HDC_CONFIG.provinceCode}&districtCode=${HDC_CONFIG.districtCode}&subdistrictCode=&servicePlanLV=&byear=&isRegis=`)
    ]);

    kpiState.catalogs = catalogResponse.rows || [];
    kpiState.standardCatalogs = standardCatalogResponse.rows || [];
    kpiState.standardSubcatalogs = flattenStandardSubcatalogs(kpiState.standardCatalogs);
    const servicePlanCatalog = kpiState.standardCatalogs.find((catalog) => String(catalog.name).includes("Service Plan"));
    const preventionCatalog = kpiState.standardCatalogs.find((catalog) => String(catalog.name).includes("ส่งเสริมป้องกัน"));
    kpiState.servicePlanSubcatalogs = (servicePlanCatalog?.sub_menu || []).map((item) => ({
      ...item,
      parentCode: servicePlanCatalog?.code,
      parentName: servicePlanCatalog?.name
    }));
    kpiState.preventionSubcatalogs = (preventionCatalog?.sub_menu || []).map((item) => ({
      ...item,
      parentCode: preventionCatalog?.code,
      parentName: preventionCatalog?.name
    }));
    kpiState.hospitals = filterAllowedHospitals(hospitalResponse.rows || []);

    renderServicePlanMenu();
    renderPreventionMenu();
    renderCatalogOptions();
    setOptions(
      kpiEls.unit,
      kpiState.hospitals,
      (hospital) => hospital.code,
      (hospital) => hospital.code_name || `${hospital.code} - ${hospital.name}`,
      "ทุกหน่วยบริการตามบัญชี สสอ.ปากช่อง"
    );
    kpiEls.unit.options[0].value = "ALL";

    kpiEls.serviceUnitCount.textContent = formatNumber(kpiState.hospitals.length);
    setKpiStatus(`เชื่อมต่อ HDC สำเร็จ กรองเหลือหน่วยบริการตามบัญชี สสอ.ปากช่อง ${kpiState.hospitals.length} แห่ง`, "success");
    await loadKpiReports();
  } catch (error) {
    kpiEls.tableBody.innerHTML = '<tr><td colspan="7">เชื่อมต่อ HDC API ไม่สำเร็จ</td></tr>';
    setKpiStatus(`เชื่อมต่อ HDC API ไม่สำเร็จ: ${error.message}`, "error");
  }
}

function getCatalogRowsForMode() {
  if (kpiState.mode === "standard") return kpiState.standardSubcatalogs;
  if (kpiState.mode === "service-plan") return kpiState.servicePlanSubcatalogs;
  return kpiState.catalogs;
}

function renderStandardLinkMenu(container, rows, iconName, mode = "standard", cleanLabel = false) {
  if (!container) return;
  container.replaceChildren();

  const menuRows = rows.filter((item) => item.code);
  if (!menuRows.length) {
    const message = document.createElement("p");
    message.className = "mega-loading";
    message.textContent = "ไม่พบรายการจาก HDC";
    container.appendChild(message);
    return;
  }

  menuRows.forEach((item) => {
    const link = document.createElement("a");
    link.href = "#kpiDataPanel";
    link.dataset.standardSubcatalog = item.code;
    link.dataset.mode = mode;

    const icon = document.createElement("span");
    icon.dataset.icon = iconName;
    renderIcon(icon);

    const label = document.createElement("span");
    label.textContent = cleanLabel ? cleanServicePlanName(optionText(item)) : optionText(item);

    link.append(icon, label);
    container.appendChild(link);
  });
}

function renderServicePlanMenu() {
  renderStandardLinkMenu(kpiEls.servicePlanMenu, kpiState.servicePlanSubcatalogs, "file", "service-plan", true);
}

function renderPreventionMenu() {
  renderStandardLinkMenu(kpiEls.preventionMenu, kpiState.preventionSubcatalogs, "shield", "standard");
}

function renderCatalogOptions() {
  kpiState.mode = kpiEls.mode?.value || "standard";
  const rows = getCatalogRowsForMode();
  setOptions(kpiEls.catalog, rows, (catalog) => catalog.code, catalogOptionText);
  if (isStandardDataMode()) {
    const agingIndex = rows.findIndex((row) => row.code === DEFAULT_STANDARD_SUBCATALOG);
    if (agingIndex >= 0) kpiEls.catalog.selectedIndex = agingIndex;
  }
  const selected = rows.find((item) => String(item.code) === kpiEls.catalog.value) || rows[0];
  fillYearsForCatalog(selected);
}

async function processAllKpis() {
  const reports = kpiState.reports.filter((report) => report.report_code);
  if (!reports.length) return;

  kpiEls.processAll.disabled = true;
  kpiState.allSummary = [];
  kpiEls.allSummary.hidden = false;
  kpiEls.allTableBody.innerHTML = "";

  for (let index = 0; index < reports.length; index += 1) {
    const report = reports[index];
    setKpiStatus(`กำลังประมวลผล KPI ${index + 1}/${reports.length}: ${report.report_name}`);
    try {
      const { rows } = await fetchProviderRows(report.report_code);
      const summary = summarizeRows(rows);
      kpiState.allSummary.push({
        name: report.report_name,
        units: rows.length,
        target: summary.target,
        result: summary.result,
        gap: summary.gap,
        ratio: summary.ratio,
        status: "สำเร็จ"
      });
    } catch (error) {
      kpiState.allSummary.push({
        name: report.report_name,
        units: 0,
        target: null,
        result: null,
        gap: null,
        ratio: null,
        status: "ไม่สำเร็จ"
      });
    }
    renderAllSummary();
    kpiEls.kpiProcessedCount.textContent = formatNumber(kpiState.allSummary.filter((item) => item.status === "สำเร็จ").length);
  }

  const successCount = kpiState.allSummary.filter((item) => item.status === "สำเร็จ").length;
  const failCount = reports.length - successCount;
  setKpiStatus(`ประมวลผลครบ ${reports.length} รายการ: สำเร็จ ${successCount} / ไม่สำเร็จ ${failCount}`, failCount ? "" : "success");
  kpiEls.processAll.disabled = false;
}

function renderAllSummary() {
  kpiEls.allTableBody.innerHTML = kpiState.allSummary.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${formatNumber(item.units)}</td>
      <td>${formatNumber(item.target)}</td>
      <td>${formatNumber(item.result)}</td>
      <td><span class="gap-pill ${gapClass(item.gap)}">${formatGap(item.gap)}</span></td>
      <td><span class="ratio-pill ${ratioClass(item.ratio)}">${item.ratio === null ? "-" : `${formatNumber(item.ratio, 2)}%`}</span></td>
      <td>${item.status}</td>
    </tr>
  `).join("");
}

function coverageStatusClass(item) {
  if (item.failed > 0) return "danger";
  if (item.noData > 0) return "warn";
  return "";
}

function coverageStatusText(item) {
  if (!item.totalReports) return "ไม่มีรายงาน";
  if (item.failed > 0) return "API ไม่สำเร็จ";
  if (item.noData > 0) return "ขาดบางข้อ";
  return "ครบ";
}

function renderServicePlanCoverage() {
  if (!kpiEls.coverage || !kpiEls.coverageTableBody) return;
  kpiEls.coverage.hidden = false;

  const totals = kpiState.servicePlanCoverage.reduce((acc, item) => {
    acc.reports += item.totalReports;
    acc.withData += item.withData;
    acc.noData += item.noData;
    acc.failed += item.failed;
    return acc;
  }, { reports: 0, withData: 0, noData: 0, failed: 0 });

  if (kpiEls.coverageTotal) {
    kpiEls.coverageTotal.textContent = `รวม ${formatNumber(totals.withData)}/${formatNumber(totals.reports)} รายงานมีข้อมูล`;
  }

  kpiEls.coverageTableBody.innerHTML = kpiState.servicePlanCoverage.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${formatNumber(item.totalReports)}</td>
      <td>${formatNumber(item.withData)}</td>
      <td>${formatNumber(item.noData)}</td>
      <td>${formatNumber(item.failed)}</td>
      <td><span class="coverage-status ${coverageStatusClass(item)}">${coverageStatusText(item)}</span></td>
    </tr>
  `).join("");
}

async function checkAllServicePlans() {
  const plans = kpiState.servicePlanSubcatalogs.filter((item) => item.code);
  if (!plans.length) return;

  kpiEls.checkServicePlan.disabled = true;
  kpiEls.processAll.disabled = true;
  kpiState.servicePlanCoverage = [];
  if (kpiEls.coverageTableBody) kpiEls.coverageTableBody.innerHTML = "";
  if (kpiEls.coverageTotal) kpiEls.coverageTotal.textContent = "กำลังตรวจ...";
  if (kpiEls.coverage) kpiEls.coverage.hidden = false;

  let checkedReports = 0;
  let totalReports = 0;

  for (let planIndex = 0; planIndex < plans.length; planIndex += 1) {
    const plan = plans[planIndex];
    const summary = {
      code: plan.code,
      name: optionText(plan),
      totalReports: 0,
      withData: 0,
      noData: 0,
      failed: 0
    };

    try {
      const reports = await fetchStandardReports(plan.code);
      summary.totalReports = reports.length;
      totalReports += reports.length;
      setKpiStatus(`กำลังตรวจ ${planIndex + 1}/${plans.length}: ${summary.name} (${reports.length} รายงาน)`);

      for (let reportIndex = 0; reportIndex < reports.length; reportIndex += 1) {
        const report = reports[reportIndex];
        checkedReports += 1;
        setKpiStatus(`กำลังตรวจข้อมูล ${checkedReports}/${totalReports || checkedReports}: ${summary.name} - ${report.report_name}`);

        try {
          const { rows } = await fetchProviderRows(report.report_code);
          if (rows.length > 0) {
            summary.withData += 1;
          } else {
            summary.noData += 1;
          }
        } catch (error) {
          summary.failed += 1;
        }
      }
    } catch (error) {
      summary.failed += 1;
    }

    kpiState.servicePlanCoverage.push(summary);
    renderServicePlanCoverage();
  }

  const okPlans = kpiState.servicePlanCoverage.filter((item) => item.totalReports && item.noData === 0 && item.failed === 0).length;
  const totalOkReports = kpiState.servicePlanCoverage.reduce((sum, item) => sum + item.withData, 0);
  const totalAllReports = kpiState.servicePlanCoverage.reduce((sum, item) => sum + item.totalReports, 0);
  setKpiStatus(`ตรวจข้อมูลสดครบทุก Service Plan แล้ว: สาขาครบ ${okPlans}/${plans.length}, รายงานมีข้อมูล ${totalOkReports}/${totalAllReports}`, okPlans === plans.length ? "success" : "");

  kpiEls.checkServicePlan.disabled = false;
  kpiEls.processAll.disabled = false;
}

function exportCsv() {
  const rows = applyUnitFilter(kpiState.currentRows);
  if (!rows.length && !kpiState.allSummary.length) return;

  const useSummary = !rows.length;
  const header = useSummary
    ? ["kpi", "units", "target", "result", "gap", "ratio", "status"]
    : ["report", "hospcode", "hospital", "target", "result", "gap", "ratio", "datecom"];
  const body = useSummary
    ? kpiState.allSummary.map((item) => [item.name, item.units, item.target, item.result, item.gap, item.ratio, item.status])
    : rows.map((row) => [kpiState.currentReportName, row.code, row.name, row.target, row.result, rowGap(row), row.ratio, kpiState.lastDateCom]);

  const csv = [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = useSummary ? "pakchong-kpi-summary.csv" : "pakchong-kpi-provider.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function setIqOpen(open) {
  if (!iqEls.panel || !iqEls.toggle) return;
  iqEls.panel.hidden = !open;
  iqEls.chat?.classList.toggle("open", open);
  iqEls.toggle.setAttribute("aria-expanded", String(open));
  iqEls.toggle.querySelector(".iq-toggle-text").textContent = open ? "iQ กำลังเปิด" : "ถามข้อมูล KPI";
  if (open) {
    setTimeout(() => iqEls.input?.focus(), 50);
  }
}

function addIqMessage(text, sender = "bot") {
  if (!iqEls.messages) return null;
  const message = document.createElement("div");
  message.className = `iq-message ${sender}`;
  message.textContent = text;
  iqEls.messages.appendChild(message);
  iqEls.messages.scrollTop = iqEls.messages.scrollHeight;
  return message;
}

function getSelectedText(select) {
  return select?.selectedOptions?.[0]?.textContent?.trim() || "-";
}

function describeCurrentKpi() {
  const report = getSelectedText(kpiEls.report);
  const catalog = getSelectedText(kpiEls.catalog);
  const year = getSelectedText(kpiEls.year);
  const unit = getSelectedText(kpiEls.unit);
  const status = kpiEls.status?.textContent?.trim() || "-";
  const units = kpiEls.metricUnits?.textContent?.trim() || "-";
  const target = kpiEls.metricTarget?.textContent?.trim() || "-";
  const result = kpiEls.metricResult?.textContent?.trim() || "-";
  const ratio = kpiEls.metricRatio?.textContent?.trim() || "-";
  const gap = kpiEls.metricGap?.textContent?.trim() || "-";

  return `ตอนนี้กำลังดู ${report} หมวด ${catalog} ปีงบประมาณ ${year} หน่วยบริการ ${unit} พบข้อมูล ${units} แห่ง เป้าหมายรวม ${target} ผลงานรวม ${result} Gap ${gap} ร้อยละ ${ratio} สถานะล่าสุด: ${status}`;
}

function describeRank(direction) {
  const rows = applyUnitFilter(kpiState.currentRows)
    .filter((row) => Number.isFinite(row.ratio))
    .sort((a, b) => direction === "high" ? b.ratio - a.ratio : a.ratio - b.ratio)
    .slice(0, 3);

  if (!rows.length) return "ยังไม่มีข้อมูลรายหน่วยบริการให้จัดอันดับ กรุณาโหลดข้อมูลรายหน่วยก่อนครับ";

  const title = direction === "high" ? "หน่วยบริการที่ร้อยละสูงสุด" : "หน่วยบริการที่ควรติดตามก่อน";
  const detail = rows
    .map((row, index) => `${index + 1}. ${row.name} ${formatNumber(row.ratio, 2)}%`)
    .join(" | ");
  return `${title}: ${detail}`;
}

function describeServicePlanCoverage() {
  if (!kpiState.servicePlanCoverage.length) {
    return "ยังไม่ได้ตรวจครบทุก Service Plan ครับ กดปุ่ม ตรวจครบทุก Service Plan ก่อน แล้ว iQ จะสรุปสถานะครบ/ขาดให้ได้";
  }

  const totalPlans = kpiState.servicePlanCoverage.length;
  const completePlans = kpiState.servicePlanCoverage.filter((item) => item.totalReports && item.noData === 0 && item.failed === 0).length;
  const totalReports = kpiState.servicePlanCoverage.reduce((sum, item) => sum + item.totalReports, 0);
  const withData = kpiState.servicePlanCoverage.reduce((sum, item) => sum + item.withData, 0);
  const issues = kpiState.servicePlanCoverage
    .filter((item) => item.noData > 0 || item.failed > 0)
    .slice(0, 3)
    .map((item) => `${item.name} ไม่มีข้อมูล ${item.noData} / ไม่สำเร็จ ${item.failed}`)
    .join(" | ");

  return `ผลตรวจ Service Plan: ครบ ${completePlans}/${totalPlans} สาขา รายงานที่มีข้อมูล ${withData}/${totalReports} รายการ${issues ? ` จุดที่ควรดูต่อ: ${issues}` : ""}`;
}

function answerIq(question) {
  const text = question.trim().toLowerCase();

  if (!text) return "พิมพ์คำถามเกี่ยวกับ KPI/Service Plan ที่ต้องการดูได้เลยครับ";
  if ((text.includes("ครบ") || text.includes("ขาด")) && (text.includes("service") || text.includes("สาขา") || text.includes("ทั้งหมด"))) {
    return describeServicePlanCoverage();
  }
  if (text.includes("สรุป") || text.includes("ตอนนี้") || text.includes("ภาพรวม") || text.includes("summary")) {
    return describeCurrentKpi();
  }
  if (text.includes("ต่ำ") || text.includes("น้อย") || text.includes("แย่") || text.includes("ติดตาม")) {
    return describeRank("low");
  }
  if (text.includes("สูง") || text.includes("ดี") || text.includes("top")) {
    return describeRank("high");
  }
  if (text.includes("csv") || text.includes("export") || text.includes("ส่งออก")) {
    return "กดปุ่ม ส่งออก CSV เพื่อดาวน์โหลดข้อมูลรายหน่วยบริการที่กำลังแสดงอยู่ ถ้าประมวลผลทั้งหมดแล้ว ระบบจะส่งออกตารางสรุป KPI แทน";
  }
  if (text.includes("มอนิเตอร์") || text.includes("monitor") || text.includes("ดูข้อมูล") || text.includes("ใช้งาน")) {
    return "วิธีมอนิเตอร์: เลือกประเภทข้อมูล หมวด/สาขา ปีงบประมาณ รายงาน/ตัวชี้วัด และหน่วยบริการ จากนั้นกด โหลดข้อมูลรายหน่วย ตารางและการ์ดสรุปจะอัปเดตจาก HDC API";
  }
  if (text.includes("api") || text.includes("เชื่อมต่อ") || text.includes("fetch")) {
    return `หน้านี้ใช้ JavaScript Fetch API เรียก backend ที่ ${LOCAL_MONITOR_URL} แล้วให้ server.py proxy ไปยัง API สาธารณะที่หน้า HDC Public ใช้งานอยู่ ถ้าเปิดผ่าน file:// จะดึงข้อมูลไม่ได้`;
  }
  if (text.includes("iq") || text.includes("ชื่อ")) {
    return "ผมชื่อ iQ เป็นผู้ช่วยข้อมูล HDC ของ สสอ.ปากช่อง ช่วยสรุปและชี้จุดที่ควรติดตามจากข้อมูลบนหน้านี้ครับ";
  }

  return "ผมตอบจากข้อมูลที่กำลังแสดงบนหน้าจอนี้ได้ครับ ลองถามว่า สรุปข้อมูลตอนนี้, หน่วยไหนต่ำสุด, หน่วยไหนสูงสุด, วิธีมอนิเตอร์ หรือ ส่งออก CSV";
}

function buildKpiContext() {
  const parts = [];
  const report = getSelectedText(kpiEls.report);
  const catalog = getSelectedText(kpiEls.catalog);
  const year = getSelectedText(kpiEls.year);
  const unit = getSelectedText(kpiEls.unit);
  parts.push(`กำลังดู: ${report} | หมวด: ${catalog} | ปีงบ: ${year} | หน่วย: ${unit}`);

  const units = kpiEls.metricUnits?.textContent?.trim();
  const target = kpiEls.metricTarget?.textContent?.trim();
  const result = kpiEls.metricResult?.textContent?.trim();
  const ratio = kpiEls.metricRatio?.textContent?.trim();
  const gap = kpiEls.metricGap?.textContent?.trim();
  if (units && units !== "-") parts.push(`สรุป: ${units} หน่วย | เป้า ${target} | ผลงาน ${result} | Gap ${gap} | ร้อยละ ${ratio}`);

  const rows = kpiState.currentRows.filter((row) => Number.isFinite(row.ratio));
  if (rows.length) {
    const sorted = [...rows].sort((a, b) => b.ratio - a.ratio);
    parts.push("สูงสุด 3 อันดับ: " + sorted.slice(0, 3).map((r) => `${r.name} ${r.ratio.toFixed(1)}%`).join(" | "));
    parts.push("ต่ำสุด 3 อันดับ: " + sorted.slice(-3).reverse().map((r) => `${r.name} ${r.ratio.toFixed(1)}%`).join(" | "));
    const below = sorted.filter((r) => r.ratio < 80).length;
    parts.push(`หน่วยต่ำกว่า 80%: ${below} แห่ง`);
  }

  if (kpiState.servicePlanCoverage.length) {
    const ok = kpiState.servicePlanCoverage.filter((i) => i.noData === 0 && i.failed === 0).length;
    parts.push(`Service Plan ครบ: ${ok}/${kpiState.servicePlanCoverage.length} สาขา`);
  }

  return parts.join("\n");
}

async function askClaude(question) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context: buildKpiContext() }),
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || "Claude ไม่ตอบสนอง");
  return data.answer;
}

iqEls.toggle?.addEventListener("click", () => {
  setIqOpen(iqEls.panel?.hidden !== false);
});

iqEls.close?.addEventListener("click", () => {
  setIqOpen(false);
});

iqEls.chat?.addEventListener("click", (event) => {
  if (!event.target.closest("[data-iq-close]")) return;
  event.preventDefault();
  event.stopPropagation();
  setIqOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && iqEls.panel?.hidden === false) {
    setIqOpen(false);
  }
});

document.addEventListener("pointerdown", (event) => {
  if (iqEls.panel?.hidden !== false) return;
  if (iqEls.chat?.contains(event.target)) return;
  setIqOpen(false);
});

iqEls.form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = iqEls.input.value.trim();
  if (!question) return;
  addIqMessage(question, "user");
  iqEls.input.value = "";
  iqEls.input.disabled = true;
  const loading = addIqMessage("กำลังวิเคราะห์ข้อมูล…", "bot loading");
  try {
    const answer = await askClaude(question);
    loading?.remove();
    addIqMessage(answer, "bot");
  } catch (_err) {
    loading?.remove();
    addIqMessage(answerIq(question), "bot");
  } finally {
    iqEls.input.disabled = false;
    iqEls.input.focus();
  }
});

kpiEls.mode?.addEventListener("change", async () => {
  renderCatalogOptions();
  await loadKpiReports();
});

kpiEls.catalog?.addEventListener("change", async () => {
  const catalog = getCatalogRowsForMode().find((item) => String(item.code) === kpiEls.catalog.value);
  fillYearsForCatalog(catalog);
  await loadKpiReports();
});

kpiEls.year?.addEventListener("change", loadKpiReports);
kpiEls.report?.addEventListener("change", loadCurrentKpi);
kpiEls.unit?.addEventListener("change", renderCurrentRows);
kpiEls.load?.addEventListener("click", loadCurrentKpi);
kpiEls.processAll?.addEventListener("click", processAllKpis);
kpiEls.checkServicePlan?.addEventListener("click", checkAllServicePlans);
kpiEls.exportCsv?.addEventListener("click", exportCsv);
kpiEls.loadTrend?.addEventListener("click", loadTrendSummary);

document.addEventListener("click", async (event) => {
  const link = event.target.closest("[data-standard-subcatalog]");
  if (!link) return;
  event.preventDefault();

  setMega(false);
  const mode = link.dataset.mode || "standard";
  if (kpiEls.mode) kpiEls.mode.value = mode;
  renderCatalogOptions();
  const rows = getCatalogRowsForMode();
  if (!rows.length) {
    setKpiStatus("ยังโหลดรายการรายงานมาตรฐานไม่เสร็จ กรุณารอสักครู่");
    return;
  }

  kpiEls.catalog.value = link.dataset.standardSubcatalog;
  const selected = rows.find((item) => String(item.code) === kpiEls.catalog.value);
  if (!selected) {
    setKpiStatus("ไม่พบหัวข้อรายงานนี้ใน catalog ล่าสุดของ HDC", "error");
    return;
  }

  fillYearsForCatalog(selected);
  await loadKpiReports();
  document.querySelector("#kpiDataPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

if (window.location.protocol === "file:") {
  showLocalServerRequired();
} else {
  loadInitialKpiData();
}
