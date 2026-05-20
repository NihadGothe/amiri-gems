'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageLoader() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(20)
    const t1 = setTimeout(() => setProgress(60), 100)
    const t2 = setTimeout(() => setProgress(90), 300)
    const t3 = setTimeout(() => { setProgress(100); setTimeout(() => setLoading(false), 200) }, 500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [pathname])

  if (!loading && progress === 0) return null

  return (
    <>
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 z-[9999] h-0.5 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: '#b8974a',
          opacity: loading ? 1 : 0,
          boxShadow: '0 0 8px rgba(184,151,74,0.6)',
        }}
      />

      {/* Full page overlay on initial load */}
      {loading && progress < 90 && (
        <div className="fixed inset-0 z-[9998] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/images/home/ag-logo-gold.png"
              alt="Amiri Gems"
              className="w-16 h-16 object-contain animate-pulse"
            />
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: '#b8974a',
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  )
}