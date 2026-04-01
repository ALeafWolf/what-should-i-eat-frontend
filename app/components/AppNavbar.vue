<template>
  <nav class="w-14 shrink-0 sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-4 z-50">
    <NuxtLink
      to="/"
      class="w-9 h-9 flex items-center justify-center rounded-xl text-cyan-600 hover:bg-cyan-50 transition-colors mb-4"
      :aria-label="t('nav.home')"
      :title="t('nav.home')"
    >
      <HomeIcon :size="20" />
    </NuxtLink>

    <div class="flex flex-col items-center gap-1 flex-1">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
        active-class="text-cyan-600 bg-cyan-50"
        :aria-label="t(link.labelKey)"
        :title="t(link.labelKey)"
      >
        <component :is="link.icon" :size="20" />
      </NuxtLink>
    </div>

    <button
      class="w-9 h-9 flex flex-col items-center justify-center rounded-xl text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors gap-0.5"
      :aria-label="t('nav.switchLangLabel')"
      :title="t('nav.switchLangLabel')"
      @click="toggleLocale"
    >
      <Languages :size="16" />
      <span class="text-[9px] font-bold leading-none tracking-wide">{{ locale === 'en' ? 'EN' : '中' }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Home as HomeIcon, UtensilsCrossed, ChefHat, MessageCircle, Languages } from 'lucide-vue-next'

const { t, locale, setLocale } = useI18n()

const links = [
  { to: '/restaurant', labelKey: 'nav.restaurant', icon: UtensilsCrossed },
  { to: '/recipes', labelKey: 'nav.recipe', icon: ChefHat },
  { to: '/chat', labelKey: 'nav.chat', icon: MessageCircle },
]

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}
</script>
