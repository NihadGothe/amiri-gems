'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Slide {
  id: string
  image: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export default function JewelleryHeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '55vh', minHeight: 360 }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.title || 'Jewellery'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20">
            <div className={`transition-all duration-700 ${i === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {slide.subtitle && (
                <p className="text-white/80 font-sans text-xs tracking-widest uppercase mb-2">{slide.subtitle}</p>
              )}
              {slide.title && (
                <h1 className="font-serif text-white text-4xl md:text-6xl font-light italic mb-6 max-w-2xl">
                  {slide.title}
                </h1>
              )}
              {slide.ctaText && slide.ctaLink && (
                <Link href={slide.ctaLink} className="btn-luxury inline-block">{slide.ctaText}</Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-0.5 transition-all ${i === current ? 'bg-gold w-8' : 'bg-white/50 w-4'}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10">
            ‹
          </button>
          <button onClick={() => setCurrent(c => (c + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10">
            ›
          </button>
        </>
      )}
    </div>
  )
}
