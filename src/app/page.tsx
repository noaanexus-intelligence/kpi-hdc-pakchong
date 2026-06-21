import HdcReportTable from "@/components/HdcReportTable";
import KpiCoverageTable from "@/components/KpiCoverageTable";
import KpiSyncProgress from "@/components/KpiSyncProgress";

export default function Home() {
  return (
    <main className="app-shell">
      <section className="page-head">
        <div>
          <p className="kicker">HDC Public นครราชสีมา</p>
          <h1>ตรวจความครบถ้วน KPI ปากช่อง</h1>
          <p className="lede">
            ดึงรายการรายงานจาก HDC ผ่าน backend proxy, sync แบบ queue, normalize ตาราง และกรองเฉพาะ 24 หน่วยบริการปากช่อง
          </p>
        </div>
        <a className="source-link" href="https://hdc.moph.go.th/nma/public/main" target="_blank" rel="noreferrer">
          เปิด HDC
        </a>
      </section>

      <KpiSyncProgress />
      <KpiCoverageTable />
      <HdcReportTable />
    </main>
  );
}
