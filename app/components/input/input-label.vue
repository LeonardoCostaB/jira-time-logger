<template>
    <label
        :for="id"
        class="block text-white mb-2"
    >
        <slot />
    </label>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'InputLabel',
        props: {
            id: {
                type: String,
                required: true,
                default: null,
            },
        },
        setup() {},
    })
</script>

