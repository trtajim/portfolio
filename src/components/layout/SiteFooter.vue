<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const portfolioStore = usePortfolioStore()
const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer>
    <div class="c">
      <span>© {{ year }} {{ portfolioStore.profile.name }}</span>
      <div class="foot-links">
        <a
          v-for="link in portfolioStore.profile.social_links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  border-top: 3px solid var(--bd);
  margin-top: 40px;
  padding: 24px 0 34px;
  font: 400 0.85rem var(--mono);
}
footer .c {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.foot-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.foot-links a {
  text-decoration: underline;
  font-weight: 700;
}
</style>
