<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function applyTheme(dark: boolean) {
  isDark.value = dark
  const theme = dark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    applyTheme(saved === 'dark')
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }
})

function toggleTheme() {
  applyTheme(!isDark.value)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b-[3px] border-[var(--bd)] bg-[var(--bg)] pt-[env(safe-area-inset-top,0px)]">
    <div class="c flex items-center justify-between gap-2.5 py-2.5">
      <router-link
        to="/"
        class="inline-flex items-center text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#0b0b0f] no-underline bg-[var(--yellow)] border-[3px] border-[var(--bd)] rounded-[var(--r)] px-3.5 py-1 shadow-[3px_3px_0_var(--sh)]"
      >
        Tajim
      </router-link>

      <nav class="flex items-center gap-2">
        <router-link
          to="/projects"
          class="inline-flex items-center min-h-[40px] px-3.5 py-1 text-[0.9rem] font-bold text-[var(--ink)] no-underline rounded-[var(--r)] border-[3px] border-transparent transition-all hover:border-[var(--bd)] hover:bg-[var(--pink)] hover:text-[#0b0b0f] hover:shadow-[3px_3px_0_var(--sh)]"
        >
          Projects
        </router-link>

        <router-link
          to="/writing"
          class="inline-flex items-center min-h-[40px] px-3.5 py-1 text-[0.9rem] font-bold text-[var(--ink)] no-underline rounded-[var(--r)] border-[3px] border-transparent transition-all hover:border-[var(--bd)] hover:bg-[var(--pink)] hover:text-[#0b0b0f] hover:shadow-[3px_3px_0_var(--sh)]"
        >
          Writing
        </router-link>

        <button
          id="theme"
          type="button"
          @click="toggleTheme"
          aria-label="Switch colour theme"
          class="inline-flex items-center justify-center min-h-[40px] px-3 py-1 text-[1.1rem] text-white bg-[var(--blue)] border-[3px] border-[var(--bd)] rounded-[var(--r)] shadow-[3px_3px_0_var(--sh)] cursor-pointer transition-colors hover:bg-[var(--yellow)] hover:text-[#0b0b0f]"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </nav>
    </div>
  </header>
</template>
