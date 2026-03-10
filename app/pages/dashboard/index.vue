<script setup lang="ts">
    import { computed } from 'vue';

    import { Input } from '../../components/input';

    import { useJiraPreferences } from './use-jira-preferences';

    const { onSubmit, defineField, errors } = useJiraPreferences();

    const [jiraEmail, jiraEmailAttrs] = defineField('jiraEmail');

    const [jiraApiToken, jiraApiTokenAttrs] = defineField('jiraApiToken');

    const [jiraIssueKey, jiraIssueKeyAttrs] = defineField('jiraIssueKey');

    const [jiraIssueTime, jiraIssueTimeAttrs] = defineField('jiraIssueTime');

    const hasErrors = computed(() => {
        return {
            jiraEmail: {
                show: !!errors.value.jiraEmail,
                message: errors.value.jiraEmail,
            },
            jiraApiToken: {
                show: !!errors.value.jiraApiToken,
                message: errors.value.jiraApiToken,
            },
            jiraIssueKey: {
                show: !!errors.value.jiraIssueKey,
                message: errors.value.jiraIssueKey,
            },
            jiraIssueTime: {
                show: !!errors.value.jiraIssueTime,
                message: errors.value.jiraIssueTime,
            },
        };
    });
</script>

<template>
    <main class="mx-auto max-w-7xl pt-10">
        <h1 class="mb-6 text-3xl font-bold">Jira Preferences</h1>

        <section>
            <form class="mx-auto max-w-xl rounded-lg bg-slate-800 p-4" @submit.prevent="onSubmit">
                <Input.Root>
                    <Input.Label id="jiraEmail">Seu email no Jira</Input.Label>
                    <Input.Normal
                        v-bind="jiraEmailAttrs"
                        id="jiraEmail"
                        v-model="jiraEmail"
                        type="email"
                        placeholder="exemplo@dominio.com"
                        :errors="hasErrors.jiraEmail.show"
                    />
                    <Input.Error v-if="hasErrors.jiraEmail.show" class="block">
                        {{ hasErrors.jiraEmail.message }}
                    </Input.Error>
                </Input.Root>

                <Input.Root class="my-6">
                    <Input.Label id="jiraApiToken">API Token</Input.Label>
                    <Input.Normal
                        v-bind="jiraApiTokenAttrs"
                        id="jiraApiToken"
                        v-model="jiraApiToken"
                        type="password"
                        placeholder="Digite o seu API Token do Jira"
                        :errors="hasErrors.jiraApiToken.show"
                    />
                    <Input.Error v-if="hasErrors.jiraApiToken.show" class="block">
                        {{ hasErrors.jiraApiToken.message }}
                    </Input.Error>
                </Input.Root>

                <Input.Root>
                    <Input.Label id="jiraIssueKey">Issue Key</Input.Label>
                    <Input.Normal
                        v-bind="jiraIssueKeyAttrs"
                        id="jiraIssueKey"
                        v-model="jiraIssueKey"
                        type="text"
                        placeholder="Digite a Issue Key (ex: PROJ-123)"
                        :errors="hasErrors.jiraIssueKey.show"
                    />
                    <Input.Error v-if="hasErrors.jiraIssueKey.show" class="block">
                        {{ hasErrors.jiraIssueKey.message }}
                    </Input.Error>
                </Input.Root>

                <Input.Root class="my-6">
                    <Input.Label id="jiraIssueTime">Issue Time</Input.Label>
                    <Input.Normal
                        v-bind="jiraIssueTimeAttrs"
                        id="jiraIssueTime"
                        v-model="jiraIssueTime"
                        type="text"
                        placeholder="Digite o tempo da Issue (ex: 2h 30m)"
                        :errors="hasErrors.jiraIssueTime.show"
                    />
                    <Input.Error v-if="hasErrors.jiraIssueTime.show" class="block">
                        {{ hasErrors.jiraIssueTime.message }}
                    </Input.Error>
                </Input.Root>

                <button type="submit" class="w-full rounded-md bg-violet-600 p-3 text-white">
                    Salvar Preferências
                </button>
            </form>
        </section>
    </main>
</template>
