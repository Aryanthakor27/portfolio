import express from "express";
import cors from "cors";
import {
  getWebsites,
  addWebsite,
  updateWebsite,
  deleteWebsite,
  getDesigns,
  addDesign,
  updateDesign,
  deleteDesign,
  getMessages,
  addMessage,
  deleteMessage,
  getCredentials,
  addCredential,
  updateCredential,
  deleteCredential
} from "./dataStore.js";
import {
  getContent,
  updateSection,
  updateAllContent
} from "./cmsStore.js";
import {
  getAuthConfig,
  verifyPasscode,
  changePasscode,
  generate2FASetup,
  verifyAndEnable2FA,
  disable2FA,
  verify2FAToken,
  createSession,
  verifySession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit
} from "./authStore.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_DOCS_DIR = path.resolve(__dirname, "../frontend/public/assets/documents");
const BACKEND_STORE_DIR = path.resolve(__dirname, "./data/store");
const RESUME_FILENAME = "AryanThakorResume.pdf";
const RESUME_META_FILE = path.join(BACKEND_STORE_DIR, "resumeMeta.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- Security Middleware ---
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Check if passcode header is present as fallback
    const fallbackPass = req.headers["x-admin-passcode"];
    if (fallbackPass) {
      const isValid = await verifyPasscode(fallbackPass);
      if (isValid) return next();
    }
    return res.status(401).json({ error: "Unauthorized: Valid admin session token required." });
  }

  const token = authHeader.split(" ")[1];
  const isValid = await verifySession(token);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized: Session expired or invalid." });
  }
  next();
}

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Aryan Thakor Portfolio MERN Backend & CMS",
    timestamp: new Date()
  });
});

// ==========================================================================
// AUTHENTICATION & GOOGLE AUTHENTICATOR (TOTP 2FA) ENDPOINTS
// ==========================================================================

// Get current 2FA status
app.get("/api/admin/2fa/status", async (req, res) => {
  try {
    const config = await getAuthConfig();
    res.json({
      twoFactorEnabled: !!config.twoFactorEnabled
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read 2FA status." });
  }
});

// Admin Login with Passcode + optional Google Authenticator 2FA
app.post("/api/admin/login", async (req, res) => {
  const clientKey = req.ip || "admin-client";
  const rateLimit = checkRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: rateLimit.error });
  }

  const { passcode, twoFactorToken } = req.body;

  if (!passcode) {
    return res.status(400).json({ error: "Admin passcode is required." });
  }

  const isPasscodeValid = await verifyPasscode(passcode);
  if (!isPasscodeValid) {
    recordFailedAttempt(clientKey);
    return res.status(401).json({ error: "Incorrect admin passcode." });
  }

  const config = await getAuthConfig();

  // If 2FA is enabled, verify the 6-digit TOTP code
  if (config.twoFactorEnabled) {
    if (!twoFactorToken) {
      return res.status(200).json({
        requires2FA: true,
        message: "Passcode verified. Please enter your 6-digit Google Authenticator code."
      });
    }

    const is2FAValid = await verify2FAToken(twoFactorToken);
    if (!is2FAValid) {
      recordFailedAttempt(clientKey);
      return res.status(401).json({ error: "Invalid Google Authenticator code or recovery key." });
    }
  }

  resetRateLimit(clientKey);
  const sessionToken = await createSession();

  res.json({
    success: true,
    message: "Admin authenticated successfully!",
    token: sessionToken,
    twoFactorEnabled: !!config.twoFactorEnabled
  });
});

// Setup 2FA: Generate secret & QR Code URL for Google Authenticator
app.post("/api/admin/2fa/setup", async (req, res) => {
  try {
    const setupData = await generate2FASetup();
    res.json(setupData);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate Google Authenticator setup." });
  }
});

// Enable 2FA: Verify 6-digit test code and save
app.post("/api/admin/2fa/enable", async (req, res) => {
  const { token, secret } = req.body;
  if (!token || !secret) {
    return res.status(400).json({ error: "Token and secret are required." });
  }

  const result = await verifyAndEnable2FA(token, secret);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
});

// Disable 2FA
app.post("/api/admin/2fa/disable", async (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ error: "Passcode is required to disable 2FA." });
  }

  const result = await disable2FA(passcode);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json(result);
});

// Change Passcode
app.post("/api/admin/change-passcode", async (req, res) => {
  const { oldPasscode, newPasscode } = req.body;
  const result = await changePasscode(oldPasscode, newPasscode);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result);
});

// ==========================================================================
// DYNAMIC PORTFOLIO CMS STUDIO ENDPOINTS
// ==========================================================================

// Get entire site content
app.get("/api/content", async (req, res) => {
  try {
    const content = await getContent();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve site content." });
  }
});

// Update specific CMS section (hero, about, services, contact, seo)
app.put("/api/content/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const updated = await updateSection(section, req.body);
    res.json({
      success: true,
      message: `Section "${section}" updated successfully!`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update site section." });
  }
});

// Bulk update CMS content
app.put("/api/content", async (req, res) => {
  try {
    const updated = await updateAllContent(req.body);
    res.json({
      success: true,
      message: "Entire site content updated successfully!",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update site content." });
  }
});

// ==========================================================================
// WEBSITES & DESIGNS CRUD ENDPOINTS
// ==========================================================================

// Stats
app.get("/api/admin/stats", async (req, res) => {
  try {
    const websites = await getWebsites();
    const designs = await getDesigns();
    const credentials = await getCredentials();
    const messages = await getMessages();
    const authConfig = await getAuthConfig();

    res.json({
      totalWebsites: websites.length,
      totalDesigns: designs.length,
      totalCredentials: credentials.length,
      totalMessages: messages.length,
      twoFactorEnabled: !!authConfig.twoFactorEnabled,
      recentMessages: messages.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// Websites
app.get("/api/websites", async (req, res) => {
  try {
    const { category, search } = req.query;
    let results = await getWebsites();

    if (category && category !== "all") {
      results = results.filter(w => w.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(w =>
        (w.name && w.name.toLowerCase().includes(q)) ||
        (w.domain && w.domain.toLowerCase().includes(q)) ||
        (w.desc && w.desc.toLowerCase().includes(q)) ||
        (w.tech && w.tech.toLowerCase().includes(q))
      );
    }

    res.json({ total: results.length, data: results });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve websites." });
  }
});

app.post("/api/websites", async (req, res) => {
  try {
    const { name, url, category, badge, tech, desc, domain } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: "Website name and URL are required." });
    }

    const created = await addWebsite({ name, url, category, badge, tech, desc, domain });
    res.status(201).json({ success: true, message: "Website project added successfully!", data: created });
  } catch (err) {
    res.status(500).json({ error: "Failed to add website project." });
  }
});

app.put("/api/websites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateWebsite(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Website project not found." });
    }
    res.json({ success: true, message: "Website project updated successfully!", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update website project." });
  }
});

app.delete("/api/websites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteWebsite(id);
    if (!success) {
      return res.status(404).json({ error: "Website project not found." });
    }
    res.json({ success: true, message: "Website project deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete website project." });
  }
});

// Designs
app.get("/api/designs", async (req, res) => {
  try {
    const { category } = req.query;
    let results = await getDesigns();

    if (category && category !== "all") {
      results = results.filter(d => d.category === category);
    }

    res.json({ total: results.length, data: results });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve graphic designs." });
  }
});

app.post("/api/designs", async (req, res) => {
  try {
    const { title, category, tag, image, caption } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Design title is required." });
    }

    const created = await addDesign({ title, category, tag, image, caption });
    res.status(201).json({ success: true, message: "Graphic design added successfully!", data: created });
  } catch (err) {
    res.status(500).json({ error: "Failed to add graphic design." });
  }
});

app.put("/api/designs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateDesign(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Graphic design not found." });
    }
    res.json({ success: true, message: "Graphic design updated successfully!", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update graphic design." });
  }
});

app.delete("/api/designs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteDesign(id);
    if (!success) {
      return res.status(404).json({ error: "Graphic design not found." });
    }
    res.json({ success: true, message: "Graphic design deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete graphic design." });
  }
});

// Credentials (Certificates & Letters)
app.get("/api/credentials", async (req, res) => {
  try {
    const results = await getCredentials();
    res.json({ total: results.length, data: results });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve credentials." });
  }
});

app.post("/api/credentials", async (req, res) => {
  try {
    const { title, type, badge, institution, subtitle, desc, date, fileUrl, fileType, previewImage } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Credential title is required." });
    }

    const created = await addCredential({ title, type, badge, institution, subtitle, desc, date, fileUrl, fileType, previewImage });
    res.status(201).json({ success: true, message: "Credential added successfully!", data: created });
  } catch (err) {
    res.status(500).json({ error: "Failed to add credential." });
  }
});

app.put("/api/credentials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCredential(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Credential not found." });
    }
    res.json({ success: true, message: "Credential updated successfully!", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update credential." });
  }
});

app.delete("/api/credentials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteCredential(id);
    if (!success) {
      return res.status(404).json({ error: "Credential not found." });
    }
    res.json({ success: true, message: "Credential deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete credential." });
  }
});

// Contact Inquiries
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const created = await addMessage({ name, email, phone, subject, message });
    console.log(`[New Client Inquiry] From: ${name} (${email}) - "${subject}"`);

    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully to Aryan Thakor.",
      data: created
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to record message." });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const messages = await getMessages();
    res.json({ total: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
});

app.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteMessage(id);
    if (!success) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.json({ success: true, message: "Message deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// ==========================================================================
// RESUME & CV DOCUMENT MANAGEMENT ENDPOINTS
// ==========================================================================

function getResumeMetadata() {
  const frontendPath = path.join(FRONTEND_DOCS_DIR, RESUME_FILENAME);
  const backendPath = path.join(BACKEND_STORE_DIR, RESUME_FILENAME);

  let activePath = null;
  if (fs.existsSync(frontendPath)) {
    activePath = frontendPath;
  } else if (fs.existsSync(backendPath)) {
    activePath = backendPath;
  }

  let customMeta = {};
  if (fs.existsSync(RESUME_META_FILE)) {
    try {
      customMeta = JSON.parse(fs.readFileSync(RESUME_META_FILE, "utf-8"));
    } catch (e) {}
  }

  if (!activePath) {
    return {
      exists: false,
      filename: RESUME_FILENAME,
      originalName: "Aryan_Thakor_Resume.pdf",
      sizeBytes: 0,
      formattedSize: "0 KB",
      lastModified: null
    };
  }

  const stat = fs.statSync(activePath);
  const sizeKB = (stat.size / 1024).toFixed(1);

  return {
    exists: true,
    filename: RESUME_FILENAME,
    originalName: customMeta.originalName || "Aryan_Thakor_Resume.pdf",
    sizeBytes: stat.size,
    formattedSize: `${sizeKB} KB`,
    lastModified: customMeta.lastModified || stat.mtime.toISOString(),
    path: activePath
  };
}

// Get Resume Metadata
app.get("/api/resume/info", (req, res) => {
  try {
    const meta = getResumeMetadata();
    res.json(meta);
  } catch (err) {
    res.status(500).json({ error: "Failed to read resume info." });
  }
});

// Download Active Resume (Forces attachment download)
app.get("/api/resume/download", (req, res) => {
  try {
    const meta = getResumeMetadata();
    if (!meta.exists || !meta.path) {
      return res.status(404).json({ error: "Resume document not found on server." });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(meta.originalName)}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.download(meta.path, meta.originalName, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: "Failed to download resume file." });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Resume download error." });
  }
});

// Upload and Update Resume (Protected by requireAuth)
app.post("/api/admin/resume/upload", requireAuth, async (req, res) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "No PDF data provided for upload." });
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    if (buffer.length === 0) {
      return res.status(400).json({ error: "Invalid or empty PDF file." });
    }

    // Ensure target directories exist
    if (!fs.existsSync(FRONTEND_DOCS_DIR)) {
      fs.mkdirSync(FRONTEND_DOCS_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKEND_STORE_DIR)) {
      fs.mkdirSync(BACKEND_STORE_DIR, { recursive: true });
    }

    const frontendPath = path.join(FRONTEND_DOCS_DIR, RESUME_FILENAME);
    const backendPath = path.join(BACKEND_STORE_DIR, RESUME_FILENAME);

    // Save to frontend public assets and backend store
    fs.writeFileSync(frontendPath, buffer);
    fs.writeFileSync(backendPath, buffer);

    const originalName = filename ? (filename.endsWith(".pdf") ? filename : `${filename}.pdf`) : "Aryan_Thakor_Resume.pdf";
    const sizeBytes = buffer.length;
    const formattedSize = `${(sizeBytes / 1024).toFixed(1)} KB`;
    const lastModified = new Date().toISOString();

    const meta = {
      filename: RESUME_FILENAME,
      originalName,
      sizeBytes,
      formattedSize,
      lastModified
    };

    fs.writeFileSync(RESUME_META_FILE, JSON.stringify(meta, null, 2), "utf-8");

    console.log(`⚡ [Resume Update] New resume uploaded: ${originalName} (${formattedSize})`);

    res.json({
      success: true,
      message: "Resume updated successfully! New file is live across all download links.",
      meta
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: "Failed to upload and update resume." });
  }
});

// Upload and Update Browser Tab Favicon or Mobile App Icon
app.post("/api/admin/branding/upload-icon", async (req, res) => {
  try {
    const { type, base64Data } = req.body;
    if (!type || !base64Data) {
      return res.status(400).json({ error: "Missing type or base64Data." });
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    if (buffer.length === 0) {
      return res.status(400).json({ error: "Invalid or empty image buffer." });
    }

    const timestamp = Date.now();
    let resultingUrl = "";

    if (type === "favicon") {
      const targets = [
        path.resolve(__dirname, "../frontend/public/favicon.png"),
        path.resolve(__dirname, "../frontend/public/favicon.ico"),
        path.resolve(__dirname, "../frontend/dist/favicon.png"),
        path.resolve(__dirname, "../frontend/dist/favicon.ico"),
        path.resolve(__dirname, "../dist/favicon.png"),
        path.resolve(__dirname, "../dist/favicon.ico")
      ];

      for (const t of targets) {
        try {
          const dir = path.dirname(t);
          if (fs.existsSync(dir)) {
            fs.writeFileSync(t, buffer);
          }
        } catch (e) {
          console.debug(`Skip write to ${t}:`, e.message);
        }
      }

      resultingUrl = `/favicon.png?v=${timestamp}`;
      await updateSection("branding", { favicon: resultingUrl });

    } else if (type === "appIcon") {
      const targets = [
        path.resolve(__dirname, "../frontend/public/icons/icon-192x192.png"),
        path.resolve(__dirname, "../frontend/public/icons/icon-512x512.png"),
        path.resolve(__dirname, "../frontend/dist/icons/icon-192x192.png"),
        path.resolve(__dirname, "../frontend/dist/icons/icon-512x512.png"),
        path.resolve(__dirname, "../dist/icons/icon-192x192.png"),
        path.resolve(__dirname, "../dist/icons/icon-512x512.png")
      ];

      for (const t of targets) {
        try {
          const dir = path.dirname(t);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(t, buffer);
        } catch (e) {
          console.debug(`Skip write to ${t}:`, e.message);
        }
      }

      resultingUrl = `/icons/icon-512x512.png?v=${timestamp}`;
      await updateSection("branding", { appIcon: resultingUrl });
    } else if (type === "logo") {
      const targets = [
        path.resolve(__dirname, "../frontend/public/assets/logos/brand-logo.png"),
        path.resolve(__dirname, "../frontend/dist/assets/logos/brand-logo.png"),
        path.resolve(__dirname, "../dist/assets/logos/brand-logo.png")
      ];

      for (const t of targets) {
        try {
          const dir = path.dirname(t);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(t, buffer);
        } catch (e) {
          console.debug(`Skip write to ${t}:`, e.message);
        }
      }

      resultingUrl = `/assets/logos/brand-logo.png?v=${timestamp}`;
      await updateSection("branding", { logoImage: resultingUrl });
    } else {
      return res.status(400).json({ error: "Unsupported branding type." });
    }

    console.log(`⚡ [Branding Update] Updated ${type} image successfully -> ${resultingUrl}`);
    res.json({
      success: true,
      message: `${type === 'favicon' ? 'Browser Tab Favicon' : 'Mobile App Icon'} saved permanently!`,
      url: resultingUrl
    });
  } catch (err) {
    console.error("Branding upload error:", err);
    res.status(500).json({ error: "Failed to upload branding image." });
  }
});

// ==========================================================================
// VISITOR ANALYTICS & TELEMETRY ENDPOINTS
// ==========================================================================
const ANALYTICS_STORE_FILE = path.join(BACKEND_STORE_DIR, "visitorLogs.json");

function getVisitorLogs() {
  try {
    if (fs.existsSync(ANALYTICS_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(ANALYTICS_STORE_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveVisitorLogs(logs) {
  try {
    if (!fs.existsSync(BACKEND_STORE_DIR)) {
      fs.mkdirSync(BACKEND_STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(ANALYTICS_STORE_FILE, JSON.stringify(logs.slice(0, 100), null, 2), "utf-8");
  } catch {}
}

app.post("/api/analytics/visit", (req, res) => {
  try {
    const visit = req.body;
    if (!visit || !visit.ip) {
      return res.status(400).json({ error: "Invalid visit payload" });
    }
    const logs = getVisitorLogs();
    const existingIndex = logs.findIndex(l => l.id === visit.id);
    if (existingIndex !== -1) {
      logs[existingIndex] = {
        ...logs[existingIndex],
        page: visit.page,
        timestamp: Date.now(),
        pageViews: (logs[existingIndex].pageViews || 1) + 1
      };
    } else {
      visit.pageViews = 1;
      logs.unshift(visit);
    }
    saveVisitorLogs(logs);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to record visitor" });
  }
});

app.get("/api/analytics/visitors", (req, res) => {
  res.json({ visitors: getVisitorLogs() });
});

app.delete("/api/analytics/visitors", (req, res) => {
  saveVisitorLogs([]);
  res.json({ success: true, message: "Visitor logs cleared." });
});

// --- Serve Frontend Static Build in Production ---
const FRONTEND_DIST = path.resolve(__dirname, "../frontend/dist");
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(FRONTEND_DIST, "index.html"));
    } else {
      res.status(404).json({ error: "API route not found" });
    }
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ [Backend] Aryan Thakor Portfolio API running on port ${PORT}`);
});

