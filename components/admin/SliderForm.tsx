'use client'
// components/admin/SliderForm.tsx
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import ImageUpload from './ImageUpload'
import Toast from './Toast'

export interface SliderFormData {
  id?: string
  title: string
  subtitle: string
  image: string
  ctaText: string
  ctaLink: string
  placement: 'HOME' | 'JEWELLERY' | 'WATCHES' | 'BRANDS' | 'EVENTS' | 'MEDIA'
  sortOrder: number
  isActive: boolean
}

export const emptySlider: SliderFormData = {
  title: '', subtitle: '', image: '', ctaText: '', ctaLink: '',
  placement: 'HOME', sortOrder: 0, isActive: true,
}

interface Props {
  initial: SliderFormData
  isEdit?: boolean
}

export default function SliderForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<SliderFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.image) e.image = 'Image is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) {
      showToast('Please add a slider image', 'error')
      return
    }
    setSaving(true)
    try {
      const url = isEdit && form.id ? `/api/sliders/${form.id}` : '/api/sliders'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast(isEdit ? 'Slider updated' : 'Slider created')
        setTimeout(() => router.push('/admin/sliders'), 600)
      } else {
        const data = await res.json().catch(() => ({}))
        showToast(data.error || 'Failed to save slider', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/sliders" className="text-gray-500 hover:text-gold p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-sans font-semibold text-gray-800">
              {isEdit ? 'Edit Slider' : 'New Slider'}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/sliders" className="ag-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="ag-btn-primary">
            <Save size={14} />
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Slider')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Content</h3>
            <div className="space-y-4">
              <div>
                <label className="ag-label">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="ag-input"
                  placeholder="e.g. Amiri Gems Jewellery"
                />
              </div>
              <div>
                <label className="ag-label">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                  className="ag-input"
                  placeholder="e.g. Fine jewellery crafted for generations"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="ag-label">Button Text</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={e => setForm(p => ({ ...p, ctaText: e.target.value }))}
                    className="ag-input"
                    placeholder="e.g. SHOP NOW"
                  />
                </div>
                <div>
                  <label className="ag-label">Button Link</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={e => setForm(p => ({ ...p, ctaLink: e.target.value }))}
                    className="ag-input"
                    placeholder="e.g. /jewellery"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Slider Image *</h3>
            <ImageUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url as string }))} folder="images/sliders" />
            {errors.image && <p className="text-xs text-red-600 mt-2">{errors.image}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="ag-label">Placement *</label>
                <select
                  value={form.placement}
                  onChange={e => setForm(p => ({ ...p, placement: e.target.value as any }))}
                  className="ag-input"
                >
                  <option value="HOME">Home</option>
                  <option value="JEWELLERY">Jewellery</option>
                  <option value="WATCHES">Watches</option>
                  <option value="BRANDS">Brands</option>
                  <option value="EVENTS">Events</option>
                  <option value="MEDIA">Media</option>
                </select>
              </div>
              <div>
                <label className="ag-label">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="ag-input"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-gold' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : ''}`} />
                </button>
                <label className="text-sm font-sans text-gray-700">Active</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  )
}
