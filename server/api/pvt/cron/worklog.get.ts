import prismaService from "~~/server/db/prisma";

export default defineEventHandler(async (event) => {
  const user = event.context.user as { sub: string; email: string };

  const userJiraAccount = await prismaService.jiraAccount.findFirst({
    where: { userId: user.sub },
    select: {
      id: true,
      companyEmail: true,
      issueTime: true,
      active: true,
      worklogHistories: true,
    }
  })

  if (!userJiraAccount) {
    console.error(`Jira account not found for user ${user.email}`);

    throw createError({
      statusCode: 404,
      message: `Jira account not found for user ${user.email}`,
    });
  }

  if (!userJiraAccount.active) {
    console.error(`Jira account is not active for user ${userJiraAccount.companyEmail}`);

    throw createError({
      statusCode: 403,
      message: `Jira account is not active for user ${userJiraAccount.companyEmail}`,
    });
  }

  const today = new Date();

  const alreadyLogged = await prismaService.worklogHistory.findFirst({
    where: {
      jiraAccountId: userJiraAccount.id,
    }
  })

  const alreadyLoggedToday = alreadyLogged && alreadyLogged.date.toDateString() === today.toDateString();

  if (alreadyLoggedToday) {
    console.log(`Worklog already logged for user ${user.sub} today`);
    return {
      statusCode: 204,
    }
  }

  await prismaService.worklogHistory.create({
    data: {
      jiraAccountId: userJiraAccount.id,
      userId: user.sub,
      timeSpent: userJiraAccount.issueTime,
      date: today
    }
  })

  console.log(`Worklog logged for user ${user.sub} with time spent ${userJiraAccount.issueTime} minutes`);

  return { 
    statusCode: 200,
    message: `Worklog logged for user ${user.sub} with time spent ${userJiraAccount.issueTime}`
  }
})