export const config = { runtime: "edge" };

const UPSTREAM = "https://api-hdc.moph.go.th/v1/";

function cors(body: BodyInit | null, status: number, contentType: string) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" },
    });
  }

  const url = new URL(req.url);
  const suffix = url.pathname.replace(/^\/api\/hdc\//, "");
  const target = UPSTREAM + suffix + (url.search || "");

  try {
    const upstream = await fetch(target, {
      headers: {
        domain: "nma",
        "User-Agent": "HDC-Pakchong/1.0",
        Accept: "application/json,*/*",
        "Cache-Control": "no-cache",
      },
    });
    const body = await upstream.arrayBuffer();
    const ct = upstream.headers.get("Content-Type") ?? "application/json";
    return cors(body, upstream.status, ct);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return cors(JSON.stringify({ ok: false, error: msg }), 502, "application/json; charset=utf-8");
  }
};
