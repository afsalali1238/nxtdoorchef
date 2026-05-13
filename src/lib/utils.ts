// src/lib/utils.ts
// Utility functions: WhatsApp URL builders, phone validation, class helpers
// ADAPTED FROM cr8: same WhatsApp pattern, UAE phone format

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Chef, Dish } from '@/types'

// ── Tailwind class helper (same as cr8) ──────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Buyer wants to connect from a dish
export function dishOrderUrl(chef: Chef, dish?: Dish): string {
  const msg = `Hello ${chef.name}! I found you on NextDoorChef and loved what you're cooking today. I'd love to connect!`
  return `https://wa.me/${chef.whatsapp}?text=${encodeURIComponent(msg)}`
}

// Buyer wants to connect from chef profile
export function chefMenuUrl(chef: Chef): string {
  const msg = `Hello ${chef.name}! I found you on NextDoorChef and loved what you're cooking today. I'd love to connect!`
  return `https://wa.me/${chef.whatsapp}?text=${encodeURIComponent(msg)}`
}

// Buyer wants to connect (custom order removed/adapted)
export function customOrderUrl(chef: Chef): string {
  const msg = `Hello ${chef.name}! I found you on NextDoorChef and loved what you're cooking today. I'd love to connect!`
  return `https://wa.me/${chef.whatsapp}?text=${encodeURIComponent(msg)}`
}

// ── UAE Phone Validation ─────────────────────────────────────
// Normalises any UAE phone format to 971XXXXXXXXX (12 digits, no +)
// Used in /join onboarding form before saving to Supabase
export function validateUAEPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')

  // Already correct: 971XXXXXXXXX (12 digits)
  if (digits.startsWith('971') && digits.length === 12) return digits

  // Local format with leading 0: 0501234567 (10 digits)
  if (digits.startsWith('0') && digits.length === 10) return `971${digits.slice(1)}`

  // Without country code or leading 0: 501234567 (9 digits)
  if (digits.length === 9) return `971${digits}`

  return null // invalid — show validation error
}

// ── Formatting ────────────────────────────────────────────────
// Format AED price: 45 → "AED 45" | 45.50 → "AED 45.50"
export function formatAED(price: number | null): string {
  if (price === null) return 'Price on request'
  return `AED ${Number.isInteger(price) ? price : price.toFixed(2)}`
}

// Truncate text to N chars with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

// Relative time: "2 hours ago", "3 days ago"
export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000,  'month'],
    [86400,    'day'],
    [3600,     'hour'],
    [60,       'minute'],
  ]
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
