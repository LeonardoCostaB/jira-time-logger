<script setup lang="ts">
    import { toast } from 'vue-sonner';

    import type { JiraAccount, JiraIssue } from '~~/server/db/generated';

    type AccountWithIssues = Omit<JiraAccount, 'apiToken'> & { issues: JiraIssue[] };
    type IssueDraft = { id: string; issueKey: string; issueTime: string; saving: boolean };

    const route = useRoute();
    const accountId = route.params.id as string;

    const account = ref<AccountWithIssues | null>(null);
    const apiToken = ref('');
    const savingToken = ref(false);
    const issueDrafts = ref<IssueDraft[]>([]);

    const TIME_PATTERN = /^\d+[smhd]$/;
    const inputClass =
        'w-full rounded bg-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500';
    const buttonClass =
        'rounded bg-violet-700/60 px-4 py-2 text-sm transition-colors hover:bg-violet-500 disabled:opacity-50';

    function secondsToInput(seconds: number) {
        if (seconds % 3600 === 0) return `${seconds / 3600}h`;
        if (seconds % 60 === 0) return `${seconds / 60}m`;

        return `${seconds}s`;
    }

    async function loadAccount() {
        try {
            const response = await $fetch<{ preferences: AccountWithIssues }>(
                `/api/pvt/jira/preferences/${accountId}`,
            );

            account.value = response.preferences;
            issueDrafts.value = response.preferences.issues.map((issue) => ({
                id: issue.id,
                issueKey: issue.issueKey,
                issueTime: secondsToInput(issue.issueTime),
                saving: false,
            }));
        } catch (error) {
            console.error('Error fetching account:', error);
            toast.error('Não foi possível carregar a conta.');
        }
    }

    async function saveToken() {
        if (!apiToken.value.trim()) {
            toast.error('Informe o novo token.');
            return;
        }

        savingToken.value = true;

        try {
            await $fetch(`/api/pvt/jira/account/${accountId}`, {
                method: 'PUT',
                body: { apiToken: apiToken.value.trim() },
            });

            apiToken.value = '';
            toast.success('Token atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating token:', error);
            toast.error('Não foi possível atualizar o token.');
        } finally {
            savingToken.value = false;
        }
    }

    async function saveIssue(draft: IssueDraft) {
        if (!draft.issueKey.trim() || !TIME_PATTERN.test(draft.issueTime.trim())) {
            toast.error('Informe a issue key e um tempo válido (ex: 8h, 30m, 1d).');
            return;
        }

        draft.saving = true;

        try {
            await $fetch(`/api/pvt/jira/preferences/issue/${draft.id}`, {
                method: 'PUT',
                body: { issueKey: draft.issueKey.trim(), issueTime: draft.issueTime.trim() },
            });

            toast.success(`Issue ${draft.issueKey} atualizada com sucesso!`);
        } catch (error) {
            console.error('Error updating issue:', error);
            toast.error('Não foi possível atualizar a issue.');
        } finally {
            draft.saving = false;
        }
    }

    await loadAccount();
</script>

<template>
    <NuxtLayout name="dashboard">
        <main class="mx-auto max-w-3xl px-4 pt-10">
            <h1 class="mb-1 text-3xl font-bold">Conta Jira</h1>
            <p v-if="account" class="mb-8 text-slate-300">
                {{ account.companyEmail }} · {{ account.companyDomain }}
            </p>

            <template v-if="account">
                <section class="mb-8 rounded-lg bg-slate-700 p-6">
                    <h2 class="mb-4 text-xl font-semibold">Token da API</h2>
                    <form class="flex gap-3" @submit.prevent="saveToken">
                        <input
                            v-model="apiToken"
                            type="password"
                            autocomplete="off"
                            placeholder="Cole o novo token"
                            :class="inputClass"
                        />
                        <button type="submit" :disabled="savingToken" :class="buttonClass">
                            Salvar
                        </button>
                    </form>
                </section>

                <section class="rounded-lg bg-slate-700 p-6">
                    <h2 class="mb-4 text-xl font-semibold">Issues</h2>

                    <p v-if="!issueDrafts.length" class="text-slate-300">
                        Esta conta não tem issues cadastradas.
                    </p>

                    <form
                        v-for="draft in issueDrafts"
                        :key="draft.id"
                        class="mb-3 flex gap-3"
                        @submit.prevent="saveIssue(draft)"
                    >
                        <input v-model="draft.issueKey" placeholder="SE-123" :class="inputClass" />
                        <input
                            v-model="draft.issueTime"
                            placeholder="8h"
                            :class="[inputClass, 'max-w-28']"
                        />
                        <button type="submit" :disabled="draft.saving" :class="buttonClass">
                            Salvar
                        </button>
                    </form>
                </section>
            </template>

            <p v-else class="text-slate-300">Conta não encontrada.</p>
        </main>
    </NuxtLayout>
</template>
