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

function parseItems(items: string): string[] {
  if (!items) return []
  return items.split(',').map((s) => s.trim()).filter(Boolean)
}

const accentColors = ['mint', 'yellow', 'pink', 'blue', 'orange'] as const
function getAccentColor(idx: number) {
  return accentColors[idx % accentColors.length]
}

const contactEmail = computed(() => {
  return portfolioStore.profile.email || 'com.tajim@gmail.com'
})

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

async function copyEmail() {
  let copied = false
  const text = contactEmail.value

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      copied = true
    } catch {
      copied = false
    }
  }

  if (!copied) {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.width = '2em'
      textarea.style.height = '2em'
      textarea.style.padding = '0'
      textarea.style.border = 'none'
      textarea.style.outline = 'none'
      textarea.style.boxShadow = 'none'
      textarea.style.background = 'transparent'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, text.length)
      copied = document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch (err) {
      console.error('Fallback copy error:', err)
    }
  }

  if (copied) {
    isCopied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="c">
    <div class="hero">
      <div class="name box">
        <span class="hi">hello, I’m</span>
        <h1>{{ profile.name || 'TR Tajim' }}</h1>
        <p v-if="portfolioStore.isLoaded && profile.headline">{{ profile.headline }}</p>
        <div v-else class="hero-skeleton-wrap" aria-hidden="true">
          <div class="hero-shimmer-line line-1"></div>
          <div class="hero-shimmer-line line-2"></div>
        </div>
      </div>

      <div class="side">
        <div class="photo-card box" role="img" :aria-label="profile.name || 'TR Tajim'">
          <div class="photo-frame">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.name || 'TR Tajim'"
              class="avatar-img"
            />
            <span v-else class="avatar-fallback">{{ (profile.name || 'TR Tajim').slice(0, 2).toUpperCase() }}</span>
          </div>

          <div class="photo-location-badge">
            <span class="pin-badge" aria-hidden="true">📍</span>
            <span class="loc-label">Rangpur, Bangladesh</span>
          </div>
        </div>
      </div>
    </div>

    <ul v-if="!portfolioStore.isLoaded" class="links skeleton-links" aria-hidden="true">
      <li v-for="n in 4" :key="n">
        <div class="skeleton-pill" style="width: 88px; height: 38px;"></div>
      </li>
    </ul>
    <ul v-else-if="profile.social_links && profile.social_links.length" class="links">
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
      <h2 class="h">Who I am</h2>
      <div class="card box about-card">
        <div v-if="!portfolioStore.isLoaded" class="skeleton-whoami">
          <div class="skeleton-line" style="width: 95%; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 88%; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 70%; margin-bottom: 20px;"></div>
          <div class="skeleton-line" style="width: 92%; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 65%;"></div>
        </div>
        <template v-else>
          <p v-for="(p, i) in profile.whoami" :key="i">
            {{ p }}
          </p>
        </template>
      </div>
    </section>

    <section id="stack">
      <h2 class="h">Tech stack</h2>
      <div v-if="!portfolioStore.isLoaded" class="stack-grid">
        <div v-for="n in 6" :key="n" class="card box skeleton-stack-card">
          <div class="skeleton-line" style="width: 80px; height: 18px; margin-bottom: 12px;"></div>
          <div class="skeleton-badges">
            <div class="skeleton-pill" style="width: 50px; height: 24px;"></div>
            <div class="skeleton-pill" style="width: 70px; height: 24px;"></div>
            <div class="skeleton-pill" style="width: 60px; height: 24px;"></div>
            <div class="skeleton-pill" style="width: 75px; height: 24px;"></div>
          </div>
        </div>
      </div>
      <div v-else class="stack-grid">
        <div
          v-for="(group, gIdx) in profile.grouped_stacks"
          :key="group.category"
          class="card box stack-cat-card"
        >
          <span class="stack-cat-title">{{ group.category }}</span>
          <ul class="stack-accent-badges" :aria-label="group.category + ' technologies'">
            <li
              v-for="(item, iIdx) in parseItems(group.items)"
              :key="item"
              :class="['stack-accent-badge', getAccentColor(gIdx + iIdx)]"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="projects">
      <h2 class="h">What I built</h2>
      <div v-if="!portfolioStore.isLoaded" class="proj">
        <div v-for="n in 3" :key="n" :class="['card', 'box', 'skeleton-card', { 'span-wide': n === 3 }]">
          <div class="skeleton-pill" style="margin-bottom: 16px; width: 80px;"></div>
          <div class="skeleton-line" style="width: 60%; height: 26px; margin-bottom: 14px;"></div>
          <div class="skeleton-line" style="width: 90%; margin-bottom: 8px;"></div>
          <div class="skeleton-line" style="width: 75%; margin-bottom: 20px;"></div>
          <div style="display: flex; gap: 8px;">
            <div class="skeleton-pill" style="width: 70px; height: 22px;"></div>
            <div class="skeleton-pill" style="width: 60px; height: 22px;"></div>
          </div>
        </div>
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
      <div v-if="!portfolioStore.isLoaded" class="posts">
        <div v-for="n in 3" :key="n" class="card box skeleton-post-row">
          <div class="skeleton-line" style="width: 80px; height: 16px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line" style="width: 65%; height: 20px; margin-bottom: 8px;"></div>
            <div class="skeleton-line" style="width: 40%; height: 14px;"></div>
          </div>
          <div class="skeleton-line" style="width: 24px; height: 18px;"></div>
        </div>
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

    <!-- CONNECT / GET IN TOUCH CTA -->
    <section id="contact" class="contact-section">
      <div class="card box contact-card">
        <div class="contact-content">
          <span class="contact-badge">LET’S CONNECT</span>
          <h2 class="contact-title">Have an idea or want to talk tech?</h2>
          <p class="contact-sub">
            Always down to chat about programming, new ideas, or interesting projects. Feel free to say hi anytime!
          </p>
        </div>

        <div class="contact-actions">
          <BrutalButton
            as="a"
            :href="`mailto:${contactEmail}`"
            variant="yellow"
            style="font-size: 1.05rem; padding: 12px 24px;"
          >
            Say Hello ✉️
          </BrutalButton>

          <button
            type="button"
            class="copy-email-btn"
            :class="{ copied: isCopied }"
            @click="copyEmail"
            :aria-label="isCopied ? 'Email address copied' : 'Copy email address'"
          >
            <span class="copy-email-text">{{ contactEmail }}</span>
            <span class="copy-pill">
              {{ isCopied ? 'Copied! ✓' : 'Copy' }}
            </span>
          </button>
        </div>
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

.about-card {
  font-size: 1.15rem;
  line-height: 1.7;
}

.about-card p {
  margin: 0 0 14px;
}

.about-card p:last-child {
  margin-bottom: 0;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stack-cat-card {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack-cat-title {
  font: 700 0.85rem var(--mono);
  background: var(--ink);
  color: var(--paper);
  display: inline-block;
  align-self: flex-start;
  padding: 3px 8px;
  letter-spacing: -0.01em;
}

/* Option D: Colorful accent badges */
.stack-accent-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack-accent-badge {
  font: 700 0.82rem var(--mono);
  color: #111;
  border: 2px solid var(--bd);
  box-shadow: 2px 2px 0 var(--sh);
  padding: 2px 8px;
}

.stack-accent-badge.mint { background: var(--mint); }
.stack-accent-badge.yellow { background: var(--yellow); }
.stack-accent-badge.pink { background: var(--pink); }
.stack-accent-badge.blue { background: var(--blue); }
.stack-accent-badge.orange { background: var(--orange); }

.skeleton-stack-card {
  padding: 18px 20px;
}

.skeleton-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-skeleton-wrap {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 34ch;
}

.hero-shimmer-line {
  height: 20px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 0.08) 0%,
    rgba(17, 17, 17, 0.24) 50%,
    rgba(17, 17, 17, 0.08) 100%
  );
  background-size: 200% 100%;
  animation: hero-shimmer-sweep 1.4s ease-in-out infinite;
}

.hero-shimmer-line.line-1 {
  width: 92%;
}

.hero-shimmer-line.line-2 {
  width: 60%;
}

@keyframes hero-shimmer-sweep {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.hero-name-shimmer {
  height: clamp(3.2rem, 9vw, 5.5rem);
  width: 75%;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 0.1) 0%,
    rgba(17, 17, 17, 0.28) 50%,
    rgba(17, 17, 17, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: hero-shimmer-sweep 1.4s ease-in-out infinite;
  margin: 6px 0 10px;
}

.avatar-shimmer {
  width: 100%;
  height: 100%;
  min-height: 220px;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 0.05) 0%,
    rgba(17, 17, 17, 0.16) 50%,
    rgba(17, 17, 17, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: hero-shimmer-sweep 1.4s ease-in-out infinite;
}

.skeleton-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 32px;
  padding: 0;
  list-style: none;
}

.skeleton-card {
  background: var(--paper);
  padding: 24px;
}

.skeleton-post-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
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

.contact-section {
  margin-top: 48px;
}

.contact-card {
  padding: 34px 30px;
  background: var(--paper);
  border: 3px solid var(--bd);
  box-shadow: 6px 6px 0 var(--sh);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-badge {
  font: 700 0.8rem var(--mono);
  background: var(--ink);
  color: var(--yellow);
  display: inline-block;
  padding: 3px 10px;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.contact-title {
  margin: 0 0 10px;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.contact-sub {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--ink);
  opacity: 0.9;
  max-width: 58ch;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
}

.copy-email-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--paper);
  color: var(--ink);
  border: 3px solid var(--bd);
  box-shadow: 4px 4px 0 var(--sh);
  padding: 9px 16px;
  font: 700 0.95rem var(--mono);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: transform 0.1s, box-shadow 0.1s, background-color 0.15s;
}

@media (hover: hover) {
  .copy-email-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--sh);
  }
}

.copy-email-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--sh);
}

.copy-email-text {
  font-size: clamp(0.82rem, 3.8vw, 0.95rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.copy-pill {
  font: 700 0.78rem var(--mono);
  background: var(--mint);
  color: #111;
  border: 2px solid var(--bd);
  padding: 2px 8px;
  box-shadow: 1px 1px 0 var(--sh);
  min-width: 70px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s, color 0.2s;
}

.copy-email-btn.copied .copy-pill {
  background: var(--yellow);
  color: #111;
}

@media (max-width: 860px) {
  .stack-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .hero, .proj {
    grid-template-columns: 1fr;
  }
  .photo-card {
    min-height: 280px;
  }
  .name {
    padding: 24px 20px;
  }
}

@media (max-width: 540px) {
  .stack-grid {
    grid-template-columns: 1fr;
  }
  .contact-card {
    padding: 24px 18px;
  }
  .contact-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .copy-email-btn {
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 10px 14px;
  }
}

@media (max-width: 480px) {
  .photo-card {
    min-height: 240px;
  }
}
</style>
