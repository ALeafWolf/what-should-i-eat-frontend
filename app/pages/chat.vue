<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ t('chat.pageTitle') }}</h1>
      <p class="text-sm text-gray-500">{{ t('chat.subtitle') }}</p>
    </div>

    <div
      ref="historyEl"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-64 max-h-128 overflow-y-auto p-4 space-y-3"
    >
      <p v-if="!messages.length" class="text-sm text-gray-400 text-center py-8">
        {{ t('chat.emptyState') }}
      </p>

      <template v-for="msg in messages" :key="msg.id">
        <div class="flex justify-end">
          <div class="max-w-[75%] bg-cyan-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2">
            {{ msg.user }}
          </div>
        </div>
        <div v-if="msg.assistant" class="flex justify-start">
          <div class="max-w-[75%] bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2">
            {{ msg.assistant }}
          </div>
        </div>
        <div v-else-if="loading && msg.id === lastMessageId" class="flex justify-start">
          <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
            <span class="flex gap-1 items-center">
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      </template>
    </div>

    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
      {{ error }}
    </div>

    <form class="flex gap-2" @submit.prevent="handleSend">
      <input
        v-model="input"
        type="text"
        :placeholder="t('chat.placeholder')"
        :disabled="loading"
        class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50"
      />
      <button
        type="submit"
        :disabled="loading || !input.trim()"
        class="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
      >
        {{ t('chat.send') }}
      </button>
    </form>

    <p v-if="sessionId" class="text-xs text-gray-400">Session: {{ sessionId }}</p>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  user: string
  assistant?: string
}

const { t } = useI18n()

useSeoMeta({
  title: () => t('chat.metaTitle'),
  description: () => t('chat.metaDescription'),
})

const { loading, error, sendChatMessage } = useApi()
const input = ref('')
const sessionId = ref<string | undefined>(undefined)
const messages = ref<Message[]>([])
const historyEl = ref<HTMLElement | null>(null)

const lastMessageId = computed(() => messages.value[messages.value.length - 1]?.id)

function newMessageId() {
  return crypto.randomUUID()
}

async function handleSend() {
  const text = input.value.trim()
  if (!text) return

  input.value = ''
  messages.value.push({ id: newMessageId(), user: text })

  const response = await sendChatMessage({ message: text, sessionId: sessionId.value })

  if (response) {
    if (response.sessionId) sessionId.value = response.sessionId
    const last = messages.value[messages.value.length - 1]
    if (last) last.assistant = response.message
  }

  await nextTick()
  if (historyEl.value) {
    historyEl.value.scrollTop = historyEl.value.scrollHeight
  }
}
</script>
