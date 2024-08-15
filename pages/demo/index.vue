<script lang="ts" setup>
import ListPage from '@/components/demo/DemoList.vue';

definePageMeta({
    middleware: ['auth']
});
</script>

<template>
    <ListPage></ListPage>
</template>

<style></style>
