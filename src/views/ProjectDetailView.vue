<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { usePortfolioStore } from '@/stores/portfolio'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()

const isImageLoaded = ref(false)

const project = computed(() => {
  return portfolioStore.projects.find((p) => p.slug === route.params.slug)
})

const renderedContent = computed(() => {
  if (!project.value?.content) return ''
  const cleaned = project.value.content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      return line.startsWith('    ') || line.startsWith('\t') ? line.trimStart() : line
    })
    .join('\n')

  return marked.parse(cleaned)
})

const colorOrder: ('yellow' | 'pink' | 'blue' | 'mint' | 'orange')[] = [
  'yellow',
  'pink',
  'blue',
  'mint',
  'orange'
]
function getActionVariant(idx: number) {
  return colorOrder[idx % colorOrder.length]
}
</script>

<template>
  <div class="c pt-8 max-sm:pt-4 pb-14">
    <div class="mb-6">
      <BrutalButton as="button" variant="white" @click="router.back()">
        ← Back
      </BrutalButton>
    </div>

    <div v-if="!project" class="box p-8 text-center font-mono font-bold">
      <h2 class="text-2xl mb-2">Project Not Found</h2>
      <p class="opacity-80">The requested project does not exist or may have been unpublished.</p>
    </div>

    <article v-else class="flex flex-col gap-5">
      <!-- MAIN BANNER CARD: Uses theme paper background in both modes -->
      <div class="box p-8 max-sm:p-5 relative flex flex-col gap-4 overflow-hidden">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <span class="font-mono font-bold text-[0.8rem] bg-[#0b0b0f] text-white rounded-[6px] px-2.5 py-1 self-start">
            {{ project.pill }}
          </span>
          <span v-if="project.top_metric" class="font-mono font-bold text-[0.82rem] bg-white text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] px-2.5 py-1">
            {{ project.top_metric }}
          </span>
        </div>

        <h1 class="m-0 text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.05] tracking-[-0.03em] font-extrabold text-[var(--ink)]">
          {{ project.title }}
        </h1>
        <p class="text-[1.15rem] m-0 max-w-[65ch] leading-[1.5] opacity-90">
          {{ project.summary }}
        </p>

        <div v-if="project.tags && project.tags.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="chip"
          >
            {{ tag }}
          </span>
        </div>

        <div v-if="project.actions && project.actions.length" class="flex flex-wrap gap-3 mt-2">
          <BrutalButton
            v-for="(action, idx) in project.actions"
            :key="action.label"
            as="a"
            :href="action.url"
            target="_blank"
            :variant="getActionVariant(idx)"
            class="max-sm:flex-1 max-sm:text-center"
          >
            {{ action.label }}
          </BrutalButton>
        </div>
      </div>

      <!-- FEATURED IMAGE WITH SHIMMER PLACEHOLDER -->
      <div v-if="project.image_url" class="box overflow-hidden max-h-[480px] bg-[#111] p-0 relative min-h-[260px] max-sm:min-h-[200px]">
        <!-- Shimmer Placeholder shown until image completes loading -->
        <div
          v-show="!isImageLoaded"
          class="skeleton-shimmer absolute inset-0 w-full h-full !rounded-none z-10"
        ></div>
        <img
          :src="project.image_url"
          :alt="project.title"
          class="w-full h-full object-cover block transition-opacity duration-300"
          :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
          @load="isImageLoaded = true"
        />
      </div>

      <div v-if="project.content" class="box p-8 max-sm:p-5 markdown-body" v-html="renderedContent"></div>
    </article>
  </div>
</template>
