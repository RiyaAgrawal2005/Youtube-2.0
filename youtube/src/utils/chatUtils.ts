// utils/chatUtils.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CHAT_SECRET || "fallback-key";

export const encryptMessage = (message: string): string => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage: string): string => {
  try {
    return CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return "[Decryption Error]";
  }
};
