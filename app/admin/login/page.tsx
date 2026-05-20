'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) { router.push('/admin') } else { setError('Invalid email or password') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left — Luxury Brand Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0a14 0%, #14152e 40%, #1a1535 100%)' }}
      >
        {/* Gold glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #b8974a 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #b8974a 0%, transparent 70%)' }} />
        </div>

        {/* Decorative corner lines */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l opacity-30" style={{ borderColor: '#b8974a' }} />
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r opacity-30" style={{ borderColor: '#b8974a' }} />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l opacity-30" style={{ borderColor: '#b8974a' }} />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r opacity-30" style={{ borderColor: '#b8974a' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <div className="w-32 h-32 rounded-3xl bg-[#111827]/60 border border-[#b8974a]/20 flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <img
                src="/images/home/ag-gold.png"
                alt="Amiri Gems"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          {/* Brand name */}
          <h1 className="font-serif text-white text-4xl font-light tracking-[0.3em] uppercase mb-2">
            Amiri Gems
          </h1>
          <div className="w-16 h-px mb-3" style={{ backgroundColor: '#b8974a' }} />
          <p className="text-xs tracking-[0.4em] uppercase mb-12" style={{ color: '#b8974a' }}>
            المجوهرات الأميريه
          </p>

          {/* Tagline */}
          <p className="text-white/40 font-sans text-sm leading-relaxed max-w-xs">
            The Home of Luxury Diamonds and Watches.<br />Doha, Qatar — Since 1994.
          </p>

          {/* Bottom divider */}
          <div className="absolute bottom-0 left-0 right-0 h-px opacity-20" style={{ backgroundColor: '#b8974a' }} />
        </div>

        {/* Background image overlay */}
        <div className="absolute inset-0 opacity-5">
          <img src="/images/sliders/shutterstock-1172392699.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ── Right — Login Form ────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo — only shows on small screens */}
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <img src="/images/home/ag-logo-gold.png" alt="Amiri Gems"
              className="w-16 h-16 object-contain mb-3" />
            <h1 className="font-serif text-gray-800 text-2xl font-light tracking-widest uppercase">Amiri Gems</h1>
            <p className="text-xs tracking-widest mt-1" style={{ color: '#b8974a' }}>Admin Panel</p>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-gray-800 font-serif text-3xl font-light mb-1">Welcome back</h2>
            <p className="text-gray-400 font-sans text-sm">Sign in to your admin panel</p>
            <div className="w-10 h-px mt-4" style={{ backgroundColor: '#b8974a' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 tracking-widest uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@amirigems.com"
                className="w-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 px-4 py-3.5 text-sm font-sans outline-none transition-all rounded-lg focus:bg-white"
                style={{ ['--tw-ring-color' as any]: '#b8974a' }}
                onFocus={e => { e.target.style.borderColor = '#b8974a'; e.target.style.boxShadow = '0 0 0 3px rgba(184,151,74,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 px-4 py-3.5 pr-11 text-sm font-sans outline-none transition-all rounded-lg focus:bg-white"
                  onFocus={e => { e.target.style.borderColor = '#b8974a'; e.target.style.boxShadow = '0 0 0 3px rgba(184,151,74,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-red-600 text-xs font-sans">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 font-sans text-xs font-semibold tracking-widest uppercase transition-all disabled:opacity-60 rounded-lg mt-2 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#b8974a' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#a0832e')}
              onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#b8974a')}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={13} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-300 text-xs font-sans mt-10">
            © {new Date().getFullYear()} Amiri Gems. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}
