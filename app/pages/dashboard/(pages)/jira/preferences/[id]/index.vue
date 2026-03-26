<script setup lang="ts">
    import type { JiraAccount } from '~~/server/db/generated';

    const route = useRoute();
    const preferences = ref<JiraAccount | null>(null);

    watch(
        () => route?.params?.id,
        async (jiraAccountId) => {
            console.log('Route parameter "id" changed:', jiraAccountId);
            if (jiraAccountId) {
                try {
                    const fetch = await $fetch<{
                        preferences: JiraAccount;
                    }>(`/api/pvt/jira/preferences/${jiraAccountId}`, {
                        method: 'GET',
                    });

                    if (!fetch || !fetch.preferences) {
                        console.warn('No preferences found for Jira Account ID:', jiraAccountId);
                        return;
                    }

                    preferences.value = fetch.preferences;
                } catch (error) {
                    console.error('Error fetching preferences:', error);
                }
            }
        },
        { immediate: true },
    );
</script>

<template>
    <NuxtLayout name="dashboard">
        <main class="mx-auto h-screen max-w-7xl pt-10">
            <h1 class="mb-6 text-3xl font-bold">Conta Jira</h1>

            <section class="flex h-[90%] items-center justify-center">
                <div v-if="preferences?.id">
                    <!-- <h2 class="mb-4 text-2xl font-semibold">{{ preferences?.companyEmail }}</h2> -->
                    <pre class="overflow-x-auto rounded-lg">
                        {{ preferences }}
                    </pre>
                </div>
                <p v-else>Configurações para a issue com ID: {{ $route.params.id }}</p>
            </section>
        </main>
    </NuxtLayout>
</template>
