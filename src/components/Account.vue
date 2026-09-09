<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { accountSides } from '@/data/accounts'
import SideToggle from '@/components/SideToggle.vue'

const selectedSide = ref('bride')
const copiedId = ref('')
let copiedTimer

const currentSide = computed(
  () => accountSides.find((side) => side.id === selectedSide.value) ?? accountSides[0],
)

async function copyNumber(account) {
  const text = account.number.replace(/-/g, '')

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const input = document.createElement('textarea')
    input.value = text
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }

  copiedId.value = account.id
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copiedId.value = ''
  }, 2000)
}

onUnmounted(() => {
  clearTimeout(copiedTimer)
})
</script>

<template>
  <div class="flex flex-col gap-3 px-6">
    <SideToggle v-model="selectedSide" name="account-side" />

    <ul class="divide-y divide-black/5 rounded-lg bg-white px-5 text-left">
      <li
        v-for="account in currentSide.accounts"
        :key="account.id"
        class="flex items-center justify-between gap-3 py-4"
      >
        <div class="min-w-0">
          <p class="body2 text-title">{{ account.role }} {{ account.name }}</p>
          <p class="body1 mt-1 text-description">{{ account.bank }} {{ account.number }}</p>
        </div>
        <button
          type="button"
          class="body2 shrink-0 rounded-full bg-white px-3 py-1.5 text-primary1"
          :aria-label="`${account.role} ${account.name} 계좌번호 복사하기`"
          @click="copyNumber(account)"
        >
          {{ copiedId === account.id ? '복사됨' : '복사하기' }}
        </button>
      </li>
    </ul>
  </div>
</template>
