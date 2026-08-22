<script setup>
import { onUnmounted, ref, watch } from 'vue'

const STORAGE_KEY = 'song-taek-wedding-comments'

const comments = ref(loadComments())
const isWriteOpen = ref(false)
const form = ref(emptyForm())
const errorMessage = ref('')

function emptyForm() {
  return {
    name: '',
    content: '',
    password: '',
  }
}

function loadComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveComments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments.value))
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

function openWrite() {
  form.value = emptyForm()
  errorMessage.value = ''
  isWriteOpen.value = true
}

function closeWrite() {
  isWriteOpen.value = false
}

function submitComment() {
  const name = form.value.name.trim()
  const content = form.value.content.trim()
  const password = form.value.password.trim()

  if (!name || !content || !password) {
    errorMessage.value = '이름, 내용, 비밀번호를 모두 입력해주세요.'
    return
  }

  comments.value = [
    {
      id: crypto.randomUUID(),
      name,
      content,
      password,
      createdAt: Date.now(),
    },
    ...comments.value,
  ]
  saveComments()
  closeWrite()
}

function removeComment(comment) {
  const password = window.prompt('비밀번호를 입력해주세요.')
  if (password === null) return

  if (password !== comment.password) {
    window.alert('비밀번호가 일치하지 않습니다.')
    return
  }

  comments.value = comments.value.filter((item) => item.id !== comment.id)
  saveComments()
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

onUnmounted(() => {
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

    <p v-if="comments.length === 0" class="body3 py-8 text-description">
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
            class="flex size-6 shrink-0 items-center justify-center text-description"
            :aria-label="`${comment.name}님 메시지 삭제`"
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-write-title"
      @click.self="closeWrite"
    >
      <div class="w-full max-w-[343px] rounded-xl bg-beige1 p-6 text-left">
        <div class="mb-5 flex items-center justify-between">
          <h3 id="guestbook-write-title" class="body1 text-title">메시지 작성</h3>
          <button
            type="button"
            class="flex size-8 items-center justify-center text-description"
            aria-label="닫기"
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
              class="body1 rounded-md border border-beige2 bg-white px-3 py-2.5 text-title"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="body2 text-title">내용</span>
            <textarea
              v-model="form.content"
              rows="4"
              maxlength="300"
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
              class="body1 rounded-md border border-beige2 bg-white px-3 py-2.5 text-title"
            />
          </label>

          <p v-if="errorMessage" class="body2 text-error">{{ errorMessage }}</p>

          <button
            type="submit"
            class="body2 mt-1 w-full rounded-full bg-primary1 py-3 text-white"
          >
            작성하기
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
