<script lang="ts" setup>
import { computed, ref } from 'vue';
import FormPage from '@/components/demo/DemoForm.vue';

const route = useRouter().currentRoute.value;

const id = route.params.id;

definePageMeta({
    middleware: ['auth']
});

const create = ref(false);

computed(() => {
    if (!id) {
        create.value = true;
    } else {
        create.value = false;
    }
});

</script>

<template>
    <FormPage :id="id" :create="create"/>
</template>

<style></style>
