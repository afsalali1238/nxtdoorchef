// src/lib/supabase/admin.ts
// Admin Supabase client — uses SERVICE ROLE KEY, bypasses RLS
// SERVER-SIDE ONLY — never import in Client Components
// IDENTICAL TO cr8 — copy directly

import { createClient } from '@supabase/supabase-js'

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)
