<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">What Should I Eat?</h1>
      <p class="text-lg text-gray-500">Find a restaurant, get a recipe idea, or just ask.</p>
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
            {{ card.title }}
          </h2>
          <p class="text-sm text-gray-500">{{ card.description }}</p>
        </div>
        <span class="mt-auto text-sm font-medium text-cyan-600 group-hover:underline">
          Get started →
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  {
    to: '/restaurant',
    icon: '🍽️',
    title: 'Restaurant Search',
    description: 'Find the best restaurants in your area by cuisine, budget, and preferences.',
  },
  {
    to: '/recipes',
    icon: '🥘',
    title: 'Recipe Search',
    description: 'Discover recipes based on what ingredients you already have at home.',
  },
  {
    to: '/chat',
    icon: '💬',
    title: 'Chat',
    description: 'Ask anything about food, restaurants, or cooking in a free-form conversation.',
  },
]
</script>
