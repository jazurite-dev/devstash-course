# Current Feature

Seed Sample Data

## Status

In Progress

## Goals

- Create `prisma/seed.ts` to populate the database with sample data for development and demos
- Demo user: demo@devstash.io / 12345678 (bcrypt, 12 rounds)
- All 7 system item types (snippet, prompt, command, note, file, image, link)
- 5 collections with realistic items: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources

## Notes

- Run with `npx prisma db seed`
- Seed is idempotent — safe to re-run (clears demo user data first)
- Uses `DIRECT_URL` for the database connection (direct, not pooled)

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js Setup — scaffolded Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + ESLint; build passing, pushed to main
- Dashboard UI Layout - Phase 1 — shadcn/ui init (Button, Input), `/dashboard` route with TopBar (logo, search, New Item), dark mode by default, placeholder Sidebar/Main; build and lint passing
- Dashboard UI Layout - Phase 2 — shadcn/ui sidebar block (collapsible, drawer on mobile), AppSidebar with item type links, favorite/recent collections, user footer; build and lint passing
- Dashboard UI Layout - Phase 3 — stats cards, collections grid, pinned items, recent items (shadcn card/badge, shared ItemRow/type-icons/format utils); completes the 3-phase dashboard UI layout; build and lint passing
- Prisma + Neon PostgreSQL Setup — Prisma 7 with @prisma/adapter-neon; full schema (User, Item, ItemType, Collection, ItemCollection, Tag, ItemTag + NextAuth models); initial migration applied to dev branch; build passing
