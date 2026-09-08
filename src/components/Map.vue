<script setup>
import { nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'

const PLACE = {
  name: '강동 루벨',
  address: '서울 강동구 천호대로 1077 이스트센트럴타워',
  lat: 37.537263,
  lng: 127.13143,
  placeId: '1064180088',
}

const SCRIPT_ID = 'naver-map-script'
const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
const mapEl = ref(null)
const loadError = ref(!clientId)
const mapInstance = shallowRef(null)

const naverMapUrl = `https://map.naver.com/p/entry/place/${PLACE.placeId}`
const kakaoMapUrl = `https://place.map.kakao.com/1185379934`
const tmapUrl = `https://tmap.life/b1659d7d`

let cancelled = false
let retryTimer = 0
let resizeObserver = null

function fail() {
  if (!cancelled) loadError.value = true
}

function getSize(el) {
  const width = Math.round(el.getBoundingClientRect().width || el.clientWidth || el.offsetWidth)
  const height = Math.round(el.getBoundingClientRect().height || el.clientHeight || el.offsetHeight)
  return { width, height }
}

function syncSize() {
  const el = mapEl.value
  const map = mapInstance.value
  if (!el || !map || !window.naver?.maps) return

  const { width, height } = getSize(el)
  if (width < 1 || height < 1) return

  map.setSize(new window.naver.maps.Size(width, height))
}

function initMap() {
  if (cancelled || mapInstance.value) return true

  const el = mapEl.value
  if (!el || !window.naver?.maps) return false

  const { width, height } = getSize(el)
  if (width < 1 || height < 1) return false

  const position = new window.naver.maps.LatLng(PLACE.lat, PLACE.lng)
  const map = new window.naver.maps.Map(el, {
    center: position,
    zoom: 16,
    size: new window.naver.maps.Size(width, height),
    scaleControl: false,
    logoControl: true,
    mapDataControl: false,
    zoomControl: false,
  })

  new window.naver.maps.Marker({
    position,
    map,
    title: PLACE.name,
  })

  mapInstance.value = map
  resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(el)
  return true
}

function tryInit(attempt = 0) {
  if (cancelled || mapInstance.value) return
  if (initMap()) return
  if (attempt >= 40) {
    fail()
    return
  }
  retryTimer = window.setTimeout(() => tryInit(attempt + 1), 50)
}

function loadScript() {
  window.navermap_authFailure = fail

  if (window.naver?.maps) {
    nextTick(() => tryInit())
    return
  }

  const existing = document.getElementById(SCRIPT_ID)
  if (existing) {
    existing.addEventListener('load', () => tryInit(), { once: true })
    nextTick(() => tryInit())
    return
  }

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`
  script.onload = () => tryInit()
  script.onerror = fail
  document.head.appendChild(script)
}

onMounted(() => {
  if (clientId) loadScript()
})

onUnmounted(() => {
  cancelled = true
  window.clearTimeout(retryTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
  mapInstance.value?.destroy?.()
  mapInstance.value = null
  if (window.navermap_authFailure === fail) {
    delete window.navermap_authFailure
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative overflow-hidden bg-beige2">
      <div
        ref="mapEl"
        class="h-[240px] w-full"
        role="application"
        :aria-label="`${PLACE.name} 위치 지도`"
      />
      <a
        v-if="loadError"
        :href="naverMapUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-gray6"
      >
        <p class="body1">지도를 불러오지 못했습니다.</p>
        <p class="caption1 text-primary1">네이버 지도에서 보기</p>
      </a>
    </div>

    <a
      :href="naverMapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="body1 text-gray7 underline underline-offset-4"
    >
      네이버 지도에서 보기
    </a>
    <a
      :href="kakaoMapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="body1 text-gray7 underline underline-offset-4"
    >
      Kakao 지도에서 보기
    </a>
    <a 
      :href="tmapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="body1 text-gray7 underline underline-offset-4"
    >
      Tmap 지도에서 보기
    </a>
  </div>
</template>
