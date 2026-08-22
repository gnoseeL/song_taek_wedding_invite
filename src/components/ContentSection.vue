<script setup>
defineProps({
  className: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section :class="['flex flex-col gap-6', className]">
    <slot />
  </section>
</template>
