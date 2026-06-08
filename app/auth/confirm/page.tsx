'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get tokens from URL
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const error = searchParams.get('error')
        const error_description = searchParams.get('error_description')

        // Check for error in URL
        if (error) {
          setStatus('error')
          setMessage(error_description || 'Verification failed. Please try again.')
          return
        }

        // Verify the token
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'recovery',
          })

          if (error) {
            setStatus('error')
            setMessage(error.message || 'Verification failed. The link may have expired.')
          } else {
            setStatus('success')
            setMessage('Your email has been verified successfully!')
            // Redirect to login after 3 seconds
            setTimeout(() => {
              router.push('/login?verified=true')
            }, 3000)
          }
        } else {
          // Check if already logged in (from session)
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            setStatus('success')
            setMessage('Your email has been verified successfully!')
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            setStatus('error')
            setMessage('Invalid verification link. Please request a new one.')
          }
        }
      } catch (err) {
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-wheat-pattern opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pakagri-cream rounded-xl mb-4">
                <Loader2 className="w-8 h-8 text-pakagri-gold animate-spin" />
              </div>
              <h1 className="font-display text-2xl text-pakagri-primary mb-2">Verifying Email...</h1>
              <p className="text-pakagri-earth">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-display text-2xl text-pakagri-primary mb-2">Email Verified!</h1>
              <p className="text-pakagri-earth mb-6">{message}</p>
              <p className="text-sm text-pakagri-earth/60">Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="font-display text-2xl text-pakagri-primary mb-2">Verification Failed</h1>
              <p className="text-pakagri-earth mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="btn-gold inline-block px-8 py-3">
                  Go to Login
                </Link>
                <Link href="/register" className="text-pakagri-gold hover:text-pakagri-gold-dark font-medium">
                  Register again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pakagri-gold animate-spin" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}
