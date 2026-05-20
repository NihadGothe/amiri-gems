'use client'
// components/admin/Toast.tsx
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl ${
        type === 'success' ? 'bg-white border-l-4 border-green-500' : 'bg-white border-l-4 border-red-500'
      }`}>
        {type === 'success'
          ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          : <XCircle size={18} className="text-red-500 flex-shrink-0" />
        }
        <p className="text-sm font-sans text-gray-800 font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
