<script lang="ts" setup>
import FormPage from '@/components/demo/DemoForm.vue';

definePageMeta({
    middleware: ['auth']
});
</script>

<template>
    <FormPage />
</template>

<style></style>
