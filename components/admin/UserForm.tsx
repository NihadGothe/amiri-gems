'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Toast from '@/components/admin/Toast'

export interface UserFormData {
  id?: string
  name: string
  email: string
  password: string
  role: string
  isActive: boolean
}

export const emptyUser: UserFormData = {
  name: '', email: '', password: '', role: 'EDITOR', isActive: true,
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'

interface Props { initial: UserFormData; isEdit?: boolean }

export default function UserForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<UserFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required'
    if (!isEdit && !form.password) errs.password = 'Password is required for new users'
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const url = isEdit && initial.id ? `/api/admin/users/${initial.id}` : '/api/admin/users'
      const method = isEdit ? 'PUT' : 'POST'
      const payload = { ...form }
      if (isEdit && !payload.password) delete (payload as any).password
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setToast({ message: isEdit ? 'User updated' : 'User created', type: 'success' })
        setTimeout(() => router.push('/admin/users'), 700)
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
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{isEdit ? `Edit: ${initial.name || initial.email}` : 'New Admin User'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Admin panel access credentials</p>
        </div>
        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder="Admin Name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder="admin@amirigems.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password {isEdit && <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>}
              {!isEdit && ' *'}
            </label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder={isEdit ? '••••••••' : 'Min 6 characters'} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all bg-white">
              <option value="EDITOR">Editor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                style={{ backgroundColor: form.isActive ? GOLD : '#d1d5db' }}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm text-gray-700">Active (can login)</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 shadow-lg z-10 mt-6 -mx-6 rounded-b-xl">
          <Link href="/admin/users" className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
            style={{ backgroundColor: GOLD }}
            onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = GOLD_DARK)}
            onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = GOLD)}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
