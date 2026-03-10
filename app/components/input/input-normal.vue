<script setup lang="ts">
    import { computed, defineComponent, useAttrs } from 'vue'

    const props = defineProps({
        type: {
            type: String as () => HTMLInputElement['type'],
            required: true,
            default: 'text',
        },
        id: {
            type: String,
            required: true,
            default: null,
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
        }
    })

    defineComponent({
        name: 'InputNormal',
    })

    const attrs = useAttrs()
    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void
    }>()

    const onInput = (event: Event) => {
        const target = event.target as HTMLInputElement
        emit('update:modelValue', target.value)
    }

    const inputClasse = computed(() => [
        'p-2 bg-slate-600 text-white p-4 w-full rounded-md border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-700 focus:ring-violet-300 transition-colors',
        {
            'border-red-500': props.errors,
            'border-transparent': !props.errors,
        }
    ])
</script>

<template>
    <input
        v-bind="attrs"
        :value="props.modelValue"
        @input="onInput"

        :type="props.type"
        :id="props.id"
        :name="props.id"
        :class="inputClasse"
    />
</template>


