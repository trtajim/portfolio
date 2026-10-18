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
  // If YouTube and no custom thumbnail, grab maxresdefault / hqdefault
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
  <div class="short-card box" @click="emit('play', short)">
    <div class="thumb-container">
      <span v-if="index !== undefined" class="idx-badge">#{{ index + 1 }}</span>

      <img
        v-if="short.thumbnail_url || fallbackThumbnail"
        :src="short.thumbnail_url || fallbackThumbnail!"
        :alt="short.title"
        class="thumb-img"
        loading="lazy"
      />
      <div v-else class="thumb-placeholder">
        <span class="pl-tag">MOTION</span>
      </div>

      <div class="play-overlay">
        <span class="play-icon">▶</span>
      </div>
    </div>

    <div class="card-info">
      <h4 class="short-title">{{ short.title }}</h4>
    </div>
  </div>
</template>

<style scoped>
.short-card {
  flex: 0 0 260px;
  width: 260px;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  transition: transform 0.12s, box-shadow 0.12s;
}

.short-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--sh);
}

.short-card:active {
  transform: translate(3px, 3px);
  box-shadow: 2px 2px 0 var(--sh);
}

.thumb-container {
  width: 100%;
  aspect-ratio: 9 / 16;
  position: relative;
  background: #111;
  overflow: hidden;
  border-bottom: 3px solid var(--bd);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: var(--paper);
  color: var(--ink);
}

.pl-tag {
  font: 700 1rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 2px solid var(--bd);
  padding: 4px 10px;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.25);
  transition: background 0.15s;
}

.short-card:hover .play-overlay {
  background: rgba(0, 0, 0, 0.05);
}

.idx-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font: 700 0.8rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 #111;
  padding: 2px 8px;
  z-index: 2;
  user-select: none;
}

.play-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--yellow);
  color: #111;
  border: 3px solid #111;
  box-shadow: 3px 3px 0 #111;
  font-size: 1.1rem;
  padding-left: 3px;
  transition: transform 0.12s;
}

.short-card:hover .play-icon {
  transform: scale(1.1);
}

.card-info {
  padding: 12px 14px;
  background: var(--paper);
}

.short-title {
  margin: 0;
  font-size: 0.95rem;
  font-family: var(--sans);
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 600px) {
  .short-card {
    flex: 0 0 160px;
    width: 160px;
  }
}
</style>
