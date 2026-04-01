<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ t('recipe.pageTitle') }}</h1>
      <p class="text-sm text-gray-500">{{ t('recipe.subtitle') }}</p>
    </div>

    <RecipeSearchForm :disabled="loading" @submit="onSearch" />

    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
      {{ error }}
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span class="ml-3 text-sm text-gray-400">{{ t('recipe.loading') }}</span>
    </div>

    <template v-if="result && !loading">
      <div v-if="result.finalRecommendation" class="bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-4">
        <p class="text-xs font-semibold text-cyan-700 mb-1">{{ t('recipe.aiRecommendation') }}</p>
        <p class="text-sm text-gray-800">{{ result.finalRecommendation }}</p>
      </div>

      <div v-if="result.recipes.length" class="space-y-4">
        <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {{ t('recipe.resultCount', result.recipes.length) }}
        </h2>
        <RecipeCard
          v-for="(r, i) in result.recipes"
          :key="i"
          :recipe="r"
        />
      </div>

      <p v-else class="text-sm text-gray-500 text-center py-8">{{ t('recipe.noResults') }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RecipeResponse, RecipeSearchRequest } from '~/types/api'

const { t } = useI18n()

useSeoMeta({
  title: () => t('recipe.metaTitle'),
  description: () => t('recipe.metaDescription'),
})

const { loading, error, searchRecipes } = useApi()
const result = ref<RecipeResponse | null>(null)

async function onSearch(params: RecipeSearchRequest) {
  result.value = null
  result.value = await searchRecipes(params)
}
</script>
