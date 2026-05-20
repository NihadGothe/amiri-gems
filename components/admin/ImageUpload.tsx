'use client'
// components/admin/ImageUpload.tsx
import { useRef, useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, AlertTriangle } from 'lucide-react'

interface Props {
  value?: string | string[] | null
  onChange: (url: string | string[]) => void
  folder?: string
  multiple?: boolean
}

const MAX_MB = 10
const MAX_BYTES = MAX_MB * 1024 * 1024

export default function ImageUpload({ value, onChange, folder = 'uploads', multiple = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [sizeWarnings, setSizeWarnings] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const data = await res.json()
      return data.url
    }
    const err = await res.json().catch(() => ({}))
    setUploadError(err.error || 'Upload failed')
    return null
  }

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    setUploadError(null)

    // Check sizes — warn but still allow upload
    const warnings: string[] = []
    Array.from(files).forEach(f => {
      if (f.size > MAX_BYTES) {
        warnings.push(`"${f.name}" is ${(f.size / 1024 / 1024).toFixed(1)}MB — larger than ${MAX_MB}MB, upload may be slow`)
      }
    })
    setSizeWarnings(warnings)

    setUploading(true)
    try {
      if (multiple) {
        const current = Array.isArray(value) ? value : []
        const urls: string[] = []
        for (const file of Array.from(files)) {
          const url = await uploadFile(file)
          if (url) urls.push(url)
        }
        onChange([...current, ...urls])
      } else {
        const url = await uploadFile(files[0])
        if (url) {
          setSizeWarnings([])
          onChange(url)
        }
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (idx?: number) => {
    setSizeWarnings([])
    setUploadError(null)
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((_, i) => i !== idx))
    } else {
      onChange('')
    }
  }

  // Normalize single value — handle null/undefined safely
  const singleVal = !multiple
    ? (value != null && typeof value === 'string' && value.trim() !== '' ? value : '')
    : ''

  // Single image
  if (!multiple) {
    return (
      <div className="space-y-2">
        {singleVal ? (
          <div className="relative inline-block">
            <img
              src={singleVal}
              alt="Uploaded"
              className="w-32 h-32 object-contain border border-gray-200 rounded-lg bg-gray-50 p-1"
              onError={e => { (e.target as HTMLImageElement).src = '' }}
            />
            <button
              type="button"
              onClick={() => removeImage()}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={10} />
            </button>
          </div>
        ) : null}

        <div
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={20} className="text-amber-500 animate-spin" />
              <p className="text-xs text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={20} className="text-gray-400" />
              <p className="text-xs text-gray-500">Click or drag image here</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF</p>
            </div>
          )}
        </div>

        {sizeWarnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">{w}</p>
          </div>
        ))}
        {uploadError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">{uploadError}</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>
    )
  }

  // Multiple images
  const multiVal = Array.isArray(value) ? value.filter(Boolean) : []
  return (
    <div className="space-y-3">
      {multiVal.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {multiVal.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover border border-gray-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={20} className="text-amber-500 animate-spin" />
            <p className="text-xs text-gray-500">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-gray-400" />
              <Upload size={18} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Click or drag to add images</p>
            <p className="text-xs text-gray-400">Multiple files supported</p>
          </div>
        )}
      </div>

      {sizeWarnings.map((w, i) => (
        <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{w}</p>
        </div>
      ))}
      {uploadError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700">{uploadError}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  )
}
