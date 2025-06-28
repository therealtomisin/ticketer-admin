<template>
  <div class="flex flex-wrap gap-4 items-end bg-white p-4 rounded-2xl shadow">
    <!-- Ticket Key Search -->
    <div class="flex flex-col">
      <label for="ticketKey" class="text-xs text-gray-500">Search Ticket Key</label>
      <input
        v-model="filters.ticketKey"
        type="text"
        id="ticketKey"
        placeholder="e.g. TCK-00123"
        class="px-3 py-2 border rounded-md text-sm w-48"
      />
    </div>

    <!-- Status Filter -->
    <div class="flex flex-col">
      <label for="status" class="text-xs text-gray-500">Status</label>
      <select v-model="filters.status" id="status" class="px-3 py-2 border rounded-md text-sm w-40">
        <option value="">All</option>
        <option value="UNASSIGNED">Unassigned</option>
        <option value="ACTIVE">Active</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>

    <!-- Date From -->
    <div class="flex flex-col">
      <label class="text-xs text-gray-500">Date From</label>
      <input
        v-model="filters.dateFrom"
        type="date"
        class="px-3 py-2 border rounded-md text-sm w-44"
      />
    </div>

    <!-- Date To -->
    <div class="flex flex-col">
      <label class="text-xs text-gray-500">Date To</label>
      <input
        v-model="filters.dateTo"
        type="date"
        class="px-3 py-2 border rounded-md text-sm w-44"
      />
    </div>

    <!-- Search Button -->
    <button
      @click="emitSearch"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
    >
      Search
    </button>

    <!-- Export Button -->
    <button
      @click="emitExport"
      class="bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-md shadow border"
    >
      Export CSV
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const filters = reactive({
  ticketKey: '',
  status: '',
  dateFrom: '',
  dateTo: '',
})

const emit = defineEmits(['search', 'export'])

const emitSearch = () => {
  emit('search', { ...filters })
}

const emitExport = () => {
  emit('export', { ...filters })
}
</script>
