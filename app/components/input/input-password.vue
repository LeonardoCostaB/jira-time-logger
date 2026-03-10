<script setup lang="ts">
    import { ref, computed, useAttrs } from 'vue'
    import { PhEye, PhEyeClosed } from '@phosphor-icons/vue'

    const { errors } = defineProps({
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

    const shouldShowPassword = ref(false)
    const inputType = computed(() => shouldShowPassword.value ? 'text' : 'password')

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
            'border-red-500': errors,
            'border-transparent': !errors,
        }
    ])
</script>

<template>
    <div class="relative">
        <input
            v-bind="attrs"
            :value="modelValue"
            @input="onInput"

            :type="inputType"
            :id="id"
            :name="id"
            :class="inputClasse"
        />

        <button
            type="button"
            class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            @click="shouldShowPassword = !shouldShowPassword"
        >
            <PhEye v-if="!shouldShowPassword" />
            <PhEyeClosed v-else />
        </button>
    </div>
</template>
