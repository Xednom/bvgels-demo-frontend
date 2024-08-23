<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted, ref, toRaw, nextTick, onBeforeUnmount, computed, watch } from 'vue';
import { useApiCrud } from '../../vue-bvgels/composables/useApiCrud';
import { useRestStore } from '../../vue-bvgels/stores/restModule';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { useListPage } from '../../../vue-bvgels/composables/useListPage';

import BInputText from '@/vue-bvgels/components/uikit/fields/BInputText.vue';
import BTextArea from '@/vue-bvgels/components/uikit/fields/BTextArea.vue';
import VCalendar from '@/vue-bvgels/components/uikit/fields/VCalendar.vue';
import BDateTime from '@/vue-bvgels/components/uikit/fields/BDateTime.vue';
import BBoolean from '@/vue-bvgels/components/uikit/fields/BBoolean.vue';
import BSelect from '@/vue-bvgels/components/uikit/fields/BSelect.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import moment from 'moment';

const toast = useToast();
const store = useRestStore();
const { items, optionSampleLoading, count } = useListPage('sample-foreign-key');

const { save, serverError } = useApiCrud('demo', store);
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    create: {
        type: Boolean,
        default: true
    }
});

const model = defineModel();
const item = ref({ data: {} });
const loading = ref(false);
const responseError = ref<object>({});
const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
};
const formatDateTime = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm');
};
const optionSampleItems = ref([{ results: [] }]);

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
    store.setModelName('demo');
    optionSampleItems.value = items.value;

    if (!props.create) {
        nextTick(async () => {
            store.loading = false;
            const response = await store.fetchItem(props.id);
            item.value = toRaw(response.data.value);
            loading.value = store.loading;
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
                <template #content v-if="loading">
                    <div class="spinner-container">
                        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                    </div>
                </template>
                <template #content v-else>
                    <div class="col-12">
                        <div class="card">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.char_field" type="text" :model-value="item.char_field" :server-error="responseError" label="Char Field" field="char_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BBoolean v-model="item.boolean_field" :server-error="responseError" label="Boolean Field" field="boolean_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.email_field" type="text" :model-value="item.email_field" :server-error="responseError" label="Email Field" field="email_field" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.integer_field" type="text" :model-value="item.integer_field" :server-error="responseError" label="Integer Field" field="integer_field" />
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <BInputText v-model="item.decimal_field" type="text" :model-value="item.decimal_field" :server-error="responseError" label="Decimal Field" field="decimal_field" />
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
                                            :options="optionSampleItems.value"
                                            optionLabel="name"
                                            :server-error="responseError"
                                            label="Foreign Key Field"
                                            field="foreign_key_field"
                                            :filter="true"
                                        >
                                        </BSelect>
                                    </div>
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12">
                                    <BTextArea v-model="item.text_field" :model-value="item.text_field" :server-error="responseError" label="Text Field" field="text_field" />
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
