<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ t('chat.pageTitle') }}</h1>
      <p class="text-sm text-gray-500">{{ t('chat.subtitle') }}</p>
    </div>

    <div
      ref="historyEl"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-64 max-h-128 overflow-y-auto p-4 space-y-4"
    >
      <p v-if="!messages.length" class="text-sm text-gray-400 text-center py-8">
        {{ t('chat.emptyState') }}
      </p>

      <template v-for="msg in messages" :key="msg.id">
        <!-- User bubble -->
        <div class="flex justify-end">
          <div class="max-w-[75%] bg-cyan-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2">
            {{ msg.user }}
          </div>
        </div>

        <!-- Assistant response -->
        <template v-if="msg.assistant">
          <!-- Text reply (clarification, food question, recipe coming soon, other) -->
          <div v-if="msg.assistant.kind === 'text'" class="flex justify-start">
            <div class="max-w-[85%] space-y-2">
              <div class="bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 leading-relaxed">
                {{ msg.assistant.text }}
              </div>
              <!-- Source links for food questions -->
              <div v-if="msg.assistant.sources?.length" class="px-1 space-y-1">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {{ t('chat.sources') }}
                </p>
                <a
                  v-for="src in msg.assistant.sources"
                  :key="src.url"
                  :href="src.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block text-xs text-cyan-600 hover:text-cyan-800 hover:underline truncate"
                >
                  {{ src.title }}
                </a>
              </div>
            </div>
          </div>

          <!-- Restaurant search results -->
          <div v-else-if="msg.assistant.kind === 'restaurant'" class="space-y-3">
            <div
              v-if="msg.assistant.finalRecommendation"
              class="bg-cyan-50 border border-cyan-200 rounded-2xl px-4 py-3"
            >
              <p class="text-xs font-semibold text-cyan-700 mb-1">
                {{ t('chat.aiRecommendation') }}
              </p>
              <p class="text-sm text-gray-800">{{ msg.assistant.finalRecommendation }}</p>
            </div>
            <RestaurantCard
              v-for="r in msg.assistant.restaurants"
              :key="r.id"
              :restaurant="r"
            />
          </div>
        </template>

        <!-- Loading state for the pending assistant turn -->
        <template v-else-if="loading && msg.id === lastMessageId">
          <!-- Workflow steps (restaurant search in progress) -->
          <StreamStepList v-if="steps.length" :steps="steps" />
          <!-- Generic dots while waiting for intent classification -->
          <div v-else class="flex justify-start">
            <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <span class="flex gap-1 items-center">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        </template>
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
  </div>
</template>

<script setup lang="ts">
import type { AssistantContent, RestaurantResponse } from '~/types/api'

interface ChatMessage {
  id: string
  user: string
  assistant?: AssistantContent
}

const { t } = useI18n()

useSeoMeta({
  title: () => t('chat.metaTitle'),
  description: () => t('chat.metaDescription'),
})

const { loading, steps, error, sendMessage } = useChatStream()
const input = ref('')
const messages = ref<ChatMessage[]>([])
const historyEl = ref<HTMLElement | null>(null)

const lastMessageId = computed(() => messages.value[messages.value.length - 1]?.id)

// Auto-scroll whenever messages or steps change
watch(
  [messages, steps],
  async () => {
    await nextTick()
    if (historyEl.value) {
      historyEl.value.scrollTop = historyEl.value.scrollHeight
    }
  },
  { deep: true },
)

async function handleSend() {
  const text = input.value.trim()
  if (!text || loading.value) return

  input.value = ''
  const msgId = crypto.randomUUID()
  messages.value.push({ id: msgId, user: text })

  await sendMessage(text, {
    onText(text, sources) {
      const msg = messages.value.find(m => m.id === msgId)
      if (msg) msg.assistant = { kind: 'text', text, sources }
    },
    onRestaurants(data: RestaurantResponse) {
      const msg = messages.value.find(m => m.id === msgId)
      if (msg) {
        msg.assistant = {
          kind: 'restaurant',
          restaurants: data.restaurants,
          finalRecommendation: data.finalRecommendation,
        }
      }
    },
  })
}
</script>
