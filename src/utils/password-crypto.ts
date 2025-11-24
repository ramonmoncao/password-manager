import crypto from "crypto";
const algorithm = "aes-256-cbc";
export function encrypt(text: string, keyBase64: string, ivBase64: string): string {
  const key = Buffer.from(keyBase64, "base64"); 
  const iv = Buffer.from(ivBase64, "base64");
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return encrypted;
}

export function decrypt(encrypted: string, keyBase64: string, ivBase64: string): string {
  const key = Buffer.from(keyBase64, "base64"); 
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}