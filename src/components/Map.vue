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

const mapLinks = [
  { label: '네이버 지도', href: naverMapUrl, icon: '/images/common/ico_nav03.png' },
  { label: 'Kakao 지도', href: 'https://place.map.kakao.com/1185379934', icon: '/images/common/ico_nav01.png' },
  { label: 'Tmap 지도', href: 'https://tmap.life/b1659d7d', icon: '/images/common/ico_nav02.png' },
]

const busGroups = [
  { label: '간선', routes: ['130', '341', '342', '370'] },
  { label: '지선', routes: ['3214', '3316', '3324'] },
  { label: '일반', routes: ['1-4', '30-3', '112-1', '112-5'] },
  { label: '직행', routes: ['1113', '1113-1', '1113-2', '1113-10', '1113-11'] },
  { label: '공항버스', routes: ['6200'] },
]

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

  const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  const position = new window.naver.maps.LatLng(PLACE.lat, PLACE.lng)
  const map = new window.naver.maps.Map(el, {
    center: position,
    zoom: 16,
    minZoom: 16,
    maxZoom: 16,
    size: new window.naver.maps.Size(width, height),
    scaleControl: false,
    logoControl: true,
    mapDataControl: false,
    zoomControl: false,
    scrollWheel: false,
    pinchZoom: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false,
    draggable: !isMobile,
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
    <div class="relative overflow-hidden bg-white">
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
    <div class="flex items-center gap-2 justify-center mt-3">
      <a
        v-for="link in mapLinks"
        :key="link.label"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="border border-primary1 rounded-sm px-2 py-2 bg-white flex items-center justify-center gap-1.5"
      >
        <img :src="link.icon" alt="" class="size-5" aria-hidden="true" />
        <span class="text-primary1 body3">{{ link.label }}</span>
      </a>
    </div>

    <div class="mt-6 flex flex-col items-center gap-8 px-6">
      <section class="flex flex-col items-center gap-1.5" aria-labelledby="guide-subway">
        <h3 id="guide-subway" class="body3 inline-flex items-center gap-1.5 text-primary1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 shrink-0" aria-hidden="true">
            <rect width="16" height="16" x="4" y="3" rx="2" />
            <path d="M4 11h16" />
            <path d="M12 3v8" />
            <path d="m8 19-2 3" />
            <path d="m18 22-2-3" />
            <path d="M8 15h.01" />
            <path d="M16 15h.01" />
          </svg>
          지하철
        </h3>
        <p class="body2 mt-1 text-title">5호선 강동역 1번 출구 연결</p>
      </section>

      <div class="h-px w-14 bg-primary1/30" aria-hidden="true" />

      <section class="flex w-full flex-col items-center gap-1.5" aria-labelledby="guide-bus">
        <h3 id="guide-bus" class="body3 inline-flex items-center gap-1.5 text-primary1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 shrink-0" aria-hidden="true">
            <path d="M8 6v6" />
            <path d="M15 6v6" />
            <path d="M2 12h19.6" />
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
            <circle cx="7" cy="18" r="2" />
            <path d="M9 18h5" />
            <circle cx="16" cy="18" r="2" />
          </svg>
          버스
        </h3>
        <p class="body2 mt-1 text-title">버스 이용 시 강동역 하차</p>
        <ul class="mt-4 flex w-full list-none flex-col gap-4">
          <li
            v-for="group in busGroups"
            :key="group.label"
            class="flex list-none flex-col items-center gap-1"
          >
            <p class="body3 text-title">{{ group.label }}</p>
            <p class="body3 text-title">
              <template v-for="(route, index) in group.routes" :key="route">
                <span v-if="index > 0"> · </span>{{ route }}
              </template>
            </p>
          </li>
        </ul>
      </section>

      <div class="h-px w-14 bg-primary1/30" aria-hidden="true" />

      <section class="flex flex-col items-center gap-1.5" aria-labelledby="guide-parking">
        <h3 id="guide-parking" class="body3 inline-flex items-center gap-1.5 text-primary1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
          </svg>
          주차
        </h3>
        <p class="body2 mt-1 text-title">이스트 센트럴 타워 주차장</p>
        <p class="body3 max-w-64 text-description">검색 후 오피스 방면으로 출입해 주세요.</p>
      </section>
    </div>
  </div>
</template>
