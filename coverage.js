// ส่วนแสดงสถานะ background sync (data/snapshot/coverage.json) — อ่านไฟล์ static เท่านั้น
// ไม่เรียก live proxy เด็ดขาด ไม่ผูกกับการโหลดข้อมูลหลักของหน้าเว็บ (script.js)
// coverage.json ถูกสร้างโดย scripts/snapshot.mjs ตอนรีเฟรช snapshot รายวัน (ดู scripts/README.md)

const bgEls = {
  section: document.querySelector("#backgroundSyncCoverage"),
  summaryBlock: document.querySelector("#bgSyncSummaryBlock"),
  generatedAt: document.querySelector("#bgSyncGeneratedAt"),
  total: document.querySelector("#bgSyncTotal"),
  tableBody: document.querySelector("#bgSyncCoverageBody"),
  errorWrap: document.querySelector("#bgSyncErrorWrap"),
  errorSummary: document.querySelector("#bgSyncErrorSummary"),
  errorCount: document.querySelector("#bgSyncErrorCount"),
  errorGroups: document.querySelector("#bgSyncErrorGroups"),
  errorDetailsSummary: document.querySelector("#bgSyncErrorDetailsSummary"),
  errorBody: document.querySelector("#bgSyncErrorBody"),
  exportErrors: document.querySelector("#bgSyncExportErrors"),
  empty: document.querySelector("#bgSyncEmpty"),
};

const ERROR_PREVIEW_LIMIT = 15;

function bgFormatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return Number(value).toLocaleString("th-TH");
}

function bgFormatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
  } catch (_error) {
    return iso;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bgStatusClass(item) {
  if (item.error > 0) return "danger";
  if (item.noData > 0) return "warn";
  return "";
}

function bgStatusText(item) {
  if (!item.total) return "ไม่มีรายงาน";
  if (item.error > 0) return "HDC ต้นทางขัดข้อง";
  if (item.noData > 0) return "ขาดบางข้อ";
  return "ครบ";
}

// รวมการแปลงข้อความ error ดิบจาก HDC ต้นทาง (เช่น "HTTP 502") ให้อ่านเข้าใจง่ายขึ้นไว้ที่นี่ที่เดียว
// ใช้ตรงนี้แทนการแสดง item.error ตรงๆ ทุกที่ที่โชว์ error log บนหน้าเว็บ
function formatUpstreamError(error) {
  if (error === "HTTP 502") {
    return "HDC ต้นทางตอบ 502 ในรอบนี้";
  }
  if (error === "HTTP 500") {
    return "HDC ต้นทางตอบ 500 ในรอบนี้";
  }
  return `HDC ต้นทางตอบผิดพลาด (${error || "ไม่ทราบสาเหตุ"})`;
}

function summarizeErrorsByCategory(errors) {
  const groups = new Map();
  errors.forEach((item) => {
    const category = item.category || "ไม่ระบุหมวด";
    groups.set(category, (groups.get(category) || 0) + 1);
  });
  return Array.from(groups.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "th"));
}

function countByError(errors) {
  const groups = new Map();
  errors.forEach((item) => {
    const label = formatUpstreamError(item.error);
    groups.set(label, (groups.get(label) || 0) + 1);
  });
  return Array.from(groups.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function renderBackgroundCoverage(coverage) {
  if (!bgEls.section) return;

  const hasData = Boolean(coverage && Array.isArray(coverage.reports));
  if (bgEls.empty) bgEls.empty.hidden = hasData;
  if (bgEls.summaryBlock) bgEls.summaryBlock.hidden = !hasData;
  if (!hasData) {
    if (bgEls.generatedAt) bgEls.generatedAt.textContent = "ยังไม่มีข้อมูลสถานะ background sync";
    return;
  }

  if (bgEls.generatedAt) {
    bgEls.generatedAt.textContent = `อัปเดตล่าสุด ${bgFormatDate(coverage.generatedAt)} (ปีงบ ${coverage.year || "-"})`;
  }
  if (bgEls.total) {
    const s = coverage.summary || {};
    bgEls.total.textContent = `สำเร็จ ${bgFormatNumber(s.success)} / ไม่มีข้อมูล ${bgFormatNumber(s.noData)} / error ${bgFormatNumber(s.error)} (รวม ${bgFormatNumber(s.total)} รายงาน)`;
  }

  if (bgEls.tableBody) {
    const groups = coverage.groups || [];
    bgEls.tableBody.innerHTML = groups.length
      ? groups.map((item) => `
        <tr>
          <td>${item.category}</td>
          <td>${bgFormatNumber(item.total)}</td>
          <td>${bgFormatNumber(item.success)}</td>
          <td>${bgFormatNumber(item.noData)}</td>
          <td>${bgFormatNumber(item.error)}</td>
          <td><span class="coverage-status ${bgStatusClass(item)}">${bgStatusText(item)}</span></td>
        </tr>
      `).join("")
      : '<tr><td colspan="6">ไม่พบข้อมูล coverage</td></tr>';
  }

  const errors = coverage.errors || [];
  if (bgEls.errorWrap) bgEls.errorWrap.hidden = errors.length === 0;
  const categorySummary = summarizeErrorsByCategory(errors);
  const errorSummary = countByError(errors);

  if (bgEls.errorCount) {
    bgEls.errorCount.textContent = `${bgFormatNumber(errors.length)} รายงาน`;
  }

  if (bgEls.errorSummary) {
    const topReason = errorSummary[0]
      ? `${errorSummary[0].label} ${bgFormatNumber(errorSummary[0].count)} รายการ`
      : "ไม่พบรายการที่รอประมวลผล";
    bgEls.errorSummary.textContent = errors.length
      ? `สรุปสั้นๆ: HDC ต้นทางยังตอบไม่ได้บางรายงานในรอบ sync ล่าสุด (${topReason}) ข้อมูลหลักของ dashboard ยังเปิดดูได้จากข้อมูลสำรองล่าสุดตามปกติ`
      : "HDC ต้นทางตอบได้ครบในรอบ sync ล่าสุด";
  }

  if (bgEls.errorGroups) {
    bgEls.errorGroups.innerHTML = categorySummary.map((item) => `
      <span>
        <strong>${escapeHtml(item.category)}</strong>
        <small>${bgFormatNumber(item.count)} รายงาน</small>
      </span>
    `).join("");
  }

  if (bgEls.errorDetailsSummary) {
    const previewCount = Math.min(errors.length, ERROR_PREVIEW_LIMIT);
    bgEls.errorDetailsSummary.textContent = errors.length
      ? `ดูตัวอย่าง ${bgFormatNumber(previewCount)} จาก ${bgFormatNumber(errors.length)} รายงาน`
      : "ไม่มีรายการที่ต้องประมวลผลใหม่";
  }

  if (bgEls.errorBody) {
    bgEls.errorBody.innerHTML = errors.slice(0, ERROR_PREVIEW_LIMIT).map((item) => `
      <tr>
        <td>${escapeHtml(item.category || "-")}</td>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.reportCode)}</small>
        </td>
        <td>${escapeHtml(formatUpstreamError(item.error))}</td>
      </tr>
    `).join("");
  }
  if (bgEls.exportErrors) bgEls.exportErrors.disabled = errors.length === 0;

  if (bgEls.exportErrors) {
    bgEls.exportErrors.onclick = () => exportBgErrorsCsv(errors);
  }
}

function exportBgErrorsCsv(errors) {
  const header = ["category", "reportCode", "title", "error"];
  const body = errors.map((item) => [item.category || "", item.reportCode, item.title, item.error || ""]);
  const csv = [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hdc-pakchong-background-sync-errors.csv";
  link.click();
  URL.revokeObjectURL(url);
}

async function loadBackgroundCoverage() {
  try {
    const response = await fetch("data/snapshot/coverage.json", { cache: "no-store" });
    if (!response.ok) {
      renderBackgroundCoverage(null);
      return;
    }
    renderBackgroundCoverage(await response.json());
  } catch (_error) {
    renderBackgroundCoverage(null);
  }
}

if (bgEls.section) loadBackgroundCoverage();
