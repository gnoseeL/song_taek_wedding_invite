<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const MUSIC_SRC = '/music/bg_music.mp3'

const audioEl = ref(null)
const isPlaying = ref(true)
const userPaused = ref(false)

function syncPlayingState() {
  const audio = audioEl.value
  if (!audio) return
  isPlaying.value = !audio.paused
}

function playFromStart() {
  const audio = audioEl.value
  if (!audio) return Promise.resolve()

  audio.currentTime = 0
  return audio.play().then(() => {
    isPlaying.value = true
  })
}

function tryAutoplay() {
  const audio = audioEl.value
  if (!audio || userPaused.value) return

  audio.muted = false
  audio.play()
    .then(() => {
      isPlaying.value = true
      removeInteractionListeners()
    })
    .catch(() => {
      // 브라우저 자동재생 차단 시: 첫 터치/클릭에서 재생
      isPlaying.value = true
      addInteractionListeners()
    })
}

function toggleMusic() {
  const audio = audioEl.value
  if (!audio) return

  if (!audio.paused) {
    audio.pause()
    isPlaying.value = false
    userPaused.value = true
    return
  }

  userPaused.value = false
  playFromStart().catch(() => {
    isPlaying.value = false
  })
}

function handleFirstInteraction() {
  if (userPaused.value) return
  tryAutoplay()
}

const interactionEvents = ['touchstart', 'pointerdown', 'click']
let listenersAttached = false

function addInteractionListeners() {
  if (listenersAttached) return
  listenersAttached = true

  interactionEvents.forEach((event) => {
    document.addEventListener(event, handleFirstInteraction, { once: true, passive: true })
  })
}

function removeInteractionListeners() {
  if (!listenersAttached) return
  listenersAttached = false

  interactionEvents.forEach((event) => {
    document.removeEventListener(event, handleFirstInteraction)
  })
}

function handleVisibilityChange() {
  if (document.hidden || userPaused.value) return
  tryAutoplay()
}

onMounted(() => {
  const audio = audioEl.value
  if (!audio) return

  audio.loop = true
  audio.preload = 'auto'
  audio.setAttribute('playsinline', '')
  audio.setAttribute('webkit-playsinline', '')

  audio.addEventListener('play', syncPlayingState)
  audio.addEventListener('pause', syncPlayingState)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  tryAutoplay()
})

onUnmounted(() => {
  removeInteractionListeners()
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  const audio = audioEl.value
  if (audio) {
    audio.removeEventListener('play', syncPlayingState)
    audio.removeEventListener('pause', syncPlayingState)
    audio.pause()
  }
})
</script>

<template>
  <div>
    <audio
      ref="audioEl"
      :src="MUSIC_SRC"
      autoplay
      loop
      playsinline
      preload="auto"
    />
    <button
      type="button"
      class="fixed top-4 right-4 z-50 flex h-7 items-center justify-center gap-1 rounded-full bg-title/30 px-2.5 text-white shadow-sm transition-opacity hover:bg-sub pc:right-[calc((100vw-430px)/2+1rem)]"
      :aria-label="isPlaying ? '배경음악 끄기' : '배경음악 재생'"
      @click.stop="toggleMusic"
    >
      <span class="body3 font-sans" :class="isPlaying ? 'text-whtie' : 'text-white/50'">
        {{ isPlaying ? 'ON' : 'OFF' }}
      </span>
      <svg
        v-if="isPlaying"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-4 text-white"
        aria-hidden="true"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="size-4 text-white/50"
        aria-hidden="true"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill="currentColor" />
        <path d="M4 4l16 16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
