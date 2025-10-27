# Troubleshooting Guide

Common issues and their solutions when working with the Supabase backend.

## Table of Contents
- [Local Development Issues](#local-development-issues)
- [Production Deployment Issues](#production-deployment-issues)
- [Database Issues](#database-issues)
- [Edge Function Issues](#edge-function-issues)
- [Authentication Issues](#authentication-issues)
- [Storage Issues](#storage-issues)

## Local Development Issues

### Docker Not Running

**Symptom**: `Error: Cannot connect to the Docker daemon`

**Solution**:
1. Open Docker Desktop application
2. Wait for Docker to fully start (whale icon in system tray)
3. Run `supabase start` again

---

### Port Already in Use

**Symptom**: `Error: port 54321 is already in use`

**Solution**:
```bash
# Find and kill the process using the port
lsof -i :54321
kill -9 <PID>

# Or stop existing Supabase
supabase stop

# Then restart
supabase start
```

---

### Supabase Services Won't Start

**Symptom**: `Error starting services` or containers keep restarting

**Solution**:
```bash
# Clean up everything
supabase stop
docker system prune -a

# Pull fresh images
supabase start

# If still fails, reset completely
rm -rf ~/.supabase
supabase start
```

---

### Cannot Access Supabase Studio

**Symptom**: http://localhost:54323 doesn't load

**Solutions**:
1. Check if Supabase is running: `supabase status`
2. Check firewall isn't blocking ports
3. Try clearing browser cache
4. Use incognito mode to avoid extension conflicts

---

## Production Deployment Issues

### Cannot Link to Project

**Symptom**: `Error: unauthorized`

**Solution**:
```bash
# Re-login to Supabase
supabase logout
supabase login

# Try linking again
supabase link --project-ref <your-project-ref>
```

---

### Migrations Fail on Deploy

**Symptom**: `Error: relation already exists` or migration errors

**Solution**:
```bash
# Check migration status
supabase db push --dry-run

# Review which migrations haven't been applied
supabase migration list

# Apply specific migration
supabase db push --version <version>
```

---

### Edge Functions Not Deploying

**Symptom**: Functions don't appear in dashboard or return 404

**Solution**:
```bash
# Deploy with verbose output
supabase functions deploy <function-name> --debug

# Check function exists
supabase functions list --remote

# Verify environment variables are set in dashboard
```

---

### Environment Variables Not Working

**Symptom**: Functions can't access secrets or environment variables

**Solution**:
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Verify all variables are set correctly
3. Secrets are case-sensitive
4. Restart/redploy function after changing secrets:
   ```bash
   supabase functions deploy <function-name>
   ```

---

## Database Issues

### RLS Policies Blocking Operations

**Symptom**: `new row violates row-level security policy`

**Solutions**:

1. **Check policy exists**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

2. **Verify user is authenticated**:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);
```

3. **Test with service role** (in edge function):
```typescript
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
```

---

### Foreign Key Violation

**Symptom**: `insert or update on table "X" violates foreign key constraint`

**Solution**:
1. Check referenced record exists:
```sql
SELECT * FROM profiles WHERE id = '<uuid>';
```

2. Ensure correct UUID format
3. Check cascade delete is configured in migration

---

### Migration Conflicts

**Symptom**: Conflicting migration files or version mismatches

**Solution**:
```bash
# Check migration history
supabase migration list

# Reset migration history (WARNING: Deletes data)
supabase db reset

# Create new migration
supabase migration new fix_description
```

---

### Performance Issues

**Symptom**: Slow queries or timeouts

**Solutions**:
1. Add indexes to frequently queried columns
2. Use `explain analyze` to check query plans
3. Consider pagination for large result sets
4. Check for N+1 query problems

---

## Edge Function Issues

### Function Returns 500 Error

**Symptom**: Edge function crashes or returns error

**Debugging**:
```bash
# Check logs
supabase functions logs <function-name>

# Test locally with debug
supabase functions serve <function-name> --debug

# Check for TypeScript errors
deno check <path-to-function>
```

---

### CORS Errors

**Symptom**: `Access to fetch blocked by CORS policy`

**Solution**: Ensure CORS headers in function:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle preflight
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}

// Return response with headers
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

---

### Function Can't Access Database

**Symptom**: `permission denied for table X`

**Solution**:
Ensure function uses service role client:
```typescript
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
```

---

### Resend API Not Working

**Symptom**: Email sending fails

**Solutions**:
1. Verify API key in Supabase secrets
2. Check Resend dashboard for errors
3. Verify domain is verified in Resend
4. Check rate limits in Resend dashboard

---

## Authentication Issues

### User Can't Sign Up

**Symptom**: Signup fails with no clear error

**Debugging**:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

console.log('Error:', error);
```

**Common causes**:
1. Email confirmation required (check `enable_confirmations` in config)
2. Password too short (check `minimum_password_length`)
3. Email already exists

---

### JWT Token Expired

**Symptom**: `JWT expired`

**Solution**:
```typescript
// Refresh token
const { data, error } = await supabase.auth.refreshSession();

// Or automatically refresh
const { data: { session } } = await supabase.auth.getSession();
```

---

### Can't Access User Profile

**Symptom**: Profile query returns empty or null

**Debugging**:
1. Check trigger created profile:
```sql
SELECT * FROM profiles WHERE id = auth.uid();
```

2. Verify RLS policy allows access
3. Check user is authenticated:
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## Storage Issues

### Can't Upload Files

**Symptom**: Upload fails with permission error

**Solutions**:

1. **Check bucket exists**:
```sql
SELECT * FROM storage.buckets;
```

2. **Verify storage policy**:
```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
```

3. **Test with explicit bucket path**:
```typescript
const { error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file);
```

---

### Files Not Loading in Frontend

**Symptom**: 404 or permission denied for storage URLs

**Solutions**:
1. Generate public URL:
```typescript
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file');
```

2. Check bucket is public:
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'bucket-name';
```

3. Verify RLS policies allow reading

---

### Large File Upload Fails

**Symptom**: Timeout or connection error on large files

**Solutions**:
1. Use chunked upload for large files
2. Increase timeout in config
3. Check file size limit (default: 50MB in config.toml)

---

## Network Issues

### Cannot Connect to Supabase Locally

**Solution**:
```bash
# Check if running
supabase status

# Check port accessibility
curl http://localhost:54321/health

# Check firewall
sudo ufw status
```

---

### Slow API Responses

**Symptom**: API calls take too long

**Solutions**:
1. Check network latency
2. Review query performance in Studio
3. Enable connection pooling
4. Consider caching strategies

---

## Debugging Tools

### Supabase CLI Commands
```bash
# View all containers
docker ps

# View logs
supabase logs
supabase logs -f  # follow mode

# Check status
supabase status

# Test connection
supabase db execute "SELECT version();"
```

### Database Queries
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check recent logs
SELECT * FROM deal_logs ORDER BY created_at DESC LIMIT 10;
```

### Frontend Debugging
```typescript
// Log Supabase client configuration
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Anon Key:', supabase.supabaseAnonKey.substring(0, 20) + '...');

// Test connection
const { data, error } = await supabase.from('profiles').select('count');
console.log('Connection test:', { data, error });
```

---

## Getting Help

1. **Check logs first**: `supabase logs`
2. **Search Supabase docs**: [supabase.com/docs](https://supabase.com/docs)
3. **Check GitHub issues**: Search for similar issues
4. **Ask on Discord**: [discord.supabase.com](https://discord.supabase.com)

---

## Quick Fixes Checklist

- [ ] Docker Desktop is running
- [ ] `supabase status` shows all services running
- [ ] Environment variables are set correctly
- [ ] RLS policies are created and active
- [ ] Migrations have been applied
- [ ] Edge functions have correct secrets
- [ ] Network connectivity is available
- [ ] No conflicting services on same ports

---

**Last Updated**: January 2025

