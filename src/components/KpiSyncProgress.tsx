"use client";

import type { HdcCoverageResponse, HdcSyncResult, NormalizedHdcRow } from "@/lib/hdc-types";
import { useMemo, useRef, useState } from "react";

type ProgressEventPayload = {
  completed: number;
  total: number;
  result: HdcSyncResult;
};

export default function KpiSyncProgress() {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<HdcSyncResult[]>([]);
  const [error, setError] = useState("");
  const [year, setYear] = useState("2569");
  const [limit, setLimit] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  const percent = total ? Math.round((completed / total) * 100) : 0;
  const rows = useMemo(() => results.flatMap((result) => result.rows), [results]);
  const errors = results.filter((result) => ["error", "timeout", "missing_parameter", "schema_mismatch"].includes(result.status));

  function startSync() {
    eventSourceRef.current?.close();
    setRunning(true);
    setCompleted(0);
    setTotal(0);
    setResults([]);
    setError("");

    const params = new URLSearchParams({ stream: "1", year });
    if (limit.trim()) {
      params.set("limit", limit.trim());
    }

    const source = new EventSource(`/api/hdc/sync-all?${params.toString()}`);
    eventSourceRef.current = source;

    source.addEventListener("start", () => {
      setRunning(true);
    });

    source.addEventListener("progress", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as ProgressEventPayload;
      setCompleted(payload.completed);
      setTotal(payload.total);
      setResults((previous) => upsertResult(previous, payload.result));
    });

    source.addEventListener("complete", (event) => {
      const coverage = JSON.parse((event as MessageEvent).data) as HdcCoverageResponse;
      window.dispatchEvent(new CustomEvent("hdc-sync-complete", { detail: coverage }));
      setCompleted(coverage.summary.total);
      setTotal(coverage.summary.total);
      setRunning(false);
      source.close();
      eventSourceRef.current = null;
    });

    source.addEventListener("error", (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data) as { message?: string };
        setError(payload.message ?? "HDC sync failed");
      } catch {
        setError("HDC sync failed");
      }

      setRunning(false);
      source.close();
      eventSourceRef.current = null;
    });

    source.onerror = () => {
      if (eventSourceRef.current === source) {
        setError("การเชื่อมต่อ progress ขาดหายระหว่างประมวลผล");
        setRunning(false);
        eventSourceRef.current = null;
      }
      source.close();
    };
  }

  function stopSync() {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setRunning(false);
  }

  return (
    <section className="section">
      <h2>ประมวลผลทุก KPI</h2>
      <div className="controls">
        <div className="field">
          <label htmlFor="sync-year">ปีงบประมาณ</label>
          <input id="sync-year" value={year} onChange={(event) => setYear(event.target.value)} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor="sync-limit">จำกัดจำนวนรายงาน</label>
          <input
            id="sync-limit"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            inputMode="numeric"
            placeholder="ว่าง = ทั้งหมด"
          />
        </div>
      </div>

      <div className="toolbar">
        <button className="primary-button" onClick={startSync} disabled={running}>
          ▶ ประมวลผลทั้งหมด
        </button>
        <button className="secondary-button" onClick={stopSync} disabled={!running}>
          ■ หยุด progress
        </button>
        <button className="secondary-button" onClick={() => exportRowsCsv(rows)} disabled={!rows.length}>
          ⇩ Export CSV
        </button>
        <button className="secondary-button" onClick={() => exportErrorsCsv(errors)} disabled={!errors.length}>
          ⇩ Error log
        </button>
      </div>

      <div className="progress-track" aria-label="sync progress">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
        {completed.toLocaleString()} / {total.toLocaleString()} รายงาน ({percent}%)
      </p>

      {error ? <p className="error-box">{error}</p> : null}
    </section>
  );
}

function upsertResult(previous: HdcSyncResult[], next: HdcSyncResult) {
  const key = `${next.reportCode}:${next.subcatalogId ?? ""}`;
  const index = previous.findIndex((result) => `${result.reportCode}:${result.subcatalogId ?? ""}` === key);

  if (index === -1) {
    return [...previous, next];
  }

  const updated = previous.slice();
  updated[index] = next;
  return updated;
}

function exportRowsCsv(rows: NormalizedHdcRow[]) {
  const csvRows = [
    ["reportCode", "title", "unitCode", "unitName", "target", "result", "rate", "processedDate"],
    ...rows.map((row) => [
      row.reportCode,
      row.title,
      row.unitCode,
      row.unitName,
      row.target ?? "",
      row.result ?? "",
      row.rate ?? "",
      row.processedDate ?? ""
    ])
  ];

  downloadCsv("hdc-pakchong-results.csv", csvRows);
}

function exportErrorsCsv(results: HdcSyncResult[]) {
  const csvRows = [
    ["reportCode", "subcatalogId", "title", "status", "error"],
    ...results.map((result) => [
      result.reportCode,
      result.subcatalogId ?? "",
      result.title,
      result.status,
      result.error ?? ""
    ])
  ];

  downloadCsv("hdc-pakchong-errors.csv", csvRows);
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
