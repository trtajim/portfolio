import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue')
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue')
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/WritingView.vue')
    },
    {
      path: '/writing/:slug',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue')
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.checkSession()
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: 'admin-login', query: { redirect: to.fullPath } })
  } else if (to.name === 'admin-login' && authStore.user) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
