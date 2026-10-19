import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'TR Tajim | Full-Stack Developer, Competitive Programmer & IoT Enthusiast' }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: { title: 'Projects | TR Tajim' }
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      meta: { title: 'Project Details | TR Tajim' }
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/WritingView.vue'),
      meta: { title: 'Writing & Technical Notes | TR Tajim' }
    },
    {
      path: '/writing/:slug',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue'),
      meta: { title: 'Article | TR Tajim' }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { title: 'Admin Login | TR Tajim' }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, title: 'Admin Studio | TR Tajim' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, left: 0 }
  }
})

router.beforeEach(async (to, _from) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.checkSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  } else if (to.name === 'admin-login' && authStore.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
})

export default router
