'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Calendar } from 'lucide-react'

interface Slider {
  id: string
  title?: string
  subtitle?: string
  image: string
  ctaText?: string
  ctaLink?: string
  placement: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ViewSliderPage() {
  const params = useParams() as { id: string }
  const [slider, setSlider] = useState<Slider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/sliders/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setSlider(d))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
  if (!slider) return <div className="p-12 text-center text-sm text-gray-500">Slider not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/sliders" className="text-gray-500 hover:text-gold p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-sans font-semibold text-gray-800">{slider.title || 'Untitled slider'}</h2>
            <p className="text-sm text-gray-500">{slider.placement} placement</p>
          </div>
        </div>
        <Link href={`/admin/sliders/${slider.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: "#b8974a" }}>
          <Pencil size={14} /> Edit Slider
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-100" style={{ aspectRatio: '21/9' }}>
              {slider.image && <img src={slider.image} alt={slider.title || ''} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                {slider.subtitle && (
                  <p className="text-white/80 text-xs tracking-widest uppercase mb-2">{slider.subtitle}</p>
                )}
                {slider.title && (
                  <h1 className="font-serif text-white text-3xl md:text-5xl font-light italic mb-4">{slider.title}</h1>
                )}
                {slider.ctaText && (
                  <span className="btn-luxury inline-block self-start">{slider.ctaText}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Placement</dt>
                <dd className="text-gray-800 font-medium">{slider.placement}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Sort order</dt>
                <dd className="text-gray-800">{slider.sortOrder}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={slider.isActive ? 'text-xs px-2 py-1 rounded-full bg-green-50 text-green-600' : 'text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500'}>
                    {slider.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
              {slider.ctaLink && (
                <div>
                  <dt className="text-gray-500 mb-1">CTA link</dt>
                  <dd className="text-gray-800 text-xs font-mono break-all">{slider.ctaLink}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Created</dt>
                <dd className="text-gray-800 text-xs">{new Date(slider.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
