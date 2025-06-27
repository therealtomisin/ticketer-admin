<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-50">
    <div class="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
      <h1 class="text-2xl font-bold mb-2 text-center">
        {{ isLogin ? 'Login' : 'Sign Up' }}
      </h1>
      <component :is="isLogin ? LoginForm : Signupform" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import LoginForm from '@/components/forms/LoginForm.vue'
import Signupform from '@/components/forms/SignUpform.vue'

const route = useRoute()
// console.log('this is >> ')
const isLogin = route.path.includes('login')
</script>
