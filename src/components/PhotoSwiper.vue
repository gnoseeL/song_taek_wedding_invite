<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination]

const slides = [
  { id: 1, label: '사진 1' },
  { id: 2, label: '사진 2' },
  { id: 3, label: '사진 3' },
]
</script>

<template>
  <Swiper
    :modules="modules"
    :slides-per-view="1"
    :space-between="12"
    :loop="true"
    navigation
    pagination
    class="photo-swiper overflow-hidden rounded-2xl"
  >
    <SwiperSlide v-for="slide in slides" :key="slide.id">
      <div
        class="flex aspect-[3/4] items-center justify-center bg-invite-accent/30 text-invite-muted"
      >
        {{ slide.label }}
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped>
.photo-swiper :deep(.swiper-pagination-bullet) {
  background: #3d342c;
}

.photo-swiper :deep(.swiper-button-next),
.photo-swiper :deep(.swiper-button-prev) {
  color: #3d342c;
}
</style>
