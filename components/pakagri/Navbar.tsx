'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Wheat, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-pakagri-primary shadow-lg' : 'bg-pakagri-primary/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Wheat className="w-8 h-8 text-pakagri-gold transition-transform group-hover:rotate-12" />
            <span className="font-display text-2xl text-white">
              Pak<span className="text-pakagri-gold">Agri</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-pakagri-cream hover:text-pakagri-gold transition-colors font-medium">Home</Link>
            <Link href="/accuracy" className="text-pakagri-cream hover:text-pakagri-gold transition-colors font-medium">Accuracy</Link>
            <Link href="/dashboard" className="text-pakagri-cream hover:text-pakagri-gold transition-colors font-medium">Dashboard</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-pakagri-cream hover:text-pakagri-gold transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-pakagri-gold/20 text-pakagri-gold px-4 py-2 rounded-lg hover:bg-pakagri-gold/30 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-pakagri-cream hover:text-pakagri-gold transition-colors font-medium">Login</Link>
                <Link href="/register" className="bg-pakagri-gold text-pakagri-primary-dark px-4 py-2 rounded-lg font-semibold hover:bg-pakagri-gold-light transition-colors shadow-golden">Register</Link>
              </>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-pakagri-cream p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 border-t border-pakagri-primary-light/30">
            <div className="flex flex-col gap-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-pakagri-cream hover:text-pakagri-gold px-2">Home</Link>
              <Link href="/accuracy" onClick={() => setIsOpen(false)} className="text-pakagri-cream hover:text-pakagri-gold px-2">Accuracy</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-pakagri-cream hover:text-pakagri-gold px-2">Dashboard</Link>
              <div className="pt-4 border-t border-pakagri-primary-light/30 flex flex-col gap-3">
                {user ? (
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 bg-pakagri-gold/20 text-pakagri-gold px-4 py-2 rounded-lg">Logout</button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-pakagri-cream px-2">Login</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="bg-pakagri-gold text-pakagri-primary-dark px-4 py-2 rounded-lg text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
