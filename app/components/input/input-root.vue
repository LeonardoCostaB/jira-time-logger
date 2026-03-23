<script setup lang="ts">
    import { provide, toRefs } from 'vue';

    const props = defineProps<{
        id: string;
        errors?: boolean;
    }>();

    // toRefs para que o provide mantenha a reatividade das props
    const { id, errors } = toRefs(props);

    // Chaves de injeção (idealmente em um arquivo de constantes, mas pode ser aqui)
    provide('inputContext', {
        id,
        errors,
    });
</script>

<template>
    <div class="flex w-full flex-col gap-1.5">
        <slot />
    </div>
</template>
