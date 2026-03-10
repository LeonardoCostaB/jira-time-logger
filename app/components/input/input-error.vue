<template>
    <span class="block pt-2 text-xs text-red-500">
        <slot />
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'InputError',
        setup() {},
    });
</script>
