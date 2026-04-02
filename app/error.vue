<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()

const heading = computed(() =>
  props.error.statusCode === 404 ? t('error.notFound') : t('error.generic'),
)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
    <div class="max-w-md w-full text-center space-y-4">
      <p class="text-6xl font-bold text-cyan-600 tabular-nums">
        {{ error.statusCode }}
      </p>
      <h1 class="text-xl font-semibold text-gray-900">
        {{ heading }}
      </h1>
      <p v-if="error.message" class="text-sm text-gray-500 wrap-break-word">
        {{ error.message }}
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
        @click="goHome"
      >
        {{ t('error.backHome') }}
      </button>
    </div>
  </div>
</template>
