<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
})

const model = defineModel({
  type: String,
  default: 'groom',
})

const options = [
  { value: 'groom', label: '신랑측' },
  { value: 'bride', label: '신부측' },
]
</script>

<template>
  <div
    class="relative grid grid-cols-2 rounded-full bg-sub/25 p-1"
    role="radiogroup"
    aria-label="계좌 구분"
  >
    <span
      class="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out"
      :class="model === 'bride' ? 'translate-x-full' : 'translate-x-0'"
    />
    <label
      v-for="option in options"
      :key="option.value"
      class="relative z-10 flex cursor-pointer items-center justify-center py-2.5"
    >
      <input
        v-model="model"
        type="radio"
        :name="name"
        :value="option.value"
        class="sr-only"
      />
      <span
        class="body2 transition-colors duration-300"
        :class="model === option.value ? 'text-title' : 'text-title/08'"
      >
        {{ option.label }}
      </span>
    </label>
  </div>
</template>
