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
  const activePost = sortedPosts.length > 0 && new Date(sortedPosts[0].expires_at).getTime() > Date.now() ? sortedPosts[0] : null
  const pastPosts = activePost ? sortedPosts.slice(1) : sortedPosts

  return (
    <div className="pt-nav min-h-screen">
      {/* Hero */}
      <div className="bg-dark text-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#C4522A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-8 pt-20 pb-14 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-amber-bg flex-shrink-0 overflow-hidden flex items-center justify-center text-6xl border-4 border-dark shadow-xl">
            {c.photo_url
              ? <Image src={c.photo_url} alt={c.name} width={128} height={128} className="object-cover w-full h-full" />
              : '👩‍🍳'}
          </div>
          <div className="flex-1 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 flex-wrap mb-1 justify-center sm:justify-start">
              <h1 className="font-display text-4xl font-bold">{c.name}</h1>
            </div>
            
            <div className="flex items-center gap-3 text-white/60 mb-4 text-sm justify-center sm:justify-start">
              <span className="font-medium text-saffron">{c.cuisine_type}</span>
              <span>·</span>
              <span>📍 {c.area}, Dubai</span>
              {c.from_city && c.from_country && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">From {c.from_city}, {c.from_country}</span>
                </>
              )}
            </div>
            
            {c.from_city && c.from_country && (
              <div className="sm:hidden text-white/60 text-sm mb-4">
                From {c.from_city}, {c.from_country}
              </div>
            )}
            
            <div className="mb-4 inline-flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activePost ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}></span>
              <span className="text-sm font-medium">{activePost ? 'Cooking right now' : 'Not cooking today'}</span>
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
        {activePost && (
          <section className="mb-12">
            <p className="section-label">Cooking right now</p>
            <h2 className="font-display text-2xl font-bold mb-6">What {c.name} is cooking right now</h2>
            <div className="max-w-md">
              <PostCard post={{ ...activePost, chefs: c }} />
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
