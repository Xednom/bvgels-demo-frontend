<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Dropdown from 'primevue/dropdown';
import { useApiCrud } from '../../../composables/useApiCrud';
import { CustomerService } from '@/service/CustomerService';
import { useListPage } from '../../../vue-bvgels/composables/useListPage';

const { items, loading, count } = useListPage('demo');
// const { items, error, loading, totalCount, getItems } = useApiCrud('reservation');
const transformedData = ref([{ results: [] }]);
const dt = ref();
// const loading = ref(false);
const totalRecords = ref(0);
const customers = ref();
const selectedDemo = ref();
const selectAll = ref(false);
const first = ref(0);
const filters = ref({
    char_field: { value: '', matchMode: 'contains' },
    boolean_field: { value: '', matchMode: 'contains' },
    room_type__name: { value: '', matchMode: 'contains' },
    date_field: { value: '', matchMode: 'contains' },
    datetime_field: { value: '', matchMode: 'contains' },
    status__name: { value: '', matchMode: 'contains' }
});
const lazyParams = ref({});
const columns = ref([
    { field: 'char_field', header: 'Char Field' },
    { field: 'boolean_field', header: 'Boolean Field' },
    { field: 'text_field', header: 'Text Field' },
    { field: 'date_field', header: 'Date Field' },
    { field: 'datetime_field', header: 'Date Time Field' },
    { field: 'email_field', header: 'Email Field' }
]);

const onRowSelect = () => {
    selectAll.value = selectedDemo.value.length === totalRecords.value;
};
const onRowUnselect = () => {
    selectAll.value = false;
};

const rowsPerPageItems = [5, 10, 50, 100];

const exportCSV = () => {
    dt.value.exportCSV();
};

onMounted(async () => {
    totalRecords.value = count.value;
    transformedData.value = items.value;
});
</script>

<template>
    <div className="grid">
        <div className="col-12">
            <div className="card">
                <h3>Manage Demo</h3>
                <div class="card">
                    <Toolbar class="mb-4">
                        <template #start>
                            <NuxtLink to="/demo/create">
                                <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" />
                            </NuxtLink>
                        </template>

                        <template #end>
                            <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>
                    <DataTable
                        :value="transformedData.value"
                        lazy
                        paginator
                        :first="first"
                        :rows="10"
                        :rowsPerPageOptions="rowsPerPageItems"
                        v-model:filters="filters"
                        ref="dt"
                        dataKey="id"
                        :totalRecords="totalRecords.value"
                        filterDisplay="row"
                        :globalFilterFields="['guest', 'room_type', 'date_field', 'datetime_field']"
                        v-model:selection="selectedDemo"
                        tableStyle="min-width: 75rem"
                        sortMode="multiple"
                    >
                        <!-- <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field"></Column> -->
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="char_field" header="First name" filterMatchMode="startsWith" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search" />
                            </template>
                            <template #body="{ data }">
                                <NuxtLink :to="`/demo/${data.id}`">{{ data.char_field }}</NuxtLink>
                            </template>
                        </Column>
                        <Column field="date_field" header="Date Field" filterMatchMode="contains" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <!-- <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search" /> -->
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" />
                            </template>
                        </Column>
                        <Column field="datetime_field" header="Date Time Field" filterMatchMode="contains" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <!-- <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search" /> -->
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" />
                            </template>
                        </Column>
                        <Column field="boolean_field" header="Status" filterMatchMode="contains" sortable>
                            <template #body="{ data }">
                                <Tag v-if="data.boolean_field" severity="success">Active </Tag>
                                <Tag v-else="data.boolean_field" severity="warning">Inactive</Tag>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
