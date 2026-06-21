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
  errorBody: document.querySelector("#bgSyncErrorBody"),
  exportErrors: document.querySelector("#bgSyncExportErrors"),
  empty: document.querySelector("#bgSyncEmpty"),
};

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

function bgStatusClass(item) {
  if (item.error > 0) return "danger";
  if (item.noData > 0) return "warn";
  return "";
}

function bgStatusText(item) {
  if (!item.total) return "ไม่มีรายงาน";
  if (item.error > 0) return "มี error";
  if (item.noData > 0) return "ขาดบางข้อ";
  return "ครบ";
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
  if (bgEls.errorBody) {
    bgEls.errorBody.innerHTML = errors.slice(0, 200).map((item) => `
      <tr>
        <td>${item.category || "-"}</td>
        <td>${item.reportCode}</td>
        <td>${item.title}</td>
        <td>${item.error || "-"}</td>
      </tr>
    `).join("");
  }
  if (bgEls.exportErrors) bgEls.exportErrors.disabled = errors.length === 0;

  bgEls.exportErrors?.addEventListener("click", () => exportBgErrorsCsv(errors), { once: true });
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
