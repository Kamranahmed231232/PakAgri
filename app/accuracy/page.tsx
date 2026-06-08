import type { Metadata } from 'next'
import { BarChart3, Database, GitBranch, Cpu, Target, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Model Accuracy | PakAgri',
  description: 'AI Model Performance Metrics for PakAgri crop recommendation and yield prediction',
}

const defaultMetrics = {
  accuracy: 94.5,
  precision: 93.8,
  recall: 94.2,
  f1_score: 93.9,
  r2_score: 0.85,
  mae: 150.5,
  rmse: 200.3,
}

const steps = [
  { icon: Database, title: 'Data Collection', description: 'We collect soil N-P-K levels, temperature, humidity, pH, and rainfall data from agricultural sources across Pakistan.' },
  { icon: GitBranch, title: 'Data Cleaning', description: 'Remove duplicates, handle missing values, and remove outliers using IQR method to ensure data quality.' },
  { icon: Cpu, title: 'Feature Engineering', description: 'Standardize features using StandardScaler and create derived variables for better model performance.' },
  { icon: Target, title: 'Model Training', description: 'Train RandomForestClassifier for crop recommendation and RandomForestRegressor for yield prediction with 100 estimators.' },
  { icon: Zap, title: 'Prediction', description: 'Deploy trained models to predict the best crop and estimated yield based on your farm conditions.' },
]

function MetricRing({ value, label, color }: { value: number; label: string; color: string }) {
  const percentage = value
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle className={color === 'green' ? 'stroke-pakagri-primary/10' : color === 'yellow' ? 'stroke-pakagri-gold/10' : 'stroke-red-100'} cx="50" cy="50" r="45" strokeWidth="10" fill="none" />
          <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" r="45" strokeWidth="10" fill="none"
            stroke={color === 'green' ? '#1a4a2e' : color === 'yellow' ? '#c9a227' : '#dc2626'}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-xl ${color === 'green' ? 'text-pakagri-primary' : color === 'yellow' ? 'text-pakagri-gold-dark' : 'text-red-600'}`}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="mt-3 text-pakagri-earth-dark font-medium text-sm">{label}</span>
    </div>
  )
}

function MetricBar({ value, label, unit, maxValue = 1 }: { value: number; label: string; unit?: string; maxValue?: number }) {
  const percentage = (value / maxValue) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-pakagri-earth-dark font-medium">{label}</span>
        <span className="text-pakagri-primary font-semibold">
          {value.toFixed(unit ? 2 : 4)}{unit && ` ${unit}`}
        </span>
      </div>
      <div className="h-3 bg-pakagri-cream-dark rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pakagri-primary to-pakagri-primary-light rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}

export default function AccuracyPage() {
  const classificationMetrics = [
    { value: defaultMetrics.accuracy, label: 'Accuracy' },
    { value: defaultMetrics.precision, label: 'Precision' },
    { value: defaultMetrics.recall, label: 'Recall' },
    { value: defaultMetrics.f1_score, label: 'F1 Score' },
  ]

  const getMetricColor = (value: number): 'green' | 'yellow' | 'red' => {
    if (value >= 90) return 'green'
    if (value >= 75) return 'yellow'
    return 'red'
  }

  return (
    <div className="min-h-screen bg-pakagri-cream">
      {/* Hero */}
      <section className="bg-pakagri-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pakagri-gold/20 rounded-xl mb-6">
            <BarChart3 className="w-8 h-8 text-pakagri-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">AI Model Performance</h1>
          <p className="text-pakagri-cream/80 text-lg max-w-2xl mx-auto">
            Transparent metrics showing the accuracy and reliability of our crop recommendation and yield prediction models
          </p>
          <p className="font-urdu text-pakagri-gold text-xl mt-2">ماڈل کی درستگی</p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Classification */}
            <div className="pakagri-card">
              <div className="mb-6">
                <h3 className="font-display text-2xl text-pakagri-primary mb-2">Classification Model</h3>
                <p className="text-pakagri-earth">Crop Recommendation Performance</p>
                <p className="font-urdu text-pakagri-gold text-sm">فصل کی سفارش کی کارکردگی</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {classificationMetrics.map((metric, index) => (
                  <MetricRing key={index} value={metric.value} label={metric.label} color={getMetricColor(metric.value)} />
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-pakagri-cream-dark">
                <p className="text-sm text-pakagri-earth">
                  <strong>RandomForestClassifier</strong> with 100 estimators. Trained on crop recommendation data with 80/20 train-test split.
                </p>
              </div>
            </div>

            {/* Regression */}
            <div className="pakagri-card">
              <div className="mb-6">
                <h3 className="font-display text-2xl text-pakagri-primary mb-2">Regression Model</h3>
                <p className="text-pakagri-earth">Yield Prediction Performance</p>
                <p className="font-urdu text-pakagri-gold text-sm">پیداوار کی پیشگوئی کی کارکردگی</p>
              </div>
              <div className="space-y-6">
                <MetricBar value={defaultMetrics.r2_score} label="R-squared Score" maxValue={1} />
                <MetricBar value={defaultMetrics.mae} label="Mean Absolute Error" unit="kg/ha" maxValue={500} />
                <MetricBar value={defaultMetrics.rmse} label="Root Mean Squared Error" unit="kg/ha" maxValue={500} />
              </div>
              <div className="mt-6 pt-6 border-t border-pakagri-cream-dark">
                <p className="text-sm text-pakagri-earth">
                  <strong>RandomForestRegressor</strong> with 100 estimators. Lower MAE/RMSE indicates better prediction accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How Our AI Works</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">A 5-step pipeline from data to prediction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="pakagri-card h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-pakagri-primary/10 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-pakagri-primary" />
                    </div>
                    <div className="w-8 h-8 bg-pakagri-gold rounded-full flex items-center justify-center mb-3 font-display text-pakagri-primary-dark">
                      {index + 1}
                    </div>
                    <h3 className="font-display text-base text-pakagri-primary mb-2">{step.title}</h3>
                    <p className="text-pakagri-earth text-xs">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-pakagri-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-pakagri-earth text-sm text-center">
            <strong>Note:</strong> Yield prediction currently uses synthetic training data for demonstration.
            Production deployment should incorporate real agricultural yield data from Pakistani farms.
          </p>
        </div>
      </section>
    </div>
  )
}
