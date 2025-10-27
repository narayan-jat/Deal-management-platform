# Backend Architecture

## Overview

The GoDex backend is built on Supabase, providing authentication, database, storage, and edge functions in a single platform.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth UI    │  │   Dashboard  │  │   Deals      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                             │
                  ┌──────────▼──────────┐
                  │   Supabase Client   │
                  │  (@supabase/js)     │
                  └──────────┬──────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐       ┌─────▼──────┐
    │  Auth   │        │ Database│       │  Storage   │
    │  Service│        │ (PostgreSQL)    │ (S3-like)  │
    └─────────┘        └──────────┘       └────────────┘
                              │                   │
                              │                   │
                    ┌─────────▼─────────┐        │
                    │  Edge Functions   │        │
                    │  (Deno Runtime)   │        │
                    └─────────┬─────────┘        │
                              │                  │
              ┌───────────────┼───────────────┐  │
              │               │               │  │
        ┌─────▼─────┐  ┌──────▼──────┐  ┌────▼────┐
        │ User Data │  │ Email Invite│  │ Contact │
        └───────────┘  └─────────────┘  └─────────┘
                              │
                              │
                       ┌──────▼──────┐
                       │   Resend    │
                       │  Email API  │
                       └─────────────┘
```

## Database Schema

### Core Tables

#### User Management
- **profiles** - User profile information
- **organizations** - Companies/organizations
- **organization_members** - User-organization relationships
- **matrix_users** - Matrix chat integration

#### Deal Management
- **deals** - Main deal records
- **deal_members** - Deal collaborators
- **deal_permissions** - Granular access control
- **deal_comments** - Comments on deals
- **deal_logs** - Audit trail
- **deal_documents** - File uploads
- **deal_sections** - Deal sections/categories

#### Collaboration
- **invites** - Email invitations
- **shared_links** - Shareable deal links
- **notifications** - User notifications

#### Contact & Access
- **early_access** - Early access requests
- **contacts** - Contact form submissions

### Key Relationships

```
users (auth)
  └─> profiles (1:1)
       └─> organization_members (1:N)
            └─> organizations (N:1)

deals
  ├─> deal_members (1:N)
  │    └─> profiles (N:1)
  ├─> deal_permissions (1:N)
  │    └─> profiles (N:1)
  ├─> deal_documents (1:N)
  ├─> deal_comments (1:N)
  └─> deal_logs (1:N)
```

## Edge Functions

### 1. create-user-data
**File**: `functions/create-user-data/index.ts`

**Purpose**: Creates user profile and organization association on signup.

**Flow**:
1. Receives userId, profileData, organizationData
2. Updates profiles table with user info
3. Creates or joins organization
4. Links user to organization with appropriate role

**Used by**: Signup flow

### 2. send-email-invite
**File**: `functions/send-email-invite/index.ts`

**Purpose**: Sends email invitations to collaborators.

**Flow**:
1. Generates unique token per invite
2. Sends email via Resend
3. Creates invite record in database
4. Returns success/failure status

**Dependencies**: Resend API

**Used by**: Deal collaboration

### 3. request-early-access
**File**: `functions/request-early-access/index.ts`

**Purpose**: Handles early access form submissions.

**Flow**:
1. Receives form data
2. Converts to snake_case
3. Inserts into early_access table

**Used by**: Landing page

### 4. contact
**File**: `functions/contact/index.ts`

**Purpose**: Handles contact form submissions.

**Flow**:
1. Receives contact data
2. Inserts into contacts table

**Used by**: Contact form

## Authentication Flow

```
User Signup
  ├─> Auth.users table (Supabase Auth)
  │    └─> Trigger: handle_new_user()
  │         └─> Creates initial profile
  │
  └─> Frontend calls create-user-data
       └─> Updates profile with additional info
       └─> Creates/joins organization
```

## Data Flow

### Reading Data
```
Frontend → Supabase Client → PostgreSQL (with RLS)
```

Row Level Security (RLS) policies ensure users only see authorized data.

### Writing Data
```
Frontend → Supabase Client → PostgreSQL (with RLS)
              or
Frontend → Edge Function → Service Role Client → PostgreSQL
```

Edge functions use service role to bypass RLS for trusted operations.

## Security Model

### Row Level Security (RLS)
All tables have RLS enabled. Policies define:
- Who can view data
- Who can insert data
- Who can update data
- Who can delete data

### Example Policy (profiles)
```sql
-- Users can view any profile
CREATE POLICY "Authenticated users can view any profile"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### JWT Tokens
- User sessions: Standard JWT with user claims
- Edge functions: Service role key for elevated permissions

## Storage Architecture

### Buckets
1. **profiles** - User profile images
2. **deal-documents** - Deal-related documents

### Storage Policies
```sql
-- Users can upload to their own profile
CREATE POLICY "Users can upload to own profile"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Deal members can upload documents
CREATE POLICY "Deal members can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'deal-documents' AND
  EXISTS (
    SELECT 1 FROM deal_members
    WHERE deal_members.deal_id = uuid_parse((storage.foldername(name))[1])
    AND deal_members.member_id = auth.uid()
  )
);
```

## Deployment Architecture

### Local Development
```
supabase start
├─> Docker containers
│   ├─> PostgreSQL
│   ├─> GoTrue (Auth)
│   ├─> PostgREST (API)
│   ├─> Realtime
│   ├─> Storage
│   └─> Edge Functions Runtime
└─> Local URLs (localhost:54321, etc.)
```

### Production
```
Supabase Cloud
├─> Managed PostgreSQL
├─> Managed Auth service
├─> Edge Functions (Deno Deploy)
├─> CDN for Storage
└─> Automatic backups
```

## Migration Strategy

### Version Control
All schema changes are tracked in `migrations/` directory.

### Naming Convention
`YYYYMMDDHHMMSS_descriptive_name.sql`

### Applying Migrations
```bash
# Local
supabase db reset

# Production
supabase db push
```

## Monitoring & Logging

### Database Logs
Access via Supabase Studio or:
```bash
supabase logs
```

### Edge Function Logs
```bash
supabase functions logs <function-name>
```

### Query Performance
View slow queries in Supabase Studio → Query Performance.

## Scalability Considerations

1. **Database Indexes**: Automatically created on foreign keys
2. **Connection Pooling**: Enabled via Supabase
3. **CDN**: Storage files served via CDN
4. **Edge Functions**: Serverless, auto-scaling
5. **RLS**: Enables safe multi-tenancy

## Backup Strategy

### Automatic Backups (Production)
- Daily backups retained for 7 days
- Point-in-time recovery available

### Manual Backups
```bash
# Export database
supabase db dump

# Restore
supabase db reset
psql < backup.sql
```

## Integration Points

### External Services
- **Resend**: Email delivery
- **Matrix**: Chat functionality (future)

### Frontend Integration
- `@supabase/supabase-js` client library
- Real-time subscriptions via WebSocket
- File upload/download via Storage API

---

**Note**: This architecture document is a living document and should be updated as the system evolves.

