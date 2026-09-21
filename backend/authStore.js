import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import qrcode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, "data", "store");
const AUTH_FILE = path.join(STORE_DIR, "authConfig.json");

const APP_NAME = "Aryan Thakor Portfolio";
const DEFAULT_PASSCODE = "aryan2026";
const DEFAULT_RECOVERY_KEY = "ARYAN-RECOVERY-9988";

// Track failed login attempts for brute-force rate limiting
const loginAttempts = new Map(); // ip/key -> { count, lastAttempt }

// --- Standard RFC 6238 TOTP (Google Authenticator Engine) ---
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer) {
  let bits = "";
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, "0");
  }
  let encoded = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5);
    if (chunk.length < 5) {
      encoded += BASE32_ALPHABET[parseInt(chunk.padEnd(5, "0"), 2)];
    } else {
      encoded += BASE32_ALPHABET[parseInt(chunk, 2)];
    }
  }
  return encoded;
}

function base32Decode(str) {
  let bits = "";
  for (let c of str.toUpperCase().replace(/=+$/, "")) {
    const val = BASE32_ALPHABET.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTOTP(secret, offset = 0) {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const step = BigInt(Math.floor(epoch / 30) + offset);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(step);

  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offsetByte = hmac[hmac.length - 1] & 0xf;
  const code = (
    ((hmac[offsetByte] & 0x7f) << 24) |
    ((hmac[offsetByte + 1] & 0xff) << 16) |
    ((hmac[offsetByte + 2] & 0xff) << 8) |
    (hmac[offsetByte + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, "0");
}

function verifyTOTPToken(token, secret) {
  if (!token || !secret) return false;
  const clean = token.toString().trim();
  // Check drift window of ±1 step (±30s)
  for (let offset of [-1, 0, 1]) {
    if (generateTOTP(secret, offset) === clean) {
      return true;
    }
  }
  return false;
}

// --- Store Management ---
export async function initAuth() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(AUTH_FILE);
  } catch {
    const initialConfig = {
      passcode: DEFAULT_PASSCODE,
      twoFactorEnabled: false,
      twoFactorSecret: "",
      emergencyRecoveryKey: DEFAULT_RECOVERY_KEY,
      activeSessions: []
    };
    await fs.writeFile(AUTH_FILE, JSON.stringify(initialConfig, null, 2), "utf8");
  }
}

export async function getAuthConfig() {
  await initAuth();
  const raw = await fs.readFile(AUTH_FILE, "utf8");
  return JSON.parse(raw);
}

async function saveAuthConfig(config) {
  await fs.writeFile(AUTH_FILE, JSON.stringify(config, null, 2), "utf8");
}

// Rate limiting: 5 failed attempts per 10 mins
export function checkRateLimit(clientKey = "default") {
  const record = loginAttempts.get(clientKey);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (now - record.lastAttempt > 10 * 60 * 1000) {
    loginAttempts.delete(clientKey);
    return { allowed: true };
  }

  if (record.count >= 5) {
    const remainingSecs = Math.ceil((10 * 60 * 1000 - (now - record.lastAttempt)) / 1000);
    return {
      allowed: false,
      error: `Too many failed attempts. Temporary lockout for ${remainingSecs} seconds.`
    };
  }

  return { allowed: true };
}

export function recordFailedAttempt(clientKey = "default") {
  const record = loginAttempts.get(clientKey) || { count: 0, lastAttempt: Date.now() };
  record.count += 1;
  record.lastAttempt = Date.now();
  loginAttempts.set(clientKey, record);
}

export function resetRateLimit(clientKey = "default") {
  loginAttempts.delete(clientKey);
}

// Passcode verification
export async function verifyPasscode(inputPasscode) {
  const config = await getAuthConfig();
  return config.passcode === inputPasscode.trim();
}

export async function changePasscode(oldPasscode, newPasscode) {
  const config = await getAuthConfig();
  if (config.passcode !== oldPasscode.trim()) {
    return { success: false, error: "Current passcode is incorrect." };
  }
  if (!newPasscode || newPasscode.trim().length < 4) {
    return { success: false, error: "New passcode must be at least 4 characters long." };
  }
  config.passcode = newPasscode.trim();
  await saveAuthConfig(config);
  return { success: true, message: "Admin passcode changed successfully!" };
}

// 2FA Setup: Generate secret and QR code data URL for Google Authenticator
export async function generate2FASetup() {
  const randomBytes = crypto.randomBytes(20);
  const secret = base32Encode(randomBytes);
  const encodedIssuer = encodeURIComponent(APP_NAME);
  const encodedAccount = encodeURIComponent("admin@aryanthakor.com");
  const otpauth = `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;

  const qrCodeUrl = await qrcode.toDataURL(otpauth, {
    margin: 2,
    width: 260,
    color: { dark: "#000000", light: "#FFFFFF" }
  });

  return {
    secret,
    otpauth,
    qrCodeUrl
  };
}

// Enable 2FA after user scans QR code and enters matching 6-digit test code
export async function verifyAndEnable2FA(token, secret) {
  try {
    const isValid = verifyTOTPToken(token, secret);
    if (!isValid) {
      return { success: false, error: "Invalid 6-digit code. Please verify the code displayed on Google Authenticator." };
    }

    const config = await getAuthConfig();
    config.twoFactorEnabled = true;
    config.twoFactorSecret = secret.trim();
    // Fresh emergency recovery key
    config.emergencyRecoveryKey = `ARYAN-KEY-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    await saveAuthConfig(config);

    return {
      success: true,
      message: "Google Authenticator 2FA activated successfully!",
      recoveryKey: config.emergencyRecoveryKey
    };
  } catch (err) {
    return { success: false, error: "Failed to verify 2FA code." };
  }
}

// Disable 2FA
export async function disable2FA(passcode) {
  const config = await getAuthConfig();
  if (config.passcode !== passcode.trim()) {
    return { success: false, error: "Incorrect admin passcode." };
  }

  config.twoFactorEnabled = false;
  config.twoFactorSecret = "";
  await saveAuthConfig(config);
  return { success: true, message: "Google Authenticator 2FA has been disabled." };
}

// Verify 2FA token during login (or recovery key)
export async function verify2FAToken(token) {
  const config = await getAuthConfig();
  if (!config.twoFactorEnabled) return true;

  const trimmed = token ? token.toString().trim() : "";

  // Check emergency recovery key
  if (trimmed === config.emergencyRecoveryKey) {
    return true;
  }

  return verifyTOTPToken(trimmed, config.twoFactorSecret);
}

// Session Token Management
export async function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const config = await getAuthConfig();
  config.activeSessions = (config.activeSessions || []).filter(s => s.expiresAt > Date.now());
  config.activeSessions.push({ token, expiresAt });
  await saveAuthConfig(config);

  return token;
}

export async function verifySession(token) {
  if (!token) return false;
  const config = await getAuthConfig();
  const session = (config.activeSessions || []).find(s => s.token === token && s.expiresAt > Date.now());
  return !!session;
}
