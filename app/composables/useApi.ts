import type {
  RestaurantSearchRequest,
  RestaurantResponse,
  RecipeSearchRequest,
  RecipeResponse,
  ChatRequest,
  ChatResponse,
  SseEvent,
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

  async function searchRecipes(params: RecipeSearchRequest) {
    return request<RecipeResponse>('/api/recipes', { method: 'POST', body: params })
  }

  async function sendChatMessage(params: ChatRequest) {
    return request<ChatResponse>('/api/chat', { method: 'POST', body: params })
  }

  return { loading, error, checkHealth, searchRecipes, sendChatMessage }
}

export function useRestaurantStream() {
  const loading = ref(false)
  const statusMessage = ref('')
  const warnings = ref<string[]>([])
  const results = ref<RestaurantResponse | null>(null)
  const error = ref<string | null>(null)
  const { locale } = useI18n()

  let abortController: AbortController | null = null

  function abort() {
    abortController?.abort()
  }

  function reset() {
    results.value = null
  }

  function dismissWarning(index: number) {
    warnings.value.splice(index, 1)
  }

  onUnmounted(() => abort())

  async function streamRestaurants(params: RestaurantSearchRequest) {
    loading.value = true
    statusMessage.value = ''
    warnings.value = []
    results.value = null
    error.value = null

    abortController = new AbortController()

    const enrichedParams: RestaurantSearchRequest = {
      ...params,
      language: params.language ?? locale.value,
    }

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedParams),
        signal: abortController.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue

          const json = trimmed.slice(5).trim()
          if (!json) continue

          let event: SseEvent
          try {
            event = JSON.parse(json)
          }
          catch {
            continue
          }

          switch (event.type) {
            case 'status':
              statusMessage.value = event.message ?? ''
              break
            case 'warning':
              warnings.value.push(event.message ?? '')
              break
            case 'done':
              results.value = event.data as RestaurantResponse
              break
            case 'error':
              error.value = event.message ?? 'Unknown error'
              break
          }
        }
      }
    }
    catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      error.value = e instanceof Error ? e.message : 'An unexpected error occurred'
    }
    finally {
      loading.value = false
      abortController = null
    }
  }

  return {
    loading,
    statusMessage,
    warnings,
    results,
    error,
    streamRestaurants,
    abort,
    reset,
    dismissWarning,
  }
}
