'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wheat, BarChart3, Shield, Leaf, Droplets, Sun, Wind,
  TrendingUp, Users, Award, ChevronRight, Sparkles,
  Thermometer, CloudRain, MapPin, Zap, Target, CheckCircle2,
  ArrowRight, Play
} from 'lucide-react'

const features = [
  {
    icon: Wheat,
    title: 'Smart Crop Recommendation',
    titleUrdu: 'ذہین فصل کی سفارش',
    description: 'AI analyzes your soil nutrients (N-P-K), pH levels, and local climate to recommend the best crop for maximum yield.',
    color: 'from-pakagri-primary to-pakagri-primary-light',
  },
  {
    icon: TrendingUp,
    title: 'Yield Prediction',
    titleUrdu: 'پیداوار کی پیشگوئی',
    description: 'Estimate your harvest with 94%+ accuracy using our ML model trained on Pakistani agricultural data.',
    color: 'from-pakagri-gold to-pakagri-gold-light',
  },
  {
    icon: Shield,
    title: 'Data Security',
    titleUrdu: 'ڈیٹا کی حفاظت',
    description: 'Your farm data is encrypted and secure. Share with confidence, your information stays private.',
    color: 'from-pakagri-earth to-pakagri-earth-light',
  },
]

const crops = [
  { name: 'Wheat', emoji: '🌾', region: 'Punjab, Sindh' },
  { name: 'Rice', emoji: '🍚', region: 'Punjab, Sindh' },
  { name: 'Cotton', emoji: '☁️', region: 'Punjab, Sindh' },
  { name: 'Sugarcane', emoji: '🎋', region: 'Punjab, KP' },
  { name: 'Maize', emoji: '🌽', region: 'Punjab, KP' },
  { name: 'Chickpea', emoji: '🫘', region: 'Punjab, Balochistan' },
]

const stats = [
  { value: 22, suffix: '+', label: 'Crops Supported', labelUrdu: 'فصلیں', icon: Wheat },
  { value: 94, suffix: '%', label: 'Model Accuracy', labelUrdu: 'درستگی', icon: Target },
  { value: 5000, suffix: '+', label: 'Farmers Helped', labelUrdu: 'کسان', icon: Users },
  { value: 100, suffix: '+', label: 'Districts Covered', labelUrdu: 'اضلاe', icon: MapPin },
]

const steps = [
  { step: '1', title: 'Register Free', titleUrdu: 'مفت رجسٹر کریں', desc: 'Create your account in seconds', icon: Users },
  { step: '2', title: 'Enter Soil Data', titleUrdu: 'مٹی کا ڈیٹا درج کریں', desc: 'Input N-P-K, pH & climate info', icon: Leaf },
  { step: '3', title: 'Get AI Prediction', titleUrdu: 'اے آئی پیشگوئی حاصل کریں', desc: 'Machine learning analyzes your farm', icon: Sparkles },
  { step: '4', title: 'Farm Smarter', titleUrdu: 'بہتر کاشتکاری کریں', desc: 'Make data-driven decisions', icon: TrendingUp },
]

const testimonials = [
  {
    name: 'Muhammad Aslam',
    location: 'Faisalabad, Punjab',
    text: 'PakAgri helped me choose the right crop for my soil. My yield increased by 30% this season!',
    rating: 5,
  },
  {
    name: 'Abdul Razzaq',
    location: 'Sukkur, Sindh',
    text: 'The predictions are remarkably accurate. I now plan my crops based on AI recommendations.',
    rating: 5,
  },
  {
    name: 'Khalid Mahmood',
    location: 'Malakand, KP',
    text: 'Simple to use and very helpful. Every Pakistani farmer should try this.',
    rating: 5,
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  return (
    <span
      className="font-display text-5xl md:text-6xl text-pakagri-gold"
      ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setIsVisible(true),
            { threshold: 0.1 }
          )
          observer.observe(el)
        }
      }}
    >
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function LandingPage() {
  const [activeCrop, setActiveCrop] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCrop((prev) => (prev + 1) % crops.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-hero animate-gradient" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pakagri-gold/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-pakagri-primary-light/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-pakagri-gold/10 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pakagri-cream/10 rounded-full blur-xl animate-pulse-slow" />

          {/* Wheat pattern overlay */}
          <div className="absolute inset-0 bg-wheat-pattern opacity-20" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-pakagri-gold/20 backdrop-blur px-4 py-2 rounded-full mb-6 border border-pakagri-gold/30">
                <Sparkles className="w-4 h-4 text-pakagri-gold" />
                <span className="text-pakagri-cream text-sm font-medium">AI-Powered Agriculture</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
                Pakistan Ki Zameen,
                <br />
                <span className="text-pakagri-gold relative">
                  Hamare Haath
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-pakagri-gold/40 rounded-full" />
                </span>
              </h1>
              <p className="font-urdu text-xl md:text-2xl text-pakagri-cream/80 mb-6">پاکستان کی زمین، ہمارے ہاتھ</p>

              <p className="text-lg md:text-xl text-pakagri-cream/90 mb-8 max-w-xl leading-relaxed">
                AI-powered crop recommendations tailored for Pakistani farmers.
                Analyze your soil, predict yields, and make informed farming decisions with PakAgri.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="group btn-gold text-lg px-8 py-4 text-center flex items-center justify-center gap-2">
                  Start Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard" className="group bg-white/10 backdrop-blur border border-pakagri-cream/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Try Demo
                </Link>
              </div>

              {/* Quick Stats Row */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-pakagri-gold">22+</p>
                  <p className="text-sm text-pakagri-cream/70">Crop Types</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pakagri-gold">94%</p>
                  <p className="text-sm text-pakagri-cream/70">Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pakagri-gold">Free</p>
                  <p className="text-sm text-pakagri-cream/70">For Farmers</p>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Card */}
            <div className="animate-slide-up-delay-2">
              <div className="glass-card rounded-2xl p-8 relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-pakagri-gold rounded-xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <span className="text-4xl">{crops[activeCrop].emoji}</span>
                </div>

                <h3 className="font-display text-lg text-pakagri-primary mb-4">Supported Crops</h3>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {crops.map((crop, index) => (
                    <button
                      key={crop.name}
                      onClick={() => setActiveCrop(index)}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        index === activeCrop
                          ? 'bg-pakagri-gold text-pakagri-primary-dark shadow-lg scale-105'
                          : 'bg-pakagri-cream hover:bg-pakagri-gold/20'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{crop.emoji}</span>
                      <span className="text-xs font-medium">{crop.name}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-pakagri-cream rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-pakagri-earth text-sm">Best Region</span>
                    <MapPin className="w-4 h-4 text-pakagri-gold" />
                  </div>
                  <p className="font-display text-xl text-pakagri-primary">{crops[activeCrop].region}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-pakagri-cream/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-pakagri-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-pakagri-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-14 h-14 bg-pakagri-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 text-pakagri-gold" />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-pakagri-cream text-lg mt-2">{stat.label}</p>
                <p className="font-urdu text-pakagri-gold/80">{stat.labelUrdu}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-pakagri-cream relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pakagri-gold/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pakagri-primary/5 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 text-pakagri-gold" />
              <span className="text-pakagri-primary text-sm font-medium">Why Choose PakAgri</span>
            </div>
            <h2 className="section-title">Built for Pakistani Farmers</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">
              Advanced AI technology tailored for local soil conditions, climate patterns, and crop varieties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group pakagri-card hover:border-pakagri-gold/30 border border-transparent transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-display text-2xl text-pakagri-primary mb-2">{feature.title}</h3>
                <p className="font-urdu text-pakagri-gold mb-4">{feature.titleUrdu}</p>
                <p className="text-pakagri-earth leading-relaxed">{feature.description}</p>

                <div className="mt-6 flex items-center text-pakagri-gold font-medium group-hover:text-pakagri-gold-dark transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pakagri-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pakagri-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pakagri-primary/5 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4 text-pakagri-gold" />
              <span className="text-pakagri-primary text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="section-title">How It Works</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">
              Four simple steps to transform your farming with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-20 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-pakagri-gold via-pakagri-primary to-pakagri-gold" />

            {steps.map((item, index) => (
              <div key={index} className="relative group">
                <div className="pakagri-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="relative -mt-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-pakagri-gold to-pakagri-gold-light rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="inline-block bg-pakagri-primary/10 text-pakagri-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                      STEP {item.step}
                    </span>
                    <h3 className="font-display text-xl text-pakagri-primary mb-2">{item.title}</h3>
                    <p className="font-urdu text-pakagri-gold text-sm mb-3">{item.titleUrdu}</p>
                    <p className="text-pakagri-earth text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-pakagri-primary via-pakagri-primary-light to-pakagri-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Trusted by Farmers</h2>
            <p className="text-pakagri-cream/80 text-lg">Hear from farmers using PakAgri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 hover:bg-white/90 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-pakagri-gold text-lg">&#9733;</span>
                  ))}
                </div>
                <p className="text-pakagri-earth mb-6 italic">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pakagri-gold/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-pakagri-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-pakagri-primary">{testimonial.name}</p>
                    <p className="text-sm text-pakagri-earth/70 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-pakagri-cream relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-pakagri-gold/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-pakagri-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-pakagri-gold/10 px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4 text-pakagri-gold" />
            <span className="text-pakagri-primary text-sm font-medium">Join 5000+ Farmers</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-pakagri-primary mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-lg text-pakagri-earth mb-8 max-w-2xl mx-auto">
            Start making data-driven decisions today. It&apos;s free and takes less than a minute to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-gold text-lg px-10 py-4 inline-flex items-center justify-center gap-2 group">
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/accuracy" className="bg-pakagri-primary text-white px-10 py-4 rounded-lg font-semibold hover:bg-pakagri-primary-light transition-colors inline-flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              View Accuracy
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-pakagri-earth/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pakagri-primary" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pakagri-primary" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pakagri-primary" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
