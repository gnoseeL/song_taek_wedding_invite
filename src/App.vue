<script setup>
import PhotoSwiper from '@/components/PhotoSwiper.vue'
</script>

<template>
  <main class="min-h-dvh bg-invite-bg px-5 py-16 text-center">
    <p class="text-sm tracking-[0.3em] text-invite-muted">WEDDING INVITATION</p>
    <h1 class="mt-4 text-3xl font-light tracking-wide">청첩장</h1>
    <p class="mt-3 text-invite-muted">Vue · Tailwind · Swiper 환경이 준비되었습니다.</p>

    <section class="pc:w-[375px] pc:mx-auto flex flex-wrap gap-4 mt-11">

      <PhotoSwiper />
    </section>
  </main>
</template>
