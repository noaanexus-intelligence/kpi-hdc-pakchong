export const config = { runtime: "edge" };

const UPSTREAM = "https://api-hdc.moph.go.th/v1/";

export default async (req: Request) => {
  const url = new URL(req.url);
  const suffix = url.pathname.replace(/^\/api\/hdc\//, "");
  const target = UPSTREAM + suffix + (url.search || "");

  const upstream = await fetch(target, {
    headers: {
      domain: "nma",
      "User-Agent": "HDC-Pakchong-local/1.0",
      Accept: "application/json,text/plain,*/*",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    signal: AbortSignal.timeout(60_000),
  });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
};
