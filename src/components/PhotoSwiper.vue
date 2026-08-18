<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { useDevice } from '@/hooks/useDevice'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineProps({
  photos: {
    type: Array,
    required: true,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
})

const { isMobile } = useDevice()
const modules = [Navigation, Pagination]
</script>

<template>
  <Swiper
    :modules="modules"
    slides-per-view="auto"
    centered-slides="true"
    :space-between="8"
    :loop="photos.length > 1"
    :initial-slide="initialSlide"
    :navigation="!isMobile"
    :pagination="{ type: 'fraction' }"
    class="photo-swiper h-full w-full"
  >
    <SwiperSlide
      v-for="photo in photos"
      :key="photo.id"
      class="!w-[calc(100%-48px)]"
    >
      <div class="flex h-full items-center justify-center">
        <img
          :src="photo.src"
          :alt="photo.alt"
          class="max-h-[80dvh] w-full touch-pan-x select-none object-contain"
          draggable="false"
          @dragstart.prevent
          @contextmenu.prevent
        />
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped>
.photo-swiper img {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.photo-swiper :deep(.swiper-pagination) {
  top: auto;
  bottom: 0;
}

.photo-swiper :deep(.swiper-pagination-fraction) {
  color: #ffffff;
}

.photo-swiper :deep(.swiper-button-next),
.photo-swiper :deep(.swiper-button-prev) {
  --swiper-navigation-size: 24px;
  color: #ffffff;
}

.photo-swiper :deep(.swiper-button-next) { 
  right: -5px;
}

.photo-swiper :deep(.swiper-button-prev) { 
  left: -5px;
}
</style>
