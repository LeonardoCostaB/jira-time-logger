<script lang="ts" setup>
    import { toast } from 'vue-sonner';
    import { PhArrowSquareOut, PhTrash, PhX } from '@phosphor-icons/vue';

    import type { JiraIssue } from '~~/server/db/generated';

    import { formatTime, formatToDays } from '../utils/format-time';

    const props = defineProps<{
        jiraAccountId: string;
        email: string;
        issues: JiraIssue[];
        show: boolean;
    }>();

    const shouldShowDeleteModal = ref({
        id: '',
        key: '',
        show: false,
    });

    async function DeleteIssue() {
        try {
            const deleteIssueFetch = await $fetch<{
                message: string;
                success: boolean;
                issueKey: string;
            }>(`/api/pvt/jira/preferences/issue/${shouldShowDeleteModal.value.id}`, {
                method: 'DELETE',
                body: {
                    jiraAccountId: props.jiraAccountId,
                },
            });

            if (deleteIssueFetch.success) {
                toast.success(`Issue ${shouldShowDeleteModal.value.key} deletada com sucesso!`);
                shouldShowDeleteModal.value = { id: '', key: '', show: false };
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocorreu um erro ao deletar a issue. Tente novamente mais tarde.');
            return;
        }
    }
</script>

<template>
    <div v-show="props.show" class="fixed inset-0 bg-black bg-opacity-50" />
    <div
        v-show="props.show"
        class="fixed left-1/2 top-1/2 mx-auto flex h-fit w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-lg bg-slate-600 p-6"
    >
        <h2 class="text-center text-xl">
            Seus Issues <br />
            {{ props.email }}
        </h2>

        <button class="absolute right-6 top-6" type="button" @click="$emit('close')">
            <PhX />
        </button>

        <table v-if="props.issues.length" class="mt-8 w-full rounded-lg bg-slate-700 text-left">
            <thead>
                <tr>
                    <th v-for="(value, key) in props.issues[0]" :key="key" class="p-4">
                        {{ key }}
                    </th>
                    <th class="p-4">Total em dias</th>
                    <th class="p-4">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="issue in props.issues" :key="issue.id">
                    <td class="p-4">{{ issue.issueKey }}</td>
                    <td class="p-4">{{ formatTime(issue.issueTime) }}</td>
                    <td class="p-4">{{ issue.active }}</td>
                    <td class="p-4">{{ issue.totalSpentSoFar }}</td>
                    <td class="p-4">{{ formatToDays(issue.totalSpentSoFar) }}</td>
                    <td class="p-4">
                        <div class="flex items-center justify-center gap-2">
                            <NuxtLink
                                :to="`/dashboard/issues/${issue.id}`"
                                class="rounded-full bg-slate-500 p-1 hover:bg-violet-500"
                            >
                                <PhArrowSquareOut />
                            </NuxtLink>

                            <button
                                type="button"
                                class="rounded-full bg-slate-500 p-1 hover:bg-red-500"
                                @click="
                                    shouldShowDeleteModal = {
                                        id: issue.id,
                                        key: issue.issueKey,
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

        <p v-else class="pt-10 text-lg">Você não tem issues atribuídas.</p>
    </div>

    <Modal
        :title="'Deletar'"
        :description="`Tem certeza que deseja deletar a issue ${shouldShowDeleteModal.key}?`"
        :show="shouldShowDeleteModal.show"
        :actions="true"
        @close="shouldShowDeleteModal = { id: '', key: '', show: false }"
    >
        <template #actions>
            <button
                class="w-full rounded bg-red-700/50 px-4 py-2 text-sm transition-colors hover:bg-red-500"
                @click="DeleteIssue()"
            >
                Deletar
            </button>
            <button
                class="w-full rounded border border-slate-500 px-4 py-2 text-sm transition-colors hover:bg-slate-500/50"
                @click="shouldShowDeleteModal = { id: '', key: '', show: false }"
            >
                Cancelar
            </button>
        </template>
    </Modal>
</template>
