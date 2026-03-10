import * as crypto from 'crypto';

function hashToken(data: string): string {
   return crypto.createHash('sha256').update(data).digest('hex');
}

function createRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export { createRefreshToken, hashToken };