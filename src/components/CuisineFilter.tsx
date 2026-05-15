// src/components/CuisineFilter.tsx
// ADAPTED FROM cr8 CategoryFilter — same URL-param pattern, different options
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CUISINES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CuisineFilterProps {
  selected?: string
  paramKey?: string
}

export default function CuisineFilter({ selected = 'All', paramKey = 'cuisine' }: CuisineFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (name === 'All') params.delete(paramKey)
    else params.set(paramKey, name)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {CUISINES.map(c => {
        const isAll = c.name === 'All'
        const emoji = isAll ? '🌍' : c.emoji
        return (
          <button
            key={c.slug}
            onClick={() => handleSelect(c.name)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all flex-shrink-0 shadow-sm',
              (selected === c.name || (selected === 'All' && isAll))
                ? 'bg-saffron border-saffron text-white font-medium shadow-md'
                : 'bg-white border-[#E8DFD0] text-[#7A6550] hover:border-saffron/50 hover:text-[#1A1207]'
            )}
          >
            <span>{emoji}</span>
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
