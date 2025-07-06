<!-- <script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ActionCable from 'actioncable'

// interface Comment {
//   id: number | string
//   content: string
//   createdByType: 'Agent' | 'User'
//   createdAt: string
//   status?: 'pending'
// }

const route = useRoute()
const ticketStore = useTicketsStore()
const ticketId = Number(route.params.id)
const newComment = ref('')
const editingStatus = ref(false)
const localStatus = ref<string>('') // For status editing
const cable = ref(null)
const chatSubscription = ref(null)
const connectionStatus = ref('Connecting...')

// Use computed property for reactive ticket data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ticket = computed<any | null>(() => ticketStore.ticket)

const connectToActionCable = () => {
  // Replace with your Rails Action Cable WebSocket URL
  // Ensure this matches the host and port where your Rails server is running.
  // For development, it's typically ws://localhost:3000/cable
  cable.value = ActionCable.createConsumer('ws://localhost:3000/cable')

  // Subscribe to the ChatChannel
  chatSubscription.value = cable.value.subscriptions.create(
    { channel: 'ChatChannel' },
    {
      async connected() {
        console.log('Action Cable connected!')
        connectionStatus.value = 'Connected'
        // Fetch initial messages when connected
        // fetchInitialMessages();
        await ticketStore.fetchTicket(ticketId)
      },
      disconnected() {
        console.log('Action Cable disconnected!')
        connectionStatus.value = 'Disconnected. Reconnecting in 5s...'
        // Attempt to reconnect after a delay
        setTimeout(connectToActionCable, 5000)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      received(data: any) {
        console.log('Received data:', data)
        // Add the new message to the messages array
        if (data.message) {
          ticket.value.comments.push(data.message)
          // Scroll to the bottom of the chat
        }
      },
      rejected() {
        console.error('Action Cable connection rejected!')
        connectionStatus.value = 'Connection Rejected'
      },
    },
  )
}

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
    connectToActionCable()
  } catch (error) {
    console.error('Failed to fetch ticket:', error)
    // Handle error (redirect, show message, etc.)
  }
})
</script> -->

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

      <div v-if="ticket?.attachments?.length" class="space-y-2 pt-4">
        <h3 class="font-semibold text-sm text-gray-600">Attachments</h3>
        <ul class="list-disc ml-6 text-blue-600">
          <li v-for="(file, index) in ticket.attachments" :key="index">
            <a :href="file" target="_blank" class="underline">{{ file }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Comments Chat Section -->
    <div
      id="chat-comments-container"
      class="bg-white p-4 rounded-2xl shadow space-y-4 max-h-[400px] overflow-y-auto"
    >
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
import { computed, onMounted, ref, watch, nextTick } from 'vue' // Import nextTick
import { useRoute } from 'vue-router'
import ActionCable from 'actioncable'

// Define a basic interface for comments to improve type safety
interface Comment {
  id: number | string
  content: string
  createdByType: 'Agent' | 'User' // Assuming these are the possible types
  createdAt: string
  status?: 'pending' | 'sent' // Add 'sent' status for clarity
}

const route = useRoute()
const ticketStore = useTicketsStore()
const ticketId = Number(route.params.id)
const newComment = ref('')
const editingStatus = ref(false)
const localStatus = ref<string>('') // For status editing

// Fix: Explicitly type cable and chatSubscription to allow ActionCable objects or null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cable = ref(null) as any | null // This will hold the ActionCable consumer instance

const chatSubscription = ref(null) // This will hold the ActionCable subscription instance

const connectionStatus = ref('Connecting...')

// Use computed property for reactive ticket data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ticket = computed<any | null>(() => ticketStore.ticket)

const connectToActionCable = () => {
  // Replace with your Rails Action Cable WebSocket URL
  // Ensure this matches the host and port where your Rails server is running.
  // For development, it's typically ws://localhost:3000/cable
  cable.value = ActionCable.createConsumer('ws://localhost:4003/cable')

  // Subscribe to the ChatChannel
  chatSubscription.value = cable.value.subscriptions.create(
    { channel: 'ChatChannel' },
    {
      async connected() {
        console.log('Action Cable connected!')
        connectionStatus.value = 'Connected'
        // Fetch initial messages when connected
        await ticketStore.fetchTicket(ticketId) // Ensure ticket data is loaded
        scrollToBottom() // Scroll to bottom after initial load
      },
      disconnected() {
        console.log('Action Cable disconnected!')
        connectionStatus.value = 'Disconnected. Reconnecting in 5s...'
        // Attempt to reconnect after a delay
        setTimeout(connectToActionCable, 5000)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      received(data: any) {
        console.log('Received data:', data)
        // Add the new message to the messages array
        if (data.message && ticket.value) {
          // Map the incoming message from Rails to the expected comment structure
          const newComment: Comment = {
            id: data.message.id,
            content: data.message.content,
            // Assuming data.message.user can be mapped to 'Agent' or 'User'
            // You might need more sophisticated logic here if 'user' is an ID
            createdByType: data.message.user === 'Agent' ? 'Agent' : 'User',
            createdAt: data.message.created_at, // Rails typically sends created_at
            status: 'sent', // Mark as sent after receiving from broadcast
          }
          ticket.value.comments.push(newComment)
          // Scroll to the bottom of the chat after the DOM updates
          nextTick(() => {
            scrollToBottom()
          })
        }
      },
      rejected() {
        console.error('Action Cable connection rejected!')
        connectionStatus.value = 'Connection Rejected'
      },
    },
  )
}

// Initialize local status when ticket loads
watch(
  ticket,
  (newTicket) => {
    if (newTicket) {
      localStatus.value = newTicket.status
      // Scroll to bottom when ticket data (and thus comments) are loaded
      nextTick(() => {
        scrollToBottom()
      })
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
  const tempId = Date.now().toString() // Temporary ID

  try {
    if (!ticket.value) throw new Error('No ticket loaded')

    // Optimistically add a pending comment to the UI
    const newTempComment: Comment = {
      id: tempId,
      content: newComment.value,
      createdByType: 'Agent', // Or dynamically determine current user type
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    ticket.value.comments.push(newTempComment)
    newComment.value = '' // Clear input immediately
    nextTick(() => {
      scrollToBottom()
    })

    // Send the comment to the backend
    await ticketStore.createComment(
      ticket.value.id,
      newTempComment.content,
      newTempComment.createdByType,
    )

    // The actual comment (with real ID and timestamp) will arrive via Action Cable broadcast
    // and replace/update this pending one or simply add a new one.
    // For now, we'll let the Action Cable 'received' handle the final addition/update.
    // If you want to remove the pending status, you'd need to match by content/user.
    // For simplicity, we're relying on the broadcast to add the definitive comment.
  } catch (error) {
    console.error('Failed to post comment:', error)
    // If sending fails, remove the pending comment or show an error
    alert('Failed to upload')
    // if (ticket.value) {
    //   ticket.value.comments = ticket.value.comments.filter((c: Comment) => c.id !== tempId)
    // }
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

const scrollToBottom = () => {
  const chatContainer = document.getElementById('chat-comments-container')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

onMounted(async () => {
  try {
    await ticketStore.fetchTicket(ticketId)
    connectToActionCable()
  } catch (error) {
    console.error('Failed to fetch ticket:', error)
    // Handle error (redirect, show message, etc.)
  }
})
</script>

<style>
/* Add Inter font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
</style>
