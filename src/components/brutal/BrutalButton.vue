<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'yellow' | 'pink' | 'blue' | 'mint' | 'orange' | 'white'
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

const colorClass = computed(() => {
  return props.variant === 'yellow' ? '' : props.variant
})
</script>

<template>
  <router-link v-if="as === 'router-link' && to" :to="to" :class="['btn', colorClass]">
    <slot />
  </router-link>
  <a v-else-if="as === 'a' && href" :href="href" :target="target" :class="['btn', colorClass]">
    <slot />
  </a>
  <button v-else :type="type" :class="['btn', colorClass]">
    <slot />
  </button>
</template>
