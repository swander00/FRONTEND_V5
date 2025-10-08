# Environment Variables Configuration

This file documents the environment variables needed for real data integration.

## Setup Instructions

1. Create a `.env.local` file in the project root (it's already in `.gitignore`)
2. Add the variables listed below
3. Restart your Next.js development server

## Required Variables (for Real Data Integration)

```env
# Supabase Configuration
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase anon/public key (safe for browser use)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Optional Variables

```env
# Service role key (server-side admin operations only)
# WARNING: Never expose this to the client!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application URL (for OAuth, webhooks, etc.)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Important Notes

### Variable Naming

- **`NEXT_PUBLIC_*`** variables are exposed to the browser
- Variables without `NEXT_PUBLIC_` prefix are server-only
- Never use `NEXT_PUBLIC_` for sensitive keys like service role keys

### Security

- ✅ Safe to expose: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ Never expose: `SUPABASE_SERVICE_ROLE_KEY`
- The anon key respects Row Level Security (RLS) policies in Supabase
- Service role key bypasses all RLS - use only in secure API routes

### Getting Your Keys

1. Go to https://supabase.com
2. Open your project
3. Navigate to Project Settings → API
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (optional) → `SUPABASE_SERVICE_ROLE_KEY`

## Current Status

**Currently using mock data** - these variables are not required yet.

When you're ready to integrate real data:
1. Follow the steps in `docs/REAL_DATA_INTEGRATION_GUIDE.md`
2. Set up these environment variables
3. Rename `lib/supabaseClient.template.ts` to `lib/supabaseClient.ts`
4. Update the data service functions in `lib/propertyDataService.ts`

## Troubleshooting

### "Missing environment variable" error
- Ensure `.env.local` exists in project root
- Check variable names match exactly (case-sensitive)
- Restart Next.js dev server after adding variables

### Variables not loading
- Next.js only loads `.env.local` on startup
- Kill and restart your dev server (`Ctrl+C`, then `npm run dev`)
- Verify the file is named `.env.local` (not `.env.local.txt`)

### Can't find Supabase keys
- Make sure you've created a Supabase project
- Check you're in the correct project
- The keys are in: Project Settings → API section

