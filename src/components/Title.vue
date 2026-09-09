<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  as: {
    type: String,
    default: 'h2',
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <component :is="as" class="body2 text-detail">{{ title }}</component>
      <p v-if="description" class="title1 text-title">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="body2 text-description text-center flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
