'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSlug } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import Toast from '@/components/admin/Toast'

export interface BoutiqueFormData {
  id?: string
  name: string
  slug: string
  city: string
  country: string
  address: string
  phone: string
  email: string
  whatsapp: string
  latitude: string
  longitude: string
  openingHours: string
  brands: string
  services: string
  galleryImages: string[]
  sortOrder: number
  isPublished: boolean
}

export const emptyBoutique: BoutiqueFormData = {
  name: '', slug: '', city: '', country: 'Qatar', address: '', phone: '', email: '', whatsapp: '',
  latitude: '', longitude: '',
  openingHours: '{"Saturday - Thursday": "10:00 AM – 10:00 PM", "Friday": "2:00 PM – 10:00 PM"}',
  brands: '[]', services: '[]', galleryImages: [], sortOrder: 0, isPublished: true,
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'

interface Props { initial: BoutiqueFormData; isEdit?: boolean }

export default function BoutiqueForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<BoutiqueFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const url = isEdit && initial.id ? `/api/boutiques/${initial.id}` : '/api/boutiques'
      const method = isEdit ? 'PUT' : 'POST'
      const payload = {
        ...form,
        latitude:     form.latitude  ? parseFloat(form.latitude)  : null,
        longitude:    form.longitude ? parseFloat(form.longitude) : null,
        openingHours: (() => { try { return JSON.parse(form.openingHours) } catch { return {} } })(),
        brands:       (() => { try { return JSON.parse(form.brands)       } catch { return [] } })(),
        services:     (() => { try { return JSON.parse(form.services)     } catch { return [] } })(),
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setToast({ message: isEdit ? 'Boutique updated' : 'Boutique created', type: 'success' })
        setTimeout(() => router.push('/admin/boutiques'), 700)
      } else {
        const err = await res.json().catch(() => ({}))
        setToast({ message: err.error || 'Failed to save', type: 'error' })
        setSaving(false)
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' })
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{isEdit ? `Edit: ${initial.name}` : 'New Boutique'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Boutique location details</p>
        </div>
        <Link href="/admin/boutiques" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ─────────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Boutique Name *</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: isEdit ? p.slug : createSlug(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                  <input type="text" value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all font-mono" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" placeholder="Doha" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <input type="text" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                <textarea rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all resize-none" />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Contact Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" placeholder="+974 XXXX XXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
                  <input type="text" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                  <input type="number" step="0.0001" value={form.latitude} onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" placeholder="25.2854" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                  <input type="number" step="0.0001" value={form.longitude} onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" placeholder="51.5310" />
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Display Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" placeholder="1" />
                  <p className="text-xs text-gray-400 mt-1">Lower number = shows first</p>
                </div>
              </div>
            </div>

            {/* Hours & Brands */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Hours & Brands</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Opening Hours <span className="text-gray-400 font-normal text-xs">(JSON format)</span>
                </label>
                <textarea rows={4} value={form.openingHours} onChange={e => setForm(p => ({ ...p, openingHours: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all resize-none font-mono" />
                <p className="text-xs text-gray-400 mt-1">Example: {`{"Saturday - Thursday": "10:00 AM – 10:00 PM"}`}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brands Available <span className="text-gray-400 font-normal text-xs">(JSON array)</span>
                </label>
                <textarea rows={2} value={form.brands} onChange={e => setForm(p => ({ ...p, brands: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all resize-none font-mono"
                  placeholder='["ADLER", "CHATILA"]' />
              </div>
            </div>
          </div>

          {/* ── Right sidebar (1/3) ───────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Gallery Images */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100 mb-4">
                Boutique Images
                <span className="block text-xs text-gray-400 font-normal mt-0.5">First image shows as card cover</span>
              </h3>
              <ImageUpload multiple value={form.galleryImages} onChange={urls => setForm(p => ({ ...p, galleryImages: urls as string[] }))} folder="images/boutiques" />
            </div>

            {/* Visibility */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100 mb-4">Visibility</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.isPublished ? GOLD : '#d1d5db' }}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 font-medium">Published</span>
                  <p className="text-xs text-gray-400">Visible on the website</p>
                </div>
              </label>
            </div>

            {/* Save sticky card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-3">
              <button type="submit" disabled={saving}
                className="w-full px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
                style={{ backgroundColor: GOLD }}
                onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = GOLD)}>
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Boutique'}
              </button>
              <Link href="/admin/boutiques" className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
            </div>
          </div>

        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}