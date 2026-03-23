<script setup lang="ts">
    import { computed, inject, type Ref, ref } from 'vue';
    import { PhEye, PhEyeClosed } from '@phosphor-icons/vue';

    interface InputContext {
        id: Ref<string>;
        errors: Ref<boolean>;
    }

    const context = inject<InputContext>('inputContext');

    // Desabilita a herança automática para podermos controlar onde os attrs vão
    defineOptions({
        inheritAttrs: false,
    });

    const props = defineProps<{
        modelValue?: string;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();

    const shouldShowPassword = ref(false);
    const inputType = computed(() => (shouldShowPassword.value ? 'text' : 'password'));

    const onInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.value);
    };

    const inputClasse = computed(() => [
        'p-2 bg-slate-600 text-white p-4 w-full rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-700 focus:ring-violet-300 transition-colors',
        context?.errors?.value ? 'border-red-500' : 'border-transparent',
    ]);
</script>

<template>
    <div class="relative w-full">
        <input
            v-bind="$attrs"
            :id="context?.id?.value"
            :name="context?.id?.value"
            :type="inputType"
            :value="props.modelValue"
            :class="inputClasse"
            @input="onInput"
        />

        <button
            type="button"
            tabindex="-1"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-white"
            @click="shouldShowPassword = !shouldShowPassword"
        >
            <PhEye v-if="!shouldShowPassword" :size="24" />
            <PhEyeClosed v-else :size="24" />
        </button>
    </div>
</template>
