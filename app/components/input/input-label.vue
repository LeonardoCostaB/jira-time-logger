<template>
    <label :for="id" class="mb-2 block text-white">
        <slot />
    </label>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'InputLabel',
        props: {
            id: {
                type: String,
                default: null,
            },
        },
        setup() {},
    });
</script>
