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
      <span>© {{ year }} {{ portfolioStore.profile.name }}</span>
      <div v-if="githubLink" class="foot-links">
        <a
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
