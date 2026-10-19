<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import PostCard from '@/components/writing/PostCard.vue'

const portfolioStore = usePortfolioStore()

const publishedPosts = computed(() => {
  return portfolioStore.posts.filter((p) => p.is_published)
})

const dateColors: ('blue' | 'pink' | 'green' | 'orange' | 'yellow')[] = [
  'blue',
  'pink',
  'green',
  'orange',
  'yellow'
]
</script>

<template>
  <div class="c min-h-[calc(100vh-280px)] flex flex-col">
    <div class="pt-10 max-sm:pt-6 pb-6">
      <div class="sh">
        <h2>Writing</h2>
      </div>
      <p class="-mt-3 mb-6 text-[1.1rem] max-w-[65ch] opacity-85">
        Thoughts on software architecture, engineering experiments, books I’m reading, movies, and ideas in progress.
      </p>
    </div>

    <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="grid gap-4.5 pb-12">
      <div v-for="n in 4" :key="n" class="box p-4 flex items-center gap-5">
        <div class="skeleton-line w-20 h-4"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton-line w-[60%] h-5"></div>
          <div class="skeleton-line w-[35%] h-3.5"></div>
        </div>
        <div class="skeleton-line w-6 h-5"></div>
      </div>
    </div>

    <div v-else-if="publishedPosts.length === 0" class="box p-8 text-center font-mono font-bold mb-12">
      No articles published yet.
    </div>

    <ul v-else class="grid gap-4.5 max-sm:gap-3.5 m-0 p-0 pb-12 list-none">
      <li v-for="(post, idx) in publishedPosts" :key="post.slug">
        <PostCard :post="post" :color="dateColors[idx % dateColors.length]" />
      </li>
    </ul>
  </div>
</template>
