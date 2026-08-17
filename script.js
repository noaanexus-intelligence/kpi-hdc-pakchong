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
const APPROVED_KPI_DATA_URL = "data/kpi-rpst-approved.json";
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
  mode: "rpst-approved",
  catalogs: [],
  standardCatalogs: [],
  standardSubcatalogs: [],
  servicePlanSubcatalogs: [],
  preventionSubcatalogs: [],
  approvedCatalogs: [],
  approvedDefinitions: [],
  approvedMetadata: null,
  currentDefinition: null,
  currentChartSeries: [],
  currentFormulaSeries: [],
  currentSeriesField: "",
  reports: [],
  hospitals: [],
  currentRows: [],
  allSummary: [],
  servicePlanCoverage: [],
  reportSourceCount: 0,
  reportSkippedCount: 0,
  dataSource: "checking",
  snapshotGeneratedAt: "",
  syncAudit: null,
  lastDateCom: "",
  currentReportName: "",
  lastTrend: null
};

// แนวทาง hybrid: dashboard/insight/brief อ่านจาก snapshot เป็นหลัก (เร็ว/เสถียร ไม่รอ HDC ตอนเปิดหน้า)
// ตารางรายหน่วยตอนผู้ใช้กดดูพยายามดึงสดก่อนเสมอ ถ้าดึงไม่ได้ค่อย fallback มา snapshot
// เก็บสถานะไว้ที่นี่เพื่อแสดงเวลาอัปเดตและข้อความ fallback บนหน้าเว็บ (ดู scripts/README.md)
const dataStatus = {
  snapshotGeneratedAt: null,
  lastLiveFetchAt: null,
  lastTableSource: null // "live" | "snapshot-fallback" | null
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
  tableDataStatus: document.querySelector("#tableDataStatus"),
  tableBody: document.querySelector("#kpiTableBody"),
  allSummary: document.querySelector("#allKpiSummary"),
  allSummaryUnit: document.querySelector("#allSummaryUnitSelect"),
  allSummaryScope: document.querySelector("#allSummaryScope"),
  allTableBody: document.querySelector("#allKpiTableBody"),
  coverage: document.querySelector("#servicePlanCoverage"),
  coverageTableBody: document.querySelector("#servicePlanCoverageBody"),
  coverageTotal: document.querySelector("#coverageTotal"),
  sourceBadge: document.querySelector("#dataSourceBadge"),
  snapshotMeta: document.querySelector("#snapshotMeta"),
  syncAuditMeta: document.querySelector("#syncAuditMeta"),
  syncAuditCard: document.querySelector("#syncAuditCard"),
  syncAuditTitle: document.querySelector("#syncAuditTitle"),
  syncAuditDetail: document.querySelector("#syncAuditDetail"),
  syncAuditBadge: document.querySelector("#syncAuditBadge"),
  servicePlanMenu: document.querySelector("#servicePlanMenu"),
  preventionMenu: document.querySelector("#preventionMenu"),
  serviceUnitCount: document.querySelector("#serviceUnitCount"),
  kpiCatalogCount: document.querySelector("#kpiCatalogCount"),
  kpiProcessedCount: document.querySelector("#kpiProcessedCount"),
  metricUnits: document.querySelector("#metricUnits"),
  metricTargetLabel: document.querySelector("#metricTargetLabel"),
  metricTarget: document.querySelector("#metricTarget"),
  metricResultLabel: document.querySelector("#metricResultLabel"),
  metricResult: document.querySelector("#metricResult"),
  metricRatioLabel: document.querySelector("#metricRatioLabel"),
  metricRatio: document.querySelector("#metricRatio"),
  metricGapLabel: document.querySelector("#metricGapLabel"),
  metricGap: document.querySelector("#metricGap"),
  tableTargetLabel: document.querySelector("#tableTargetLabel"),
  tableResultLabel: document.querySelector("#tableResultLabel"),
  tableGapLabel: document.querySelector("#tableGapLabel"),
  tableRatioLabel: document.querySelector("#tableRatioLabel"),
  approvedNotice: document.querySelector("#approvedKpiNotice"),
  approvedTitle: document.querySelector("#approvedKpiTitle"),
  approvedFormula: document.querySelector("#approvedKpiFormula"),
  approvedDirection: document.querySelector("#approvedKpiDirection"),
  approvedChart: document.querySelector("#approvedBarChart"),
  approvedChartTitle: document.querySelector("#approvedChartTitle"),
  approvedChartList: document.querySelector("#approvedChartList"),
  approvedChartNote: document.querySelector("#approvedChartNote"),
  approvedChartSource: document.querySelector("#approvedChartSource"),
  approvedMetricSelector: document.querySelector("#approvedMetricSelector"),
  approvedMetricSelect: document.querySelector("#approvedMetricSelect"),
  approvedChartLegend: document.querySelector("#approvedChartLegend"),
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

const briefEls = {
  statusBadge: document.querySelector("#briefStatusBadge"),
  grid: document.querySelector("#briefGrid"),
  riskCount: document.querySelector("#briefRiskCount"),
  riskNote: document.querySelector("#briefRiskNote"),
  unitsList: document.querySelector("#briefUnitsList"),
  qualityStatus: document.querySelector("#briefQualityStatus"),
  qualityList: document.querySelector("#briefQualityList"),
  trendLabel: document.querySelector("#briefTrendLabel"),
  trendDetail: document.querySelector("#briefTrendDetail"),
  trendSpark: document.querySelector("#briefTrendSpark"),
  suggestionText: document.querySelector("#briefSuggestionText")
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

function formatThaiDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dataSourceLabel() {
  if (kpiState.dataSource === "live") return "HDC Public สด";
  if (kpiState.dataSource === "snapshot") return "Snapshot HDC Public";
  if (kpiState.dataSource === "error") return "เชื่อมต่อข้อมูลไม่ได้";
  return "กำลังตรวจแหล่งข้อมูล";
}

function updateDataSource(source) {
  if (source) kpiState.dataSource = source;
  const label = dataSourceLabel();
  if (kpiEls.sourceBadge) {
    kpiEls.sourceBadge.textContent = label;
    kpiEls.sourceBadge.classList.toggle("live", kpiState.dataSource === "live");
    kpiEls.sourceBadge.classList.toggle("snapshot", kpiState.dataSource === "snapshot");
    kpiEls.sourceBadge.classList.toggle("error", kpiState.dataSource === "error");
  }
  if (kpiEls.snapshotMeta) {
    const generated = formatThaiDateTime(kpiState.snapshotGeneratedAt);
    const suffix = kpiState.dataSource === "snapshot" && generated ? ` อัปเดต ${generated}` : "";
    kpiEls.snapshotMeta.innerHTML = `<strong>แหล่งข้อมูล</strong> ${label}${suffix}`;
  }
}

function syncAuditLabel(status) {
  if (status === "synced") return "ตรงกับ HDC";
  if (status === "stale") return "Snapshot ล้าหลัง";
  if (status === "missing") return "ยังไม่มีผลตรวจ";
  return "ตรวจไม่สำเร็จ";
}

function syncAuditClass(status) {
  if (status === "synced") return "synced";
  if (status === "stale" || status === "missing") return "stale";
  return "error";
}

function renderSyncAudit(audit) {
  const status = audit?.status || "missing";
  const label = syncAuditLabel(status);
  const cssClass = syncAuditClass(status);

  if (kpiEls.syncAuditMeta) {
    const checkedAt = audit?.generatedAt ? ` ตรวจล่าสุด ${formatThaiDateTime(audit.generatedAt)}` : "";
    kpiEls.syncAuditMeta.innerHTML = `<strong>Sync</strong> ${label}${checkedAt}`;
  }

  if (!kpiEls.syncAuditCard) return;
  kpiEls.syncAuditCard.hidden = false;
  kpiEls.syncAuditCard.classList.toggle("synced", cssClass === "synced");
  kpiEls.syncAuditCard.classList.toggle("stale", cssClass === "stale");
  kpiEls.syncAuditCard.classList.toggle("error", cssClass === "error");

  if (kpiEls.syncAuditBadge) kpiEls.syncAuditBadge.textContent = label;

  if (!audit) {
    if (kpiEls.syncAuditTitle) kpiEls.syncAuditTitle.textContent = "ยังไม่มีผลตรวจ Sync";
    if (kpiEls.syncAuditDetail) kpiEls.syncAuditDetail.textContent = "รัน node scripts/sync-audit.mjs หลัง refresh snapshot เพื่อสร้าง data/sync-audit.json";
    return;
  }

  const summary = audit.summary || {};
  const checkedAt = formatThaiDateTime(audit.generatedAt);
  const snapshotAt = formatThaiDateTime(summary.snapshotGeneratedAt);
  const issueReports = (audit.checks || [])
    .filter((item) => item.status !== "synced")
    .slice(0, 2)
    .map((item) => item.name)
    .join(", ");

  if (kpiEls.syncAuditTitle) {
    kpiEls.syncAuditTitle.textContent = status === "synced"
      ? "ข้อมูล snapshot ตรงกับ HDC live"
      : status === "stale"
        ? "ข้อมูล snapshot ไม่ตรงกับ HDC live"
        : "ตรวจ Sync ไม่สำเร็จ";
  }

  if (kpiEls.syncAuditDetail) {
    const base = `ตรวจ ${summary.synced || 0}/${summary.total || 0} รายงาน, snapshot ${snapshotAt || "-"}, audit ${checkedAt || "-"}`;
    kpiEls.syncAuditDetail.textContent = issueReports ? `${base} | ต้องตรวจ: ${issueReports}` : base;
  }
}

async function loadSyncAudit() {
  try {
    const response = await fetch("data/sync-audit.json", { cache: "no-store" });
    if (!response.ok) {
      renderSyncAudit(null);
      return;
    }
    kpiState.syncAudit = await response.json();
    renderSyncAudit(kpiState.syncAudit);
  } catch (_error) {
    renderSyncAudit(null);
  }
}

// Snapshot fallback — เมื่อเรียก proxy ไม่ได้ (ออนไลน์บน Vercel เข้า HDC จาก IP ตปท.ไม่ได้)
// อ่านข้อมูลที่ดึงไว้ล่วงหน้าจากเครื่อง IP ไทย (สร้างด้วย scripts/snapshot.mjs)
let snapshotManifestPromise = null;
function loadSnapshotManifest() {
  if (!snapshotManifestPromise) {
    snapshotManifestPromise = fetch("data/snapshot/manifest.json", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest) => {
        if (manifest?.generatedAt) kpiState.snapshotGeneratedAt = manifest.generatedAt;
        return manifest;
      })
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
    if (!response.ok) return null;
    updateDataSource("snapshot");
    return await response.json();
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
    updateDataSource("live");
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
  try {
    return await fetchProxy(kind, path, 8000);
  } catch (error) {
    updateDataSource("error");
    throw error;
  }
}

function optionText(item) {
  return item.name || item.text || item.code_name || item.value || item.code;
}

function isStandardDataMode() {
  return kpiState.mode === "standard" || kpiState.mode === "service-plan";
}

function isApprovedKpiMode() {
  return kpiState.mode === "rpst-approved";
}

function isFormulaVerifiedDefinition(definition = kpiState.currentDefinition) {
  return definition?.status === "approved-single-formula";
}

function isDirectHdcDefinition(definition = kpiState.currentDefinition) {
  return definition?.status === "hdc-direct-multi-formula";
}

function getDefinitionFormula(definition, field) {
  return (definition?.formulaDefinitions || []).find((item) => item.field === field) || null;
}

function normalizeFormulaSeries(jsonc, definition) {
  let columns = jsonc;
  if (typeof columns === "string") {
    try {
      columns = JSON.parse(columns);
    } catch (_error) {
      columns = [];
    }
  }
  if (!Array.isArray(columns)) columns = [];

  const seen = new Set();
  const series = columns
    .filter((column) => column?.type === "F" && column.column_name && !seen.has(column.column_name))
    .map((column) => {
      seen.add(column.column_name);
      const saved = getDefinitionFormula(definition, column.column_name);
      const formula = column.formula || saved?.formula || "";
      return {
        field: column.column_name,
        formula,
        numeratorField: saved?.numeratorField || null,
        denominatorField: saved?.denominatorField || null,
        scale: Number(saved?.scale) || (/\*\s*100\b/.test(formula) ? 100 : 1),
        isChart: Number(column.is_chart) === 1,
        digits: Number.isFinite(Number(column.digit_number)) ? Number(column.digit_number) : 2
      };
    });

  if (series.length) return series;
  return (definition?.formulaDefinitions || []).map((item) => ({
    field: item.field,
    formula: item.formula || "",
    numeratorField: item.numeratorField || null,
    denominatorField: item.denominatorField || null,
    scale: Number(item.scale) || 1,
    isChart: false,
    digits: 2
  }));
}

function getCurrentSeries() {
  return kpiState.currentFormulaSeries.find((series) => series.field === kpiState.currentSeriesField)
    || kpiState.currentChartSeries[0]
    || kpiState.currentFormulaSeries[0]
    || null;
}

function isCurrentPercentMetric() {
  return (getCurrentSeries()?.scale || 100) === 100;
}

async function loadApprovedKpiDefinitions() {
  const response = await fetch(APPROVED_KPI_DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`โหลดรายการ KPI รพ.สต. ไม่สำเร็จ (${response.status})`);
  const payload = await response.json();
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const seenCodes = new Set();
  kpiState.approvedDefinitions = items.filter((item) => {
    if (!item?.reportCode || seenCodes.has(item.reportCode)) return false;
    seenCodes.add(item.reportCode);
    return true;
  });
  kpiState.approvedMetadata = payload;
  kpiState.approvedCatalogs = [...new Set(kpiState.approvedDefinitions.map((item) => item.group))]
    .map((group) => ({ code: group, name: group }));
  return payload;
}

function getApprovedDefinition(reportCode) {
  return kpiState.approvedDefinitions.find((item) => item.reportCode === reportCode) || null;
}

function cleanServicePlanName(value) {
  return String(value || "")
    .replace(/^ข้อมูลเพื่อตอบสนอง\s*Service Plan\s*/i, "")
    .replace(/^สาขา\s*/i, "")
    .trim();
}

function catalogOptionText(item) {
  const label = optionText(item);
  if (isApprovedKpiMode()) return label;
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
  if (isStandardDataMode() || isApprovedKpiMode()) return kpiEls.year.value || "2569";
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

function normalizeKpiRow(row, definition = null, selectedSeries = null) {
  if (definition) {
    const fallbackSeries = getDefinitionFormula(definition, definition.formulaField)
      || definition.formulaDefinitions?.[0]
      || null;
    const series = selectedSeries || fallbackSeries;
    const denominatorField = series?.denominatorField || definition.denominatorField;
    const numeratorField = series?.numeratorField || definition.numeratorField;
    const formulaField = series?.field || definition.formulaField;
    const metricScale = Number(series?.scale) || 100;
    const denominator = denominatorField ? toNumber(row[denominatorField]) : null;
    const numerator = numeratorField ? toNumber(row[numeratorField]) : null;
    const hdcRatio = formulaField ? toNumber(row[formulaField]) : null;
    const formulaVerified = isFormulaVerifiedDefinition(definition)
      && formulaField === definition.formulaField;
    const calculatedRatio = formulaVerified && denominator > 0 && numerator !== null
      ? (numerator / denominator) * metricScale
      : null;
    const ratio = formulaVerified ? (calculatedRatio ?? hdcRatio) : hdcRatio;
    const formulaMismatch = formulaVerified && calculatedRatio !== null && hdcRatio !== null
      ? Math.abs(calculatedRatio - hdcRatio) > 0.01
      : false;
    const [codeFromName, nameFromName] = String(row.a_name || "").split(/:(.*)/s);
    return {
      code: String(row.a_code || codeFromName || "").trim(),
      name: String(nameFromName || row.a_name || "").trim(),
      target: denominator ?? findValueByPrefix(row, "target") ?? toNumber(row.c),
      result: numerator ?? findValueByPrefix(row, "result") ?? toNumber(row.b),
      ratio,
      hdcRatio,
      calculatedRatio,
      formulaMismatch,
      formulaVerified,
      hdcCalculated: !formulaVerified && hdcRatio !== null,
      metricField: formulaField || "",
      metricScale,
      metricCanAggregate: Boolean(denominatorField && numeratorField),
      raw: row
    };
  }
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

function formatMetricValue(value, digits = 2, scale = null) {
  if (!Number.isFinite(value)) return "-";
  const metricScale = scale ?? getCurrentSeries()?.scale ?? 100;
  return `${formatNumber(value, digits)}${metricScale === 100 ? "%" : ""}`;
}

function performanceLevel(value, definition = kpiState.currentDefinition) {
  if (!Number.isFinite(value)) return 0;
  const direction = definition?.direction || "higher-is-better";
  const goal = toNumber(definition?.goal);
  let score;
  if (goal !== null && goal > 0) {
    score = direction === "lower-is-better"
      ? (value <= goal ? 100 : (goal / value) * 100)
      : (value / goal) * 100;
    if (score >= 100) return 5;
    if (score >= 90) return 4;
    if (score >= 80) return 3;
    if (score >= 70) return 2;
    return 1;
  }

  const bounded = Math.min(Math.max(value, 0), 100);
  score = direction === "lower-is-better" ? 100 - bounded : bounded;
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 70) return 3;
  if (score >= 60) return 2;
  return 1;
}

function performanceLegend(definition = kpiState.currentDefinition) {
  const hasGoal = toNumber(definition?.goal) !== null;
  const labels = hasGoal
    ? ["ต่ำกว่าเป้ามาก", "ต่ำกว่าเป้า", "เฝ้าระวัง", "ใกล้เป้า", "ผ่านเป้า"]
    : ["ต้องเร่งแก้ไข", "ต่ำ", "เฝ้าระวัง", "ดี", "ดีมาก"];
  return {
    hasGoal,
    labels,
    note: hasGoal
      ? `เทียบเป้าหมาย ${formatMetricValue(definition.goal, 2)}`
      : "สี 5 ระดับเบื้องต้นจากค่า 0–100; ยังไม่ใช้ตัดสินผ่าน KPI จนกว่าจะยืนยันเป้าหมายปี 2569"
  };
}

function formatThaiDateTime(value) {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "ไม่พบข้อมูล";
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function renderTableDataStatus() {
  if (!kpiEls.tableDataStatus) return;
  const snapshotText = `ข้อมูลสำรองล่าสุด: ${formatThaiDateTime(dataStatus.snapshotGeneratedAt)}`;
  const liveText = dataStatus.lastLiveFetchAt
    ? `ข้อมูลสดล่าสุดจาก HDC: ${formatThaiDateTime(dataStatus.lastLiveFetchAt)}`
    : "ข้อมูลสดจาก HDC: ยังดึงไม่ได้ในรอบนี้";
  const fallbackText = dataStatus.lastTableSource === "snapshot-fallback"
    ? " | ตอนนี้เชื่อม HDC สดไม่ได้ จึงแสดงข้อมูลสำรองล่าสุดให้ดูก่อน"
    : "";
  kpiEls.tableDataStatus.textContent = `${snapshotText} | ${liveText}${fallbackText}`;
  kpiEls.tableDataStatus.classList.toggle("error", Boolean(fallbackText));
}

function ratioClass(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (isApprovedKpiMode()) return "";
  if (value < 50) return "danger";
  if (value < 80) return "warn";
  return "";
}

function applyUnitFilter(rows) {
  const selected = kpiEls.unit.value;
  if (!selected || selected === "ALL") return rows;
  return rows.filter((row) => row.code === selected);
}

function getUnitLabel(code, { short = false } = {}) {
  if (!code || code === "ALL") return short ? "ทุกหน่วย" : "ทุกหน่วยบริการ";
  const unit = kpiState.hospitals.find((hospital) => String(hospital.code) === String(code))
    || ALLOWED_SERVICE_UNITS.find((unit) => String(unit.code) === String(code));
  if (!unit) return String(code);
  return short ? (unit.name || unit.code_name || unit.code) : (unit.code_name || `${unit.code} - ${unit.name}`);
}

function getAllSummaryUnitCode() {
  return kpiEls.allSummaryUnit?.value || "ALL";
}

function getAllSummaryDisplayRows() {
  const selectedCode = getAllSummaryUnitCode();
  return kpiState.allSummary.map((item) => {
    if (!["สำเร็จ", "ผลคำนวณ HDC"].includes(item.status)) {
      return {
        ...item,
        unitsLabel: selectedCode === "ALL" ? "-" : getUnitLabel(selectedCode, { short: true }),
        target: null,
        result: null,
        gap: null,
        ratio: null
      };
    }

    const sourceRows = Array.isArray(item.rows) ? item.rows : [];
    const rows = selectedCode === "ALL"
      ? sourceRows
      : sourceRows.filter((row) => String(row.code) === String(selectedCode));
    const summary = summarizeRows(rows);
    const hasSelectedUnitData = selectedCode === "ALL" || rows.length > 0;

    return {
      ...item,
      units: rows.length,
      unitsLabel: selectedCode === "ALL" ? `${formatNumber(rows.length)} หน่วย` : getUnitLabel(selectedCode, { short: true }),
      target: hasSelectedUnitData ? summary.target : null,
      result: hasSelectedUnitData ? summary.result : null,
      gap: hasSelectedUnitData ? summary.gap : null,
      ratio: hasSelectedUnitData ? summary.ratio : null,
      metricScale: hasSelectedUnitData ? summary.metricScale : item.metricScale,
      status: hasSelectedUnitData ? item.status : "ไม่มีข้อมูลหน่วยนี้"
    };
  });
}

function renderAllSummaryScope() {
  if (!kpiEls.allSummaryScope) return;
  const selectedCode = getAllSummaryUnitCode();
  const rows = getAllSummaryDisplayRows();
  const successCount = rows.filter((item) => ["สำเร็จ", "ผลคำนวณ HDC"].includes(item.status)).length;
  const directHdcCount = rows.filter((item) => item.status === "ผลคำนวณ HDC").length;
  const noDataCount = rows.filter((item) => item.status === "ไม่มีข้อมูลหน่วยนี้").length;
  if (selectedCode === "ALL") {
    const directHdcNote = directHdcCount ? ` | ใช้ผลคำนวณ HDC ${formatNumber(directHdcCount)} รายการ` : "";
    kpiEls.allSummaryScope.textContent = `แสดงภาพรวมทุกหน่วยบริการ จาก KPI ${formatNumber(rows.length)} รายการ${directHdcNote}`;
    return;
  }
  const noDataNote = noDataCount ? ` | ไม่มีข้อมูลของหน่วยนี้ ${formatNumber(noDataCount)} รายการ` : "";
  kpiEls.allSummaryScope.textContent = `แสดงเฉพาะ ${getUnitLabel(selectedCode)} | มีข้อมูล ${formatNumber(successCount)}/${formatNumber(rows.length)} KPI${noDataNote}`;
}

function summarizeRows(rows) {
  const target = rows.reduce((sum, row) => sum + (row.target || 0), 0);
  const result = rows.reduce((sum, row) => sum + (row.result || 0), 0);
  const ratios = rows.map((row) => row.ratio).filter((value) => Number.isFinite(value));
  const metricScale = rows.find((row) => Number.isFinite(row.metricScale))?.metricScale || 100;
  const canAggregate = rows.some((row) => row.metricCanAggregate);
  const ratio = canAggregate && target > 0
    ? (result / target) * metricScale
    : ratios.length
      ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length
      : null;
  const gap = canAggregate && (target || result)
    ? (isApprovedKpiMode() ? target - result : result - target)
    : null;
  return { target, result, gap, ratio, metricScale };
}

function rowGap(row) {
  if (row.target === null || row.target === undefined || row.result === null || row.result === undefined) return null;
  if (isApprovedKpiMode() && !row.metricCanAggregate) return null;
  return isApprovedKpiMode() ? row.target - row.result : row.result - row.target;
}

function gapClass(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (isApprovedKpiMode()) return "";
  if (value < 0) return "danger";
  if (value > 0) return "success";
  return "";
}

function formatGap(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  if (isApprovedKpiMode()) {
    if (value < 0) return `ตัวตั้งเกินตัวหาร ${formatNumber(Math.abs(value))}`;
    return `คงเหลือ ${formatNumber(value)}`;
  }
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
      <strong class="${ratioClass(row.ratio)}">${formatMetricValue(row.ratio, 2, row.metricScale)}</strong>
    </li>
  `).join("");
}

function buildQualityWarnings(rows, summary) {
  if (!rows.length) return ["ยังไม่มีข้อมูลรายหน่วยบริการ"];
  const warnings = [];
  const zeroTargets = rows.filter((row) => row.target === 0 && (row.result || 0) > 0).length;
  const missingRatios = rows.filter((row) => !Number.isFinite(row.ratio)).length;
  const missingTargets = rows.filter((row) => row.target === null || row.target === undefined).length;
  const formulaMismatches = rows.filter((row) => row.formulaMismatch).length;
  const targets = rows.map((row) => row.target).filter((value) => Number.isFinite(value) && value > 0);
  const targetMedian = median(targets);
  const highDenominator = targetMedian
    ? rows.filter((row) => Number.isFinite(row.target) && row.target > targetMedian * 2.5).length
    : 0;

  if (zeroTargets) warnings.push(`มี ${formatNumber(zeroTargets)} หน่วยที่ผลงานมีค่าแต่เป้าหมายเป็นศูนย์`);
  if (missingRatios) warnings.push(`มี ${formatNumber(missingRatios)} หน่วยที่ยังคำนวณร้อยละไม่ได้`);
  if (missingTargets) warnings.push(`มี ${formatNumber(missingTargets)} หน่วยที่ไม่พบ denominator/target`);
  if (formulaMismatches) warnings.push(`มี ${formatNumber(formulaMismatches)} หน่วยที่ค่าคำนวณใหม่ไม่ตรงกับ ${kpiState.currentDefinition?.formulaField || "สูตร HDC"}`);
  if (highDenominator) warnings.push(`มี ${formatNumber(highDenominator)} หน่วยที่ denominator สูงกว่าค่ากลางมาก ควรตรวจ TYPEAREA/DISCHARGE`);
  if (summary.target === 0 && summary.result > 0) warnings.push("เป้าหมายรวมเป็นศูนย์แต่มีผลงาน ควรตรวจแฟ้ม PERSON/SERVICE");
  if (isApprovedKpiMode() && isDirectHdcDefinition()) warnings.push("สูตรหลายชุด: ใช้ค่าผลลัพธ์ที่ HDC คำนวณและระบุเป็นกราฟโดยตรง");
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
    const ratioText = summary.ratio === null ? "ยังไม่มีค่าผลลัพธ์" : `ค่ารวม/เฉลี่ย ${formatMetricValue(summary.ratio, 2, summary.metricScale)}`;
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
      const { rows } = normalizeProviderRowsResponse(response, report.report_code, kpiState.currentSeriesField);
      const summary = summarizeRows(filterTrendRows(rows));
      if (Number.isFinite(summary.ratio)) {
        points.push({ year, ratio: summary.ratio, metricScale: summary.metricScale });
      }
    } catch (_error) {
      // ข้ามปีที่ HDC ต้นทางไม่มีโครงข้อมูลแบบ provider
    }
  }

  if (!points.length) {
    if (kpiEls.insightTrend) kpiEls.insightTrend.textContent = "-";
    if (kpiEls.insightTrendNote) kpiEls.insightTrendNote.textContent = "ยังไม่มี snapshot หรือข้อมูลสดย้อนหลังสำหรับรายงานนี้";
    kpiState.lastTrend = null;
    kpiEls.loadTrend.disabled = false;
    renderDistrictBrief();
    return;
  }

  const ordered = points.sort((a, b) => b.year - a.year);
  const latest = ordered[0];
  const previous = ordered[1];
  if (kpiEls.insightTrend) {
    kpiEls.insightTrend.textContent = previous
      ? `${latest.ratio >= previous.ratio ? "เพิ่ม" : "ลด"} ${formatNumber(Math.abs(latest.ratio - previous.ratio), 2)} จุด`
      : formatMetricValue(latest.ratio, 2, latest.metricScale);
  }
  if (kpiEls.insightTrendNote) {
    kpiEls.insightTrendNote.textContent = ordered
      .map((point) => `${point.year}: ${formatMetricValue(point.ratio, 2, point.metricScale)}`)
      .join(" | ");
  }
  kpiState.lastTrend = { reportName: report.report_name, latest, previous, points: ordered };
  kpiEls.loadTrend.disabled = false;
  renderDistrictBrief();
}

function resetTrendInsight() {
  if (kpiEls.insightTrend) kpiEls.insightTrend.textContent = "-";
  if (kpiEls.insightTrendNote) kpiEls.insightTrendNote.textContent = "พร้อมคำนวณเมื่อเลือกตัวชี้วัด";
  if (kpiEls.loadTrend) kpiEls.loadTrend.disabled = false;
  kpiState.lastTrend = null; // เปลี่ยนรายงานแล้ว trend เดิมใช้ไม่ได้ — ให้ brief fallback เป็น "รอข้อมูลย้อนหลัง" จนกว่าจะคำนวณใหม่
}

// ---- สรุปสถานการณ์ HDC อำเภอปากช่อง (district brief) — ใช้ข้อมูล state เดิมทั้งหมด ไม่ดึงเพิ่ม ----
function getRiskKpiSummary() {
  const fromAllSummary = kpiState.allSummary.length > 0;
  const sourceRows = fromAllSummary
    ? getAllSummaryDisplayRows().map((item) => ({ gap: item.gap, ratio: item.ratio }))
    : applyUnitFilter(kpiState.currentRows).map((row) => ({ gap: rowGap(row), ratio: row.ratio }));

  if (!sourceRows.length) {
    return { hasData: false, count: null, total: 0, note: "รอข้อมูลเป้าหมาย" };
  }

  if (isApprovedKpiMode()) {
    return {
      hasData: true,
      count: 0,
      total: sourceRows.length,
      note: "ยังไม่จัดผ่าน/ไม่ผ่าน จนกว่าจะยืนยันเกณฑ์จาก KPI Template 2569"
    };
  }

  const atRisk = sourceRows.filter((row) => (row.gap !== null && row.gap < 0) || (Number.isFinite(row.ratio) && row.ratio < 80));
  return {
    hasData: true,
    count: atRisk.length,
    total: sourceRows.length,
    note: atRisk.length ? "ควรติดตามรายงานที่ gap สูงก่อน" : "ยังไม่พบรายการที่เสี่ยงไม่ถึงเป้าในรอบล่าสุด"
  };
}

function getFollowUpUnits() {
  const rows = applyUnitFilter(kpiState.currentRows);
  if (!rows.length) return { hasData: false, units: [], missingCount: 0 };

  const lowerIsBetter = kpiState.currentDefinition?.direction === "lower-is-better";
  const ranked = rows
    .filter((row) => Number.isFinite(row.ratio))
    .sort((a, b) => lowerIsBetter ? b.ratio - a.ratio : a.ratio - b.ratio)
    .slice(0, 3);
  const missingCount = rows.filter((row) => !Number.isFinite(row.ratio)).length;
  return { hasData: true, units: ranked, missingCount };
}

function getDataQualityWarnings() {
  const rows = applyUnitFilter(kpiState.currentRows);
  const summary = summarizeRows(rows);
  const warnings = buildQualityWarnings(rows, summary);
  const OK_MESSAGE = "ไม่พบสัญญาณผิดปกติจาก target/result/rate ในรายงานนี้";
  const EMPTY_MESSAGE = "ยังไม่มีข้อมูลรายหน่วยบริการ";
  const hasIssue = warnings.some((warning) => warning !== OK_MESSAGE && warning !== EMPTY_MESSAGE);
  return {
    hasData: rows.length > 0,
    warnings,
    status: !rows.length ? "รอข้อมูล" : hasIssue ? "ควรตรวจสอบ" : "ไม่พบความผิดปกติชัดเจน"
  };
}

function getTrendSummary() {
  const trend = kpiState.lastTrend;
  if (!trend || !trend.latest) {
    return { hasData: false, label: "รอข้อมูลย้อนหลัง", detail: "ยังไม่ได้คำนวณ Trend 5 ปี — กดปุ่ม คำนวณ Trend 5 ปี ที่การ์ด Insight ด้านล่าง", points: [] };
  }
  if (!trend.previous) {
    return { hasData: true, label: formatMetricValue(trend.latest.ratio, 1, trend.latest.metricScale), detail: `${trend.reportName} (${trend.latest.year})`, points: trend.points };
  }
  const diff = trend.latest.ratio - trend.previous.ratio;
  const lowerIsBetter = kpiState.currentDefinition?.direction === "lower-is-better";
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const label = Math.abs(diff) < 1 ? "คงที่" : improved ? "ดีขึ้น" : "ลดลง";
  return {
    hasData: true,
    label,
    detail: `${trend.reportName}: เปลี่ยน ${formatNumber(Math.abs(diff), 1)} จุดจากปีก่อน`,
    points: trend.points
  };
}

function buildDistrictBrief() {
  return {
    risk: getRiskKpiSummary(),
    units: getFollowUpUnits(),
    quality: getDataQualityWarnings(),
    trend: getTrendSummary()
  };
}

function buildBriefRecommendation(brief) {
  const notes = [];

  if (brief.risk.hasData && brief.risk.count > 0) {
    notes.push(`พบรายการที่มี gap สูงหรือผลงานต่ำกว่าเป้า ${formatNumber(brief.risk.count)} จาก ${formatNumber(brief.risk.total)} รายการ`);
  }
  if (brief.units.hasData && brief.units.missingCount > 0) {
    notes.push(`มีหน่วยบริการที่ข้อมูลเป็น "-" ${formatNumber(brief.units.missingCount)} แห่ง ควรตรวจสอบข้อมูล`);
  }
  if (kpiState.servicePlanCoverage.length) {
    const completePlans = kpiState.servicePlanCoverage.filter((item) => item.totalReports && item.noData === 0 && item.failed === 0).length;
    notes.push(
      completePlans === kpiState.servicePlanCoverage.length
        ? "Service Plan ครบ 17 สาขาแล้ว"
        : `Service Plan ครบ ${completePlans}/${kpiState.servicePlanCoverage.length} สาขา`
    );
  }
  if (brief.quality.status === "ควรตรวจสอบ") {
    notes.push("ควรตรวจสอบรายงานวัคซีน, Service Plan NCD และคุณภาพข้อมูล 43 แฟ้มก่อน เนื่องจากอาจเกี่ยวข้องกับ gap สูงหรือคุณภาพข้อมูล");
  }

  if (notes.length) return notes.join(" — ");
  if (!brief.risk.hasData && !brief.units.hasData) return "กำลังวิเคราะห์ข้อมูล HDC เพื่อสรุปประเด็นสำคัญ กรุณารอสักครู่";
  return "ข้อมูลล่าสุดยังไม่พบประเด็นเสี่ยงชัดเจน ระบบจะอัปเดตสรุปนี้ทุกครั้งที่โหลดข้อมูลใหม่";
}

function briefStatusClass(status) {
  if (status === "ควรตรวจสอบ") return "status-danger";
  if (status === "ไม่พบความผิดปกติชัดเจน") return "status-ok";
  return "";
}

function renderBriefSparkline(points) {
  if (!briefEls.trendSpark) return;
  if (!points || points.length < 2) {
    briefEls.trendSpark.innerHTML = "";
    return;
  }

  const ordered = [...points].sort((a, b) => a.year - b.year);
  const ratios = ordered.map((point) => point.ratio);
  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const stepX = ordered.length > 1 ? width / (ordered.length - 1) : 0;
  const coords = ratios.map((ratio, index) => {
    const x = index * stepX;
    const y = height - ((ratio - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  briefEls.trendSpark.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><polyline points="${coords.join(" ")}" fill="none" stroke="#0aa083" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
}

function renderDistrictBrief() {
  if (!briefEls.grid) return;
  const brief = buildDistrictBrief();

  if (briefEls.riskCount) {
    briefEls.riskCount.textContent = brief.risk.hasData ? `${formatNumber(brief.risk.count)}/${formatNumber(brief.risk.total)}` : "-";
    briefEls.riskCount.className = brief.risk.hasData && brief.risk.count > 0 ? "status-warn" : "";
  }
  if (briefEls.riskNote) briefEls.riskNote.textContent = brief.risk.note;

  if (briefEls.unitsList) {
    if (!brief.units.hasData || !brief.units.units.length) {
      briefEls.unitsList.innerHTML = '<li class="insight-empty">ยังไม่พบหน่วยเสี่ยง</li>';
    } else {
      const rows = brief.units.units.map((row, index) => `
        <li>
          <span>${index + 1}. ${row.name || row.code}</span>
          <strong class="${ratioClass(row.ratio)}">${formatMetricValue(row.ratio, 1, row.metricScale)}</strong>
        </li>
      `);
      if (brief.units.missingCount) {
        rows.push(`<li><span>ไม่มีข้อมูล (-)</span><strong class="status-warn">${formatNumber(brief.units.missingCount)} แห่ง</strong></li>`);
      }
      briefEls.unitsList.innerHTML = rows.join("");
    }
  }

  if (briefEls.qualityStatus) {
    briefEls.qualityStatus.textContent = brief.quality.status;
    briefEls.qualityStatus.className = briefStatusClass(brief.quality.status);
  }
  if (briefEls.qualityList) {
    briefEls.qualityList.innerHTML = brief.quality.warnings.map((warning) => `<li><span>${warning}</span></li>`).join("");
  }

  if (briefEls.trendLabel) {
    briefEls.trendLabel.textContent = brief.trend.label;
    briefEls.trendLabel.className = brief.trend.label === "ดีขึ้น" ? "status-ok" : brief.trend.label === "ลดลง" ? "status-danger" : "";
  }
  if (briefEls.trendDetail) briefEls.trendDetail.textContent = brief.trend.detail;
  renderBriefSparkline(brief.trend.points);

  if (briefEls.suggestionText) briefEls.suggestionText.textContent = buildBriefRecommendation(brief);
  if (briefEls.statusBadge) {
    // brief อ่านจาก kpiState ที่โหลดมาแล้ว (snapshot เป็นหลักตอนเปิดหน้า) — โชว์เวลา snapshot ล่าสุดให้ผู้ใช้เข้าใจที่มา
    briefEls.statusBadge.textContent = (brief.risk.hasData || brief.units.hasData)
      ? `อัปเดต snapshot ล่าสุด: ${formatThaiDateTime(dataStatus.snapshotGeneratedAt)}`
      : "กำลังวิเคราะห์ข้อมูล HDC...";
  }
}

function renderApprovedModeContext() {
  const approved = isApprovedKpiMode();
  const definition = kpiState.currentDefinition;
  const formulaVerified = isFormulaVerifiedDefinition(definition);
  const directHdc = isDirectHdcDefinition(definition);
  const series = getCurrentSeries();
  const percentMetric = isCurrentPercentMetric();
  if (kpiEls.approvedNotice) kpiEls.approvedNotice.hidden = !approved;
  if (kpiEls.approvedChart) kpiEls.approvedChart.hidden = !approved;

  if (kpiEls.metricTargetLabel) kpiEls.metricTargetLabel.textContent = approved ? `${series?.denominatorField || "ตัวหาร"} รวม` : "เป้าหมายรวม";
  if (kpiEls.metricResultLabel) kpiEls.metricResultLabel.textContent = approved ? `${series?.numeratorField || "ตัวตั้ง"} รวม` : "ผลงานรวม";
  if (kpiEls.metricRatioLabel) kpiEls.metricRatioLabel.textContent = approved ? (percentMetric ? "ร้อยละรวม/เฉลี่ย" : "ค่าผลลัพธ์รวม/เฉลี่ย") : "ร้อยละเฉลี่ย";
  if (kpiEls.metricGapLabel) kpiEls.metricGapLabel.textContent = approved ? "คงเหลือ (ตัวหาร−ตัวตั้ง)" : "Gap รวม";
  if (kpiEls.tableTargetLabel) kpiEls.tableTargetLabel.textContent = approved ? (series?.denominatorField || "ตัวหาร") : "เป้าหมาย";
  if (kpiEls.tableResultLabel) kpiEls.tableResultLabel.textContent = approved ? (series?.numeratorField || "ตัวตั้ง") : "ผลงาน";
  if (kpiEls.tableGapLabel) kpiEls.tableGapLabel.textContent = approved ? "คงเหลือ" : "Gap";
  if (kpiEls.tableRatioLabel) kpiEls.tableRatioLabel.textContent = approved ? (percentMetric ? "ร้อยละ HDC" : "ค่าผลลัพธ์ HDC") : "ร้อยละ";

  if (!approved || !definition) return;
  const metadata = kpiState.approvedMetadata || {};
  if (kpiEls.approvedNotice) {
    kpiEls.approvedNotice.classList.remove("pending-formula");
    kpiEls.approvedNotice.classList.toggle("hdc-direct", directHdc);
  }
  if (kpiEls.approvedTitle) kpiEls.approvedTitle.textContent = `${definition.id} · ${definition.title}`;
  if (kpiEls.approvedFormula) {
    if (formulaVerified) {
      kpiEls.approvedFormula.textContent = `สูตร HDC: ${definition.formula} | ตัวตั้ง ${definition.numeratorField} | ตัวหาร ${definition.denominatorField} | ผลลัพธ์ ${definition.formulaField}`;
    } else {
      kpiEls.approvedFormula.textContent = series
        ? `ใช้ผล HDC โดยตรง: ${series.field} = ${series.formula || "สูตรจาก HDC"} · ไม่คำนวณทับค่าต้นทาง`
        : `พบ ${definition.formulaCount || "หลาย"} สูตรในรายงาน · รอข้อมูลโครงสร้างจาก HDC`;
    }
  }
  if (kpiEls.approvedDirection) {
    const direction = definition.direction === "lower-is-better" ? "ยิ่งต่ำยิ่งดี" : "ยิ่งสูงยิ่งดี";
    kpiEls.approvedDirection.textContent = formulaVerified
      ? `${direction} · ตรวจสูตรแล้ว ${metadata.approvedTotal || 13}/${metadata.selectionTotal || 62}`
      : `${direction} · ใช้ผลคำนวณ HDC โดยตรง ${metadata.directHdcTotal || 49} ข้อ`;
  }
  if (kpiEls.approvedChartTitle) {
    kpiEls.approvedChartTitle.textContent = `กราฟแท่งแนวตั้ง${series ? ` · ${series.field}` : ""}`;
  }
  if (kpiEls.approvedChartNote) {
    const chartCount = kpiState.currentChartSeries.length;
    kpiEls.approvedChartNote.textContent = chartCount
      ? `${definition.chartType || "กราฟตาม HDC"} · HDC ระบุ is_chart ${chartCount} ชุด${formulaVerified ? " · ตรวจเทียบสูตรแล้ว" : " · ใช้ค่าที่ HDC คำนวณโดยตรง"}`
      : "HDC ไม่ได้กำหนดคอลัมน์ is_chart=1 ในรายงานนี้ จึงไม่สร้างกราฟแทนเอง";
  }
  if (kpiEls.approvedChartSource) {
    kpiEls.approvedChartSource.textContent = dataStatus.lastTableSource === "live" ? "HDC Public สด" : "Snapshot HDC Public";
  }
}

function renderApprovedMetricSelector() {
  if (!kpiEls.approvedMetricSelector || !kpiEls.approvedMetricSelect) return;
  const series = kpiState.currentChartSeries;
  kpiEls.approvedMetricSelector.hidden = series.length <= 1;
  kpiEls.approvedMetricSelect.innerHTML = series.map((item) => (
    `<option value="${escapeHtml(item.field)}">${escapeHtml(`${item.field} · ${item.formula || "ค่าคำนวณ HDC"}`)}</option>`
  )).join("");
  if (series.some((item) => item.field === kpiState.currentSeriesField)) {
    kpiEls.approvedMetricSelect.value = kpiState.currentSeriesField;
  }
}

function selectApprovedMetric(field) {
  const series = kpiState.currentChartSeries.find((item) => item.field === field);
  if (!series || !kpiState.currentDefinition) return;
  kpiState.currentSeriesField = series.field;
  kpiState.currentRows = kpiState.currentRows.map((row) => (
    normalizeKpiRow(row.raw, kpiState.currentDefinition, series)
  ));
  resetTrendInsight();
  renderCurrentRows();
}

function niceAxisMaximum(values, scale) {
  if (scale === 100) return 100;
  const max = Math.max(...values.filter(Number.isFinite), 0);
  if (max <= 1) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil((max * 1.08) / magnitude) * magnitude;
}

function renderApprovedChartLegend(series) {
  if (!kpiEls.approvedChartLegend) return;
  const hasGoal = toNumber(kpiState.currentDefinition?.goal) !== null;
  const useBands = series?.scale === 100 || hasGoal;
  if (!useBands) {
    kpiEls.approvedChartLegend.hidden = false;
    kpiEls.approvedChartLegend.innerHTML = '<span class="approved-legend-note">ค่าชุดนี้ไม่ใช่สเกลร้อยละ จึงใช้สีเดียวเพื่อไม่ตีความระดับผลงานผิด</span>';
    return;
  }
  const legend = performanceLegend();
  kpiEls.approvedChartLegend.hidden = false;
  kpiEls.approvedChartLegend.innerHTML = `${legend.labels.map((label, index) => `
    <span class="approved-legend-item"><i class="performance-${index + 1}"></i>${escapeHtml(label)}</span>`).join("")}
    <span class="approved-legend-note">${escapeHtml(legend.note)}</span>`;
}

function renderApprovedBarChart(rows) {
  if (!kpiEls.approvedChartList || !isApprovedKpiMode()) return;
  renderApprovedMetricSelector();
  const series = getCurrentSeries();
  if (!kpiState.currentChartSeries.length) {
    kpiEls.approvedChartList.innerHTML = `
      <div class="approved-chart-placeholder">
        <strong>รายงาน HDC ไม่มีคอลัมน์กราฟ</strong>
        <span>ยังแสดงค่าตารางที่ HDC คำนวณให้ แต่ไม่สร้างกราฟแทน เพราะต้นทางไม่ได้ระบุ is_chart=1</span>
      </div>`;
    if (kpiEls.approvedChartLegend) kpiEls.approvedChartLegend.hidden = true;
    return;
  }
  if (!rows.length) {
    kpiEls.approvedChartList.innerHTML = '<p class="data-status">ไม่พบข้อมูลสำหรับสร้างกราฟ</p>';
    if (kpiEls.approvedChartLegend) kpiEls.approvedChartLegend.hidden = true;
    return;
  }
  const values = rows.map((row) => row.ratio).filter(Number.isFinite);
  const axisMax = niceAxisMaximum(values, series?.scale || 100);
  const ticks = [axisMax, axisMax * 0.75, axisMax * 0.5, axisMax * 0.25, 0];
  const useBands = series?.scale === 100 || toNumber(kpiState.currentDefinition?.goal) !== null;
  const columns = rows.map((row) => {
    const hasRatio = Number.isFinite(row.ratio);
    const height = hasRatio ? Math.min(Math.max((row.ratio / axisMax) * 100, 0), 100) : 0;
    const mismatch = row.formulaMismatch ? " · สูตรไม่ตรง F3" : "";
    const level = useBands ? performanceLevel(row.ratio) : 0;
    const title = `${row.code} ${row.name || row.code}: ${hasRatio ? formatMetricValue(row.ratio, 2, row.metricScale) : "ไม่มีข้อมูล"}${mismatch}`;
    return `
      <div class="approved-chart-column" title="${escapeHtml(title)}">
        <span class="approved-chart-value">${hasRatio ? formatMetricValue(row.ratio, 1, row.metricScale) : "-"}</span>
        <div class="approved-chart-track" aria-hidden="true">
          <div class="approved-chart-bar${hasRatio ? ` performance-${level}` : " no-data"}" style="height:${height}%"></div>
        </div>
        <span class="approved-chart-code">${escapeHtml(row.code)}</span>
      </div>`;
  }).join("");
  kpiEls.approvedChartList.innerHTML = `
    <div class="approved-column-chart">
      <div class="approved-y-axis" aria-hidden="true">
        ${ticks.map((tick) => `<span>${formatMetricValue(tick, tick % 1 ? 1 : 0, series?.scale)}</span>`).join("")}
      </div>
      <div class="approved-plot-scroll" tabindex="0" aria-label="เลื่อนแนวนอนเพื่อดูหน่วยบริการทั้งหมด">
        <div class="approved-plot">${columns}</div>
      </div>
    </div>
    <p class="approved-chart-help">แกน X แสดงรหัสหน่วยบริการ · ตัวเลขอยู่ที่ปลายแท่ง · ชี้หรือแตะเพื่อดูชื่อเต็ม</p>`;
  renderApprovedChartLegend(series);
}

function renderCurrentRows() {
  const rows = applyUnitFilter(kpiState.currentRows);
  const summary = summarizeRows(rows);

  renderApprovedModeContext();

  kpiEls.metricUnits.textContent = formatNumber(rows.length);
  kpiEls.metricTarget.textContent = formatNumber(summary.target);
  kpiEls.metricResult.textContent = formatNumber(summary.result);
  kpiEls.metricRatio.textContent = formatMetricValue(summary.ratio, 2, summary.metricScale);
  if (kpiEls.metricGap) kpiEls.metricGap.textContent = formatGap(summary.gap);
  renderInsightPanel(rows, summary);
  renderDistrictBrief();
  renderApprovedBarChart(rows);

  if (!rows.length) {
    kpiEls.tableBody.innerHTML = '<tr><td colspan="7">ไม่พบข้อมูลรายหน่วยบริการตามเงื่อนไขที่เลือก</td></tr>';
    return;
  }

  kpiEls.tableBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.code)}</td>
      <td>${escapeHtml(row.name || row.code)}</td>
      <td>${formatNumber(row.target)}</td>
      <td>${formatNumber(row.result)}</td>
      <td><span class="gap-pill ${gapClass(rowGap(row))}">${formatGap(rowGap(row))}</span></td>
      <td><span class="ratio-pill ${ratioClass(row.ratio)}">${formatMetricValue(row.ratio, 2, row.metricScale)}</span></td>
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

function normalizeProviderRowsResponse(response, reportCode = "", preferredSeriesField = "") {
  if (!response.ok) throw new Error(response.error || "HDC API error");
  const source = response.rows?.[0] || {};
  const allowedCodes = getHospitalCodes();
  const data = Array.isArray(source.data) ? source.data : [];
  const definition = isApprovedKpiMode() ? getApprovedDefinition(reportCode) : null;
  const formulaSeries = definition ? normalizeFormulaSeries(source.jsonc, definition) : [];
  const chartSeries = formulaSeries.filter((series) => series.isChart);
  const selectedSeries = chartSeries.find((series) => series.field === preferredSeriesField)
    || chartSeries[0]
    || formulaSeries.find((series) => series.field === preferredSeriesField)
    || formulaSeries[0]
    || null;
  const rows = data
    .map((row) => normalizeKpiRow(row, definition, selectedSeries))
    .filter((row) => !allowedCodes.size || allowedCodes.has(row.code) || isAllowedServiceUnit(row));
  return {
    rows,
    dateCom: source.datecom || "",
    label: source.label || "",
    formulaSeries,
    chartSeries,
    selectedSeries
  };
}

// preferLive=false (default): เส้นทางเดิม snapshot-first เมื่อออนไลน์ / live-first เมื่อเปิดจากเครื่องไทย (ดู hdcGet)
// ใช้กับ processAllKpis/checkAllServicePlans ที่ไล่ดึงหลายร้อยรายงาน — ไม่อยากรอ live timeout ทุกรายงาน
//
// preferLive=true: ใช้กับ "ตารางรายหน่วยตอนผู้ใช้กดดู" (loadCurrentKpi) ตามแนวทาง hybrid —
// ลองดึงสดจาก HDC ก่อนเสมอไม่ว่าจะเปิดจากที่ไหน ถ้าดึงไม่ได้ (เช่น Vercel เข้า HDC ไม่ได้เลย
// ตามที่อธิบายใน scripts/README.md) ให้ fallback มา snapshot แทน พร้อมบันทึกแหล่งข้อมูลไว้ใน
// dataStatus ให้ UI แสดงเวลาที่ดึงสดล่าสุด/ข้อความ fallback ได้
async function fetchProviderRows(reportCode, budgetYear = getSelectedBudgetYear(), { preferLive = false, preferredSeriesField = "" } = {}) {
  if (!preferLive) {
    const response = await hdcGet("hdc", buildProviderDataPath(reportCode, budgetYear));
    return normalizeProviderRowsResponse(response, reportCode, preferredSeriesField);
  }

  const path = buildProviderDataPath(reportCode, budgetYear);
  try {
    const response = await fetchProxy("hdc", path, 12000);
    dataStatus.lastLiveFetchAt = new Date();
    dataStatus.lastTableSource = "live";
    return normalizeProviderRowsResponse(response, reportCode, preferredSeriesField);
  } catch (liveError) {
    const snapshot = await getSnapshot("hdc", path);
    if (snapshot) {
      dataStatus.lastTableSource = "snapshot-fallback";
      return normalizeProviderRowsResponse(snapshot, reportCode, preferredSeriesField);
    }
    throw liveError;
  }
}

async function loadCurrentKpi({ preferLive = true } = {}) {
  const report = getCurrentReport();
  if (!report?.report_code) return;

  kpiEls.load.disabled = true;
  kpiState.currentReportName = report.report_name;
  kpiState.currentDefinition = isApprovedKpiMode()
    ? (report.approvedDefinition || getApprovedDefinition(report.report_code))
    : null;
  kpiState.currentChartSeries = [];
  kpiState.currentFormulaSeries = [];
  kpiState.currentSeriesField = "";
  renderApprovedModeContext();
  resetTrendInsight();
  dataStatus.lastTableSource = null;
  setKpiStatus(`กำลังโหลดข้อมูลรายหน่วยบริการ: ${report.report_name}`);
  try {
    const { rows, dateCom, chartSeries = [], formulaSeries = [], selectedSeries = null } = await fetchProviderRows(
      report.report_code,
      undefined,
      { preferLive }
    );
    kpiState.currentRows = rows;
    kpiState.currentChartSeries = chartSeries;
    kpiState.currentFormulaSeries = formulaSeries;
    kpiState.currentSeriesField = selectedSeries?.field || "";
    kpiState.lastDateCom = dateCom;
    renderCurrentRows();
    const reportCountNote = kpiState.reportSkippedCount
      ? ` | รายงานที่ดึงข้อมูลได้ ${kpiState.reports.length}/${kpiState.reportSourceCount} (ไม่มี report code ${kpiState.reportSkippedCount})`
      : "";
    const fallbackNote = dataStatus.lastTableSource === "snapshot-fallback"
      ? " | ตอนนี้เชื่อม HDC สดไม่ได้ จึงแสดงข้อมูลสำรองล่าสุดให้ดูก่อน"
      : "";
    const sourceLabel = dataStatus.lastTableSource === "live" ? "สดจาก HDC Public " : "";
    const formulaNote = isApprovedKpiMode() && isDirectHdcDefinition()
      ? chartSeries.length
        ? ` | ใช้ค่าที่ HDC คำนวณโดยตรง (${chartSeries.length} ชุดข้อมูลกราฟ)`
        : " | HDC ไม่ได้กำหนดคอลัมน์ is_chart สำหรับรายงานนี้ จึงแสดงค่าตารางโดยไม่สร้างกราฟ"
      : "";
    setKpiStatus(
      `โหลดข้อมูล${sourceLabel}สำเร็จ ${rows.length} หน่วยบริการ (${dateCom || "ไม่ระบุวันที่ประมวลผล"})${reportCountNote}${formulaNote}${fallbackNote}`,
      fallbackNote ? "" : "success"
    );
    renderTableDataStatus();
  } catch (error) {
    kpiState.currentRows = [];
    kpiState.currentChartSeries = [];
    kpiState.currentFormulaSeries = [];
    kpiState.currentSeriesField = "";
    renderCurrentRows();
    updateDataSource("error");
    setKpiStatus(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`, "error");
    renderTableDataStatus();
  } finally {
    kpiEls.load.disabled = false;
  }
}

function fillYearsForCatalog(catalog) {
  if (isApprovedKpiMode()) {
    const year = kpiState.approvedMetadata?.budgetYear || "2569";
    kpiEls.year.innerHTML = `<option value="${year}">${year}</option>`;
    return;
  }
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

async function loadKpiReports({ preferLive = true } = {}) {
  const catalogId = kpiEls.catalog.value;
  const standardMode = isStandardDataMode();
  setKpiStatus(isApprovedKpiMode() ? "กำลังโหลด KPI รพ.สต. สำคัญครบ 62 ข้อ..." : standardMode ? "กำลังโหลดรายการรายงานมาตรฐาน..." : "กำลังโหลดรายการ KPI...");
  let sourceReportCount = 0;
  if (isApprovedKpiMode()) {
    kpiState.reports = kpiState.approvedDefinitions
      .filter((item) => item.group === catalogId)
      .map((item) => ({
        ...item,
        report_code: item.reportCode,
        report_name: item.title,
        weight: item.id,
        approvedDefinition: item
      }));
    sourceReportCount = kpiState.reports.length;
  } else if (standardMode) {
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
    (report) => {
      const verification = isApprovedKpiMode()
        ? (isFormulaVerifiedDefinition(report.approvedDefinition)
          ? "[ตรวจสูตรแล้ว] "
          : `[HDC คำนวณ ${report.formulaCount || "หลาย"} สูตร] `)
        : "";
      return `${verification}${report.weight || report.no || ""} ${report.report_group ? report.report_group + " > " : ""}${report.report_name}`.trim();
    },
    "เลือกรายงาน"
  );
  if (kpiState.reports.length) {
    const verifiedIndex = kpiState.reports.findIndex((report) => isFormulaVerifiedDefinition(report.approvedDefinition));
    kpiEls.report.selectedIndex = isApprovedKpiMode() && verifiedIndex >= 0 ? verifiedIndex + 1 : 1;
  }
  kpiEls.kpiCatalogCount.textContent = formatNumber(kpiState.reports.length);
  const skippedReportCount = kpiState.reportSkippedCount;
  setKpiStatus(
    isApprovedKpiMode()
      ? `แสดงครบ ${kpiState.approvedDefinitions.length}/${kpiState.approvedMetadata?.selectionTotal || 62} KPI · ตรวจสูตรแล้ว ${kpiState.approvedMetadata?.approvedTotal || 13} · ใช้ผลคำนวณ HDC โดยตรง ${kpiState.approvedMetadata?.directHdcTotal || 49} · หมวดนี้ ${kpiState.reports.length} รายการ`
      : skippedReportCount
        ? `พบรายการจาก HDC ${sourceReportCount} รายการ ใช้งานได้ ${kpiState.reports.length} รายการ (ไม่มี report code ${skippedReportCount} รายการ)`
        : `พบรายงานที่มี report code ${kpiState.reports.length} รายการ`,
    "success"
  );
  if (kpiState.reports.length) {
    await loadCurrentKpi({ preferLive });
  } else {
    kpiState.currentRows = [];
    kpiState.currentReportName = "";
    kpiState.currentDefinition = null;
    resetTrendInsight();
    renderCurrentRows();
  }
}

async function loadInitialKpiData() {
  if (!kpiEls.catalog) return;

  try {
    const [catalogResponse, standardCatalogResponse, hospitalResponse, manifest] = await Promise.all([
      hdcGet("hdc", "lookup/kpi/catalog"),
      hdcGet("hdc", "lookup/standard/catalog"),
      hdcGet("hdc", `lookup/hospital?provinceCode=${HDC_CONFIG.provinceCode}&districtCode=${HDC_CONFIG.districtCode}&subdistrictCode=&servicePlanLV=&byear=&isRegis=`),
      loadSnapshotManifest(),
      loadApprovedKpiDefinitions()
    ]);

    // หน้าเว็บเปิดมาให้เห็นเวลา snapshot ล่าสุดทันที — dashboard/insight/brief ใช้ snapshot เป็นหลัก (ดู scripts/README.md)
    dataStatus.snapshotGeneratedAt = manifest?.generatedAt ? new Date(manifest.generatedAt) : null;
    renderTableDataStatus();

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
    renderAllSummaryUnitOptions();

    kpiEls.serviceUnitCount.textContent = formatNumber(kpiState.hospitals.length);
    setKpiStatus(`เชื่อมต่อ HDC สำเร็จ กรองเหลือหน่วยบริการตามบัญชี สสอ.ปากช่อง ${kpiState.hospitals.length} แห่ง`, "success");
    // เปิดหน้าครั้งแรก: ใช้ snapshot เป็นหลัก (เร็ว/เสถียร ไม่รอ HDC) — ผู้ใช้กดโหลด/เปลี่ยนรายงานเองจะลองดึงสดก่อนเสมอ
    await loadKpiReports({ preferLive: false });
  } catch (error) {
    kpiEls.tableBody.innerHTML = '<tr><td colspan="7">เชื่อมต่อ HDC API ไม่สำเร็จ</td></tr>';
    updateDataSource("error");
    setKpiStatus(`เชื่อมต่อ HDC API ไม่สำเร็จ: ${error.message}`, "error");
  }
}

function getCatalogRowsForMode() {
  if (isApprovedKpiMode()) return kpiState.approvedCatalogs;
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
  if (isApprovedKpiMode()) {
    const preferredIndex = rows.findIndex((row) => row.code === "NCD DM/HT/CVD");
    if (preferredIndex >= 0) kpiEls.catalog.selectedIndex = preferredIndex;
  } else if (isStandardDataMode()) {
    const agingIndex = rows.findIndex((row) => row.code === DEFAULT_STANDARD_SUBCATALOG);
    if (agingIndex >= 0) kpiEls.catalog.selectedIndex = agingIndex;
  }
  const selected = rows.find((item) => String(item.code) === kpiEls.catalog.value) || rows[0];
  fillYearsForCatalog(selected);
}

function renderAllSummaryUnitOptions() {
  if (!kpiEls.allSummaryUnit) return;
  const selected = kpiEls.allSummaryUnit.value || "ALL";
  setOptions(
    kpiEls.allSummaryUnit,
    kpiState.hospitals,
    (hospital) => hospital.code,
    (hospital) => hospital.code_name || `${hospital.code} - ${hospital.name}`,
    "ทุกหน่วยบริการ (ภาพรวม)"
  );
  kpiEls.allSummaryUnit.options[0].value = "ALL";
  const hasSelected = Array.from(kpiEls.allSummaryUnit.options).some((option) => option.value === selected);
  kpiEls.allSummaryUnit.value = hasSelected ? selected : "ALL";
}

async function processAllKpis() {
  const reports = kpiState.reports.filter((report) => report.report_code);
  if (!reports.length) return;

  kpiEls.processAll.disabled = true;
  kpiState.allSummary = [];
  kpiEls.allSummary.hidden = false;
  kpiEls.allTableBody.innerHTML = "";
  if (kpiEls.allSummaryUnit && kpiEls.unit?.value) {
    const selectedUnit = kpiEls.unit.value;
    const hasOption = Array.from(kpiEls.allSummaryUnit.options).some((option) => option.value === selectedUnit);
    kpiEls.allSummaryUnit.value = hasOption ? selectedUnit : "ALL";
  }
  renderAllSummaryScope();

  for (let index = 0; index < reports.length; index += 1) {
    const report = reports[index];
    setKpiStatus(`กำลังประมวลผล KPI ${index + 1}/${reports.length}: ${report.report_name}`);
    try {
      const { rows, dateCom } = await fetchProviderRows(report.report_code);
      const summary = summarizeRows(rows);
      const formulaVerified = !isApprovedKpiMode() || isFormulaVerifiedDefinition(report.approvedDefinition);
      kpiState.allSummary.push({
        reportCode: report.report_code,
        name: report.report_name,
        rows,
        dateCom,
        units: rows.length,
        target: summary.target,
        result: summary.result,
        gap: summary.gap,
        ratio: summary.ratio,
        metricScale: summary.metricScale,
        status: formulaVerified ? "สำเร็จ" : "ผลคำนวณ HDC"
      });
    } catch (error) {
      kpiState.allSummary.push({
        reportCode: report.report_code,
        name: report.report_name,
        rows: [],
        dateCom: "",
        units: 0,
        target: null,
        result: null,
        gap: null,
        ratio: null,
        status: "ไม่สำเร็จ"
      });
    }
    renderAllSummary();
    kpiEls.kpiProcessedCount.textContent = formatNumber(kpiState.allSummary.filter((item) => ["สำเร็จ", "ผลคำนวณ HDC"].includes(item.status)).length);
  }

  const successCount = kpiState.allSummary.filter((item) => item.status === "สำเร็จ").length;
  const directHdcCount = kpiState.allSummary.filter((item) => item.status === "ผลคำนวณ HDC").length;
  const failCount = kpiState.allSummary.filter((item) => item.status === "ไม่สำเร็จ").length;
  const directHdcText = directHdcCount ? ` / ผลคำนวณ HDC ${directHdcCount}` : "";
  setKpiStatus(`ประมวลผลครบ ${reports.length} รายการ: ตรวจสูตรแล้ว ${successCount}${directHdcText} / ไม่สำเร็จ ${failCount}`, failCount ? "" : "success");
  kpiEls.processAll.disabled = false;
  renderDistrictBrief();
}

function renderAllSummary() {
  renderAllSummaryScope();
  const rows = getAllSummaryDisplayRows();
  kpiEls.allTableBody.innerHTML = rows.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.unitsLabel || formatNumber(item.units)}</td>
      <td>${formatNumber(item.target)}</td>
      <td>${formatNumber(item.result)}</td>
      <td><span class="gap-pill ${gapClass(item.gap)}">${formatGap(item.gap)}</span></td>
      <td><span class="ratio-pill ${ratioClass(item.ratio)}">${formatMetricValue(item.ratio, 2, item.metricScale)}</span></td>
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
  renderDistrictBrief();
}

function exportCsv() {
  const rows = applyUnitFilter(kpiState.currentRows);
  const useSummary = kpiState.allSummary.length > 0 && kpiEls.allSummary?.hidden === false;
  if (!useSummary && !rows.length) return;

  const header = useSummary
    ? ["kpi", "scope", "target", "result", "gap", "ratio", "status"]
    : ["report", "hospcode", "hospital", "target", "result", "gap", "ratio", "datecom"];
  const body = useSummary
    ? getAllSummaryDisplayRows().map((item) => [item.name, item.unitsLabel || item.units, item.target, item.result, item.gap, item.ratio, item.status])
    : rows.map((row) => [kpiState.currentReportName, row.code, row.name, row.target, row.result, rowGap(row), row.ratio, kpiState.lastDateCom]);

  const csv = [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const selectedUnit = useSummary ? getAllSummaryUnitCode() : kpiEls.unit.value;
  const suffix = selectedUnit && selectedUnit !== "ALL" ? `-${selectedUnit}` : "";
  link.download = useSummary ? `pakchong-kpi-summary${suffix}.csv` : `pakchong-kpi-provider${suffix}.csv`;
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
  if (IS_LOCAL) throw new Error("local assistant mode");
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
kpiEls.approvedMetricSelect?.addEventListener("change", (event) => selectApprovedMetric(event.target.value));
kpiEls.allSummaryUnit?.addEventListener("change", () => {
  renderAllSummary();
  renderDistrictBrief();
});
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

updateDataSource();
loadSyncAudit();

if (window.location.protocol === "file:") {
  showLocalServerRequired();
} else {
  loadInitialKpiData();
}
