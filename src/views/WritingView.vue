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

    <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="empty-state card box">
      <span class="loading-tag">Loading writing...</span>
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

.empty-state {
  margin: 20px 0;
  font-family: var(--mono);
}
</style>
