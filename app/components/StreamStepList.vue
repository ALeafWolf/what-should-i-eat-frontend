<template>
  <div class="flex flex-col justify-center py-8 px-2 sm:px-4 max-w-lg mx-auto space-y-1">
    <div
      v-if="steps.length === 0 && pendingLabel"
      class="flex items-start gap-3 py-2 text-sm"
    >
      <div class="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
        <svg
          class="animate-spin h-5 w-5 text-cyan-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
      <span class="leading-snug text-gray-900 font-medium">{{ pendingLabel }}</span>
    </div>
    <div
      v-for="step in steps"
      :key="step.id"
      class="flex items-start gap-3 py-2 text-sm"
    >
      <div class="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
        <!-- active -->
        <svg
          v-if="step.status === 'active'"
          class="animate-spin h-5 w-5 text-cyan-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <!-- done -->
        <svg
          v-else-if="step.status === 'done'"
          class="h-5 w-5 text-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <!-- error -->
        <svg
          v-else
          class="h-5 w-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span
        :class="[
          'leading-snug',
          step.status === 'active' ? 'text-gray-900 font-medium' : '',
          step.status === 'done' ? 'text-gray-500' : '',
          step.status === 'error' ? 'text-red-600 font-medium' : '',
        ]"
      >
        {{ step.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StreamStep } from '~/types/api'

defineProps<{
  steps: StreamStep[]
  /** Shown with a spinner until the first step arrives (optional). */
  pendingLabel?: string
}>()
</script>
