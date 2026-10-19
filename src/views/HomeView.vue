<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import PostCard from '@/components/writing/PostCard.vue'
import BrutalButton from '@/components/brutal/BrutalButton.vue'
import ShortCard from '@/components/motion/ShortCard.vue'
import ShortPlayerModal from '@/components/motion/ShortPlayerModal.vue'
import type { Short } from '@/types'

const portfolioStore = usePortfolioStore()

const profile = computed(() => portfolioStore.profile)

const featuredProjects = computed(() => {
  const featured = portfolioStore.projects.filter((p) => p.is_featured && p.is_published)
  if (featured.length <= 3) return featured
  return [...featured].sort(() => 0.5 - Math.random()).slice(0, 3)
})

const featuredPosts = computed(() => {
  const featured = portfolioStore.posts.filter((p) => p.is_featured && p.is_published)
  if (featured.length <= 3) return featured
  return [...featured].sort(() => 0.5 - Math.random()).slice(0, 3)
})

const activeShorts = computed(() => {
  return portfolioStore.shorts.filter((s) => s.is_published).slice(0, 3)
})

const selectedShort = ref<Short | null>(null)

function playShort(short: Short) {
  selectedShort.value = short
}

const projectCardColors: ('mint' | 'orange' | 'pink' | 'blue')[] = ['mint', 'orange', 'pink']

const socialColorVariants: ('yellow' | 'pink' | 'blue' | 'mint' | 'orange')[] = [
  'yellow',
  'pink',
  'blue',
  'mint',
  'orange'
]
function getSocialVariant(idx: number) {
  return socialColorVariants[idx % socialColorVariants.length]
}

</script>

<template>
  <div class="c">
    <div class="hero">
      <div class="name box">
        <span class="hi">hello, I’m</span>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.headline }}</p>
      </div>

      <div class="side">
        <div class="photo-card box" role="img" :aria-label="profile.name">
          <div class="photo-frame">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.name"
              class="avatar-img"
            />
            <span v-else class="avatar-fallback">TR</span>
          </div>

          <div class="photo-location-badge">
            <span class="pin-badge" aria-hidden="true">📍</span>
            <span class="loc-label">Rangpur, Bangladesh</span>
          </div>
        </div>
      </div>
    </div>

    <ul class="links">
      <li v-for="(link, idx) in profile.social_links" :key="link.label">
        <BrutalButton
          as="a"
          :href="link.url"
          target="_blank"
          :variant="getSocialVariant(idx)"
        >
          {{ link.label }}
        </BrutalButton>
      </li>
    </ul>

    <section id="about">
      <div class="about-headers">
        <div><h2 class="h">Who I am</h2></div>
        <div><h2 class="h stack-heading">Tech stack</h2></div>
      </div>
      <div class="about">
        <div class="card box">
          <p v-for="(p, i) in profile.whoami" :key="i">
            {{ p }}
          </p>
        </div>

        <div class="card box">
          <div><h2 class="h mobile-stack-heading">Tech stack</h2></div>
          <dl class="stack" aria-label="Technologies">
            <div v-for="group in profile.grouped_stacks" :key="group.category">
              <dt>{{ group.category }}</dt>
              <dd>{{ group.items }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section id="projects">
      <h2 class="h">What I built</h2>
      <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="card box loading-box">
        <span class="loading-tag">Loading projects...</span>
      </div>
      <div v-else-if="featuredProjects.length === 0" class="card box empty-box">
        No projects found.
      </div>
      <div v-else class="proj">
        <ProjectCard
          v-for="(proj, idx) in featuredProjects"
          :key="proj.slug"
          :project="proj"
          :color="projectCardColors[idx % projectCardColors.length]"
          :class="{ 'span-wide': idx === 2 }"
        />
      </div>
      <div v-if="featuredProjects.length > 0" class="more">
        <BrutalButton as="router-link" to="/projects" variant="yellow" style="font-size: 1.05rem; padding: 10px 22px;">
          View all projects →
        </BrutalButton>
      </div>
    </section>

    <section id="writing">
      <h2 class="h">What I write</h2>
      <div v-if="portfolioStore.loading && !portfolioStore.isLoaded" class="card box loading-box">
        <span class="loading-tag">Loading writing...</span>
      </div>
      <div v-else-if="featuredPosts.length === 0" class="card box empty-box">
        No articles published yet.
      </div>
      <ul v-else class="posts">
        <li v-for="post in featuredPosts" :key="post.slug">
          <PostCard :post="post" />
        </li>
      </ul>
      <div v-if="featuredPosts.length > 0" class="more">
        <BrutalButton as="router-link" to="/writing" variant="yellow" style="font-size: 1.05rem; padding: 10px 22px;">
          View all writing →
        </BrutalButton>
      </div>
    </section>

    <!-- MOTION & SHORTS SHOWCASE -->
    <section v-if="activeShorts.length > 0" id="motion">
      <h2 class="h">Motion & Shorts</h2>
      <p class="section-sub">Motion videos and teasers I design to showcase and promote products.</p>
      <div class="shorts-track">
        <ShortCard
          v-for="(short, idx) in activeShorts"
          :key="short.id || short.title"
          :short="short"
          :index="idx"
          @play="playShort"
        />
      </div>
    </section>

    <!-- NATIVE VIDEO PLAYER MODAL -->
    <ShortPlayerModal
      :short="selectedShort"
      @close="selectedShort = null"
    />
  </div>
</template>

<style scoped>
.hero {
  padding: 40px 0 28px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.name {
  background: var(--yellow);
  color: #111;
  padding: 28px 28px 26px;
  position: relative;
  box-sizing: border-box;
}

.name .hi {
  font: 700 0.85rem var(--mono);
  background: #111;
  color: #fff;
  display: inline-block;
  padding: 2px 10px;
  margin-bottom: 14px;
}

h1 {
  margin: 0;
  font-size: clamp(3.4rem, 10vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  font-weight: 700;
}

.name p {
  margin: 16px 0 0;
  font-size: 1.15rem;
  max-width: 34ch;
  font-weight: 500;
}

.side {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 0;
}

.photo-card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--paper);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 3px solid var(--bd);
  box-shadow: 6px 6px 0 var(--sh);
  min-height: 0;
  overflow: hidden;
}

.photo-frame {
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  background: var(--blue);
  color: #111;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 2px solid var(--bd);
}

.avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 65%;
  display: block;
}

.avatar-fallback {
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--mono);
}

.photo-location-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: var(--pink);
  color: #111;
  border: 2px solid var(--bd);
  box-shadow: 3px 3px 0 var(--sh);
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  transform: rotate(-2deg);
  transition: transform 0.15s ease;
}

.photo-location-badge:hover {
  transform: rotate(0deg) scale(1.03);
}

.pin-badge {
  font-size: 1rem;
  line-height: 1;
  user-select: none;
}

.loc-label {
  font: 700 0.85rem var(--mono);
  white-space: nowrap;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 20px;
  padding: 0;
  list-style: none;
}

section {
  padding: 30px 0;
}

.about-headers {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
}

.mobile-stack-heading {
  display: none;
}

.about {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
}

.stack {
  margin: 0;
  display: grid;
}

.stack div {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 12px;
  padding: 9px 0;
  border-top: 2px solid var(--bd);
}

.stack div:first-child {
  border-top: 0;
  padding-top: 0;
}

.stack div:last-child {
  padding-bottom: 0;
}

.stack dt {
  font: 700 0.8rem var(--mono);
  padding-top: 3px;
}

.stack dd {
  margin: 0;
  font-weight: 700;
}

.loading-box,
.empty-box {
  padding: 30px 20px;
  text-align: center;
  font: 700 0.95rem var(--mono);
}

.loading-tag {
  background: var(--yellow);
  color: #111;
  padding: 4px 12px;
  border: 2px solid var(--bd);
  box-shadow: 2px 2px 0 var(--sh);
  display: inline-block;
  animation: pulse 1.2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(0.98); }
}

.proj {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
}

.proj .span-wide {
  grid-column: 1 / -1;
}

.more {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.posts {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.section-sub {
  margin: 0 0 16px;
  font-size: 1.05rem;
  color: var(--ink);
  opacity: 0.9;
  max-width: 55ch;
}

.shorts-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 4px 20px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.shorts-track > * {
  scroll-snap-align: start;
}

@media (max-width: 760px) {
  .hero, .about, .proj {
    grid-template-columns: 1fr;
  }
  .about-headers {
    display: block;
  }
  .stack-heading {
    display: none;
  }
  .mobile-stack-heading {
    display: inline-block;
    margin-bottom: 16px;
  }
  .photo-card {
    min-height: 280px;
  }
  .name {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .photo-card {
    min-height: 240px;
  }
  .stack div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
