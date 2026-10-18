<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import PostCard from '@/components/writing/PostCard.vue'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

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
    <section class="hero">
      <div class="name box">
        <span class="hi">HELLO WORLD</span>
        <div class="sticker">READY TO BUILD</div>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.headline }}</p>
        <div class="roles">FULL-STACK • COMPETITIVE PROGRAMMER • IOT</div>
      </div>

      <div class="side">
        <div class="photo box">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            :alt="profile.name"
            class="avatar-img"
          />
          <span v-else>TR</span>
        </div>

        <div
          v-for="(st, idx) in profile.stats || []"
          :key="st.label"
          :class="['stat', 'box', idx % 2 === 0 ? 's1' : 's2']"
        >
          <b>{{ st.value }}</b>
          <span>{{ st.label }}</span>
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
      </div>
    </section>

    <section>
      <span class="h">WHO AM I</span>
      <div class="about">
        <div class="card box">
          <p v-for="(p, i) in profile.whoami" :key="i">
            {{ p }}
          </p>
        </div>

        <div class="card box">
          <p style="font-weight: 700; margin-bottom: 12px; font-family: var(--mono)">MAIN STACK</p>
          <ul class="do">
            <li v-for="tech in profile.main_stack" :key="tech">
              {{ tech }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <span class="h">TECH STACK</span>
      <div class="card box">
        <dl class="stack">
          <div v-for="group in profile.grouped_stacks" :key="group.category">
            <dt>{{ group.category }}</dt>
            <dd>{{ group.items }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section>
      <span class="h">FEATURED PROJECTS</span>
      <div class="proj">
        <ProjectCard
          v-for="(proj, idx) in featuredProjects"
          :key="proj.slug"
          :project="proj"
          :color="projectCardColors[idx % projectCardColors.length]"
        />
      </div>
      <div class="more">
        <BrutalButton as="router-link" to="/projects" variant="yellow" style="font-size: 1.05rem; padding: 10px 22px;">
          View all projects →
        </BrutalButton>
      </div>
    </section>

    <section>
      <span class="h">WRITING</span>
      <ul class="posts">
        <li v-for="post in featuredPosts" :key="post.slug">
          <PostCard :post="post" />
        </li>
      </ul>
      <div class="more">
        <BrutalButton as="router-link" to="/writing" variant="yellow" style="font-size: 1.05rem; padding: 10px 22px;">
          View all writing →
        </BrutalButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 40px 0 28px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 28px;
  align-items: stretch;
}

.name {
  background: var(--yellow);
  color: #111;
  padding: 28px 28px 26px;
  position: relative;
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
  font-size: clamp(3.4rem, 10vw, 5.5rem);
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

.roles {
  margin-top: 14px;
  font: 700 0.8rem var(--mono);
}

.side {
  display: grid;
  gap: 18px;
}

.photo {
  width: 100%;
  max-width: 150px;
  aspect-ratio: 1;
  background: var(--blue);
  color: #111;
  display: grid;
  place-items: center;
  font-size: 2.6rem;
  font-weight: 700;
  overflow: hidden;
  padding: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stat {
  padding: 14px 18px;
  color: #111;
}

.stat b {
  display: block;
  font-size: 1.15rem;
}

.stat span {
  font: 400 0.85rem var(--mono);
}

.stat.s1 { background: var(--pink); }
.stat.s2 { background: var(--mint); }

.sticker {
  position: absolute;
  right: -10px;
  top: -16px;
  transform: rotate(6deg);
  background: var(--blue);
  color: #111;
  border: 3px solid var(--bd);
  box-shadow: 3px 3px 0 var(--sh);
  font: 700 0.8rem var(--mono);
  padding: 4px 10px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

section {
  padding: 30px 0;
}

.about {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
}

.do {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.do li {
  border: 3px solid var(--bd);
  padding: 3px 12px;
  font-weight: 700;
  font-family: var(--mono);
  font-size: 0.85rem;
  background: var(--yellow);
  color: #111;
}

.do li:nth-child(2) { background: var(--pink); }
.do li:nth-child(3) { background: var(--mint); }
.do li:nth-child(4) { background: var(--blue); }

.stack {
  margin: 0;
  display: grid;
}

.stack div {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 12px;
  padding: 10px 0;
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
  font: 700 0.85rem var(--mono);
  padding-top: 2px;
}

.stack dd {
  margin: 0;
  font-weight: 700;
}

.proj {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
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

@media (max-width: 760px) {
  .hero, .about, .proj {
    grid-template-columns: 1fr;
  }
  .side {
    grid-template-columns: 1fr 1fr;
  }
  .name {
    padding: 24px 20px;
  }
  .sticker {
    right: 6px;
  }
}

@media (max-width: 480px) {
  .side {
    grid-template-columns: 1fr;
  }
  .stack div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
