# MEMORY.md — NextDoorChef Project State

> Agent's persistent memory. Read at start of EVERY session.
> Append only — never delete. Mark superseded decisions as [SUPERSEDED].
> Update the Session Log at end of every session.

---

## Project Status

**Phase:** Phase 1 MVP
**Build Status:** 🔴 Not started — all agent files ready, awaiting first build session
**Domain:** nextdoorchef.com (acquired)
**Last Updated:** 2026-05-09
**Sprint Goal:** All 8 Phase 1 routes functional, deployed to Vercel

---

## Infrastructure Checklist

- [ ] Supabase project created
- [ ] PostGIS extension enabled (`CREATE EXTENSION IF NOT EXISTS postgis;`)
- [ ] Migration run: `supabase/migrations/001_initial_schema.sql`
- [ ] Seed data verified: cuisine_types (15 rows), dubai_areas (18 rows)
- [ ] Storage bucket created: `chef-photos` (public)
- [ ] Storage bucket created: `dish-images` (public)
- [ ] RLS policies verified (run test query — should return 0 rows for unapproved chefs)
- [ ] GitHub repo created
- [ ] Vercel project connected to GitHub
- [ ] `nextdoorchef.com` domain pointed to Vercel
- [ ] `.env.local` configured with Supabase keys
- [ ] Test chef seeded (3 approved, 1 pending)
- [ ] Test dishes seeded (2–3 per chef)
- [ ] All 8 routes verified: clean `npm run build` with zero errors

---

## Architectural Decisions Log

### ADR-001: No payments in Phase 1
**Decision:** WhatsApp only for buyer-chef contact. No Telr integration yet.
**Reason:** Validate demand before payment complexity. Telr requires UAE trade license.
**Status:** Active

### ADR-002: Leaflet + OpenStreetMap (not Google Maps)
**Decision:** Leaflet.js + OpenStreetMap tiles. Same as cr8.
**Reason:** Free, no API key, excellent UAE/Dubai coverage, proven in cr8.
**Status:** Active

### ADR-003: Supabase for all backend
**Decision:** PostgreSQL + PostGIS + Auth + Storage. No separate server.
**Reason:** Free tier sufficient, visual admin for Afsal, same as cr8.
**Status:** Active

### ADR-004: Phone OTP auth — Phase 2 only
**Decision:** Auth not needed in Phase 1. Buyers don't log in. Chefs managed by admin.
**Reason:** Fastest path to launch.
**Status:** Active (Phase 2: Supabase Auth + Twilio Verify for UAE phone OTP)

### ADR-005: WhatsApp only (no Instagram)
**Decision:** Chefs have WhatsApp contact only. No Instagram field.
**Reason:** Food ordering is transactional. WhatsApp is sufficient and UAE-native.
**Status:** Active

### ADR-006: Dubai area dropdown (no geocoding API)
**Decision:** Chefs select area from a predefined dropdown (18 Dubai areas). Lat/lng auto-assigned from `dubai_areas` table.
**Reason:** Free, no Google Places API needed, simpler onboarding form.
**Status:** Active

### ADR-007: available_today toggle on dishes
**Decision:** `dishes.available_today boolean`. Toggled daily.
**Reason:** Home menus change daily, unlike craft listings.
**Phase 1:** Admin toggles in Supabase table editor.
**Phase 2:** Chef self-service toggle in dashboard.
**Status:** Active

### ADR-008: has_permit displayed, not required
**Decision:** Show "Licensed" badge if `has_permit=true`. Unlicensed chefs still listed.
**Reason:** UAE home kitchen permits are new and most legitimate chefs don't have one yet.
**Status:** Active — add platform disclaimer on /join page

### ADR-009: Framer Motion animations
**Decision:** Same as cr8. Entrance animations, card hover effects.
**Status:** Active

### ADR-010: Skeleton loading everywhere
**Decision:** Every async grid shows shimmer skeletons. Same as cr8.
**Status:** Active

### ADR-011: SplitLayout as shared component
**Decision:** Extract the cards+map split layout into `SplitLayout.tsx`. Both /chefs and /dishes use it.
**Reason:** cr8 had this inline in each page — extracting avoids duplication.
**Status:** Active

---

## Business Context

- **Buyers:** Expats and locals in Dubai who want authentic homemade food
- **Chefs:** Home cooks currently distributing via word-of-mouth and WhatsApp groups
- **Problem:** No discovery layer — chefs have no platform, buyers can't find them
- **Differentiator:** Location-based map — see who's cooking near you today
- **Brand:** Warm, authentic, neighbourhood — spice markets and home kitchens

---

## UAE-Specific Notes (Agent Must Know)

- UAE phone numbers: store as `971XXXXXXXXX` — no `+`, no spaces, no leading `0`
- WhatsApp `wa.me` links: use `971XXXXXXXXX` format — `+` breaks some clients
- Dubai map centre: `[25.2048, 55.2708]`, zoom level `11`
- Currency: AED (Arab Emirates Dirham) — display as `AED 45` not `45 AED`
- Working week: Sunday–Thursday (Friday/Saturday is weekend) — relevant for admin availability
- Food permit: DET (Dubai Economy & Tourism) issues home kitchen permits — evolving regulation

---

## Phase 2 Backlog (Do Not Build Now)

- [ ] Chef login + self-service dashboard (edit profile, toggle dish availability)
- [ ] Telr payment gateway integration + commission splits
- [ ] Ratings & reviews per dish
- [ ] Featured chef listings (paid placement)
- [ ] Chef subscription tier (analytics, priority listing)
- [ ] PostHog analytics + WhatsApp click tracking
- [ ] Abu Dhabi + Sharjah area expansion
- [ ] Email/SMS notifications to admin on new chef applications

---

## Session Log

### Session 0 — Documentation Setup (2026-05-09)
- All agent files created: CLAUDE.md, MEMORY.md, 6 skill files, schema SQL, docs
- cr8-reference.md written with exact file-by-file copy/adapt/new instructions
- Scaffolding files created: package.json, configs, globals.css, types, utils, constants
- Status: Ready for first Antigravity build session

---

## Reference Links

- **cr8 repo (blueprint):** https://github.com/afsalali1238/cr8
- **cr8 CLAUDE.md:** https://github.com/afsalali1238/cr8/blob/main/CLAUDE.md
- **cr8 MEMORY.md:** https://github.com/afsalali1238/cr8/blob/main/MEMORY.md
- **Supabase project:** [add URL after creating]
- **Vercel project:** [add URL after deploying]
