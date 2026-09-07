import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
// key must be 32 bytes (256 bits).
const keyStr = process.env.GITHUB_ENCRYPTION_KEY;

export function encryptToken(text: string): string {
  if (!keyStr || keyStr.length !== 64) {
    throw new Error('Invalid or missing GITHUB_ENCRYPTION_KEY. Must be 64 char hex string.');
  }
  const key = Buffer.from(keyStr, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string): string {
  if (!keyStr || keyStr.length !== 64) {
    throw new Error('Invalid or missing GITHUB_ENCRYPTION_KEY.');
  }
  const key = Buffer.from(keyStr, 'hex');
  const parts = encryptedData.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted text format');
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
