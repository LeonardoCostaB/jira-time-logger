<template>
    <NuxtLayout name="dashboard">
        <main class="mx-auto h-screen max-w-7xl pt-10">
            <h1 class="mb-6 text-3xl font-bold">Configurações da Issue</h1>

            <section class="flex h-[90%] items-center justify-center">
                <p>Configurações para a issue com ID: {{ $route.params.id }}</p>
            </section>
        </main>
    </NuxtLayout>
</template>
