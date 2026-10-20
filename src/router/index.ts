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
      meta: {
        title: 'TR Tajim | Full-Stack Developer & Software Engineer',
        description: 'Portfolio of TR Tajim: Full-stack developer and software engineer building lean web products, Android apps, and open-source tools with Laravel and Vue.'
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: {
        title: 'Projects | TR Tajim',
        description: 'Explore web applications, Android apps, and IoT hardware projects designed and shipped by TR Tajim.'
      }
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      meta: {
        title: 'Project Details | TR Tajim',
        description: 'Deep dive into architecture, tech stacks, and metrics of projects built by TR Tajim.'
      }
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/WritingView.vue'),
      meta: {
        title: 'Writing & Technical Notes | TR Tajim',
        description: 'Articles, architectural write-ups, and engineering notes on web development, open source, and software craft.'
      }
    },
    {
      path: '/writing/:slug',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue'),
      meta: {
        title: 'Article | TR Tajim',
        description: 'Read technical insights and lessons learned by TR Tajim.'
      }
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
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '404 - Page Not Found | TR Tajim',
        description: 'The requested page could not be found on TR Tajim portfolio.'
      }
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

  if (to.meta.description && typeof document !== 'undefined') {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', to.meta.description as string)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
      ogDesc.setAttribute('content', to.meta.description as string)
    }

    let twDesc = document.querySelector('meta[property="twitter:description"]')
    if (twDesc) {
      twDesc.setAttribute('content', to.meta.description as string)
    }

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && to.meta.title) {
      ogTitle.setAttribute('content', to.meta.title as string)
    }
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
