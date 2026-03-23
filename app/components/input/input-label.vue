<script setup lang="ts">
    import { inject } from 'vue';

    // Injetamos o contexto do pai
    const context = inject<{ id: string }>('inputContext');
</script>

<template>
    <label :for="context?.id" class="text-sm font-medium text-zinc-300">
        <slot />
    </label>
</template>
