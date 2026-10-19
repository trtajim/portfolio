<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import PostCard from '@/components/writing/PostCard.vue'
import BrutalButton from '@/components/brutal/BrutalButton.vue'
import ShortCard from '@/components/motion/ShortCard.vue'
import ShortPlayerModal from '@/components/motion/ShortPlayerModal.vue'
import type { Short, GroupedStack, Project } from '@/types'

const portfolioStore = usePortfolioStore()

const profile = computed(() => portfolioStore.profile)



const featuredProjects = computed(() => {
  return portfolioStore.projects.filter((p) => p.is_featured && p.is_published)
})

const spotlightProject = computed(() => {
  if (featuredProjects.value.length === 0) return null
  const found = featuredProjects.value.find((p) => p.slug === 'hscstack')
  return found || featuredProjects.value[0] || null
})

const otherProjects = computed(() => {
  if (!spotlightProject.value) return []
  return featuredProjects.value.filter((p) => p.slug !== spotlightProject.value?.slug)
})

function parseMetric(metric?: string | null): { value: string; label: string } {
  if (!metric) return { value: '', label: '' }
  const trimmed = metric.trim()
  const parts = trimmed.split(/\s+/)
  const first = parts[0] || ''
  if (parts.length === 1) {
    return { value: first, label: '' }
  }
  return {
    value: first,
    label: parts.slice(1).join(' ')
  }
}

function splitSummary(summary?: string | null): { main: string; note: string } {
  if (!summary) return { main: '', note: '' }
  const trimmed = summary.trim()

  if (trimmed.includes('\n')) {
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length > 1) {
      return {
        main: lines.slice(0, -1).join(' '),
        note: lines[lines.length - 1] || ''
      }
    }
  }

  const matches = trimmed.match(/[^.!?]+[.!?]+(?:\s+|$)/g)
  if (matches && matches.length > 1) {
    const last = matches[matches.length - 1]
    const note = last ? last.trim() : ''
    const main = matches.slice(0, -1).join('').trim()
    return { main, note }
  }

  return { main: trimmed, note: '' }
}

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

      <div v-if="!portfolioStore.isLoaded && portfolioStore.loading" class="proj">
        <div v-for="n in 3" :key="n" :class="['card', 'box', 'skeleton-card', { 'span-wide': n === 3 }]">
          <div class="skeleton-pill" style="margin-bottom: 16px; width: 80px;"></div>
          <div class="skeleton-line" style="width: 60%; height: 26px; margin-bottom: 14px;"></div>
          <div class="skeleton-line" style="width: 90%; margin-bottom: 8px;"></div>
          <div class="skeleton-line" style="width: 75%; margin-bottom: 20px;"></div>
        </div>
      </div>

      <div v-else-if="featuredProjects.length === 0" class="card box empty-box">
        No projects found.
      </div>

      <div v-else class="showcase-wrap">
        <!-- SPOTLIGHT SHOWCASE (FLAGSHIP PROJECT) -->
        <div v-if="spotlightProject" class="spotlight-card spotlight-split box">
          <div class="spotlight-left">
            <div class="spotlight-pill-row">
              <span class="spotlight-kicker">★ FEATURED {{ spotlightProject.pill ? spotlightProject.pill.toUpperCase() : '' }}</span>
            </div>
            <h3 class="spotlight-title">
              <router-link :to="`/projects/${spotlightProject.slug}`" class="title-link">
                {{ spotlightProject.title }}
              </router-link>
            </h3>
            <p class="spotlight-summary">{{ splitSummary(spotlightProject.summary).main }}</p>
            <div v-if="spotlightProject.actions?.length" class="acts">
              <BrutalButton
                v-for="(action, index) in spotlightProject.actions"
                :key="action.label"
                as="a"
                :href="action.url"
                target="_blank"
                :variant="getSocialVariant(index)"
              >
                {{ action.label }} ↗
              </BrutalButton>
            </div>
          </div>
          <div class="spotlight-right">
            <div class="browser-frame box">
              <div class="browser-top">
                <div class="browser-dots">
                  <span class="browser-dot red"></span>
                  <span class="browser-dot yellow"></span>
                  <span class="browser-dot green"></span>
                </div>
                <span class="browser-address">
                  {{ spotlightProject.actions?.[0]?.url || `https://${spotlightProject.slug}` }}
                </span>
              </div>
              <div class="browser-body">
                <div v-if="spotlightProject.top_metric" class="browser-stat-highlight">
                  <span class="stat-number">{{ parseMetric(spotlightProject.top_metric).value }}</span>
                  <span v-if="parseMetric(spotlightProject.top_metric).label" class="stat-sub">
                    {{ parseMetric(spotlightProject.top_metric).label }}
                  </span>
                </div>
                <div v-if="spotlightProject.tags?.length" class="browser-tech-badges">
                  <span v-for="tag in spotlightProject.tags" :key="tag" class="b-badge">
                    {{ tag }}
                  </span>
                </div>
                <p v-if="splitSummary(spotlightProject.summary).note" class="browser-note">
                  {{ splitSummary(spotlightProject.summary).note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- OTHER FEATURED PROJECTS -->
        <div v-if="otherProjects.length > 0" class="other-heading-row">
          <span class="other-section-tag">More Featured Work</span>
        </div>
        <div v-if="otherProjects.length > 0" class="proj">
          <ProjectCard
            v-for="(proj, idx) in otherProjects"
            :key="proj.slug"
            :project="proj"
            :color="projectCardColors[(idx + 1) % projectCardColors.length]"
          />
        </div>
      </div>

      <div class="more">
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

.showcase-wrap {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Base Spotlight Card */
.spotlight-card {
  position: relative;
  color: #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.spotlight-pill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.spotlight-kicker {
  font: 700 0.75rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 2px solid var(--bd);
  box-shadow: 2px 2px 0 var(--sh);
  padding: 2px 8px;
  letter-spacing: -0.01em;
}

.spotlight-title {
  margin: 0;
  font-size: clamp(1.75rem, 5vw, 2.4rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  font-weight: 700;
  word-break: break-word;
}

.spotlight-summary {
  margin: 0;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  line-height: 1.55;
  color: #111;
}

/* ========================================= */
/* DESIGN 1: SPLIT HERO SHOWCASE STYLES      */
/* ========================================= */
.spotlight-split {
  background: var(--mint);
  padding: 30px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  align-items: center;
  border: 3px solid var(--bd);
  box-shadow: 6px 6px 0 var(--sh);
}

.spotlight-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.spotlight-left .acts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.browser-frame {
  background: #ffffff;
  color: #111;
  border: 3px solid var(--bd);
  box-shadow: 4px 4px 0 var(--sh);
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.browser-top {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f1f1;
  border-bottom: 2px solid var(--bd);
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.browser-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.browser-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1.5px solid #111;
  display: inline-block;
  flex-shrink: 0;
}

.browser-dot.red { background: #ff5f56; }
.browser-dot.yellow { background: #ffbd2e; }
.browser-dot.green { background: #27c93f; }

.browser-address {
  font: 700 0.72rem var(--mono);
  color: #333;
  background: #fff;
  border: 1.5px solid #111;
  padding: 2px 8px;
  border-radius: 2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.browser-stat-highlight {
  display: flex;
  flex-direction: column;
  border-bottom: 2px dashed #ddd;
  padding-bottom: 10px;
}

.stat-number {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #111;
}

.stat-sub {
  font: 700 0.82rem var(--mono);
  color: #444;
  margin-top: 4px;
}

.browser-tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.b-badge {
  font: 700 0.72rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 1.5px solid #111;
  padding: 2px 7px;
  box-shadow: 1px 1px 0 #111;
}

.browser-note {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: #222;
}

.other-heading-row {
  margin-top: 10px;
  margin-bottom: -10px;
}

.other-section-tag {
  font: 700 0.85rem var(--mono);
  background: #111;
  color: #fff;
  padding: 3px 12px;
  display: inline-block;
}

/* ========================================= */
/* RESPONSIVE & MOBILE-FRIENDLY ADJUSTMENTS  */
/* ========================================= */
@media (max-width: 768px) {
  .spotlight-split {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 22px 18px;
    box-shadow: 5px 5px 0 var(--sh);
  }
}

@media (max-width: 480px) {
  .spotlight-split {
    padding: 18px 14px;
    gap: 18px;
    box-shadow: 4px 4px 0 var(--sh);
  }

  .spotlight-title {
    font-size: 1.65rem;
  }

  .spotlight-left .acts {
    gap: 8px;
  }

  .spotlight-left .acts a,
  .spotlight-left .acts button {
    flex: 1 1 calc(50% - 8px);
    text-align: center;
    justify-content: center;
  }

  .browser-body {
    padding: 14px;
    gap: 10px;
  }

  .browser-address {
    font-size: 0.66rem;
    padding: 1px 6px;
  }
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
