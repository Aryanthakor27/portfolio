import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("\n========================================================");
console.log("🚀 Starting Aryan Thakor Portfolio Full-Stack Build...");
console.log("========================================================\n");

try {
  // Step 1: Backend Dependencies
  console.log("📦 [1/3] Installing backend dependencies...");
  execSync("npm install --prefix backend", { stdio: "inherit", cwd: __dirname });

  // Step 2: Frontend Dependencies (including dev dependencies like Vite & Tailwind)
  console.log("\n📦 [2/3] Installing frontend dependencies (including build tools)...");
  execSync("npm install --prefix frontend --include=dev", { stdio: "inherit", cwd: __dirname });

  // Step 3: Build Frontend Production Assets
  console.log("\n⚡ [3/3] Building Vite frontend production bundle...");
  execSync("npm run build --prefix frontend", { stdio: "inherit", cwd: __dirname });

  // Step 4: Verification
  const distHtml = path.join(__dirname, "frontend", "dist", "index.html");
  if (!fs.existsSync(distHtml)) {
    throw new Error("Build verification failed: frontend/dist/index.html was not found.");
  }

  console.log("\n========================================================");
  console.log("✅ SUCCESS: Aryan Thakor Portfolio built successfully!");
  console.log("   Frontend bundle verified at: frontend/dist");
  console.log("   Ready to serve via Express on Render.com");
  console.log("========================================================\n");
} catch (err) {
  console.error("\n❌ Build failed with error:", err.message || err);
  process.exit(1);
}
