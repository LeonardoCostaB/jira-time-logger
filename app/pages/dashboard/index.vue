<script lang="ts" setup>
    import { toast } from 'vue-sonner';
    import { PhArrowSquareOut, PhFolderOpen, PhTrash } from '@phosphor-icons/vue';

    import Modal from '~/components/modal.vue';
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
    const shouldShowDeleteModal = ref({
        id: '',
        email: '',
        show: false,
    });

    function DeleteAccount() {
        if (!shouldShowDeleteModal.value.id) return;

        toast.success(`Conta ${shouldShowDeleteModal.value.email} deletada com sucesso!`);
        shouldShowDeleteModal.value = {
            id: '',
            email: '',
            show: false,
        };
    }
</script>

<template>
    <NuxtLayout name="dashboard">
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
                        <h2 class="text-2xl">Suas Contas no Jira</h2>
                        <NuxtLink
                            class="rounded bg-violet-600 px-4 py-2 text-sm transition-colors hover:bg-violet-500"
                            to="/dashboard/jira/preferences"
                        >
                            Adicionar nova automação
                        </NuxtLink>
                    </div>

                    <table class="w-full rounded-lg bg-slate-700 text-left">
                        <thead>
                            <tr>
                                <th class="p-4">Conta</th>
                                <th class="p-4">Status</th>
                                <th class="p-4">Issues</th>
                                <th class="p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="account in jiraPreferences" :key="account.id">
                                <td class="p-4">{{ account.companyEmail }}</td>
                                <td class="p-4">
                                    <span
                                        :class="
                                            account.active ? 'status-active' : 'status-inactive'
                                        "
                                    >
                                        {{ account.active ? 'Ativo' : 'Inativo' }}
                                    </span>
                                </td>
                                <td class="p-4">
                                    <button
                                        class="flex w-full items-center justify-center gap-2 underline"
                                        @click="shouldShowIssuesModal = true"
                                    >
                                        <PhFolderOpen size="24" />
                                    </button>

                                    <IssuesModal
                                        :ref="account.id"
                                        :jira-account-id="account.id"
                                        :email="account.companyEmail"
                                        :issues="account.issues"
                                        :show="shouldShowIssuesModal"
                                        @issue-modal-close="shouldShowIssuesModal = false"
                                    />
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center justify-center gap-2">
                                        <NuxtLink
                                            :to="`/dashboard/jira/preferences/${account.id}`"
                                            class="rounded-full bg-slate-500 p-1 hover:bg-violet-500"
                                            :prefetch="false"
                                        >
                                            <PhArrowSquareOut />
                                        </NuxtLink>

                                        <button
                                            type="button"
                                            class="rounded-full bg-slate-500 p-1 hover:bg-red-500"
                                            @click="
                                                shouldShowDeleteModal = {
                                                    id: account.id,
                                                    email: account.companyEmail,
                                                    show: true,
                                                }
                                            "
                                        >
                                            <PhTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="flex flex-col gap-6">
                    <p class="text-xl">Nenhuma conta Jira vinculada.</p>
                    <button @click="$router.push('dashboard/jira/preferences')">
                        Conectar agora
                    </button>
                </div>
            </section>

            <Modal
                :title="'Deletar'"
                :description="`Tem certeza que deseja deletar sua conta ${shouldShowDeleteModal.email}?`"
                :show="shouldShowDeleteModal.show"
                :actions="true"
                @close="shouldShowDeleteModal = { id: '', email: '', show: false }"
            >
                <template #header>
                    <h2 class="text-center text-xl">Deletar Conta Jira</h2>
                </template>
                <template #body>
                    <p class="text-center">
                        Tem certeza que deseja deletar a conta {{ shouldShowDeleteModal.email }}?
                    </p>
                </template>
                <template #actions>
                    <button
                        class="w-full rounded bg-red-700/50 px-4 py-2 text-sm transition-colors hover:bg-red-500"
                        @click="DeleteAccount()"
                    >
                        Deletar
                    </button>
                    <button
                        class="w-full rounded border border-slate-500 px-4 py-2 text-sm transition-colors hover:bg-slate-500/50"
                        @click="shouldShowDeleteModal = { id: '', email: '', show: false }"
                    >
                        Cancelar
                    </button>
                </template>
            </Modal>
        </main>
    </NuxtLayout>
</template>
