import type { HdcDataSource, HdcReport, HdcReportInfo } from "./hdc-types";
import {
  NAKHON_RATCHASIMA_PROVINCE_CODE,
  PAKCHONG_DISTRICT_CODE
} from "./pakchong-units";
import { retry } from "./sync-queue";

export const HDC_WEB_BASE = "https://hdc.moph.go.th/nma/public";
export const HDC_LOOKUP_API_BASE = "https://api-hdc.moph.go.th/v1";
export const HDC_CENTER_API_BASE = "https://api-center-hdc.moph.go.th/v1";

export const DEFAULT_HDC_TIMEOUT_MS = 20_000;
export const DEFAULT_HDC_RETRIES = 2;

type HdcJson<T> = {
  ok?: boolean;
  rows?: T;
  code?: number;
  error?: string;
  error_code?: string;
  status?: number;
};

type StandardCatalogItem = {
  code: string;
  name: string;
  sub_menu?: Array<{ code: string; name: string }>;
};

type StandardReportItem = {
  active?: boolean;
  report_name?: string;
  title_name?: string;
  report_code?: string | null;
  report_names?: string;
};

type HdcReportDataOptions = {
  reportCode: string;
  tableDisplay: string;
  fiscalYear: number;
  month?: string;
  zone?: string;
  provinceCode?: string;
  districtCode?: string;
  subdistrictCode?: string;
  departmentCode?: string;
  organizationType?: string;
  ministry?: string;
  hospital?: string;
  servicePlan?: string;
  jurisdictionCode?: string;
  freezeMonth?: string;
  mentalCode?: string;
  mentalGroupCode?: string;
  custom?: unknown[];
};

export class HdcRequestError extends Error {
  status?: number;
  url: string;

  constructor(message: string, url: string, status?: number) {
    super(message);
    this.name = "HdcRequestError";
    this.url = url;
    this.status = status;
  }
}

export class HdcTimeoutError extends Error {
  url: string;

  constructor(url: string) {
    super(`HDC request timed out after ${DEFAULT_HDC_TIMEOUT_MS / 1000} seconds`);
    this.name = "HdcTimeoutError";
    this.url = url;
  }
}

export function currentThaiFiscalYear() {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const startsNextFiscalYear = now.getMonth() >= 9;
  return gregorianYear + (startsNextFiscalYear ? 544 : 543);
}

export function normalizeFiscalYear(input?: string | number | null) {
  if (!input) {
    return currentThaiFiscalYear();
  }

  const parsed = Number(input);
  if (!Number.isFinite(parsed)) {
    return currentThaiFiscalYear();
  }

  return parsed < 2500 ? parsed + 543 : parsed;
}

export async function fetchHdcJson<T>(
  url: string,
  options: {
    timeoutMs?: number;
    retries?: number;
    revalidate?: number;
  } = {}
) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_HDC_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_HDC_RETRIES;

  return retry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Referer: `${HDC_WEB_BASE}/main`,
          "User-Agent": "Mozilla/5.0 (compatible; kpi-hdc-pakchong/0.1)",
          domain: "nma"
        },
        signal: controller.signal,
        next: { revalidate: options.revalidate ?? 3600 }
      } as RequestInit & { next?: { revalidate: number } });

      if (!response.ok) {
        throw new HdcRequestError(`HDC returned ${response.status}`, url, response.status);
      }

      const payload = (await response.json()) as HdcJson<T>;
      if (payload.ok === false) {
        throw new HdcRequestError(payload.error_code ?? payload.error ?? "HDC returned ok=false", url, payload.status);
      }

      return payload;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new HdcTimeoutError(url);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }, retries, 650);
}

export async function fetchStandardCatalog() {
  const url = `${HDC_LOOKUP_API_BASE}/lookup/standard/catalog`;
  const payload = await fetchHdcJson<StandardCatalogItem[]>(url);
  return Array.isArray(payload.rows) ? payload.rows : [];
}

export async function fetchStandardReportsBySubcatalog(subcatalogId: string) {
  const url = new URL(`${HDC_LOOKUP_API_BASE}/lookup/standard/report`);
  url.searchParams.set("subcatalogId", subcatalogId);
  const payload = await fetchHdcJson<StandardReportItem[]>(url.toString());
  return Array.isArray(payload.rows) ? payload.rows : [];
}

export async function fetchReportInfo(reportCode: string, subcatalogId?: string) {
  const url = new URL(`${HDC_CENTER_API_BASE}/report-public/info`);
  url.searchParams.set("reportCode", reportCode);
  url.searchParams.set("subCatalogId", subcatalogId ?? "");
  const payload = await fetchHdcJson<HdcReportInfo>(url.toString());
  return payload.rows ?? {};
}

export async function fetchReportDetail(reportCode: string, fiscalYear: number) {
  const url = new URL(`${HDC_CENTER_API_BASE}/report-public/detail`);
  url.searchParams.set("reportCode", reportCode);
  url.searchParams.set("byear", String(fiscalYear));
  const payload = await fetchHdcJson<unknown>(url.toString());
  return payload.rows;
}

export async function fetchReportData(options: HdcReportDataOptions) {
  const url = new URL(`${HDC_LOOKUP_API_BASE}/reports/province/data/${options.reportCode}`);
  url.searchParams.set("table_display", options.tableDisplay);
  url.searchParams.set("year", String(options.fiscalYear));
  url.searchParams.set("month", options.month ?? "ALL");
  url.searchParams.set("zone", options.zone ?? "ALL");
  url.searchParams.set("province_code", options.provinceCode ?? NAKHON_RATCHASIMA_PROVINCE_CODE);
  url.searchParams.set("district_code", options.districtCode ?? PAKCHONG_DISTRICT_CODE);
  url.searchParams.set("subdistrict_code", options.subdistrictCode ?? "ALL");
  url.searchParams.set("department_code", options.departmentCode ?? "ALL");
  url.searchParams.set("organization_type", options.organizationType ?? "ALL");
  url.searchParams.set("ministry", options.ministry ?? "ALL");
  url.searchParams.set("hospital", options.hospital ?? "ALL");
  url.searchParams.set("service_plan", options.servicePlan ?? "ALL");
  url.searchParams.set("jurisdiction_code", options.jurisdictionCode ?? "ALL");
  url.searchParams.set("freeze_month", options.freezeMonth ?? "ALL");
  url.searchParams.set("mental_code", options.mentalCode ?? "ALL");
  url.searchParams.set("mental_group_code", options.mentalGroupCode ?? "ALL");
  url.searchParams.set("custom", JSON.stringify(options.custom ?? []));

  const payload = await fetchHdcJson<HdcDataSource[]>(url.toString(), {
    revalidate: 900
  });

  return Array.isArray(payload.rows) ? payload.rows : [];
}

export function chooseTableDisplay(reportInfo?: HdcReportInfo, requested?: string | null) {
  const available = reportInfo?.table_display?.map((display) => display.value) ?? [];

  if (requested && available.includes(requested)) {
    return requested;
  }

  for (const candidate of ["provider", "hospital", "cup", "ampur", "province"]) {
    if (available.includes(candidate)) {
      return candidate;
    }
  }

  return available[0] ?? "provider";
}

export function getSourceUrl(report: Pick<HdcReport, "reportCode" | "subcatalogId">) {
  const url = new URL(`${HDC_WEB_BASE}/standard-report-detail/${report.reportCode}`);
  if (report.subcatalogId) {
    url.searchParams.set("subcatalogId", report.subcatalogId);
  }

  return url.toString();
}

export function isTimeoutError(error: unknown) {
  return error instanceof HdcTimeoutError || (error instanceof Error && error.name === "AbortError");
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
