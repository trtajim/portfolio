import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'

import App from './App.vue'
import router from './router'

// Initialize Vercel Web Analytics
inject()

const app = createApp(App)

// Enable :active pseudo-class on iOS touch devices
if (typeof window !== 'undefined') {
  document.addEventListener('touchstart', () => {}, { passive: true })
}

app.use(createPinia())
app.use(router)

app.mount('#app')

