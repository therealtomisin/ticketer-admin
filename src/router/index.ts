import { useAuthStore } from '@/stores/auth'
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
      meta: { requiresAuth: true },
    },
    {
      path: '/my-tickets',
      component: TicketListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-tickets/:id',
      component: TicketDetailsView,
      meta: { requiresAuth: true },
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

router.beforeEach((to, _, next) => {
  if (to.path !== '/login' && to.path !== '/signup') {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.token) {
      next('/login')
    } else {
      next()
    }
  } else next()
})

export default router
