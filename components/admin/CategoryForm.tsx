'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSlug } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import Toast from '@/components/admin/Toast'

export interface CategoryFormData {
  id?: string
  name: string
  slug: string
  description: string
  bannerImage: string
  status: boolean
  sortOrder: number
}

export const emptyCategory: CategoryFormData = {
  name: '', slug: '', description: '', bannerImage: '', status: true, sortOrder: 0,
}

interface Props {
  initial: CategoryFormData
  isEdit?: boolean
}

export default function CategoryForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<CategoryFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Lowercase letters, numbers and hyphens only'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const url = isEdit && initial.id ? `/api/categories/${initial.id}` : '/api/categories'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ message: isEdit ? 'Category updated' : 'Category created', type: 'success' })
        setTimeout(() => router.push('/admin/categories'), 700)
      } else {
        setToast({ message: 'Failed to save', type: 'error' })
        setSaving(false)
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' })
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEdit ? `Edit: ${initial.name}` : 'New Category'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Jewellery category</p>
        </div>
        <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: isEdit ? p.slug : createSlug(e.target.value) }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                placeholder="e.g. High Jewellery"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all font-mono"
                placeholder="e.g. high-jewellery"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
              <p className="text-xs text-gray-400 mt-1">URL: /jewellery/{form.slug || 'slug'}</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                placeholder="Short description of this category"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
                <span className="text-xs text-gray-400 font-normal ml-2">Shown on homepage jewellery section</span>
              </label>
              <ImageUpload
                value={form.bannerImage}
                onChange={url => setForm(p => ({ ...p, bannerImage: url as string }))}
                folder="images/jewellery"
              />
            </div>

            {/* Sort Order + Status */}
            <div className="grid grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, status: !p.status }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                    style={{ backgroundColor: form.status ? '#b8974a' : '#d1d5db' }}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.status ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <Link
              href="/admin/categories"
              className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#b8974a' }}
              onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = '#a0832e')}
              onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = '#b8974a')}
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
