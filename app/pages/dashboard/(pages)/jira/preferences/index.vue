<script setup lang="ts">
    import { computed } from 'vue';
    import { PhArrowLeft } from '@phosphor-icons/vue';

    import { Input } from '~/components/input';

    import { useJiraPreferences } from './use-jira-preferences';

    const { onSubmit, defineField, errors } = await useJiraPreferences();

    const [jiraEmail, jiraEmailAttrs] = defineField('jiraEmail');
    const [jiraApiToken, jiraApiTokenAttrs] = defineField('jiraApiToken');
    const [jiraIssueKey, jiraIssueKeyAttrs] = defineField('jiraIssueKey');
    const [jiraIssueTime, jiraIssueTimeAttrs] = defineField('jiraIssueTime');
    const [jiraDomain, jiraDomainAttrs] = defineField('jiraDomain');

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
            jiraDomain: {
                show: !!errors.value.jiraDomain,
                message: errors.value.jiraDomain,
            },
        };
    });
</script>

<template>
    <NuxtLayout name="dashboard">
        <main class="mx-auto max-w-7xl pt-10">
            <div class="relative mx-auto mb-6 flex w-full max-w-xl items-center justify-center">
                <NuxtLink
                    class="absolute left-0 mb-6 inline-block rounded bg-slate-600 px-4 py-2 text-sm transition-colors hover:bg-slate-500"
                    to="/dashboard"
                >
                    <PhArrowLeft />
                </NuxtLink>
                <h1 class="mb-6 text-center text-3xl font-bold">Jira Preferences</h1>
            </div>

            <section>
                <form
                    class="mx-auto max-w-xl rounded-lg bg-slate-800 p-4"
                    @submit.prevent="onSubmit"
                >
                    <Input.Root id="jiraEmail" :errors="hasErrors.jiraEmail.show">
                        <Input.Label>Seu email no Jira</Input.Label>
                        <Input.Normal
                            v-bind="jiraEmailAttrs"
                            v-model="jiraEmail"
                            type="email"
                            placeholder="exemplo@dominio.com"
                        />
                        <Input.Error class="block">
                            {{ hasErrors.jiraEmail.message }}
                        </Input.Error>
                    </Input.Root>

                    <Input.Root id="jiraDomain" class="my-6" :errors="hasErrors.jiraDomain.show">
                        <Input.Label>Domínio da Empresa no Jira</Input.Label>
                        <Input.Normal
                            v-bind="jiraDomainAttrs"
                            v-model="jiraDomain"
                            type="text"
                            placeholder="ex: minha-empresa.atlassian.net"
                        />
                        <Input.Error class="block">
                            {{ hasErrors.jiraDomain.message }}
                        </Input.Error>
                    </Input.Root>

                    <Input.Root id="jiraApiToken">
                        <Input.Label>API Token</Input.Label>
                        <Input.Normal
                            v-bind="jiraApiTokenAttrs"
                            v-model="jiraApiToken"
                            type="password"
                            placeholder="Digite o seu API Token do Jira"
                        />
                        <Input.Error class="block">
                            {{ hasErrors.jiraApiToken.message }}
                        </Input.Error>
                    </Input.Root>

                    <Input.Root id="jiraIssueKey" class="my-6">
                        <Input.Label>Issue Key</Input.Label>
                        <Input.Normal
                            v-bind="jiraIssueKeyAttrs"
                            v-model="jiraIssueKey"
                            type="text"
                            placeholder="Digite a Issue Key (ex: PROJ-123)"
                        />
                        <Input.Error class="block">
                            {{ hasErrors.jiraIssueKey.message }}
                        </Input.Error>
                    </Input.Root>

                    <Input.Root id="jiraIssueTime">
                        <Input.Label>Issue Time</Input.Label>
                        <Input.Normal
                            v-bind="jiraIssueTimeAttrs"
                            v-model="jiraIssueTime"
                            type="text"
                            placeholder="Digite o tempo da Issue (ex: 2h 30m)"
                        />
                        <Input.Error class="block">
                            {{ hasErrors.jiraIssueTime.message }}
                        </Input.Error>
                    </Input.Root>

                    <button
                        type="submit"
                        class="mt-6 w-full rounded-md bg-violet-600 p-3 text-white"
                    >
                        Salvar Preferências
                    </button>
                </form>
            </section>
        </main>
    </NuxtLayout>
</template>
