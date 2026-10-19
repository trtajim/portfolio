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

function handleGuestLogin() {
  authStore.signInAsGuest()
  const redirect = (route.query.redirect as string) || '/admin'
  router.push(redirect)
}
</script>

<template>
  <div class="c login-page">
    <div class="box card login-card">
      <div class="login-header">
        <span class="h">ADMIN LOGIN</span>
        <p class="desc">Log in with credentials to manage the portfolio, or enter as a guest to inspect the dashboard.</p>
      </div>

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
          {{ isSubmitting ? 'Signing In...' : 'Sign In as Admin →' }}
        </BrutalButton>
      </form>

      <div class="guest-divider">
        <span>OR</span>
      </div>

      <BrutalButton
        as="button"
        variant="mint"
        style="width: 100%"
        @click="handleGuestLogin"
      >
        👀 Inspect Demo Mode (View Only)
      </BrutalButton>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 220px);
}

.login-card {
  max-width: 440px;
  width: 100%;
  padding: 34px 28px;
}

.login-header {
  margin-bottom: 20px;
}

.desc {
  margin: 12px 0 0;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.85;
}

.error-box {
  background: var(--pink);
  color: #0b0b0f;
  border: 2px solid var(--bd);
  border-radius: 6px;
  box-shadow: 2px 2px 0 var(--sh);
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
  padding: 10px 14px;
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

.guest-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  position: relative;
}

.guest-divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 2px dashed var(--bd);
}

.guest-divider span {
  position: relative;
  background: var(--paper);
  padding: 0 10px;
  font: 700 0.8rem var(--mono);
  color: var(--ink);
}

@media (max-width: 480px) {
  .login-page {
    padding: 30px 14px;
  }
  .login-card {
    padding: 24px 18px;
  }
  .input-box {
    font-size: 16px; /* Prevents auto-zoom on mobile safari */
  }
}
</style>
