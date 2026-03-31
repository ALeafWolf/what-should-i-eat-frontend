<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-800">Search Recipes</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Ingredients <span class="text-red-500">*</span></label>
        <input
          v-model="ingredientsInput"
          type="text"
          placeholder="e.g. chicken, garlic, lemon"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">Comma-separated values</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
        <input
          v-model="exclusionsInput"
          type="text"
          placeholder="e.g. nuts, dairy"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">Comma-separated values</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Cooking Time (min)</label>
        <input
          v-model.number="form.cookingTime"
          type="number"
          min="1"
          placeholder="e.g. 30"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
        <select
          v-model="form.difficulty"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
        >
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Servings</label>
        <input
          v-model.number="form.servings"
          type="number"
          min="1"
          placeholder="e.g. 2"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>
    </div>

    <button
      type="submit"
      :disabled="disabled"
      class="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors text-sm"
    >
      {{ disabled ? 'Searching…' : 'Search' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { RecipeSearchRequest, Difficulty } from '~/types/api'

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
