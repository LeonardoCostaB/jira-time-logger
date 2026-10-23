import { getJiraBaseUrl } from '~~/server/utils/jira-base-url';

interface JiraCredentials {
    companyEmail: string;
    companyDomain: string;
    apiToken: string;
}

export interface TodayJiraWorklog {
    hasWorklogToday: boolean;
    totalSeconds: number;
    issueKeys: string[];
}

interface JiraMyself {
    accountId: string;
}

interface JiraSearchResult {
    issues?: Array<{ key: string }>;
}

interface JiraIssueWorklogs {
    worklogs?: Array<{
        author?: { accountId?: string };
        started?: string;
        timeSpentSeconds?: number;
    }>;
}

const JIRA_TIMEZONE = 'America/Sao_Paulo';
const JIRA_TIMEZONE_OFFSET = '-03:00';

// worklogDate usa a granularidade de dia do Jira; o intervalo abaixo serve para
// filtrar os worklogs retornados pelo horário exato em que foram lançados.
function getTodayRange() {
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: JIRA_TIMEZONE }).format(new Date());

    return {
        date,
        startOfDay: new Date(`${date}T00:00:00.000${JIRA_TIMEZONE_OFFSET}`),
        endOfDay: new Date(`${date}T23:59:59.999${JIRA_TIMEZONE_OFFSET}`),
    };
}

function buildHeaders({ companyEmail, apiToken }: JiraCredentials) {
    const auth = Buffer.from(`${companyEmail}:${apiToken}`).toString('base64');

    return {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
}

async function jiraFetch<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, init);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Jira API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return (await response.json()) as T;
}

/**
 * Consulta no Jira se o usuário já lançou alguma hora hoje (em qualquer issue),
 * para evitar que o registro automático duplique o tempo do dia.
 */
export async function getTodayJiraWorklog(credentials: JiraCredentials): Promise<TodayJiraWorklog> {
    const { startOfDay, endOfDay } = getTodayRange();
    const headers = buildHeaders(credentials);
    const baseUrl = await getJiraBaseUrl(credentials.companyDomain);

    const { accountId } = await jiraFetch<JiraMyself>(`${baseUrl}/myself`, { headers });

    const search = await jiraFetch<JiraSearchResult>(`${baseUrl}/search/jql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            jql: 'worklogAuthor = currentUser() AND worklogDate >= startOfDay() AND worklogDate <= endOfDay()',
            fields: ['key'],
            maxResults: 100,
        }),
    });

    const issueKeys = search.issues?.map((issue) => issue.key) ?? [];

    if (issueKeys.length === 0) {
        return { hasWorklogToday: false, totalSeconds: 0, issueKeys: [] };
    }

    let totalSeconds = 0;

    for (const issueKey of issueKeys) {
        const { worklogs = [] } = await jiraFetch<JiraIssueWorklogs>(
            `${baseUrl}/issue/${issueKey}/worklog?startedAfter=${startOfDay.getTime()}`,
            { headers },
        );

        totalSeconds += worklogs
            .filter((worklog) => worklog.author?.accountId === accountId)
            .filter((worklog) => {
                const started = new Date(worklog.started ?? '').getTime();

                return started >= startOfDay.getTime() && started <= endOfDay.getTime();
            })
            .reduce((total, worklog) => total + (worklog.timeSpentSeconds ?? 0), 0);
    }

    return { hasWorklogToday: true, totalSeconds, issueKeys };
}
