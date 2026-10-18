<script setup lang="ts">
import { computed } from 'vue'
import type { Short } from '@/types'

const props = defineProps<{
  short: Short | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const embedUrl = computed(() => {
  if (!props.short) return ''
  const url = props.short.video_url

  if (props.short.platform === 'youtube') {
    // Extract video ID from youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
    }
    return url
  } else if (props.short.platform === 'facebook') {
    // Facebook video / reel embed URL
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`
  }

  return url
})

function handleBackdrop(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
    emit('close')
  }
}
</script>

<template>
  <div v-if="short" class="modal-backdrop" @click="handleBackdrop">
    <div class="video-modal box">
      <div class="modal-top">
        <span class="modal-title">{{ short.title }}</span>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">✕</button>
      </div>

      <div class="player-container">
        <iframe
          v-if="embedUrl"
          :src="embedUrl"
          class="video-frame"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(17, 17, 17, 0.75);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 16px;
}

.video-modal {
  background: var(--paper);
  color: var(--ink);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--yellow);
  color: #111;
  border-bottom: 3px solid var(--bd);
}

.modal-title {
  font: 700 0.95rem var(--sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
}

.close-btn {
  background: #111;
  color: #fff;
  border: 2px solid #111;
  font: 700 1rem var(--mono);
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.1s;
}

.close-btn:hover {
  background: var(--pink);
  color: #111;
}

.player-container {
  width: 100%;
  aspect-ratio: 9 / 16;
  max-height: 75vh;
  background: #000;
  position: relative;
}

.video-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
