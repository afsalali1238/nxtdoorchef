// src/app/page.tsx
// Homepage — ADAPTED FROM cr8 homepage: same structure, NextDoorChef content
// Server Component — fetches from Supabase server-side

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ChefGrid from '@/components/ChefGrid'
import PostCard from '@/components/PostCard'
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
    .select('*, chefs(id, name, area, whatsapp, photo_url, specialty, bio, emirate)')
    .order('created_at', { ascending: false })
    .limit(4)

  const latestPost = posts?.[0] as (Post & { chefs: Chef }) | undefined

  // Stats
  const { count: chefCount } = await supabase
    .from('chefs')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true)
    .eq('is_active', true)

  const { data: cuisines } = await supabase
    .from('chefs')
    .select('cuisine_type')
    .eq('is_approved', true)

  const cuisineCount = new Set(cuisines?.map(c => c.cuisine_type)).size

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
      <section className="relative min-h-[500px] md:min-h-[600px] flex flex-col justify-end overflow-hidden bg-dark">
        {/* 4-col image mosaic */}
        <div className="absolute top-0 left-0 right-0 h-[300px] md:h-[400px] grid grid-cols-4 gap-1 opacity-70 saturate-125">
          {[
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400&auto=format&fit=crop'
          ].map((src, i) => (
            <div key={i} className="relative h-full w-full">
              <Image src={src} alt="Home cooked food" fill className="object-cover" priority />
            </div>
          ))}
        </div>
        
        {/* Warm dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/80 to-dark" />
        
        {/* Background pattern glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full opacity-[0.15]" style={{ background: 'radial-gradient(circle, #D4780A 0%, transparent 60%)' }} />
        </div>

        <div className="relative z-10 px-8 pb-12 pt-48 max-w-5xl mx-auto w-full">
          <div className="flex gap-2 mb-4 text-2xl">
            <span className="text-saffron font-bold text-xs uppercase tracking-widest bg-dark/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Hyper-local · Dubai</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight max-w-2xl">
            The <em className="text-saffron italic">best meal in town</em><br />is next door.
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 mb-8 max-w-lg font-light leading-relaxed">
            Real kitchens, real stories. From Karama to Dubai Marina, connect with home cooks making exactly what they feed their own families.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/feed"
              className="inline-flex items-center justify-center bg-saffron px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-medium text-white rounded-lg hover:bg-[#b86505] hover:-translate-y-0.5 transition-all shadow-lg"
            >
              🍳 Today's kitchen
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center justify-center bg-white/10 border border-white/20 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-medium text-white rounded-lg hover:bg-white/20 transition-all"
            >
              📍 View map
            </Link>
          </div>
          <p className="text-sm text-white/60 mt-3">
            🍛 {chefCount} kitchens cooking · {cuisineCount} cuisines tonight
          </p>
        </div>

        {latestPost && latestPost.chefs && (
          <div className="absolute bottom-6 right-6 hidden md:block bg-white rounded-2xl shadow-xl p-4 max-w-xs z-20">
            <div className="flex items-center gap-3 mb-2">
              <Image src={latestPost.chefs.photo_url || '/images/chef-placeholder.jpg'} width={36} height={36} className="rounded-full object-cover" alt={latestPost.chefs.name} />
              <div>
                <p className="font-semibold text-sm text-ink-900">{latestPost.chefs.name}</p>
                <p className="text-xs text-ink-400">{latestPost.chefs.area} · {latestPost.chefs.from_city || 'Dubai'}</p>
              </div>
            </div>
            {latestPost.chefs.bio && (
              <p className="text-xs italic text-ink-600 line-clamp-2">"{latestPost.chefs.bio}"</p>
            )}
          </div>
        )}
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section className="px-8 py-20 bg-cream">
        <div className="max-w-5xl mx-auto">
          <p className="section-label">Simple process</p>
          <h2 className="font-display text-4xl font-bold mb-12">Home cooking, made easy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Browse the map', body: 'Discover home chefs near you. Filter by cuisine or area of Dubai.' },
              { n: '02', title: 'Say hello', body: 'Tap "Say hello" to connect on WhatsApp. Hear their story, see today\'s menu, agree on pickup.' },
              { n: '03', title: 'Eat like a neighbour', body: 'Walk over, bring a tiffin, taste the cultures cooking right next door.' },
            ].map(s => (
              <div key={s.n} className="bg-gradient-to-br from-spice to-dark rounded-2xl p-8 relative overflow-hidden text-white shadow-xl">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-saffron/15 rounded-full blur-xl pointer-events-none"></div>
                <p className="font-display text-6xl font-black text-saffron/20 leading-none mb-6">{s.n}</p>
                <h3 className="font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
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
      <section className="bg-white border-t border-border px-8 py-12">
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
      <section className="px-8 py-10 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-[24px] px-8 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(140deg, #1A0A00 0%, #4A1E00 100%)' }}
          >
            <div className="absolute right-[-10%] bottom-[-20%] text-[150px] opacity-10 pointer-events-none select-none blur-sm transform rotate-12">🍳</div>
            <div className="relative z-10 md:max-w-md">
              <p className="text-saffron font-bold text-xs uppercase tracking-widest mb-3">For home chefs</p>
              <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
                Cook for your neighbours.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Turn the food you already love making into a small business. We handle discovery, you focus on the seasoning.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0 relative z-10 w-full md:w-auto flex-col sm:flex-row">
              <Link href="/join" className="bg-saffron text-white px-8 py-4 rounded-lg text-sm font-bold hover:bg-[#b86505] transition-colors text-center shadow-lg">
                Become a home chef
              </Link>
              <Link href="/chefs" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors text-center">
                Meet the cooks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
