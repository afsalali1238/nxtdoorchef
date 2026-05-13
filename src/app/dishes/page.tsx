// src/app/dishes/page.tsx
// Redirects to /feed — dishes browse is deprecated in the community pivot
import { redirect } from 'next/navigation'

export default function DishesPage() {
  redirect('/feed')
}
