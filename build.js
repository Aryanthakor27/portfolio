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

  // Step 3: Build Next.js frontend production bundle
  console.log("\n⚡ [3/3] Building Next.js static production export...");
  execSync("npm run build --prefix frontend", { stdio: "inherit", cwd: __dirname });

  // Step 4: Sync Next.js output (frontend/out) to frontend/dist and root ./dist
  const rootDist = path.join(__dirname, "dist");
  const frontendOut = path.join(__dirname, "frontend", "out");
  const frontendDist = path.join(__dirname, "frontend", "dist");

  const sourceDir = fs.existsSync(frontendOut) ? frontendOut : frontendDist;

  // Sync to frontend/dist for Express backend static serving
  if (sourceDir === frontendOut) {
    if (fs.existsSync(frontendDist)) {
      fs.rmSync(frontendDist, { recursive: true, force: true });
    }
    fs.cpSync(frontendOut, frontendDist, { recursive: true });
  }

  // Sync to root ./dist for Render Static Site compatibility
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(sourceDir, rootDist, { recursive: true });

  // Step 5: Verification
  const distHtml = path.join(frontendDist, "index.html");
  const rootHtml = path.join(rootDist, "index.html");
  if (!fs.existsSync(distHtml) || !fs.existsSync(rootHtml)) {
    throw new Error("Build verification failed: index.html was not found in exported output.");
  }

  console.log("\n========================================================");
  console.log("✅ SUCCESS: Aryan Thakor Portfolio Next.js built successfully!");
  console.log("   Ready for Web Service (via Express backend)");
  console.log("   Ready for Static Site (via ./dist, ./frontend/dist, or ./frontend/out)");
  console.log("========================================================\n");
} catch (err) {
  console.error("\n❌ Build failed with error:", err.message || err);
  process.exit(1);
}
