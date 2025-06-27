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

    <!-- Tickets Table -->
    <div class="bg-white rounded-2xl p-4 shadow overflow-x-auto">
      <h2 class="text-lg font-semibold mb-4">Tickets Assigned to You</h2>
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
            class="border-t"
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
            <td class="px-4 py-2">{{ formatDate(ticket.created_at) }}</td>
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
  createdt: Date
}

const ticketStore = useTicketsStore()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assignedTickets = ref<any[]>([])
const totalAssigned = ref(0)
const activeAssigned = ref(0)
const closedAssigned = ref(0)
const currentPage = ref(1)
const perPage = 5
const router = useRouter()

const formatDate = (date: string) => new Date(date).toLocaleDateString()

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

onMounted(async () => {
  await ticketStore.fetchTicketsByAgent()

  assignedTickets.value = ticketStore.tickets || []

  totalAssigned.value = assignedTickets.value.length
  activeAssigned.value = assignedTickets.value.filter((t) => t.status === 'ACTIVE').length
  closedAssigned.value = assignedTickets.value.filter((t) => t.status === 'CLOSED').length
})
</script>

<style scoped></style>
