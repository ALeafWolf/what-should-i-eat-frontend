<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div class="capitalize">
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
        <p class="text-xs font-semibold text-green-700 mb-1">{{ t('restaurant.card.positives') }}</p>
        <ul class="space-y-0.5">
          <li v-for="p in restaurant.positives" :key="p" class="text-xs text-gray-600 flex gap-1">
            <span class="text-green-500">+</span> {{ p }}
          </li>
        </ul>
      </div>
      <div v-if="restaurant.complaints.length">
        <p class="text-xs font-semibold text-red-700 mb-1">{{ t('restaurant.card.complaints') }}</p>
        <ul class="space-y-0.5">
          <li v-for="c in restaurant.complaints" :key="c" class="text-xs text-gray-600 flex gap-1">
            <span class="text-red-400">−</span> {{ c }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Recommended dishes -->
    <div v-if="restaurant.recommendedDishes.length">
      <p class="text-xs font-semibold text-gray-600 mb-1">{{ t('restaurant.card.recommendedDishes') }}</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="dish in restaurant.recommendedDishes"
          :key="dish"
          class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
        >
          {{ dish }}
        </span>
      </div>
    </div>

    <!-- Footer: Google Maps button + sources -->
    <div class="flex items-center justify-between gap-3 pt-1 flex-wrap">
      <!-- Source icons -->
      <div class="flex items-center gap-2">
        <template v-if="restaurant.sources && restaurant.sources.length">
          <a
            v-for="src in restaurant.sources"
            :key="src.url"
            :href="src.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="src.name"
            class="text-gray-400 hover:text-cyan-500 transition-colors"
          >
            <MapPinIcon v-if="src.type === 'google_maps'" class="w-4 h-4" />
            <GlobeIcon v-else-if="src.type === 'website'" class="w-4 h-4" />
            <ExternalLinkIcon v-else class="w-4 h-4" />
          </a>
        </template>
        <span class="text-xs text-gray-400">
          {{ t('restaurant.card.basedOnReviews', restaurant.sourceCount) }}
        </span>
      </div>

      <!-- Google Maps button -->
      <a
        v-if="restaurant.googleMapsUrl"
        :href="restaurant.googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-800 border border-cyan-200 hover:border-cyan-400 rounded-lg px-2.5 py-1 transition-colors"
      >
        <MapPinIcon class="w-3.5 h-3.5" />
        {{ t('restaurant.card.viewOnGoogleMaps') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin as MapPinIcon, Globe as GlobeIcon, ExternalLink as ExternalLinkIcon } from 'lucide-vue-next'
import type { RestaurantResult } from '~/types/api'

const { t } = useI18n()

const props = defineProps<{ restaurant: RestaurantResult }>()

const confidenceClass = computed(() => ({
  'bg-green-100 text-green-700': props.restaurant.confidence === 'high',
  'bg-yellow-100 text-yellow-700': props.restaurant.confidence === 'medium',
  'bg-red-100 text-red-700': props.restaurant.confidence === 'low',
}))
</script>
