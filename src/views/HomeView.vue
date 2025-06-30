<template>
  <div class="p-2 lg:p-6 w-full max-w-7xl mx-auto">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Total Tickets</h2>
        <p class="text-2xl font-semibold">{{ totalTickets }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Active Tickets</h2>
        <p class="text-2xl font-semibold">{{ activeTickets }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow">
        <h2 class="text-gray-600 text-sm font-medium">Closed Tickets</h2>
        <p class="text-2xl font-semibold">{{ closedTickets }}</p>
      </div>
    </div>

    <!-- My Tickets Button -->
    <div class="flex justify-end mt-4">
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl shadow"
        @click="goToMyTickets"
      >
        View My Tickets
      </button>
    </div>

    <!-- Recent Tickets Table -->
    <div class="bg-white rounded-2xl p-4 shadow overflow-x-auto">
      <h2 class="text-lg font-semibold mb-4">Recent Tickets</h2>
      <table class="min-w-full text-sm">
        <thead class="text-left bg-gray-50">
          <tr>
            <th class="px-4 py-2">Title</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="border-t">
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
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <button
        class="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        :disabled="page === 1"
        @click="prevPage"
      >
        Previous
      </button>

      <span class="text-sm text-gray-700"> Page {{ page }} of {{ totalPages }} </span>

      <button
        class="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        :disabled="page === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const totalTickets = ref(0)
const activeTickets = ref(0)
const closedTickets = ref(0)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recentTickets = ref<any[]>([])

const page = ref(1)
const pageSize = 10

const ticketStore = useTicketsStore()
// const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatDate = (dateStr: string) => {
  console.log('formatDate called with:', dateStr)
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const goToMyTickets = () => {
  router.push('/my-tickets')
}

// Paginate recentTickets
const paginatedTickets = computed(() => {
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  return recentTickets.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(recentTickets.value.length / pageSize)
})

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

// Fetch tickets
;(async () => {
  await ticketStore.fetchTickets()
  const tickets = ticketStore.tickets

  totalTickets.value = tickets.length
  activeTickets.value = tickets.filter((t) => t.status === 'ACTIVE').length
  closedTickets.value = tickets.filter((t) => t.status === 'CLOSED').length
  recentTickets.value = tickets
})()
</script>
