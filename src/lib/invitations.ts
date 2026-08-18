import { createHash, randomBytes } from 'crypto'

// Generate a unique invitation code like: IBRAX-X7K4-91PQ
export function generateInvitationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars like I, O, 0, 1
  const segments = [4, 4, 4] // Three segments of 4 characters
  
  const code = segments
    .map((length) => {
      let segment = ''
      const randomBuffer = randomBytes(length)
      for (let i = 0; i < length; i++) {
        segment += chars[randomBuffer[i] % chars.length]
      }
      return segment
    })
    .join('-')
  
  return `IBRAX-${code}`
}

// Hash the code for secure storage
export function hashInvitationCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

// Verify a code against its hash
export function verifyInvitationCode(code: string, hash: string): boolean {
  const computedHash = hashInvitationCode(code)
  return computedHash === hash
}

// Normalize code input (uppercase, trim spaces)
export function normalizeInvitationCode(code: string): string {
  return code.toUpperCase().trim().replace(/\s+/g, '')
}