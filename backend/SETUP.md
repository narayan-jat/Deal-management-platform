# Quick Setup Guide

This is a condensed step-by-step guide to get your Supabase backend up and running quickly.

## For Local Development

### Step 1: Install Dependencies
```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
```

### Step 2: Start Docker Desktop
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Launch Docker Desktop
- Wait for it to be fully running (green icon in system tray)

### Step 3: Start Supabase
```bash
cd backend
supabase start
```

Wait for output showing:
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
```

### Step 4: Get Your Credentials
```bash
supabase status
```

Copy the credentials to your frontend `.env` file:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-status>
```

### Step 5: Access Supabase Studio
Open http://localhost:54323 in your browser to view the database and run SQL queries.

## For Production Deployment

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for project to be provisioned (2-3 minutes)

### Step 2: Get Your Project Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - Service Role Key (keep secret!)
   - Anon Key

### Step 3: Link Local to Remote
```bash
cd backend
supabase login
supabase link --project-ref <your-project-ref>
```

Get your project ref from: https://<your-project-ref>.supabase.co

### Step 4: Deploy Database
```bash
supabase db push
```

This applies all migrations to production.

### Step 5: Deploy Edge Functions
```bash
supabase functions deploy create-user-data
supabase functions deploy send-email-invite
supabase functions deploy request-early-access
supabase functions deploy contact
```

### Step 6: Set Environment Variables
In Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Navigate to "Secrets" section
3. Add these variables:

```
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=<your-resend-api-key>
APP_URL=https://yourdomain.com
DOMAIN=yourdomain.com
```

### Step 7: Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add the key to Supabase edge function secrets (see Step 6)

### Step 8: Verify Deployment
```bash
supabase functions list
```

## Configuration Checklist

### Local Development
- [ ] Docker Desktop installed and running
- [ ] Supabase CLI installed
- [ ] `supabase start` completed successfully
- [ ] Credentials added to frontend `.env`
- [ ] Can access Supabase Studio at http://localhost:54323

### Production
- [ ] Supabase project created
- [ ] Migrations deployed (`supabase db push`)
- [ ] Edge functions deployed
- [ ] Environment variables set in Supabase dashboard
- [ ] Resend API key configured
- [ ] Frontend connected to production Supabase

## Next Steps

After setup, you can:
1. Access Supabase Studio to view database tables
2. Use the API from your frontend
3. Upload and retrieve files from Storage
4. Send emails via edge functions
5. Monitor usage in Supabase dashboard

## Common Issues

### "Port already in use"
```bash
# Stop existing Supabase
supabase stop

# Or change ports in config.toml
```

### "Docker not running"
```bash
# Start Docker Desktop first
# Then run: supabase start
```

### "Migration failed"
```bash
# Reset database
supabase db reset
```

### "Cannot connect to localhost:54321"
```bash
# Check Supabase is running
supabase status

# If not, start it
supabase start
```

## Testing Your Setup

### Test Database Connection
```bash
# In Supabase Studio (http://localhost:54323)
# Go to SQL Editor and run:
SELECT * FROM profiles;
```

### Test Edge Functions
```bash
# Test locally
curl -X POST http://localhost:54321/functions/v1/contact \
  -H "Content-Type: application/json" \
  -d '{"contactData":{"email":"test@example.com","message":"Test"}}'
```

### Test Storage
```bash
# In Supabase Studio → Storage
# Try uploading a test file
```

## Need Help?

Refer to the main [README.md](./README.md) for detailed documentation or check:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

---

**Setup Time**: ~10-15 minutes for local development

