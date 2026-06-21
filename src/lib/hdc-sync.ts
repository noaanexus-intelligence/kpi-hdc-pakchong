import {
  chooseTableDisplay,
  errorMessage,
  fetchReportData,
  fetchReportDetail,
  fetchReportInfo,
  isTimeoutError,
  normalizeFiscalYear,
  stripHtmlTags
} from "./hdc-client";
import { getHdcReportRegistry } from "./hdc-catalog";
import { normalizeHdcSources } from "./hdc-normalizer";
import type {
  HdcCoverageGroup,
  HdcCoverageResponse,
  HdcCoverageSummary,
  HdcReport,
  HdcReportResponse,
  HdcReportStatus,
  HdcSyncResult
} from "./hdc-types";
import { mapWithConcurrency } from "./sync-queue";

type FetchSingleReportOptions = {
  reportCode: string;
  subcatalogId?: string;
  fiscalYear?: string | number | null;
  tableDisplay?: string | null;
  report?: HdcReport;
};

type RunSyncOptions = {
  fiscalYear?: string | number | null;
  limit?: number;
  onProgress?: (event: {
    completed: number;
    total: number;
    result: HdcSyncResult;
  }) => void | Promise<void>;
};

export async function fetchSingleReport(options: FetchSingleReportOptions): Promise<HdcReportResponse> {
  const fiscalYear = normalizeFiscalYear(options.fiscalYear);
  const startedAt = Date.now();

  if (!options.reportCode) {
    return {
      ok: false,
      reportCode: "",
      subcatalogId: options.subcatalogId,
      year: fiscalYear,
      status: "missing_parameter",
      rows: [],
      error: "reportCode is required"
    };
  }

  try {
    const info = await fetchReportInfo(options.reportCode, options.subcatalogId);
    const tableDisplay = chooseTableDisplay(info, options.tableDisplay);
    const [detail, dataSources] = await Promise.all([
      fetchReportDetail(options.reportCode, fiscalYear).catch((error) => ({ error: errorMessage(error) })),
      fetchReportData({
        reportCode: options.reportCode,
        tableDisplay,
        fiscalYear
      })
    ]);

    const title = stripHtmlTags(options.report?.title ?? info.report_name ?? options.reportCode);
    const rows = normalizeHdcSources(dataSources, options.reportCode, title);
    const status: HdcReportStatus = rows.length ? "success" : "no_data";

    return {
      ok: true,
      reportCode: options.reportCode,
      subcatalogId: options.subcatalogId,
      year: fiscalYear,
      status,
      tableDisplay,
      report: options.report,
      info,
      rows,
      raw: {
        detail,
        dataSources,
        durationMs: Date.now() - startedAt
      }
    };
  } catch (error) {
    const status: HdcReportStatus = isTimeoutError(error) ? "timeout" : "error";

    return {
      ok: false,
      reportCode: options.reportCode,
      subcatalogId: options.subcatalogId,
      year: fiscalYear,
      status,
      report: options.report,
      rows: [],
      error: errorMessage(error)
    };
  }
}

export async function syncReport(report: HdcReport, fiscalYear: number): Promise<HdcSyncResult> {
  const startedAt = Date.now();

  if (!report.reportCode) {
    return {
      ...report,
      status: "missing_parameter",
      rows: [],
      rowCount: 0,
      error: "reportCode is missing",
      durationMs: Date.now() - startedAt
    };
  }

  const response = await fetchSingleReport({
    reportCode: report.reportCode,
    subcatalogId: report.subcatalogId,
    fiscalYear,
    report
  });

  return {
    ...report,
    fiscalYear,
    status: response.status,
    rows: response.rows,
    rowCount: response.rows.length,
    error: response.error,
    durationMs: Date.now() - startedAt
  };
}

export async function runHdcSync(options: RunSyncOptions = {}) {
  const fiscalYear = normalizeFiscalYear(options.fiscalYear);
  const registry = await getHdcReportRegistry({ fiscalYear });
  const reports = options.limit ? registry.slice(0, Math.max(0, options.limit)) : registry;
  let completed = 0;

  const results = await mapWithConcurrency(
    reports,
    async (report) => {
      const result = await syncReport(report, fiscalYear);
      completed += 1;
      await options.onProgress?.({
        completed,
        total: reports.length,
        result
      });
      return result;
    },
    { concurrency: 3, delayMs: 500 }
  );

  return buildCoverageResponse(results, fiscalYear);
}

export function buildCoverageResponse(results: HdcSyncResult[], fiscalYear: number): HdcCoverageResponse {
  const groups = Array.from(groupByCategory(results).entries()).map(([category, items]) => {
    const summary = buildSummary(items);
    return {
      category,
      total: summary.total,
      success: summary.success,
      noData: summary.noData,
      error: summary.error,
      missingParameter: summary.missingParameter,
      timeout: summary.timeout,
      schemaMismatch: summary.schemaMismatch
    } satisfies HdcCoverageGroup;
  });

  return {
    ok: true,
    fiscalYear,
    generatedAt: new Date().toISOString(),
    summary: buildSummary(results),
    groups,
    results,
    errors: results
      .filter((result) => ["error", "timeout", "missing_parameter", "schema_mismatch"].includes(result.status))
      .map((result) => ({
        reportCode: result.reportCode,
        title: result.title,
        status: result.status,
        error: result.error
      }))
  };
}

export function buildBaselineCoverage(reports: HdcReport[], fiscalYear: number): HdcCoverageResponse {
  const results: HdcSyncResult[] = reports.map((report) => ({
    ...report,
    fiscalYear,
    status: "active",
    rows: [],
    rowCount: 0,
    durationMs: 0
  }));

  return buildCoverageResponse(results, fiscalYear);
}

function buildSummary(results: Array<{ status: HdcReportStatus }>): HdcCoverageSummary {
  return {
    total: results.length,
    success: results.filter((result) => result.status === "success").length,
    noData: results.filter((result) => result.status === "no_data").length,
    error: results.filter((result) => result.status === "error").length,
    missingParameter: results.filter((result) => result.status === "missing_parameter").length,
    timeout: results.filter((result) => result.status === "timeout").length,
    schemaMismatch: results.filter((result) => result.status === "schema_mismatch").length
  };
}

function groupByCategory(results: HdcSyncResult[]) {
  const groups = new Map<string, HdcSyncResult[]>();

  for (const result of results) {
    const key = result.category || "ไม่ระบุหมวด";
    const current = groups.get(key) ?? [];
    current.push(result);
    groups.set(key, current);
  }

  return groups;
}
