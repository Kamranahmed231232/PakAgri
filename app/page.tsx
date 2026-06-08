import Link from 'next/link'
import { Wheat, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    icon: Wheat,
    title: 'Crop Recommendation',
    titleUrdu: 'فصل کی سفارش',
    description: 'Get AI-powered crop suggestions based on your soil N-P-K levels, climate conditions, and local factors.',
  },
  {
    icon: BarChart3,
    title: 'Yield Prediction',
    titleUrdu: 'پیداوار کی پیشگوئی',
    description: 'Estimate your crop production with our regression model trained on agricultural data from Pakistan.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    titleUrdu: 'محفوظ اور نجی',
    description: 'Your farm data is encrypted and protected. We never share your information with third parties.',
  },
]

const stats = [
  { value: '22+', label: 'Crops Supported', labelUrdu: 'فصلیں' },
  { value: '94%+', label: 'Accuracy', labelUrdu: 'درستگی' },
  { value: '5000+', label: 'Farmers Served', labelUrdu: 'کسان' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-wheat-pattern opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-4">
              Pakistan Ki Zameen,
              <br />
              <span className="text-pakagri-gold">Hamare Haath</span>
            </h1>
            <p className="font-urdu text-xl md:text-2xl text-pakagri-cream/80 mb-6">پاکستان کی زمین، ہمارے ہاتھ</p>
            <p className="text-lg md:text-xl text-pakagri-cream/90 mb-8 max-w-2xl leading-relaxed">
              AI-powered crop recommendations tailored for Pakistani farmers.
              Analyze your soil, predict yields, and make informed farming decisions with PakAgri.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="btn-gold text-lg px-8 py-4 text-center">
                Dashboard Kholein
                <span className="block text-sm font-urdu font-normal mt-1">ڈیش بورڈ کھولیں</span>
              </Link>
              <Link href="/accuracy" className="bg-white/10 backdrop-blur border border-pakagri-cream/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all text-center">
                Accuracy Dekhein
                <span className="block text-sm font-urdu font-normal mt-1">درستگی دیکھیں</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-pakagri-cream to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-pakagri-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose PakAgri?</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">
              Advanced AI technology built specifically for Pakistani agricultural conditions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="pakagri-card group hover:border-pakagri-gold/20 border border-transparent transition-all duration-300">
                <div className="w-14 h-14 bg-pakagri-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pakagri-gold/10 transition-colors">
                  <feature.icon className="w-7 h-7 text-pakagri-primary group-hover:text-pakagri-gold transition-colors" />
                </div>
                <h3 className="font-display text-xl text-pakagri-primary mb-2">{feature.title}</h3>
                <p className="font-urdu text-pakagri-gold mb-4">{feature.titleUrdu}</p>
                <p className="text-pakagri-earth">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-pakagri-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="py-6">
                <p className="font-display text-5xl md:text-6xl text-pakagri-gold mb-2">{stat.value}</p>
                <p className="text-pakagri-cream text-lg">{stat.label}</p>
                <p className="font-urdu text-pakagri-gold/80">{stat.labelUrdu}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-pakagri-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="text-lg text-pakagri-earth max-w-2xl mx-auto">
              Simple steps to get your personalized crop recommendation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your account' },
              { step: '2', title: 'Input Data', desc: 'Enter soil & weather info' },
              { step: '3', title: 'Get Prediction', desc: 'AI analyzes your data' },
              { step: '4', title: 'Take Action', desc: 'Farm smarter' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="pakagri-card text-center">
                  <div className="w-12 h-12 bg-pakagri-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-xl text-pakagri-primary-dark">{item.step}</span>
                  </div>
                  <h3 className="font-display text-lg text-pakagri-primary mb-2">{item.title}</h3>
                  <p className="text-pakagri-earth text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pakagri-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-pakagri-cream/80 text-lg mb-8">
            Join thousands of Pakistani farmers making data-driven decisions
          </p>
          <Link href="/register" className="btn-gold text-lg px-10 py-4 inline-block">Start Free Today</Link>
        </div>
      </section>
    </div>
  )
}
