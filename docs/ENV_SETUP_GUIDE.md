# Environment Variables Setup Guide

## Supabase Connection Setup

Your Supabase connection is now configured to use environment variables from `.env.local`.

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Project Settings** (gear icon in sidebar)
4. Click on **API** in the settings menu

You'll find:
- **Project URL** - This is your `NEXT_PUBLIC_SUPABASE_URL`
- **Project API keys**:
  - **anon/public key** - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role key** - This is your `SUPABASE_SERVICE_ROLE_KEY` (optional, for server-side only)

### Step 2: Update .env.local

Open the `.env.local` file in your project root and replace the placeholder values:

```env
# Replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
```

### Step 3: Restart Your Development Server

After updating `.env.local`, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Verify Authentication

Your Supabase client is now configured for authentication. You can verify it works by:

1. Try logging in/signing up through the UI
2. Check the browser console for any authentication errors

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit `.env.local`** - It's already in `.gitignore`, but double-check
2. **NEXT_PUBLIC_ prefix** means the variable is exposed to the browser
3. **Service Role Key** should only be used in server-side code (API routes, server components)
4. The anon key is safe to expose in the browser (it has Row Level Security policies)

## Troubleshooting

### Connection Errors

If you see "Missing NEXT_PUBLIC_SUPABASE_URL environment variable":
- Check that `.env.local` exists in your project root
- Verify the variable names are correct (case-sensitive)
- Restart your dev server

### Invalid API Key

If you see authentication errors:
- Double-check you copied the full anon key (they're very long)
- Make sure there are no extra spaces or line breaks
- Verify you're using the correct project's credentials

## Next Steps

Once your authentication is working:

1. ✅ Build your backend APIs
2. ✅ Integrate frontend with backend APIs
3. ✅ Eventually migrate auth to backend APIs as well

