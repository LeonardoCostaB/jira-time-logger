import bcrypt from 'bcryptjs'
import PrismaService from '../../../db/prisma'
import { generateJWT } from './utils/generate-jwt'
import { ACCESS_TOKEN_NAME, EXPIRES_IN_ACCESS_TOKEN, EXPIRES_IN_REFRESH_TOKEN, REFRESH_TOKEN_NAME } from '../../../constants/auth'
import { saveRefreshToken } from './services/save-refresh-token'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'POST') {
    const body = await readBody(event)
    
    const { email, password } = body
    
    const userFound = await PrismaService.user.findUnique({
      where: { email },
    })

    if (!userFound) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password)

    if (!passwordMatch) {
      throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }

    const refreshToken = await saveRefreshToken(userFound.id)
    const accessToken = generateJWT({ payload: { sub: userFound.id, email: userFound.email } })

    setCookie(
      event, 
      REFRESH_TOKEN_NAME, 
      refreshToken, 
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: EXPIRES_IN_REFRESH_TOKEN
      }
    )

    setCookie(
      event, 
      ACCESS_TOKEN_NAME, 
      accessToken, 
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: EXPIRES_IN_ACCESS_TOKEN
      }
    )

    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})