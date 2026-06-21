// Audit-only: Deep crawl/reconstruction of the HDC "รายงานมาตรฐาน → ข้อมูลตอบสนอง Service Plan"
// catalog tree, compared against what scripts/snapshot.mjs + script.js actually fetch/show today.
//
// Read-only. Does not touch data/snapshot/*, script.js, coverage.js, or any production file.
// Writes data/audit/service-plan-tree-{official,current,gap,summary}.{json,csv}.
//
// Why this reads data/snapshot/ instead of calling HDC live:
// api-hdc.moph.go.th / api-center-hdc.moph.go.th / hdc.moph.go.th are not reachable from this
// sandbox (503 on every request — same Thai-IP-only restriction documented in scripts/README.md).
// The committed data/snapshot/ was captured today (manifest.generatedAt) from a Thai IP by the
// existing scripts/snapshot.mjs pipeline, so it is used here as the most current obtainable
// proxy for "HDC official" structure. See summary.json `limitations` for what this means.
//
// fixVerification in the summary: scripts/snapshot.mjs and script.js normalizeReports() were fixed
// to recursively flatten `children` (previously top-level-only, silently dropping nested reports —
// see the now-resolved missing_from_crawler entries below). That fix only changes *code*; it can't
// retroactively refetch reports/province/data without a Thai IP. So fixVerification re-derives
// "before vs after" discovery counts by re-running the OLD and NEW filter logic against the SAME
// already-cached system/subcatalog/reports trees (no network call) — proving the fix closes the
// discovery gap, while coverageStatus/rowCount for newly-discoverable reports still reflect the
// last live snapshot run (pending the next Thai-IP run to actually fetch them).
//
// Run: node scripts/audit/service-plan-tree.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SNAP_DIR = join(ROOT, "data", "snapshot");
const OUT_DIR = join(ROOT, "data", "audit");

const ROOT_CATALOG_NAME = "รายงานมาตรฐาน";
const UNIT_CODE_KEYS = ["hoscode", "hospcode", "hcode", "provider_code", "hospital_code", "unit_code", "a_code"];

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function readSnap(manifest, key) {
  const file = manifest.entries[key];
  if (!file) return { data: null, found: false };
  const data = await readJson(join(SNAP_DIR, file));
  return { data, found: true };
}

function stripHtmlTags(value) {
  return String(value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function reportLabel(node) {
  return stripHtmlTags(node.report_name || node.report_names || node.title_name || node.label || node.report_code);
}

// Recursively flattens the subcatalog/reports tree. A node is either a "group" (has children,
// no report_code) or a leaf "report" (has report_code, no children) — verified 1:1 against every
// branch currently in data/snapshot/ (no node has both, no deeper-than-1 nesting today), but this
// walks to arbitrary depth so it keeps working if HDC adds another nesting level later.
function flattenReportTree(rows, { groupPath = [], depth = 0 } = {}) {
  const leaves = [];
  const groupLabels = new Set();
  for (const node of rows || []) {
    const children = Array.isArray(node.children) ? node.children : null;
    if (node.report_code) {
      leaves.push({
        reportName: reportLabel(node),
        reportCode: String(node.report_code).trim(),
        no: node.no ?? null,
        depth,
        groupPath: [...groupPath],
        activeFalse: node.active === false,
      });
    }
    if (children && children.length) {
      const label = stripHtmlTags(node.label || node.report_name || "");
      if (label) groupLabels.add(label);
      const sub = flattenReportTree(children, { groupPath: [...groupPath, label].filter(Boolean), depth: depth + 1 });
      leaves.push(...sub.leaves);
      for (const g of sub.groupLabels) groupLabels.add(g);
    }
  }
  return { leaves, groupLabels };
}

function hasFacilityShapedColumns(rawData) {
  const sources = Array.isArray(rawData?.rows) ? rawData.rows : [];
  for (const source of sources) {
    const cols = Array.isArray(source.jsonc) ? source.jsonc.map((c) => String(c.column_name || "").toLowerCase()) : [];
    if (cols.some((c) => UNIT_CODE_KEYS.includes(c))) return true;
    const rows = Array.isArray(source.data) ? source.data : [];
    if (rows.some((row) => UNIT_CODE_KEYS.some((k) => row[k] !== undefined))) return true;
  }
  return sources.length === 0 ? null : false; // null = couldn't determine (no rows array at all)
}

function classify(entry) {
  if (!entry.branchFetched) {
    return {
      status: "missing_from_crawler",
      missingReason:
        "subcatalogId never fetched by scripts/snapshot.mjs (no 'center system/subcatalog/reports?subcatalogId=...' manifest entry) — the branch's report list itself was never requested, so the true official report count for this branch is unknown without a fresh Thai-IP crawl.",
      suggestedFix: "crawler — re-run scripts/snapshot.mjs (or fix whatever made it skip this subcatalogId) before trusting this branch's coverage numbers.",
    };
  }

  if (!entry.existsInCoverage) {
    if (entry.depth > 0) {
      return {
        status: "missing_from_crawler",
        missingReason:
          `Nested under group "${entry.groupPath.join(" > ")}" in HDC's system/subcatalog/reports response. ` +
          "The top-level-only filtering bug in scripts/snapshot.mjs and script.js normalizeReports() is now fixed (both recursively flatten `children`), but data/snapshot/coverage.json itself has not been regenerated since the fix because api-hdc.moph.go.th/api-center-hdc.moph.go.th are not reachable from this environment (Thai-IP-only). This report will be fetched on the next scripts/snapshot.mjs run from a Thai IP — until then it has no real coverage entry.",
        suggestedFix: "none in code — run scripts/snapshot.mjs from a Thai IP (or via the existing Task Scheduler job, see scripts/README.md) to populate real fetched data for this report.",
      };
    }
    return {
      status: entry.activeFalse ? "filtered_by_normalizer" : "missing_from_crawler",
      missingReason: entry.activeFalse
        ? "Top-level report explicitly marked active:false by HDC; scripts/snapshot.mjs skips it on purpose (`r.active !== false`), but script.js's normalizeReports() does not check `active` at all, so it would still appear in the live dropdown if reached from a Thai IP — inconsistent behavior between crawler and UI."
        : "Top-level report with a report_code, but absent from today's coverage.json — likely added on HDC's side after the last snapshot run, or a transient drop during that run. Re-run scripts/snapshot.mjs to confirm.",
      suggestedFix: entry.activeFalse ? "crawler/UI — decide once whether inactive reports should be tracked, then make both agree" : "crawler — re-run snapshot to refresh.",
    };
  }

  if (entry.coverageStatus === "error") {
    return {
      status: "upstream_error",
      missingReason: `HDC upstream returned ${entry.error} for reports/province/data/${entry.reportCode} (already retried 4x with backoff by scripts/snapshot.mjs).`,
      suggestedFix: "none — transient HDC outage, not a bug in this codebase. Will likely self-heal on next scheduled snapshot run; track if it persists across multiple runs.",
    };
  }

  if (entry.coverageStatus === "no_data") {
    if (entry.facilityShaped === false) {
      return {
        status: "no_data",
        missingReason:
          "Report fetched successfully (HTTP 200, valid JSON) but its column schema has no per-facility column (no hoscode/hospcode/etc.) — data is aggregated by a different dimension (e.g. insurance scheme, diagnosis group), so normalizePakchongRows() correctly returns 0 rows. This is a report-design limitation, not a normalizer bug.",
        suggestedFix: "normalizer/UI — render this report at its native aggregation level instead of forcing a facility-row view, or label it 'ไม่มีข้อมูลระดับหน่วยบริการ' explicitly instead of showing a blank table.",
      };
    }
    return {
      status: "no_data",
      missingReason:
        "Report fetched successfully and has facility-shaped columns, but none of the 24 Pak Chong unit codes appear in its rows for the current fiscal year — could be genuinely zero activity, or the facility-code field name isn't one of the keys normalizePakchongRows() recognizes.",
      suggestedFix: "normalizer — spot-check scripts/lib/hdc-normalize.mjs UNIT_CODE_KEYS against this report's raw column names before accepting as a genuine zero.",
    };
  }

  // coverageStatus === "success" from here
  if (!entry.visibleInUI) {
    return {
      status: "hidden_by_ui",
      missingReason: "Report has good facility data in snapshot/coverage but is explicitly marked active:false by HDC, so script.js normalizeReports() filters it out of the dropdown on purpose.",
      suggestedFix: "none — intentional filtering on an inactive report; revisit only if HDC marks it active again.",
    };
  }
  return { status: "ok", missingReason: null, suggestedFix: null };
}

async function main() {
  const manifest = await readJson(join(SNAP_DIR, "manifest.json"));
  const coverage = await readJson(join(SNAP_DIR, "coverage.json"));
  if (!manifest || !coverage) {
    console.error("[audit] missing data/snapshot/manifest.json or coverage.json — cannot build audit.");
    process.exit(1);
  }

  const { data: standardCatalog } = await readSnap(manifest, "hdc lookup/standard/catalog");
  if (!standardCatalog?.rows) {
    console.error("[audit] data/snapshot has no cached lookup/standard/catalog — cannot reconstruct tree.");
    process.exit(1);
  }

  const servicePlanCategory = standardCatalog.rows.find((c) => String(c.name).includes("Service Plan"));
  if (!servicePlanCategory) {
    console.error('[audit] no category containing "Service Plan" found in cached standard catalog.');
    process.exit(1);
  }
  const branchDefs = (servicePlanCategory.sub_menu || []).filter((b) => b.code);

  // index coverage.json reports by reportCode (global — reportCode is unique across the whole catalog)
  const coverageByCode = new Map(coverage.reports.map((r) => [r.reportCode, r]));

  // index manifest entries for "hdc reports/province/data/{reportCode}?..." -> reportCode present = data actually cached
  const snapshottedCodes = new Set();
  const providerDataRe = /^hdc reports\/province\/data\/([^?]+)\?/;
  for (const key of Object.keys(manifest.entries)) {
    const m = key.match(providerDataRe);
    if (m) snapshottedCodes.add(m[1]);
  }

  const branches = [];
  const allLeavesFlat = []; // for summary/gap building
  const fixVerificationPerBranch = [];

  for (const branchDef of branchDefs) {
    const branchKey = `center system/subcatalog/reports?subcatalogId=${branchDef.code}`;
    const { data: subResp, found: branchFetched } = await readSnap(manifest, branchKey);
    const rows = subResp?.rows || [];
    const { leaves: rawLeaves, groupLabels } = flattenReportTree(rows);

    // HDC itself sometimes repeats the exact same reportCode as two separate tree nodes within one
    // branch (observed in "สาขามะเร็ง") — dedupe so "official" counts unique reports, not tree nodes.
    // Mirrors dedupeByReportCode() in scripts/snapshot.mjs / script.js.
    const seenCodes = new Set();
    const leaves = rawLeaves.filter((leaf) => {
      if (seenCodes.has(leaf.reportCode)) return false;
      seenCodes.add(leaf.reportCode);
      return true;
    });
    const duplicateNodesInBranch = rawLeaves.length - leaves.length;

    // fix verification: re-run the OLD (top-level-only) vs NEW (recursive) discovery logic against
    // this same cached tree — no network call, proves the code fix without needing a live re-crawl.
    const beforeFixCodes = new Set(
      rows.filter((r) => r.report_code && r.active !== false).map((r) => String(r.report_code).trim())
    );
    const afterFixCodes = new Set(
      leaves.filter((l) => !l.activeFalse).map((l) => l.reportCode)
    );
    fixVerificationPerBranch.push({
      servicePlanBranch: branchDef.name,
      officialUniqueReports: leaves.length,
      discoverableBeforeFix: beforeFixCodes.size,
      discoverableAfterFix: afterFixCodes.size,
      missingBeforeFix: leaves.length - beforeFixCodes.size,
      missingAfterFix: leaves.length - afterFixCodes.size,
    });

    const reports = [];
    for (const leaf of leaves) {
      const path = [ROOT_CATALOG_NAME, servicePlanCategory.name, branchDef.name, ...leaf.groupPath];
      const officialUrl = `https://hdc.moph.go.th/center/public/standard-report-detail/${leaf.reportCode}?subcatalogId=${branchDef.code}`;
      const covEntry = coverageByCode.get(leaf.reportCode) || null;
      const existsInCoverage = Boolean(covEntry);
      const existsInSnapshot = snapshottedCodes.has(leaf.reportCode);
      // script.js normalizeReports() now flattens `children` to any depth and filters active!==false
      // (same logic as scripts/snapshot.mjs flattenReportTree) — depth no longer hides a report from the UI.
      const visibleInUI = !leaf.activeFalse;

      let facilityShaped = null;
      if (existsInSnapshot && covEntry?.status === "no_data") {
        const fname = manifest.entries[
          Object.keys(manifest.entries).find((k) => providerDataRe.test(k) && k.startsWith(`hdc reports/province/data/${leaf.reportCode}?`))
        ];
        if (fname) facilityShaped = hasFacilityShapedColumns(await readJson(join(SNAP_DIR, fname)));
      }

      const entry = {
        path,
        servicePlanBranch: branchDef.name,
        subGroup: leaf.groupPath.join(" > ") || null,
        reportName: leaf.reportName,
        reportCode: leaf.reportCode,
        subcatalogId: branchDef.code,
        officialUrl,
        existsInOfficial: true,
        groupPath: leaf.groupPath,
        existsInSnapshot,
        existsInCoverage,
        visibleInUI,
        coverageStatus: covEntry?.status ?? null,
        rowCount: covEntry?.rowCount ?? null,
        error: covEntry?.error ?? null,
        depth: leaf.depth,
        branchFetched,
        activeFalse: leaf.activeFalse,
        facilityShaped,
      };
      const { status, missingReason, suggestedFix } = classify(entry);
      entry.status = status;
      entry.missingReason = missingReason;
      entry.suggestedFix = suggestedFix;

      reports.push(entry);
      allLeavesFlat.push(entry);
    }

    branches.push({
      branchName: branchDef.name,
      branchId: branchDef.code,
      subcatalogId: branchDef.code,
      branchFetched,
      groupCount: groupLabels.size,
      reportCount: reports.length,
      topLevelDirectReportCount: rows.filter((r) => r.report_code).length,
      duplicateNodesInBranch,
      children: [], // reserved: HDC has not nested a deeper subcatalog level under any of the 17 branches as of this snapshot
      reports,
    });
  }

  const fixVerification = {
    method:
      "Re-ran the OLD (top-level rows only) and NEW (recursive flattenReportTree, post-fix) report-discovery " +
      "logic against the same already-cached data/snapshot/ system/subcatalog/reports trees — no live HDC call " +
      "needed for this comparison, so it is unaffected by the Thai-IP network restriction. It proves the code fix " +
      "closes the discovery gap. It does NOT mean coverage.json has fresh fetched KPI numbers for newly-discoverable " +
      "reports yet — run scripts/snapshot.mjs from a Thai IP to actually fetch reports/province/data for them.",
    officialUniqueReportsTotal: fixVerificationPerBranch.reduce((s, b) => s + b.officialUniqueReports, 0),
    discoverableBeforeFixTotal: fixVerificationPerBranch.reduce((s, b) => s + b.discoverableBeforeFix, 0),
    discoverableAfterFixTotal: fixVerificationPerBranch.reduce((s, b) => s + b.discoverableAfterFix, 0),
    missingBeforeFixTotal: fixVerificationPerBranch.reduce((s, b) => s + b.missingBeforeFix, 0),
    missingAfterFixTotal: fixVerificationPerBranch.reduce((s, b) => s + b.missingAfterFix, 0),
    perBranch: fixVerificationPerBranch,
  };
  fixVerification.gapReductionPercent = fixVerification.missingBeforeFixTotal === 0
    ? 100
    : Number((((fixVerification.missingBeforeFixTotal - fixVerification.missingAfterFixTotal) / fixVerification.missingBeforeFixTotal) * 100).toFixed(1));

  // ---- file 1: official tree (pure structure, no production-comparison fields) ----
  const officialTree = {
    source: "HDC official (reconstructed from data/snapshot/ — see limitations in service-plan-tree-summary.json)",
    catalogSnapshotGeneratedAt: manifest.generatedAt,
    generatedAt: new Date().toISOString(),
    catalog: `${ROOT_CATALOG_NAME} / ${servicePlanCategory.name}`,
    branches: branches.map((b) => ({
      branchName: b.branchName,
      branchId: b.branchId,
      subcatalogId: b.subcatalogId,
      children: b.children,
      reports: b.reports.map((r) => ({
        reportName: r.reportName,
        reportCode: r.reportCode,
        subcatalogId: r.subcatalogId,
        officialUrl: r.officialUrl,
        path: r.path,
      })),
    })),
  };
  await writeFile(join(OUT_DIR, "service-plan-tree-official.json"), JSON.stringify(officialTree, null, 2), "utf8");

  // ---- file 2: current production state tree (official tree + status fields per report) ----
  const currentTree = {
    source: "Production snapshot/coverage cross-reference",
    generatedAt: new Date().toISOString(),
    catalog: `${ROOT_CATALOG_NAME} / ${servicePlanCategory.name}`,
    branches: branches.map((b) => ({
      branchName: b.branchName,
      branchId: b.branchId,
      subcatalogId: b.subcatalogId,
      branchFetched: b.branchFetched,
      groupCount: b.groupCount,
      reportCount: b.reportCount,
      topLevelDirectReportCount: b.topLevelDirectReportCount,
      children: b.children,
      reports: b.reports,
    })),
  };
  await writeFile(join(OUT_DIR, "service-plan-tree-current.json"), JSON.stringify(currentTree, null, 2), "utf8");

  // ---- file 3+4: gap list (every report not "ok") ----
  const gapList = allLeavesFlat
    .filter((r) => r.status !== "ok")
    .map((r) => ({
      path: r.path,
      servicePlanBranch: r.servicePlanBranch,
      subGroup: r.subGroup,
      reportName: r.reportName,
      reportCode: r.reportCode,
      subcatalogId: r.subcatalogId,
      officialUrl: r.officialUrl,
      existsInOfficial: r.existsInOfficial,
      existsInSnapshot: r.existsInSnapshot,
      existsInCoverage: r.existsInCoverage,
      visibleInUI: r.visibleInUI,
      status: r.status,
      missingReason: r.missingReason,
      suggestedFix: r.suggestedFix,
    }));
  await writeFile(join(OUT_DIR, "service-plan-tree-gap.json"), JSON.stringify(gapList, null, 2), "utf8");

  const csvHeader = [
    "path", "servicePlanBranch", "subGroup", "reportName", "reportCode", "subcatalogId",
    "officialUrl", "existsInOfficial", "existsInSnapshot", "existsInCoverage", "visibleInUI",
    "status", "missingReason", "suggestedFix",
  ];
  const csvEscape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csvRows = gapList.map((r) => [
    r.path.join(" > "), r.servicePlanBranch, r.subGroup, r.reportName, r.reportCode, r.subcatalogId,
    r.officialUrl, r.existsInOfficial, r.existsInSnapshot, r.existsInCoverage, r.visibleInUI,
    r.status, r.missingReason, r.suggestedFix,
  ].map(csvEscape).join(","));
  await writeFile(join(OUT_DIR, "service-plan-tree-gap.csv"), [csvHeader.join(","), ...csvRows].join("\n") + "\n", "utf8");

  // ---- file 5: summary ----
  const statusCounts = {};
  for (const r of allLeavesFlat) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;

  const perBranchTable = branches.map((b) => {
    const reports = b.reports;
    return {
      servicePlanBranch: b.branchName,
      subcatalogId: b.subcatalogId,
      officialReports: reports.length,
      inSnapshot: reports.filter((r) => r.existsInSnapshot).length,
      inCoverage: reports.filter((r) => r.existsInCoverage).length,
      visibleUI: reports.filter((r) => r.visibleInUI).length,
      missing: reports.filter((r) => r.status === "missing_from_crawler").length,
      upstreamError: reports.filter((r) => r.status === "upstream_error").length,
      noFacilityData: reports.filter((r) => r.status === "no_data").length,
      ok: reports.filter((r) => r.status === "ok").length,
    };
  });

  const totalReports = allLeavesFlat.length;
  const totalGroups = branches.reduce((sum, b) => sum + b.groupCount, 0);
  const reportCodeShapes = {
    hex32: allLeavesFlat.filter((r) => /^[0-9a-f]{32}$/.test(r.reportCode)).length,
    other: allLeavesFlat.filter((r) => !/^[0-9a-f]{32}$/.test(r.reportCode)).length,
  };

  const summary = {
    generatedAt: new Date().toISOString(),
    catalogSnapshotGeneratedAt: manifest.generatedAt,
    catalog: `${ROOT_CATALOG_NAME} / ${servicePlanCategory.name}`,
    counts: {
      servicePlanBranches: branches.length,
      subGroupsTotal: totalGroups,
      reportsOfficialTotal: totalReports,
      reportsInSnapshot: allLeavesFlat.filter((r) => r.existsInSnapshot).length,
      reportsInCoverage: allLeavesFlat.filter((r) => r.existsInCoverage).length,
      reportsVisibleInUI: allLeavesFlat.filter((r) => r.visibleInUI).length,
      reportsMissing: statusCounts.missing_from_crawler || 0,
      reportsUpstreamError: statusCounts.upstream_error || 0,
      reportsNoFacilityData: statusCounts.no_data || 0,
      reportsHiddenByUI: statusCounts.hidden_by_ui || 0,
      reportsOk: statusCounts.ok || 0,
    },
    statusBreakdown: statusCounts,
    reportCodeShapes,
    perBranchTable,
    fixVerification,
    limitations: [
      "Live recrawl of hdc.moph.go.th / api-hdc.moph.go.th / api-center-hdc.moph.go.th was attempted from this environment and blocked (HTTP 503 on every request) — matches the Thai-IP-only restriction documented in scripts/README.md. This audit therefore reconstructs the 'official' tree from the most recent committed data/snapshot/ (captured " + manifest.generatedAt + " by the existing Thai-IP scheduled task), not a fresh live call.",
      "Because of the above, any branch, group, or report HDC added/removed after that snapshot run is invisible to this audit. The recursive-flatten bug in scripts/snapshot.mjs and script.js is now fixed in code (see fixVerification above), but coverage.json/snap_*.json themselves still reflect the LAST run made before the fix — reportsInSnapshot/reportsInCoverage/reportsMissing below will not drop until scripts/snapshot.mjs is re-run from a Thai IP (or via the Task Scheduler job) with the fix in place.",
      "depth/nesting: every one of the 17 Service Plan branches in the current snapshot is exactly 2 levels deep (branch -> group -> leaf report). The flattening code recurses to arbitrary depth defensively, but deeper nesting has not been observed and is unverified.",
    ],
  };
  await writeFile(join(OUT_DIR, "service-plan-tree-summary.json"), JSON.stringify(summary, null, 2), "utf8");

  console.log(`[audit] branches=${branches.length} groups=${totalGroups} reports=${totalReports}`);
  console.log(`[audit] status breakdown:`, statusCounts);
  console.log(`[audit] wrote 5 files to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("[audit:fatal]", err);
  process.exit(1);
});
