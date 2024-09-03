<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted, ref, toRaw, nextTick, onBeforeUnmount, computed, watch } from 'vue';
import { useApiCrud } from '../../vue-bvgels/composables/useApiCrud';
import { useRestStore } from '../../vue-bvgels/stores/restModule';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import Skeleton from 'primevue/skeleton';

import { useListPage } from '@/vue-bvgels/composables/useListPage';
import { useOptionItems } from '@/vue-bvgels/composables/useOptionItems';

import BInputText from '@/vue-bvgels/components/uikit/fields/BInputText.vue';
import BTextArea from '@/vue-bvgels/components/uikit/fields/BTextArea.vue';
import VCalendar from '@/vue-bvgels/components/uikit/fields/VCalendar.vue';
import BDateTime from '@/vue-bvgels/components/uikit/fields/BDateTime.vue';
import BBoolean from '@/vue-bvgels/components/uikit/fields/BBoolean.vue';
import BSelect from '@/vue-bvgels/components/uikit/fields/BSelect.vue';
import EditableDataTable from '@/vue-bvgels/components/uikit/table/EditableDataTable.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import moment from 'moment';

const toast = useToast();
const store = useRestStore();
const { optionSampleForeignKeyItems } = await useOptionItems(['sample-foreign-key']);
const { save, fetchItem, item, loading, serverError } = useApiCrud('demo');
const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    },
    create: {
        type: Boolean,
        default: true
    }
});

const model = defineModel();
const responseError = ref<object>({});
const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
};
const formatDateTime = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm');
};

const fields = ref([
    { id: 0, name: 'name', type: 'text', placeholder: 'Name' },
    { id: 0, name: 'description', type: 'text', placeholder: 'Description' }
]);

watch(
    () => item.value.date_field,
    (newVal) => {
        item.value.date_field = formatDate(newVal);
    },
    { immediate: true }
);

watch(
    () => item.value.datetime_field,
    (newVal) => {
        item.value.datetime_field = formatDateTime(newVal);
    },
    { immediate: true }
);

watch(
    serverError,
    (newVal) => {
        responseError.value = newVal;
    },
    { immediate: true }
);

onMounted(() => {
    if (!props.create) {
        nextTick(async () => {
            store.loading = false;
            fetchItem(props.id);
        });
    }
});

onBeforeUnmount(() => {
    serverError.data = {};
    serverError.data = null;
});

onUnmounted(() => {
    serverError.data = null;
    serverError.data = {};
});

const mode = computed(() => {
    return item.value.id ? 'Edit' : 'Create';
});
</script>

<template>
    <div class="grid">
        <div className="col-12">
            <Card>
                <template #title>{{ mode }} demo</template>
                <template #content>
                    <div class="col-12">
                        <div class="card">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.char_field" type="text" :model-value="item.char_field" :server-error="responseError" :loading="loading" label="Text Field" field="char_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BBoolean v-model="item.boolean_field" :server-error="responseError" label="Status Field" field="boolean_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.email_field" type="text" :model-value="item.email_field" :server-error="responseError" :loading="loading" label="Email Field" field="email_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.integer_field" type="text" :model-value="item.integer_field" :server-error="responseError" :loading="loading" label="Number Field" field="integer_field" />
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.decimal_field" type="text" :model-value="item.decimal_field" :server-error="responseError" :loading="loading" label="Decimal Field" field="decimal_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BDateTime v-model="item.date_field" :server-error="responseError" label="Date Field" field="date_field"> </BDateTime>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <div>
                                        <BDateTime v-model="item.datetime_field" :server-error="responseError" label="Date Time Field" field="date_time_field" showTime> </BDateTime>
                                    </div>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <div>
                                        <BSelect
                                            v-model="item.foreign_key_field"
                                            :model-value="item.foreign_key_field"
                                            :options="optionSampleForeignKeyItems"
                                            optionLabel="name"
                                            :server-error="responseError"
                                            label="Select Field"
                                            field="foreign_key_field"
                                            :filter="true"
                                        >
                                        </BSelect>
                                    </div>
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12">
                                    <BTextArea v-model="item.text_field" :model-value="item.text_field" :server-error="responseError" :loading="loading" label="Big Text Field" field="text_field" />
                                </div>
                            </div>

                            <div class="p-fluid formgrid grid">
                                <div class="field col-12">
                                    <EditableDataTable v-model:items="item.many_to_many_field" :fields="fields" :server-error="responseError.many_to_many_field" field="many_to_many_field" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- </div> -->
                    <Toolbar>
                        <template v-slot:start>
                            <Toast />
                            <Button label="Save" icon="pi pi-check" class="p-button-success mr-2" @click="save(item)" />
                            <NuxtLink :to="`/demo/`">
                                <Button label="Close" icon="pi pi-times" class="p-button-danger" />
                            </NuxtLink>
                        </template>
                    </Toolbar>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
