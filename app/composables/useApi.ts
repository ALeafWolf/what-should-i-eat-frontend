import type {
  RestaurantSearchRequest,
  RestaurantResponse,
  RecipeSearchRequest,
  RecipeResponse,
  ChatRequest,
  ChatResponse,
} from '~/types/api'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function request<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      return await $fetch<T>(url, options)
    }
    catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An unexpected error occurred'
      return null
    }
    finally {
      loading.value = false
    }
  }

  async function checkHealth() {
    return request<{ status: string }>('/api/health')
  }

  async function searchRestaurants(params: RestaurantSearchRequest) {
    return request<RestaurantResponse>('/api/restaurants', { method: 'POST', body: params })
  }

  async function searchRecipes(params: RecipeSearchRequest) {
    return request<RecipeResponse>('/api/recipes', { method: 'POST', body: params })
  }

  async function sendChatMessage(params: ChatRequest) {
    return request<ChatResponse>('/api/chat', { method: 'POST', body: params })
  }

  return { loading, error, checkHealth, searchRestaurants, searchRecipes, sendChatMessage }
}
