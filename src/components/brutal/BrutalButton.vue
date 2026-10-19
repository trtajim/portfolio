<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'yellow' | 'pink' | 'blue' | 'mint' | 'orange' | 'white' | 'green'
    as?: 'button' | 'a' | 'router-link'
    to?: string
    href?: string
    target?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'yellow',
    as: 'button',
    type: 'button'
  }
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'pink':
      return 'p'
    case 'blue':
      return 'b'
    case 'mint':
    case 'green':
      return 'g'
    case 'orange':
      return 'orange'
    case 'white':
      return 'w'
    case 'yellow':
    default:
      return ''
  }
})
</script>

<template>
  <router-link
    v-if="as === 'router-link' && to"
    :to="to"
    :class="['btn', variantClass]"
  >
    <slot />
  </router-link>
  <a
    v-else-if="as === 'a' && href"
    :href="href"
    :target="target"
    :class="['btn', variantClass]"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="['btn', variantClass]"
  >
    <slot />
  </button>
</template>
