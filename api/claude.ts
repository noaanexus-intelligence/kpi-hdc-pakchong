export const config = { runtime: "edge" };

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-6";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
  if (!apiKey) {
    return json({ ok: false, error: "ไม่พบ ANTHROPIC_API_KEY — ตั้งค่า Environment Variable ใน Vercel" }, 503);
  }

  let payload: { question?: string; context?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "invalid JSON" }, 400);
  }

  const question = String(payload.question ?? "").trim();
  const context = String(payload.context ?? "").trim();
  if (!question) return json({ ok: false, error: "ไม่มีคำถาม" }, 400);

  const userContent = context
    ? `ข้อมูลปัจจุบันบนหน้าจอ:\n${context}\n\nคำถาม: ${question}`
    : question;

  const upstream = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system:
        "คุณคือ iQ ผู้ช่วยวิเคราะห์ KPI สาธารณสุขของ สสอ.ปากช่อง จังหวัดนครราชสีมา " +
        "ตอบเป็นภาษาไทยเสมอ กระชับ ตรงประเด็น ไม่แนะนำตัวซ้ำ " +
        "วิเคราะห์เชิงสาธารณสุข ชี้จุดเสี่ยง แนะนำการติดตามเชิงปฏิบัติ",
      messages: [{ role: "user", content: userContent }],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!upstream.ok) {
    let errMsg = `Anthropic API error ${upstream.status}`;
    try {
      const errBody = await upstream.json() as { error?: { message?: string } };
      errMsg = errBody?.error?.message ?? errMsg;
    } catch { /* ignore */ }
    return json({ ok: false, error: errMsg }, upstream.status);
  }

  const result = await upstream.json() as { content: Array<{ text: string }> };
  const answer = result.content[0]?.text ?? "";
  return json({ ok: true, answer });
};
