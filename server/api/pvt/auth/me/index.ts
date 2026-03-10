import prismaService from '../../../../db/prisma';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method !== 'GET') {
    return createError({ statusCode: 405, message: 'Method not allowed' })
  }

  const user = event.context.user as { sub: string; email: string }

  const userFound = await prismaService.user.findUnique({
    where: { id: user.sub },
    select: {
      id: true,
    },
  })

  if (!userFound) {
    return createError({ statusCode: 401, message: 'Unauthorized' })
  }

  return {
    sub: user.sub,
    email: user.email,
  };
})