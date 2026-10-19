<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Project } from '@/types'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const props = defineProps<{
  project: Project
  color?: 'mint' | 'orange' | 'pink' | 'blue'
}>()

const router = useRouter()

const colorOrder: ('yellow' | 'pink' | 'blue' | 'mint' | 'orange')[] = [
  'yellow',
  'pink',
  'blue',
  'mint',
  'orange'
]

function getButtonVariant(index: number) {
  return colorOrder[index % colorOrder.length]
}

function handleCardClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (target?.closest('a, button, .acts')) {
    return
  }
  router.push(`/projects/${props.project.slug}`)
}
</script>

<template>
  <div
    class="box p-0 flex flex-col overflow-hidden cursor-pointer transition-transform hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)]"
    @click="handleCardClick"
  >
    <!-- TOP BAR -->
    <div
      :class="[
        'flex items-center justify-between gap-2.5 p-[10px_16px] border-b-[3px] border-[var(--bd)] text-[#0b0b0f]',
        color === 'orange' ? 'bg-[var(--orange)]' : color === 'pink' ? 'bg-[var(--pink)]' : color === 'blue' ? 'bg-[var(--blue)] text-white' : 'bg-[var(--green)]'
      ]"
    >
      <span class="font-mono font-bold text-[0.75rem] bg-[#0b0b0f] text-white rounded-[6px] px-2.5 py-0.5">
        {{ project.pill }}
      </span>

      <span v-if="project.top_metric" class="font-mono font-bold text-[0.78rem] bg-white text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] px-2.5 py-0.5">
        {{ project.top_metric }}
      </span>
    </div>

    <!-- BODY -->
    <div class="p-[20px_20px_22px] max-sm:p-4 flex flex-col gap-3 flex-1">
      <h3 class="m-0 text-[clamp(1.7rem,3.4vw,2.3rem)] leading-none tracking-[-0.04em] font-extrabold">
        <router-link :to="`/projects/${project.slug}`" class="no-underline text-inherit hover:underline">
          {{ project.title }}
        </router-link>
      </h3>

      <p class="m-0 text-[0.95rem] leading-[1.5] max-w-[60ch] opacity-90">
        {{ project.summary }}
      </p>

      <ul v-if="project.tags && project.tags.length" class="flex flex-wrap gap-1.5 m-0 p-0 list-none">
        <li
          v-for="tag in project.tags"
          :key="tag"
          class="chip"
        >
          {{ tag }}
        </li>
      </ul>

      <div v-if="project.actions && project.actions.length" class="acts flex gap-2.5 flex-wrap mt-auto pt-1.5 w-full min-w-0">
        <BrutalButton
          v-for="(action, index) in project.actions.slice(0, 3)"
          :key="action.label"
          as="a"
          :href="action.url"
          target="_blank"
          :variant="getButtonVariant(index)"
        >
          {{ action.label }}
        </BrutalButton>
      </div>
    </div>
  </div>
</template>
