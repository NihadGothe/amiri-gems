// lib/validations.ts
import { z } from 'zod'

export const BrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  type: z.enum(['JEWELLERY', 'WATCH']),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  logo: z.string().optional(),
  status: z.boolean().default(true),
  sortOrder: z.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().optional(),
  type: z.enum(['JEWELLERY', 'WATCH']),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  price: z.number().optional(),
  salePrice: z.number().optional(),
  sku: z.string().optional(),
  stock: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
})

export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  bannerImage: z.string().optional(),
  status: z.boolean().default(true),
  sortOrder: z.number().default(0),
})

export const EventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  slug: z.string().min(1, 'Slug is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  mainImage: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
})

export const BoutiqueSchema = z.object({
  name: z.string().min(1, 'Boutique name is required'),
  slug: z.string().min(1, 'Slug is required'),
  city: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isPublished: z.boolean().default(true),
})

export const ContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const SliderSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  placement: z.enum(['HOME', 'JEWELLERY', 'WATCHES', 'BRANDS', 'EVENTS']),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type BrandInput = z.infer<typeof BrandSchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type CategoryInput = z.infer<typeof CategorySchema>
export type EventInput = z.infer<typeof EventSchema>
export type BoutiqueInput = z.infer<typeof BoutiqueSchema>
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>
export type SliderInput = z.infer<typeof SliderSchema>
export type LoginInput = z.infer<typeof LoginSchema>
