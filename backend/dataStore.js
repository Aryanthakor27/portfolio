import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { websitesData } from "./data/websitesData.js";
import { designsData } from "./data/designsData.js";
import { credentialsData } from "./data/credentialsData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, "data", "store");

const WEBSITES_FILE = path.join(STORE_DIR, "websites.json");
const DESIGNS_FILE = path.join(STORE_DIR, "designs.json");
const MESSAGES_FILE = path.join(STORE_DIR, "messages.json");
const CREDENTIALS_FILE = path.join(STORE_DIR, "credentials.json");

// Ensure store directory and initial JSON files exist
async function initStore() {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });

    try {
      await fs.access(WEBSITES_FILE);
    } catch {
      await fs.writeFile(WEBSITES_FILE, JSON.stringify(websitesData, null, 2), "utf8");
    }

    try {
      await fs.access(DESIGNS_FILE);
    } catch {
      await fs.writeFile(DESIGNS_FILE, JSON.stringify(designsData, null, 2), "utf8");
    }

    try {
      await fs.access(MESSAGES_FILE);
    } catch {
      await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2), "utf8");
    }

    try {
      await fs.access(CREDENTIALS_FILE);
    } catch {
      await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentialsData, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error initializing data store:", err);
  }
}

// Websites CRUD
export async function getWebsites() {
  await initStore();
  const data = await fs.readFile(WEBSITES_FILE, "utf8");
  return JSON.parse(data);
}

export async function addWebsite(item) {
  const websites = await getWebsites();
  const newId = websites.length > 0 ? Math.max(...websites.map(w => Number(w.id) || 0)) + 1 : 1;
  const newWebsite = {
    id: newId,
    name: item.name.trim(),
    url: item.url.trim(),
    domain: item.domain ? item.domain.trim() : item.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    category: item.category || "ecommerce",
    badge: item.badge ? item.badge.trim() : "Custom Build",
    tech: item.tech ? item.tech.trim() : "React / Node.js",
    desc: item.desc ? item.desc.trim() : "",
    createdAt: new Date().toISOString()
  };
  websites.unshift(newWebsite); // newest first
  await fs.writeFile(WEBSITES_FILE, JSON.stringify(websites, null, 2), "utf8");
  return newWebsite;
}

export async function updateWebsite(id, updatedFields) {
  const websites = await getWebsites();
  const index = websites.findIndex(w => String(w.id) === String(id));
  if (index === -1) return null;

  websites[index] = {
    ...websites[index],
    ...updatedFields,
    id: websites[index].id // preserve original id
  };

  await fs.writeFile(WEBSITES_FILE, JSON.stringify(websites, null, 2), "utf8");
  return websites[index];
}

export async function deleteWebsite(id) {
  const websites = await getWebsites();
  const filtered = websites.filter(w => String(w.id) !== String(id));
  if (filtered.length === websites.length) return false;
  await fs.writeFile(WEBSITES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

// Designs CRUD
export async function getDesigns() {
  await initStore();
  const data = await fs.readFile(DESIGNS_FILE, "utf8");
  return JSON.parse(data);
}

export async function addDesign(item) {
  const designs = await getDesigns();
  const newId = designs.length > 0 ? Math.max(...designs.map(d => Number(d.id) || 0)) + 1 : 1;
  const newDesign = {
    id: newId,
    title: item.title.trim(),
    category: item.category || "logos",
    tag: item.tag ? item.tag.trim() : "Graphic Design",
    image: item.image ? item.image.trim() : "/assets/profile/aryan-designer.jpg",
    caption: item.caption ? item.caption.trim() : "",
    createdAt: new Date().toISOString()
  };
  designs.unshift(newDesign);
  await fs.writeFile(DESIGNS_FILE, JSON.stringify(designs, null, 2), "utf8");
  return newDesign;
}

export async function updateDesign(id, updatedFields) {
  const designs = await getDesigns();
  const index = designs.findIndex(d => String(d.id) === String(id));
  if (index === -1) return null;

  designs[index] = {
    ...designs[index],
    ...updatedFields,
    id: designs[index].id
  };

  await fs.writeFile(DESIGNS_FILE, JSON.stringify(designs, null, 2), "utf8");
  return designs[index];
}

export async function deleteDesign(id) {
  const designs = await getDesigns();
  const filtered = designs.filter(d => String(d.id) !== String(id));
  if (filtered.length === designs.length) return false;
  await fs.writeFile(DESIGNS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

// Messages CRUD
export async function getMessages() {
  await initStore();
  const data = await fs.readFile(MESSAGES_FILE, "utf8");
  return JSON.parse(data);
}

export async function addMessage(msg) {
  const messages = await getMessages();
  const newMsg = {
    id: Date.now(),
    name: msg.name.trim(),
    email: msg.email.trim(),
    phone: msg.phone ? msg.phone.trim() : "",
    subject: msg.subject ? msg.subject.trim() : "General Inquiry",
    message: msg.message.trim(),
    createdAt: new Date().toISOString()
  };
  messages.unshift(newMsg);
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
  return newMsg;
}

export async function deleteMessage(id) {
  const messages = await getMessages();
  const filtered = messages.filter(m => String(m.id) !== String(id));
  if (filtered.length === messages.length) return false;
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

// Credentials (Certificates & Letters) CRUD
export async function getCredentials() {
  await initStore();
  const data = await fs.readFile(CREDENTIALS_FILE, "utf8");
  return JSON.parse(data);
}

export async function addCredential(item) {
  const credentials = await getCredentials();
  const newCredential = {
    id: item.id || `cred-${Date.now()}`,
    type: item.type || "certificate",
    badge: item.badge ? item.badge.trim() : "Certified",
    institution: item.institution ? item.institution.trim() : "CERTIFIED",
    title: item.title.trim(),
    subtitle: item.subtitle ? item.subtitle.trim() : "",
    desc: item.desc ? item.desc.trim() : "",
    date: item.date ? item.date.trim() : "",
    fileUrl: item.fileUrl ? item.fileUrl.trim() : "",
    fileType: item.fileType || (item.fileUrl && item.fileUrl.toLowerCase().endsWith('.pdf') ? "pdf" : "image"),
    previewImage: item.previewImage ? item.previewImage.trim() : (item.fileType === "image" ? item.fileUrl : ""),
    createdAt: new Date().toISOString()
  };
  credentials.unshift(newCredential);
  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), "utf8");
  return newCredential;
}

export async function updateCredential(id, updatedFields) {
  const credentials = await getCredentials();
  const index = credentials.findIndex(c => String(c.id) === String(id));
  if (index === -1) return null;

  credentials[index] = {
    ...credentials[index],
    ...updatedFields,
    id: credentials[index].id
  };

  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), "utf8");
  return credentials[index];
}

export async function deleteCredential(id) {
  const credentials = await getCredentials();
  const filtered = credentials.filter(c => String(c.id) !== String(id));
  if (filtered.length === credentials.length) return false;
  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

