<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'

const props = defineProps<{
  post: Post
}>()

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
</script>

<template>
  <router-link
    :to="`/writing/${post.slug}`"
    class="box p-[16px_18px] max-sm:p-3.5 grid grid-cols-[104px_1fr_44px] max-sm:grid-cols-[1fr_40px] gap-4 max-sm:gap-[6px_12px] items-center no-underline text-inherit transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)] hover:bg-[var(--yellow)] hover:text-[#0b0b0f] group"
  >
    <time
      :datetime="post.published_date"
      class="justify-self-start font-mono font-bold text-[0.78rem] bg-[var(--blue)] text-white border-2 border-[#0b0b0f] rounded-[6px] px-2 py-0.5 max-sm:col-span-full"
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
      class="grid place-items-center w-10 h-10 max-sm:w-9 max-sm:h-9 border-[3px] border-[#0b0b0f] rounded-full bg-white text-[#0b0b0f] font-extrabold text-[1.1rem] transition-transform group-hover:translate-x-1 group-hover:bg-[#0b0b0f] group-hover:text-white"
    >
      →
    </span>
  </router-link>
</template>
