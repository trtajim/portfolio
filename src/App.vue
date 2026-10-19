<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import SiteNavbar from '@/components/layout/SiteNavbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'

const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 0) {
        history.replaceState({ ...history.state, scrollY: window.scrollY }, '')
      }
    },
    { passive: true }
  )
}

onMounted(async () => {
  await Promise.all([
    authStore.checkSession(),
    portfolioStore.fetchAll()
  ])
  portfolioStore.subscribeRealtime()

  const savedY = history.state?.scrollY
  if (savedY) {
    await nextTick()
    requestAnimationFrame(() => {
      window.scrollTo(0, savedY)
    })
  }
})
</script>

<template>
  <div class="app-layout">
    <SiteNavbar />
    <main class="main-content">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
