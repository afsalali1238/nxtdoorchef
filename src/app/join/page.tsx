// src/app/join/page.tsx
// ADAPTED FROM cr8 /join — same form structure, different fields
// New fields: specialty, has_permit, accepts_custom
// Removed: instagram
// Changed: category → cuisine_type, location → area (dropdown)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validateUAEPhone, cn } from '@/lib/utils'
import { CUISINES, DUBAI_AREAS, AREA_COORDS } from '@/lib/constants'

export default function JoinPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    bio: '',
    whatsapp: '',
    cuisine_type: '',
    specialty: '',
    area: '',
    from_city: '',
    from_country: '',
    cooking_philosophy: '',
  })

  const set = (key: string, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate phone
    const phone = validateUAEPhone(form.whatsapp)
    if (!phone) {
      setError('Please enter a valid UAE phone number (e.g. 0501234567)')
      return
    }

    // Get coordinates from area
    const coords = AREA_COORDS[form.area]
    if (!coords) {
      setError('Please select your area')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: insertError } = await supabase.from('chefs').insert({
      name: form.name,
      bio: form.bio || null,
      whatsapp: phone,
      cuisine_type: form.cuisine_type,
      specialty: form.specialty || null,
      area: form.area,
      lat: coords.lat,
      lng: coords.lng,
      from_city: form.from_city || null,
      from_country: form.from_country || null,
      cooking_philosophy: form.cooking_philosophy || null,
      is_approved: false, // always false — admin approves
    })

    setLoading(false)
    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      // Send admin notification
      await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          whatsapp: phone,
          cuisine: form.cuisine_type,
          area: form.area,
          from_city: form.from_city,
          from_country: form.from_country
        })
      }).catch(console.error)

      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="pt-nav min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-5">🎉</p>
          <h1 className="font-display text-3xl font-bold mb-3">Welcome to the community!</h1>
          <p className="text-muted leading-relaxed mb-6">
            We'll review your profile and add you within 24 hours. Once you're live, you can start sharing what you cook — your neighbours will discover you on the map and feed.
          </p>
          <button onClick={() => router.push('/')} className="btn-primary">Back to home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-nav min-h-screen bg-cream">
      {/* Dark Hero Header */}
      <div className="bg-dark text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1200&auto=format&fit=crop" alt="Cooking background" className="w-full h-full object-cover opacity-20 saturate-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 to-dark" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <p className="text-saffron font-bold text-xs uppercase tracking-widest mb-3">For home chefs</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Share your culture</h1>
          <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
            Join home cooks from across the world sharing their cuisine with Dubai. Tell us about yourself and we'll add you to the community.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 -mt-16 relative z-20">
        <div className="bg-white rounded-[24px] shadow-2xl p-6 md:p-10 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Full name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="input-field" placeholder="Your name" />
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Your cuisine *</label>
            <select required value={form.cuisine_type} onChange={e => set('cuisine_type', e.target.value)}
              className="input-field">
              <option value="">Select cuisine type</option>
              {CUISINES.filter(c => c.name !== 'All').map(c => (
                <option key={c.slug} value={c.name}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Your area in Dubai *</label>
            <select required value={form.area} onChange={e => set('area', e.target.value)}
              className="input-field">
              <option value="">Select your area</option>
              {DUBAI_AREAS.map(a => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">WhatsApp number *</label>
            <input required value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
              className="input-field" placeholder="e.g. 0501234567" type="tel" />
            <p className="text-xs text-muted mt-1">Neighbours who want to connect will reach you here. UAE numbers only.</p>
          </div>

          {/* Origin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark block mb-1.5">City/Town of origin</label>
              <input value={form.from_city} onChange={e => set('from_city', e.target.value)}
                className="input-field" placeholder="e.g. Thrissur" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-1.5">Country</label>
              <input value={form.from_country} onChange={e => set('from_country', e.target.value)}
                className="input-field" placeholder="e.g. Kerala, India" />
            </div>
          </div>

          {/* Specialty */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Your signature dish</label>
            <input value={form.specialty} onChange={e => set('specialty', e.target.value)}
              className="input-field" placeholder="The dish you're most proud of" />
          </div>

          {/* Philosophy */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Your cooking philosophy</label>
            <input value={form.cooking_philosophy} onChange={e => set('cooking_philosophy', e.target.value)}
              className="input-field" placeholder="e.g. I cook the food I grew up eating." />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Your story</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
              className="input-field resize-none" rows={3}
              placeholder="Tell us your story — where you're from, how you learned to cook..." />
          </div>


          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className={cn('btn-primary w-full justify-center', loading && 'opacity-60 cursor-not-allowed')}>
            {loading ? 'Submitting…' : 'Join the community →'}
          </button>
          </form>
        </div>
      </div>
    </div>
  )
}
