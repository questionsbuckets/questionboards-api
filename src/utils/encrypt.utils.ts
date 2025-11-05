import crypto from "crypto-js";

const ENCRYPTION_KEY = process.env.PHONE_SECRET_KEY!;

// Convert key to 32 bytes (256-bit) for AES
const key = crypto.SHA256(ENCRYPTION_KEY);

const iv = crypto.enc.Hex.parse("00000000000000000000000000000000");

export const encryptDeterministic = (text: string): string => {
  if (!text) return "";
  const encrypted = crypto.AES.encrypt(text, key, { iv });
  return encrypted.toString();
};

export const decryptDeterministic = (encryptedText: string): string => {
  if (!encryptedText) return "";
  const decrypted = crypto.AES.decrypt(encryptedText, key, { iv });
  return decrypted.toString(crypto.enc.Utf8);
};
