<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { usePortfolioStore } from '@/stores/portfolio'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()

const project = computed(() => {
  return portfolioStore.projects.find((p) => p.slug === route.params.slug)
})

const renderedContent = computed(() => {
  if (!project.value?.content) return ''
  return marked.parse(project.value.content)
})

const colorOrder: ('yellow' | 'pink' | 'blue' | 'mint' | 'orange')[] = [
  'yellow',
  'pink',
  'blue',
  'mint',
  'orange'
]
function getActionVariant(idx: number) {
  return colorOrder[idx % colorOrder.length]
}
</script>

<template>
  <div class="c detail-page">
    <div style="margin-bottom: 24px;">
      <BrutalButton as="button" variant="white" @click="router.back()">
        ← Back
      </BrutalButton>
    </div>

    <div v-if="!project" class="card box">
      <h2>Project Not Found</h2>
      <p>The requested project does not exist or may have been unpublished.</p>
    </div>

    <article v-else class="project-detail">
      <div class="banner box">
        <span class="st">{{ project.pill }}</span>
        <span v-if="project.top_metric" class="badge">{{ project.top_metric }}</span>
        <h1>{{ project.title }}</h1>
        <p class="summary">{{ project.summary }}</p>

        <div v-if="project.tags && project.tags.length" class="tags">
          <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div v-if="project.actions && project.actions.length" class="acts">
          <BrutalButton
            v-for="(action, idx) in project.actions"
            :key="action.label"
            as="a"
            :href="action.url"
            target="_blank"
            :variant="getActionVariant(idx)"
          >
            {{ action.label }}
          </BrutalButton>
        </div>
      </div>

      <div v-if="project.image_url" class="featured-img box">
        <img :src="project.image_url" :alt="project.title" />
      </div>

      <div v-if="project.content" class="card box markdown-body" v-html="renderedContent"></div>
    </article>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 30px;
  padding-bottom: 50px;
}

.banner {
  background: var(--yellow);
  color: #111;
  padding: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.st {
  align-self: flex-start;
  font: 700 0.8rem var(--mono);
  background: #111;
  color: #fff;
  padding: 3px 10px;
}

.badge {
  position: absolute;
  top: 24px;
  right: 24px;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.summary {
  font-size: 1.2rem;
  margin: 0;
  max-width: 65ch;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font: 700 0.8rem var(--mono);
  background: #fff;
  border: 2px solid #111;
  padding: 2px 10px;
}

.acts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.featured-img {
  margin-bottom: 28px;
  overflow: hidden;
  max-height: 480px;
  background: #111;
}

.featured-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 600px) {
  .banner {
    padding: 20px;
  }
  .badge {
    position: static;
    align-self: flex-start;
  }
}
</style>
