'use client'
import CategoryForm, { emptyCategory } from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return <CategoryForm initial={emptyCategory} />
}
