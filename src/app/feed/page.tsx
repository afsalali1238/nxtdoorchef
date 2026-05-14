// src/app/feed/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import SplitLayout from '@/components/SplitLayout'
import CuisineFilter from '@/components/CuisineFilter'
import SkeletonCard from '@/components/SkeletonCard'
import type { Metadata } from 'next'
import type { Chef, Post } from '@/types'

export const metadata: Metadata = {
  title: 'Live Feed — NextDoorChef',
  description: 'See what home cooks in Dubai are making right now.',
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { cuisine?: string }
}) {
  const supabase = createClient()

  // Fetch all posts with chef details
  let query = supabase
    .from('posts')
    .select('*, chefs!inner(id, name, cuisine_type, area, whatsapp, photo_url, lat, lng)')
    .order('created_at', { ascending: false })

  if (searchParams.cuisine && searchParams.cuisine !== 'All') {
    query = query.eq('chefs.cuisine_type', searchParams.cuisine)
  }

  const { data: posts } = await query

  const postList = (posts ?? []) as (Post & { chefs: Chef })[]

  // All chefs for the map
  const { data: allChefs } = await supabase
    .from('chefs')
    .select('id, name, cuisine_type, area, lat, lng, whatsapp, photo_url')
    .eq('is_approved', true)
    .eq('is_active', true)

  const panelHeader = (
    <div className="p-4 space-y-3">
      <div>
        <h1 className="font-display text-2xl font-bold">Today's Kitchen</h1>
        <p className="text-sm text-muted">See what your neighbours are cooking.</p>
      </div>
      <Suspense><CuisineFilter selected={searchParams.cuisine ?? 'All'} /></Suspense>
    </div>
  )

  const activeChefIds = Array.from(new Set(postList.map(p => p.chef_id)))

  return (
    <SplitLayout
      chefs={(allChefs ?? []) as unknown as Chef[]}
      panelHeader={panelHeader}
      activeChefIds={activeChefIds}
    >
      <Suspense fallback={<SkeletonCard count={4} variant="dish" />}>
        {postList.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {postList.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">📸</p>
            <p className="font-medium mb-1">No posts yet</p>
            <p className="text-sm text-muted">Check back later to see what's cooking.</p>
          </div>
        )}
      </Suspense>
    </SplitLayout>
  )
}
