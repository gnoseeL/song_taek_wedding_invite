<script setup>
import Hero from '@/components/Hero.vue'
import PhotoGrid from '@/components/PhotoGrid.vue'
</script>

<template>
  <main class="min-h-dvh bg-beige1 text-center text-gray9">
    <section class="pc:mx-auto pc:w-[375px]">
      <Hero />
      <div class="px-5 py-16">
        <h1>WEDDING INVITATION</h1>
        <div class="body2 text-gray6">
          <p>2021년 12월 18일 저희의 이야기가 시작되었습니다.</p>
          <p>그리고 5년이 지나고 그 다음날,</p>
          <p>2026년 12월 19일 평생을 함께하려 합니다.</p>
          <p>새로운 시작의 순간을 함께 해주세요.</p>
        </div>
        <section class="mt-8">
          <PhotoGrid />
        </section>
      </div>
    </section>
  </main>
</template>
