<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{
  post: Post
}>()
</script>

<template>
  <router-link :to="`/writing/${post.slug}`" class="post-item">
    <time>{{ post.published_date }}</time>
    <div class="content">
      <h3>{{ post.title }}</h3>
      <p v-if="post.subtitle">{{ post.subtitle }}</p>
    </div>
    <span class="arr">→</span>
  </router-link>
</template>

<style scoped>
.post-item {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  background: var(--paper);
  color: var(--ink);
  text-decoration: none;
  border: 3px solid var(--bd);
  box-shadow: 5px 5px 0 var(--sh);
  transition: transform 0.1s, box-shadow 0.1s;
}

.post-item:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--sh);
  background: var(--yellow);
  color: #111;
}

time {
  font: 700 0.8rem var(--mono);
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.25;
}

p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.9;
}

.arr {
  font-weight: 700;
  font-size: 1.3rem;
}

@media (max-width: 760px) {
  .post-item {
    grid-template-columns: 1fr auto;
    gap: 6px 12px;
  }
  time {
    grid-column: 1 / -1;
  }
}
</style>
