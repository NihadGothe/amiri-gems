// lib/upload.ts
import path from 'path'
import fs from 'fs'

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export function ensureUploadDir(subDir?: string) {
  const dir = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function getPublicPath(filePath: string): string {
  // Convert absolute path to public URL
  return filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/')
}

export function deleteFile(publicPath: string) {
  if (!publicPath || publicPath.startsWith('http')) return
  try {
    const absPath = path.join(process.cwd(), 'public', publicPath)
    if (fs.existsSync(absPath)) {
      fs.unlinkSync(absPath)
    }
  } catch (e) {
    console.error('Failed to delete file:', e)
  }
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 10MB'
  }
  return null
}
