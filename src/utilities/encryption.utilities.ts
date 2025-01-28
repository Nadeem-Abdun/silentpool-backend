import crypto from "crypto";

const algorithm = "aes-256-cbc";

export const generateEncryptionKey = (): string => {
    return crypto.randomBytes(32).toString("hex"); // 256-bit key
};

export const encryptMessage = (message: string, key: string): string => {
    const iv = crypto.randomBytes(16); // 128-bit IV
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);
    let encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptMessage = (encryptedMessage: string, key: string): string => {
    const [ivHex, encryptedHex] = encryptedMessage.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
