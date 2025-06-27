<template>
  <div class="min-h-screen text-gray-800 min-w-full p-2 lg:p-6 w-full max-w-7xl mx-auto">
    <TopBar v-if="!isAuthPage" />
    <!-- <div class="p-6 w-full max-w-7xl mx-auto"></div> -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TopBar from '@/components/TopBar.vue'

const route = useRoute()
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/signup'] // Add more as needed
  return authRoutes.includes(route.path)
})
</script>
