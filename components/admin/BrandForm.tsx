'use client'
// components/admin/BrandForm.tsx — shared between new/edit pages
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createSlug } from '@/lib/utils'
import ImageUpload from './ImageUpload'
import Toast from './Toast'

export interface BrandFormData {
  id?: string
  name: string
  slug: string
  type: 'JEWELLERY' | 'WATCH'
  shortDescription: string
  fullDescription: string
  logo: string
  status: boolean
  sortOrder: number
  seoTitle: string
  seoDescription: string
  heroImages: string[]
  galleryImages: string[]
}

export const emptyBrand: BrandFormData = {
  name: '', slug: '', type: 'JEWELLERY', shortDescription: '', fullDescription: '',
  logo: '', status: true, sortOrder: 0, seoTitle: '', seoDescription: '',
  heroImages: [], galleryImages: [],
}

interface Props {
  initial: BrandFormData
  isEdit?: boolean
}

export default function BrandForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<BrandFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Brand name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug must be lowercase letters, numbers, and dashes only'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }
    setSaving(true)
    try {
      const url = isEdit && form.id ? `/api/brands/${form.id}` : '/api/brands'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast(isEdit ? 'Brand updated' : 'Brand created')
        setTimeout(() => router.push('/admin/brands'), 600)
      } else {
        const data = await res.json().catch(() => ({}))
        showToast(data.error || 'Failed to save brand', 'error')
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
          <Link href="/admin/brands" className="text-gray-500 hover:text-gold p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-sans font-semibold text-gray-800">
              {isEdit ? 'Edit Brand' : 'New Brand'}
            </h2>
            <p className="text-sm text-gray-500 font-sans">
              {isEdit ? 'Update brand information' : 'Add a new jewellery or watch brand'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/brands" className="ag-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="ag-btn-primary">
            <Save size={14} />
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Brand')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="ag-label">Brand Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: !isEdit ? createSlug(e.target.value) : p.slug }))}
                  className="ag-input"
                  placeholder="e.g. ADLER"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="ag-label">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="ag-input font-mono"
                    placeholder="adler"
                  />
                  {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
                </div>
                <div>
                  <label className="ag-label">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value as 'JEWELLERY' | 'WATCH' }))}
                    className="ag-input"
                  >
                    <option value="JEWELLERY">Jewellery</option>
                    <option value="WATCH">Watch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="ag-label">Short Description</label>
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                  className="ag-input resize-none"
                  placeholder="A concise tagline shown on listing pages"
                />
              </div>

              <div>
                <label className="ag-label">Full Description</label>
                <textarea
                  rows={6}
                  value={form.fullDescription}
                  onChange={e => setForm(p => ({ ...p, fullDescription: e.target.value }))}
                  className="ag-input resize-none"
                  placeholder="A longer description shown on the brand page"
                />
              </div>
            </div>
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="ag-label">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))}
                  className="ag-input"
                />
              </div>
              <div>
                <label className="ag-label">SEO Description</label>
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={e => setForm(p => ({ ...p, seoDescription: e.target.value }))}
                  className="ag-input resize-none"
                />
              </div>
            </div>
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Hero Images</h3>
            <p className="text-xs text-gray-500 mb-3">Large banner images shown on the brand page</p>
            <ImageUpload multiple value={form.heroImages} onChange={urls => setForm(p => ({ ...p, heroImages: urls as string[] }))} folder="images/brands" />
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Gallery Images</h3>
            <p className="text-xs text-gray-500 mb-3">Additional product/lifestyle images for the brand</p>
            <ImageUpload multiple value={form.galleryImages} onChange={urls => setForm(p => ({ ...p, galleryImages: urls as string[] }))} folder="images/brands" />
          </div>
        </div>

        {/* SIDE */}
        <div className="space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Logo</h3>
            <ImageUpload value={form.logo} onChange={url => setForm(p => ({ ...p, logo: url as string }))} folder="images/brands" />
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Settings</h3>
            <div className="space-y-4">
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
                  onClick={() => setForm(p => ({ ...p, status: !p.status }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.status ? 'bg-gold' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.status ? 'translate-x-5' : ''}`} />
                </button>
                <label className="text-sm font-sans text-gray-700">Active</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 shadow-lg z-10">
        <Link href="/admin/brands" className="ag-btn-secondary">Cancel</Link>
        <button type="submit" disabled={saving} className="ag-btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Brand'}
        </button>
      </div>
    </form>
  )
}
