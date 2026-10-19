<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'

const props = withDefaults(
  defineProps<{
    post: Post
    color?: 'blue' | 'pink' | 'green' | 'orange' | 'yellow'
  }>(),
  {
    color: 'blue'
  }
)

const formattedDate = computed(() => {
  if (!props.post.published_date) return ''
  try {
    const parts = props.post.published_date.split('-')
    if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
    }
    const d = new Date(props.post.published_date)
    return isNaN(d.getTime())
      ? props.post.published_date
      : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
  } catch {
    return props.post.published_date
  }
})

const badgeColorClass = computed(() => {
  switch (props.color) {
    case 'yellow':
      return 'bg-[var(--yellow)] text-[#0b0b0f]'
    case 'pink':
      return 'bg-[var(--pink)] text-[#0b0b0f]'
    case 'green':
      return 'bg-[var(--green)] text-[#0b0b0f]'
    case 'orange':
      return 'bg-[var(--orange)] text-[#0b0b0f]'
    case 'blue':
    default:
      return 'bg-[var(--blue)] text-white'
  }
})
</script>

<template>
  <router-link
    :to="`/writing/${post.slug}`"
    class="box p-[16px_18px] max-sm:p-3.5 grid grid-cols-[104px_1fr_44px] max-sm:grid-cols-[1fr_40px] gap-4 max-sm:gap-[6px_12px] items-center no-underline text-inherit transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)] hover:bg-[var(--yellow)] hover:text-[#0b0b0f] active:-translate-x-[3px] active:-translate-y-[3px] active:shadow-[9px_9px_0_var(--sh)] active:bg-[var(--yellow)] active:text-[#0b0b0f] group"
  >
    <time
      :datetime="post.published_date"
      :class="[
        'justify-self-start font-mono font-bold text-[0.78rem] border-2 border-[#0b0b0f] rounded-[6px] px-2 py-0.5 max-sm:col-span-full',
        badgeColorClass
      ]"
    >
      {{ formattedDate }}
    </time>

    <div class="min-w-0">
      <h3 class="m-0 text-[1.25rem] max-sm:text-[1.08rem] leading-[1.2] tracking-[-0.02em] font-extrabold">
        {{ post.title }}
      </h3>
      <p v-if="post.subtitle" class="mt-[3px] mb-0 text-[0.92rem] font-medium opacity-75">
        {{ post.subtitle }}
      </p>
    </div>

    <span
      class="flex items-center justify-center w-10 h-10 max-sm:w-9 max-sm:h-9 border-[3px] border-[var(--bd)] rounded-full bg-[var(--paper)] text-[var(--ink)] font-sans font-extrabold text-[1.2rem] leading-none transition-all group-hover:translate-x-1 group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] select-none shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </span>
  </router-link>
</template>
