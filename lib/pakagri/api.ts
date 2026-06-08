/**
 * API Client for PakAgri Backend
 */

import type {
  UserRegister,
  Token,
  PredictionInput,
  PredictionResponse,
  ModelMetrics
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Network error occurred')
  }
}

export async function login(email: string, password: string): Promise<Token> {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Invalid email or password')
  }
  return response.json()
}

export async function register(data: UserRegister): Promise<{ message: string }> {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function predict(input: PredictionInput, token: string): Promise<PredictionResponse> {
  return apiRequest('/predict', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export async function getPredictionHistory(token: string, limit: number = 10): Promise<PredictionResponse[]> {
  return apiRequest(`/predictions/history?limit=${limit}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  })
}

export async function getAccuracy(token?: string): Promise<ModelMetrics> {
  const headers: HeadersInit = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return apiRequest('/accuracy', { method: 'GET', headers })
}

export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pakagri_token', token)
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pakagri_token')
  }
  return null
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pakagri_token')
  }
}
