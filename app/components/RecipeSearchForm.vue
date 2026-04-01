<template>
  <form class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-lg font-semibold text-gray-800">{{ t('recipe.form.title') }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('recipe.form.ingredients') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="ingredientsInput"
          type="text"
          :placeholder="t('recipe.form.ingredientsPlaceholder')"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t('recipe.form.commaSeparated') }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('recipe.form.exclusions') }}</label>
        <input
          v-model="exclusionsInput"
          type="text"
          :placeholder="t('recipe.form.exclusionsPlaceholder')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t('recipe.form.commaSeparated') }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('recipe.form.cookingTime') }}</label>
        <input
          v-model.number="form.cookingTime"
          type="number"
          min="1"
          :placeholder="t('recipe.form.cookingTimePlaceholder')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('recipe.form.difficulty') }}</label>
        <select
          v-model="form.difficulty"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
        >
          <option value="">{{ t('recipe.form.difficultyAny') }}</option>
          <option value="easy">{{ t('recipe.form.difficultyEasy') }}</option>
          <option value="medium">{{ t('recipe.form.difficultyMedium') }}</option>
          <option value="hard">{{ t('recipe.form.difficultyHard') }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('recipe.form.servings') }}</label>
        <input
          v-model.number="form.servings"
          type="number"
          min="1"
          :placeholder="t('recipe.form.servingsPlaceholder')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>
    </div>

    <button
      type="submit"
      :disabled="disabled"
      class="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors text-sm"
    >
      {{ disabled ? t('recipe.form.searching') : t('recipe.form.search') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { RecipeSearchRequest, Difficulty } from '~/types/api'

const { t } = useI18n()

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [data: RecipeSearchRequest] }>()

const ingredientsInput = ref('')
const exclusionsInput = ref('')
const form = reactive({
  cookingTime: undefined as number | undefined,
  difficulty: '' as Difficulty | '',
  servings: undefined as number | undefined,
})

function handleSubmit() {
  const ingredients = ingredientsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  if (!ingredients.length) return

  const exclusions = exclusionsInput.value.split(',').map(s => s.trim()).filter(Boolean)

  emit('submit', {
    ingredients,
    ...(exclusions.length ? { exclusions } : {}),
    ...(form.cookingTime ? { cookingTime: form.cookingTime } : {}),
    ...(form.difficulty ? { difficulty: form.difficulty as Difficulty } : {}),
    ...(form.servings ? { servings: form.servings } : {}),
  })
}
</script>
