import { getHdcReportRegistry } from "@/lib/hdc-catalog";
import { normalizeFiscalYear } from "@/lib/hdc-client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fiscalYear = normalizeFiscalYear(searchParams.get("year"));
  const reports = await getHdcReportRegistry({ fiscalYear });

  return NextResponse.json({
    ok: true,
    fiscalYear,
    source: "https://hdc.moph.go.th/nma/public/main",
    count: reports.length,
    reports
  });
}
