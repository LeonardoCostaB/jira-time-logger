<template>
    <span class="text-red-500 text-xs block pt-2">
        <slot />
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'InputError',
        setup() {

        },
    })
</script>
