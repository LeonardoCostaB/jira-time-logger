<script setup lang="ts">
    import { Toaster } from 'vue-sonner';

    import 'vue-sonner/style.css';
</script>

<template>
    <NuxtPage>
        <Toaster />
    </NuxtPage>
</template>

<style>
    body {
        @apply bg-slate-900 text-white;
    }

    #__nuxt {
        @apply min-h-screen;
    }
</style>
