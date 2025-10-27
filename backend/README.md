# Supabase Backend Setup Guide

This guide will help you set up and connect the GoDex project to Supabase, both for local development and production deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Storage Setup](#storage-setup)
- [Troubleshooting](#troubleshooting)
- [Additional Documentation](#additional-documentation)

## Additional Documentation

This backend includes comprehensive documentation to help you set up and work with Supabase:

| Document | Description |
|----------|-------------|
| **[SETUP.md](./SETUP.md)** | Step-by-step quick setup guide for local and production |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture, database schema, and data flow |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues and their solutions |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Command cheat sheet and quick tips |

**Start here if you're new**: [SETUP.md](./SETUP.md)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Supabase CLI** - Install via npm:
  ```bash
  npm install -g supabase
  ```
- **Docker Desktop** - Required for running Supabase locally
  - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Ensure Docker is running before starting local development

## Quick Start

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd project-learning/backend
```

### 2. Start Local Supabase
```bash
supabase start
```

This command will:
- Start all Supabase services (PostgreSQL, Auth, Storage, etc.)
- Create local database with migrations
- Return connection details

### 3. Connect Your Frontend

Get your local Supabase credentials:
```bash
supabase status
```

Use these credentials in your frontend's `.env` file or config.

## Local Development Setup

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

### Step 2: Initialize Supabase Locally

```bash
cd backend
supabase start
```

**Note:** First run will take several minutes as it downloads Docker images.

### Step 3: View Local Services

After starting, you can access:
- **Supabase Studio**: http://localhost:54323
- **API URL**: http://localhost:54321
- **DB URL**: postgresql://postgres:postgres@localhost:54322/postgres

### Step 4: Environment Variables

For local development, the following environment variables are used:

#### Edge Functions Environment Variables

Create a `.env` file in the `backend/supabase` directory:

```env
# Supabase Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Get the service role key from:
supabase status

# Email Service (Resend)
RESEND_API_KEY=<your-resend-api-key>

# Application Configuration
APP_URL=http://localhost:3000
DOMAIN=localhost
```

**To get your local service role key:**
```bash
supabase status
```

### Step 5: Apply Migrations

Migrations are automatically applied when you start Supabase. If you need to manually apply:

```bash
supabase db reset
```

This will reset your local database and apply all migrations.

## Production Deployment

### Option 1: Deploy to Supabase Cloud (Recommended)

#### Step 1: Login to Supabase
```bash
supabase login
```

#### Step 2: Link to Your Project
```bash
supabase link --project-ref <your-project-ref>
```

Get your project ref from your Supabase dashboard.

#### Step 3: Push Migrations
```bash
supabase db push
```

#### Step 4: Deploy Edge Functions
```bash
supabase functions deploy create-user-data
supabase functions deploy send-email-invite
supabase functions deploy request-early-access
supabase functions deploy contact
```

Or deploy all at once:
```bash
supabase functions deploy
```

#### Step 5: Set Production Secrets

In Supabase Dashboard → Project Settings → Edge Functions:
- Go to "Secrets" section
- Add the following environment variables:

```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=<your-resend-api-key>
APP_URL=https://yourdomain.com
DOMAIN=yourdomain.com
```

### Option 2: Self-Host Supabase

For self-hosting, refer to the [Supabase Self-Hosted Documentation](https://supabase.com/docs/guides/self-hosting).

## Configuration

### Database Configuration

The database is configured in `backend/supabase/config.toml`. Key settings:

```toml
project_id = "godex"

[api]
port = 54321
max_rows = 1000

[db]
port = 54322
major_version = 17

[auth]
enabled = true
site_url = "http://127.0.0.1:3000"
jwt_expiry = 3600
```

### Edge Functions Configuration

Each edge function has its configuration in `config.toml`:

```toml
[functions.create-user-data]
enabled = true
verify_jwt = false

[functions.send-email-invite]
enabled = true
verify_jwt = true

[functions.request-early-access]
enabled = true
verify_jwt = true

[functions.contact]
enabled = true
verify_jwt = true
```

## Database Schema

### Main Tables

The database includes the following main tables:

1. **profiles** - User profile information
2. **organizations** - Organization/company data
3. **organization_members** - Organization membership
4. **deals** - Deal/transaction records
5. **deal_members** - Deal collaborators
6. **deal_permissions** - Granular permissions
7. **deal_logs** - Activity audit logs
8. **deal_comments** - Comments on deals
9. **deal_documents** - File uploads for deals
10. **invites** - Deal invitations
11. **shared_links** - Shareable deal links
12. **notifications** - User notifications
13. **early_access** - Early access requests
14. **contacts** - Contact form submissions

### Migration Files

All database migrations are in `backend/supabase/migrations/`:

```
20250719080343_init_profiles.sql
20250722184100_create_deals_tables_and_enums.sql
20250722184126_create_deals_policies.sql
20250722184147_create_deals_funtions_and_triggers.sql
20250726072622_create_document_storage_policies.sql
20250727180522_create_organisation_tables.sql
20250803055926_create_invites_table.sql
20250803063519_create_shared_links_table.sql
20250812191236_create_matrix_user_table.sql
20250822142850_create_early_access_table.sql
20250822144146_create_contact_table.sql
20250824164743_create_notifications_table.sql
20250919000001_update_deal_documents_structure.sql
20250919000002_create_deal_sections_tables.sql
```

To view the database schema in Supabase Studio:
```bash
# Open Supabase Studio
# Navigate to Table Editor
```

## Edge Functions

### Available Functions

#### 1. create-user-data
**Purpose**: Creates user profile and organization data on signup.

**Endpoint**: `/functions/v1/create-user-data`

**Request Body**:
```json
{
  "userId": "user-uuid",
  "profileData": {
    "firstName": "John",
    "lastName": "Doe",
    "location": "New York"
  },
  "organizationData": {
    "type": "create|join",
    "name": "Acme Corp",
    "code": "ORGANIZATION_CODE"
  }
}
```

#### 2. send-email-invite
**Purpose**: Sends email invitations to collaborators via Resend.

**Endpoint**: `/functions/v1/send-email-invite`

**Request Body**:
```json
{
  "invites": [
    {
      "email": "user@example.com",
      "dealId": "deal-uuid",
      "role": "EDITOR",
      "invitedBy": "user-uuid"
    }
  ]
}
```

**Required Environment Variables**:
- `RESEND_API_KEY` - Get from [Resend](https://resend.com)

#### 3. request-early-access
**Purpose**: Handles early access form submissions.

**Endpoint**: `/functions/v1/request-early-access`

**Request Body**:
```json
{
  "requestEarlyAccessData": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "accountType": "SELLER"
  }
}
```

#### 4. contact
**Purpose**: Handles contact form submissions.

**Endpoint**: `/functions/v1/contact`

**Request Body**:
```json
{
  "contactData": {
    "email": "user@example.com",
    "message": "Your message"
  }
}
```

### Testing Edge Functions Locally

```bash
# Test an edge function
supabase functions serve create-user-data

# With debugging
supabase functions serve create-user-data --debug
```

### Calling Edge Functions from Frontend

```typescript
const response = await supabase.functions.invoke('create-user-data', {
  body: {
    userId: 'user-uuid',
    profileData: { ... },
    organizationData: { ... }
  }
});
```

## Storage Setup

### Storage Buckets

The application uses Supabase Storage for file uploads. Configure buckets:

#### 1. Profiles Bucket
```bash
# Via Supabase Studio or SQL
CREATE BUCKET profiles PUBLIC;
```

#### 2. Documents Bucket
```bash
CREATE BUCKET deal-documents PUBLIC;
```

### Storage Policies

Storage policies are defined in migration `20250719081556_rls_policies_for_storage.sql`.

Key policies:
- Users can upload to their own profile
- Deal members can upload documents to their deals
- Public read access for certain files

## Troubleshooting

### Issue: Docker won't start
**Solution**: Ensure Docker Desktop is running and has sufficient resources (4GB RAM minimum).

### Issue: `supabase start` fails
**Solution**: 
```bash
# Stop any existing containers
supabase stop

# Clean up
supabase db reset

# Start fresh
supabase start
```

### Issue: Edge functions not working
**Solution**: Check environment variables are set:
```bash
supabase functions list --local
```

### Issue: Migrations not applying
**Solution**:
```bash
# Reset database
supabase db reset

# Or manually push
supabase db push
```

### Issue: Can't connect to local Supabase
**Solution**: 
```bash
# Check status
supabase status

# Verify ports are not in use
netstat -an | grep 54321
```

### Issue: Permission denied errors
**Solution**: Check Row Level Security (RLS) policies are correctly configured in the migrations.

## Useful Commands

```bash
# Start Supabase
supabase start

# Stop Supabase
supabase stop

# Check status
supabase status

# View logs
supabase logs

# Reset database
supabase db reset

# Create new migration
supabase migration new migration_name

# Deploy everything
supabase db push
supabase functions deploy

# Generate types from database
supabase gen types typescript --local > types/database.types.ts
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check project-specific issues in your issue tracker

---

**Last Updated**: January 2025
