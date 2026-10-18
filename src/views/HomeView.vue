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
    <div class="hero">
      <div class="name box">
        <span class="hi">hello, I’m</span>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.headline }}</p>
      </div>

      <div class="side">
        <div class="photo box" role="img" :aria-label="profile.name">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            :alt="profile.name"
            class="avatar-img"
          />
          <span v-else>TR</span>
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

    <section id="writing">
      <h2 class="h">What I write</h2>
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
  align-items: flex-start;
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
  .name {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .stack div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
