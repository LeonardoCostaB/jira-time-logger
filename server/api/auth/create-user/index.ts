import bcrypt from 'bcryptjs'
import PrismaService from '../../../db/prisma'

import { UserRegister, RegisterSchema } from '../../../../app/pages/criar-conta/register.schema'
import z from 'zod'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'POST') {
    const body = await readBody(event)

    try {
      const {
        name,
        lastName,
        email,
        password,
      } = RegisterSchema.parse(body)

      const userFound = await PrismaService.user.findUnique({
        where: { email },
      })

      if (userFound) {
        throw createError({ statusCode: 409, message: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await PrismaService.user.create({
        data: {
          name,
          lastName,
          email,
          password: hashedPassword,
        },
      })
    } catch (error) {
      console.error('Error creating user:', error)

      if (error instanceof z.ZodError) {
        throw createError({ statusCode: 400, message: error.format()._errors.join(', ') })
      }

      throw createError({ statusCode: 500, message: 'Internal server error' })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})