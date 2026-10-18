<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from '@/components/projects/ProjectCard.vue'

const portfolioStore = usePortfolioStore()
const activeFilter = ref('All')

const categories = computed(() => {
  const set = new Set<string>()
  portfolioStore.projects.forEach((p) => {
    if (p.pill) set.add(p.pill)
  })
  return ['All', ...Array.from(set)]
})

const filteredProjects = computed(() => {
  return portfolioStore.projects.filter((p) => {
    if (!p.is_published) return false
    if (activeFilter.value === 'All') return true
    return p.pill.toLowerCase() === activeFilter.value.toLowerCase()
  })
})

const cardColors: ('mint' | 'orange' | 'pink' | 'blue')[] = ['mint', 'orange', 'pink', 'blue']
</script>

<template>
  <div class="c">
    <div class="header-section">
      <span class="h">PROJECTS</span>
      <p class="sub">
        Production applications, community platforms, open-source libraries, and IoT firmware.
      </p>

      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['filter-btn', { active: activeFilter === cat }]"
          @click="activeFilter = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="empty-state card box">
      No projects found under this category.
    </div>

    <div v-else class="proj-grid">
      <ProjectCard
        v-for="(proj, idx) in filteredProjects"
        :key="proj.slug"
        :project="proj"
        :color="cardColors[idx % cardColors.length]"
      />
    </div>
  </div>
</template>

<style scoped>
.header-section {
  padding: 40px 0 24px;
}

.sub {
  font-size: 1.1rem;
  max-width: 60ch;
  margin: 0 0 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.filter-btn {
  font-family: var(--mono);
  font-size: 0.85rem;
  font-weight: 700;
  border: 3px solid var(--bd);
  background: var(--paper);
  color: var(--ink);
  padding: 6px 14px;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--sh);
  transition: transform 0.1s, box-shadow 0.1s;
}

.filter-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--sh);
}

.filter-btn.active {
  background: var(--yellow);
  color: #111;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--sh);
}

.proj-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
  padding-bottom: 40px;
}

.empty-state {
  margin: 20px 0;
  font-family: var(--mono);
}

@media (max-width: 760px) {
  .proj-grid {
    grid-template-columns: 1fr;
  }
}
</style>
