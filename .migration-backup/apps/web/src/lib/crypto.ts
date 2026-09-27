import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getSecretKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY
  if (!hexKey || !/^[a-fA-F0-9]{64}$/.test(hexKey)) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hexadecimal AES-256 key.')
  }

  return Buffer.from(hexKey, 'hex')
}

export function encryptToken(text: string): string {
  const iv = crypto.randomBytes(12)
  const key = getSecretKey()
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decryptToken(cipherText: string): string {
  const parts = cipherText.split(':')
  if (parts.length !== 3) throw new Error('Invalid ciphertext format')
  
  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const key = getSecretKey()
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
