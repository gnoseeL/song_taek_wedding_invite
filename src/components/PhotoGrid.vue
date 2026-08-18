<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { photos } from '@/data/photos'
import PhotoSwiper from '@/components/PhotoSwiper.vue'

const isOpen = ref(false)
const initialIndex = ref(0)

function openAt(index) {
  initialIndex.value = index
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="grid grid-cols-3 gap-0.5">
    <button
      v-for="(photo, index) in photos"
      :key="photo.id"
      type="button"
      class="aspect-square overflow-hidden bg-beige3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray8"
      :aria-label="`${photo.alt} 크게 보기`"
      @click="openAt(index)"
    >
      <img
        :src="photo.src"
        :alt="photo.alt"
        class="size-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        loading="lazy"
      />
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label="사진 갤러리"
      @click.self="close"
    >
      <button
        type="button"
        class="absolute right-4 top-4 z-10 flex size-10 items-center justify-center text-white"
        aria-label="닫기"
        @click="close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          class="size-6"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div class="relative size-full max-w-[560px] py-14">
        <PhotoSwiper
          :key="initialIndex"
          :photos="photos"
          :initial-slide="initialIndex"
        />
      </div>
    </div>
  </Teleport>
</template>
