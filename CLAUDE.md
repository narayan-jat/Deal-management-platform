# project-learning - Deal Management Platform (repo: godex)

## What this is
A deal-pipeline web app for private lenders: Supabase auth and profiles, a Kanban board of deals
(New -> Negotiation -> In Progress -> Completed / Rejected) with structured deal sections, document
uploads, comments, activity logs, email invites/share links, notifications, and Matrix-based in-app
chat, all protected by Postgres row-level security. The README frames it as a portfolio piece
("Why reviewers should care"); the latest commit (2026-04-06) is "remove any company related data and
remove secret credentials", i.e. it was sanitised from an earlier engagement.

## Tech stack
- Frontend: React 18, TypeScript, Vite, Tailwind, Radix UI (shadcn-style), dnd-kit, react-router
- Backend: Supabase (Postgres migrations, RLS, Storage, Edge Functions), Matrix via `matrix-js-sdk`
- Deploy: Vercel (SPA rewrite in `vercel.json`); Node version pinned in `.nvmrc`

## Layout
- `src/` - components, pages, services (Supabase layer), hooks, context, types, config
- `backend/supabase/` - `migrations/`, `functions/`, `config.toml`
- `backend/*.md` - README, SETUP, ARCHITECTURE, QUICK_REFERENCE, TROUBLESHOOTING, INDEX

## Run
```bash
cp .env.example .env     # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_EMAIL_REDIRECT_TO
npm install
(cd backend && supabase db push)
npm run dev              # http://localhost:5173
```
A `.env` exists locally - never copy or commit it.

## Status / history
- Git remote: `git@github-personal:narayan-jat/godex.git`; 129 commits.
- Started 2025-04-24 by other contributors (Connor Kelly <connor.soedex@...>, Joe Carlson); most
  commits by narayan-jat from mid-2025, with PRs merged from collaborators.
- Docs added 2025-10/11; last commit 2026-04-06 (sanitisation). Dormant since.
