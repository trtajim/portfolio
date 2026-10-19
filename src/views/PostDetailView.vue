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
  const cleaned = post.value.content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      return line.startsWith('    ') || line.startsWith('\t') ? line.trimStart() : line
    })
    .join('\n')

  return marked.parse(cleaned)
})
</script>

<template>
  <div class="c pt-8 max-sm:pt-4 pb-14">
    <div class="mb-6">
      <BrutalButton as="button" variant="white" @click="router.back()">
        ← Back
      </BrutalButton>
    </div>

    <div v-if="!post" class="box p-8 text-center font-mono font-bold">
      <h2 class="text-2xl mb-2">Article Not Found</h2>
      <p class="opacity-80">The requested post does not exist or has not been published.</p>
    </div>

    <article v-else class="flex flex-col gap-5">
      <header class="box p-8 max-sm:p-5 flex flex-col gap-3.5">
        <div class="font-mono font-bold text-[0.85rem]">
          <time class="bg-[var(--blue)] text-white border-2 border-[#0b0b0f] rounded-[6px] px-2.5 py-0.5">
            {{ post.published_date }}
          </time>
        </div>

        <h1 class="m-0 text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.1] tracking-[-0.03em] font-extrabold">
          {{ post.title }}
        </h1>
        <p v-if="post.subtitle" class="text-[1.2rem] m-0 font-medium opacity-90">
          {{ post.subtitle }}
        </p>

        <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mt-1.5">
          <span
            v-for="(tag, idx) in post.tags"
            :key="tag"
            :class="[
              'chip',
              idx === 0 && '!bg-[var(--yellow)] !text-[#0b0b0f]'
            ]"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <div v-if="post.image_url" class="box overflow-hidden max-h-[480px] bg-[#111] p-0">
        <img :src="post.image_url" :alt="post.title" class="w-full h-full object-cover block" />
      </div>

      <div v-if="post.content" class="box p-8 max-sm:p-5 markdown-body" v-html="renderedContent"></div>
    </article>
  </div>
</template>
