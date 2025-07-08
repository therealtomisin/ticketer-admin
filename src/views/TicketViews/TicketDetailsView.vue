<template>
  <div v-if="ticket" class="max-w-4xl mx-auto p-2 lg:p-6 space-y-6">
    <!-- Ticket Info -->
    <div class="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 class="text-2xl font-bold">{{ ticket.title }}</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ ticket.content }}</p>

      <div class="text-sm text-gray-500">Ticket Key: {{ ticket?.ticketKey ?? '' }}</div>

      <div class="flex items-center space-x-2 text-sm">
        <span>Status:</span>
        <div v-if="!editingStatus" class="cursor-pointer" @click="editingStatus = true">
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="statusColor(ticket.status)"
          >
            {{ ticket.status }}
          </span>
        </div>
        <select
          v-else
          v-model="localStatus"
          @blur="updateTicketStatus"
          @change="updateTicketStatus"
          class="text-sm border rounded px-2 py-1 focus:outline-none"
        >
          <option value="UNASSIGNED">UNASSIGNED</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>
      <div class="text-sm text-gray-500">Deadline: {{ formatDate(ticket.deadline) }}</div>

      <div v-if="ticket?.media?.length" class="space-y-2 pt-4">
        <h3 class="font-semibold text-sm text-gray-600">Attachments</h3>
        <ul class="list-disc ml-6 text-blue-600">
          <li v-for="(file, index) in ticket.attachments" :key="index">
            <a :href="file" target="_blank" class="underline">{{ file }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Comments Chat Section -->
    <div class="bg-white p-4 rounded-2xl shadow space-y-4 max-h-[400px] overflow-y-auto">
      <h3 class="text-lg font-semibold">Conversation</h3>
      <div v-for="comment in ticket.comments" :key="comment.id" class="flex mb-3">
        <div
          :class="[
            'p-3 rounded-lg text-sm max-w-[80%] relative',
            comment.createdByType === 'Agent'
              ? 'ml-auto bg-blue-100 text-blue-800'
              : 'mr-auto bg-gray-100 text-gray-700',
            { 'opacity-80': comment.status === 'pending' },
          ]"
        >
          {{ comment.content }}
          <div class="text-xs text-gray-400 mt-1 text-right flex items-center justify-end gap-1">
            <!-- Clock icon for pending status -->
            <svg
              v-if="comment.status === 'pending'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ formatDate(comment.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add Comment Section -->
    <form
      @submit.prevent="addComment"
      class="flex flex-col space-y-3 bg-white p-4 rounded-2xl shadow"
    >
      <textarea
        v-model="newComment"
        placeholder="Type your message..."
        class="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      ></textarea>
      <button
        type="submit"
        class="self-end bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticketStore = useTicketsStore()
const ticketId = Number(route.params.id)
const newComment = ref('')
const editingStatus = ref(false)
const localStatus = ref<string>('') // For status editing

// Use computed property for reactive ticket data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ticket = computed<any | null>(() => ticketStore.ticket)

// Initialize local status when ticket loads
watch(
  ticket,
  (newTicket) => {
    if (newTicket) {
      localStatus.value = newTicket.status
    }
  },
  { immediate: true },
)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}

const statusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-yellow-100 text-yellow-800'
    case 'CLOSED':
      return 'bg-green-100 text-green-800'
    case 'UNASSIGNED':
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    if (!ticket.value) throw new Error('No ticket loaded')
    await ticketStore.createComment(ticket.value.id, newComment.value, 'Agent')
    newComment.value = ''
  } catch (error) {
    console.error('Failed to post comment:', error)
    // Consider adding user-facing error feedback here
  }
}

const updateTicketStatus = async () => {
  if (!ticket.value) return

  try {
    await ticketStore.updateTicket(ticket.value.id, { status: localStatus.value })
    editingStatus.value = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to update ticket status:', error)
    // Revert to original status if update fails
    if (ticket.value) {
      localStatus.value = ticket.value.status
    }
  }
}

onMounted(async () => {
  try {
    await ticketStore.fetchTicket(ticketId)
  } catch (error) {
    console.error('Failed to fetch ticket:', error)
    // Handle error (redirect, show message, etc.)
  }
})
</script>
