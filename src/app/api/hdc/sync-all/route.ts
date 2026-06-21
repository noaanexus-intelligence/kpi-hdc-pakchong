import { normalizeFiscalYear } from "@/lib/hdc-client";
import { setLastCoverage } from "@/lib/hdc-sync-store";
import { runHdcSync } from "@/lib/hdc-sync";
import type { HdcCoverageResponse, HdcSyncResult } from "@/lib/hdc-types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fiscalYear = normalizeFiscalYear(searchParams.get("year"));
  const limit = parsePositiveInt(searchParams.get("limit"));
  const stream = searchParams.get("stream") === "1";

  if (stream) {
    return streamSync(fiscalYear, limit);
  }

  const coverage = await runHdcSync({ fiscalYear, limit });
  setLastCoverage(coverage);
  return NextResponse.json(coverage);
}

function streamSync(fiscalYear: number, limit?: number) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send("start", { fiscalYear, limit });
        const coverage = await runHdcSync({
          fiscalYear,
          limit,
          onProgress: ({ completed, total, result }) => {
            send("progress", {
              completed,
              total,
              result: compactResult(result, true)
            });
          }
        });

        setLastCoverage(coverage);
        send("complete", compactCoverage(coverage));
        controller.close();
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : String(error)
        });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8"
    }
  });
}

function compactCoverage(coverage: HdcCoverageResponse) {
  return {
    ...coverage,
    results: coverage.results.map((result) => compactResult(result, false))
  };
}

function compactResult(result: HdcSyncResult, includeRows: boolean) {
  return {
    ...result,
    rows: includeRows ? result.rows : [],
    rowCount: result.rowCount
  };
}

function parsePositiveInt(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
}
