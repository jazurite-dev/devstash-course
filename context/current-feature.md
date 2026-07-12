# Current Feature

Database Test Script

## Status

Completed

## Goals

- Create `scripts/test-db.ts` to verify the database connection and seeded data
- Print counts for all models (users, item types, collections, items, tags)
- Print item type list with colors and icons
- Print collection breakdown with item counts
- Print demo user details

## Notes

- Run with `npx tsx scripts/test-db.ts`
- Uses `DIRECT_URL` for the database connection (direct, not pooled)
- `dotenv` already installed — no additional packages needed

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js Setup — scaffolded Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + ESLint; build passing, pushed to main
- Dashboard UI Layout - Phase 1 — shadcn/ui init (Button, Input), `/dashboard` route with TopBar (logo, search, New Item), dark mode by default, placeholder Sidebar/Main; build and lint passing
- Dashboard UI Layout - Phase 2 — shadcn/ui sidebar block (collapsible, drawer on mobile), AppSidebar with item type links, favorite/recent collections, user footer; build and lint passing
- Dashboard UI Layout - Phase 3 — stats cards, collections grid, pinned items, recent items (shadcn card/badge, shared ItemRow/type-icons/format utils); completes the 3-phase dashboard UI layout; build and lint passing
- Prisma + Neon PostgreSQL Setup — Prisma 7 with @prisma/adapter-neon; full schema (User, Item, ItemType, Collection, ItemCollection, Tag, ItemTag + NextAuth models); initial migration applied to dev branch; build passing
- Seed Sample Data — idempotent seed script (demo@devstash.io, 7 system types, 5 collections, 18 items, 8 tags); uses DIRECT_URL; run with `npx prisma db seed`
- Database Test Script — `scripts/test-db.ts` verifies connection and prints model counts, item types, collections, and demo user details
