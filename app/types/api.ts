export type Confidence = 'high' | 'medium' | 'low'
export type Difficulty = 'easy' | 'medium' | 'hard'

// ---------- Restaurant ----------

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
}

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
