'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSlug } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import Toast from '@/components/admin/Toast'

export interface EventFormData {
  id?: string
  title: string
  slug: string
  date: string
  location: string
  shortDescription: string
  fullDescription: string
  mainImage: string
  galleryImages: string[]
  isFeatured: boolean
  isPublished: boolean
}

export const emptyEvent: EventFormData = {
  title: '', slug: '', date: '', location: '',
  shortDescription: '', fullDescription: '',
  mainImage: '', galleryImages: [],
  isFeatured: false, isPublished: true,
}

interface Props {
  initial: EventFormData
  isEdit?: boolean
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'

export default function EventForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<EventFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    if (!form.date) errs.date = 'Date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const url = isEdit && initial.id ? `/api/events/${initial.id}` : '/api/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ message: isEdit ? 'Event updated' : 'Event created', type: 'success' })
        setTimeout(() => router.push('/admin/events'), 700)
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
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEdit ? `Edit: ${initial.title}` : 'New Event'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Event details</p>
        </div>
        <Link href="/admin/events" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left — main content */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title *</label>
                <input type="text" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: isEdit ? p.slug : createSlug(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="e.g. Doha Jewellery & Watches Exhibition" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                  <input type="text" value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all font-mono" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all" />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all"
                  placeholder="e.g. Doha Exhibition and Convention Center" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                <textarea rows={2} value={form.shortDescription}
                  onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description</label>
                <textarea rows={6} value={form.fullDescription}
                  onChange={e => setForm(p => ({ ...p, fullDescription: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all resize-none" />
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Gallery Images</h3>
              <ImageUpload multiple value={form.galleryImages} onChange={urls => setForm(p => ({ ...p, galleryImages: urls as string[] }))} folder="images/events" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Main Image
                <span className="block text-xs text-gray-400 font-normal mt-0.5">Shown on event cards</span>
              </h3>
              <ImageUpload value={form.mainImage} onChange={url => setForm(p => ({ ...p, mainImage: url as string }))} folder="images/events" />
            </div>

            {/* Settings */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.isFeatured ? '#f59e0b' : '#d1d5db' }}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 font-medium">Featured</span>
                  <p className="text-xs text-gray-400">Show on homepage</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.isPublished ? GOLD : '#d1d5db' }}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 font-medium">Published</span>
                  <p className="text-xs text-gray-400">Visible on website</p>
                </div>
              </label>
            </div>

            {/* Save */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-3">
              <button type="submit" disabled={saving}
                className="w-full px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
                style={{ backgroundColor: GOLD }}
                onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = GOLD)}>
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
              </button>
              <Link href="/admin/events" className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
