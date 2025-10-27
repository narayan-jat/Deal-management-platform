# Quick Reference Card

Essential commands and information for working with Supabase backend.

## Commands

### Local Development
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
```

### Migrations
```bash
# List migrations
supabase migration list

# Create new migration
supabase migration new description

# Apply migrations
supabase db push

# Rollback (careful!)
supabase db reset
```

### Edge Functions
```bash
# Deploy function
supabase functions deploy <function-name>

# Test locally
supabase functions serve <function-name>

# View logs
supabase functions logs <function-name>

# Deploy all
supabase functions deploy
```

### Production
```bash
# Login
supabase login

# Link project
supabase link --project-ref <project-ref>

# Push changes
supabase db push
supabase functions deploy

# View remote functions
supabase functions list --remote
```

## Local URLs

After running `supabase start`:

- **Studio**: http://localhost:54323
- **API**: http://localhost:54321
- **DB**: postgresql://postgres:postgres@localhost:54322/postgres
- **Email**: http://localhost:54324

## Edge Functions

| Function | Endpoint | Auth Required |
|----------|----------|---------------|
| create-user-data | `/functions/v1/create-user-data` | No |
| send-email-invite | `/functions/v1/send-email-invite` | Yes |
| request-early-access | `/functions/v1/request-early-access` | Yes |
| contact | `/functions/v1/contact` | Yes |

## Database Tables

**Core Tables:**
- `profiles` - User profiles
- `organizations` - Organizations
- `organization_members` - Org memberships

**Deal Tables:**
- `deals` - Main deals
- `deal_members` - Collaborators
- `deal_permissions` - Access control
- `deal_comments` - Comments
- `deal_logs` - Audit trail
- `deal_documents` - Files

**Other Tables:**
- `invites` - Email invitations
- `shared_links` - Shareable links
- `notifications` - User notifications
- `early_access` - Early access requests
- `contacts` - Contact form
- `matrix_users` - Chat users

## Storage Buckets

- `profiles` - User profile images
- `deal-documents` - Deal documents

## Environment Variables

### Local
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<from-supabase-status>
```

### Production
```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<from-dashboard>
```

### Edge Function Secrets (Dashboard)
```
SUPABASE_URL=<url>
SUPABASE_SERVICE_ROLE_KEY=<service-key>
RESEND_API_KEY=<resend-key>
APP_URL=<app-url>
DOMAIN=<domain>
```

## Useful SQL Queries

```sql
-- Check user profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check deal members
SELECT * FROM deal_members WHERE deal_id = '<deal-id>';

-- Check storage policies
SELECT * FROM pg_policies 
WHERE schemaname = 'storage';

-- Recent notifications
SELECT * FROM notifications 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC 
LIMIT 10;

-- Org members
SELECT om.*, p.first_name, p.last_name
FROM organization_members om
JOIN profiles p ON om.member_id = p.id
WHERE om.organization_id = '<org-id>';
```

## Common Workflows

### Add New Table
```bash
# 1. Create migration
supabase migration new add_new_table

# 2. Edit migration file
# Write SQL to create table

# 3. Apply locally
supabase db reset

# 4. Deploy to production
supabase db push
```

### Add Edge Function
```bash
# 1. Create function directory
mkdir supabase/functions/my-function

# 2. Add function code
# Edit index.ts

# 3. Update config.toml
# Add function configuration

# 4. Test locally
supabase functions serve my-function

# 5. Deploy
supabase functions deploy my-function
```

### Debug Issues
```bash
# 1. Check Supabase is running
supabase status

# 2. View logs
supabase logs

# 3. Check database
# Open Studio at http://localhost:54323

# 4. Test connection
supabase db execute "SELECT 1"
```

## Frontend Integration

```typescript
// Initialize client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('*')

// Call edge function
const { data, error } = await supabase.functions.invoke('contact', {
  body: { contactData: { ... } }
})

// Upload file
const { data, error } = await supabase.storage
  .from('profiles')
  .upload('path/file.jpg', file)
```

## URLs & Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Docs**: https://supabase.com/docs
- **Resend Dashboard**: https://resend.com/dashboard
- **Studio (local)**: http://localhost:54323
- **Email Test (local)**: http://localhost:54324

## Checklist for New Setup

- [ ] Docker Desktop installed and running
- [ ] Supabase CLI installed (`npm i -g supabase`)
- [ ] `supabase start` completed successfully
- [ ] Can access Studio at http://localhost:54323
- [ ] Frontend .env configured
- [ ] Test user signup works
- [ ] Test database query works
- [ ] Edge functions responding

## Quick Troubleshooting

**Supabase won't start?**
→ `supabase stop && supabase start`

**Migration failed?**
→ `supabase db reset`

**Function not working?**
→ Check logs: `supabase functions logs <name>`

**Permission denied?**
→ Check RLS policies in Studio

**Files not uploading?**
→ Check storage policies and bucket exists

---

**Pro Tip**: Keep Studio (http://localhost:54323) open during development for quick database inspection and SQL testing.

