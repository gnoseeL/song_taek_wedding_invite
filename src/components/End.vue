<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const rootRef = ref(null)
const isVisible = ref(false)
let observer

const lines = [
  ['JOIN US', 'AS', 'WE', 'BECOME ONE'],
  ['19', 'DECEMBER', '2026'],
  ['SATURDAY', 'AM 11:00'],
]

const STAGGER_MS = 180

function wordDelay(lineIndex, wordIndex) {
  let index = wordIndex
  for (let i = 0; i < lineIndex; i += 1) {
    index += lines[i].length
  }
  return `${index * STAGGER_MS}ms`
}

onMounted(() => {
  const el = rootRef.value
  if (!el) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.unobserve(el)
      }
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px',
    },
  )

  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="rootRef" class="flex flex-col gap-11 px-9">
    <div class="space-y-1 text-primary1 font-bold">
      <div
        v-for="(line, lineIndex) in lines"
        :key="lineIndex"
        class="flex justify-between items-center font-sans"
      >
        <span
          v-for="(word, wordIndex) in line"
          :key="`${lineIndex}-${word}`"
          :class="isVisible ? 'animate-fade-in' : 'opacity-0'"
          :style="{ animationDelay: isVisible ? wordDelay(lineIndex, wordIndex) : undefined }"
        >
          {{ word }}
        </span>
      </div>
    </div>
    <div>
      <img
        src="/images/photo/bg_03.jpg"
        loading="lazy"
        alt=""
        class="w-full object-contain"
      />
    </div>
  </div>
</template>
