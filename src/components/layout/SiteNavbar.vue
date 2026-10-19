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
  <header class="top">
    <div class="c">
      <router-link to="/" class="logo">
        Tajim
      </router-link>

      <nav aria-label="Sections">
        <router-link to="/projects">
          Projects
        </router-link>

        <router-link to="/writing">
          Writing
        </router-link>

        <button
          id="theme"
          type="button"
          @click="toggleTheme"
          aria-label="Switch colour theme"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: var(--w) solid var(--bd);
  padding-top: env(safe-area-inset-top, 0px);
}

.top .c {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.logo {
  display: inline-flex;
  align-items: center;
  font: 800 1.25rem var(--sans);
  letter-spacing: -0.02em;
  text-decoration: none;
  background: var(--yellow);
  color: #0b0b0f;
  border: var(--w) solid var(--bd);
  border-radius: var(--r);
  padding: 3px 14px;
  box-shadow: 3px 3px 0 var(--sh);
}

.top nav {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
}

.top nav a,
#theme {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 4px 14px;
  font: 700 0.9rem var(--sans);
  text-decoration: none;
  border: var(--w) solid transparent;
  border-radius: var(--r);
  cursor: pointer;
  background: none;
  color: var(--ink);
  transition: transform 0.12s, box-shadow 0.12s, background-color 0.12s, border-color 0.12s;
}

.top nav a:hover {
  border-color: var(--bd);
  background: var(--pink);
  color: #0b0b0f;
  box-shadow: 3px 3px 0 var(--sh);
}

#theme {
  border-color: var(--bd);
  font-size: 1.1rem;
  padding: 4px 12px;
  background: var(--blue);
  color: #fff;
  box-shadow: 3px 3px 0 var(--sh);
}

#theme:hover {
  background: var(--yellow);
  color: #0b0b0f;
}

@media (max-width: 600px) {
  .top .c {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .logo {
    font-size: 1.1rem;
    padding: 2px 10px;
  }
  .top nav {
    gap: 6px;
  }
  .top nav a,
  #theme {
    padding: 4px 10px;
    font-size: 0.85rem;
    min-height: 36px;
  }
}
</style>
