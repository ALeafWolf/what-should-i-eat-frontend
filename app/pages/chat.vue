<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Chat</h1>
      <p class="text-sm text-gray-500">Ask anything about food, restaurants, or cooking.</p>
    </div>

    <!-- Message history -->
    <div
      ref="historyEl"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-64 max-h-128 overflow-y-auto p-4 space-y-3"
    >
      <p v-if="!messages.length" class="text-sm text-gray-400 text-center py-8">
        Send a message to start the conversation.
      </p>

      <template v-for="(msg, i) in messages" :key="i">
        <!-- User bubble -->
        <div class="flex justify-end">
          <div class="max-w-[75%] bg-cyan-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2">
            {{ msg.user }}
          </div>
        </div>
        <!-- Assistant bubble -->
        <div v-if="msg.assistant" class="flex justify-start">
          <div class="max-w-[75%] bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2">
            {{ msg.assistant }}
          </div>
        </div>
        <!-- Loading indicator for latest message -->
        <div v-else-if="loading && i === messages.length - 1" class="flex justify-start">
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

    <!-- Error -->
    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
      {{ error }}
    </div>

    <!-- Input -->
    <form @submit.prevent="handleSend" class="flex gap-2">
      <input
        v-model="input"
        type="text"
        placeholder="Type a message…"
        :disabled="loading"
        class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50"
      />
      <button
        type="submit"
        :disabled="loading || !input.trim()"
        class="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
      >
        Send
      </button>
    </form>

    <p v-if="sessionId" class="text-xs text-gray-400">Session: {{ sessionId }}</p>
  </div>
</template>

<script setup lang="ts">
interface Message {
  user: string
  assistant?: string
}

const { loading, error, sendChatMessage } = useApi()
const input = ref('')
const sessionId = ref<string | undefined>(undefined)
const messages = ref<Message[]>([])
const historyEl = ref<HTMLElement | null>(null)

async function handleSend() {
  const text = input.value.trim()
  if (!text) return

  input.value = ''
  messages.value.push({ user: text })

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
