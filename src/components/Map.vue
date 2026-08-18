<script setup>
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

const PLACE = {
  name: '강동 루벨',
  address: '서울 강동구 천호대로 1077 이스트센트럴타워',
  lat: 37.537263,
  lng: 127.13143,
  placeId: '1064180088',
}

const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
const mapEl = ref(null)
const loadError = ref(!clientId)
const mapInstance = shallowRef(null)

const naverMapUrl = `https://map.naver.com/p/entry/place/1064180088`
const kakaoMapUrl = `https://place.map.kakao.com/1185379934`

function initMap() {
  if (!mapEl.value || !window.naver?.maps) return

  const position = new window.naver.maps.LatLng(PLACE.lat, PLACE.lng)
  const map = new window.naver.maps.Map(mapEl.value, {
    center: position,
    zoom: 16,
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
}

function loadScript() {
  if (window.naver?.maps) {
    initMap()
    return
  }

  const existing = document.getElementById('naver-map-script')
  if (existing) {
    existing.addEventListener('load', initMap)
    return
  }

  const script = document.createElement('script')
  script.id = 'naver-map-script'
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
  script.onload = initMap
  script.onerror = () => {
    loadError.value = true
  }
  document.head.appendChild(script)
}

onMounted(() => {
  if (clientId) loadScript()
})

onUnmounted(() => {
  mapInstance.value?.destroy?.()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="overflow-hidden bg-beige2">
      <div
        v-show="!loadError"
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
        class="flex h-[240px] w-full flex-col items-center justify-center gap-2 px-6 text-gray6"
      >
        <p class="body2">지도를 불러오지 못했습니다.</p>
        <p class="caption1 text-primary1">네이버 지도에서 보기</p>
      </a>
    </div>

    <a
      :href="naverMapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="body2 text-gray7 underline underline-offset-4"
    >
      네이버 지도에서 보기
    </a>
    <a
      :href="kakaoMapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="body2 text-gray7 underline underline-offset-4"
    >
      Kakao 지도에서 보기
    </a>
  </div>
</template>
