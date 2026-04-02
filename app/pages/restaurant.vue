<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">
        {{ t("restaurant.pageTitle") }}
      </h1>
      <p class="text-sm text-gray-500">{{ t("restaurant.subtitle") }}</p>
    </div>

    <RestaurantSearchForm :disabled="loading" @submit="onSearch" />

    <div
      v-if="error"
      class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm"
    >
      {{ error }}
    </div>

    <div v-if="warnings.length" class="space-y-2">
      <div
        v-for="(w, i) in warnings"
        :key="i"
        class="rounded-lg bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 text-sm flex items-center justify-between"
      >
        <span>{{ w }}</span>
        <button
          class="ml-3 text-amber-400 hover:text-amber-600"
          @click="dismissWarning(i)"
        >
          &times;
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-16 text-gray-400"
    >
      <svg
        class="animate-spin h-8 w-8 text-cyan-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
      <span class="ml-3 text-sm">{{
        statusMessage || t("restaurant.loading")
      }}</span>
    </div>

    <template v-if="results && !loading">
      <div
        v-if="results.finalRecommendation"
        class="bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-4"
      >
        <p class="text-xs font-semibold text-cyan-700 mb-1">
          {{ t("restaurant.aiRecommendation") }}
        </p>
        <p class="text-sm text-gray-800">{{ results.finalRecommendation }}</p>
      </div>

      <div v-if="results.restaurants.length" class="space-y-4">
        <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {{ t("restaurant.resultCount", results.restaurants.length) }}
        </h2>
        <RestaurantCard
          v-for="r in paginatedRestaurants"
          :key="r.id"
          :restaurant="r"
        />

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-2 pt-2"
        >
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
            @click="currentPage--"
          >
            {{ t("restaurant.pagination.prev") }}
          </button>

          <button
            v-for="page in pageNumbers"
            :key="page"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg border transition-colors',
              page === currentPage
                ? 'bg-cyan-500 border-cyan-500 text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50',
            ]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
            @click="currentPage++"
          >
            {{ t("restaurant.pagination.next") }}
          </button>
        </div>
        <p v-if="totalPages > 1" class="text-xs text-center text-gray-400">
          {{
            t("restaurant.pagination.pageOf", {
              current: currentPage,
              total: totalPages,
            })
          }}
        </p>
      </div>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        {{ t("restaurant.noResults") }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RestaurantSearchRequest } from "~/types/api";

const { t } = useI18n();

useSeoMeta({
  title: () => t("restaurant.metaTitle"),
  description: () => t("restaurant.metaDescription"),
});

const {
  loading,
  statusMessage,
  warnings,
  results,
  error,
  streamRestaurants,
  reset,
  dismissWarning,
} = useRestaurantStream();

const PAGE_SIZE = 10;
const currentPage = ref(1);

const totalPages = computed(() => {
  const count = results.value?.restaurants.length ?? 0;
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
});

const paginatedRestaurants = computed(() => {
  const all = results.value?.restaurants ?? [];
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return all.slice(start, start + PAGE_SIZE);
});

const pageNumbers = computed(() => {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  return pages;
});

async function onSearch(params: RestaurantSearchRequest) {
  reset();
  currentPage.value = 1;
  await streamRestaurants(params);
}
</script>
