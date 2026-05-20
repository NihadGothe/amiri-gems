'use client'
// app/admin/content/page.tsx
import { useEffect, useState } from 'react'
import { Save, FileText } from 'lucide-react'
import Toast from '@/components/admin/Toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface ContentBlock { id: string; key: string; title?: string; content?: string; image?: string; metadata?: string }
type ToastType = { message: string; type: 'success' | 'error' } | null

const contentKeys = [
  { key: 'home_jewellery_image',  label: 'Homepage — Jewellery Section Image', hasImage: true,  hasText: false, hasMetadata: false },
  { key: 'home_watches_image',    label: 'Homepage — Watches Section Image',   hasImage: true,  hasText: false, hasMetadata: false },
  { key: 'heritage_hero_image',   label: 'Heritage Page — Hero Banner Image',  hasImage: true,  hasText: false, hasMetadata: false },
  { key: 'heritage_intro',        label: 'Heritage Page — Story Section',      hasImage: true,  hasText: true,  hasMetadata: false },
  { key: 'chairman_name',         label: 'Chairman Bio (Sheikh Nawaf)',         hasImage: true,  hasText: true,  hasMetadata: true  },
  { key: 'ceo_name',              label: 'CEO Bio (Gope Shahani)',              hasImage: true,  hasText: true,  hasMetadata: true  },
  { key: 'footer_description',    label: 'Footer Description',                 hasImage: false, hasText: true,  hasMetadata: false },
  { key: 'contact_address',       label: 'Contact Information',                hasImage: false, hasText: false, hasMetadata: true  },
]

export default function ContentAdmin() {
  const [blocks, setBlocks] = useState<Record<string, ContentBlock>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastType>(null)
  const [forms, setForms] = useState<Record<string, { title: string; content: string; image: string; metadata: string }>>({})

  const showToast = (message: string, type: 'success' | 'error' = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3500) }

  const fetchBlocks = async () => {
    setLoading(true)
    const res = await fetch('/api/content')
    const data = await res.json()
    const byKey: Record<string, ContentBlock> = {}
    const initForms: Record<string, any> = {}
    if (Array.isArray(data)) {
      data.forEach((b: ContentBlock) => {
        byKey[b.key] = b
        initForms[b.key] = {
          title: b.title || '',
          content: b.content || '',
          image: b.image || '',
          metadata: b.metadata ? (typeof b.metadata === 'string' ? b.metadata : JSON.stringify(b.metadata, null, 2)) : '',
        }
      })
    }
    // Initialize missing keys
    contentKeys.forEach(ck => {
      if (!initForms[ck.key]) {
        initForms[ck.key] = { title: '', content: '', image: '', metadata: '' }
      }
    })
    setBlocks(byKey)
    setForms(initForms)
    setLoading(false)
  }

  useEffect(() => { fetchBlocks() }, [])

  const handleSave = async (key: string) => {
    setSaving(key)
    const formData = forms[key]
    const existing = blocks[key]
    const method = existing ? 'PUT' : 'POST'
    const url = existing ? `/api/content/${existing.id}` : '/api/content'
    const payload: any = { key, ...formData }
    if (formData.metadata) {
      try { payload.metadata = JSON.parse(formData.metadata) } catch { payload.metadata = formData.metadata }
    }
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { showToast('Content saved successfully'); fetchBlocks() }
    else showToast('Failed to save', 'error')
    setSaving(null)
  }

  if (loading) return <div className="py-16 text-center"><p className="text-sm text-gray-400 font-sans">Loading content...</p></div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-sans font-semibold text-gray-800">Page Content</h2>
        <p className="text-sm text-gray-500 font-sans mt-0.5">Edit website content, bios and contact information</p>
      </div>

      <div className="space-y-6">
        {contentKeys.map(ck => (
          <div key={ck.key} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText size={16} className="text-gold" />
              <h3 className="font-sans font-semibold text-gray-800 text-sm">{ck.label}</h3>
              <span className="text-xs text-gray-400 font-mono ml-1">({ck.key})</span>
            </div>
            <div className="p-6 space-y-4">
              {ck.hasText && (
                <>
                  <div>
                    <label className="text-xs font-sans font-medium text-gray-700 block mb-1.5">Title / Name</label>
                    <input type="text" value={forms[ck.key]?.title || ''} onChange={e => setForms(p => ({ ...p, [ck.key]: { ...p[ck.key], title: e.target.value } }))}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-sans outline-none focus:border-gold rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-sans font-medium text-gray-700 block mb-1.5">
                      Content / Description
                      <span className="text-gray-400 font-normal ml-2">(use a blank line between paragraphs)</span>
                    </label>
                    <textarea rows={6} value={forms[ck.key]?.content || ''} onChange={e => setForms(p => ({ ...p, [ck.key]: { ...p[ck.key], content: e.target.value } }))}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-sans outline-none focus:border-gold rounded resize-y" />
                  </div>
                </>
              )}
              {ck.hasImage && (
                <div>
                  <label className="text-xs font-sans font-medium text-gray-700 block mb-2">
                    Photo / Image
                    {!ck.hasText && <span className="text-gray-400 font-normal ml-2 text-xs">Upload to change the image shown on the homepage</span>}
                  </label>
                  <ImageUpload value={forms[ck.key]?.image || ''} onChange={url => setForms(p => ({ ...p, [ck.key]: { ...p[ck.key], image: url as string } }))} folder="images/home" />
                </div>
              )}
              {ck.hasMetadata && (
                <div>
                  <label className="text-xs font-sans font-medium text-gray-700 block mb-1.5">
                    Metadata (JSON — phones, emails, social links)
                  </label>
                  <textarea rows={6} value={forms[ck.key]?.metadata || ''} onChange={e => setForms(p => ({ ...p, [ck.key]: { ...p[ck.key], metadata: e.target.value } }))}
                    placeholder='{"phone1": "+974 4452 0000", "email": "info@amirigems.net", "instagram": "https://..."}'
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-mono outline-none focus:border-gold rounded resize-none" />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave(ck.key)}
                  disabled={saving === ck.key}
                  className="flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-dark text-white text-sm font-sans font-medium rounded transition-colors disabled:opacity-60"
                >
                  <Save size={14} />
                  {saving === ck.key ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}