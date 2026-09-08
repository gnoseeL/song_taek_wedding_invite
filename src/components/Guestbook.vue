<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  createGuestbookMessage,
  deleteGuestbookMessage,
  listGuestbookMessages,
  mapGuestbookMessage,
  subscribeGuestbookMessages,
} from '@/lib/guestbook'
import { isSupabaseConfigured } from '@/lib/supabase'

const comments = ref([])
const isWriteOpen = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const deletingId = ref('')
const loadError = ref('')
const form = ref(emptyForm())
const errorMessage = ref('')

function emptyForm() {
  return {
    name: '',
    content: '',
    password: '',
  }
}

function toErrorMessage(error, fallback) {
  const message = error?.message ?? ''

  if (message.includes('방명록 설정')) return message
  if (message.includes('invalid_name')) return '이름을 확인해주세요.'
  if (message.includes('invalid_content')) return '내용을 확인해주세요.'
  if (message.includes('invalid_password')) return '비밀번호를 확인해주세요.'

  return fallback
}

function formatDate(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}`
}

async function loadComments() {
  if (!isSupabaseConfigured) {
    loadError.value = '방명록 설정이 완료되지 않았습니다.'
    comments.value = []
    return
  }

  isLoading.value = true
  loadError.value = ''

  try {
    comments.value = await listGuestbookMessages()
  } catch (error) {
    loadError.value = toErrorMessage(error, '메시지를 불러오지 못했습니다.')
  } finally {
    isLoading.value = false
  }
}

function applyRealtimeChange(payload) {
  if (payload.eventType === 'INSERT' && payload.new) {
    const message = mapGuestbookMessage(payload.new)
    comments.value = [
      message,
      ...comments.value.filter((item) => item.id !== message.id),
    ]
    return
  }

  if (payload.eventType === 'DELETE' && payload.old?.id) {
    comments.value = comments.value.filter((item) => item.id !== payload.old.id)
  }
}

function openWrite() {
  form.value = emptyForm()
  errorMessage.value = ''
  isWriteOpen.value = true
}

function closeWrite() {
  if (isSubmitting.value) return
  isWriteOpen.value = false
}

async function submitComment() {
  const name = form.value.name.trim()
  const content = form.value.content.trim()
  const password = form.value.password.trim()

  if (!name || !content || !password) {
    errorMessage.value = '이름, 내용, 비밀번호를 모두 입력해주세요.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const message = await createGuestbookMessage({ name, content, password })
    comments.value = [
      message,
      ...comments.value.filter((item) => item.id !== message.id),
    ]
    isWriteOpen.value = false
  } catch (error) {
    errorMessage.value = toErrorMessage(error, '메시지 작성에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}

async function removeComment(comment) {
  const password = window.prompt('비밀번호를 입력해주세요.')
  if (password === null) return

  const trimmed = password.trim()
  if (!trimmed) {
    window.alert('비밀번호를 입력해주세요.')
    return
  }

  deletingId.value = comment.id

  try {
    const deleted = await deleteGuestbookMessage(comment.id, trimmed)
    if (!deleted) {
      window.alert('비밀번호가 일치하지 않습니다.')
      return
    }

    comments.value = comments.value.filter((item) => item.id !== comment.id)
  } catch (error) {
    window.alert(toErrorMessage(error, '메시지 삭제에 실패했습니다.'))
  } finally {
    deletingId.value = ''
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') closeWrite()
}

watch(isWriteOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

const unsubscribeRealtime = subscribeGuestbookMessages(applyRealtimeChange)

onMounted(() => {
  loadComments()
})

onUnmounted(() => {
  unsubscribeRealtime()
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="flex flex-col gap-4 px-6">
    <button
      type="button"
      class="body2 mx-auto rounded-full bg-primary1 px-5 py-2.5 text-white"
      @click="openWrite"
    >
      작성하기
    </button>

    <p v-if="isLoading" class="body3 py-8 text-description">
      메시지를 불러오는 중...
    </p>

    <div v-else-if="loadError" class="flex flex-col items-center gap-3 py-8">
      <p class="body3 text-description">{{ loadError }}</p>
      <button
        type="button"
        class="body2 rounded-full border border-primary1 px-4 py-1.5 text-primary1"
        @click="loadComments"
      >
        다시 시도
      </button>
    </div>

    <p v-else-if="comments.length === 0" class="body3 py-8 text-description">
      아직 작성된 메시지가 없습니다.
    </p>

    <ul v-else class="flex flex-col gap-3 text-left">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-lg bg-beige2 px-5 py-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="body1 text-title">{{ comment.name }}</p>
            <p v-if="comment.createdAt" class="body3 mt-0.5 text-description">
              {{ formatDate(comment.createdAt) }}
            </p>
          </div>
          <button
            type="button"
            class="flex size-6 shrink-0 items-center justify-center text-description disabled:opacity-40"
            :aria-label="`${comment.name}님 메시지 삭제`"
            :disabled="deletingId === comment.id"
            @click="removeComment(comment)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              class="size-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p class="body1 mt-2 whitespace-pre-wrap break-words text-description">
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </div>

  <Teleport to="body">
    <div
      v-if="isWriteOpen"
      class="fixed inset-0 z-50 flex items-center justify-center pc:bg-black/50 pc:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-write-title"
      @click.self="closeWrite"
    >
      <div class="w-full mo:h-full pc:max-w-[343px] bg-beige1 p-6 text-left">
        <div class="mb-5 flex items-center justify-between">
          <h3 id="guestbook-write-title" class="body1 text-title">메시지 작성</h3>
          <button
            type="button"
            class="flex size-8 items-center justify-center text-description disabled:opacity-40"
            aria-label="닫기"
            :disabled="isSubmitting"
            @click="closeWrite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              class="size-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="submitComment">
          <label class="flex flex-col gap-1.5">
            <span class="body2 text-title">이름</span>
            <input
              v-model="form.name"
              type="text"
              maxlength="20"
              autocomplete="name"
              :disabled="isSubmitting"
              class="body1 rounded-md border border-beige2 bg-white px-3 py-2.5 text-title"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="body2 text-title">내용</span>
            <textarea
              v-model="form.content"
              rows="4"
              maxlength="300"
              :disabled="isSubmitting"
              class="body1 resize-none rounded-md border border-beige2 bg-white px-3 py-2.5 text-title"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="body2 text-title">비밀번호</span>
            <input
              v-model="form.password"
              type="password"
              maxlength="20"
              autocomplete="new-password"
              :disabled="isSubmitting"
              class="body1 rounded-md border border-beige2 bg-white px-3 py-2.5 text-title"
            />
          </label>

          <p v-if="errorMessage" class="body2 text-error">{{ errorMessage }}</p>

          <button
            type="submit"
            class="body2 mt-1 w-full rounded-full border-primary1 border py-3 text-primary1 disabled:opacity-40"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '작성 중...' : '작성하기' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
