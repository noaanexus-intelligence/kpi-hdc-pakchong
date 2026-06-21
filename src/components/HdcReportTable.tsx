"use client";

import type { HdcReport } from "@/lib/hdc-types";
import { useEffect, useMemo, useState } from "react";

type CatalogResponse = {
  ok: boolean;
  fiscalYear: number;
  count: number;
  reports: HdcReport[];
};

export default function HdcReportTable() {
  const [reports, setReports] = useState<HdcReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/hdc/catalog")
      .then((response) => response.json())
      .then((data: CatalogResponse) => {
        if (!cancelled) {
          setReports(data.reports ?? []);
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

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(reports.map((report) => report.category))).sort((a, b) => a.localeCompare(b, "th"));
  }, [reports]);

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesCategory = category === "all" || report.category === category;
      const matchesQuery =
        !normalizedQuery ||
        report.title.toLowerCase().includes(normalizedQuery) ||
        report.reportCode.toLowerCase().includes(normalizedQuery) ||
        report.subcatalogId?.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query, reports]);

  return (
    <section className="section">
      <h2>KPI Registry</h2>
      {loading ? <p className="muted">กำลังโหลดเมนูจาก HDC ผ่าน backend...</p> : null}
      {error ? <p className="error-box">{error}</p> : null}

      <div className="controls">
        <div className="field">
          <label htmlFor="report-search">ค้นหา</label>
          <input
            id="report-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ชื่อรายงาน หรือ reportCode"
          />
        </div>
        <div className="field">
          <label htmlFor="category-filter">หมวด</label>
          <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">ทั้งหมด</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="muted">{filteredReports.length.toLocaleString()} จาก {reports.length.toLocaleString()} รายงาน</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>หมวด</th>
              <th>หมวดย่อย</th>
              <th>รายงาน</th>
              <th>reportCode</th>
              <th>subcatalogId</th>
              <th>แหล่งที่มา</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.slice(0, 250).map((report) => (
              <tr key={`${report.reportCode}:${report.subcatalogId ?? ""}`}>
                <td>{report.category}</td>
                <td>{report.subcategory ?? "-"}</td>
                <td>{report.title}</td>
                <td>{report.reportCode}</td>
                <td>{report.subcatalogId ?? "-"}</td>
                <td>
                  <a href={report.sourceUrl} target="_blank" rel="noreferrer">
                    HDC
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredReports.length > 250 ? <p className="muted" style={{ marginTop: 10 }}>แสดง 250 รายการแรก ใช้ช่องค้นหาเพื่อกรองให้แคบลง</p> : null}
    </section>
  );
}
