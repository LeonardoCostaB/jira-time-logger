<script setup lang="ts">
    import { computed, defineComponent, useAttrs } from 'vue';

    const props = defineProps({
        type: {
            type: String as () => HTMLInputElement['type'],
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
        errors: {
            type: Boolean,
            required: false,
            default: false,
        },
    });

    defineComponent({
        name: 'InputNormal',
    });

    const attrs = useAttrs();
    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();

    const onInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.value);
    };

    const inputClasse = computed(() => [
        'p-2 bg-slate-600 text-white p-4 w-full rounded-md border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-700 focus:ring-violet-300 transition-colors',
        {
            'border-red-500': props.errors,
            'border-transparent': !props.errors,
        },
    ]);
</script>

<template>
    <input
        v-bind="attrs"
        :id="props.id"
        :value="props.modelValue"
        :type="props.type || 'text'"
        :name="props.id"
        :class="inputClasse"
        @input="onInput"
    />
</template>
