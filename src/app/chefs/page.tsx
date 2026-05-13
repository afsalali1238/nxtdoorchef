// src/app/chefs/page.tsx
// ADAPTED FROM cr8 /artists page — split layout, cuisine + area filters, map

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ChefCard from '@/components/ChefCard'
import SplitLayout from '@/components/SplitLayout'
import CuisineFilter from '@/components/CuisineFilter'
import SkeletonCard from '@/components/SkeletonCard'
import type { Metadata } from 'next'
import type { Chef } from '@/types'

export const metadata: Metadata = {
  title: 'Find Home Chefs in Dubai',
  description: 'Browse home chefs near you in Dubai. Filter by cuisine and area. Contact directly on WhatsApp.',
}

export default async function ChefsPage({
  searchParams,
}: {
  searchParams: { cuisine?: string; q?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from('chefs')
    .select('*')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.cuisine && searchParams.cuisine !== 'All') {
    query = query.eq('cuisine_type', searchParams.cuisine)
  }
  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const { data: chefs } = await query
  const chefList = (chefs ?? []) as Chef[]

  // All approved chefs for map (unfiltered — so map always shows all pins)
  const { data: allChefs } = await supabase
    .from('chefs')
    .select('id, name, cuisine_type, area, lat, lng, whatsapp, specialty, photo_url')
    .eq('is_approved', true)
    .eq('is_active', true)

  // Get active chefs for today (those who posted today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayPosts } = await supabase
    .from('posts')
    .select('chef_id')
    .gte('created_at', today.toISOString())

  const activeChefIds = Array.from(new Set((todayPosts || []).map(p => p.chef_id)))

  const panelHeader = (
    <div className="p-4 space-y-3">
      <div>
        <h1 className="font-display text-xl font-bold">Our cooks</h1>
        <p className="text-xs text-muted mt-0.5">{chefList.length} cook{chefList.length !== 1 ? 's' : ''} found</p>
      </div>
      <Suspense><CuisineFilter selected={searchParams.cuisine ?? 'All'} /></Suspense>
      <form action="/chefs" method="GET" className="flex gap-2">
        {searchParams.cuisine && <input type="hidden" name="cuisine" value={searchParams.cuisine} />}
        <input 
          type="text" 
          name="q" 
          defaultValue={searchParams.q || ''} 
          placeholder="Search by name..." 
          className="w-full bg-cream border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-saffron"
        />
      </form>
    </div>
  )

  return (
    <SplitLayout
      chefs={(allChefs ?? []) as unknown as Chef[]}
      panelHeader={panelHeader}
      activeChefIds={activeChefIds}
    >
      <Suspense fallback={<SkeletonCard count={4} />}>
        {chefList.map(chef => (
          <ChefCard key={chef.id} chef={chef} />
        ))}
        {chefList.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">👩‍🍳</p>
            <p className="font-medium mb-1">No chefs found</p>
            <p className="text-sm text-muted">Try a different filter</p>
          </div>
        )}
      </Suspense>
    </SplitLayout>
  )
}
