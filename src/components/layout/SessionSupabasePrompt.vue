<script setup lang="ts">
import { ref } from 'vue'
import { isSupabaseConfigured, setSessionSupabaseCredentials } from '@/lib/supabase'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'

const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()

const isOpen = ref(false)
const isDismissed = ref(false)
const supabaseUrl = ref('')
const supabaseKey = ref('')
const errorMsg = ref('')
const isTesting = ref(false)

function dismiss() {
  isDismissed.value = true
}

async function connectSession() {
  errorMsg.value = ''
  const url = supabaseUrl.value.trim().replace(/\/+$/, '')
  const key = supabaseKey.value.trim()

  if (!url || !key) {
    errorMsg.value = 'Please provide both Supabase URL and Key.'
    return
  }

  if (!url.startsWith('https://')) {
    errorMsg.value = 'URL must start with https://'
    return
  }

  try {
    isTesting.value = true
    setSessionSupabaseCredentials(url, key)

    // Verify connection by loading data
    await Promise.all([
      portfolioStore.fetchAll(true),
      authStore.checkSession()
    ])
    portfolioStore.subscribeRealtime()

    isOpen.value = false
  } catch (err: any) {
    errorMsg.value = err?.message || 'Failed to connect with provided credentials.'
  } finally {
    isTesting.value = false
  }
}
</script>

<template>
  <div v-if="!isSupabaseConfigured && !isDismissed" class="relative z-50">
    <!-- TOP NOTIFICATION BANNER -->
    <div class="bg-[var(--yellow)] text-[#0b0b0f] border-b-[3px] border-[var(--bd)] px-4 py-2 flex items-center justify-between gap-3 text-[0.88rem] font-mono font-bold shadow-[0_2px_0_var(--sh)]">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="bg-[#0b0b0f] text-white px-2 py-0.5 rounded-[4px] text-[0.75rem]">LOCAL / PREVIEW</span>
        <span>Supabase not connected. Live database is inactive.</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="isOpen = true"
          class="bg-white text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] px-3 py-1 text-[0.8rem] font-bold shadow-[2px_2px_0_#0b0b0f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0b0b0f] cursor-pointer transition-transform"
        >
          Enter Key for Session 🔑
        </button>
        <button
          type="button"
          @click="dismiss"
          aria-label="Dismiss banner"
          class="text-[#0b0b0f] hover:bg-black/10 rounded px-1.5 py-0.5 text-[1.1rem] leading-none cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- MODAL PROMPT -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100]"
      @click.self="isOpen = false"
    >
      <div class="box bg-[var(--paper)] text-[var(--ink)] max-w-[500px] w-full p-6 relative flex flex-col gap-4 shadow-[8px_8px_0_var(--sh)]">
        <div class="flex items-center justify-between border-b-2 border-[var(--bd)] pb-3">
          <div class="flex items-center gap-2">
            <span class="bg-[var(--yellow)] text-[#0b0b0f] border-2 border-[#0b0b0f] rounded-[6px] px-2 py-0.5 font-mono font-bold text-[0.78rem]">
              SESSION-ONLY
            </span>
            <h3 class="m-0 text-[1.3rem] font-extrabold tracking-[-0.02em]">Connect Supabase</h3>
          </div>
          <button
            type="button"
            @click="isOpen = false"
            class="font-mono font-bold text-[1.2rem] text-[var(--ink)] hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p class="m-0 text-[0.92rem] leading-[1.5] opacity-90">
          Enter your Supabase project URL and <strong>Anon / Public Key</strong>. Credentials are saved in <code>sessionStorage</code> only and automatically erased when this browser tab closes.
        </p>

        <div class="bg-[var(--blue)]/10 border-2 border-[var(--bd)] rounded-[6px] p-3 text-[0.82rem] font-mono">
          🛡️ <strong>Safety note:</strong> Never enter your <code>service_role</code> secret key here. Use only the public <code>anon</code> key.
        </div>

        <form @submit.prevent="connectSession" class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1.5">
            <label class="font-mono font-bold text-[0.8rem]">Project URL</label>
            <input
              v-model="supabaseUrl"
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              required
              class="w-full bg-[var(--paper)] text-[var(--ink)] border-2 border-[var(--bd)] rounded-[6px] px-3 py-2 font-mono text-[0.88rem] focus:outline-3 focus:outline-[var(--blue)]"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-mono font-bold text-[0.8rem]">Anon / Public Key</label>
            <input
              v-model="supabaseKey"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
              class="w-full bg-[var(--paper)] text-[var(--ink)] border-2 border-[var(--bd)] rounded-[6px] px-3 py-2 font-mono text-[0.88rem] focus:outline-3 focus:outline-[var(--blue)]"
            />
          </div>

          <div v-if="errorMsg" class="font-mono text-[0.8rem] text-red-500 font-bold">
            ⚠️ {{ errorMsg }}
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              @click="isOpen = false"
              class="btn w text-[0.9rem] px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="isTesting"
              class="btn text-[0.9rem] px-5 py-2"
            >
              {{ isTesting ? 'Connecting...' : 'Connect For Session →' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
