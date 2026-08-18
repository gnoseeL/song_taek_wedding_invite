<script setup>
import Hero from '@/components/Hero.vue'
import PhotoGrid from '@/components/PhotoGrid.vue'
import Calendar from '@/components/Calendar.vue'
import Dday from '@/components/Dday.vue'
import Map from '@/components/Map.vue'
</script>

<template>
  <main class="min-h-dvh bg-beige1 text-center text-gray9">
    <section class="pc:mx-auto pc:w-[375px]">
      <!-- s: 시작 배너 -->
      <Hero />
      <!-- e : 시작 배너 -->
      <!-- s: 초대 문구 섹션 -->
      <section class="py-16 flex flex-col gap-6">
        <h1 class="title1 text-gray8">저희 결혼합니다.</h1>
        <div class="body2 text-gray6 text-center flex flex-col gap-1">
          <p>2021년 12월 18일 저희의 이야기가 시작되었습니다.</p>
          <p>그리고 5년이 지나고 그 다음날,</p>
          <p>2026년 12월 19일 평생을 함께하려 합니다.</p>
          <p class="mt-4">새로운 시작의 순간을 함께 해주세요.</p>
        </div>
        <div class="w-full h-auto">
          <img src="/images/photo/bg_02.PNG" alt="" class="w-full object-contain"/>
        </div>
      </section>
      <!-- e : 초대 문구 섹션 -->
      <!-- s: 신랑신부 소개  섹션 -->
      <!-- <section>

      </section> -->
      <!-- e : 신랑신부 소개 섹션 -->
      <!-- s : 달력 -->
      <section class="py-16 flex flex-col gap-6">
        <h2 class="title1 text-gray8">예식 안내</h2>
        <div class="body2 text-gray6 flex flex-col gap-1">
          <p>2026년 12월 19일 오전 11시</p>
        </div>
        <Calendar />
        <Dday />
      </section>
      <!-- e : 달력 섹션 -->
      <!-- s : 오시는 길 -->
      <section class="py-16 flex flex-col gap-6">
        <h2 class="title1 text-gray8">오시는 길</h2>
        <div class="body2 text-gray6 flex flex-col gap-1">
          <p>강동 루벨 35층</p>
          <p>서울 강동구 천호대로 1077 이스트센트럴타워 35층</p>
        </div>
        <Map />
      </section>
      <!-- e : 오시는 길 -->
      <!-- s: 사진 섹션 -->
      <section>
        <PhotoGrid />
      </section>
      <!-- e : 사진 섹션 -->

      <!-- s : 계좌번호 -->
      <section>

      </section>
      <!-- e : 계좌번호 -->
      <!-- s : 축하 메시지 -->
      <section>

      </section>
      <!-- e : 축하 메시지 -->
    </section>
  </main>
</template>
