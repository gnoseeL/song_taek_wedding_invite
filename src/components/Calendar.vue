<script setup>
const weekdays = ['일', '월', '화', '수', '목', '금', '토']
const weddingDay = 19

// 2026년 12월 1일은 화요일
const firstDayOfWeek = 2
const daysInMonth = 31

const cells = [
  ...Array(firstDayOfWeek).fill(null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
]
</script>

<template>
  <div class="px-8" role="grid" aria-label="2026년 12월 달력">
    <p class="title2 mb-4 text-gray8">2026. 12</p>
    <div class="grid grid-cols-7 text-center">
      <span
        v-for="day in weekdays"
        :key="day"
        class="caption1 py-2 text-gray5"
      >
        {{ day }}
      </span>
      <span
        v-for="(day, index) in cells"
        :key="index"
        class="relative flex h-10 items-center justify-center body3 text-gray7"
      >
        <span
          v-if="day === weddingDay"
          class="absolute size-8 rounded-full border border-primary1 shadow-md"
          aria-hidden="true"
        />
        <span
          :class="day === weddingDay ? 'font-semibold text-primary1 ' : ''"
        >
          {{ day ?? '' }}
        </span>
      </span>
    </div>
  </div>
</template>
