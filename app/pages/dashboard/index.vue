<script lang="ts" setup>
    import type { JiraIssue } from '~~/server/db/generated';

    import IssuesModal from './components/issues-modal.vue';

    interface JiraAccountDisplay {
        id: string;
        companyEmail: string;
        active: boolean;
        issues: JiraIssue[];
    }

    const {
        data: jiraPreferences,
        pending,
        error,
    } = await useFetch<JiraAccountDisplay[]>('/api/pvt/jira/preferences', {
        lazy: true,
        transform: (data) => data || [],
    });

    const shouldShowIssuesModal = ref(false);
</script>

<template>
    <main class="mx-auto h-screen max-w-7xl pt-10">
        <h1 class="sr-only mb-6 text-3xl font-bold">Dashboard</h1>

        <section class="flex h-[90%] items-center justify-center">
            <div v-if="pending">
                <p>Carregando preferências...</p>
            </div>

            <div v-else-if="error">
                <p>Erro ao carregar dados. Tente novamente mais tarde.</p>
            </div>

            <div v-else-if="jiraPreferences && jiraPreferences.length > 0">
                <div class="flex items-center justify-between pb-4">
                    <h2 class="text-lg">Suas Contas no Jira</h2>
                    <NuxtLink
                        class="rounded bg-blue-100 px-4 py-2 text-blue-700"
                        to="/dashboard/jira/preferences"
                    >
                        Adicionar nova automação
                    </NuxtLink>
                </div>

                <table class="w-full rounded-lg bg-slate-700 text-left">
                    <thead>
                        <tr>
                            <th class="p-4">Email</th>
                            <th class="p-4">Status</th>
                            <th class="p-4">Issues</th>
                            <th class="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="account in jiraPreferences" :key="account.id">
                            <td class="p-4">{{ account.companyEmail }}</td>
                            <td class="p-4">
                                <span :class="account.active ? 'status-active' : 'status-inactive'">
                                    {{ account.active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="p-4">
                                <button class="underline" @click="shouldShowIssuesModal = true">
                                    Ver Issues
                                </button>

                                <IssuesModal
                                    :email="account.companyEmail"
                                    :issues="account.issues"
                                    :show="shouldShowIssuesModal"
                                    @close="shouldShowIssuesModal = false"
                                />
                            </td>
                            <td class="p-4">
                                <button
                                    @click="
                                        $router.push(`/dashboard/jira/preferences/${account.id}`)
                                    "
                                >
                                    Configurar Automação
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex flex-col gap-6">
                <p class="text-xl">Nenhuma conta Jira vinculada.</p>
                <button @click="$router.push('dashboard/jira/preferences')">Conectar agora</button>
            </div>
        </section>
    </main>
</template>
