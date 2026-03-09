// Local deploy server - runs on your PC
// Start with: node deploy-server.js
// The backoffice "Deploy" button calls this server

const http = require("http");
const { execSync } = require("child_process");
const path = require("path");

const PORT = 4567;
const SECRET = "eva-deploy-2026-secret-key";
const PROJECT_DIR = __dirname;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-Deploy-Secret, Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  // Check secret
  if (req.headers["x-deploy-secret"] !== SECRET) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  console.log("[DEPLOY] Starting build + deploy...");

  try {
    // Build
    console.log("[DEPLOY] Running npm run build...");
    execSync("npm run build", { cwd: PROJECT_DIR, stdio: "inherit" });

    // Compress
    console.log("[DEPLOY] Compressing output...");
    execSync("tar -czf /tmp/out.tar.gz -C out .", { cwd: PROJECT_DIR, stdio: "inherit" });

    // Upload
    console.log("[DEPLOY] Uploading to server...");
    execSync(
      'scp -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no /tmp/out.tar.gz evaplace@km31109.keymachine.de:/www/out.tar.gz',
      { stdio: "inherit" }
    );

    // Deploy on server
    console.log("[DEPLOY] Deploying on server...");
    execSync(
      'ssh -i ~/.ssh/id_ed25519 evaplace@km31109.keymachine.de "cd /www && rm -rf out_old && mv out out_old && mkdir out && tar -xzf out.tar.gz -C out && rm out.tar.gz"',
      { stdio: "inherit" }
    );

    console.log("[DEPLOY] Done!");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "Deploy completo!", timestamp: new Date().toISOString() }));
  } catch (err) {
    console.error("[DEPLOY] Error:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`[DEPLOY SERVER] Running on http://localhost:${PORT}`);
  console.log("[DEPLOY SERVER] Waiting for deploy requests from backoffice...");
});
