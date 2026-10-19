<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const portfolioStore = usePortfolioStore()
const year = computed(() => new Date().getFullYear())

const githubLink = computed(() => {
  const link = portfolioStore.profile.social_links?.find(
    (l) => l.label.toLowerCase() === 'github' || l.url.includes('github.com')
  )
  if (!link) return { url: 'https://github.com/trtajim', handle: '@trtajim' }

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
  <footer class="mt-[72px] max-sm:mt-[44px] border-t-[3px] border-[var(--bd)] overflow-hidden">
    <div
      class="text-center font-extrabold tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:3px_var(--ink)] max-sm:[-webkit-text-stroke-width:2px] select-none text-[clamp(4rem,19vw,14rem)] leading-[0.85] mt-[22px]"
      aria-hidden="true"
    >
      TAJIM
    </div>

    <div class="c">
      <div class="grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-1 max-sm:text-center items-center gap-3 py-3.5 pb-6 font-bold text-[0.85rem] font-mono">
        <span class="text-left max-sm:text-center">© {{ year }} {{ portfolioStore.profile.name || 'TR Tajim' }}</span>

        <router-link
          to="/admin"
          class="text-center no-underline opacity-65 hover:opacity-100 hover:underline transition-opacity"
        >
          Admin
        </router-link>

        <a
          :href="githubLink.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-right max-sm:text-center underline hover:opacity-80"
        >
          {{ githubLink.handle }}
        </a>
      </div>
    </div>
  </footer>
</template>
