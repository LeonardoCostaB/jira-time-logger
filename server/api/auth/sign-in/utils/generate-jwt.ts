import jwt from 'jsonwebtoken'
import { EXPIRES_IN_ACCESS_TOKEN } from '~~/server/constants/auth'

type GenerateJWTPayload = {
  sub: string
  email: string
}

interface GenerateJWTOptions {
  payload: GenerateJWTPayload
}

function generateJWT({
  payload
}: GenerateJWTOptions): string {
  const secretKey = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = EXPIRES_IN_ACCESS_TOKEN

  return jwt.sign(payload, secretKey, { expiresIn });
}

export { generateJWT }
