// src/app/dishes/[id]/page.tsx
// Redirects to /feed — dishes detail pages are deprecated in the community pivot
import { redirect } from 'next/navigation'

export default function DishDetailPage() {
  redirect('/feed')
}
