'use client'

// ─────────────────────────────────────────────────────────
// FILE:  src/app/survey/page.tsx
// URL:   nxtdoorchef.vercel.app/survey
//
// Uses the actual Tailwind tokens from tailwind.config.ts:
//   dark, saffron, terra, muted, border, cream, cream-dark,
//   wa-green, verified, verified-bg, amber-bg, spice
//   font-display (--font-display), font-body (--font-body)
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ── DATA ────────────────────────────────────────────────

const CUISINES = [
  { flag: '🇦🇪', label: 'Emirati',            value: 'Emirati' },
  { flag: '🇮🇳', label: 'South Indian',        value: 'South Indian' },
  { flag: '🇮🇳', label: 'North Indian',        value: 'North Indian' },
  { flag: '🇵🇭', label: 'Filipino',            value: 'Filipino' },
  { flag: '🇵🇰', label: 'Pakistani',           value: 'Pakistani' },
  { flag: '🇸🇾', label: 'Syrian',              value: 'Syrian' },
  { flag: '🇱🇧', label: 'Lebanese',            value: 'Lebanese' },
  { flag: '🇪🇬', label: 'Egyptian',            value: 'Egyptian' },
  { flag: '🇪🇹', label: 'Ethiopian',           value: 'Ethiopian' },
  { flag: '🌍', label: 'West African',         value: 'West African' },
  { flag: '🥢', label: 'Cantonese / Chinese',  value: 'Cantonese' },
  { flag: '🧁', label: 'Western / Bakes',      value: 'Western / Bakes' },
  { flag: '🌐', label: 'Other',                value: 'other' },
]

const AREAS = [
  'Karama', 'Deira', 'Bur Dubai', 'Jumeirah', 'Al Barsha',
  'JLT', 'Dubai Marina', 'Mirdif', 'Al Quoz', 'International City',
  'Discovery Gardens', 'Sports City', 'Business Bay', 'Downtown Dubai',
  'Al Nahda', 'Muhaisnah', 'Rashidiya', 'Abu Dhabi', 'Sharjah', 'Ajman',
]

const DIETARY = [
  '☪️ Halal', '🥦 Vegetarian', '🌱 Vegan',
  '🌾 Gluten-free', '🥛 Dairy-free', '🥜 Nut-free',
]

// ── TYPES ───────────────────────────────────────────────

type Status = 'idle' | 'submitting' | 'success' | 'error'

// ── PAGE ────────────────────────────────────────────────

export default function SurveyPage() {
  const [status, setStatus]       = useState<Status>('idle')
  const [cuisine, setCuisine]     = useState('')
  const [cuisineOther, setOther]  = useState('')
  const [custom, setCustom]       = useState('')
  const [pickup, setPickup]       = useState('')
  const [permit, setPermit]       = useState('')
  const [dietary, setDietary]     = useState<string[]>([])
  const [errors, setErrors]       = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    name: '', area: '', whatsapp: '', dishes: '', quote: '', notes: '',
  })

  const supabase = createClient()

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const toggleDiet = (d: string) =>
    setDietary(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d])

  // ── VALIDATE ──
  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!form.name.trim())     e.name = true
    if (!form.area)            e.area = true
    if (!form.whatsapp.trim()) e.whatsapp = true
    if (!cuisine)              e.cuisine = true
    if (!form.dishes.trim())   e.dishes = true
    if (!form.quote.trim())    e.quote = true
    const wa = form.whatsapp.replace(/[\s\-\+]/g, '')
    if (wa && !/^971/.test(wa)) e.whatsapp = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── SUBMIT ──
  const handleSubmit = async () => {
    if (!validate()) {
      // scroll to first error
      document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setStatus('submitting')

    const resolvedCuisine = cuisine === 'other' ? cuisineOther.trim() : cuisine
    const wa = form.whatsapp.replace(/[\s\-\+]/g, '')

    const { error } = await supabase.from('chefs').insert({
      name:           form.name.trim(),
      area:           form.area,
      emirate:        ['Abu Dhabi','Sharjah','Ajman'].includes(form.area)
                        ? form.area : 'Dubai',
      location_name:  `${form.area}, Dubai`,
      whatsapp:       wa,
      cuisine_type:   resolvedCuisine,
      bio:            form.quote.trim(),
      is_permitted:   permit === 'yes',
      is_approved:    false,
      is_active:      true,
      // store extra fields as metadata in notes column if it exists
      // otherwise they're logged below for manual reference
    })

    // Log survey extras — add a survey_responses table later if needed
    if (!error) {
      console.log('Survey extras for', form.name, {
        dishes: form.dishes,
        custom_orders: custom,
        pickup,
        dietary: dietary.join(', '),
        notes: form.notes,
      })
    }

    setStatus(error ? 'error' : 'success')
  }

  // ── SUCCESS ──────────────────────────────────────────
  if (status === 'success') {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <span className="text-6xl block mb-6" aria-hidden>🎉</span>
          <h1 className="font-display text-3xl font-bold italic text-dark mb-4 leading-tight">
            You're in the queue!
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            We've received your application. We'll review it and reach out on
            WhatsApp within 48 hours once your profile is live on NextDoorChef.
            <br/><br/>
            Thank you for sharing your culture with Dubai. 🍳
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-saffron hover:bg-terra
              text-white font-semibold text-sm px-6 py-3 rounded-chip transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    )
  }

  // ── FORM ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-cream-dark">

      {/* ── HERO ── */}
      <div className="bg-dark relative overflow-hidden px-6 py-14 text-center">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse at 20% 60%, rgba(212,120,10,.15) 0%,transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(184,57,10,.10) 0%,transparent 50%)'}}
        />
        <p className="font-body font-bold text-white/40 text-sm mb-5 relative tracking-wide">
          NxtDoor<span className="text-saffron">Chef</span>
        </p>
        <span className="text-5xl block mb-5 relative" aria-hidden>🍳</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold italic text-white leading-tight mb-4 relative">
          Share your{' '}
          <em className="text-saffron not-italic">culture</em>
          <br/>with Dubai
        </h1>
        <p className="font-body text-white/60 text-base leading-relaxed max-w-md mx-auto mb-7 relative">
          Join home cooks sharing their cuisine with neighbours.
          Free to join — no selling, no commission, no pressure.
        </p>
        <div className="flex gap-2 justify-center flex-wrap relative">
          {['✓ Free forever', '✓ No selling required', '✓ Dubai, UAE'].map(b => (
            <span key={b}
              className="text-xs font-semibold text-white/70 bg-white/10
                border border-white/15 px-3 py-1.5 rounded-chip">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-3">

          {/* ══ SECTION 1: ABOUT YOU ══ */}
          <SectionHeader icon="👤" label="About you" />

          <QCard error={errors.name} label="Your name" required
            hint="First name, or whatever you'd like on your profile">
            <input
              className={qInput(errors.name)}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Lakshmi, Tariq, Maria…"
              autoComplete="given-name"
            />
          </QCard>

          <QCard error={errors.area} label="Your area in Dubai" required
            hint="The neighbourhood where you cook from">
            <select
              className={qInput(errors.area)}
              value={form.area}
              onChange={e => set('area', e.target.value)}
            >
              <option value="">Select your area…</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </QCard>

          <QCard error={errors.whatsapp} label="WhatsApp number" required
            hint="UAE format — how people will contact you. e.g. 971501234567">
            <input
              className={qInput(errors.whatsapp)}
              type="tel"
              value={form.whatsapp}
              onChange={e => set('whatsapp', e.target.value)}
              placeholder="971501234567"
              autoComplete="tel"
            />
          </QCard>

          {/* ══ SECTION 2: YOUR FOOD ══ */}
          <SectionHeader icon="🍽️" label="Your food" />

          <QCard error={errors.cuisine} label="What cuisine do you cook?" required
            hint="Pick the closest match">
            <div className="flex flex-col gap-2 mt-1">
              {CUISINES.map(c => (
                <RadioOpt key={c.value}
                  active={cuisine === c.value}
                  label={`${c.flag} ${c.label}`}
                  onClick={() => setCuisine(c.value)}
                />
              ))}
            </div>
            {cuisine === 'other' && (
              <input
                className={`${qInput(false)} mt-3`}
                value={cuisineOther}
                onChange={e => setOther(e.target.value)}
                placeholder="Tell us your cuisine…"
              />
            )}
          </QCard>

          <QCard error={errors.dishes} label="Your 2–3 signature dishes" required
            hint="The dishes you're most proud of and make most often">
            <textarea
              className={qInput(errors.dishes)}
              rows={3}
              value={form.dishes}
              onChange={e => set('dishes', e.target.value)}
              placeholder="e.g. Butter Chicken, Dal Makhani, stuffed Parathas"
            />
          </QCard>

          <QCard error={errors.quote} label="What makes your cooking special?" required
            hint="This becomes your profile quote — write in your own voice. Share a memory, technique, or who taught you. The more personal, the better.">
            <div className="relative">
              <textarea
                className={qInput(errors.quote)}
                rows={4}
                maxLength={220}
                value={form.quote}
                onChange={e => set('quote', e.target.value)}
                placeholder={`"The secret is finishing with Kasuri Methi. This is how my father made it in our dhaba in Amritsar."`}
              />
              <span className="absolute bottom-3 right-3 text-xs text-muted pointer-events-none">
                {form.quote.length} / 220
              </span>
            </div>
          </QCard>

          {/* ══ SECTION 3: LOGISTICS ══ */}
          <SectionHeader icon="📋" label="A few more things" />

          <QCard label="Custom orders?"
            hint="Birthday cakes, dietary requests, bulk orders for events">
            <div className="flex flex-col gap-2 mt-1">
              {[
                { v:'yes',       l:'✅ Yes — I love custom requests' },
                { v:'sometimes', l:'🤔 Sometimes — depends on the request' },
                { v:'no',        l:'❌ No — fixed menu only' },
              ].map(o => (
                <RadioOpt key={o.v} active={custom === o.v}
                  label={o.l} onClick={() => setCustom(o.v)} />
              ))}
            </div>
          </QCard>

          <QCard label="Pickup or drop-off?"
            hint="We're a community platform, not a delivery service — but good to set expectations">
            <div className="flex flex-col gap-2 mt-1">
              {[
                { v:'collect', l:'🚶 Collect only — buyer comes to you' },
                { v:'short',   l:'📍 Short-distance drop-off (same building / block)' },
                { v:'both',    l:'🤝 Both — you can discuss with the buyer' },
              ].map(o => (
                <RadioOpt key={o.v} active={pickup === o.v}
                  label={o.l} onClick={() => setPickup(o.v)} />
              ))}
            </div>
          </QCard>

          <QCard label="UAE home food permit?"
            hint="Display-only badge on your profile. Not required to join.">
            <div className="flex flex-col gap-2 mt-1">
              {[
                { v:'yes',      l:'🏛 Yes — I hold a permit' },
                { v:'applying', l:'📋 Currently applying' },
                { v:'no',       l:'Not yet' },
              ].map(o => (
                <RadioOpt key={o.v} active={permit === o.v}
                  label={o.l} onClick={() => setPermit(o.v)} />
              ))}
            </div>
          </QCard>

          <QCard label="Dietary accommodations"
            hint="Select all that apply">
            <div className="flex flex-col gap-2 mt-1">
              {DIETARY.map(d => (
                <CheckOpt key={d} active={dietary.includes(d)}
                  label={d} onClick={() => toggleDiet(d)} />
              ))}
            </div>
          </QCard>

          <QCard label="Anything else?" hint="Your story, how you got into cooking, anything you'd like us to know">
            <textarea
              className={qInput(false)}
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="e.g. I've been cooking for my building for 5 years…"
            />
          </QCard>

          {/* ══ SUBMIT ══ */}
          <div className="pt-2">
            {status === 'error' && (
              <p className="text-red-600 text-sm text-center mb-3">
                Something went wrong — please try again.
              </p>
            )}
            <p className="text-xs text-muted text-center mb-4 leading-relaxed">
              We'll review your application and reach out on WhatsApp
              within 48 hours once your profile is live.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === 'submitting'}
              className="w-full bg-saffron hover:bg-terra disabled:opacity-60
                text-white font-bold text-base py-4 rounded-card
                transition-colors shadow-card"
            >
              {status === 'submitting' ? 'Submitting…' : 'Join the community →'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}

// ── SMALL COMPONENTS ────────────────────────────────────

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mt-4 mb-1">
      <div className="w-8 h-8 bg-dark rounded-card flex items-center justify-center
        text-sm flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-xs font-bold text-muted uppercase tracking-widest">
        {label}
      </h2>
    </div>
  )
}

function QCard({
  label, required, error, hint, children,
}: {
  label: string
  required?: boolean
  error?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-card p-5 border transition-colors
      ${error ? 'border-red-300' : 'border-border'}`}>
      <label className="block font-body font-semibold text-sm text-dark mb-1">
        {label}
        {required && <span className="text-saffron ml-1">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-muted mb-3 leading-relaxed">{hint}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-2">This field is required</p>
      )}
    </div>
  )
}

function RadioOpt({
  active, label, onClick,
}: {
  active: boolean; label: string; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-card border
        text-left transition-all text-sm font-body
        ${active
          ? 'border-saffron bg-amber-bg'
          : 'border-border bg-cream hover:border-saffron/50'
        }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center
        justify-center flex-shrink-0 transition-all
        ${active ? 'border-saffron bg-saffron' : 'border-border'}`}
      >
        {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-dark">{label}</span>
    </button>
  )
}

function CheckOpt({
  active, label, onClick,
}: {
  active: boolean; label: string; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-card border
        text-left transition-all text-sm font-body
        ${active
          ? 'border-saffron bg-amber-bg'
          : 'border-border bg-cream hover:border-saffron/50'
        }`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center
        flex-shrink-0 text-xs transition-all
        ${active ? 'border-saffron bg-saffron text-white' : 'border-border'}`}
      >
        {active && '✓'}
      </div>
      <span className="text-dark">{label}</span>
    </button>
  )
}

// Reusable input class
const qInput = (err: boolean) =>
  `w-full border rounded-card px-3 py-2.5 text-sm font-body text-dark
   bg-cream outline-none transition-colors resize-none
   ${err
     ? 'border-red-300 focus:border-red-400'
     : 'border-border focus:border-saffron'
   }`
