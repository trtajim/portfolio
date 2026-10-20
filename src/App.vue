<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import SiteNavbar from '@/components/layout/SiteNavbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SessionSupabasePrompt from '@/components/layout/SessionSupabasePrompt.vue'

const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()

const showBackToTop = ref(false)

function checkScroll() {
  showBackToTop.value = window.scrollY > 600
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  window.addEventListener('scroll', checkScroll, { passive: true })
  checkScroll()
  await Promise.all([
    authStore.checkSession(),
    portfolioStore.fetchAll()
  ])
  portfolioStore.subscribeRealtime()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <div class="app-layout" id="top">
    <SessionSupabasePrompt />
    <SiteNavbar />
    <main class="main-content">
      <router-view />
    </main>
    <SiteFooter />

    <!-- Yellow Back to Top button -->
    <button
      type="button"
      :class="['up', { show: showBackToTop }]"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      &uarr;
    </button>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
