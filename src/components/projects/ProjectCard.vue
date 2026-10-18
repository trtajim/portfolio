<script setup lang="ts">
import type { Project } from '@/types'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

defineProps<{
  project: Project
  color?: 'mint' | 'orange' | 'pink' | 'blue'
}>()

const colorOrder: ('yellow' | 'pink' | 'blue' | 'mint' | 'orange')[] = [
  'yellow',
  'pink',
  'blue',
  'mint',
  'orange'
]

function getButtonVariant(index: number) {
  return colorOrder[index % colorOrder.length]
}
</script>

<template>
  <div :class="['p', color || 'mint']">
    <span v-if="project.top_metric" class="badge">
      {{ project.top_metric }}
    </span>

    <span class="st">{{ project.pill }}</span>

    <h3>
      <router-link :to="`/projects/${project.slug}`" class="title-link">
        {{ project.title }}
      </router-link>
    </h3>

    <p>{{ project.summary }}</p>

    <ul v-if="project.tags && project.tags.length" class="t">
      <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
    </ul>

    <div v-if="project.actions && project.actions.length" class="acts">
      <BrutalButton
        v-for="(action, index) in project.actions.slice(0, 3)"
        :key="action.label"
        as="a"
        :href="action.url"
        target="_blank"
        :variant="getButtonVariant(index)"
      >
        {{ action.label }}
      </BrutalButton>
    </div>
  </div>
</template>

<style scoped>
.p {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #111;
  position: relative;
  border: 3px solid var(--bd);
  box-shadow: 6px 6px 0 var(--sh);
}

.p.mint { background: var(--mint); }
.p.orange { background: var(--orange); }
.p.pink { background: var(--pink); }
.p.blue { background: var(--blue); }

.badge {
  position: absolute;
  top: 18px;
  right: 18px;
}

@media (max-width: 480px) {
  .badge {
    position: static;
    align-self: flex-start;
  }
}

.st {
  align-self: flex-start;
  font: 700 0.75rem var(--mono);
  background: #111;
  color: #fff;
  padding: 2px 10px;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.title-link:hover {
  text-decoration: underline;
}

h3 {
  margin: 0;
  font-size: 1.6rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

ul.t {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

ul.t li {
  font: 700 0.75rem var(--mono);
  background: #fff;
  border: 2px solid #111;
  padding: 1px 8px;
  color: #111;
}

.acts {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 6px;
}
</style>
