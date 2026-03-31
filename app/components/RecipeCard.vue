<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-base font-semibold text-gray-900">{{ recipe.name }}</h3>
        <p class="text-sm text-gray-500">{{ recipe.estimatedTime }} · {{ recipe.source }}</p>
      </div>
      <span
        class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
        :class="difficultyClass"
      >
        {{ recipe.difficulty }}
      </span>
    </div>

    <!-- Fit reason -->
    <p class="text-sm text-gray-700 italic">{{ recipe.fitReason }}</p>

    <!-- Ingredients -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-if="recipe.matchedIngredients.length">
        <p class="text-xs font-semibold text-green-700 mb-1">Matched ingredients</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(ing, i) in recipe.matchedIngredients"
            :key="i"
            class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
          >
            {{ ing }}
          </span>
        </div>
      </div>
      <div v-if="recipe.missingIngredients.length">
        <p class="text-xs font-semibold text-orange-700 mb-1">Missing ingredients</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(ing, i) in recipe.missingIngredients"
            :key="i"
            class="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
          >
            {{ ing }}
          </span>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div v-if="recipe.steps.length">
      <button
        type="button"
        class="text-xs font-semibold text-cyan-600 hover:underline"
        @click="stepsOpen = !stepsOpen"
      >
        {{ stepsOpen ? 'Hide steps ▲' : 'Show steps ▼' }}
      </button>
      <ol v-if="stepsOpen" class="mt-2 space-y-1 list-decimal list-inside">
        <li v-for="(step, i) in recipe.steps" :key="i" class="text-xs text-gray-700">
          {{ step }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeResult } from '~/types/api'

const props = defineProps<{ recipe: RecipeResult }>()

const stepsOpen = ref(false)

const difficultyClass = computed(() => ({
  'bg-green-100 text-green-700': props.recipe.difficulty === 'easy',
  'bg-yellow-100 text-yellow-700': props.recipe.difficulty === 'medium',
  'bg-red-100 text-red-700': props.recipe.difficulty === 'hard',
}))
</script>
