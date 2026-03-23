<script lang="ts" setup>
    import type { JiraIssue } from '~~/server/db/generated';

    import { formatTime, formatToDays } from '../utils/format-time';

    const props = defineProps<{
        email: string;
        issues: JiraIssue[];
        show: boolean;
    }>();
</script>

<template>
    <div v-show="props.show" class="fixed inset-0 bg-black bg-opacity-50" />
    <div
        v-show="props.show"
        class="fixed left-1/2 top-1/2 mx-auto flex h-fit w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-lg bg-slate-600 p-6"
    >
        <h2 class="text-center text-xl">
            Seus Issues <br />
            {{ props.email }}
        </h2>
        <button class="absolute right-6 top-6" type="button" @click="$emit('close')">X</button>

        <table v-if="props.issues.length" class="mt-8 w-full rounded-lg bg-slate-700 text-left">
            <thead>
                <tr>
                    <th v-for="(value, key) in props.issues[0]" :key="key" class="p-4">
                        {{ key }}
                    </th>
                    <th>Total em dias</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="issue in props.issues" :key="issue.id">
                    <td class="p-4">{{ issue.issueKey }}</td>
                    <td class="p-4">{{ formatTime(issue.issueTime) }}</td>
                    <td class="p-4">{{ issue.active }}</td>
                    <td class="p-4">{{ issue.totalSpentSoFar }}</td>
                    <td class="p-4">{{ formatToDays(issue.totalSpentSoFar) }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else class="pt-10 text-lg">Você não tem issues atribuídas.</p>
    </div>
</template>
