<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const portfolioStore = usePortfolioStore()
const year = computed(() => new Date().getFullYear())

const githubLink = computed(() => {
  const link = portfolioStore.profile.social_links?.find(
    (l) => l.label.toLowerCase() === 'github' || l.url.includes('github.com')
  )
  if (!link) return null

  // Extract username from URL if possible (e.g. https://github.com/trtajim -> @trtajim)
  const cleanUrl = link.url.replace(/\/+$/, '')
  const parts = cleanUrl.split('/')
  const username = parts[parts.length - 1]
  const handle = username ? `@${username.replace(/^@/, '')}` : link.label

  return {
    url: link.url,
    handle
  }
})
</script>

<template>
  <footer>
    <div class="c">
      <div class="foot-left">
        <span>© {{ year }} {{ portfolioStore.profile.name }}</span>
      </div>

      <div class="foot-center">
        <router-link to="/admin" class="admin-link">
          Admin
        </router-link>
      </div>

      <div class="foot-right">
        <a
          v-if="githubLink"
          :href="githubLink.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ githubLink.handle }}
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.foot-left {
  text-align: left;
}

.foot-center {
  text-align: center;
}

.foot-right {
  text-align: right;
}

.foot-right a {
  text-decoration: underline;
  font-weight: 700;
}

.admin-link {
  color: var(--ink);
  opacity: 0.65;
  text-decoration: none !important;
  font-weight: 600;
  padding: 3px 10px;
  border: 1px dashed transparent;
  transition: opacity 0.15s, border-color 0.15s;
}

.admin-link:hover {
  opacity: 1;
  text-decoration: underline !important;
}

@media (max-width: 600px) {
  footer .c {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 12px;
  }
  .foot-left, .foot-center, .foot-right {
    text-align: center;
  }
}
</style>
