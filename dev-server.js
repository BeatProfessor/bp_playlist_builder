import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

async function loadApiHandler(route) {
  const modulePath = join(__dirname, "api", `${route}.js`);
  try {
    const mod = await import(modulePath);
    return mod.default;
  } catch {
    return null;
  }
}

async function serveStatic(filePath, res) {
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname.startsWith("/api/")) {
    const route = url.pathname.replace("/api/", "");
    const handler = await loadApiHandler(route);
    if (handler) {
      const mockRes = {
        _status: 200,
        _headers: {},
        status(code) { mockRes._status = code; return mockRes; },
        setHeader(k, v) { mockRes._headers[k] = v; return mockRes; },
        json(body) {
          res.writeHead(mockRes._status, {
            "Content-Type": "application/json",
            ...mockRes._headers,
          });
          res.end(JSON.stringify(body));
        },
        send(body) {
          res.writeHead(mockRes._status, mockRes._headers);
          res.end(body);
        },
      };
      handler(req, mockRes);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "API route not found" }));
    }
    return;
  }

  let filePath = join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
  await serveStatic(filePath, res);
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
