import { JiraPreferencesSchema } from '~~/app/pages/dashboard/jira-preferences.schema'
import prismaService from '../../../db/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { sub: string }

  try {
    const body = await readBody(event)
    const {
      jiraEmail,
      jiraApiToken,
      jiraIssueKey,
      jiraIssueTime,
    } = JiraPreferencesSchema.parse(body)

    const userFound = await prismaService.user.findUnique({
      where: { id: user.sub },
      select: { id: true, jiraAccounts: true },
    })

    if (!userFound) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    await prismaService.jiraAccount.upsert({
      where: { companyEmail: userFound.jiraAccounts?.[0]?.companyEmail || '' },
      update: {
        companyEmail: jiraEmail,
        apiToken: jiraApiToken,
        issueKey: jiraIssueKey,
        issueTime: jiraIssueTime,
      },
      create: {
        userId: userFound.id,
        companyEmail: jiraEmail,
        apiToken: jiraApiToken,
        issueKey: jiraIssueKey,
        issueTime: jiraIssueTime,
      }
    })

    return { message: 'Jira preferences saved successfully' }
  } catch (error) {
    console.error('Error saving Jira preferences:', error)
    throw createError({ statusCode: 500, message: 'Internal server error' })
  }
})