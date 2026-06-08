/**
 * TypeScript type definitions for PakAgri Frontend
 */

export interface User {
  email: string
  full_name: string
  farm_location: string
  created_at: string
}

export interface UserRegister {
  email: string
  password: string
  full_name: string
  farm_location: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface PredictionInput {
  N: number
  P: number
  K: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  area_acres: number
}

export interface PredictionResponse {
  recommended_crop: string
  confidence: number
  yield_level: 'High' | 'Medium' | 'Low'
  estimated_production_kg: number
  advice: string
  input_data: PredictionInput
  user_email: string
  timestamp: string
  id?: string
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  r2_score: number
  mae: number
  rmse: number
  saved_at: string
}

export interface HealthResponse {
  status: string
  model_mode: 'live' | 'mock'
  timestamp: string
}
