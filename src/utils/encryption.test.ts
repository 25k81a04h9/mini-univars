import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSalt,
  deriveKeyFromPassphrase,
  encryptMessage,
  decryptMessage,
  hashPin
} from './encryption';

test('encryption and decryption roundtrip produces original plaintext', async () => {
  const passphrase = 'BubuAndDuduForeverLovePassphrase';
  const salt = generateSalt();

  const key = await deriveKeyFromPassphrase(passphrase, salt);
  const originalMessage = 'Hello my sweet Dudu! I love you to the moon and back ❤️ 🐻';

  const { ciphertext, iv } = await encryptMessage(originalMessage, key);

  assert.notEqual(ciphertext, originalMessage);
  assert.ok(ciphertext.length > 0);
  assert.ok(iv.length > 0);

  const decrypted = await decryptMessage(ciphertext, iv, key);
  assert.equal(decrypted, originalMessage);
});

test('decryption with wrong key fails', async () => {
  const salt = generateSalt();
  const key1 = await deriveKeyFromPassphrase('Password123', salt);
  const key2 = await deriveKeyFromPassphrase('WrongPassword456', salt);

  const message = 'Secret message';
  const { ciphertext, iv } = await encryptMessage(message, key1);

  await assert.rejects(async () => {
    await decryptMessage(ciphertext, iv, key2);
  });
});

test('hashPin generates deterministic SHA-256 hash', async () => {
  const salt = 'constant-salt-123';
  const hash1 = await hashPin('1234', salt);
  const hash2 = await hashPin('1234', salt);
  const hash3 = await hashPin('5678', salt);

  assert.equal(hash1, hash2);
  assert.notEqual(hash1, hash3);
});
