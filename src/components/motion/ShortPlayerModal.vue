<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Short } from '@/types'

const props = defineProps<{
  short: Short | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const volume = ref(100)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const embedUrl = computed(() => {
  if (!props.short) return ''
  const url = props.short.video_url

  if (props.short.platform === 'youtube') {
    // Extract video ID from youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&enablejsapi=1&mute=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`
    }
    return url
  } else if (props.short.platform === 'facebook') {
    // Facebook video / reel embed URL with sound enabled
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&show_captions=false&autoplay=true&mute=0`
  }

  return url
})

function handleVolumeChange() {
  if (!iframeRef.value?.contentWindow || props.short?.platform !== 'youtube') return
  const val = Number(volume.value)
  // Send setVolume command to YouTube IFrame API via postMessage
  iframeRef.value.contentWindow.postMessage(
    JSON.stringify({
      event: 'command',
      func: 'setVolume',
      args: [val]
    }),
    '*'
  )
  if (val === 0) {
    iframeRef.value.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'mute',
        args: []
      }),
      '*'
    )
  } else {
    iframeRef.value.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'unMute',
        args: []
      }),
      '*'
    )
  }
}

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
          ref="iframeRef"
          :src="embedUrl"
          class="video-frame"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <!-- SOUND SLIDER FOR YOUTUBE VIDEOS -->
      <div v-if="short.platform === 'youtube'" class="modal-bottom">
        <div class="vol-control">
          <span class="vol-icon" aria-hidden="true">{{ volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊' }}</span>
          <label class="vol-label">Volume: {{ volume }}%</label>
          <input
            v-model.number="volume"
            type="range"
            min="0"
            max="100"
            step="1"
            class="vol-slider"
            @input="handleVolumeChange"
          />
        </div>
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

.modal-bottom {
  padding: 10px 16px;
  background: var(--paper);
  border-top: 2px solid var(--bd);
}

.vol-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vol-icon {
  font-size: 1.1rem;
}

.vol-label {
  font: 700 0.8rem var(--mono);
  color: var(--ink);
  min-width: 95px;
}

.vol-slider {
  flex: 1;
  accent-color: var(--yellow);
  cursor: pointer;
  height: 6px;
}
</style>
