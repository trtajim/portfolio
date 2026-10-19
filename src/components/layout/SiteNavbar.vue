<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    isDark.value = false
    document.documentElement.setAttribute('data-theme', 'light')
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
        Tajim
      </router-link>
      <nav>
        <BrutalButton
          as="router-link"
          to="/projects"
          variant="pink"
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

@media (max-width: 600px) {
  .top .c {
    padding: 6px 12px;
    gap: 6px;
  }
  .logo {
    font-size: 1.05rem;
    padding: 2px 8px;
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
