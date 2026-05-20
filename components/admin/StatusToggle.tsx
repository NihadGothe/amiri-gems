'use client'
import { useState } from 'react'

interface Props {
  id: string
  status: boolean
  endpoint: string          // e.g. /api/brands
  statusField?: string      // default: 'status'
  onToggled?: (newStatus: boolean) => void
}

export default function StatusToggle({ id, status, endpoint, statusField = 'status', onToggled }: Props) {
  const [active, setActive] = useState(status)
  const [loading, setLoading] = useState(false)

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [statusField]: !active }),
      })
      if (res.ok) {
        setActive(!active)
        onToggled?.(!active)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? 'Click to deactivate' : 'Click to activate'}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${active ? 'bg-amber-500' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          active ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
