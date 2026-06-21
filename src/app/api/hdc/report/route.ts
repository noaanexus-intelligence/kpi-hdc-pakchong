import { normalizeFiscalYear } from "@/lib/hdc-client";
import { fetchSingleReport } from "@/lib/hdc-sync";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reportCode = searchParams.get("reportCode") ?? "";
  const subcatalogId = searchParams.get("subcatalogId") ?? searchParams.get("subCatalogId") ?? undefined;
  const fiscalYear = normalizeFiscalYear(searchParams.get("year"));
  const tableDisplay = searchParams.get("tableDisplay");

  const result = await fetchSingleReport({
    reportCode,
    subcatalogId,
    fiscalYear,
    tableDisplay
  });

  return NextResponse.json(result, {
    status: result.ok ? 200 : result.status === "missing_parameter" ? 400 : 502
  });
}
