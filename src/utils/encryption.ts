/**
 * End-to-End Encryption for Bubu & Dudu's Private Chat using standard Web Crypto API (SubtleCrypto).
 * - Key derivation: PBKDF2 (100,000 iterations, SHA-256)
 * - Cipher: AES-GCM 256-bit with cryptographically secure 12-byte IV per message
 * - Stored messages contain only ciphertext + iv (Base64 encoded); plaintext is never sent unencrypted.
 */

const cryptoObj = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : null;

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function generateSalt(length = 16): string {
  if (!cryptoObj) return 'default-couple-salt-bubu-dudu';
  const array = new Uint8Array(length);
  cryptoObj.getRandomValues(array);
  return bufferToBase64(array);
}

export async function deriveKeyFromPassphrase(passphrase: string, saltInput: string): Promise<CryptoKey> {
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API is not available in this environment');
  }

  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(passphrase);
  let salt: Uint8Array;
  try {
    salt = base64ToBuffer(saltInput);
    if (salt.length === 0) salt = enc.encode(saltInput);
  } catch {
    salt = enc.encode(saltInput);
  }

  const baseKey = await cryptoObj.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API is not available in this environment');
  }

  const enc = new TextEncoder();
  const data = enc.encode(plaintext);
  const iv = new Uint8Array(12);
  cryptoObj.getRandomValues(iv);

  const encryptedBuffer = await cryptoObj.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
  };
}

export async function decryptMessage(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API is not available in this environment');
  }

  const ciphertext = base64ToBuffer(ciphertextBase64);
  const iv = base64ToBuffer(ivBase64);

  const decryptedBuffer = await cryptoObj.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    ciphertext as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  if (!cryptoObj || !cryptoObj.subtle) {
    return 'mock-pin-hash';
  }
  const enc = new TextEncoder();
  const data = enc.encode(pin + salt);
  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer);
}
