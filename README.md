# Deal Management Platform ([Visit Website](https://dealmanager.vercel.app/))

**Deal intelligence for private lenders** — one place to run the pipeline from first touch to close: structured deal data, documents, collaboration, and messaging, backed by Supabase with row-level security.

---

## Why reviewers should care

This app is a full-stack TypeScript product, not a toy UI: a Vite + React client talks to a real PostgreSQL schema (migrations in-repo), Supabase Auth and Storage, optional Matrix-powered chat, and RLS-shaped access for deals, files, and invites. The codebase is organized around services, hooks, and typed deal models so features stay traceable from UI to policy.

---

## What ships today

| Area | Capabilities |
|------|----------------|
| **Identity & profile** | Email/password auth, profile fields (name, title, photo, bio), org context, password reset / change flows |
| **Deal workspace** | Kanban (New → Negotiation → In Progress → Completed, plus Rejected), create/edit deals with rich sections (overview, financials, collateral, purpose, next steps) |
| **Movement & visibility** | Drag-and-drop between stages; cards scoped to creators and invited members |
| **Files** | Uploads via Supabase Storage, `deal_documents`, access aligned with deal membership |
| **Collaboration** | Comments, activity logging (`deal_logs`), email invites, shareable links, collaborator management |
| **Comms** | In-app messaging built on **Matrix** (`matrix-js-sdk`), wired to deal-side chat patterns |
| **Notifications** | In-app notification surface for deal-relevant events |
| **Backend** | SQL migrations, RLS policies, storage policies, edge functions (e.g. user bootstrap, email invites) — see [`backend/README.md`](./backend/README.md) |

---

## Tech stack

- **Frontend:** React 18, TypeScript, Vite  
- **UI:** Tailwind CSS, Radix UI, shadcn-style components  
- **Data & auth:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)  
- **Realtime chat:** Matrix (Synapse-compatible) via `matrix-js-sdk`  
- **Deployment:** Vercel (demo)

---

## Quick start

### Prerequisites

- **Node.js** v20+ — [nodejs.org](https://nodejs.org/)
- **npm**
- **Git**

### Security note (credentials)

- **`.env` and `backend/.env` are gitignored** — they should never be committed. This repository does not include real API keys or service-role secrets in tracked files; the app reads `VITE_SUPABASE_*` from the environment at build/runtime.
- Copy [`.env.example`](./.env.example) to `.env` and fill in your own values. Keep **Supabase service role keys and Resend keys** only in Supabase Dashboard (Edge Function secrets) or local CLI config — not in the frontend repo.

### 1. Clone and install

```bash
git clone <your-fork-or-remote-url>
cd project-learning
npm install
```

### 2. Environment

Copy the example file and edit:

```bash
cp .env.example .env
```

Then set variables in `.env` in the **repository root**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAIL_REDIRECT_TO=http://localhost:5173/dashboard
```

Replace values with your Supabase project (or local Supabase — see backend docs).

### 3. Database & backend

From the repo root:

```bash
cd backend
supabase db push
```

For a full local stack (Docker), CLI commands, and production notes, start with **[`backend/README.md`](./backend/README.md)** → [`backend/SETUP.md`](./backend/SETUP.md). Architecture and schema: [`backend/ARCHITECTURE.md`](./backend/ARCHITECTURE.md).

### 4. Run the app

```bash
cd ..   # back to repo root if you were in backend/
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

---

## Project layout

```
project-learning/          # clone name may differ
├── backend/               # Supabase: migrations, functions, config
│   ├── supabase/
│   └── README.md          # primary backend entrypoint
├── public/
├── src/
│   ├── components/        # UI (layout, deal builder, forms, auth, …)
│   ├── config/            # routes and app config
│   ├── context/           # React context providers
│   ├── hooks/             # data and UI hooks
│   ├── lib/               # e.g. Supabase client helpers
│   ├── pages/             # route-level screens
│   ├── services/          # API / Supabase service layer
│   ├── styles/
│   ├── types/             # TypeScript models (deals, profile, Matrix, …)
│   ├── utility/
│   ├── App.tsx
│   └── main.tsx
├── .env                   # you create this (not committed)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Development milestones (complete)

### Milestone 1 — Static site, auth, profile

- Landing, sign up / sign in, Supabase Auth (email/password)
- Editable profiles (name, title, photo, bio), org tags for MVP
- User/profile tables and RLS for user-level data
- Vercel deploy with post-login redirect to the app

### Milestone 2 — Kanban and deal core

- Kanban columns: New, Negotiation, In Progress, Completed, and Rejected
- Create/edit deals with structured fields, uploads, and notes where applicable
- Drag-and-drop between stages
- Card summary vs full deal view
- Deals visible only to creators and invited members
- Schema: `deals`, `deal_members`, `deal_permissions`, related enums and policies

### Milestone 3 — Files, collaboration, messaging

- Document upload to Supabase Storage and `deal_documents`
- Paths organized by organization/deal semantics; access via authenticated client and policies
- `deal_logs` for auditable actions (status, uploads, comments, etc.)
- Matrix-based messaging and deal-attached chat flows
- Invites and shared links; accepting access grants deal permissions as designed

### Milestone 4 — Security, RLS, docs, production readiness

- RLS across deals, documents, permissions, and related entities
- Logging and access rules aligned with product behavior
- Inter-user visibility via minimal shared profile patterns where needed
- Setup guides, SQL migrations, and backend documentation for operators and contributors
- Modular frontend/backend layout suitable for ongoing production work

---
