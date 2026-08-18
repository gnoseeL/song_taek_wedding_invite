import { onMounted, onUnmounted, ref } from 'vue'

const MOBILE_QUERY = '(max-width: 768px)'

export function useDevice() {
  const isMobile = ref(
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  )

  let mediaQuery

  function update() {
    isMobile.value = mediaQuery.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(MOBILE_QUERY)
    isMobile.value = mediaQuery.matches
    mediaQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return { isMobile }
}
