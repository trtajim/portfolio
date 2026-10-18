<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BrutalButton from '@/components/brutal/BrutalButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isSubmitting = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  isSubmitting.value = true
  try {
    await authStore.signIn(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMsg.value = err.message
    } else {
      errorMsg.value = 'Failed to sign in. Please verify your credentials.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="c login-page">
    <div class="card box login-card">
      <span class="h">ADMIN LOGIN</span>
      <p class="desc">Enter your Supabase credentials to access the portfolio dashboard.</p>

      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="form">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@example.com"
            class="input-box"
          />
        </div>

        <div class="field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="input-box"
          />
        </div>

        <BrutalButton
          type="submit"
          variant="yellow"
          :disabled="isSubmitting"
          style="width: 100%; margin-top: 8px;"
        >
          {{ isSubmitting ? 'Signing In...' : 'Sign In →' }}
        </BrutalButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
}

.login-card {
  max-width: 440px;
  width: 100%;
}

.desc {
  margin: 0 0 20px;
  font-size: 0.95rem;
}

.error-box {
  background: var(--pink);
  color: #111;
  border: 3px solid var(--bd);
  padding: 10px 14px;
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
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
  font-size: 1rem;
  padding: 10px 12px;
  border: 3px solid var(--bd);
  background: var(--paper);
  color: var(--ink);
  outline: none;
}

.input-box:focus {
  border-color: var(--blue);
}
</style>
