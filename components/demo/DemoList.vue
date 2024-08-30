<script lang="ts" setup>
import { ref, Ref, onMounted, reactive, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import { usePaginatedFetch } from '../../../vue-bvgels/composables/usePaginatedFetch';
import { usePaginatedFetch } from '@/vue-bvgels/composables/usePaginatedFetch';

import { useToast } from 'primevue/usetoast';
// const transformedData = ref([{ results: [] }]);
const dt = ref();
const filters = ref({
    char_field: { value: '', matchMode: FilterMatchMode.CONTAINS },
    date_field: { value: '', matchMode: FilterMatchMode.DATE_IS },
    datetime_field: { value: '', matchMode: FilterMatchMode.DATE_IS },
    status__name: { value: '', matchMode: FilterMatchMode.CONTAINS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const { transformedData, first, rows, totalRecords, fetchItems, onPageChange } = usePaginatedFetch('demo', filters);
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
// Handle filter event
const onFilter = () => {
    fetchItems(first.value / rows.value + 1, rows.value, filters.value);
};

const multiSortMeta = ref([]);

const onSort = (event: any) => {
    multiSortMeta.value = event.multiSortMeta;

    // Call fetchItems with the sortQuery
    fetchItems(first.value / rows.value + 1, rows.value, filters.value, multiSortMeta.value);
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
                        :rows="rows"
                        v-model:filters="filters"
                        ref="dt"
                        dataKey="id"
                        :totalRecords="totalRecords"
                        filterDisplay="row"
                        :globalFilterFields="['char_field', 'date_field', 'datetime_field']"
                        @filter="onFilter"
                        @sort="onSort"
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
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" dateFormat="mm/dd/yy" />
                            </template>
                        </Column>
                        <Column field="datetime_field" header="Date Time Field" filterMatchMode="contains" sortable>
                            <template #filter="{ filterModel, filterCallback }">
                                <Calendar v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" showIcon iconDisplay="input" showTime hourFormat="24" />
                            </template>
                        </Column>
                        <Column field="boolean_field" header="Status Field" filterMatchMode="contains" sortable>
                            <template #body="{ data }">
                                <Tag v-if="data.boolean_field" severity="success">Active </Tag>
                                <Tag v-else="data.boolean_field" severity="warning">Inactive</Tag>
                            </template>
                        </Column>
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
