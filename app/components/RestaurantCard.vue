<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-base font-semibold text-gray-900">{{ restaurant.name }}</h3>
        <p class="text-sm text-gray-500">{{ restaurant.area }} · {{ restaurant.cuisine }} · {{ restaurant.priceRange }}</p>
      </div>
      <span
        class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="confidenceClass"
      >
        {{ restaurant.confidence }}
      </span>
    </div>

    <!-- Review summary -->
    <p class="text-sm text-gray-700">{{ restaurant.reviewSummary }}</p>

    <!-- Positives & complaints -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-if="restaurant.positives.length">
        <p class="text-xs font-semibold text-green-700 mb-1">Positives</p>
        <ul class="space-y-0.5">
          <li v-for="(p, i) in restaurant.positives" :key="i" class="text-xs text-gray-600 flex gap-1">
            <span class="text-green-500">+</span> {{ p }}
          </li>
        </ul>
      </div>
      <div v-if="restaurant.complaints.length">
        <p class="text-xs font-semibold text-red-700 mb-1">Complaints</p>
        <ul class="space-y-0.5">
          <li v-for="(c, i) in restaurant.complaints" :key="i" class="text-xs text-gray-600 flex gap-1">
            <span class="text-red-400">−</span> {{ c }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Recommended dishes -->
    <div v-if="restaurant.recommendedDishes.length">
      <p class="text-xs font-semibold text-gray-600 mb-1">Recommended dishes</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(dish, i) in restaurant.recommendedDishes"
          :key="i"
          class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
        >
          {{ dish }}
        </span>
      </div>
    </div>

    <p class="text-xs text-gray-400">Based on {{ restaurant.sourceCount }} source{{ restaurant.sourceCount !== 1 ? 's' : '' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { RestaurantResult } from '~/types/api'

const props = defineProps<{ restaurant: RestaurantResult }>()

const confidenceClass = computed(() => ({
  'bg-green-100 text-green-700': props.restaurant.confidence === 'high',
  'bg-yellow-100 text-yellow-700': props.restaurant.confidence === 'medium',
  'bg-red-100 text-red-700': props.restaurant.confidence === 'low',
}))
</script>
