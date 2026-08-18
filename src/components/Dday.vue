<script setup>
import { computed } from 'vue'

const remainingDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weddingDate = new Date(2026, 11, 19)
  weddingDate.setHours(0, 0, 0, 0)

  const diff = weddingDate.getTime() - today.getTime()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
})
</script>

<template>
  <p class="body2 inline-flex items-center justify-center gap-1 text-gray6">
    송
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-3.5 shrink-0 text-primary1"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    형택 결혼식까지 <strong>{{ remainingDays }}</strong>일
  </p>
</template>
