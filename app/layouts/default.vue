<template>
  <div class="flex min-h-screen bg-gray-50">
    <AppNavbar />
    <main class="flex-1 min-w-0">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>
