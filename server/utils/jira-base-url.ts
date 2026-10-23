const cloudIdCache = new Map<string, string>();

/**
 * Tokens de API com escopo só funcionam no gateway da Atlassian
 * (api.atlassian.com/ex/jira/{cloudId}), então resolvemos o cloudId a partir do domínio.
 */
async function getCloudId(domain: string): Promise<string> {
    const cached = cloudIdCache.get(domain);

    if (cached) return cached;

    const response = await fetch(`https://${domain}/_edge/tenant_info`);

    if (!response.ok) {
        throw new Error(
            `Não foi possível obter o cloudId do domínio ${domain}: ${response.status}`,
        );
    }

    const { cloudId } = (await response.json()) as { cloudId?: string };

    if (!cloudId) {
        throw new Error(`Resposta sem cloudId para o domínio ${domain}`);
    }

    cloudIdCache.set(domain, cloudId);

    return cloudId;
}

export async function getJiraBaseUrl(domain: string): Promise<string> {
    const cloudId = await getCloudId(domain);

    return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
}
