'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wheat, LogOut, History, Droplets, Thermometer, CloudRain, Scale, MapPin, Lightbulb, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'
import { predictCropAndYield, savePrediction, getPredictionHistory, getCropEmoji, type Prediction } from '@/lib/supabase/predictions'
import LoadingSpinner from '@/components/pakagri/LoadingSpinner'

function SliderField({ label, labelUrdu, value, onChange, min, max, step = 1, icon }: {
  label: string
  labelUrdu: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  icon: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-pakagri-earth-dark font-medium">
          {icon}
          <span>{label}</span>
          <span className="font-urdu text-pakagri-earth text-sm">{labelUrdu}</span>
        </label>
        <span className="text-pakagri-primary font-semibold bg-pakagri-primary/5 px-3 py-1 rounded-lg">
          {value.toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
      <div className="flex justify-between text-xs text-pakagri-earth/60"><span>{min}</span><span>{max}</span></div>
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

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [N, setN] = useState(90)
  const [P, setP] = useState(42)
  const [K, setK] = useState(43)
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity] = useState(80)
  const [ph, setPh] = useState(6.5)
  const [rainfall, setRainfall] = useState(200)
  const [areaAcres, setAreaAcres] = useState(1.0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      loadHistory()
    }
  }, [user, authLoading, router])

  const loadHistory = async () => {
    if (user) {
      const data = await getPredictionHistory(user.id, 5)
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

    // Save to database
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

  const badgeClass = prediction?.yieldLevel
    ? { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[prediction.yieldLevel]
    : ''

  return (
    <div className="min-h-screen bg-pakagri-cream">
      <header className="bg-pakagri-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wheat className="w-8 h-8 text-pakagri-gold" />
              <div>
                <h1 className="font-display text-2xl">Kissan Dashboard</h1>
                <p className="font-urdu text-pakagri-gold text-sm">کسان ڈیش بورڈ</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 bg-pakagri-gold/20 px-4 py-2 rounded-lg text-pakagri-gold hover:bg-pakagri-gold/30 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <div className="pakagri-card">
              <div className="mb-6">
                <h2 className="font-display text-2xl text-pakagri-primary mb-2">Crop Recommendation</h2>
                <p className="text-pakagri-earth">Enter your soil and weather data</p>
                <p className="font-urdu text-pakagri-gold">اپنی مٹی اور موسم کا ڈیٹا درج کریں</p>
              </div>
              <form onSubmit={handlePredict} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-pakagri-primary flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-pakagri-gold" />
                    Zameen Ki Maloomat <span className="font-urdu text-pakagri-earth text-sm">(زمین کی معلومات)</span>
                  </h3>
                  <SliderField label="Nitrogen (N)" labelUrdu="نائٹروجن" value={N} onChange={setN} min={0} max={150}
                    icon={<span className="w-6 h-6 bg-pakagri-primary/10 rounded flex items-center justify-center text-xs font-bold text-pakagri-primary">N</span>} />
                  <SliderField label="Phosphorus (P)" labelUrdu="فاسفورس" value={P} onChange={setP} min={0} max={150}
                    icon={<span className="w-6 h-6 bg-pakagri-primary/10 rounded flex items-center justify-center text-xs font-bold text-pakagri-primary">P</span>} />
                  <SliderField label="Potassium (K)" labelUrdu="پوٹاشیم" value={K} onChange={setK} min={0} max={250}
                    icon={<span className="w-6 h-6 bg-pakagri-primary/10 rounded flex items-center justify-center text-xs font-bold text-pakagri-primary">K</span>} />
                </div>
                <div className="space-y-4 pt-4 border-t border-pakagri-cream-dark">
                  <h3 className="font-display text-lg text-pakagri-primary flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-pakagri-gold" />
                    Mosam Ki Maloomat <span className="font-urdu text-pakagri-earth text-sm">(موسم کی معلومات)</span>
                  </h3>
                  <SliderField label="Temperature" labelUrdu="درجہ حرارت" value={temperature} onChange={setTemperature} min={0} max={50}
                    icon={<Thermometer className="w-4 h-4 text-pakagri-gold" />} />
                  <SliderField label="Humidity" labelUrdu="نمی" value={humidity} onChange={setHumidity} min={0} max={100}
                    icon={<Droplets className="w-4 h-4 text-pakagri-gold" />} />
                  <SliderField label="pH Value" labelUrdu="پی ایچ" value={ph} onChange={setPh} min={0} max={14} step={0.1}
                    icon={<Scale className="w-4 h-4 text-pakagri-gold" />} />
                  <SliderField label="Rainfall" labelUrdu="بارش" value={rainfall} onChange={setRainfall} min={0} max={400}
                    icon={<CloudRain className="w-4 h-4 text-pakagri-gold" />} />
                </div>
                <div className="space-y-2 pt-4 border-t border-pakagri-cream-dark">
                  <label className="flex items-center gap-2 text-pakagri-earth-dark font-medium">
                    <MapPin className="w-4 h-4 text-pakagri-gold" />
                    Area (Acres) <span className="font-urdu text-pakagri-earth text-sm">(رقبہ)</span>
                  </label>
                  <input type="number" min={0.1} max={1000} step={0.1} value={areaAcres}
                    onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold" />
                </div>
                <button type="submit" disabled={isLoading}
                  className="btn-gold w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : <>Tavsiya Lein <span className="font-urdu font-normal text-sm">(توشیہ لیں)</span></>}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div>
            {isLoading && (
              <div className="pakagri-card flex items-center justify-center min-h-[400px]">
                <LoadingSpinner text="Analyzing your farm data..." />
              </div>
            )}

            {!isLoading && prediction && (
              <div className="space-y-6">
                <div className="pakagri-card bg-gradient-to-br from-pakagri-primary to-pakagri-primary-light text-white">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{getCropEmoji(prediction.crop)}</span>
                    <div>
                      <p className="text-pakagri-cream/80 text-sm mb-1">Recommended Crop</p>
                      <p className="font-urdu text-pakagri-gold mb-2 text-sm">مستحب فصل</p>
                      <h2 className="font-display text-3xl capitalize">{prediction.crop}</h2>
                      <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${prediction.confidence >= 80 ? 'bg-pakagri-primary-light text-white' : prediction.confidence >= 60 ? 'bg-pakagri-gold text-pakagri-primary-dark' : 'bg-red-400 text-white'}`}>
                        {prediction.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pakagri-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pakagri-gold/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-pakagri-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-pakagri-earth text-sm">Yield Level</p>
                      <p className="font-urdu text-pakagri-gold text-sm">پیداوار کی سطح</p>
                    </div>
                    {prediction.yieldLevel && (
                      <span className={`badge ${badgeClass} text-lg px-4 py-2`}>
                        {prediction.yieldLevel}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-pakagri-cream-dark flex justify-between items-center">
                    <div>
                      <p className="text-pakagri-earth text-sm">Estimated Production</p>
                      <p className="font-urdu text-pakagri-gold text-sm">تخمینی پیداوار</p>
                    </div>
                    <p className="font-display text-2xl text-pakagri-primary">
                      {prediction.yieldKg.toLocaleString()} kg
                    </p>
                  </div>
                </div>

                <div className="pakagri-card border border-pakagri-gold/20 bg-pakagri-gold/5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pakagri-gold rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-pakagri-primary mb-2">AI Recommendations</h3>
                      <p className="font-urdu text-pakagri-gold mb-3 text-sm">اے آئی کی سفارشات</p>
                      <p className="text-pakagri-earth leading-relaxed">{prediction.advice}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !prediction && (
              <div className="pakagri-card text-center py-12">
                <Wheat className="w-16 h-16 text-pakagri-cream-dark mx-auto mb-4" />
                <h3 className="font-display text-xl text-pakagri-earth-dark mb-2">
                  No Prediction Yet
                  <span className="block font-urdu text-pakagri-gold text-sm mt-1">ابھی کوئی پیشگوئی نہیں</span>
                </h3>
                <p className="text-pakagri-earth max-w-md mx-auto">
                  Enter your soil nutrient levels and weather conditions on the left to get a personalized crop recommendation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-pakagri-gold" />
              <div>
                <h2 className="font-display text-2xl text-pakagri-primary">Prediction History</h2>
                <p className="font-urdu text-pakagri-gold">پیشگوئی کی تاریخ</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-card">
                <thead>
                  <tr className="border-b border-pakagri-cream-dark">
                    <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Crop</th>
                    <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Confidence</th>
                    <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Yield</th>
                    <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Production</th>
                    <th className="text-left py-4 px-4 text-pakagri-earth font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-pakagri-cream-dark last:border-b-0 hover:bg-pakagri-cream/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCropEmoji(item.recommended_crop)}</span>
                          <span className="font-medium text-pakagri-earth-dark capitalize">{item.recommended_crop}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${item.confidence >= 80 ? 'badge-high' : item.confidence >= 60 ? 'badge-medium' : 'badge-low'}`}>
                          {item.confidence.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${item.yield_level === 'High' ? 'badge-high' : item.yield_level === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                          {item.yield_level}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-pakagri-primary">{item.estimated_production_kg.toLocaleString()} kg</td>
                      <td className="py-4 px-4 text-pakagri-earth text-sm">{new Date(item.created_at).toLocaleDateString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
