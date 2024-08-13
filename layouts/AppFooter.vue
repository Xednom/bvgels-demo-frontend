<script setup>
import { useLayout } from './composables/layout';
import { computed } from 'vue';
const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    return `/layout/images/bvgels.png`;
});
</script>

<template>
    <div class="layout-footer">
        <span class="font-medium ml-2">1.0.0</span>
    </div>
</template>
<style lang="scss" scoped></style>
