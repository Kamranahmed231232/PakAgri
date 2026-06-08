'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wheat, LogOut, History, Droplets, Thermometer, CloudRain, Scale, MapPin, Lightbulb,
  TrendingUp, Activity, PieChart, BarChart3, Calendar, Target, Award, Zap, Sun, Wind,
  Leaf, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'
import { predictCropAndYield, savePrediction, getPredictionHistory, getCropEmoji, type Prediction } from '@/lib/supabase/predictions'
import LoadingSpinner from '@/components/pakagri/LoadingSpinner'

function SliderField({ label, labelUrdu, value, onChange, min, max, step = 1, icon, unit = '' }: {
  label: string
  labelUrdu: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  icon: React.ReactNode
  unit?: string
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-pakagri-earth-dark font-medium">
          {icon}
          <span>{label}</span>
          <span className="font-urdu text-pakagri-earth text-sm">{labelUrdu}</span>
        </label>
        <span className="text-pakagri-primary font-semibold bg-pakagri-primary/10 px-4 py-1.5 rounded-lg text-lg">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <div className="relative">
        <div className="w-full h-2 bg-pakagri-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pakagri-primary to-pakagri-gold rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-pakagri-earth/60">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

interface PredictionResult {
  crop: string
  confidence: number
  yieldLevel: 'High' | 'Medium' | 'Low'
  yieldKg: number
  advice: string
}

// Simple chart components
function CropDistributionChart({ history }: { history: Prediction[] }) {
  const cropCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    history.forEach(p => {
      counts[p.recommended_crop] = (counts[p.recommended_crop] || 0) + 1
    })
    return Object.entries(counts).slice(0, 6)
  }, [history])

  const colors = ['#1a4a2e', '#d4a926', '#2d6a4f', '#e8c547', '#40916c', '#1b4332']

  if (cropCounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-pakagri-earth/50">
        No prediction data yet
      </div>
    )
  }

  const total = cropCounts.reduce((sum, [_, count]) => sum + count, 0)

  return (
    <div className="space-y-3">
      {cropCounts.map(([crop, count], index) => {
        const percentage = (count / total) * 100
        return (
          <div key={crop} className="flex items-center gap-3">
            <span className="text-xl w-8">{getCropEmoji(crop)}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="capitalize font-medium text-pakagri-earth-dark">{crop}</span>
                <span className="text-sm text-pakagri-earth">{count} predictions</span>
              </div>
              <div className="h-3 bg-pakagri-cream rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-pakagri-primary w-12 text-right">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

function YieldTrendChart({ history }: { history: Prediction[] }) {
  const recentYields = useMemo(() => {
    return history.slice(0, 7).reverse().map((p, i) => ({
      day: i + 1,
      yield: p.estimated_production_kg,
      crop: p.recommended_crop
    }))
  }, [history])

  if (recentYields.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-pakagri-earth/50">
        No yield data yet
      </div>
    )
  }

  const maxYield = Math.max(...recentYields.map(d => d.yield), 1)

  return (
    <div className="w-full h-48 flex items-end justify-center gap-3 px-2">
      {recentYields.map((data, index) => {
        const heightPercent = (data.yield / maxYield) * 100
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 min-w-[40px]">
            <div className="relative w-full flex items-end justify-center h-32">
              <div
                className="w-10 bg-gradient-to-t from-pakagri-primary to-pakagri-gold rounded-t-lg transition-all duration-700 hover:from-pakagri-gold hover:to-pakagri-gold-light cursor-pointer group relative shadow-md"
                style={{ height: `${Math.max(heightPercent, 8)}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-pakagri-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-semibold">
                  {data.yield.toFixed(0)} kg
                </div>
              </div>
            </div>
            <span className="text-xs text-pakagri-earth font-medium">Day {data.day}</span>
          </div>
        )
      })}
    </div>
  )
}

function ConfidencePieChart({ prediction }: { prediction: PredictionResult | null }) {
  if (!prediction) return null

  const segments = [
    { label: 'Confidence', value: prediction.confidence, color: '#d4a926' },
    { label: 'Uncertainty', value: 100 - prediction.confidence, color: '#e5e5d5' }
  ]

  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = (segments[0].value / 100) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#e5e5d5"
          strokeWidth="12"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#d4a926"
          strokeWidth="12"
          strokeDasharray={`${offset} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-pakagri-primary">{prediction.confidence.toFixed(0)}%</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'predict' | 'history' | 'analytics'>('predict')
  const router = useRouter()

  const [N, setN] = useState(90)
  const [P, setP] = useState(42)
  const [K, setK] = useState(43)
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity] = useState(80)
  const [ph, setPh] = useState(6.5)
  const [rainfall, setRainfall] = useState(200)
  const [areaAcres, setAreaAcres] = useState(1.0)

  // Calculate soil health score
  const soilHealthScore = useMemo(() => {
    let score = 50
    if (N >= 40 && N <= 100) score += 10
    if (P >= 30 && P <= 80) score += 10
    if (K >= 30 && K <= 80) score += 10
    if (ph >= 6.0 && ph <= 7.5) score += 20
    return Math.min(100, score)
  }, [N, P, K, ph])

  const weatherCondition = useMemo(() => {
    if (temperature > 30 && humidity < 50) return { status: 'Hot & Dry', icon: Sun, color: 'text-orange-500' }
    if (temperature < 15) return { status: 'Cold', icon: Wind, color: 'text-blue-500' }
    if (rainfall > 200) return { status: 'Rainy', icon: CloudRain, color: 'text-blue-400' }
    if (humidity > 80) return { status: 'Humid', icon: Droplets, color: 'text-cyan-500' }
    return { status: 'Moderate', icon: Activity, color: 'text-green-500' }
  }, [temperature, humidity, rainfall])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      loadHistory()
    }
  }, [user, authLoading, router])

  const loadHistory = async () => {
    if (user) {
      const data = await getPredictionHistory(user.id, 20)
      setHistory(data)
    }
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    const input = { N, P, K, temperature, humidity, ph, rainfall, area_acres: areaAcres }
    const features = [N, P, K, temperature, humidity, ph, rainfall]
    const result = predictCropAndYield(features, areaAcres)

    setPrediction(result)

    await savePrediction(user.id, input, result)
    await loadHistory()

    setIsLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pakagri-cream flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    )
  }

  if (!user) return null

  const yieldTrend = history.length >= 2
    ? history[0].estimated_production_kg - history[1].estimated_production_kg
    : 0

  const avgConfidence = history.length > 0
    ? history.reduce((sum, p) => sum + p.confidence, 0) / history.length
    : 0

  const statCards = [
    {
      label: 'Total Predictions',
      value: history.length,
      icon: Target,
      color: 'bg-pakagri-primary',
      trend: null
    },
    {
      label: 'Avg Confidence',
      value: `${avgConfidence.toFixed(1)}%`,
      icon: Activity,
      color: 'bg-pakagri-gold',
      trend: avgConfidence > 80 ? 'up' : avgConfidence > 60 ? 'neutral' : 'down'
    },
    {
      label: 'Yield Trend',
      value: yieldTrend >= 0 ? `+${Math.abs(yieldTrend).toFixed(0)} kg` : `-${Math.abs(yieldTrend).toFixed(0)} kg`,
      icon: TrendingUp,
      color: yieldTrend >= 0 ? 'bg-green-500' : 'bg-red-500',
      trend: yieldTrend > 0 ? 'up' : yieldTrend < 0 ? 'down' : 'neutral'
    },
    {
      label: 'Top Crop',
      value: history.length > 0
        ? history.reduce((a, b) =>
          history.filter(p => p.recommended_crop === a.recommended_crop).length >=
          history.filter(p => p.recommended_crop === b.recommended_crop).length ? a : b
        ).recommended_crop
        : '-',
      icon: Wheat,
      color: 'bg-pakagri-primary-light',
      trend: null
    }
  ]

  return (
    <div className="min-h-screen bg-pakagri-cream">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-pakagri-cream-dark sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'predict', label: 'Predict', icon: Target },
              { id: 'history', label: 'History', icon: History },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-pakagri-primary border-pakagri-gold'
                    : 'text-pakagri-earth border-transparent hover:text-pakagri-primary hover:border-pakagri-cream-dark'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="pakagri-card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-pakagri-earth truncate">{stat.label}</p>
                <div className="flex items-center gap-1">
                  <p className="font-display text-xl text-pakagri-primary truncate capitalize">{stat.value}</p>
                  {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500 flex-shrink-0" />}
                  {stat.trend === 'neutral' && <Minus className="w-4 h-4 text-pakagri-earth/50 flex-shrink-0" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div>
              <div className="pakagri-card">
                {/* Quick Stats Bar */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-pakagri-cream rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-pakagri-earth">Soil Health</span>
                      <span className="text-sm font-bold text-pakagri-primary">{soilHealthScore}%</span>
                    </div>
                    <div className="h-2 bg-pakagri-cream-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          soilHealthScore >= 80 ? 'bg-green-500' :
                          soilHealthScore >= 60 ? 'bg-pakagri-gold' : 'bg-red-500'
                        }`}
                        style={{ width: `${soilHealthScore}%` }}
                      />
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${weatherCondition.color}`}>
                    <weatherCondition.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{weatherCondition.status}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="font-display text-2xl text-pakagri-primary mb-2">Crop Recommendation</h2>
                  <p className="text-pakagri-earth">Enter your soil and weather data</p>
                  <p className="font-urdu text-pakagri-gold">اپنی مٹی اور موسم کا ڈیٹا درج کریں</p>
                </div>

                <form onSubmit={handlePredict} className="space-y-6">
                  {/* Nutrients */}
                  <div className="space-y-4 p-4 bg-pakagri-primary/5 rounded-xl">
                    <h3 className="font-display text-lg text-pakagri-primary flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-pakagri-gold" />
                      Soil Nutrients
                    </h3>
                    <SliderField
                      label="Nitrogen (N)" labelUrdu="نائٹروجن"
                      value={N} onChange={setN} min={0} max={150}
                      icon={<span className="w-6 h-6 bg-pakagri-primary text-white text-xs rounded flex items-center justify-center font-bold">N</span>}
                    />
                    <SliderField
                      label="Phosphorus (P)" labelUrdu="فاسفورس"
                      value={P} onChange={setP} min={0} max={150}
                      icon={<span className="w-6 h-6 bg-pakagri-gold text-pakagri-primary text-xs rounded flex items-center justify-center font-bold">P</span>}
                    />
                    <SliderField
                      label="Potassium (K)" labelUrdu="پوٹاشیم"
                      value={K} onChange={setK} min={0} max={250}
                      icon={<span className="w-6 h-6 bg-pakagri-primary text-white text-xs rounded flex items-center justify-center font-bold">K</span>}
                    />
                  </div>

                  {/* Weather */}
                  <div className="space-y-4 p-4 bg-pakagri-gold/5 rounded-xl">
                    <h3 className="font-display text-lg text-pakagri-primary flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-pakagri-gold" />
                      Weather Conditions
                    </h3>
                    <SliderField
                      label="Temperature" labelUrdu="درجہ حرارت"
                      value={temperature} onChange={setTemperature} min={0} max={50} unit="C"
                      icon={<Thermometer className="w-4 h-4 text-pakagri-gold" />}
                    />
                    <SliderField
                      label="Humidity" labelUrdu="نمی"
                      value={humidity} onChange={setHumidity} min={0} max={100} unit="%"
                      icon={<Droplets className="w-4 h-4 text-pakagri-gold" />}
                    />
                    <SliderField
                      label="pH Value" labelUrdu="پی ایچ"
                      value={ph} onChange={setPh} min={0} max={14} step={0.1}
                      icon={<Scale className="w-4 h-4 text-pakagri-gold" />}
                    />
                    <SliderField
                      label="Rainfall" labelUrdu="بارش"
                      value={rainfall} onChange={setRainfall} min={0} max={400} unit="mm"
                      icon={<CloudRain className="w-4 h-4 text-pakagri-gold" />}
                    />
                  </div>

                  {/* Area */}
                  <div className="space-y-2 p-4 bg-pakagri-cream rounded-xl">
                    <label className="flex items-center gap-2 text-pakagri-earth-dark font-medium">
                      <MapPin className="w-4 h-4 text-pakagri-gold" />
                      Area (Acres) <span className="font-urdu text-pakagri-earth text-sm">(رقبہ)</span>
                    </label>
                    <input
                      type="number"
                      min={0.1} max={1000} step={0.1}
                      value={areaAcres}
                      onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-gold w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Get Prediction
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {isLoading && (
                <div className="pakagri-card flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner text="Analyzing your farm data..." />
                </div>
              )}

              {!isLoading && prediction && (
                <>
                  {/* Main Result Card */}
                  <div className="pakagri-card bg-gradient-to-br from-pakagri-primary to-pakagri-primary-light text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-pakagri-gold/10 rounded-full blur-3xl" />
                    <div className="relative z-10 p-4">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="text-7xl animate-bounce-gentle">{getCropEmoji(prediction.crop)}</div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                            <ConfidencePieChart prediction={prediction} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-pakagri-cream/80 text-sm mb-1">Recommended Crop</p>
                          <p className="font-urdu text-pakagri-gold mb-2 text-sm">مستحب فصل</p>
                          <h2 className="font-display text-4xl capitalize mb-3">{prediction.crop}</h2>
                          <span className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${
                            prediction.confidence >= 80 ? 'bg-green-500/20 text-green-300' :
                            prediction.confidence >= 60 ? 'bg-pakagri-gold/30 text-pakagri-gold' :
                            'bg-red-400/30 text-red-300'
                          }`}>
                            {prediction.confidence.toFixed(1)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Yield Card */}
                  <div className="pakagri-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pakagri-gold/20 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-pakagri-gold" />
                        </div>
                        <div>
                          <p className="text-pakagri-earth text-sm">Yield Level</p>
                          <p className="font-urdu text-pakagri-gold text-sm">پیداوار کی سطح</p>
                        </div>
                      </div>
                      <span className={`badge text-lg px-5 py-2 ${
                        prediction.yieldLevel === 'High' ? 'badge-high' :
                        prediction.yieldLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {prediction.yieldLevel}
                      </span>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-pakagri-gold/5 to-pakagri-gold/10 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-pakagri-earth text-sm">Estimated Production</p>
                          <p className="font-urdu text-pakagri-gold text-sm mb-1">تخمینی پیداوار</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-3xl text-pakagri-primary">
                            {prediction.yieldKg.toLocaleString()}
                          </p>
                          <p className="text-pakagri-earth">kg per {areaAcres} acre{areaAcres > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      {/* Yield Visualization */}
                      <div className="mt-4 h-4 bg-pakagri-cream rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            prediction.yieldLevel === 'High' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                            prediction.yieldLevel === 'Medium' ? 'bg-gradient-to-r from-pakagri-gold to-pakagri-gold-light' :
                            'bg-gradient-to-r from-red-400 to-red-300'
                          }`}
                          style={{
                            width: `${Math.min((prediction.yieldKg / 5000) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advice Card */}
                  <div className="pakagri-card border-2 border-pakagri-gold/20 bg-gradient-to-br from-pakagri-gold/5 to-transparent">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pakagri-gold rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-pakagri-primary mb-2">AI Recommendations</h3>
                        <p className="font-urdu text-pakagri-gold mb-3 text-sm">اے آئی کی سفارشات</p>
                        <p className="text-pakagri-earth leading-relaxed">{prediction.advice}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!isLoading && !prediction && (
                <div className="pakagri-card text-center py-16">
                  <Wheat className="w-20 h-20 text-pakagri-cream-dark mx-auto mb-4" />
                  <h3 className="font-display text-xl text-pakagri-earth-dark mb-2">
                    No Prediction Yet
                    <span className="block font-urdu text-pakagri-gold text-sm mt-1">ابھی کوئی پیشگوئی نہیں</span>
                  </h3>
                  <p className="text-pakagri-earth max-w-sm mx-auto">
                    Enter your soil nutrient levels and weather conditions to get a personalized crop recommendation.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="pakagri-card">
            <h2 className="font-display text-2xl text-pakagri-primary mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-pakagri-gold" />
              Prediction History
            </h2>

            {history.length === 0 ? (
              <div className="text-center py-12 text-pakagri-earth/60">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No predictions yet. Make your first prediction!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pakagri-cream-dark">
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Crop</th>
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Confidence</th>
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Yield</th>
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Production</th>
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Area</th>
                      <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b border-pakagri-cream-dark/50 hover:bg-pakagri-cream/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCropEmoji(item.recommended_crop)}</span>
                            <span className="font-medium text-pakagri-earth-dark capitalize">{item.recommended_crop}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-pakagri-cream rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.confidence >= 80 ? 'bg-green-500' :
                                  item.confidence >= 60 ? 'bg-pakagri-gold' : 'bg-red-400'
                                }`}
                                style={{ width: `${item.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{item.confidence.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`badge ${
                            item.yield_level === 'High' ? 'badge-high' :
                            item.yield_level === 'Medium' ? 'badge-medium' : 'badge-low'
                          }`}>
                            {item.yield_level}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-pakagri-primary">
                          {item.estimated_production_kg.toLocaleString()} kg
                        </td>
                        <td className="py-4 px-4 text-pakagri-earth">
                          {item.area_acres} acre{item.area_acres > 1 ? 's' : ''}
                        </td>
                        <td className="py-4 px-4 text-pakagri-earth text-sm">
                          {new Date(item.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Crop Distribution */}
            <div className="pakagri-card">
              <h3 className="font-display text-xl text-pakagri-primary mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-pakagri-gold" />
                Crop Distribution
              </h3>
              <CropDistributionChart history={history} />
            </div>

            {/* Yield Trend */}
            <div className="pakagri-card">
              <h3 className="font-display text-xl text-pakagri-primary mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pakagri-gold" />
                Yield Trend (Last 7 Predictions)
              </h3>
              <YieldTrendChart history={history} />
            </div>

            {/* Insights */}
            <div className="pakagri-card lg:col-span-2">
              <h3 className="font-display text-xl text-pakagri-primary mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-pakagri-gold" />
                Farming Insights
              </h3>

              {history.length === 0 ? (
                <p className="text-pakagri-earth/60 text-center py-8">
                  Make predictions to see personalized insights
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-pakagri-primary/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-pakagri-primary rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-pakagri-earth text-sm">Most Confident</p>
                        <p className="font-display text-lg text-pakagri-primary capitalize">
                          {history.sort((a, b) => b.confidence - a.confidence)[0]?.recommended_crop || '-'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-pakagri-earth/70">
                      {history.sort((a, b) => b.confidence - a.confidence)[0]?.confidence.toFixed(1)}% confidence
                    </p>
                  </div>

                  <div className="p-4 bg-pakagri-gold/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-pakagri-gold rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-pakagri-earth text-sm">Highest Yield</p>
                        <p className="font-display text-lg text-pakagri-primary capitalize">
                          {history.sort((a, b) => b.estimated_production_kg - a.estimated_production_kg)[0]?.recommended_crop || '-'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-pakagri-earth/70">
                      {history.sort((a, b) => b.estimated_production_kg - a.estimated_production_kg)[0]?.estimated_production_kg.toLocaleString()} kg estimated
                    </p>
                  </div>

                  <div className="p-4 bg-pakagri-primary-light/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-pakagri-primary-light rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-pakagri-earth text-sm">Avg Yield</p>
                        <p className="font-display text-lg text-pakagri-primary">
                          {(history.reduce((sum, p) => sum + p.estimated_production_kg, 0) / history.length).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-pakagri-earth/70">
                      Average across all predictions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
