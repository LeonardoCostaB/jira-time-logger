<script lang="ts" setup>
    import { PhX } from '@phosphor-icons/vue';

    defineEmits(['close']);

    const props = defineProps<{
        show: boolean;
        title: string;
        description: string;
        actions?: boolean;
    }>();
</script>

<template>
    <div v-show="props.show" class="fixed inset-0 bg-black bg-opacity-50" />
    <div
        v-show="props.show"
        class="fixed left-1/2 top-1/2 mx-auto flex h-fit w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-lg bg-slate-700 p-6"
    >
        <button class="absolute right-6 top-6" type="button" @click="$emit('close')">
            <PhX />
        </button>

        <h2 class="text-center text-xl">{{ props.title }}</h2>

        <p class="py-4 text-center">{{ props.description }}</p>

        <div v-if="props.actions" class="mt-4 flex w-1/2 items-stretch justify-center gap-4">
            <slot name="actions" />
        </div>
    </div>
</template>
