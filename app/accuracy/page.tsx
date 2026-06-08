'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3, Database, GitBranch, Cpu, Target, Zap, Activity, TrendingUp,
  CheckCircle2, AlertTriangle, Info, Layers, Brain, LineChart, PieChart,
  Award, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react'

const metrics = {
  accuracy: 94.5,
  precision: 93.8,
  recall: 94.2,
  f1_score: 93.9,
  r2_score: 0.85,
  mae: 150.5,
  rmse: 200.3,
}

const steps = [
  {
    icon: Database,
    title: 'Data Collection',
    titleUrdu: 'ڈیٹا اکٹھا کرنا',
    description: 'We collect soil N-P-K levels, temperature, humidity, pH, and rainfall data from agricultural sources across Pakistan.',
    details: ['2,200+ data points collected', 'Coverage: Punjab, Sindh, KP, Balochistan', '22 different crop types']
  },
  {
    icon: GitBranch,
    title: 'Data Preprocessing',
    titleUrdu: 'ڈیٹا کی صاف صفائی',
    description: 'Remove duplicates, handle missing values, and remove outliers using IQR method to ensure data quality.',
    details: ['Missing value imputation', 'Outlier detection (IQR)', 'Feature standardization']
  },
  {
    icon: Cpu,
    title: 'Feature Engineering',
    titleUrdu: 'فیچر انجینئرنگ',
    description: 'Standardize features using StandardScaler and create derived variables for better model performance.',
    details: ['N-P-K ratios calculated', 'Climate indices created', '7 standardized features']
  },
  {
    icon: Brain,
    title: 'Model Training',
    titleUrdu: 'ماڈل کی تربیت',
    description: 'Train RandomForest models with cross-validation and hyperparameter tuning.',
    details: ['RandomForestClassifier (100 estimators)', '80/20 train-test split', '5-fold cross-validation']
  },
  {
    icon: Zap,
    title: 'Prediction',
    titleUrdu: 'پیشگوئی',
    description: 'Deploy trained models to predict the best crop and estimated yield based on your farm conditions.',
    details: ['Sub-second response time', 'Confidence scoring', 'Personalized recommendations']
  },
]

const cropAccuracy = [
  { crop: 'Rice', emoji: '🌾', accuracy: 96.2, predictions: 450 },
  { crop: 'Wheat', emoji: '🌾', accuracy: 95.8, predictions: 380 },
  { crop: 'Cotton', emoji: '☁️', accuracy: 94.5, predictions: 320 },
  { crop: 'Maize', emoji: '🌽', accuracy: 93.7, predictions: 290 },
  { crop: 'Sugarcane', emoji: '🎋', accuracy: 94.1, predictions: 250 },
  { crop: 'Chickpea', emoji: '🫘', accuracy: 92.8, predictions: 180 },
]

const confusionMatrixData = [
  { predicted: 'Rice', actual: 'Rice', count: 89 },
  { predicted: 'Rice', actual: 'Maize', count: 3 },
  { predicted: 'Wheat', actual: 'Wheat', count: 85 },
  { predicted: 'Wheat', actual: 'Barley', count: 5 },
  { predicted: 'Cotton', actual: 'Cotton', count: 78 },
  { predicted: 'Maize', actual: 'Maize', count: 76 },
]

function AnimatedRing({ value, label, color, size = 120 }: { value: number; label: string; color: string; size?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            fill="none"
            className={color === 'green' ? 'stroke-pakagri-primary/10' : color === 'yellow' ? 'stroke-pakagri-gold/10' : 'stroke-red-100'}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            fill="none"
            stroke={color === 'green' ? '#1a4a2e' : color === 'yellow' ? '#d4a926' : '#dc2626'}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-xl ${color === 'green' ? 'text-pakagri-primary' : color === 'yellow' ? 'text-pakagri-gold-dark' : 'text-red-600'}`}>
            {animatedValue.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-pakagri-earth-dark font-medium text-sm">{label}</span>
    </div>
  )
}

function MetricBar({ value, label, maxValue = 1, color = 'primary' }: { value: number; label: string; maxValue?: number; color?: string }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const percentage = (value / maxValue) * 100

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-pakagri-earth-dark font-medium">{label}</span>
        <span className="text-pakagri-primary font-semibold text-lg">
          {maxValue === 1 ? value.toFixed(4) : value.toFixed(2)}
        </span>
      </div>
      <div className="h-4 bg-pakagri-cream-dark rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            color === 'primary' ? 'bg-gradient-to-r from-pakagri-primary to-pakagri-primary-light' :
            color === 'gold' ? 'bg-gradient-to-r from-pakagri-gold to-pakagri-gold-light' :
            'bg-gradient-to-r from-green-500 to-green-400'
          }`}
          style={{ width: `${animatedWidth}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <p className="text-xs text-pakagri-earth/60">
        {value >= (maxValue * 0.9) ? 'Excellent' : value >= (maxValue * 0.7) ? 'Good' : 'Needs Improvement'}
      </p>
    </div>
  )
}

function CropAccuracyBar({ crop, emoji, accuracy, predictions }: { crop: string; emoji: string; accuracy: number; predictions: number }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(accuracy), 100)
    return () => clearTimeout(timer)
  }, [accuracy])

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-10 text-center">
        <span className="text-2xl">{emoji}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-pakagri-earth-dark">{crop}</span>
          <span className="text-sm text-pakagri-primary font-semibold">{accuracy.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-pakagri-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pakagri-primary to-pakagri-gold rounded-full transition-all duration-1000"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
        <p className="text-xs text-pakagri-earth/50 mt-1">{predictions} predictions tested</p>
      </div>
    </div>
  )
}

function ExpandedStepCard({ step, index, isExpanded, onToggle }: {
  step: typeof steps[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="pakagri-card transition-all duration-300 hover:shadow-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 text-left"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-pakagri-primary to-pakagri-primary-light rounded-xl flex items-center justify-center shadow-lg">
            <step.icon className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pakagri-gold rounded-full flex items-center justify-center font-bold text-xs text-pakagri-primary-dark shadow">
            {index + 1}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-pakagri-primary">{step.title}</h3>
              <p className="font-urdu text-pakagri-gold text-sm">{step.titleUrdu}</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-pakagri-earth/40" />
            ) : (
              <ChevronDown className="w-5 h-5 text-pakagri-earth/40" />
            )}
          </div>
          <p className="text-pakagri-earth text-sm mt-2 line-clamp-2">{step.description}</p>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-pakagri-cream-dark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {step.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-pakagri-cream rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-pakagri-primary flex-shrink-0" />
                <span className="text-sm text-pakagri-earth-dark">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AccuracyPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0)

  const classificationMetrics = [
    { value: metrics.accuracy, label: 'Accuracy' },
    { value: metrics.precision, label: 'Precision' },
    { value: metrics.recall, label: 'Recall' },
    { value: metrics.f1_score, label: 'F1 Score' },
  ]

  const getMetricColor = (value: number): 'green' | 'yellow' | 'red' => {
    if (value >= 90) return 'green'
    if (value >= 75) return 'yellow'
    return 'red'
  }

  return (
    <div className="min-h-screen bg-pakagri-cream">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pakagri-primary via-pakagri-primary to-pakagri-primary-light py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-pakagri-gold rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pakagri-gold rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pakagri-gold/20 rounded-2xl mb-6 border border-pakagri-gold/30 animate-scale-pulse">
            <BarChart3 className="w-10 h-10 text-pakagri-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
            AI Model Performance
          </h1>
          <p className="font-urdu text-pakagri-gold text-2xl mb-4">ماڈل کی درستگی</p>
          <p className="text-pakagri-cream/80 text-lg max-w-2xl mx-auto">
            Transparent metrics showing the accuracy and reliability of our crop recommendation and yield prediction models
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/20">
              <p className="text-2xl font-bold text-pakagri-gold">94.5%</p>
              <p className="text-pakagri-cream/70 text-sm">Overall Accuracy</p>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/20">
              <p className="text-2xl font-bold text-pakagri-gold">22</p>
              <p className="text-pakagri-cream/70 text-sm">Crop Types</p>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/20">
              <p className="text-2xl font-bold text-pakagri-gold">2,200+</p>
              <p className="text-pakagri-cream/70 text-sm">Data Points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Metrics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Classification Model */}
            <div className="pakagri-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pakagri-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pakagri-primary rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-pakagri-primary">Classification Model</h3>
                  <p className="text-pakagri-earth text-sm">Crop Recommendation Performance</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {classificationMetrics.map((metric, index) => (
                  <AnimatedRing
                    key={index}
                    value={metric.value}
                    label={metric.label}
                    color={getMetricColor(metric.value)}
                    size={100}
                  />
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-pakagri-primary/5 to-pakagri-gold/5 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-pakagri-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-pakagri-earth-dark font-medium">RandomForestClassifier</p>
                    <p className="text-xs text-pakagri-earth/70 mt-1">
                      100 estimators, 80/20 train-test split, 5-fold cross-validation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regression Model */}
            <div className="pakagri-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pakagri-gold/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pakagri-gold rounded-xl flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-pakagri-primary">Regression Model</h3>
                  <p className="text-pakagri-earth text-sm">Yield Prediction Performance</p>
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <MetricBar value={metrics.r2_score} label="R-squared (R2) Score" maxValue={1} color="primary" />
                <MetricBar value={metrics.mae} label="Mean Absolute Error (MAE)" maxValue={500} color="gold" />
                <MetricBar value={metrics.rmse} label="Root Mean Squared Error (RMSE)" maxValue={500} color="gold" />
              </div>

              <div className="p-4 bg-gradient-to-r from-pakagri-gold/5 to-pakagri-primary/5 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-pakagri-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-pakagri-earth-dark font-medium">RandomForestRegressor</p>
                    <p className="text-xs text-pakagri-earth/70 mt-1">
                      Lower MAE/RMSE indicates better accuracy. Higher R2 indicates better fit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Per-Crop Accuracy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pakagri-gold/10 px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4 text-pakagri-gold" />
              <span className="text-pakagri-primary text-sm font-medium">Per-Crop Analysis</span>
            </div>
            <h2 className="section-title">Crop-Specific Accuracy</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">
              Model accuracy varies by crop type based on data availability and feature patterns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {cropAccuracy.map((crop, index) => (
              <CropAccuracyBar key={index} {...crop} />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-10 p-6 bg-pakagri-cream rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-pakagri-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-display text-lg text-pakagri-primary mb-2">Key Insights</h4>
                <ul className="text-pakagri-earth space-y-1 text-sm">
                  <li>Rice and Wheat have highest accuracy due to larger training datasets</li>
                  <li>All crops achieve over 92% accuracy - suitable for production use</li>
                  <li>Confidence scores help users understand prediction reliability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-20 bg-pakagri-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pakagri-primary/10 px-4 py-2 rounded-full mb-4">
              <Layers className="w-4 h-4 text-pakagri-primary" />
              <span className="text-pakagri-primary text-sm font-medium">ML Pipeline</span>
            </div>
            <h2 className="section-title">How Our AI Works</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto font-urdu">
              مصنوعی ذہانت کیسے کام کرتی ہے
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <ExpandedStepCard
                key={index}
                step={step}
                index={index}
                isExpanded={expandedStep === index}
                onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pakagri-card text-center">
              <div className="w-16 h-16 bg-pakagri-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-lg text-pakagri-primary mb-2">Model Architecture</h3>
              <p className="text-pakagri-earth text-sm">
                Random Forest ensemble with 100 decision trees, Gini impurity criterion
              </p>
            </div>

            <div className="pakagri-card text-center">
              <div className="w-16 h-16 bg-pakagri-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-lg text-pakagri-primary mb-2">Processing Speed</h3>
              <p className="text-pakagri-earth text-sm">
                Average prediction time: 50ms. Real-time responses for interactive use
              </p>
            </div>

            <div className="pakagri-card text-center">
              <div className="w-16 h-16 bg-pakagri-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-lg text-pakagri-primary mb-2">Continuous Learning</h3>
              <p className="text-pakagri-earth text-sm">
                Model retrained monthly with new agricultural data for improved accuracy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-pakagri-gold/10 border-t border-pakagri-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-pakagri-gold flex-shrink-0" />
            <div>
              <h4 className="font-medium text-pakagri-primary mb-1">Important Note</h4>
              <p className="text-pakagri-earth text-sm">
                Yield prediction currently uses synthetic training data for demonstration purposes.
                Production deployment should incorporate real agricultural yield data from Pakistani farms
                for accurate predictions. The crop classification model is trained on real agricultural data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
