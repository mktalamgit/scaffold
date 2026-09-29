const http = require("node:http");
const { URL } = require("node:url");

const port = Number(process.env.API_PORT || 3001);
let nextId = 1;
const tasks = new Map();

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function body(req) {
  return new Promise((resolve, reject) => {
    let value = "";
    req.on("data", (chunk) => { value += chunk; });
    req.on("end", () => {
      try { resolve(value ? JSON.parse(value) : {}); } catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (req.method === "GET" && url.pathname === "/health") return json(res, 200, { ok: true });
  if (url.pathname === "/tasks" && req.method === "GET") return json(res, 200, [...tasks.values()]);

  const match = url.pathname.match(/^\/tasks\/(\d+)$/);
  if (match && req.method === "DELETE") {
    if (!tasks.delete(Number(match[1]))) return json(res, 404, { error: "Task not found" });
    return res.writeHead(204).end();
  }
  if (match && req.method === "PATCH") {
    if (!tasks.has(Number(match[1]))) return json(res, 404, { error: "Task not found" });
    try {
      const update = await body(req);
      const task = { ...tasks.get(Number(match[1])), ...update, id: Number(match[1]) };
      tasks.set(task.id, task);
      return json(res, 200, task);
    } catch { return json(res, 400, { error: "Invalid JSON" }); }
  }
  if (url.pathname === "/tasks" && req.method === "POST") {
    try {
      const input = await body(req);
      if (!String(input.title || "").trim()) return json(res, 422, { error: "Title is required" });
      const task = { id: nextId++, title: String(input.title).trim(), completed: Boolean(input.completed) };
      tasks.set(task.id, task);
      return json(res, 201, task);
    } catch { return json(res, 400, { error: "Invalid JSON" }); }
  }
  json(res, 404, { error: "Not found" });
});

if (require.main === module) server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
module.exports = { server, tasks };
