'use client'
// components/admin/ConfirmModal.tsx
import { AlertTriangle } from 'lucide-react'

interface Props {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  danger?: boolean
}

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel,
  confirmLabel = 'Delete', danger = true
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
            <AlertTriangle size={18} className={danger ? 'text-red-600' : 'text-amber-600'} />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-gray-800 text-base">{title}</h3>
            <p className="text-sm text-gray-600 font-sans mt-1">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-sans text-gray-600 border border-gray-200 hover:bg-gray-50 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-sans text-white rounded transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gold hover:bg-gold-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
