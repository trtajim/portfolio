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
    <div class="c flex flex-col items-center">
      <div
        class="w-full text-center font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent [-webkit-text-stroke:3px_var(--ink)] max-sm:[-webkit-text-stroke:2px_var(--ink)] select-none text-[clamp(2.8rem,13vw,11rem)] leading-[0.9] mt-[20px] max-sm:mt-[14px]"
        aria-hidden="true"
      >
        TR TAJIM
      </div>

      <div class="w-full grid grid-cols-[1fr_auto_1fr] max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-2 items-center gap-3 py-4 pb-7 font-bold text-[0.82rem] font-mono text-[var(--ink)] opacity-85">
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
