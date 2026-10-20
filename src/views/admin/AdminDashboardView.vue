<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import { uploadAsset } from '@/lib/supabase'
import type { Project, Post, Short, GroupedStack, SocialLink } from '@/types'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const router = useRouter()
const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()

const activeTab = ref<'profile' | 'projects' | 'posts' | 'shorts'>('profile')
const notification = ref<{ text: string; type: 'success' | 'error' } | null>(null)
const isSaving = ref(false)
const saveSuccess = ref(false)
const isUploading = ref(false)
const isReordering = ref(false)

// Drag and drop state
const draggedProjectIndex = ref<number | null>(null)
const dragOverProjectIndex = ref<number | null>(null)
const draggedPostIndex = ref<number | null>(null)
const dragOverPostIndex = ref<number | null>(null)

function notify(text: string, type: 'success' | 'error' = 'success') {
  notification.value = { text, type }
  if (type === 'success') {
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2500)
  }
  setTimeout(() => {
    notification.value = null
  }, 3500)
}

async function handleFileUpload(event: Event, targetType: 'avatar' | 'project' | 'post' | 'short') {
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Uploading assets is disabled.', 'error')
    ;(event.target as HTMLInputElement).value = ''
    return
  }

  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isUploading.value = true
  try {
    const url = await uploadAsset(file, targetType)
    if (targetType === 'avatar') {
      profileForm.value.avatar_url = url
    } else if (targetType === 'project' && editingProject.value) {
      editingProject.value.image_url = url
    } else if (targetType === 'post' && editingPost.value) {
      editingPost.value.image_url = url
    } else if (targetType === 'short' && editingShort.value) {
      editingShort.value.thumbnail_url = url
    }
    notify('Image uploaded successfully!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error uploading image', 'error')
  } finally {
    isUploading.value = false
    ;(event.target as HTMLInputElement).value = ''
  }
}

const profileForm = ref({
  name: portfolioStore.profile.name || '',
  email: portfolioStore.profile.email || '',
  headline: portfolioStore.profile.headline || '',
  whoamiRaw: portfolioStore.profile.whoami.join('\n\n'),
  avatar_url: portfolioStore.profile.avatar_url || '',
  grouped_stacks: JSON.parse(JSON.stringify(portfolioStore.profile.grouped_stacks)) as GroupedStack[],
  social_links: JSON.parse(JSON.stringify(portfolioStore.profile.social_links)) as SocialLink[]
})

watch(
  () => portfolioStore.profile,
  (newProf) => {
    if (newProf) {
      profileForm.value.name = newProf.name || ''
      profileForm.value.email = newProf.email || ''
      profileForm.value.headline = newProf.headline || ''
      profileForm.value.whoamiRaw = (newProf.whoami || []).join('\n\n')
      profileForm.value.avatar_url = newProf.avatar_url || ''
      profileForm.value.grouped_stacks = JSON.parse(JSON.stringify(newProf.grouped_stacks || []))
      profileForm.value.social_links = JSON.parse(JSON.stringify(newProf.social_links || []))
    }
  },
  { deep: true }
)

async function saveProfile() {
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: You are in view-only inspection mode. Changes cannot be saved.', 'error')
    return
  }
  isSaving.value = true
  try {
    const whoami = profileForm.value.whoamiRaw
      .split('\n\n')
      .map((s) => s.trim())
      .filter(Boolean)

    await portfolioStore.updateProfile({
      name: profileForm.value.name,
      email: profileForm.value.email.trim() || null,
      headline: profileForm.value.headline,
      whoami,
      avatar_url: profileForm.value.avatar_url || null,
      grouped_stacks: profileForm.value.grouped_stacks,
      social_links: profileForm.value.social_links
    })
    notify('Profile & Stacks updated successfully!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error updating profile', 'error')
  } finally {
    isSaving.value = false
  }
}

function addGroupedStack() {
  profileForm.value.grouped_stacks.push({ category: 'New Category', items: 'Tool 1, Tool 2' })
}

function removeGroupedStack(idx: number) {
  profileForm.value.grouped_stacks.splice(idx, 1)
}

function addSocialLink() {
  profileForm.value.social_links.push({ label: 'Platform', url: 'https://' })
}

function removeSocialLink(idx: number) {
  profileForm.value.social_links.splice(idx, 1)
}

const BN_MAP: Record<string, string> = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': '', 'ঁ': '', '্': ''
}

function slugify(text: string): string {
  if (!text) return ''
  let romanized = ''
  for (const ch of text) {
    romanized += BN_MAP[ch] !== undefined ? BN_MAP[ch] : ch
  }
  const cleaned = romanized
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return cleaned || `post-${Date.now().toString(36)}`
}

const editingProject = ref<Project | null>(null)
const projectTagsRaw = ref('')
const projectActions = ref<{ label: string; url: string }[]>([])

function openNewProject() {
  editingProject.value = {
    slug: '',
    title: '',
    summary: '',
    pill: 'Web',
    top_metric: '',
    tags: [],
    actions: [],
    content: '',
    image_url: null,
    is_featured: false,
    is_published: true,
    order_index: portfolioStore.projects.length
  }
  projectTagsRaw.value = ''
  projectActions.value = [{ label: 'Visit site', url: 'https://' }]
}

function editProject(project: Project) {
  editingProject.value = JSON.parse(JSON.stringify(project))
  projectTagsRaw.value = project.tags ? project.tags.join(', ') : ''
  projectActions.value = project.actions ? JSON.parse(JSON.stringify(project.actions)) : []
}

function addProjectAction() {
  if (projectActions.value.length < 3) {
    projectActions.value.push({ label: 'Link', url: 'https://' })
  }
}

function removeProjectAction(idx: number) {
  projectActions.value.splice(idx, 1)
}

function syncProjectSlug() {
  if (!editingProject.value) return
  if (!editingProject.value.slug && editingProject.value.title) {
    editingProject.value.slug = slugify(editingProject.value.title)
  } else if (editingProject.value.slug) {
    editingProject.value.slug = slugify(editingProject.value.slug)
  }
}

async function saveCurrentProject() {
  if (!editingProject.value) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: You are in view-only inspection mode. Changes cannot be saved.', 'error')
    return
  }
  isSaving.value = true
  try {
    const tags = projectTagsRaw.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (!editingProject.value.slug) {
      editingProject.value.slug = slugify(editingProject.value.title)
    } else {
      editingProject.value.slug = slugify(editingProject.value.slug)
    }

    await portfolioStore.saveProject({
      ...editingProject.value,
      tags,
      actions: projectActions.value.filter((a) => a.label && a.url)
    })
    editingProject.value = null
    notify('Project saved successfully!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error saving project', 'error')
  } finally {
    isSaving.value = false
  }
}

async function deleteProject(id?: string) {
  if (!id) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Deletion is disabled in view-only mode.', 'error')
    return
  }
  if (!confirm('Are you sure you want to delete this project?')) return
  try {
    await portfolioStore.deleteProject(id)
    notify('Project deleted.')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error deleting project', 'error')
  }
}

const renderedProjectPreview = computed(() => {
  if (!editingProject.value?.content) return ''
  return marked.parse(editingProject.value.content)
})

const visibleProjects = computed(() => {
  if (authStore.canEdit) {
    return portfolioStore.projects
  }
  return portfolioStore.projects.filter((p) => p.is_published)
})

async function applyProjectOrder(newOrderList: Project[]) {
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Reordering is disabled in view-only mode.', 'error')
    return
  }
  isReordering.value = true
  try {
    const payload = newOrderList.map((p, index) => ({
      id: p.id!,
      order_index: index + 1
    }))
    await portfolioStore.reorderProjects(payload)
    notify('Project order updated and saved!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error reordering projects', 'error')
  } finally {
    isReordering.value = false
  }
}

async function moveProject(index: number, direction: 'up' | 'down') {
  const list = [...visibleProjects.value]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= list.length) return
  const [moved] = list.splice(index, 1)
  if (!moved) return
  list.splice(targetIndex, 0, moved)
  await applyProjectOrder(list)
}

function handleProjectDragStart(index: number) {
  draggedProjectIndex.value = index
}

function handleProjectDragOver(index: number) {
  dragOverProjectIndex.value = index
}

async function handleProjectDrop(index: number) {
  if (draggedProjectIndex.value === null || draggedProjectIndex.value === index) {
    draggedProjectIndex.value = null
    dragOverProjectIndex.value = null
    return
  }
  const list = [...visibleProjects.value]
  const [moved] = list.splice(draggedProjectIndex.value, 1)
  if (moved) {
    list.splice(index, 0, moved)
    draggedProjectIndex.value = null
    dragOverProjectIndex.value = null
    await applyProjectOrder(list)
  }
}

const visiblePosts = computed(() => {
  if (authStore.canEdit) {
    return portfolioStore.posts
  }
  return portfolioStore.posts.filter((p) => p.is_published)
})

async function applyPostOrder(newOrderList: Post[]) {
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Reordering is disabled in view-only mode.', 'error')
    return
  }
  isReordering.value = true
  try {
    const payload = newOrderList.map((p, index) => ({
      id: p.id!,
      order_index: index + 1
    }))
    await portfolioStore.reorderPosts(payload)
    notify('Article order updated and saved!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error reordering articles', 'error')
  } finally {
    isReordering.value = false
  }
}

async function movePost(index: number, direction: 'up' | 'down') {
  const list = [...visiblePosts.value]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= list.length) return
  const [moved] = list.splice(index, 1)
  if (!moved) return
  list.splice(targetIndex, 0, moved)
  await applyPostOrder(list)
}

function handlePostDragStart(index: number) {
  draggedPostIndex.value = index
}

function handlePostDragOver(index: number) {
  dragOverPostIndex.value = index
}

async function handlePostDrop(index: number) {
  if (draggedPostIndex.value === null || draggedPostIndex.value === index) {
    draggedPostIndex.value = null
    dragOverPostIndex.value = null
    return
  }
  const list = [...visiblePosts.value]
  const [moved] = list.splice(draggedPostIndex.value, 1)
  if (moved) {
    list.splice(index, 0, moved)
    draggedPostIndex.value = null
    dragOverPostIndex.value = null
    await applyPostOrder(list)
  }
}

const editingPost = ref<Post | null>(null)
const postTagsRaw = ref('')

const renderedPostPreview = computed(() => {
  if (!editingPost.value?.content) return ''
  return marked.parse(editingPost.value.content)
})

function openNewPost() {
  editingPost.value = {
    slug: '',
    title: '',
    subtitle: '',
    content: '# New Article\n\nWrite your thoughts here...',
    tags: [],
    image_url: null,
    is_featured: false,
    is_published: true,
    published_date: new Date().toISOString().split('T')[0] || ''
  }
  postTagsRaw.value = ''
}

function editPost(post: Post) {
  editingPost.value = JSON.parse(JSON.stringify(post))
  postTagsRaw.value = post.tags ? post.tags.join(', ') : ''
}

function syncPostSlug() {
  if (!editingPost.value) return
  if (!editingPost.value.slug && editingPost.value.title) {
    editingPost.value.slug = slugify(editingPost.value.title)
  } else if (editingPost.value.slug) {
    editingPost.value.slug = slugify(editingPost.value.slug)
  }
}

async function saveCurrentPost() {
  if (!editingPost.value) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: You are in view-only inspection mode. Changes cannot be saved.', 'error')
    return
  }
  isSaving.value = true
  try {
    const tags = postTagsRaw.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (!editingPost.value.slug) {
      editingPost.value.slug = slugify(editingPost.value.title)
    } else {
      editingPost.value.slug = slugify(editingPost.value.slug)
    }

    await portfolioStore.savePost({
      ...editingPost.value,
      tags
    })
    editingPost.value = null
    notify('Article saved successfully!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error saving post', 'error')
  } finally {
    isSaving.value = false
  }
}

async function deletePost(id?: string) {
  if (!id) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Deletion is disabled in view-only mode.', 'error')
    return
  }
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    await portfolioStore.deletePost(id)
    notify('Post deleted.')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error deleting post', 'error')
  }
}

// SHORTS MANAGEMENT
const editingShort = ref<Short | null>(null)

const visibleShorts = computed(() => {
  if (authStore.isGuest) {
    return portfolioStore.shorts.filter((s) => s.is_published)
  }
  return portfolioStore.shorts
})

function openNewShort() {
  editingShort.value = {
    title: '',
    platform: 'youtube',
    video_url: '',
    thumbnail_url: null,
    is_published: true,
    order_index: portfolioStore.shorts.length
  }
}

function editShort(short: Short) {
  editingShort.value = JSON.parse(JSON.stringify(short))
}

async function saveCurrentShort() {
  if (!editingShort.value) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: You are in view-only inspection mode. Changes cannot be saved.', 'error')
    return
  }
  isSaving.value = true
  try {
    await portfolioStore.saveShort(editingShort.value)
    editingShort.value = null
    notify('Motion short saved successfully!')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error saving motion short', 'error')
  } finally {
    isSaving.value = false
  }
}

async function deleteShort(id?: string) {
  if (!id) return
  if (!authStore.canEdit) {
    notify('Guest Demo Mode: Deletion is disabled in view-only mode.', 'error')
    return
  }
  if (!confirm('Are you sure you want to delete this video?')) return
  try {
    await portfolioStore.deleteShort(id)
    notify('Motion short deleted.')
  } catch (err: unknown) {
    notify(err instanceof Error ? err.message : 'Error deleting motion short', 'error')
  }
}

async function handleLogout() {
  await authStore.signOut()
  router.push('/')
}
</script>

<template>
  <div class="c admin-container">
    <header class="admin-top">
      <div>
        <span class="h">ADMIN DASHBOARD</span>
        <p class="tagline">Manage site copy, projects, tech stacks, and articles.</p>
      </div>
      <div class="top-actions">
        <BrutalButton as="button" variant="white" @click="handleLogout">
          Log Out
        </BrutalButton>
      </div>
    </header>

    <div v-if="authStore.isGuest" class="demo-banner box">
      <div class="demo-badge">GUEST DEMO MODE</div>
      <p>
        You are inspecting the admin studio as a visitor with <strong>view-only</strong> permissions. 
        You can test navigation, explore forms, and preview the Markdown editor. Saving, deleting, and uploads are disabled.
      </p>
    </div>

    <div v-if="notification" :class="['notif', notification.type]">
      {{ notification.text }}
    </div>

    <nav class="admin-tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'profile' }]"
        @click="activeTab = 'profile'"
      >
        Profile & Stacks
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'projects' }]"
        @click="activeTab = 'projects'"
      >
        Projects ({{ portfolioStore.projects.length }})
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'posts' }]"
        @click="activeTab = 'posts'"
      >
        Writing ({{ portfolioStore.posts.length }})
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'shorts' }]"
        @click="activeTab = 'shorts'"
      >
        Motion Shorts ({{ portfolioStore.shorts.length }})
      </button>
    </nav>

    <!-- TAB 1: PROFILE & TECH STACKS -->
    <section v-if="activeTab === 'profile'" class="tab-pane">
      <form @submit.prevent="saveProfile" class="card box admin-form">
        <h3 class="pane-title">Hero & WhoAmI Content</h3>

        <div class="grid-2">
          <div class="field">
            <label>Name</label>
            <input v-model="profileForm.name" type="text" class="input-box" required />
          </div>

          <div class="field">
            <label>Contact Email (Dynamic, displayed in Get in Touch)</label>
            <input v-model="profileForm.email" type="email" class="input-box" placeholder="com.tajim@gmail.com" required />
          </div>
        </div>

        <div class="field">
          <label>Avatar Image</label>
          <div class="upload-row">
            <input v-model="profileForm.avatar_url" type="text" class="input-box" placeholder="https://..." style="flex: 1" />
            <label class="btn white upload-btn">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
              <input type="file" accept="image/*" class="file-hidden" @change="handleFileUpload($event, 'avatar')" />
            </label>
          </div>
          <div v-if="profileForm.avatar_url" class="img-preview-mini">
            <img :src="profileForm.avatar_url" alt="Avatar preview" />
          </div>
        </div>

        <div class="field">
          <label>Headline Tagline</label>
          <input v-model="profileForm.headline" type="text" class="input-box" required />
        </div>

        <div class="field">
          <label>Who I am Bio</label>
          <textarea v-model="profileForm.whoamiRaw" rows="4" class="input-box"></textarea>
        </div>

        <hr class="divider" />

        <div class="stack-header">
          <h3 class="pane-title" style="margin: 0">Tech Stack</h3>
          <BrutalButton as="button" variant="mint" type="button" @click="addGroupedStack">
            + Add Category
          </BrutalButton>
        </div>

        <div class="kv-list">
          <div
            v-for="(stack, idx) in profileForm.grouped_stacks"
            :key="idx"
            class="kv-item box"
          >
            <div class="field" style="flex: 0 0 160px">
              <label>Category</label>
              <input v-model="stack.category" type="text" class="input-box" placeholder="Category" required />
            </div>
            <div class="field" style="flex: 1">
              <label>Technologies</label>
              <input v-model="stack.items" type="text" class="input-box" placeholder="Item 1, Item 2" required />
            </div>
            <BrutalButton
              as="button"
              variant="pink"
              type="button"
              style="align-self: flex-end"
              @click="removeGroupedStack(idx)"
            >
              Remove
            </BrutalButton>
          </div>
        </div>

        <hr class="divider" />

        <div class="stack-header">
          <h3 class="pane-title" style="margin: 0">Social Links</h3>
          <BrutalButton as="button" variant="mint" type="button" @click="addSocialLink">
            + Add Social Link
          </BrutalButton>
        </div>

        <div class="kv-list">
          <div
            v-for="(link, idx) in profileForm.social_links"
            :key="idx"
            class="kv-item box"
          >
            <div class="field" style="flex: 0 0 160px">
              <label>Label</label>
              <input v-model="link.label" type="text" class="input-box" placeholder="e.g. GitHub" required />
            </div>
            <div class="field" style="flex: 1">
              <label>URL</label>
              <input v-model="link.url" type="text" class="input-box" placeholder="https://..." required />
            </div>
            <BrutalButton
              as="button"
              variant="pink"
              type="button"
              style="align-self: flex-end"
              @click="removeSocialLink(idx)"
            >
              Remove
            </BrutalButton>
          </div>
        </div>

        <div class="action-footer">
          <BrutalButton type="submit" variant="yellow" :disabled="isSaving" style="font-size: 1.1rem; padding: 10px 24px">
            {{ isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✓' : 'Save Profile Changes' }}
          </BrutalButton>
        </div>
      </form>
    </section>

    <!-- TAB 2: PROJECTS -->
    <section v-if="activeTab === 'projects'" class="tab-pane">
      <div v-if="!editingProject">
        <div class="pane-bar">
          <h3 class="pane-title">All Projects</h3>
          <BrutalButton as="button" variant="mint" @click="openNewProject">
            + Create New Project
          </BrutalButton>
        </div>

        <div class="list-grid">
          <div
            v-for="(proj, pIdx) in visibleProjects"
            :key="proj.id || proj.slug"
            :class="['card box proj-row', {
              'is-dragging': draggedProjectIndex === pIdx,
              'drag-over': dragOverProjectIndex === pIdx
            }]"
            draggable="true"
            @dragstart="handleProjectDragStart(pIdx)"
            @dragover.prevent="handleProjectDragOver(pIdx)"
            @dragleave="dragOverProjectIndex = null"
            @drop="handleProjectDrop(pIdx)"
          >
            <div class="drag-handle-wrap" title="Drag to reorder">
              <span class="drag-handle">⋮⋮</span>
              <div class="order-arrows">
                <button
                  type="button"
                  class="arrow-btn"
                  :disabled="pIdx === 0 || isReordering"
                  title="Move up"
                  @click="moveProject(pIdx, 'up')"
                >
                  ▲
                </button>
                <button
                  type="button"
                  class="arrow-btn"
                  :disabled="pIdx === visibleProjects.length - 1 || isReordering"
                  title="Move down"
                  @click="moveProject(pIdx, 'down')"
                >
                  ▼
                </button>
              </div>
            </div>

            <div class="info">
              <div class="meta-row">
                <span class="st-pill">{{ proj.pill }}</span>
                <span v-if="proj.order_index !== undefined" class="order-pill">#{{ proj.order_index }}</span>
                <span v-if="proj.top_metric" class="badge-pill">{{ proj.top_metric }}</span>
                <span v-if="proj.is_featured" class="featured-badge">Featured on Home</span>
              </div>
              <h4 class="title">{{ proj.title }}</h4>
              <p class="summary-text">{{ proj.summary }}</p>
            </div>

            <div class="row-actions">
              <BrutalButton as="button" variant="yellow" @click="editProject(proj)">
                Edit
              </BrutalButton>
              <BrutalButton as="button" variant="pink" @click="deleteProject(proj.id)">
                Delete
              </BrutalButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Edit Form Modal/Pane -->
      <form v-else @submit.prevent="saveCurrentProject" class="card box admin-form">
        <div class="pane-bar">
          <h3 class="pane-title">{{ editingProject.id ? 'Edit Project' : 'New Project' }}</h3>
          <BrutalButton as="button" variant="white" type="button" @click="editingProject = null">
            Cancel
          </BrutalButton>
        </div>

        <div class="field">
          <label>Title</label>
          <input
            v-model="editingProject.title"
            type="text"
            class="input-box"
            required
            @blur="syncProjectSlug"
          />
        </div>

        <div class="field">
          <label>Slug (URL key)</label>
          <input
            v-model="editingProject.slug"
            type="text"
            class="input-box"
            :placeholder="editingProject.title ? slugify(editingProject.title) : 'e.g. my-project'"
            @blur="syncProjectSlug"
          />
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Category Pill</label>
            <input v-model="editingProject.pill" type="text" class="input-box" required />
          </div>

          <div class="field">
            <label>Highlight Metric</label>
            <input v-model="editingProject.top_metric" type="text" class="input-box" placeholder="Optional" />
          </div>
        </div>

        <div class="field">
          <label>Summary</label>
          <textarea v-model="editingProject.summary" rows="2" class="input-box" required></textarea>
        </div>

        <div class="field">
          <label>Tags</label>
          <input v-model="projectTagsRaw" type="text" class="input-box" />
        </div>

        <div class="field">
          <label>Cover Image</label>
          <div class="upload-row">
            <input v-model="editingProject.image_url" type="text" class="input-box" placeholder="https://..." style="flex: 1" />
            <label class="btn white upload-btn">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
              <input type="file" accept="image/*" class="file-hidden" @change="handleFileUpload($event, 'project')" />
            </label>
          </div>
          <div v-if="editingProject.image_url" class="img-preview-mini">
            <img :src="editingProject.image_url" alt="Project image preview" />
          </div>
        </div>

        <div class="stack-header">
          <h4 style="margin: 0; font-family: var(--mono)">Action Links (Up to 3)</h4>
          <BrutalButton
            v-if="projectActions.length < 3"
            as="button"
            variant="mint"
            type="button"
            @click="addProjectAction"
          >
            + Add Link
          </BrutalButton>
        </div>

        <div class="kv-list">
          <div v-for="(act, idx) in projectActions" :key="idx" class="kv-item box">
            <div class="field" style="flex: 0 0 160px">
              <label>Label</label>
              <input v-model="act.label" type="text" class="input-box" placeholder="e.g. Visit site" required />
            </div>
            <div class="field" style="flex: 1">
              <label>URL</label>
              <input v-model="act.url" type="text" class="input-box" placeholder="https://..." required />
            </div>
            <BrutalButton
              as="button"
              variant="pink"
              type="button"
              style="align-self: flex-end"
              @click="removeProjectAction(idx)"
            >
              Remove
            </BrutalButton>
          </div>
        </div>

        <div class="field">
          <label>Markdown Deep-Dive Content</label>
          <div class="editor-split">
            <textarea
              v-model="editingProject.content"
              rows="10"
              class="input-box editor-area"
              placeholder="# Detailed case study..."
            ></textarea>
            <div class="preview-area box markdown-body" v-html="renderedProjectPreview"></div>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Display Order</label>
            <input v-model.number="editingProject.order_index" type="number" class="input-box" placeholder="0" />
          </div>

          <div class="checkbox-row" style="align-self: center">
            <label class="check-label">
              <input v-model="editingProject.is_featured" type="checkbox" />
              <span>Feature on Home page</span>
            </label>
            <label class="check-label">
              <input v-model="editingProject.is_published" type="checkbox" />
              <span>Published</span>
            </label>
          </div>
        </div>

        <div class="action-footer">
          <BrutalButton type="submit" variant="yellow" :disabled="isSaving" style="font-size: 1.1rem; padding: 10px 24px">
            {{ isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✓' : 'Save Project' }}
          </BrutalButton>
        </div>
      </form>
    </section>

    <!-- TAB 3: POSTS / WRITING -->
    <section v-if="activeTab === 'posts'" class="tab-pane">
      <div v-if="!editingPost">
        <div class="pane-bar">
          <h3 class="pane-title">All Articles</h3>
          <BrutalButton as="button" variant="mint" @click="openNewPost">
            + Write New Article
          </BrutalButton>
        </div>

        <div class="list-grid">
          <div
            v-for="(post, postIdx) in visiblePosts"
            :key="post.id || post.slug"
            :class="['card box proj-row', {
              'is-dragging': draggedPostIndex === postIdx,
              'drag-over': dragOverPostIndex === postIdx
            }]"
            draggable="true"
            @dragstart="handlePostDragStart(postIdx)"
            @dragover.prevent="handlePostDragOver(postIdx)"
            @dragleave="dragOverPostIndex = null"
            @drop="handlePostDrop(postIdx)"
          >
            <div class="drag-handle-wrap" title="Drag to reorder">
              <span class="drag-handle">⋮⋮</span>
              <div class="order-arrows">
                <button
                  type="button"
                  class="arrow-btn"
                  :disabled="postIdx === 0 || isReordering"
                  title="Move up"
                  @click="movePost(postIdx, 'up')"
                >
                  ▲
                </button>
                <button
                  type="button"
                  class="arrow-btn"
                  :disabled="postIdx === visiblePosts.length - 1 || isReordering"
                  title="Move down"
                  @click="movePost(postIdx, 'down')"
                >
                  ▼
                </button>
              </div>
            </div>

            <div class="info">
              <div class="meta-row">
                <span v-if="post.order_index !== undefined" class="order-pill">#{{ post.order_index }}</span>
                <time class="time-tag">{{ post.published_date }}</time>
                <span v-if="post.is_featured" class="featured-badge">Featured on Home</span>
              </div>
              <h4 class="title">{{ post.title }}</h4>
              <p v-if="post.subtitle" class="summary-text">{{ post.subtitle }}</p>
            </div>

            <div class="row-actions">
              <BrutalButton as="button" variant="yellow" @click="editPost(post)">
                Edit
              </BrutalButton>
              <BrutalButton as="button" variant="pink" @click="deletePost(post.id)">
                Delete
              </BrutalButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Edit Form -->
      <form v-else @submit.prevent="saveCurrentPost" class="card box admin-form">
        <div class="pane-bar">
          <h3 class="pane-title">{{ editingPost.id ? 'Edit Article' : 'New Article' }}</h3>
          <BrutalButton as="button" variant="white" type="button" @click="editingPost = null">
            Cancel
          </BrutalButton>
        </div>

        <div class="field">
          <label>Title</label>
          <input
            v-model="editingPost.title"
            type="text"
            class="input-box"
            required
            @blur="syncPostSlug"
          />
        </div>

        <div class="field">
          <label>Slug (URL key)</label>
          <input
            v-model="editingPost.slug"
            type="text"
            class="input-box"
            :placeholder="editingPost.title ? slugify(editingPost.title) : 'e.g. my-awesome-post'"
            @blur="syncPostSlug"
          />
        </div>

        <div class="field">
          <label>Subtitle / One-line Hook</label>
          <input v-model="editingPost.subtitle" type="text" class="input-box" />
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Tags</label>
            <input v-model="postTagsRaw" type="text" class="input-box" />
          </div>

          <div class="field">
            <label>Cover Image</label>
            <div class="upload-row">
              <input v-model="editingPost.image_url" type="text" class="input-box" placeholder="https://..." style="flex: 1" />
              <label class="btn white upload-btn">
                {{ isUploading ? 'Uploading...' : 'Upload' }}
                <input type="file" accept="image/*" class="file-hidden" @change="handleFileUpload($event, 'post')" />
              </label>
            </div>
            <div v-if="editingPost.image_url" class="img-preview-mini">
              <img :src="editingPost.image_url" alt="Article image preview" />
            </div>
          </div>
        </div>

        <div class="field">
          <label>Markdown Content</label>
          <div class="editor-split">
            <textarea
              v-model="editingPost.content"
              rows="12"
              class="input-box editor-area"
              placeholder="# Write your article..."
            ></textarea>
            <div class="preview-area box markdown-body" v-html="renderedPostPreview"></div>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Display Order</label>
            <input v-model.number="editingPost.order_index" type="number" class="input-box" placeholder="0" />
          </div>

          <div class="checkbox-row" style="align-self: center">
            <label class="check-label">
              <input v-model="editingPost.is_featured" type="checkbox" />
              <span>Feature on Home page</span>
            </label>
            <label class="check-label">
              <input v-model="editingPost.is_published" type="checkbox" />
              <span>Published</span>
            </label>
          </div>
        </div>

        <div class="action-footer">
          <BrutalButton type="submit" variant="yellow" :disabled="isSaving" style="font-size: 1.1rem; padding: 10px 24px">
            {{ isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✓' : 'Save Article' }}
          </BrutalButton>
        </div>
      </form>
    </section>

    <!-- TAB 4: SHORTS / MOTION VIDEOS -->
    <section v-if="activeTab === 'shorts'" class="tab-pane">
      <div v-if="!editingShort">
        <div class="pane-bar">
          <h3 class="pane-title">All Motion Shorts</h3>
          <BrutalButton as="button" variant="mint" @click="openNewShort">
            + Add New Short
          </BrutalButton>
        </div>

        <div class="list-grid">
          <div
            v-for="s in visibleShorts"
            :key="s.id || s.title"
            class="card box proj-row"
          >
            <div class="info">
              <div class="meta-row">
                <span class="st-pill">{{ s.platform.toUpperCase() }}</span>
                <span v-if="!s.is_published" class="featured-badge" style="background: var(--yellow)">Draft</span>
              </div>
              <h4 class="title">{{ s.title }}</h4>
              <p class="summary-text" style="word-break: break-all">{{ s.video_url }}</p>
            </div>

            <div class="row-actions">
              <BrutalButton as="button" variant="yellow" @click="editShort(s)">
                Edit
              </BrutalButton>
              <BrutalButton as="button" variant="pink" @click="deleteShort(s.id)">
                Delete
              </BrutalButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Short Edit Form -->
      <form v-else @submit.prevent="saveCurrentShort" class="card box admin-form">
        <div class="pane-bar">
          <h3 class="pane-title">{{ editingShort.id ? 'Edit Motion Short' : 'Add Motion Short' }}</h3>
          <BrutalButton as="button" variant="white" type="button" @click="editingShort = null">
            Cancel
          </BrutalButton>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Video Title</label>
            <input v-model="editingShort.title" type="text" class="input-box" required placeholder="e.g. SaaS UI Motion Teaser" />
          </div>

          <div class="field">
            <label>Platform</label>
            <select v-model="editingShort.platform" class="input-box" required>
              <option value="youtube">YouTube (Short / Video)</option>
              <option value="facebook">Facebook (Reel / Video)</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>Video URL</label>
          <input v-model="editingShort.video_url" type="url" class="input-box" required placeholder="https://www.youtube.com/shorts/... or https://www.facebook.com/..." />
        </div>

        <div class="field">
          <label>Custom Thumbnail</label>
          <div class="upload-row">
            <input v-model="editingShort.thumbnail_url" type="text" class="input-box" placeholder="https://..." style="flex: 1" />
            <label class="btn white upload-btn">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
              <input type="file" accept="image/*" class="file-hidden" @change="handleFileUpload($event, 'short')" />
            </label>
          </div>
          <div v-if="editingShort.thumbnail_url" class="img-preview-mini">
            <img :src="editingShort.thumbnail_url" alt="Thumbnail preview" />
          </div>
        </div>

        <div class="checkbox-row">
          <label class="check-label">
            <input v-model="editingShort.is_published" type="checkbox" />
            <span>Published</span>
          </label>
        </div>

        <div class="action-footer">
          <BrutalButton type="submit" variant="yellow" :disabled="isSaving" style="font-size: 1.1rem; padding: 10px 24px">
            {{ isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✓' : 'Save Motion Short' }}
          </BrutalButton>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.admin-container {
  padding-top: 30px;
  padding-bottom: 60px;
}

.admin-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.tagline {
  margin: 6px 0 0;
  font-size: 1rem;
}

.notif {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  border: 3px solid var(--bd);
  padding: 14px 22px;
  font-weight: 700;
  font-family: var(--mono);
  box-shadow: 6px 6px 0 var(--sh);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 420px;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notif.success {
  background: var(--mint);
  color: #111;
}

.notif.error {
  background: var(--pink);
  color: #111;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  font-family: var(--mono);
  font-size: 0.95rem;
  font-weight: 700;
  border: 3px solid var(--bd);
  border-radius: 6px;
  background: var(--paper);
  color: var(--ink);
  padding: 8px 18px;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--sh);
  transition: transform 0.12s, box-shadow 0.12s;
}

.tab-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 var(--sh);
}

.tab-btn.active {
  background: var(--yellow);
  color: #0b0b0f;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--sh);
}

.pane-title {
  margin: 0 0 16px;
  font-size: 1.3rem;
  font-family: var(--sans);
  font-weight: 700;
}

.pane-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 24px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.85rem;
}

.input-box {
  font-family: var(--sans);
  font-size: 0.95rem;
  padding: 9px 12px;
  border: 2px solid var(--bd);
  border-radius: 6px;
  background: var(--paper);
  color: var(--ink);
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.input-box:focus {
  border-color: var(--blue);
}

.divider {
  border: 0;
  border-top: 2px dashed var(--bd);
  margin: 10px 0;
}

.stack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kv-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kv-item {
  display: flex;
  gap: 12px;
  background: var(--bg);
  padding: 14px;
  border: 2px solid var(--bd);
  border-radius: 6px;
  align-items: flex-start;
}

.list-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.proj-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: var(--r);
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.proj-row.is-dragging {
  opacity: 0.4;
  border-style: dashed;
}

.proj-row.drag-over {
  border-color: var(--blue);
  background-color: rgba(94, 189, 255, 0.15);
  transform: translateY(-2px);
}

.drag-handle-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.drag-handle {
  cursor: grab;
  font-size: 1.25rem;
  letter-spacing: -2px;
  color: var(--ink);
  opacity: 0.5;
  padding: 4px 6px;
  transition: opacity 0.15s;
}

.drag-handle:hover {
  opacity: 1;
}

.order-arrows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.arrow-btn {
  background: var(--paper);
  border: 1.5px solid var(--bd);
  color: var(--ink);
  font-size: 0.6rem;
  line-height: 1;
  padding: 3px 5px;
  cursor: pointer;
  transition: background 0.1s, transform 0.1s;
}

.arrow-btn:hover:not(:disabled) {
  background: var(--yellow);
  transform: scale(1.1);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.meta-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.st-pill {
  font: 700 0.75rem var(--mono);
  background: #111;
  color: #fff;
  padding: 2px 8px;
}

.order-pill {
  font: 700 0.75rem var(--mono);
  background: var(--blue);
  color: #111;
  border: 2px solid #111;
  padding: 1px 8px;
}

.badge-pill {
  font: 700 0.75rem var(--mono);
  background: var(--yellow);
  color: #111;
  border: 2px solid #111;
  padding: 1px 8px;
}

.featured-badge {
  font: 700 0.75rem var(--mono);
  background: var(--pink);
  color: #111;
  padding: 2px 8px;
}

.time-tag {
  font: 700 0.8rem var(--mono);
}

.title {
  margin: 0;
  font-size: 1.25rem;
}

.summary-text {
  margin: 4px 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.row-actions {
  display: flex;
  gap: 10px;
}

.checkbox-row {
  display: flex;
  gap: 24px;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
}

.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.preview-area {
  padding: 16px;
  background: var(--paper);
  min-height: 250px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 6px;
  border: 2px solid var(--bd);
}

.action-footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.upload-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.upload-btn {
  position: relative;
  overflow: hidden;
  font-size: 0.85rem;
  padding: 6px 14px;
  white-space: nowrap;
}

.file-hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.img-preview-mini {
  margin-top: 8px;
  width: 90px;
  height: 90px;
  border: 2px solid var(--bd);
  border-radius: 6px;
  overflow: hidden;
  background: #111;
}

.img-preview-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.demo-banner {
  background: var(--yellow);
  color: #0b0b0f;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-radius: var(--r);
}

.demo-badge {
  display: inline-block;
  background: #0b0b0f;
  color: #fff;
  font: 700 0.8rem var(--mono);
  padding: 2px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.demo-banner p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .admin-top {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  .top-actions {
    display: flex;
    justify-content: flex-start;
  }
  .grid-2,
  .editor-split {
    grid-template-columns: 1fr;
  }
  .proj-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .row-actions {
    width: 100%;
    margin-top: 8px;
  }
  .row-actions :deep(.btn) {
    flex: 1 1 auto;
  }
  .kv-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .kv-item .field {
    flex: 1 1 auto !important;
  }
  .kv-item :deep(.btn) {
    align-self: flex-start !important;
  }
  .pane-bar,
  .stack-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .checkbox-row {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 540px) {
  .admin-container {
    padding-top: 20px;
    padding-bottom: 40px;
  }
  .admin-tabs {
    flex-direction: column;
    gap: 8px;
  }
  .tab-btn {
    width: 100%;
    text-align: center;
  }
  .admin-form {
    padding: 16px;
  }
  .input-box {
    font-size: 16px; /* Prevents auto-zoom on iOS */
    width: 100%;
    box-sizing: border-box;
  }
  .action-footer {
    justify-content: stretch;
  }
  .action-footer :deep(.btn) {
    width: 100%;
  }
  .upload-row {
    flex-wrap: wrap;
  }
}
</style>
