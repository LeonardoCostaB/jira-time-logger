<script setup lang="ts">
    import { computed, inject, type Ref } from 'vue';

    interface InputContext {
        id: Ref<string>;
        errors: Ref<boolean>;
    }

    const context = inject<InputContext>('inputContext');
    const modelValue = defineModel<string>({ default: '' });

    const props = defineProps<{
        type: HTMLInputElement['type'];
    }>();

    const inputClasse = computed(() => [
        'p-2 bg-slate-600 text-white p-4 w-full rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-700 focus:ring-violet-300 transition-colors',
        context?.errors?.value ? 'border-red-500' : 'border-transparent',
    ]);
</script>

<template>
    <input
        :id="context?.id?.value"
        v-model="modelValue"
        :name="context?.id?.value"
        :type="props.type"
        :class="inputClasse"
    />
</template>
