export function generateSecurePassword(length = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
  const charsLength = chars.length;

  const getCrypto = () => {
    if (typeof globalThis.crypto !== "undefined") return globalThis.crypto;
    throw new Error("Crypto API não suportada neste ambiente");
  };

  const cryptoObj = getCrypto();
  const randomValues = new Uint8Array(length);
  cryptoObj.getRandomValues(randomValues);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % charsLength];
  }

  return password;
}
