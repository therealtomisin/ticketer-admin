<template>
  <div class="p-2 lg:p-6 space-y-6">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-2 lg:p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Total Assigned</h2>
        <p class="text-2xl font-semibold">{{ totalAssigned }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Active</h2>
        <p class="text-2xl font-semibold">{{ activeAssigned }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Closed</h2>
        <p class="text-2xl font-semibold">{{ closedAssigned }}</p>
      </div>
    </div>

    <!-- Export Button -->
    <div class="flex justify-end">
      <button
        @click="showExportModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Export as CSV</span>
      </button>
    </div>

    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Export Tickets</h3>
          <button @click="showExportModal = false" class="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="exportFilters.status"
              class="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="UNASSIGNED">Unassigned</option>
            </select>
          </div>

          <!-- Date Range Picker -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs text-gray-500">From</label>
                <input
                  v-model="exportFilters.startDate"
                  type="date"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500">To</label>
                <input
                  v-model="exportFilters.endDate"
                  type="date"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="showExportModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="exportToCSV"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="bg-white rounded-2xl p-4 shadow overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Tickets Assigned to You</h2>
      </div>
      <table class="min-w-full text-sm">
        <thead class="text-left bg-gray-50">
          <tr>
            <th class="px-4 py-2">Title</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            @click="handleTicketClick(ticket)"
            class="border-t hover:bg-gray-50 cursor-pointer"
          >
            <td class="px-4 py-2">{{ ticket.title }}</td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'text-green-600': ticket.status === 'CLOSED',
                  'text-yellow-600': ticket.status === 'ACTIVE',
                  'text-gray-600': ticket.status === 'UNASSIGNED',
                }"
              >
                {{ ticket.status }}
              </span>
            </td>
            <td class="px-4 py-2">{{ formatDate(ticket.createdAt) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4 space-x-2">
        <button
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          :disabled="endIndex >= assignedTickets.length"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'

interface TicketType {
  id: string
  title: string
  content: string
  status: string
  createdAt: Date
}

interface ExportFilters {
  status: string
  startDate: string
  endDate: string
}

const ticketStore = useTicketsStore()
const assignedTickets = ref<TicketType[]>([])
const totalAssigned = ref(0)
const activeAssigned = ref(0)
const closedAssigned = ref(0)
const currentPage = ref(1)
const perPage = 5
const router = useRouter()
const showExportModal = ref(false)
const exportFilters = ref<ExportFilters>({
  status: 'ALL',
  startDate: '',
  endDate: '',
})

const formatDate = (date: Date) => new Date(date).toLocaleDateString()

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return assignedTickets.value.slice(start, end)
})

const endIndex = computed(() => currentPage.value * perPage)

const handleTicketClick = (ticket: TicketType) => {
  ticketStore.setTicket(ticket)
  router.push(`/my-tickets/${ticket.id}`)
}

const exportToCSV = () => {
  // Filter tickets based on selected filters
  let filteredTickets = [...assignedTickets.value]

  // Filter by status
  if (exportFilters.value.status !== 'ALL') {
    filteredTickets = filteredTickets.filter(
      (ticket) => ticket.status === exportFilters.value.status,
    )
  }

  // Filter by date range
  if (exportFilters.value.startDate) {
    const startDate = new Date(exportFilters.value.startDate)
    filteredTickets = filteredTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt)
      return ticketDate >= startDate
    })
  }

  if (exportFilters.value.endDate) {
    const endDate = new Date(exportFilters.value.endDate)
    filteredTickets = filteredTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt)
      return ticketDate <= endDate
    })
  }

  // Convert to CSV
  const headers = ['ID', 'Title', 'Status', 'Created At']
  const csvRows = [
    headers.join(','),
    ...filteredTickets.map((ticket) =>
      [
        ticket.id,
        `"${ticket.title.replace(/"/g, '""')}"`,
        ticket.status,
        formatDate(ticket.createdAt),
      ].join(','),
    ),
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showExportModal.value = false
}

onMounted(async () => {
  await ticketStore.fetchTicketsByAgent()

  assignedTickets.value = ticketStore.tickets || []

  totalAssigned.value = assignedTickets.value.length
  activeAssigned.value = assignedTickets.value.filter((t) => t.status === 'ACTIVE').length
  closedAssigned.value = assignedTickets.value.filter((t) => t.status === 'CLOSED').length

  // Set default date range to last 30 days
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  exportFilters.value.endDate = endDate.toISOString().split('T')[0]
  exportFilters.value.startDate = startDate.toISOString().split('T')[0]
})
</script>

<style scoped>
tr {
  transition: background-color 0.2s ease;
}
</style>
