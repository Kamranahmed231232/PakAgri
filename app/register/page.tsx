'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Wheat, Mail, Lock, Eye, EyeOff, User, MapPin, Check, X, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'
import { supabase } from '@/lib/supabase/client'

function RegisterContent() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    farm_location: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user just verified their email
  const justVerified = searchParams.get('verified') === 'true'

  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirm_password && formData.confirm_password !== '',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValidation.match) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    const { error } = await signUp(formData.email, formData.password, formData.full_name, formData.farm_location)

    if (error) {
      // Handle specific error messages
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setError('An account with this email already exists. Please try logging in instead.')
      } else {
        setError(error.message)
      }
    } else {
      setSuccess(true)
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 bg-wheat-pattern opacity-20" />
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pakagri-gold rounded-xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl text-pakagri-primary mb-4">Check Your Email</h1>
            <p className="text-pakagri-earth mb-6">
              We&apos;ve sent a confirmation email to <strong className="text-pakagri-primary">{formData.email}</strong>.
            </p>
            <div className="bg-pakagri-cream rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-pakagri-earth-dark font-medium mb-2">What to do next:</p>
              <ol className="text-sm text-pakagri-earth space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-pakagri-gold rounded-full flex items-center justify-center text-pakagri-primary-dark text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Open your email inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-pakagri-gold rounded-full flex items-center justify-center text-pakagri-primary-dark text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Find the email from PakAgri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-pakagri-gold rounded-full flex items-center justify-center text-pakagri-primary-dark text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Click the verification link to activate your account</span>
                </li>
              </ol>
            </div>
            <Link href="/login" className="btn-gold inline-block px-8 py-3">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-wheat-pattern opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pakagri-primary rounded-xl mb-4">
              <Wheat className="w-8 h-8 text-pakagri-gold" />
            </div>
            <h1 className="font-display text-3xl text-pakagri-primary">Create Account</h1>
            <p className="text-pakagri-earth mt-2">Join PakAgri as a farmer</p>
            <p className="font-urdu text-pakagri-gold mt-1">کسان کے طور پر شامل ہوں</p>
          </div>

          {justVerified && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Your email has been verified! You can now log in.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Full Name <span className="font-urdu text-pakagri-earth">(پورا نام)</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input name="full_name" type="text" value={formData.full_name} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="Muhammad Ali" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Email <span className="font-urdu text-pakagri-earth">(ای میل)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="farmer@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Password <span className="font-urdu text-pakagri-earth">(پاس ورڈ)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pakagri-earth/50">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span className={`flex items-center gap-1 ${passwordValidation.length ? 'text-pakagri-primary' : 'text-pakagri-earth/50'}`}>
                  {passwordValidation.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Min 6 characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Confirm Password <span className="font-urdu text-pakagri-earth">(پاس ورڈ تصدیق)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="Confirm your password" required />
              </div>
              {formData.confirm_password && (
                <span className={`flex items-center gap-1 mt-2 text-xs ${passwordValidation.match ? 'text-pakagri-primary' : 'text-red-500'}`}>
                  {passwordValidation.match ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  Passwords {passwordValidation.match ? 'match' : 'do not match'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Farm Location <span className="font-urdu text-pakagri-earth">(خاند کا مقام)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input name="farm_location" type="text" value={formData.farm_location} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-pakagri-cream-dark focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="Faisalabad, Punjab" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading || !passwordValidation.length || !passwordValidation.match}
              className="btn-gold w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>Register <span className="font-urdu font-normal text-sm ml-2">(رجسٹر)</span></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-pakagri-earth">
              Already have an account?{' '}
              <Link href="/login" className="text-pakagri-gold hover:text-pakagri-gold-dark font-semibold">Login here</Link>
            </p>
            <p className="font-urdu text-pakagri-earth/60 mt-2 text-sm">پہلے سے اکاؤنٹ ہے؟ یہاں لاگ ان کریں</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pakagri-gold border-t-transparent rounded-full" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
