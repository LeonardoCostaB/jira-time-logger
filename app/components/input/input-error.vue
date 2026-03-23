<script setup lang="ts">
    import { inject, type Ref } from 'vue';

    const context = inject<{ errors: Ref<boolean> }>('inputContext', {
        errors: { value: false } as any,
    });
</script>

<template>
    <span
        v-if="context.errors.value"
        class="animate-in fade-in slide-in-from-top-1 block pt-2 text-xs font-medium text-red-500"
    >
        <slot />
    </span>
</template>
