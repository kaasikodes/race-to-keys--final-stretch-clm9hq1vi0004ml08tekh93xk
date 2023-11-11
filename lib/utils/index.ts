import ENV from "@/config/enviroment";
import { AptosAccount, HexString } from "aptos";
import * as crypto from "crypto";

export const transformToWordsArray = (str: string) =>
  str.split(",").map((word) => word.trim());

export function newPrivateKey() {
  const wallet = new AptosAccount();
  const privateKey = wallet.toPrivateKeyObject().privateKeyHex;
  return privateKey;
}
export function createAptosAccount(privateKey: string) {
  const aptAccount = new AptosAccount(new HexString(privateKey).toUint8Array());

  return aptAccount;
}

// Replace 'your-secret-key' with a secure key for encryption and decryption.
const secretKey = ENV.NEXTAUTH_SECRET;

// Function to encrypt a value
export function encrypt(value: string): string {
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encryptedValue = cipher.update(value, "utf8", "hex");
  encryptedValue += cipher.final("hex");
  return encryptedValue;
}

// Function to decrypt an encrypted value
export function decrypt(encryptedValue: string): string {
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decryptedValue = decipher.update(encryptedValue, "hex", "utf8");
  decryptedValue += decipher.final("utf8");
  return decryptedValue;
}

export const generateRandomAvatarUrl = (
  props: {
    name?: string | null;
    size?: number;
  } = {}
) => {
  const { name, size = 40 } = props;

  return `https://i.pravatar.cc/${size * 2}?u=${name}`;
};

export const truncateString = (value: string, maxLength?: number): string => {
  // Define the default maximum length if not provided
  const DEFAULT_MAX_LENGTH = 12;

  // Use the provided maxLength if it's a positive number, or use the default
  maxLength =
    typeof maxLength === "number" && maxLength > 0
      ? maxLength
      : DEFAULT_MAX_LENGTH;

  // Check if the value is longer than the specified maxLength
  if (value.length > maxLength) {
    // Truncate the string and add an ellipsis to indicate truncation
    return value.slice(0, maxLength) + "...";
  }

  // If the string is not longer than the maxLength, return it as is
  return value;
};
