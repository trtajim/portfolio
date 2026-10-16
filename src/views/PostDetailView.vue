<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { usePortfolioStore } from '@/stores/portfolio'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()

const post = computed(() => {
  return portfolioStore.posts.find((p) => p.slug === route.params.slug)
})

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked.parse(post.value.content)
})
</script>

<template>
  <div class="c detail-page">
    <div style="margin-bottom: 24px;">
      <BrutalButton as="button" variant="white" @click="router.back()">
        ← Back
      </BrutalButton>
    </div>

    <div v-if="!post" class="card box">
      <h2>Article Not Found</h2>
      <p>The requested post does not exist or has not been published.</p>
    </div>

    <article v-else class="post-detail">
      <header class="post-header box">
        <div class="meta">
          <time>{{ post.published_date }}</time>
          <span class="dot">•</span>
          <span>{{ post.reading_time }}</span>
        </div>

        <h1>{{ post.title }}</h1>
        <p v-if="post.subtitle" class="subtitle">{{ post.subtitle }}</p>

        <div v-if="post.tags && post.tags.length" class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <div v-if="post.image_url" class="featured-img box">
        <img :src="post.image_url" :alt="post.title" />
      </div>

      <div class="card box markdown-body" v-html="renderedContent"></div>
    </article>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 30px;
  padding-bottom: 50px;
}

.post-header {
  background: var(--paper);
  color: var(--ink);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}

.meta {
  font: 700 0.85rem var(--mono);
  display: flex;
  gap: 8px;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.subtitle {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  opacity: 0.9;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.tag {
  font: 700 0.8rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 2px solid var(--bd);
  padding: 2px 10px;
}

.featured-img {
  margin-bottom: 28px;
  max-height: 480px;
  overflow: hidden;
}

.featured-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .post-header {
    padding: 20px;
  }
}
</style>
