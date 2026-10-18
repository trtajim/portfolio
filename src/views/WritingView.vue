<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import PostCard from '@/components/writing/PostCard.vue'

const portfolioStore = usePortfolioStore()

const publishedPosts = computed(() => {
  return portfolioStore.posts.filter((p) => p.is_published)
})
</script>

<template>
  <div class="c">
    <div class="header-section">
      <span class="h">WRITING</span>
      <p class="sub">
        Thoughts on software architecture, engineering experiments, books I’m reading, movies, and ideas in progress.
      </p>
    </div>

    <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="post-list">
      <div v-for="n in 4" :key="n" class="card box skeleton-post-item">
        <div class="skeleton-line" style="width: 80px; height: 16px;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line" style="width: 60%; height: 22px; margin-bottom: 8px;"></div>
          <div class="skeleton-line" style="width: 35%; height: 14px;"></div>
        </div>
        <div class="skeleton-line" style="width: 24px; height: 18px;"></div>
      </div>
    </div>

    <div v-else-if="publishedPosts.length === 0" class="empty-state card box">
      No articles published yet.
    </div>

    <ul v-else class="post-list">
      <li v-for="post in publishedPosts" :key="post.slug">
        <PostCard :post="post" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.header-section {
  padding: 40px 0 24px;
}

.sub {
  font-size: 1.1rem;
  max-width: 60ch;
  margin: 0;
}

.post-list {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0 0 50px;
  list-style: none;
}

.skeleton-post-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  background: var(--paper);
}

.empty-state {
  margin: 20px 0;
  font-family: var(--mono);
}
</style>
