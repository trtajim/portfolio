<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ShortCard from '@/components/motion/ShortCard.vue'
import ShortPlayerModal from '@/components/motion/ShortPlayerModal.vue'
import type { Short } from '@/types'

const portfolioStore = usePortfolioStore()
const activeFilter = ref('All')

const categories = computed(() => {
  const set = new Set<string>()
  portfolioStore.projects.forEach((p) => {
    if (p.pill) set.add(p.pill)
  })
  const projectCats = Array.from(set)
  if (portfolioStore.shorts.some((s) => s.is_published)) {
    projectCats.push('Video')
  }
  return ['All', ...projectCats]
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Video') return []
  return portfolioStore.projects.filter((p) => {
    if (!p.is_published) return false
    if (activeFilter.value === 'All') return true
    return p.pill.toLowerCase() === activeFilter.value.toLowerCase()
  })
})

const filteredShorts = computed(() => {
  if (activeFilter.value !== 'All' && activeFilter.value !== 'Video') return []
  return portfolioStore.shorts.filter((s) => s.is_published)
})

const selectedShort = ref<Short | null>(null)

function playShort(short: Short) {
  selectedShort.value = short
}

const cardColors: ('mint' | 'orange' | 'pink' | 'blue')[] = ['mint', 'orange', 'pink', 'blue']
</script>

<template>
  <div class="c">
    <div class="header-section">
      <span class="h">PROJECTS</span>
      <p class="sub">
        Production applications, community platforms, open-source libraries, IoT firmware, and motion reels.
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

    <!-- LOADING STATE -->
    <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="empty-state card box">
      <span class="loading-tag">Loading projects...</span>
    </div>

    <!-- VIDEO SHORTS SECTION (WHEN "ALL" OR "VIDEO" IS ACTIVE) -->
    <div v-else-if="filteredShorts.length > 0 && activeFilter === 'Video'" class="video-grid">
      <ShortCard
        v-for="(short, idx) in filteredShorts"
        :key="short.id || short.title"
        :short="short"
        :index="idx"
        @play="playShort"
      />
    </div>

    <div v-else-if="filteredProjects.length === 0 && filteredShorts.length === 0" class="empty-state card box">
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

    <!-- NATIVE VIDEO PLAYER MODAL -->
    <ShortPlayerModal
      :short="selectedShort"
      @close="selectedShort = null"
    />
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

.video-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
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

@media (max-width: 600px) {
  .video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .video-grid :deep(.short-card) {
    width: 100% !important;
    flex: 1 1 100% !important;
  }
}
</style>
