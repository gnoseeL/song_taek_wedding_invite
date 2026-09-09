<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { photos } from '@/data/photos'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

const thumbsSwiper = ref(null)
const modules = [FreeMode, Navigation, Thumbs]

function setThumbsSwiper(swiper) {
  thumbsSwiper.value = swiper
}
</script>

<template>
  <div class="photo-gallery">
    <Swiper
      :style="{
        '--swiper-navigation-color': '#fff',
      }"
      :modules="modules"
      loop
      :space-between="10"
      :navigation="true"
      :thumbs="{
        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
      }"
      class="main-swiper"
    >
      <SwiperSlide v-for="photo in photos" :key="photo.id">
        <div class="aspect-[3/4] overflow-hidden bg-white">
          <img
            :src="photo.src"
            :alt="photo.alt"
            class="size-full object-cover"
            draggable="false"
            @dragstart.prevent
            @contextmenu.prevent
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <Swiper
      :modules="modules"
      loop
      watch-slides-progress
      :space-between="4"
      :slides-per-view="4"
      :free-mode="true"
      class="thumbs-swiper"
      @swiper="setThumbsSwiper"
    >
      <SwiperSlide v-for="photo in photos" :key="`thumb-${photo.id}`">
        <div class="aspect-square overflow-hidden bg-white">
          <img
            :src="photo.src"
            :alt="photo.alt"
            class="size-full object-cover"
            loading="lazy"
            draggable="false"
            @dragstart.prevent
            @contextmenu.prevent
          />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.photo-gallery {
  --swiper-navigation-size: 22px;
}

.photo-gallery img {
  display: block;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.main-swiper,
.thumbs-swiper {
  width: 100%;
}

.main-swiper :deep(.swiper-slide),
.thumbs-swiper :deep(.swiper-slide) {
  height: auto;
}

.main-swiper :deep(.swiper-button-next),
.main-swiper :deep(.swiper-button-prev) {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.4));
}

.thumbs-swiper {
  box-sizing: border-box;
  margin-top: 4px;
}

.thumbs-swiper :deep(.swiper-slide) {
  cursor: pointer;
  opacity: 0.4;
}

.thumbs-swiper :deep(.swiper-slide-thumb-active) {
  opacity: 1;
}
</style>
