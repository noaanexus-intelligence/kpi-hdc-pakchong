export type HdcProvince = "nma";

export type HdcReportStatus =
  | "active"
  | "success"
  | "no_data"
  | "missing_parameter"
  | "timeout"
  | "schema_mismatch"
  | "error";

export type HdcReport = {
  province: HdcProvince;
  fiscalYear: number;
  category: string;
  categoryId: string;
  subcategory?: string;
  subcatalogId?: string;
  reportCode: string;
  title: string;
  sourceUrl: string;
  status?: HdcReportStatus;
};

export type HdcReportInfo = {
  report_name?: string;
  category_main_id?: string;
  category_main_name?: string;
  category_sub_id?: string;
  category_sub_name?: string;
  seletype?: string;
  table_display?: Array<{ value: string; name: string }>;
  byear_list?: number[];
  source_table?: string;
  data_exchange?: unknown[];
  table_freeze?: unknown[];
  year_label?: string;
  cperiod?: unknown;
  filter?: unknown;
};

export type HdcDataSource = {
  source?: string | number;
  label?: string;
  datecom?: string;
  jsonc?: HdcColumnSchema[];
  data?: HdcRawRow[];
  query?: string;
};

export type HdcColumnSchema = {
  type?: "C" | "N" | "F" | string;
  position?: string | number;
  column_name?: string;
  name?: string;
  digit_number?: number;
  formula?: string;
  sum_type?: string;
};

export type HdcRawRow = Record<string, unknown>;

export type NormalizedHdcRow = {
  reportCode: string;
  title: string;
  unitCode: string;
  unitName: string;
  target: number | string | null;
  result: number | string | null;
  rate: number | string | null;
  processedDate: string | null;
  raw: HdcRawRow;
};

export type HdcReportResponse = {
  ok: boolean;
  reportCode: string;
  subcatalogId?: string;
  year: number;
  status: HdcReportStatus;
  tableDisplay?: string;
  report?: HdcReport;
  info?: HdcReportInfo;
  rows: NormalizedHdcRow[];
  raw?: unknown;
  error?: string;
};

export type HdcSyncResult = HdcReport & {
  status: HdcReportStatus;
  rows: NormalizedHdcRow[];
  rowCount: number;
  error?: string;
  durationMs: number;
};

export type HdcCoverageSummary = {
  total: number;
  success: number;
  noData: number;
  error: number;
  missingParameter: number;
  timeout: number;
  schemaMismatch: number;
};

export type HdcCoverageGroup = {
  category: string;
  total: number;
  success: number;
  noData: number;
  error: number;
  missingParameter: number;
  timeout: number;
  schemaMismatch: number;
};

export type HdcCoverageResponse = {
  ok: boolean;
  fiscalYear: number;
  generatedAt: string;
  summary: HdcCoverageSummary;
  groups: HdcCoverageGroup[];
  results: HdcSyncResult[];
  errors: Array<{
    reportCode: string;
    title: string;
    status: HdcReportStatus;
    error?: string;
  }>;
};
