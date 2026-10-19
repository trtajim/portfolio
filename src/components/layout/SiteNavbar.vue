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
        <router-link to="/projects" class="nav-projects">
          Projects
        </router-link>

        <router-link to="/writing" class="nav-writing">
          Writing
        </router-link>

        <button
          id="theme"
          type="button"
          @click="toggleTheme"
          aria-label="Switch colour theme"
        >
          <!-- Sun Icon (shown in dark mode to switch to light) -->
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[18px] h-[18px] text-yellow-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.2" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <!-- Moon Icon (shown in light mode to switch to dark) -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[18px] h-[18px] text-[var(--ink)]"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fill-opacity="0.15" />
          </svg>
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
  width: 36px;
  height: 36px;
  min-height: 36px;
  padding: 0;
  border-radius: var(--r);
  background: var(--paper);
  color: var(--ink);
  box-shadow: 3px 3px 0 var(--sh);
}

#theme:hover {
  background: var(--pink);
  color: #0b0b0f;
}

#theme:hover svg {
  color: #0b0b0f;
}

@media (max-width: 600px) {
  .top .c {
    padding-top: 6px;
    padding-bottom: 6px;
    gap: 8px;
  }
  .logo {
    font-size: 1rem;
    padding: 2px 9px;
  }
  .top nav {
    gap: 5px;
    flex-shrink: 0;
  }
  .top nav a {
    padding: 3px 8px;
    font-size: 0.8rem;
    min-height: 32px;
  }
  #theme {
    width: 32px;
    height: 32px;
    min-height: 32px;
    box-shadow: 2px 2px 0 var(--sh);
  }

  /* Distinct visible backgrounds on phone where hover is not available */
  .top nav a.nav-projects {
    background: var(--pink);
    color: #0b0b0f;
    border-color: #0b0b0f;
    box-shadow: 2px 2px 0 var(--sh);
  }

  .top nav a.nav-writing {
    background: var(--green);
    color: #0b0b0f;
    border-color: #0b0b0f;
    box-shadow: 2px 2px 0 var(--sh);
  }

  #theme {
    box-shadow: 2px 2px 0 var(--sh);
  }
}
</style>
