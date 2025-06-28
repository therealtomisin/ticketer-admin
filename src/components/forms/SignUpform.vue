<template>
  <form @submit.prevent="handleSignup" class="space-y-4">
    <input v-model="firstName" placeholder="First Name" class="w-full p-2 border rounded" />
    <input v-model="lastName" placeholder="Last Name" class="w-full p-2 border rounded" />
    <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="w-full p-2 border rounded"
    />
    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      class="w-full p-2 border rounded"
    />
    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Sign Up</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  try {
    const signup = await auth.signup(firstName.value, lastName.value, email.value, password.value)
    if (signup.success) {
      router.push('/verify')
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      alert('Signup failed: ' + e.message)
    } else {
      alert('Signup failed: Unknown error')
    }
  }
}
</script>
