import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


UPSTREAMS = {
    "/api/hdc/": "https://api-hdc.moph.go.th/v1/",
    "/api/center/": "https://api-center-hdc.moph.go.th/v1/",
}

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_MODEL = "claude-sonnet-4-6"


class HdcHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        for prefix, upstream in UPSTREAMS.items():
            if self.path.startswith(prefix):
                self._proxy(prefix, upstream)
                return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/claude":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            self._claude(body)
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _proxy(self, prefix, upstream):
        parsed = urlsplit(self.path)
        target = upstream + parsed.path[len(prefix):]
        if parsed.query:
            target += "?" + parsed.query

        request = Request(
            target,
            headers={
                "domain": "nma",
                "User-Agent": "HDC-Pakchong-local/1.0",
                "Accept": "application/json,text/plain,*/*",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            },
        )

        try:
            with urlopen(request, timeout=60) as response:
                body = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", response.headers.get("Content-Type", "application/json"))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "no-store")
                self.send_header("Pragma", "no-cache")
                self.end_headers()
                self.wfile.write(body)
        except HTTPError as error:
            body = error.read()
            self.send_response(error.code)
            self.send_header("Content-Type", error.headers.get("Content-Type", "application/json"))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        except URLError as error:
            message = ('{"ok":false,"error":"%s"}' % str(error.reason).replace('"', "'")).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(message)

    def _claude(self, body_bytes):
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            self._send_json({
                "ok": False,
                "error": "ไม่พบ ANTHROPIC_API_KEY — ตั้งค่า environment variable แล้วรีสตาร์ท server.py"
            }, 503)
            return

        try:
            payload = json.loads(body_bytes)
        except Exception:
            self._send_json({"ok": False, "error": "invalid JSON"}, 400)
            return

        question = str(payload.get("question", "")).strip()
        context = str(payload.get("context", "")).strip()
        if not question:
            self._send_json({"ok": False, "error": "ไม่มีคำถาม"}, 400)
            return

        user_content = (
            f"ข้อมูลปัจจุบันบนหน้าจอ:\n{context}\n\nคำถาม: {question}"
            if context else question
        )

        request_body = json.dumps({
            "model": CLAUDE_MODEL,
            "max_tokens": 1024,
            "system": (
                "คุณคือ iQ ผู้ช่วยวิเคราะห์ KPI สาธารณสุขของ สสอ.ปากช่อง จังหวัดนครราชสีมา "
                "ตอบเป็นภาษาไทยเสมอ กระชับ ตรงประเด็น ไม่แนะนำตัวซ้ำ "
                "วิเคราะห์เชิงสาธารณสุข ชี้จุดเสี่ยง แนะนำการติดตามเชิงปฏิบัติ"
            ),
            "messages": [{"role": "user", "content": user_content}],
        }, ensure_ascii=False).encode("utf-8")

        req = Request(
            ANTHROPIC_URL,
            data=request_body,
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )

        try:
            with urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
                answer = result["content"][0]["text"]
                self._send_json({"ok": True, "answer": answer})
        except HTTPError as e:
            try:
                err = json.loads(e.read()).get("error", {}).get("message", str(e))
            except Exception:
                err = str(e)
            self._send_json({"ok": False, "error": err}, e.code)
        except URLError as e:
            self._send_json({"ok": False, "error": str(e.reason)}, 502)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    status = "พร้อมใช้งาน" if api_key else "ไม่พบ ANTHROPIC_API_KEY — iQ จะใช้โหมด keyword fallback"
    server = ThreadingHTTPServer(("127.0.0.1", 4173), HdcHandler)
    print(f"HDC Pakchong server: http://127.0.0.1:4173/")
    print(f"Claude iQ: {status}")
    server.serve_forever()
