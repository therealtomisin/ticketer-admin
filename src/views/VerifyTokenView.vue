<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-semibold mb-4">Enter Verification Code</h2>
    <form @submit.prevent="submitCode" class="space-y-4">
      <input
        v-model="code"
        type="text"
        placeholder="Enter 5-digit code"
        class="w-full p-3 border rounded focus:outline-none focus:ring focus:border-indigo-500"
      />
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Verify
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const code = ref('')
const router = useRouter()
const $toast = useToast()
const authStore = useAuthStore()

const submitCode = async () => {
  const token = localStorage.getItem('code')

  if (!token) {
    $toast.error('No signup token found. Please sign up again.')
    return
  }

  try {
    console.log({ code: code.value, token })
    const result = await authStore.verifyToken({ code: code.value, token })

    console.log('hwats ging n')

    if (result?.success) {
      $toast.success('Verification successful!')
      router.push('/login')
    } else {
      $toast.error(result?.message || 'Verification failed')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('thisis where is is happening')
    console.log(error.message)
    $toast.error(error?.message || 'Something went wrong')
  }
}
</script>
