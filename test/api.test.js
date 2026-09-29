const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { server, tasks } = require("../apps/api/server");

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const req = http.request({ method, path, port: 0 }, (res) => {
      let text = "";
      res.on("data", (chunk) => { text += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null }));
    });
    req.on("error", reject);
    if (data) req.end(JSON.stringify(data)); else req.end();
  });
}

test("API creates and lists tasks", async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const original = http.request;
  http.request = (options, callback) => original({ ...options, port: address.port, headers: { "content-type": "application/json" } }, callback);
  try {
    const created = await request("POST", "/tasks", { title: "Test task" });
    assert.equal(created.status, 201);
    assert.equal((await request("GET", "/tasks")).body[0].title, "Test task");
  } finally {
    http.request = original;
    tasks.clear();
    await new Promise((resolve) => server.close(resolve));
  }
});
