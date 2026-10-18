<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>

<template>
  <header class="top">
    <div class="c">
      <router-link to="/" class="logo">
        <span class="logo-desktop">TR<span class="logo-full"> Tajim</span></span>
        <span class="logo-mobile">Tajim</span>
      </router-link>
      <nav>
        <BrutalButton
          as="router-link"
          to="/projects"
          :variant="route.path.startsWith('/projects') ? 'mint' : 'yellow'"
        >
          Projects
        </BrutalButton>
        <BrutalButton
          as="router-link"
          to="/writing"
          :variant="route.path.startsWith('/writing') ? 'blue' : 'yellow'"
        >
          Writing
        </BrutalButton>
        <BrutalButton
          as="button"
          variant="blue"
          @click="toggleTheme"
          aria-label="Toggle theme"
          class="theme-btn"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </BrutalButton>
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
  border-bottom: 3px solid var(--bd);
}

.top .c {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.logo {
  font: 700 1.3rem var(--sans);
  text-decoration: none;
  background: var(--yellow);
  color: #111;
  border: 3px solid var(--bd);
  padding: 2px 10px;
  box-shadow: 3px 3px 0 var(--sh);
  white-space: nowrap;
}

.top nav {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

.theme-btn {
  padding: 4px 10px;
  min-width: 42px;
  font-size: 1rem;
}

.logo-mobile {
  display: none;
}

@media (max-width: 600px) {
  .top .c {
    padding: 6px 12px;
    gap: 6px;
  }
  .logo {
    font-size: 1.05rem;
    padding: 2px 8px;
  }
  .logo-desktop {
    display: none;
  }
  .logo-mobile {
    display: inline-block;
  }
  .top nav {
    gap: 4px;
    flex-wrap: nowrap;
  }
  .top nav :deep(.btn) {
    padding: 4px 7px;
    font-size: 0.8rem;
    box-shadow: 2px 2px 0 var(--sh);
  }
  .theme-btn {
    padding: 4px 6px;
    min-width: 32px;
  }
}
</style>
