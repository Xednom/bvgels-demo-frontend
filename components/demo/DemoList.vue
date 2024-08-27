<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import { usePaginatedFetch } from '../../../vue-bvgels/composables/usePaginatedFetch';
import { usePaginatedFetch } from '@/vue-bvgels/composables/usePaginatedFetch';

import { useToast } from 'primevue/usetoast';
const { transformedData, first, rows, totalRecords, fetchItems, onPageChange } = usePaginatedFetch('demo');
// const transformedData = ref([{ results: [] }]);
const dt = ref();
const filters = ref({
    char_field: { value: '', matchMode: 'contains' },
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

const rowsPerPageItems = [5, 10, 50, 100];

const exportCSV = () => {
    dt.value.exportCSV();
};
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
                        :value="transformedData"
                        lazy
                        :first="first"
                        :rows="10"
                        :rowsPerPageOptions="rowsPerPageItems"
                        v-model:filters="filters"
                        ref="dt"
                        dataKey="id"
                        :totalRecords="totalRecords.value"
                        filterDisplay="row"
                        :globalFilterFields="['char_field', 'date_field', 'date_time_field', 'boolean_field']"
                        tableStyle="min-width: 75rem"
                        sortMode="multiple"
                    >
                        <Column headerStyle="width: 3rem"></Column>
                        <Column field="char_field" header="Text Field" filterMatchMode="startsWith" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search" />
                            </template>
                            <template #body="{ data }">
                                <NuxtLink :to="`/demo/${data.id}`">{{ data.char_field }}</NuxtLink>
                            </template>
                        </Column>
                        <Column field="date_field" header="Date Field" filterMatchMode="contains" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" />
                            </template>
                        </Column>
                        <Column field="datetime_field" header="Date Time Field" filterMatchMode="contains" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" />
                            </template>
                        </Column>
                        <Column field="boolean_field" header="Status Field" filterMatchMode="contains" sortable>
                            <template #body="{ data }">
                                <Tag v-if="data.boolean_field" severity="success">Active </Tag>
                                <Tag v-else="data.boolean_field" severity="warning">Inactive</Tag>
                            </template>
                        </Column>
                        <!-- <Column v-for="(col, index) in columns" :key="index" :field="col.field" :header="col.header" :sortable="col.sortable || false"> </Column> -->
                    </DataTable>
                    <Paginator
                        v-model:first="first"
                        :rows="rows"
                        :totalRecords="totalRecords"
                        :rowsPerPageOptions="rowsPerPageItems"
                        :currentPageReportTemplate="`Showing ${first + 1} to ${Math.min(first + rows, totalRecords)} of ${totalRecords} entries`"
                        @page="onPageChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
