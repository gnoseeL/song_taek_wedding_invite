<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  className: {
    type: String,
    default: '',
  },
})

const sectionRef = ref(null)
const isVisible = ref(false)
let observer

onMounted(() => {
  const el = sectionRef.value
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
      threshold: 0.15,
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
  <section
    ref="sectionRef"
    :class="[
      'flex flex-col gap-11',
      isVisible ? 'animate-fade-in' : 'opacity-0',
      className,
    ]"
  >
    <slot />
  </section>
</template>
