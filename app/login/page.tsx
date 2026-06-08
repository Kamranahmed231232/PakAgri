'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Wheat, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setIsLoading(false)
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
            <h1 className="font-display text-3xl text-pakagri-primary">Welcome Back</h1>
            <p className="text-pakagri-earth mt-2">Sign in to your PakAgri account</p>
            <p className="font-urdu text-pakagri-gold mt-1">کسان کا ڈیجیٹل ساتھی</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Email <span className="font-urdu text-pakagri-earth">(ای میل)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-pakagri-cream-dark bg-white text-pakagri-earth-dark focus:outline-none focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="farmer@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pakagri-earth-dark mb-2">
                Password <span className="font-urdu text-pakagri-earth">(پاس ورڈ)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pakagri-earth/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-lg border border-pakagri-cream-dark bg-white text-pakagri-earth-dark focus:outline-none focus:ring-2 focus:ring-pakagri-gold"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pakagri-earth/50 hover:text-pakagri-earth"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-gold w-full py-4 text-lg disabled:opacity-50">
              {isLoading ? 'Signing in...' : <>Login <span className="font-urdu font-normal text-sm ml-2">(لاگ ان)</span></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-pakagri-earth">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-pakagri-gold hover:text-pakagri-gold-dark font-semibold">Register here</Link>
            </p>
            <p className="font-urdu text-pakagri-earth/60 mt-2 text-sm">اکاؤنٹ نہیں ہے؟ یہاں رجسٹر کریں</p>
          </div>
        </div>
      </div>
    </div>
  )
}
