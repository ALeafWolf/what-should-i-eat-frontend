<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-bold text-cyan-600 hover:text-cyan-700 transition-colors">
        What Should I Eat?
      </NuxtLink>
      <ul class="flex items-center gap-1">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
            active-class="text-cyan-600 bg-cyan-50"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { to: '/restaurant', label: 'Restaurants' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/chat', label: 'Chat' },
]
</script>
