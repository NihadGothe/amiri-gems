'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Inbox,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: string
  createdAt: string
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'
const LIMIT = 10
const statuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Message | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchMessages = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
    if (statusFilter) params.set('status', statusFilter)

    const res = await fetch(`/api/contact?${params}`)
    const data = await res.json()

    if (Array.isArray(data)) {
      setMessages(data)
      setTotal(data.length)
      setTotalPages(1)
    } else {
      setMessages(data.messages || [])
      setTotal(data.total || 0)
      setTotalPages(data.pages || 1)
    }

    setLoading(false)
  }

  useEffect(() => {
    setPage(1)
    fetchMessages(1)
  }, [statusFilter])

  useEffect(() => {
    fetchMessages(page)
  }, [page])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, status } : m)))
      if (selected?.id === id) setSelected(prev => (prev ? { ...prev, status } : null))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/contact/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Message deleted') : showToast('Failed to delete message', 'error')

    setDeleteId(null)
    if (selected?.id === deleteId) setSelected(null)
    fetchMessages(page)
  }

  const statusColor = (s: string) =>
    ({
      UNREAD: 'bg-[#b8974a]/10 text-[#b8974a] border-[#b8974a]/20',
      READ: 'bg-gray-100 text-gray-500 border-gray-200',
      REPLIED: 'bg-green-50 text-green-600 border-green-200',
      ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
    }[s] || 'bg-gray-100 text-gray-500 border-gray-200')

  const filtered = messages.filter(
    m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-[calc(100vh-90px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#14152e] px-7 py-6 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#b8974a_0%,transparent_45%)]" />

        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-px bg-[#b8974a]" />
              <p className="text-xs tracking-[0.3em] uppercase text-[#b8974a]">
                Enquiries
              </p>
            </div>

            <h1 className="text-white font-serif text-3xl font-light">
              Contact Messages
            </h1>

            <p className="text-white/50 text-sm mt-1">
              Manage customer enquiries and replies
            </p>
          </div>

          {/* <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-right">
            <p className="text-2xl font-semibold text-white">{total}</p>
            <p className="text-xs text-white/50 uppercase tracking-widest">
              Total Messages
            </p>
          </div> */}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50 focus:bg-white focus:border-[#b8974a] transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-[#b8974a]"
        >
          <option value="">All statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Message List */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Inbox size={17} className="text-[#b8974a]" />
            <p className="font-medium text-gray-800">Inbox</p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">
              Loading messages...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquare size={34} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
              {filtered.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg)
                    if (msg.status === 'UNREAD') updateStatus(msg.id, 'READ')
                  }}
                  className={`p-5 cursor-pointer transition-all border-l-4 ${
                    selected?.id === msg.id
                      ? 'bg-[#b8974a]/10 border-l-[#b8974a]'
                      : 'hover:bg-gray-50 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {msg.name}
                    </p>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border flex-shrink-0 ${statusColor(
                        msg.status
                      )}`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {msg.subject || 'No subject'}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {!selected ? (
            <div className="min-h-[420px] flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-[#b8974a]/10 flex items-center justify-center mb-4">
                <Mail size={28} className="text-[#b8974a]" />
              </div>

              <h3 className="font-serif text-2xl text-gray-800 mb-1">
                Select a message
              </h3>

              <p className="text-sm text-gray-400">
                Choose a customer enquiry from the inbox to view details.
              </p>
            </div>
          ) : (
            <div className="p-7">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span
                    className={`inline-flex mb-3 text-[10px] px-2.5 py-1 rounded-full border ${statusColor(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>

                  <h2 className="font-serif text-3xl text-gray-900 font-light">
                    {selected.subject || 'No Subject'}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} />
                      {selected.email}
                    </span>

                    {selected.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} />
                        {selected.phone}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {formatDate(selected.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#b8974a]"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setDeleteId(selected.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 mb-5">
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${
                    selected.subject || 'Your enquiry'
                  }`}
                  onClick={() => updateStatus(selected.id, 'REPLIED')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: GOLD }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}
                >
                  <Mail size={14} />
                  Reply via Email
                </a>

                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-xl border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Message"
        message="This message will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}