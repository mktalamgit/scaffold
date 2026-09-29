const { spawn } = require("node:child_process");

const children = [
  ["api", "apps/api/server.js"],
  ["web", "apps/web/server.js"],
].map(([name, file]) => {
  const child = spawn(process.execPath, [file], {
    env: process.env,
    stdio: "inherit",
  });
  child.on("exit", (code, signal) => {
    if (code && !signal) process.exitCode = code;
  });
  return child;
});

function shutdown() {
  for (const child of children) child.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
