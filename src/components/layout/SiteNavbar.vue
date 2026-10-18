<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const authStore = useAuthStore()

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
      <router-link to="/" class="logo">TR Tajim</router-link>
      <nav>
        <BrutalButton
          as="router-link"
          to="/"
          :variant="route.path === '/' ? 'pink' : 'yellow'"
        >
          Home
        </BrutalButton>
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
          as="router-link"
          to="/admin"
          :variant="route.path.startsWith('/admin') ? 'orange' : 'white'"
        >
          Admin
        </BrutalButton>
        <BrutalButton
          as="button"
          variant="blue"
          @click="toggleTheme"
          aria-label="Toggle theme"
          style="padding: 6px 12px;"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
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
}
.top nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
}
</style>
