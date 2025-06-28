import AuthView from '@/views/AuthView.vue'
import HomeView from '@/views/HomeView.vue'
import TicketDetailsView from '@/views/TicketViews/TicketDetailsView.vue'
import TicketListView from '@/views/TicketViews/TicketListView.vue'
import VerifyTokenView from '@/views/VerifyTokenView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/my-tickets',
      component: TicketListView,
    },
    {
      path: '/my-tickets/:id',
      component: TicketDetailsView,
    },
    {
      path: '/login',
      component: AuthView,
    },
    {
      path: '/signup',
      component: AuthView,
    },
    {
      path: '/verify',
      component: VerifyTokenView,
    },
  ],
})

export default router
