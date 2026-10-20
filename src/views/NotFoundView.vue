<script setup lang="ts">
import BrutalButton from '@/components/brutal/BrutalButton.vue'
</script>

<template>
  <div class="c flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
    <div class="box p-8 max-w-[540px] flex flex-col items-center gap-5">
      <span class="font-mono font-extrabold text-[4.5rem] leading-none text-[var(--ink)] bg-[var(--yellow)] px-5 py-2 border-3 border-[var(--bd)] rounded-[var(--r)] shadow-[4px_4px_0_var(--sh)]">
        404
      </span>
      <h1 class="m-0 text-[2rem] font-extrabold tracking-[-0.03em]">Page Not Found</h1>
      <p class="m-0 text-[1.05rem] opacity-80 leading-relaxed">
        The link you followed may be broken, outdated, or the page may have been moved.
      </p>

      <div class="flex flex-wrap gap-3 justify-center mt-2">
        <BrutalButton as="router-link" to="/" variant="yellow">
          ← Back to Home
        </BrutalButton>
        <BrutalButton as="router-link" to="/projects" variant="blue">
          Explore Projects
        </BrutalButton>
        <BrutalButton as="router-link" to="/writing" variant="mint">
          Read Writing
        </BrutalButton>
      </div>
    </div>
  </div>
</template>
