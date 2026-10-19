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

const isAvatarLoaded = ref(false)

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

const accentColors = ['green', 'yellow', 'pink', 'blue', 'orange'] as const
function getAccentColor(idx: number) {
  return accentColors[idx % accentColors.length]
}

const dateColors: ('blue' | 'pink' | 'green' | 'orange' | 'yellow')[] = [
  'blue',
  'pink',
  'green',
  'orange',
  'yellow'
]

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
    <!-- HERO SECTION -->
    <div class="grid grid-cols-[1.4fr_1fr] max-md:grid-cols-1 gap-6 pt-10 max-sm:pt-5 pb-6 items-stretch">
      <div class="box !bg-[var(--yellow)] !text-[#0b0b0f] !border-[#0b0b0f] p-[30px_30px_28px] max-md:p-[24px_20px] max-sm:p-[20px_18px] relative overflow-hidden flex flex-col justify-between">
        <div>
          <span class="inline-block font-mono font-bold text-[0.8rem] bg-[#0b0b0f] text-white rounded-[6px] px-2.5 py-[3px] mb-4">
            hello, I’m
          </span>
          <h1 class="m-0 font-extrabold tracking-[-0.05em] leading-[0.88] text-[clamp(3.4rem,10.5vw,7rem)] max-sm:text-[clamp(2.8rem,14vw,4rem)] [text-shadow:5px_5px_0_#fff] max-sm:[text-shadow:3px_3px_0_#fff] !text-[#0b0b0f]">
            {{ profile.name || 'TR Tajim' }}
          </h1>
          <p v-if="portfolioStore.isLoaded && profile.headline" class="mt-5 max-sm:mt-3.5 text-[1.2rem] max-sm:text-[1.05rem] font-semibold max-w-[32ch] !text-[#0b0b0f]">
            {{ profile.headline }}
          </p>
          <div v-else class="mt-5 max-sm:mt-3.5 flex flex-col gap-2.5 max-w-[32ch]" aria-hidden="true">
            <div class="skeleton-shimmer h-[22px] w-[95%] !bg-[#0b0b0f]/20"></div>
            <div class="skeleton-shimmer h-[22px] w-[65%] !bg-[#0b0b0f]/20"></div>
          </div>
        </div>
        <div class="absolute -right-[34px] -bottom-[34px] w-[120px] h-[120px] max-sm:w-[84px] max-sm:h-[84px] max-sm:-right-[26px] max-sm:-bottom-[26px] border-[3px] border-[#0b0b0f] rounded-full bg-[var(--pink)] pointer-events-none" aria-hidden="true"></div>
      </div>

      <div class="flex items-stretch w-full h-full min-h-0">
        <div class="box w-full h-full min-h-[280px] max-sm:min-h-[260px] max-xs:min-h-[240px] relative flex flex-col p-2 overflow-hidden" role="img" :aria-label="profile.name || 'TR Tajim'">
          <div class="w-full h-full flex-1 relative bg-[#e2e8f0] text-white grid place-items-center overflow-hidden border-2 border-[var(--bd)] rounded-[calc(var(--r)-4px)]">
            <!-- Light shimmer shown while store is loading OR image is still downloading -->
            <div
              v-show="!portfolioStore.isLoaded || (profile.avatar_url && !isAvatarLoaded)"
              class="skeleton-shimmer absolute inset-0 w-full h-full !bg-[#e2e8f0] !rounded-none z-10"
            ></div>
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.name || 'TR Tajim'"
              class="absolute inset-0 w-full h-full object-cover object-[center_65%] block transition-opacity duration-300"
              :class="isAvatarLoaded ? 'opacity-100' : 'opacity-0'"
              @load="isAvatarLoaded = true"
            />
            <span v-else-if="portfolioStore.isLoaded" class="font-extrabold text-[3.2rem] tracking-[-0.04em] select-none text-[#0b0b0f]">
              {{ (profile.name || 'TR Tajim').slice(0, 2).toUpperCase() }}
            </span>
          </div>

          <div class="absolute bottom-3.5 right-3.5 bg-[var(--pink)] text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] shadow-[3px_3px_0_var(--sh)] px-2.5 py-1 inline-flex items-center gap-1.5 -rotate-2 hover:rotate-0 hover:scale-[1.03] transition-transform z-10 select-none">
            <span aria-hidden="true">📍</span>
            <span class="font-mono font-bold text-[0.82rem] whitespace-nowrap">Rangpur, Bangladesh</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SOCIAL LINKS -->
    <ul v-if="!portfolioStore.isLoaded" class="flex flex-wrap gap-3.5 mt-1.5 max-sm:gap-2 mb-0 p-0 list-none" aria-hidden="true">
      <li v-for="n in 4" :key="n" class="max-sm:flex-1">
        <div class="skeleton-pill w-[90px] h-[44px]"></div>
      </li>
    </ul>
    <ul v-else-if="profile.social_links && profile.social_links.length" class="flex flex-wrap gap-3.5 mt-1.5 max-sm:gap-2 mb-0 p-0 list-none">
      <li v-for="(link, idx) in profile.social_links" :key="link.label" class="max-sm:flex-1">
        <BrutalButton
          as="a"
          :href="link.url"
          target="_blank"
          :variant="getSocialVariant(idx)"
          class="max-sm:w-full"
        >
          {{ link.label }}
        </BrutalButton>
      </li>
    </ul>

    <!-- WHO I AM -->
    <section id="about" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="sh">
        <h2>Who I am</h2>
      </div>

      <div class="box p-[26px_28px] max-sm:p-[18px]">
        <div v-if="!portfolioStore.isLoaded" class="space-y-3">
          <div class="skeleton-line w-[95%]"></div>
          <div class="skeleton-line w-[88%]"></div>
          <div class="skeleton-line w-[70%]"></div>
        </div>
        <template v-else>
          <p
            v-for="(p, i) in profile.whoami"
            :key="i"
            :class="['m-0 text-[1.15rem] max-sm:text-[1.02rem] leading-[1.7]', { 'mb-3.5': i < profile.whoami.length - 1 }]"
          >
            {{ p }}
          </p>
        </template>
      </div>
    </section>

    <!-- TECH STACK -->
    <section id="stack" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="sh">
        <h2>Tech stack</h2>
      </div>

      <div v-if="!portfolioStore.isLoaded" class="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div v-for="n in 6" :key="n" class="box p-5 flex flex-col gap-3">
          <div class="skeleton-line w-20 h-5"></div>
          <div class="flex flex-wrap gap-2">
            <div class="skeleton-pill w-14 h-6"></div>
            <div class="skeleton-pill w-16 h-6"></div>
            <div class="skeleton-pill w-20 h-6"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div
          v-for="(group, gIdx) in profile.grouped_stacks"
          :key="group.category"
          class="box p-[20px_22px] flex flex-col gap-3.5"
        >
          <span class="font-mono font-bold text-[0.82rem] tracking-[-0.01em] bg-[var(--ink)] text-[var(--paper)] rounded-[6px] px-2.5 py-[3px] self-start">
            {{ group.category }}
          </span>
          <ul class="flex flex-wrap gap-2 m-0 p-0 list-none" :aria-label="group.category + ' technologies'">
            <li
              v-for="(item, iIdx) in parseItems(group.items)"
              :key="item"
              :class="[
                'font-mono font-bold text-[0.82rem] text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] shadow-[2px_2px_0_var(--sh)] px-2.5 py-[3px]',
                getAccentColor(gIdx + iIdx) === 'green' && 'bg-[var(--green)]',
                getAccentColor(gIdx + iIdx) === 'yellow' && 'bg-[var(--yellow)]',
                getAccentColor(gIdx + iIdx) === 'pink' && 'bg-[var(--pink)]',
                getAccentColor(gIdx + iIdx) === 'blue' && 'bg-[var(--blue)] text-white border-2 border-[#0b0b0f]',
                getAccentColor(gIdx + iIdx) === 'orange' && 'bg-[var(--orange)]'
              ]"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- WHAT I BUILT -->
    <section id="projects" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="sh">
        <h2>What I built</h2>
      </div>

      <div v-if="!portfolioStore.isLoaded && portfolioStore.loading" class="grid grid-cols-2 max-md:grid-cols-1 gap-7">
        <div v-for="n in 3" :key="n" class="box p-6 space-y-3">
          <div class="skeleton-pill w-20 mb-4"></div>
          <div class="skeleton-line w-[60%] h-6"></div>
          <div class="skeleton-line w-[90%]"></div>
        </div>
      </div>

      <div v-else-if="featuredProjects.length === 0" class="box p-7 text-center font-mono font-bold">
        No projects found.
      </div>

      <div v-else class="flex flex-col gap-7">
        <!-- SPOTLIGHT / FLAGSHIP PROJECT -->
        <div
          v-if="spotlightProject"
          class="box !bg-[var(--green)] !text-[#0b0b0f] !border-[#0b0b0f] p-[38px_34px] max-md:p-[28px_22px] max-sm:p-[22px_16px] grid grid-cols-[1.2fr_1fr] max-md:grid-cols-1 gap-8 max-sm:gap-5 items-center rounded-[var(--r)]"
        >
          <div class="flex flex-col gap-4">
            <span class="font-mono font-bold text-[0.75rem] bg-[var(--yellow)] text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] shadow-[2px_2px_0_#0b0b0f] px-2.5 py-1 self-start">
              ★ FEATURED {{ spotlightProject.pill ? spotlightProject.pill.toUpperCase() : 'WEBSITE' }}
            </span>
            <h3 class="m-0 text-[clamp(1.85rem,4.5vw,2.5rem)] leading-[1.1] tracking-[-0.03em] font-extrabold !text-[#0b0b0f]">
              <router-link :to="`/projects/${spotlightProject.slug}`" class="no-underline !text-[#0b0b0f] hover:underline">
                {{ spotlightProject.title }}
              </router-link>
            </h3>
            <p class="m-0 text-[1.05rem] leading-[1.6] !text-[#0b0b0f]">
              {{ splitSummary(spotlightProject.summary).main }}
            </p>
            <div v-if="spotlightProject.actions?.length" class="flex flex-wrap gap-2.5 mt-2">
              <BrutalButton
                v-for="(action, index) in spotlightProject.actions"
                :key="action.label"
                as="a"
                :href="action.url"
                target="_blank"
                :variant="index === 0 ? 'white' : index === 1 ? 'yellow' : 'blue'"
                class="max-sm:flex-1 max-sm:text-center"
              >
                {{ action.label }} ↗
              </BrutalButton>
            </div>
          </div>

          <div class="w-full">
            <div class="bg-white text-[#0b0b0f] border-[3px] border-[#0b0b0f] rounded-[8px] shadow-[4px_4px_0_#0b0b0f] overflow-hidden">
              <div class="flex items-center gap-2 bg-[#f0eee6] border-b-2 border-[#0b0b0f] p-[8px_12px]">
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="w-[9px] h-[9px] rounded-full border-[1.5px] border-[#0b0b0f] bg-[#ff5f56] inline-block"></span>
                  <span class="w-[9px] h-[9px] rounded-full border-[1.5px] border-[#0b0b0f] bg-[#ffd400] inline-block"></span>
                  <span class="w-[9px] h-[9px] rounded-full border-[1.5px] border-[#0b0b0f] bg-[#22d18b] inline-block"></span>
                </div>
                <span class="font-mono font-bold text-[0.72rem] text-[#333] bg-white border-[1.5px] border-[#0b0b0f] rounded-[4px] px-2 py-0.5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ spotlightProject.actions?.[0]?.url || `https://${spotlightProject.slug}` }}
                </span>
              </div>
              <div class="p-[22px_22px] max-sm:p-4 flex flex-col gap-3.5">
                <div v-if="spotlightProject.top_metric" class="flex flex-col border-b-2 border-dashed border-[#ddd] pb-3">
                  <span class="text-[clamp(2.1rem,5vw,2.6rem)] font-extrabold leading-none tracking-[-0.03em] !text-[#0b0b0f]">
                    {{ parseMetric(spotlightProject.top_metric).value }}
                  </span>
                  <span v-if="parseMetric(spotlightProject.top_metric).label" class="font-mono font-bold text-[0.82rem] text-[#555] mt-1.5">
                    {{ parseMetric(spotlightProject.top_metric).label }}
                  </span>
                </div>
                <div v-if="spotlightProject.tags?.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in spotlightProject.tags"
                    :key="tag"
                    class="chip"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p v-if="splitSummary(spotlightProject.summary).note" class="m-0 text-[0.9rem] leading-[1.5] text-[#333]">
                  {{ splitSummary(spotlightProject.summary).note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- OTHER FEATURED PROJECTS -->
        <div v-if="otherProjects.length > 0" class="mt-2.5 -mb-2.5">
          <span class="font-mono font-bold text-[0.82rem] bg-[var(--ink)] text-[var(--bg)] rounded-[6px] px-3 py-[3px] inline-block">
            More Featured Work
          </span>
        </div>
        <div v-if="otherProjects.length > 0" class="grid grid-cols-2 max-md:grid-cols-1 gap-7 max-sm:gap-5.5">
          <ProjectCard
            v-for="(proj, idx) in otherProjects"
            :key="proj.slug"
            :project="proj"
            :color="projectCardColors[(idx + 1) % projectCardColors.length]"
          />
        </div>
      </div>

      <div class="mt-7 flex justify-center">
        <BrutalButton as="router-link" to="/projects" variant="blue" class="text-[1.02rem] px-6 py-2.5 max-sm:w-full">
          View all projects →
        </BrutalButton>
      </div>
    </section>

    <!-- WHAT I WRITE -->
    <section id="writing" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="sh">
        <h2>What I write</h2>
      </div>

      <div v-if="!portfolioStore.isLoaded" class="grid gap-4.5">
        <div v-for="n in 3" :key="n" class="box p-4 flex items-center gap-5">
          <div class="skeleton-line w-20 h-4"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton-line w-[65%] h-5"></div>
            <div class="skeleton-line w-[40%] h-3.5"></div>
          </div>
          <div class="skeleton-line w-6 h-5"></div>
        </div>
      </div>
      <div v-else-if="featuredPosts.length === 0" class="box p-7 text-center font-mono font-bold">
        No articles published yet.
      </div>
      <ul v-else class="grid gap-4.5 max-sm:gap-3.5 m-0 p-0 list-none">
        <li v-for="(post, idx) in featuredPosts" :key="post.slug">
          <PostCard :post="post" :color="dateColors[idx % dateColors.length]" />
        </li>
      </ul>

      <div v-if="featuredPosts.length > 0" class="mt-7 flex justify-center">
        <BrutalButton as="router-link" to="/writing" variant="blue" class="text-[1.02rem] px-6 py-2.5 max-sm:w-full">
          View all writing →
        </BrutalButton>
      </div>
    </section>

    <!-- MOTION & SHORTS -->
    <section v-if="activeShorts.length > 0" id="motion" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="sh">
        <h2>Motion & Shorts</h2>
      </div>
      <p class="-mt-3 mb-5 text-[1.05rem] opacity-85">
        Motion videos and teasers I design to showcase and promote products.
      </p>
      <div class="flex gap-5 overflow-x-auto py-2.5 px-1 pb-5 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
        <div
          v-for="(short, idx) in activeShorts"
          :key="short.id || short.title"
          class="snap-start flex-[0_0_240px] max-sm:flex-[0_0_200px]"
        >
          <ShortCard
            :short="short"
            :index="idx"
            @play="playShort"
          />
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" class="pt-14 max-sm:pt-9 pb-1.5">
      <div class="box p-[32px_30px] max-sm:p-[24px_18px] flex flex-col gap-4.5">
        <span class="font-mono font-bold text-[0.8rem] bg-[#0b0b0f] text-[var(--yellow)] border-2 border-[#0b0b0f] rounded-[6px] inline-block px-2.5 py-[3px] self-start shadow-[2px_2px_0_var(--sh)]">
          LET’S CONNECT
        </span>
        <h2 class="m-0 text-[clamp(1.5rem,4vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.02em]">
          Have an idea or want to talk tech?
        </h2>
        <p class="m-0 text-[1.05rem] leading-[1.55] opacity-85 max-w-[58ch]">
          Always down to chat about programming, new ideas, or interesting projects. Feel free to say hi anytime!
        </p>

        <div class="flex flex-wrap items-center max-sm:flex-col max-sm:items-stretch gap-3.5 mt-1.5">
          <BrutalButton
            as="a"
            :href="`mailto:${contactEmail}`"
            variant="yellow"
            class="text-[1.02rem] px-6 py-3 max-sm:w-full text-center"
          >
            Say Hello ✉️
          </BrutalButton>

          <button
            type="button"
            @click="copyEmail"
            :aria-label="isCopied ? 'Email address copied' : 'Copy email address'"
            class="inline-flex items-center gap-3 bg-[var(--paper)] text-[var(--ink)] border-[3px] border-[var(--bd)] rounded-[var(--r)] shadow-[4px_4px_0_var(--sh)] px-4 py-2 font-mono font-bold text-[0.95rem] cursor-pointer transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--sh)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none max-sm:w-full max-sm:justify-between"
          >
            <span class="truncate">{{ contactEmail }}</span>
            <span
              :class="[
                'font-mono font-bold text-[0.78rem] border-2 border-[var(--bd)] rounded-[6px] px-2 py-0.5 min-w-[65px] text-center transition-colors',
                isCopied ? 'bg-[var(--yellow)] text-[#0b0b0f]' : 'bg-[var(--green)] text-[#0b0b0f]'
              ]"
            >
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
