import crypto from "crypto";

const key = Buffer.from(process.env.AES_KEY, "base64"); // 32 bytes

export function encryptCBC(plaintext) {
  const iv = crypto.randomBytes(16); // 16 bytes for CBC
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("base64")}:${encrypted}`;
}

export function decryptCBC(payload) {
  const [ivB64, ciphertextB64] = payload.split(":");
  const iv = Buffer.from(ivB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(ciphertextB64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
