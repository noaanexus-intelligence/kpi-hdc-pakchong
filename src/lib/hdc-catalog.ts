import {
  fetchStandardCatalog,
  fetchStandardReportsBySubcatalog,
  getSourceUrl,
  normalizeFiscalYear,
  stripHtmlTags
} from "./hdc-client";
import type { HdcReport } from "./hdc-types";
import { mapWithConcurrency } from "./sync-queue";

type CatalogOptions = {
  fiscalYear?: string | number | null;
};

export async function getHdcReportRegistry(options: CatalogOptions = {}) {
  const fiscalYear = normalizeFiscalYear(options.fiscalYear);
  const categories = await fetchStandardCatalog();

  const nested = await mapWithConcurrency(
    categories,
    async (category) => {
      const submenus = category.sub_menu ?? [];

      const reportsBySubcatalog = await mapWithConcurrency(
        submenus,
        async (subcategory) => {
          const rows = await fetchStandardReportsBySubcatalog(subcategory.code);

          return rows
            .filter((row) => row.active !== false)
            .map((row) => {
              const reportCode = String(row.report_code ?? "").trim();
              if (!reportCode) {
                return null;
              }

              const report: HdcReport = {
                province: "nma",
                fiscalYear,
                category: category.name,
                categoryId: category.code,
                subcategory: subcategory.name,
                subcatalogId: subcategory.code,
                reportCode,
                title: stripHtmlTags(row.report_name ?? row.title_name ?? row.report_names ?? reportCode),
                sourceUrl: ""
              };

              report.sourceUrl = getSourceUrl(report);
              return report;
            })
            .filter(Boolean) as HdcReport[];
        },
        { concurrency: 3, delayMs: 150 }
      );

      return reportsBySubcatalog.flat();
    },
    { concurrency: 2, delayMs: 200 }
  );

  return dedupeReports(nested.flat());
}

function dedupeReports(reports: HdcReport[]) {
  const seen = new Set<string>();
  const deduped: HdcReport[] = [];

  for (const report of reports) {
    const key = `${report.reportCode}:${report.subcatalogId ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(report);
    }
  }

  return deduped;
}
