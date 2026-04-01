<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ t('home.title') }}</h1>
      <p class="text-lg text-gray-500">{{ t('home.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="group flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all"
      >
        <span class="text-5xl">{{ card.icon }}</span>
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors mb-1">
            {{ t(card.titleKey) }}
          </h2>
          <p class="text-sm text-gray-500">{{ t(card.descriptionKey) }}</p>
        </div>
        <span class="mt-auto text-sm font-medium text-cyan-600 group-hover:underline">
          {{ t('home.getStarted') }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('home.metaTitle'),
  description: () => t('home.metaDescription'),
})

const cards = [
  {
    to: '/restaurant',
    icon: '🍽️',
    titleKey: 'home.cards.restaurant.title',
    descriptionKey: 'home.cards.restaurant.description',
  },
  {
    to: '/recipes',
    icon: '🥘',
    titleKey: 'home.cards.recipe.title',
    descriptionKey: 'home.cards.recipe.description',
  },
  {
    to: '/chat',
    icon: '💬',
    titleKey: 'home.cards.chat.title',
    descriptionKey: 'home.cards.chat.description',
  },
]
</script>
