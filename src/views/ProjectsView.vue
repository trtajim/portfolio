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
  <div class="c min-h-[calc(100vh-280px)] flex flex-col">
    <div class="pt-10 max-sm:pt-6 pb-6">
      <div class="sh">
        <h2>Projects</h2>
      </div>
      <p class="-mt-3 mb-6 text-[1.1rem] max-w-[65ch] opacity-85">
        From scalable web apps and embedded firmware to open tooling and motion.
      </p>

      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'font-mono font-bold text-[0.85rem] px-3.5 py-1.5 border-[3px] border-[var(--bd)] rounded-[var(--r)] cursor-pointer transition-transform shadow-[3px_3px_0_var(--sh)]',
            activeFilter === cat
              ? 'bg-[var(--yellow)] text-[#0b0b0f] -translate-x-0.5 -translate-y-0.5 shadow-[5px_5px_0_var(--sh)]'
              : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--pink)] hover:text-[#0b0b0f]'
          ]"
          @click="activeFilter = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="grid grid-cols-2 max-md:grid-cols-1 gap-7 pb-12">
      <div v-for="n in 6" :key="n" class="box p-6 space-y-3">
        <div class="skeleton-pill w-20 mb-4"></div>
        <div class="skeleton-line w-[70%] h-6"></div>
        <div class="skeleton-line w-[90%]"></div>
      </div>
    </div>

    <!-- VIDEO SHORTS SECTION (WHEN "ALL" OR "VIDEO" IS ACTIVE): 2 PER ROW ON MOBILE -->
    <div
      v-else-if="filteredShorts.length > 0 && activeFilter === 'Video'"
      class="grid grid-cols-3 max-md:grid-cols-2 grid-cols-2 gap-4 sm:gap-6 pb-12"
    >
      <ShortCard
        v-for="(short, idx) in filteredShorts"
        :key="short.id || short.title"
        :short="short"
        :index="idx"
        @play="playShort"
      />
    </div>

    <div v-else-if="filteredProjects.length === 0 && filteredShorts.length === 0" class="box p-8 text-center font-mono font-bold mb-12">
      No projects found under this category.
    </div>

    <div v-else class="grid grid-cols-2 max-md:grid-cols-1 gap-7 max-sm:gap-5.5 pb-12">
      <ProjectCard
        v-for="(proj, idx) in filteredProjects"
        :key="proj.slug"
        :project="proj"
        :color="cardColors[idx % cardColors.length]"
      />
    </div>

    <ShortPlayerModal
      :short="selectedShort"
      @close="selectedShort = null"
    />
  </div>
</template>
