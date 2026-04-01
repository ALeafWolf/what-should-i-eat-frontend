<template>
  <form class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-lg font-semibold text-gray-800">{{ t('restaurant.form.title') }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('restaurant.form.area') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.area"
          type="text"
          :placeholder="t('restaurant.form.areaPlaceholder')"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('restaurant.form.cuisine') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.cuisine"
          type="text"
          :placeholder="t('restaurant.form.cuisinePlaceholder')"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('restaurant.form.budget') }}</label>
        <input
          v-model.number="form.budget"
          type="number"
          min="0"
          :placeholder="t('restaurant.form.budgetPlaceholder')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('restaurant.form.preferences') }}</label>
        <input
          v-model="preferencesInput"
          type="text"
          :placeholder="t('restaurant.form.preferencesPlaceholder')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t('restaurant.form.commaSeparated') }}</p>
      </div>
    </div>

    <button
      type="submit"
      :disabled="disabled"
      class="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors text-sm"
    >
      {{ disabled ? t('restaurant.form.searching') : t('restaurant.form.search') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { RestaurantSearchRequest } from '~/types/api'

const { t } = useI18n()

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [data: RestaurantSearchRequest] }>()

const form = reactive({ area: '', cuisine: '', budget: undefined as number | undefined })
const preferencesInput = ref('')

function handleSubmit() {
  const preferences = preferencesInput.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  emit('submit', {
    area: form.area,
    cuisine: form.cuisine,
    ...(form.budget ? { budget: form.budget } : {}),
    ...(preferences.length ? { preferences } : {}),
  })
}
</script>
