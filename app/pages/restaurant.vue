<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Restaurant Search</h1>
      <p class="text-sm text-gray-500">Find the best restaurants in your area.</p>
    </div>

    <RestaurantSearchForm :disabled="loading" @submit="onSearch" />

    <!-- Error -->
    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
      <svg class="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span class="ml-3 text-sm">Searching restaurants…</span>
    </div>

    <!-- Results -->
    <template v-if="result && !loading">
      <div v-if="result.finalRecommendation" class="bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-4">
        <p class="text-xs font-semibold text-cyan-700 mb-1">AI Recommendation</p>
        <p class="text-sm text-gray-800">{{ result.finalRecommendation }}</p>
      </div>

      <div v-if="result.restaurants.length" class="space-y-4">
        <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {{ result.restaurants.length }} result{{ result.restaurants.length !== 1 ? 's' : '' }}
        </h2>
        <RestaurantCard
          v-for="r in result.restaurants"
          :key="r.id"
          :restaurant="r"
        />
      </div>

      <p v-else class="text-sm text-gray-500 text-center py-8">No restaurants found. Try adjusting your search.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RestaurantResponse, RestaurantSearchRequest } from '~/types/api'

const { loading, error, searchRestaurants } = useApi()
const result = ref<RestaurantResponse | null>(null)

async function onSearch(params: RestaurantSearchRequest) {
  result.value = null
  result.value = await searchRestaurants(params)
}
</script>
