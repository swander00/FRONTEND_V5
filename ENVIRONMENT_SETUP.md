# Environment Setup Guide

## Quick Start

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your API keys:**
   - Replace all `your_*_here` values with real keys
   - See sections below for where to get each key

## Required API Keys

### Supabase Configuration
- **NEXT_PUBLIC_SUPABASE_URL**: Get from Supabase Dashboard → Settings → API
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Get from Supabase Dashboard → Settings → API
- **SUPABASE_SERVICE_ROLE_KEY**: Get from Supabase Dashboard → Settings → API

### Google Services
- **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**: Get from Google Cloud Console → APIs & Services → Credentials
- **GOOGLE_CLIENT_ID**: Get from Google Cloud Console → APIs & Services → Credentials → OAuth 2.0
- **GOOGLE_CLIENT_SECRET**: Get from Google Cloud Console → APIs & Services → Credentials → OAuth 2.0
- **NEXT_PUBLIC_GOOGLE_CLIENT_ID**: Same as GOOGLE_CLIENT_ID

### Security Secrets
- **JWT_SECRET**: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- **NEXTAUTH_SECRET**: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Development vs Production

### Development
- Use `http://localhost:3000` for URLs
- Set `NODE_ENV=development`
- Enable `DEBUG=true`

### Production
- Use your production domain for URLs
- Set `NODE_ENV=production`
- Disable `DEBUG=false`

## Security Notes

- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ `.env.example` is safe to commit (no real secrets)
- ✅ Generate new secrets for production
- ✅ Never share real API keys in chat/email

## Troubleshooting

### Common Issues
1. **Missing API keys**: Check that all `your_*_here` values are replaced
2. **Invalid keys**: Verify keys are correct in respective dashboards
3. **CORS errors**: Check that domains are whitelisted in API settings

### Getting Help
- Check the respective service dashboards for key management
- Verify that APIs are enabled in Google Cloud Console
- Ensure Supabase project is active and accessible
