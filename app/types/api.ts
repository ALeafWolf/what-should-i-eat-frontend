export type Confidence = 'high' | 'medium' | 'low'
export type Difficulty = 'easy' | 'medium' | 'hard'

// ---------- Restaurant ----------

export interface RestaurantSource {
  type: string
  url: string
  name: string
}

export interface RestaurantResult {
  id: string
  name: string
  area: string
  cuisine: string
  priceRange: string
  reviewSummary: string
  positives: string[]
  complaints: string[]
  recommendedDishes: string[]
  sourceCount: number
  confidence: Confidence
  googleMapsUrl?: string
  sources?: RestaurantSource[]
}

export interface RestaurantResponse {
  restaurants: RestaurantResult[]
  finalRecommendation: string
}

export interface RestaurantSearchRequest {
  area: string
  cuisine: string
  budget?: number
  preferences?: string[]
  sessionId?: string
  language?: string
  currency?: string
}

/** Progress step shown while streaming workflow SSE (e.g. restaurant search). */
export type StreamStepStatus = 'active' | 'done' | 'error'

export interface StreamStep {
  id: string
  label: string
  status: StreamStepStatus
}

export type SseEvent =
  | { type: 'status'; message: string }
  | { type: 'partial'; data: unknown }
  | { type: 'warning'; message: string }
  | { type: 'done'; data: unknown }
  | { type: 'error'; message: string; code: string }
  | { type: 'step_start'; stepId: string; label: string }
  | { type: 'step_done'; stepId: string }
  | { type: 'step_error'; stepId: string; message: string }

// ---------- Recipe ----------

export interface RecipeResult {
  name: string
  matchedIngredients: string[]
  missingIngredients: string[]
  estimatedTime: string
  difficulty: Difficulty
  source: string
  steps: string[]
  fitReason: string
}

export interface RecipeResponse {
  recipes: RecipeResult[]
  finalRecommendation: string
}

export interface RecipeSearchRequest {
  ingredients: string[]
  exclusions?: string[]
  cookingTime?: number
  difficulty?: Difficulty
  servings?: number
  sessionId?: string
}

// ---------- Chat ----------

export interface ChatResponse {
  message: string
  sessionId?: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
}
