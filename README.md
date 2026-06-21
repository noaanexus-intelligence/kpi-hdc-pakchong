# kpi-hdc-pakchong

Dashboard and backend proxy for syncing public HDC KPI/standard reports for Pak Chong, Nakhon Ratchasima.

## What this app does

- Builds a KPI registry from HDC public lookup endpoints instead of hardcoding selected KPIs.
- Preserves `reportCode` and `subcatalogId` from HDC.
- Uses Vercel/Next API routes as the only HDC caller:
  - `/api/hdc/catalog`
  - `/api/hdc/report`
  - `/api/hdc/sync-all`
  - `/api/hdc/coverage`
- Syncs reports with backend queue concurrency `3`, retry `2`, timeout `20s`.
- Normalizes different HDC table shapes to:
  - `reportCode`
  - `title`
  - `unitCode`
  - `unitName`
  - `target`
  - `result`
  - `rate`
  - `processedDate`
  - `raw`
- Filters normalized rows to the 24 Pak Chong service units listed in `src/lib/pakchong-units.ts`.
- Exports combined rows and error logs as CSV from the dashboard.

## HDC source endpoints

The catalog is discovered from:

- `https://api-hdc.moph.go.th/v1/lookup/standard/catalog`
- `https://api-hdc.moph.go.th/v1/lookup/standard/report?subcatalogId=...`

Report metadata and rows are loaded from:

- `https://api-center-hdc.moph.go.th/v1/report-public/info?reportCode=...&subCatalogId=...`
- `https://api-center-hdc.moph.go.th/v1/report-public/detail?reportCode=...&byear=...`
- `https://api-hdc.moph.go.th/v1/reports/province/data/{reportCode}?table_display=...`

All HDC calls include `domain: nma` and a referer to `https://hdc.moph.go.th/nma/public/main`.

## Edit the Pak Chong unit mapping

Update `src/lib/pakchong-units.ts`.

Keep this list to the service units that should appear in the dashboard. The normalizer supports multiple HDC field names such as `hoscode`, `hospcode`, `provider_code`, `a_code`, and Thai column labels before applying this mapping.

## Run locally

Install dependencies:

```bash
pnpm install
```

Start the app:

```bash
pnpm dev
```

Validate TypeScript:

```bash
npm test
```

## Deploy on Vercel

1. Push the project to GitHub.
2. Import it into Vercel as a Next.js app.
3. Deploy with the default build command:

```bash
next build
```

The sync route sets `maxDuration = 300`. If your Vercel plan has a lower serverless duration limit, use the dashboard's report limit field for smaller batches or move the sync job to a durable queue/cron worker.

## Notes

- `/api/hdc/coverage` returns the last in-memory backend sync result while the server instance is warm. For production audit history, store sync results in a database or Vercel KV.
- If a report has no Pak Chong rows, it is shown as `no_data`.
- If HDC times out or returns an endpoint error, the report remains visible in coverage with the error message.
