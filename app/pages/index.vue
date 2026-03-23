<template>
    <main class="flex h-screen items-center justify-center">
        <div
            class="flex max-w-4xl flex-1 flex-col items-center justify-center gap-6 bg-slate-800 p-8"
        >
            <h1 class="text-4xl">Jira Auto Log</h1>
            <p class="text-center text-lg">
                Esta aplicação permite que você registre automaticamente suas atividades no Jira,
                economizando tempo e esforço. Para começar, faça login ou crie uma conta para
                configurar suas preferências e conectar sua conta do Jira.
            </p>

            <NuxtLink
                href="/login"
                class="w-1/2 rounded bg-slate-600 px-4 py-2 text-center text-lg text-white transition-all hover:bg-slate-400"
            >
                Fazer Login
            </NuxtLink>

            <NuxtLink
                href="/criar-conta"
                class="w-1/2 rounded bg-violet-600 px-4 py-2 text-center text-lg text-white transition-all hover:bg-violet-400"
            >
                Criar Conta
            </NuxtLink>
        </div>
    </main>
</template>
