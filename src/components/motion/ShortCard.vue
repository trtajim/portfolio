<script setup lang="ts">
import { computed } from 'vue'
import type { Short } from '@/types'

const props = defineProps<{
  short: Short
  index?: number
}>()

const emit = defineEmits<{
  (e: 'play', short: Short): void
}>()

const fallbackThumbnail = computed(() => {
  if (props.short.platform === 'youtube' && props.short.video_url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/)([^#&?]*).*/
    const match = props.short.video_url.match(regExp)
    if (match && match[2] && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    }
  }
  return null
})
</script>

<template>
  <div
    class="box p-0 flex-[0_0_250px] max-sm:flex-[0_0_220px] max-xs:flex-[0_0_200px] w-[250px] max-sm:w-[220px] max-xs:w-[200px] flex flex-col overflow-hidden cursor-pointer select-none transition-transform hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)] group"
    @click="emit('play', short)"
  >
    <div class="w-full aspect-[9/16] relative bg-[#111] overflow-hidden border-b-[3px] border-[var(--bd)]">
      <span
        v-if="index !== undefined"
        class="absolute top-2.5 left-2.5 bg-[var(--pink)] text-[#0b0b0f] font-mono font-bold text-[0.75rem] border-2 border-[#0b0b0f] rounded-[6px] shadow-[2px_2px_0_#0b0b0f] px-2 py-0.5 z-10"
      >
        #{{ index + 1 }}
      </span>

      <img
        v-if="short.thumbnail_url || fallbackThumbnail"
        :src="short.thumbnail_url || fallbackThumbnail!"
        :alt="short.title"
        class="w-full h-full object-cover block"
        loading="lazy"
      />
      <div v-else class="w-full h-full grid place-items-center bg-[var(--yellow)] text-[#0b0b0f]">
        <span class="font-mono font-bold text-[0.9rem] bg-[#0b0b0f] text-white rounded-[6px] px-2.5 py-[3px]">
          MOTION
        </span>
      </div>

      <div class="absolute inset-0 bg-[#0b0b0f]/35 grid place-items-center transition-colors group-hover:bg-[#0b0b0f]/20">
        <span class="w-[46px] h-[46px] rounded-full bg-[var(--yellow)] text-[#0b0b0f] border-2 border-[#0b0b0f] shadow-[3px_3px_0_#0b0b0f] grid place-items-center text-[1.1rem] pl-1 transition-transform group-hover:scale-110">
          ▶
        </span>
      </div>
    </div>

    <div class="p-[14px_16px]">
      <h4 class="m-0 text-[1.05rem] font-bold tracking-[-0.01em] line-clamp-2">
        {{ short.title }}
      </h4>
    </div>
  </div>
</template>
