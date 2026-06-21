"use client";

import type { HdcCoverageResponse, HdcReportStatus } from "@/lib/hdc-types";
import { useEffect, useState } from "react";

const EMPTY_COVERAGE: HdcCoverageResponse = {
  ok: true,
  fiscalYear: 2569,
  generatedAt: "",
  summary: {
    total: 0,
    success: 0,
    noData: 0,
    error: 0,
    missingParameter: 0,
    timeout: 0,
    schemaMismatch: 0
  },
  groups: [],
  results: [],
  errors: []
};

export default function KpiCoverageTable() {
  const [coverage, setCoverage] = useState<HdcCoverageResponse>(EMPTY_COVERAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/hdc/coverage")
      .then((response) => response.json())
      .then((data: HdcCoverageResponse) => {
        if (!cancelled) {
          setCoverage(data);
          setError("");
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : String(caught));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    const onSyncComplete = (event: Event) => {
      setCoverage((event as CustomEvent<HdcCoverageResponse>).detail);
    };

    window.addEventListener("hdc-sync-complete", onSyncComplete);

    return () => {
      cancelled = true;
      window.removeEventListener("hdc-sync-complete", onSyncComplete);
    };
  }, []);

  const summary = coverage.summary;

  return (
    <section className="section">
      <h2>ความครบถ้วนข้อมูลทุก Service Plan</h2>
      {loading ? <p className="muted">กำลังโหลด registry จาก backend...</p> : null}
      {error ? <p className="error-box">{error}</p> : null}

      <div className="metric-grid">
        <Metric label="รายงานทั้งหมด" value={summary.total} />
        <Metric label="ดึงสำเร็จ" value={summary.success} />
        <Metric label="ไม่มีข้อมูล" value={summary.noData} />
        <Metric label="error" value={summary.error} />
        <Metric label="ขาด parameter" value={summary.missingParameter} />
        <Metric label="endpoint timeout" value={summary.timeout} />
      </div>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>หมวด</th>
              <th>รายงานทั้งหมด</th>
              <th>สำเร็จ</th>
              <th>ไม่มีข้อมูล</th>
              <th>error</th>
              <th>ขาด parameter</th>
              <th>timeout</th>
              <th>schema</th>
            </tr>
          </thead>
          <tbody>
            {coverage.groups.map((group) => (
              <tr key={group.category}>
                <td>{group.category}</td>
                <td>{group.total.toLocaleString()}</td>
                <td>{group.success.toLocaleString()}</td>
                <td>{group.noData.toLocaleString()}</td>
                <td>{group.error.toLocaleString()}</td>
                <td>{group.missingParameter.toLocaleString()}</td>
                <td>{group.timeout.toLocaleString()}</td>
                <td>{group.schemaMismatch.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coverage.errors.length ? (
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>สถานะ</th>
                <th>reportCode</th>
                <th>รายงาน</th>
                <th>error</th>
              </tr>
            </thead>
            <tbody>
              {coverage.errors.slice(0, 80).map((item) => (
                <tr key={`${item.reportCode}:${item.status}:${item.title}`}>
                  <td>
                    <Status status={item.status} />
                  </td>
                  <td>{item.reportCode}</td>
                  <td>{item.title}</td>
                  <td>{item.error ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </div>
  );
}

function Status({ status }: { status: HdcReportStatus }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}
