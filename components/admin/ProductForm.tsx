'use client'
// components/admin/ProductForm.tsx — shared product create/edit form
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createSlug } from '@/lib/utils'
import ImageUpload from './ImageUpload'
import Toast from './Toast'

export interface ProductFormData {
  id?: string
  name: string
  slug: string
  brandId: string
  categoryId: string
  type: 'JEWELLERY' | 'WATCH'
  shortDescription: string
  fullDescription: string
  images: string[]
  price: string
  salePrice: string
  sku: string
  stock: number
  isFeatured: boolean
  isPublished: boolean
  specifications: string
}

export const emptyProduct: ProductFormData = {
  name: '', slug: '', brandId: '', categoryId: '', type: 'JEWELLERY',
  shortDescription: '', fullDescription: '',
  images: [], price: '', salePrice: '',
  sku: '', stock: 0, isFeatured: false, isPublished: true,
  specifications: '',
}

interface Brand { id: string; name: string; type: string }
interface Category { id: string; name: string }

interface Props {
  initial: ProductFormData
  isEdit?: boolean
}

export default function ProductForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(initial)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(Array.isArray(d) ? d : [])).catch(() => {})
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!form.brandId) e.brandId = 'Brand is required'
    if (form.specifications) {
      try { JSON.parse(form.specifications) } catch { e.specifications = 'Must be valid JSON' }
    }
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
      const url = isEdit && form.id ? `/api/products/${form.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          specifications: form.specifications ? JSON.parse(form.specifications) : {},
        }),
      })
      if (res.ok) {
        showToast(isEdit ? 'Product updated' : 'Product created')
        setTimeout(() => router.push('/admin/products'), 600)
      } else {
        const data = await res.json().catch(() => ({}))
        showToast(data.error || 'Failed to save product', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    }
    setSaving(false)
  }

  const filteredBrands = brands.filter(b => b.type === form.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-500 hover:text-gold p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-sans font-semibold text-gray-800">
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="text-sm text-gray-500 font-sans">
              {isEdit ? 'Update product information' : 'Add a new jewellery piece or timepiece'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products" className="ag-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="ag-btn-primary">
            <Save size={14} />
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="ag-label">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: !isEdit ? createSlug(e.target.value) : p.slug }))}
                  className="ag-input"
                  placeholder="e.g. Streamliner Small Seconds Aqua Blue"
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
                  />
                  {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
                </div>
                <div>
                  <label className="ag-label">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                    className="ag-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="ag-label">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value as 'JEWELLERY' | 'WATCH', brandId: '' }))}
                    className="ag-input"
                  >
                    <option value="JEWELLERY">Jewellery</option>
                    <option value="WATCH">Watch</option>
                  </select>
                </div>
                <div>
                  <label className="ag-label">Brand *</label>
                  <select
                    value={form.brandId}
                    onChange={e => setForm(p => ({ ...p, brandId: e.target.value }))}
                    className="ag-input"
                  >
                    <option value="">Select Brand</option>
                    {filteredBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  {errors.brandId && <p className="text-xs text-red-600 mt-1">{errors.brandId}</p>}
                </div>
                <div>
                  <label className="ag-label">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                    className="ag-input"
                  >
                    <option value="">No Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="ag-label">Short Description</label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                  className="ag-input resize-none"
                />
              </div>

              <div>
                <label className="ag-label">Full Description</label>
                <textarea
                  rows={5}
                  value={form.fullDescription}
                  onChange={e => setForm(p => ({ ...p, fullDescription: e.target.value }))}
                  className="ag-input resize-none"
                />
              </div>
            </div>
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="ag-label">Price (QAR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="ag-input"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="ag-label">Sale Price (QAR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.salePrice}
                  onChange={e => setForm(p => ({ ...p, salePrice: e.target.value }))}
                  className="ag-input"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="ag-label">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                  className="ag-input"
                />
              </div>
            </div>
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Images</h3>
            <p className="text-xs text-gray-500 mb-3">First image is used as the main thumbnail</p>
            <ImageUpload multiple value={form.images} onChange={urls => setForm(p => ({ ...p, images: urls as string[] }))} folder="images/products" />
          </div>

          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Specifications</h3>
            <p className="text-xs text-gray-500 mb-2">JSON object for product specs (optional)</p>
            <textarea
              rows={5}
              value={form.specifications}
              onChange={e => setForm(p => ({ ...p, specifications: e.target.value }))}
              className="ag-input font-mono text-xs resize-none"
              placeholder='{"Movement": "Automatic", "Case Size": "40mm"}'
            />
            {errors.specifications && <p className="text-xs text-red-600 mt-1">{errors.specifications}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="ag-card">
            <h3 className="font-sans font-semibold text-gray-800 mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-gold' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} />
                </button>
                <label className="text-sm font-sans text-gray-700">Published</label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-amber-400' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-5' : ''}`} />
                </button>
                <label className="text-sm font-sans text-gray-700">Featured</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 shadow-lg z-10">
        <Link href="/admin/products" className="ag-btn-secondary">Cancel</Link>
        <button type="submit" disabled={saving} className="ag-btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
