# GoDex

**🌐 Live Demo:** [https://godex.vercel.app](https://godex.vercel.app)

A modern deal management platform for private lenders, GoDex allows those in the private lending space to quickly organize their files, communications and deal flows.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **npm**
- **Git** for version control

### Local Development Setup

1. **Clone the repository**

2. **Install dependencies**

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_EMAIL_REDIRECT_TO=http://localhost:5173/dashboard
   ```

   > **Note:** You'll need to set up your own Supabase project and replace the placeholder values. See the [Supabase Setup](#supabase-setup) section below.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173) to view the application.

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note down your project URL and anon key

2. **Database Schema**
   
   Download the Supabase CLI and install it.
   ```cd godex/backend```
   Run the command ```supabase db push```

3. **Authentication Setup**
   - In your Supabase dashboard, go to Authentication > Settings
   - Configure your site URL and redirect URLs
   - Set up email templates if needed

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🏗️ Project Structure

```
godex-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── main.tsx or index.tsx
├── .env
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI, ShadeCN
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## 📋 Development Milestones

### ✅ Milestone 1: Static Site, Authentication, and Profile Setup
**Status: COMPLETED** ✅

- ✅ Deploy static landing page with signup/login (using Supabase Auth)
- ✅ Enable email/password authentication
- ✅ Implement user profile creation with editable fields (name, title, profile photo, bio)
- ✅ Organizational tags (cosmetic only in MVP)
- ✅ Setup Supabase tables for users and profiles
- ✅ Ensure Supabase RLS is in place for user-level access
- ✅ Deploy to Vercel with working login → dashboard redirect

### 🔄 Milestone 2: Kanban Dashboard and Deal Card Core
**Status: IN PROGRESS** 🔄

- ⏳ Build Kanban dashboard with 4 visible columns (New, Negotiation, In Progress, Completed) + 1 hidden (Rejected)
- ⏳ Implement "Add New Deal" modal with required fields (title, status, dates, file uploads and notes)
- ⏳ Enable drag-and-drop functionality for cards between stages
- ⏳ Card preview shows basic info; full view reveals full deal data
- ⏳ Cards scoped to user's access (only deals created or shared with them)
- ⏳ Deal schema established in Supabase (deals, deal_members, deal_permissions)

### ⏳ Milestone 3: File Handling, Collaboration, and Messaging
**Status: PENDING** ⏳

- ⏳ Implement file upload with Supabase Storage (deal_documents table)
- ⏳ Organized by organization_id/deal_id
- ⏳ Signed URL access only
- ⏳ Create deal_logs table and log every action: status changes, uploads, comments
- ⏳ Build lightweight Instant Messenger system (Matrix or similar open source)
- ⏳ Enable messaging by name/org/email
- ⏳ Deal sharing via link (email, network, in app messenger)
- ⏳ Accepting a link adds user to deal at appropriate permission level determined by card owner

### ⏳ Milestone 4: Security, RLS Policies, and Deployment
**Status: PENDING** ⏳

- ⏳ Full Supabase RLS enforcement across deals, documents, permissions
- ⏳ Implement logging policies and access restrictions
- ⏳ Finalize minimal public profiles with inter-user visibility
- ⏳ Write setup instructions, Supabase SQL schema migration, and walkthrough doc
- ⏳ Confirm all frontend and backend code is modular, documented, and production-grade
  