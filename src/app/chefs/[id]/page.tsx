// src/app/chefs/[id]/page.tsx
// ADAPTED FROM cr8 /artists/[id] — chef profile + dish menu

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import type { Metadata } from 'next'
import type { Chef, Post } from '@/types'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: chef } = await supabase
    .from('chefs')
    .select('name, cuisine_type, area, specialty')
    .eq('id', params.id)
    .single()

  if (!chef) return { title: 'Chef not found' }

  return {
    title: `${chef.name} — ${chef.cuisine_type} Home Chef in ${chef.area}`,
    description: chef.specialty ?? `${chef.name} is a home chef in ${chef.area}, Dubai`,
  }
}

export default async function ChefProfilePage({ params }: Props) {
  const supabase = createClient()

  const { data: chef } = await supabase
    .from('chefs')
    .select('*, posts(*)')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!chef) notFound()

  const c = chef as Chef & { posts: Post[] }
  const sortedPosts = [...(c.posts || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const todaysPost = sortedPosts.length > 0 && new Date(sortedPosts[0].created_at).toDateString() === new Date().toDateString() ? sortedPosts[0] : null
  const pastPosts = todaysPost ? sortedPosts.slice(1) : sortedPosts

  return (
    <div className="pt-nav min-h-screen">
      {/* Hero */}
      <div className="bg-dark text-white px-8 py-14">
        <div className="max-w-4xl mx-auto flex items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-amber-bg flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl">
            {c.photo_url
              ? <Image src={c.photo_url} alt={c.name} width={96} height={96} className="object-cover w-full h-full" />
              : '👩‍🍳'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display text-3xl font-bold">{c.name}</h1>
            </div>
            
            <div className="flex items-center gap-3 text-white/60 mb-3 text-sm">
              <span>{c.cuisine_type}</span>
              <span>·</span>
              <span>📍 {c.area}, Dubai</span>
              {c.from_city && c.from_country && (
                <>
                  <span>·</span>
                  <span>From {c.from_city}, {c.from_country}</span>
                </>
              )}
            </div>
            
            <div className="mb-4 inline-flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${todaysPost ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}></span>
              <span className="text-sm font-medium">{todaysPost ? 'Cooking today' : 'Not cooking today'}</span>
            </div>

            {c.cooking_philosophy && (
              <blockquote className="text-white border-l-2 border-saffron pl-4 italic text-lg mb-4">
                "{c.cooking_philosophy}"
              </blockquote>
            )}
            
            {c.specialty && <p className="text-white/80 text-sm mt-1">{c.specialty}</p>}
            {c.bio && <p className="text-white/55 text-sm mt-3 max-w-lg leading-relaxed">{c.bio}</p>}
            
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <WhatsAppButton chef={c} size="md" label="Say hello" />
              <Link href={`/map?chef=${c.id}`} className="px-5 py-2.5 rounded text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors">
                📍 Pin on map
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {todaysPost && (
          <section className="mb-12">
            <p className="section-label">Cooking today</p>
            <h2 className="font-display text-2xl font-bold mb-6">What {c.name} is cooking today</h2>
            <div className="max-w-md">
              <PostCard post={{ ...todaysPost, chefs: c }} />
            </div>
          </section>
        )}

        {pastPosts.length > 0 && (
          <section>
            <p className="section-label">Past cooking</p>
            <h2 className="font-display text-2xl font-bold mb-6">Recently shared</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
              {pastPosts.map(post => (
                <PostCard key={post.id} post={{ ...post, chefs: c }} />
              ))}
            </div>
          </section>
        )}

        {sortedPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">📸</p>
            <p className="font-display text-xl font-semibold mb-2">No posts yet</p>
            <p className="text-muted text-sm mb-6">Say hello to {c.name} to see what they're cooking</p>
            <WhatsAppButton chef={c} size="lg" label="Say hello" />
          </div>
        )}

        <div className="mt-10">
          <Link href="/chefs" className="text-sm text-muted hover:text-dark transition-colors">← Back to chefs</Link>
        </div>
      </div>
    </div>
  )
}
