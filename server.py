"""Local-only static server and shared state transport. Python 3.8+."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import threading
import os

os.chdir(Path(__file__).resolve().parent)
lock = threading.Lock()
state = None
revision = 0

class Handler(SimpleHTTPRequestHandler):
    def reply(self, value, status=200):
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/state":
            with lock:
                snapshot = {"revision": revision, "state": state}
            self.reply(snapshot)
        else:
            super().do_GET()

    def do_POST(self):
        global state, revision
        if self.path != "/api/state":
            return self.reply({"error": "Not found"}, 404)
        if self.headers.get("Origin") not in (None, "http://127.0.0.1:8765", "http://localhost:8765"):
            return self.reply({"error": "Origin rejected"}, 403)
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 65536 or self.headers.get_content_type() != "application/json":
                raise ValueError("Invalid request")
            value = json.loads(self.rfile.read(length))
            if not isinstance(value, dict) or type(value.get("stage")) is not int or not 0 <= value["stage"] <= 4:
                raise ValueError("Invalid state")
        except (ValueError, TypeError):
            return self.reply({"error": "Invalid state"}, 400)
        with lock:
            state = value
            revision += 1
            snapshot = {"revision": revision}
        self.reply(snapshot)

if __name__ == "__main__":
    print("Producer: http://127.0.0.1:8765/")
    ThreadingHTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
