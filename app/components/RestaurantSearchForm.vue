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
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('restaurant.form.budget', { currency: form.currency }) }}
        </label>
        <div class="flex gap-2">
          <input
            v-model.number="form.budget"
            type="number"
            min="0"
            :placeholder="t('restaurant.form.budgetPlaceholder')"
            class="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
          <select
            v-model="form.currency"
            class="rounded-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
          >
            <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
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

const { t, locale } = useI18n()

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [data: RestaurantSearchRequest] }>()

const currencyOptions = [
  { value: 'CAD', label: 'CAD' },
  { value: 'USD', label: 'USD' },
  { value: 'CNY', label: 'CNY' },
  { value: 'JPY', label: 'JPY' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'KRW', label: 'KRW' },
] as const

const BUDGET_CURRENCY_STORAGE_KEY = 'what-should-i-eat.restaurantBudgetCurrency'

const allowedCurrencies = new Set<string>(currencyOptions.map(o => o.value))

const defaultCurrency = computed(() => (locale.value === 'zh' ? 'CNY' : 'CAD'))

function readStoredCurrency(): string | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(BUDGET_CURRENCY_STORAGE_KEY)
    if (raw && allowedCurrencies.has(raw)) return raw
  }
  catch {
    /* private mode / blocked storage */
  }
  return null
}

function persistCurrencyChoice(code: string): void {
  if (!import.meta.client) return
  try {
    if (code !== defaultCurrency.value) {
      localStorage.setItem(BUDGET_CURRENCY_STORAGE_KEY, code)
    }
    else {
      localStorage.removeItem(BUDGET_CURRENCY_STORAGE_KEY)
    }
  }
  catch {
    /* ignore */
  }
}

const form = reactive({
  area: '',
  cuisine: '',
  budget: undefined as number | undefined,
  currency: defaultCurrency.value,
})

onMounted(() => {
  const stored = readStoredCurrency()
  if (stored) form.currency = stored
})

watch(locale, () => {
  const stored = readStoredCurrency()
  form.currency = stored ?? defaultCurrency.value
})

watch(() => form.currency, persistCurrencyChoice)

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
    currency: form.currency,
  })
}
</script>
