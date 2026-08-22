<script setup>
import Hero from '@/components/Hero.vue'
import Title from '@/components/Title.vue'
import PhotoGrid from '@/components/PhotoGrid.vue'
import Calendar from '@/components/Calendar.vue'
import Dday from '@/components/Dday.vue'
import Map from '@/components/Map.vue'
import Account from '@/components/Account.vue'
import Guestbook from '@/components/Guestbook.vue'
import ContentSection from '@/components/ContentSection.vue'
</script>

<template>
  <main class="flex min-h-dvh flex-col text-center pc:mx-auto pc:w-[375px]">
     <!-- s: 시작 배너 -->
     <Hero />
      <!-- e : 시작 배너 -->
      <div class="relative z-10 flex flex-col gap-16 bg-beige1 py-16">
      <!-- s: 초대 문구 섹션 -->
      <ContentSection>
        <Title title="INVITATION" as="h1" description="소중한 분들을 초대합니다.">
          <p>2021년 12월 18일 저희의 이야기가 시작되었습니다.</p>
          <p>함께한 5년의 시간 끝에 맞이하는 다음 날,</p>
          <p>2026년 12월 19일 평생을 함께하려 합니다.</p>
          <p class="mt-4">새로운 시작의 순간을 함께 해주세요.</p>
        </Title>
        <div class="relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-14 before:h-px before:bg-detail pt-15">
          <div class="flex items-center justify-center text-title gap-3">
            <div class="flex items-center gap-1">
              <span>행봉</span>
              <em class="text-description">·</em>
              <span>재란</span>
            </div>
            <span class="text-description">의 딸</span>
            <strong>이송</strong>
          </div>
          <div class="flex items-center justify-center text-title gap-3">
            <div class="flex items-center gap-1">
              <span>국빈</span>
              <em class="text-description">·</em>
              <span>현정</span>
            </div>
            <span class="text-description">의 아들</span>
            <strong>김형택</strong>
          </div>
        </div>
        <div class="w-full h-auto">
          <img src="/images/photo/bg_02.PNG" loading="lazy" alt="" class="w-full object-contain"/>
        </div>
      </ContentSection>
      <!-- e : 초대 문구 섹션 -->
      <!-- s: 신랑신부 소개  섹션 -->
      <!-- <section>

      </section> -->
      <!-- e : 신랑신부 소개 섹션 -->
      <!-- s : 달력 -->
      <ContentSection>
        <Title title="SCHEDULE" description="2026년 12월 19일 오전 11시"/>
        <Calendar />
        <Dday />
      </ContentSection>
      <!-- e : 달력 섹션 -->
      <!-- s : 오시는 길 -->
      <ContentSection padded>
        <Title title="오시는 길">
          <p>강동 루벨 35층</p>
          <p>서울 강동구 천호대로 1077 이스트센트럴타워 35층</p>
        </Title>
        <Map />
      </ContentSection>
      <!-- e : 오시는 길 -->
      <!-- s: 사진 섹션 -->
      <ContentSection>
        <Title title="Gallery" description="함께한 시간들을 기억해주세요."/>
        <PhotoGrid />
      </ContentSection>
      <!-- e : 사진 섹션 -->

      <!-- s : 계좌번호 -->
      <ContentSection>
        <Title title="마음 전하실 곳">
          <p>참석이 어려우신 분들을 위해</p>
          <p>계좌번호를 안내드립니다.</p>
        </Title>
        <Account />
      </ContentSection>
      <!-- e : 계좌번호 -->
      <!-- s : 축하 메시지 -->
      <ContentSection>
        <Title title="축하 메시지">
          <p>따뜻한 마음을 남겨주세요.</p>
        </Title>
        <Guestbook />
      </ContentSection>
      <!-- e : 축하 메시지 -->
      </div>
  </main>
</template>
