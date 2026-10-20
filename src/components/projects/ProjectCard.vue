<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/types'
import { splitSummary } from '@/lib/text'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const props = defineProps<{
  project: Project
  color?: 'mint' | 'orange' | 'pink' | 'blue'
}>()

const router = useRouter()

const summaryText = computed(() => {
  return splitSummary(props.project.summary).main
})

const metricParsed = computed(() => {
  if (!props.project.top_metric) return null
  const trimmed = props.project.top_metric.trim()
  const parts = trimmed.split(/\s+/)
  const first = parts[0] || ''
  if (parts.length === 1) {
    return { value: first, label: '' }
  }
  return {
    value: first,
    label: parts.slice(1).join(' ')
  }
})

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
    class="card-project box relative p-0 flex flex-col cursor-pointer transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)] active:-translate-x-[3px] active:-translate-y-[3px] active:shadow-[9px_9px_0_var(--sh)] group"
    @click="handleCardClick"
  >
    <!-- HIGHLIGHT METRIC STAMP -->
    <div
      v-if="metricParsed"
      class="stamp"
      :aria-label="project.top_metric || undefined"
    >
      <b class="text-[1.3rem] font-sans font-extrabold tracking-[-0.03em] leading-none">{{ metricParsed.value }}</b>
      <small v-if="metricParsed.label" class="font-mono font-bold text-[0.58rem] mt-[3px] max-w-[68px] leading-tight uppercase">{{ metricParsed.label }}</small>
    </div>

    <!-- TOP BAR (SHADY CROSS HATCH) -->
    <div
      :class="[
        'bar flex items-center justify-between gap-2.5 p-[12px_16px] border-b-[3px] border-[var(--bd)] text-[#0b0b0f] min-h-[52px]',
        color === 'orange' ? 'bar-orange' : color === 'pink' ? 'bar-pink' : color === 'blue' ? 'bar-blue' : 'bar-green'
      ]"
    >
      <span class="st font-mono font-bold text-[0.75rem] bg-[#0b0b0f] text-white rounded-[6px] px-2.5 py-0.5">
        {{ project.pill }}
      </span>
    </div>

    <!-- BODY -->
    <div class="p-[20px_22px_22px] max-sm:p-4 flex flex-col gap-3 flex-1">
      <h3 class="m-0 text-[clamp(1.7rem,3.4vw,2.3rem)] leading-none tracking-[-0.04em] font-extrabold">
        <router-link :to="`/projects/${project.slug}`" class="no-underline text-inherit hover:underline">
          {{ project.title }}
        </router-link>
      </h3>

      <p class="m-0 text-[0.95rem] leading-[1.5] max-w-[60ch] opacity-90">
        {{ summaryText }}
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

<style scoped>
.bar {
  border-radius: 7px 7px 0 0;
  background-image: repeating-linear-gradient(135deg, rgba(11, 11, 15, 0.12) 0 8px, transparent 8px 16px);
}
.bar-green {
  background-color: var(--green);
}
.bar-orange {
  background-color: var(--orange);
}
.bar-pink {
  background-color: var(--pink);
}
.bar-blue {
  background-color: var(--blue);
  color: #fff;
}

.stamp {
  position: absolute;
  top: -24px;
  right: 16px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #ffffff;
  color: #0b0b0f;
  border: var(--w) solid #0b0b0f;
  box-shadow: 3px 3px 0 var(--sh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: rotate(8deg);
  line-height: 1;
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.2, 1);
  z-index: 10;
}

.card-project:hover .stamp {
  transform: rotate(-6deg) scale(1.06);
}
</style>
