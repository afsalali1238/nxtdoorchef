// src/lib/supabase/client.ts
// Browser-side Supabase client — use in Client Components ("use client")
// IDENTICAL TO cr8 — copy directly

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}
