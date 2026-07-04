# Current Feature

Initial Next.js Setup

## Status

In Progress

## Goals

<!-- Goals & requirements -->

- Scaffold the DevStash app with Next.js 16 (App Router) + React 19 + TypeScript
- Configure Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.ts`)
- Set up ESLint (flat config via `eslint.config.mjs`)
- Establish base project structure (`app/`, `context/`) and npm scripts (`dev`, `build`, `start`, `lint`)
- Get a clean `npm run build` passing before committing

## Notes

<!-- Any extra notes -->

- Dependencies: `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4`, `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `typescript@^5`
- No `tailwind.config.ts`/`.js` per project coding standards — theme config lives in CSS via `@theme`
- Not yet initialized: Prisma/Neon DB, NextAuth, Cloudflare R2, shadcn/ui, Stripe — these are separate future features

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
