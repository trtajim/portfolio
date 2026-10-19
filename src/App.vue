<script setup lang="ts">
import { onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import SiteNavbar from '@/components/layout/SiteNavbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SessionSupabasePrompt from '@/components/layout/SessionSupabasePrompt.vue'

const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()

onMounted(async () => {
  await Promise.all([
    authStore.checkSession(),
    portfolioStore.fetchAll()
  ])
  portfolioStore.subscribeRealtime()
})
</script>

<template>
  <div class="app-layout">
    <SessionSupabasePrompt />
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
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: clip;
}
</style>
