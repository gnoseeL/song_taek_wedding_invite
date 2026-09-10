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

const isSunday = (index) => index % 7 === 0
</script>

<template>
  <div class="py-3 border border-black/5 border-x-0" role="grid" aria-label="2026년 12월 달력">
    <div class="grid grid-cols-7 text-center">
      <span
        v-for="(day, weekdayIndex) in weekdays"
        :key="day"
        class="caption1 py-2"
        :class="isSunday(weekdayIndex) ? 'text-primary1' : 'text-gray5'"
      >
        {{ day }}
      </span>
      <span
        v-for="(day, index) in cells"
        :key="index"
        class="relative flex h-10 items-center justify-center body2"
        :class="isSunday(index) ? 'text-red1' : 'text-gray7'"
      >
        <span
          v-if="day === weddingDay"
          class="-z-1 absolute size-8 rounded-full bg-primary1 shadow-md"
          aria-hidden="true"
        />
        <span
          :class="day === weddingDay ? 'font-semibold text-white' : ''"
        >
          {{ day ?? '' }}
        </span>
      </span>
    </div>
  </div>
</template>
