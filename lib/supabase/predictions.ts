'use client'

import { supabase } from './client'

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

export interface Prediction {
  id: string
  user_id: string
  recommended_crop: string
  confidence: number
  yield_level: 'High' | 'Medium' | 'Low'
  estimated_production_kg: number
  advice: string
  n: number
  p: number
  k: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  area_acres: number
  created_at: string
}

const CROP_DATA: Record<string, { conditions: (f: number[]) => boolean; emoji: string }> = {
  rice: {
    conditions: (f) => f[6] > 200 && f[4] > 80, // high rainfall, high humidity
    emoji: '🌾',
  },
  cotton: {
    conditions: (f) => f[3] > 30 && f[6] < 100, // high temp, low rainfall
    emoji: '☁️',
  },
  wheat: {
    conditions: (f) => f[3] < 20 && f[6] < 100, // low temp, low rainfall
    emoji: '🌾',
  },
  maize: {
    conditions: (f) => f[5] < 6.5 && f[6] > 150, // acidic soil, good rainfall
    emoji: '🌽',
  },
  sugarcane: {
    conditions: (f) => f[0] > 80 && f[6] > 150, // high nitrogen, good rainfall
    emoji: '🎋',
  },
  chickpea: {
    conditions: (f) => f[0] > 50 && f[1] > 40, // good N and P
    emoji: '🫘',
  },
  mango: {
    conditions: (f) => f[4] > 70 && f[3] > 25, // warm and humid
    emoji: '🥭',
  },
  banana: {
    conditions: (f) => f[6] > 150 && f[3] > 20, // good rainfall, warm
    emoji: '🍌',
  },
  lentil: {
    conditions: (f) => true, // fallback
    emoji: '🫘',
  },
}

const CROP_EMOJIS: Record<string, string> = {
  rice: '🌾',
  maize: '🌽',
  chickpea: '🫘',
  wheat: '🌾',
  cotton: '☁️',
  sugarcane: '🎋',
  mango: '🥭',
  banana: '🍌',
  lentil: '🫘',
  coffee: '☕',
}

export function predictCropAndYield(features: number[], areaAcres: number): {
  crop: string
  confidence: number
  yieldLevel: 'High' | 'Medium' | 'Low'
  yieldKg: number
  advice: string
} {
  // Determine crop based on conditions
  let selectedCrop = 'lentil'
  for (const [crop, data] of Object.entries(CROP_DATA)) {
    if (data.conditions(features)) {
      selectedCrop = crop
      break
    }
  }

  // Calculate confidence
  const confidence = Math.min(95, Math.max(65, 72 + (features[0] % 20) + features[5] * 0.5))

  // Calculate yield
  const [N, P, K, temp, humidity, ph, rainfall] = features
  const baseYield = 2500 + (features[2] * 3) + (features[6] * 0.5) - (Math.abs(features[5] - 6.5) * 100)
  const yieldKg = Math.max(500, baseYield * areaAcres)

  let yieldLevel: 'High' | 'Medium' | 'Low'
  if (baseYield > 3500) {
    yieldLevel = 'High'
  } else if (baseYield > 2000) {
    yieldLevel = 'Medium'
  } else {
    yieldLevel = 'Low'
  }

  // Generate advice
  const advice = generateAdvice(selectedCrop, yieldLevel, features)

  return {
    crop: selectedCrop,
    confidence: Math.round(confidence * 100) / 100,
    yieldLevel,
    yieldKg: Math.round(yieldKg * 100) / 100,
    advice,
  }
}

function generateAdvice(crop: string, yieldLevel: string, features: number[]): string {
  const [N, P, K, temp, humidity, ph, rainfall] = features
  const tips: string[] = []

  if (N < 30) tips.push('Increase nitrogen fertilizer (e.g., urea) for better growth.')
  if (ph < 5.5) tips.push('Soil is too acidic — apply lime to raise pH.')
  if (ph > 8.0) tips.push('Soil is alkaline — consider sulfur treatment.')
  if (rainfall < 50) tips.push('Low rainfall detected — ensure irrigation availability.')
  if (yieldLevel === 'Low') tips.push('Consider soil testing and consulting local agriculture extension.')

  if (tips.length === 0) {
    tips.push(`Conditions are well-suited for ${crop}. Maintain current soil health practices.`)
  }

  return tips.join(' ')
}

export async function savePrediction(
  userId: string,
  input: PredictionInput,
  prediction: ReturnType<typeof predictCropAndYield>
): Promise<Prediction | null> {
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      user_id: userId,
      recommended_crop: prediction.crop,
      confidence: prediction.confidence,
      yield_level: prediction.yieldLevel,
      estimated_production_kg: prediction.yieldKg,
      advice: prediction.advice,
      n: input.N,
      p: input.P,
      k: input.K,
      temperature: input.temperature,
      humidity: input.humidity,
      ph: input.ph,
      rainfall: input.rainfall,
      area_acres: input.area_acres,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving prediction:', error)
    return null
  }

  return data
}

export async function getPredictionHistory(userId: string, limit: number = 10): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching predictions:', error)
    return []
  }

  return data || []
}

export function getCropEmoji(crop: string): string {
  return CROP_EMOJIS[crop.toLowerCase()] || '🌱'
}
