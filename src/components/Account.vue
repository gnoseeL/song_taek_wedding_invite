<script setup>
import { onUnmounted, ref } from 'vue'
import { accountSides } from '@/data/accounts'

const opened = ref({})
const copiedId = ref('')
let copiedTimer

function isOpen(id) {
  return Boolean(opened.value[id])
}

function toggle(id) {
  opened.value[id] = !opened.value[id]
}

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
    <div
      v-for="side in accountSides"
      :key="side.id"
      class="overflow-hidden rounded-lg bg-beige2 text-left"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-5 py-4"
        :aria-expanded="isOpen(side.id)"
        :aria-controls="`account-panel-${side.id}`"
        @click="toggle(side.id)"
      >
        <span class="body1 text-description8">{{ side.title }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4 text-description6 transition-transform duration-300"
          :class="isOpen(side.id) ? 'rotate-180' : ''"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        :id="`account-panel-${side.id}`"
        class="grid transition-[grid-template-rows] duration-300 ease-out"
        :class="isOpen(side.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <ul class="border-t border-beige3 px-5">
            <li
              v-for="account in side.accounts"
              :key="account.id"
              class="flex items-center justify-between gap-3 py-4"
            >
              <div class="min-w-0">
                <p class="body2 text-description8">{{ account.role }} {{ account.name }}</p>
                <p class="body1 mt-1 text-description6">{{ account.bank }} {{ account.number }}</p>
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
      </div>
    </div>
  </div>
</template>
