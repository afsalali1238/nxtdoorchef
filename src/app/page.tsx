// src/app/page.tsx
// Homepage — ADAPTED FROM cr8 homepage: same structure, NextDoorChef content
// Server Component — fetches from Supabase server-side

import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ChefGrid from '@/components/ChefGrid'
import PostCard from '@/components/PostCard'
import CuisineFilter from '@/components/CuisineFilter'
import SkeletonCard from '@/components/SkeletonCard'
import type { Metadata } from 'next'
import type { Chef, Post } from '@/types'

export const metadata: Metadata = {
  title: 'NextDoorChef — Homemade Food in Dubai',
  description: 'Find home chefs near you. Authentic homemade food from real kitchens across Dubai, UAE.',
}

export default async function HomePage() {
  const supabase = createClient()

  // Feed preview (latest 4 posts)
  const { data: posts } = await supabase
    .from('posts')
    .select('*, chefs(id, name, area, whatsapp, photo_url, specialty)')
    .order('created_at', { ascending: false })
    .limit(4)

  // Chefs spotlight (approved, 3 max)
  const { data: chefs } = await supabase
    .from('chefs')
    .select('*')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="min-h-[520px] pt-nav flex flex-col items-center justify-center text-center px-6 pb-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #160c04 0%, #2d1a0a 42%, #4a2c12 100%)',
        }}
      >
        {/* Glow accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #E8960A 0%, transparent 65%)', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #C4522A 0%, transparent 65%)', transform: 'translate(-30%,30%)' }} />
        </div>

        <p className="section-label relative z-10">Dubai's home chef community</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight max-w-2xl relative z-10 mt-2">
          Find the <em className="text-saffron not-italic">home chef</em><br />next door
        </h1>
        <p className="text-white/60 text-lg mt-5 mb-8 max-w-md font-light leading-relaxed relative z-10">
          Find a South Indian tiffin in Karama, a Filipino home cook in Deira, or a Ugandan feast in Bur Dubai.
        </p>

        {/* Browse Button */}
        <div className="relative z-10">
          <Link
            href="/feed"
            className="inline-flex items-center justify-center bg-saffron px-8 py-4 text-base font-medium text-dark rounded-full hover:bg-[#d4880a] hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Today's kitchen →
          </Link>
        </div>
      </section>

      {/* ── Cuisine strip ─────────────────────────────── */}
      <div className="bg-white border-b border-border px-8 py-4">
        <Suspense>
          <CuisineFilter />
        </Suspense>
      </div>

      {/* ── How it works ──────────────────────────────── */}
      <section className="px-8 py-16">
        <p className="section-label">Simple process</p>
        <h2 className="font-display text-3xl font-bold mb-10">Home cooking, made easy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: '01', title: 'Browse the map', body: 'Discover home chefs near you. Filter by cuisine, dietary need, or area of Dubai.' },
            { n: '02', title: 'Message the chef', body: 'Tap "Say hello" to connect directly. Learn about their culture and cooking.' },
            { n: '03', title: 'Connect locally', body: 'Meet your neighbours and discover the diverse cultures cooking next door.' },
          ].map(s => (
            <div key={s.n} className="bg-white rounded-card border border-border p-7">
              <p className="font-display text-5xl font-bold text-saffron leading-none">{s.n}</p>
              <h3 className="font-medium text-lg mt-4 mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feed Preview ───────────────────────────── */}
      <section className="px-8 pb-16">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="section-label">Happening now</p>
            <h2 className="font-display text-3xl font-bold">Today's kitchen</h2>
          </div>
          <Link href="/feed" className="text-sm text-saffron font-medium hover:underline">
            See the live feed →
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-4 gap-4"><SkeletonCard count={4} variant="dish" /></div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {((posts ?? []) as (Post & { chefs: Chef })[]).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* ── Chef Spotlight ────────────────────────────── */}
      <section className="bg-white border-t border-border px-8 py-16">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="section-label">Meet the community</p>
            <h2 className="font-display text-3xl font-bold">Cooks near you</h2>
          </div>
          <Link href="/chefs" className="text-sm text-saffron font-medium hover:underline">
            Our cooks →
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-3 gap-4"><SkeletonCard count={3} /></div>}>
          <ChefGrid chefs={(chefs ?? []) as unknown as Chef[]} />
        </Suspense>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="px-8 py-16">
        <div
          className="rounded-[18px] px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(140deg, #1e0f04 0%, #3d2010 50%, #5a3018 100%)' }}
        >
          <div className="absolute right-48 bottom-0 text-[90px] opacity-[0.06] pointer-events-none select-none">🍳</div>
          <div className="relative z-10">
            <p className="section-label">For home chefs</p>
            <h2 className="font-display text-3xl font-bold text-white mt-1 leading-snug">
              Cook something today.<br />Share it with your neighbours.
            </h2>
            <p className="text-white/55 mt-3 text-sm max-w-sm leading-relaxed">
              Join home cooks across Dubai celebrating their cuisine — no selling required. Just sharing.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative z-10">
            <Link href="/join" className="bg-saffron text-dark px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Share your culture
            </Link>
            <button className="border border-white/30 text-white px-6 py-3 rounded-lg text-sm hover:border-white transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
