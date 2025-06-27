<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="w-full p-2 border rounded"
    />
    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  const $toast = useToast()
  try {
    const login = await auth.login(email.value, password.value)
    const instance = $toast.success('Login Succesfully!')
    instance.dismiss()
    if (login.success) {
      router.push('/')
    } else {
      $toast.error('Login failed!')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    $toast.error('Login failed!')
  }
}
</script>
