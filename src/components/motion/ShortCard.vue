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
    class="box p-0 w-full flex flex-col overflow-hidden cursor-pointer select-none transition-transform hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_var(--sh)] group"
    @click="emit('play', short)"
  >
    <div class="w-full aspect-[9/16] relative bg-[#181824] overflow-hidden border-b-[3px] border-[var(--bd)]">
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
      <!-- CUSTOM FALLBACK ARTWORK WHEN NO THUMBNAIL (E.G. FACEBOOK REELS) -->
      <div
        v-else
        class="w-full h-full relative p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1c1a32] via-[#24223f] to-[#121124] text-white"
      >
        <!-- Atmospheric decorative geometric shapes in the background -->
        <div class="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[var(--blue)]/20 blur-xl pointer-events-none" aria-hidden="true"></div>
        <div class="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-[var(--pink)]/20 blur-xl pointer-events-none" aria-hidden="true"></div>

        <div class="flex items-center justify-between z-10">
          <span class="inline-flex items-center gap-1.5 font-mono font-bold text-[0.72rem] bg-[var(--blue)] text-white border-2 border-[#0b0b0f] rounded-[6px] px-2 py-0.5 shadow-[2px_2px_0_#0b0b0f]">
            <span>{{ short.platform === 'facebook' ? 'FB' : 'MOTION' }}</span>
          </span>
        </div>

        <div class="flex flex-col items-center justify-center my-auto z-10 text-center px-2">
          <div class="w-14 h-14 rounded-full bg-[var(--yellow)] text-[#0b0b0f] border-[3px] border-[#0b0b0f] shadow-[3px_3px_0_#0b0b0f] grid place-items-center text-xl pl-1 group-hover:scale-110 transition-transform">
            ▶
          </div>
          <span class="mt-3 font-mono font-bold text-[0.75rem] tracking-wider text-[var(--yellow)] uppercase">
            {{ short.platform }} Reel
          </span>
        </div>

        <div class="z-10 text-center">
          <span class="font-mono text-[0.7rem] text-white/60">Tap to play</span>
        </div>
      </div>

      <!-- Play overlay only for real thumbnail images -->
      <div
        v-if="short.thumbnail_url || fallbackThumbnail"
        class="absolute inset-0 bg-[#0b0b0f]/35 grid place-items-center transition-colors group-hover:bg-[#0b0b0f]/20"
      >
        <span class="w-[46px] h-[46px] rounded-full bg-[var(--yellow)] text-[#0b0b0f] border-2 border-[#0b0b0f] shadow-[3px_3px_0_#0b0b0f] grid place-items-center text-[1.1rem] pl-1 transition-transform group-hover:scale-110">
          ▶
        </span>
      </div>
    </div>

    <div class="p-[14px_16px] max-sm:p-3">
      <h4 class="m-0 text-[1.05rem] max-sm:text-[0.92rem] font-bold tracking-[-0.01em] line-clamp-2">
        {{ short.title }}
      </h4>
    </div>
  </div>
</template>
