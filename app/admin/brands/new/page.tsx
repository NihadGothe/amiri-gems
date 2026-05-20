'use client'
import BrandForm, { emptyBrand } from '@/components/admin/BrandForm'

export default function NewBrandPage() {
  return <BrandForm initial={emptyBrand} />
}
