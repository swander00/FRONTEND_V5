# Supabase Authentication - Phased Implementation Prompts

**Project:** FRONTEND_V5 Real Estate Platform  
**Purpose:** Step-by-step AI assistant prompts for implementing the database migration

---

## 📋 Overview

This document contains **6 separate prompts** that you can give to an AI coding assistant (like me!) to implement the Supabase authentication system in phases. Each prompt is self-contained and builds on the previous phase.

### Why Phased Approach?

- ✅ **Manageable chunks** - Each phase is 2-4 hours of work
- ✅ **Test as you go** - Verify each phase before moving forward
- ✅ **Easy rollback** - If something breaks, you know which phase caused it
- ✅ **Clear progress** - Track implementation status
- ✅ **Less overwhelming** - One thing at a time

---

## 🗓️ Implementation Phases

| Phase | Focus | Time | Prompt |
|-------|-------|------|--------|
| **Phase 0** | Database Migration | 1 hour | [Prompt 0](#phase-0-prompt-database-migration) |
| **Phase 1** | Verify Database | 30 min | [Prompt 1](#phase-1-prompt-verify-database-schema) |
| **Phase 2** | Authentication Setup | 3-4 hours | [Prompt 2](#phase-2-prompt-implement-real-authentication) |
| **Phase 3** | User Data - Liked Properties | 2-3 hours | [Prompt 3](#phase-3-prompt-implement-liked-properties) |
| **Phase 4** | User Data - Saved Listings | 2-3 hours | [Prompt 4](#phase-4-prompt-implement-saved-listings) |
| **Phase 5** | User Data - Saved Searches | 2-3 hours | [Prompt 5](#phase-5-prompt-implement-saved-searches) |
| **Phase 6** | Testing & Optimization | 2-3 hours | [Prompt 6](#phase-6-prompt-end-to-end-testing) |

**Total Time:** 12-18 hours spread across multiple sessions

---

## 📝 Before You Start

### Prerequisites Checklist
- [ ] You have the `supabase-migration.sql` file in your project root
- [ ] You have access to Supabase Dashboard
- [ ] You have the audit reports for reference
- [ ] You have `.env.local` configured with Supabase credentials
- [ ] You've backed up your current code (git commit)

### Required Files (Already in Project)
- `supabase-migration.sql` - Database migration script
- `SUPABASE_AUTH_AUDIT_REPORT.md` - Detailed reference
- `IMPLEMENTATION_GUIDE.md` - Code examples reference

---

# Phase 0 Prompt: Database Migration

## 📋 Copy This Prompt

```
I need to run a Supabase database migration to create user authentication tables.

CONTEXT:
- I have a file called `supabase-migration.sql` in my project root
- This creates 6 user-related tables with proper schema, foreign keys, indexes, and RLS policies
- My Supabase project URL: https://gyeviskmqtkskcoyyprp.supabase.co

TASK:
1. Show me the contents of `supabase-migration.sql` to verify it's correct
2. Give me step-by-step instructions to run this migration in Supabase Dashboard
3. Provide SQL queries to verify the migration succeeded
4. Create a simple test script to verify I can connect to the new tables from my Next.js app

CURRENT STATE:
- User tables exist but are empty with no schema
- I need to add columns, foreign keys, indexes, and RLS policies

EXPECTED OUTCOME:
- 6 user tables with full schema
- All foreign keys to auth.users
- RLS policies enabled
- Indexes created
- Triggers for auto-profile creation

Please guide me through this step-by-step.
```

**When to Run:** Right now (first step)  
**Estimated Time:** 1 hour  
**Success Criteria:**
- ✅ Migration runs without errors
- ✅ All 6 tables have proper columns
- ✅ RLS policies are enabled
- ✅ Test connection succeeds

---

# Phase 1 Prompt: Verify Database Schema

## 📋 Copy This Prompt

```
I just ran the Supabase migration and need to verify everything was created correctly.

CONTEXT:
- I ran `supabase-migration.sql` in Supabase Dashboard
- I need to verify all tables, columns, indexes, and RLS policies were created
- My Supabase project: https://gyeviskmqtkskcoyyprp.supabase.co

TASK:
1. Create a comprehensive verification script that checks:
   - All 6 user tables exist (UserProfiles, UserBuyerPreferences, UserLikedProperties, UserSavedListings, UserSavedSearches, UserViewingHistory, UserNotifications)
   - Each table has the correct number of columns
   - All foreign keys are properly set up
   - All indexes were created
   - RLS policies are enabled on all tables
   - Triggers exist for auto-profile creation

2. Create a test script that:
   - Connects to Supabase
   - Tests querying each table
   - Verifies RLS is working (can't query without auth)

3. If anything is missing, provide the SQL to fix it

EXPECTED OUTPUT:
- A Node.js script I can run: `node verify-migration.js`
- Clear output showing what's ✅ working and ❌ missing
- Fix scripts if anything is broken

Please create these verification scripts.
```

**When to Run:** Immediately after Phase 0  
**Estimated Time:** 30 minutes  
**Success Criteria:**
- ✅ All tables verified
- ✅ All foreign keys exist
- ✅ All indexes created
- ✅ RLS policies working

---

# Phase 2 Prompt: Implement Real Authentication

## 📋 Copy This Prompt

```
I need to replace mock authentication with real Supabase Auth in my Next.js app.

CONTEXT:
- I have a working Supabase database with user tables
- Current file: `components/Auth/AuthProvider.tsx` uses mock authentication
- Current file: `lib/supabaseClient.ts` is configured but needs verification
- I use Next.js 14 with App Router
- TypeScript + React

CURRENT AUTHENTICATION (Mock):
```typescript
// components/Auth/AuthProvider.tsx
- Mock user stored in memory
- signIn() creates fake user
- signUp() creates fake user
- No real database connection
```

TASK:
1. Update `lib/supabaseClient.ts` to ensure proper configuration
2. Completely rewrite `components/Auth/AuthProvider.tsx` to:
   - Use real Supabase Auth (supabase.auth.signUp, signIn, signOut)
   - Load UserProfiles data from database after auth
   - Listen for auth state changes
   - Persist sessions properly
   - Handle loading states

3. Keep the same TypeScript interface so other components don't need changes:
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}
```

4. Update sign-up to:
   - Create auth.users record
   - Pass first_name, last_name in user metadata
   - Verify UserProfiles is auto-created by trigger

5. Create a test page to verify:
   - Sign up works
   - Sign in works
   - Session persists on refresh
   - Sign out works
   - Profile is auto-created

IMPORTANT:
- Keep same interface for `useAuth()` hook
- Don't break existing components
- Add proper error handling
- Add loading states

Please implement this with complete code for both files.
```

**When to Run:** After Phase 1 verification passes  
**Estimated Time:** 3-4 hours  
**Success Criteria:**
- ✅ Real authentication working
- ✅ User profile auto-created on signup
- ✅ Sessions persist across refresh
- ✅ Existing components still work

---

# Phase 3 Prompt: Implement Liked Properties

## 📋 Copy This Prompt

```
I need to connect the "Liked Properties" feature to the real Supabase database.

CONTEXT:
- Real Supabase Auth is now working
- Table exists: `UserLikedProperties` with columns (id, user_id, listing_key, liked_at)
- Current file: `lib/userDataService.ts` has mock functions for liked properties
- Current file: `hooks/useUserData.ts` uses the service layer
- UI components already call these hooks and work with mock data

CURRENT MOCK FUNCTIONS TO REPLACE:
```typescript
// In lib/userDataService.ts
- getLikedListings(userId) // Returns mock data from memory
- addLikedListing(userId, listingKey, property)
- removeLikedListing(userId, listingKey)
- isListingLiked(userId, listingKey)
```

TASK:
1. Update these 4 functions in `lib/userDataService.ts` to use real Supabase queries:
   - getLikedListings() should join with Property table to get property details
   - addLikedListing() should INSERT into UserLikedProperties
   - removeLikedListing() should DELETE from UserLikedProperties
   - isListingLiked() should check if record exists

2. Keep the same function signatures and return types so hooks don't need changes

3. Handle the following edge cases:
   - Duplicate likes (unique constraint violation)
   - Property not found
   - User not authenticated
   - Database errors

4. Create a test page that:
   - Shows a property
   - Has a like button
   - Shows if property is liked
   - Persists likes to database
   - Loads likes on page refresh

EXPECTED BEHAVIOR:
- Click like → immediately shows as liked + saves to database
- Refresh page → still shows as liked
- Click unlike → immediately removes + deletes from database
- Fast queries (use indexes)

Please provide the updated code for userDataService.ts (liked properties section only).
```

**When to Run:** After Phase 2 authentication is working  
**Estimated Time:** 2-3 hours  
**Success Criteria:**
- ✅ Can like properties
- ✅ Likes persist to database
- ✅ Likes survive page refresh
- ✅ Can unlike properties
- ✅ Unique constraint prevents duplicates

---

# Phase 4 Prompt: Implement Saved Listings

## 📋 Copy This Prompt

```
I need to connect the "Saved Listings" feature (with notes and tags) to the real Supabase database.

CONTEXT:
- Real Supabase Auth working
- Liked Properties already implemented
- Table exists: `UserSavedListings` with columns (id, user_id, listing_key, saved_at, notes, tags)
- Current file: `lib/userDataService.ts` has mock functions for saved listings
- UI components use these functions through hooks

CURRENT MOCK FUNCTIONS TO REPLACE:
```typescript
// In lib/userDataService.ts
- getSavedListings(userId)
- addSavedListing(userId, listingKey, property, notes?, tags?)
- updateSavedListing(userId, listingKey, updates)
- removeSavedListing(userId, listingKey)
- isListingSaved(userId, listingKey)
```

TASK:
1. Update these 5 functions in `lib/userDataService.ts` to use real Supabase queries:
   - getSavedListings() should join with Property table, order by saved_at DESC
   - addSavedListing() should INSERT with notes and tags
   - updateSavedListing() should UPDATE notes and tags
   - removeSavedListing() should DELETE
   - isListingSaved() should check if record exists

2. Handle PostgreSQL array type for tags (TEXT[])

3. Keep same function signatures

4. Handle edge cases:
   - Duplicate saves (unique constraint)
   - Empty notes/tags (nullable)
   - Invalid property reference

5. Create or update test page to verify:
   - Save property with notes
   - Edit notes on saved property
   - Add/remove tags
   - List all saved properties
   - Delete saved property

SPECIAL CONSIDERATIONS:
- `tags` is a PostgreSQL TEXT[] array
- `notes` is nullable TEXT
- Use GIN index on tags for fast searching (already created by migration)

Please provide the updated code for userDataService.ts (saved listings section only).
```

**When to Run:** After Phase 3 liked properties working  
**Estimated Time:** 2-3 hours  
**Success Criteria:**
- ✅ Can save properties with notes
- ✅ Can edit notes and tags
- ✅ Tags stored as PostgreSQL array
- ✅ All data persists
- ✅ Can delete saved listings

---

# Phase 5 Prompt: Implement Saved Searches

## 📋 Copy This Prompt

```
I need to connect the "Saved Searches" feature (with JSONB criteria and notifications) to the real Supabase database.

CONTEXT:
- Real Auth, Liked Properties, and Saved Listings all working
- Table exists: `UserSavedSearches` with columns including search_criteria (JSONB) and notification_settings (JSONB)
- Current file: `lib/userDataService.ts` has mock functions for saved searches
- TypeScript interface exists: `SavedSearch` in `types/userData.ts`

CURRENT MOCK FUNCTIONS TO REPLACE:
```typescript
// In lib/userDataService.ts
- getSavedSearches(userId)
- addSavedSearch(userId, name, searchCriteria, notificationSettings?, isAutoSaved?)
- updateSavedSearch(userId, searchId, updates)
- removeSavedSearch(userId, searchId)
- runSavedSearch(userId, searchId) // Updates last_run_at
- upsertAutoSavedSearch(userId, searchCriteria) // Special logic for auto-saved searches
```

TASK:
1. Update these 6 functions to use real Supabase queries:
   - getSavedSearches() should return all user's searches, ordered by created_at DESC
   - addSavedSearch() should INSERT with JSONB data
   - updateSavedSearch() should UPDATE including JSONB fields
   - removeSavedSearch() should DELETE
   - runSavedSearch() should UPDATE last_run_at timestamp
   - upsertAutoSavedSearch() should find existing auto-saved search and update, or create new

2. Handle JSONB data types for:
   - search_criteria: { location?, propertyType?, priceRange?, bedrooms?, bathrooms?, status?, features? }
   - notification_settings: { email: boolean, frequency: 'daily'|'weekly'|'monthly' }

3. Keep same function signatures and return types

4. Handle edge cases:
   - Complex JSONB queries
   - Auto-saved vs manually saved searches
   - Preventing duplicate auto-saved searches

5. Create test page to verify:
   - Create saved search with criteria
   - View all saved searches
   - Edit search criteria
   - Toggle notifications
   - Delete search
   - Auto-save functionality

SPECIAL CONSIDERATIONS:
- JSONB fields need to be handled correctly in Supabase
- GIN index on search_criteria already created for fast searching
- Auto-saved searches have special logic (only one per user, replaceable)

Please provide the updated code for userDataService.ts (saved searches section only).
```

**When to Run:** After Phase 4 saved listings working  
**Estimated Time:** 2-3 hours  
**Success Criteria:**
- ✅ Can create saved searches
- ✅ JSONB criteria stored correctly
- ✅ Can edit searches
- ✅ Notification settings work
- ✅ Auto-save logic works
- ✅ Can delete searches

---

# Phase 6 Prompt: End-to-End Testing

## 📋 Copy This Prompt

```
I've implemented all core features and need comprehensive end-to-end testing and optimization.

CONTEXT:
- All phases complete: Auth, Liked Properties, Saved Listings, Saved Searches
- Everything connects to real Supabase database
- Need to verify everything works together
- Need to test security (RLS)
- Need to check performance

TASK:
1. Create a comprehensive test suite that verifies:
   
   **Authentication Flow:**
   - [ ] Sign up creates user in auth.users
   - [ ] UserProfiles auto-created by trigger
   - [ ] Sign in loads profile correctly
   - [ ] Session persists on page refresh
   - [ ] Sign out clears session
   - [ ] Can't access data when signed out

   **Liked Properties:**
   - [ ] Like property → saves to database
   - [ ] Unlike property → removes from database
   - [ ] Can't like same property twice
   - [ ] Likes survive page refresh
   - [ ] Fast queries (< 10ms)

   **Saved Listings:**
   - [ ] Save property with notes → persists
   - [ ] Edit notes → updates database
   - [ ] Add/edit tags → PostgreSQL array works
   - [ ] Delete saved listing → removes from database
   - [ ] Saved listings survive refresh

   **Saved Searches:**
   - [ ] Create search → JSONB stored correctly
   - [ ] Edit criteria → updates JSONB
   - [ ] Notification settings work
   - [ ] Auto-save replaces existing
   - [ ] Manual save removes auto-save
   - [ ] Delete search works

   **Security (RLS):**
   - [ ] User A can't see User B's liked properties
   - [ ] User A can't modify User B's data
   - [ ] Unauthenticated users can't query user tables
   - [ ] Service role can access all data (for admin)

   **Performance:**
   - [ ] Profile load < 5ms
   - [ ] Check if liked < 5ms
   - [ ] Get liked properties < 10ms
   - [ ] Get saved searches < 10ms
   - [ ] All queries use indexes

2. Create a test page (`/test-user-data`) that:
   - Shows current user info
   - Tests all CRUD operations
   - Shows query performance
   - Tests RLS (try to access other user's data)
   - Displays success/failure for each test

3. Check for any TypeScript errors in:
   - `lib/userDataService.ts`
   - `components/Auth/AuthProvider.tsx`
   - All hook files in `hooks/`

4. Provide performance optimization recommendations

5. Create a deployment checklist

EXPECTED DELIVERABLES:
- Test page with all verification checks
- Performance report
- Security verification
- Deployment checklist
- Any bug fixes needed

Please create comprehensive tests and verify everything works correctly.
```

**When to Run:** After Phase 5 is complete  
**Estimated Time:** 2-3 hours  
**Success Criteria:**
- ✅ All tests pass
- ✅ RLS verified working
- ✅ Performance acceptable
- ✅ No TypeScript errors
- ✅ Ready for production

---

## 📊 Progress Tracking

Copy this checklist and track your progress:

```markdown
## Implementation Progress

### Phase 0: Database Migration
- [ ] Ran supabase-migration.sql
- [ ] Verified no errors
- [ ] Tested connection
- [ ] Completion Date: __________

### Phase 1: Verify Database
- [ ] Created verification script
- [ ] All tables verified
- [ ] All indexes verified
- [ ] RLS policies verified
- [ ] Completion Date: __________

### Phase 2: Authentication
- [ ] Updated supabaseClient.ts
- [ ] Rewrote AuthProvider.tsx
- [ ] Sign up working
- [ ] Sign in working
- [ ] Session persistence working
- [ ] Profile auto-creation verified
- [ ] Completion Date: __________

### Phase 3: Liked Properties
- [ ] Updated getLikedListings()
- [ ] Updated addLikedListing()
- [ ] Updated removeLikedListing()
- [ ] Updated isListingLiked()
- [ ] Created test page
- [ ] All tests passing
- [ ] Completion Date: __________

### Phase 4: Saved Listings
- [ ] Updated getSavedListings()
- [ ] Updated addSavedListing()
- [ ] Updated updateSavedListing()
- [ ] Updated removeSavedListing()
- [ ] Updated isListingSaved()
- [ ] Notes and tags working
- [ ] All tests passing
- [ ] Completion Date: __________

### Phase 5: Saved Searches
- [ ] Updated getSavedSearches()
- [ ] Updated addSavedSearch()
- [ ] Updated updateSavedSearch()
- [ ] Updated removeSavedSearch()
- [ ] Updated runSavedSearch()
- [ ] Updated upsertAutoSavedSearch()
- [ ] JSONB working correctly
- [ ] All tests passing
- [ ] Completion Date: __________

### Phase 6: Testing & Optimization
- [ ] Created test suite
- [ ] All authentication tests pass
- [ ] All liked properties tests pass
- [ ] All saved listings tests pass
- [ ] All saved searches tests pass
- [ ] RLS security verified
- [ ] Performance acceptable
- [ ] No TypeScript errors
- [ ] Completion Date: __________

### Deployment
- [ ] Code reviewed
- [ ] Tested in staging
- [ ] Deployed to production
- [ ] Monitoring enabled
- [ ] Completion Date: __________
```

---

## 💡 Tips for Success

### Between Phases
1. **Commit after each phase** - `git commit -m "Phase X complete"`
2. **Test thoroughly** - Don't move to next phase if current one has issues
3. **Take breaks** - Don't rush, quality over speed
4. **Document issues** - Keep notes of any problems encountered

### If Something Goes Wrong
1. **Don't panic** - Each phase is reversible
2. **Check the logs** - Supabase Dashboard → Logs
3. **Review RLS policies** - Most issues are RLS-related
4. **Check user authentication** - Make sure user is logged in
5. **Verify environment variables** - Correct Supabase URL and keys

### Getting Help
- **Reference:** `SUPABASE_AUTH_AUDIT_REPORT.md` for detailed specs
- **Examples:** `IMPLEMENTATION_GUIDE.md` for code examples
- **Supabase Docs:** https://supabase.com/docs
- **Database:** Check Supabase Dashboard for data

---

## 🎯 Alternative: Quick Implementation

If you want to do it all at once (not recommended but possible):

### Single Mega-Prompt

```
I need to implement complete Supabase authentication for my Next.js app.

CONTEXT:
- I have `supabase-migration.sql` ready to run
- Current auth is mock-based in `components/Auth/AuthProvider.tsx`
- Current user data is mock-based in `lib/userDataService.ts`
- I have TypeScript interfaces already defined
- Next.js 14 with App Router

TASK:
Implement everything in order:
1. Guide me through running the database migration
2. Verify migration succeeded
3. Implement real authentication (AuthProvider.tsx)
4. Implement liked properties (userDataService.ts)
5. Implement saved listings with notes/tags
6. Implement saved searches with JSONB
7. Create comprehensive tests
8. Verify RLS security
9. Check performance

Please do this step-by-step, waiting for my confirmation after each major step.

I have all the audit reports for reference:
- SUPABASE_AUTH_AUDIT_REPORT.md
- IMPLEMENTATION_GUIDE.md
- supabase-migration.sql
```

**Time:** 1-2 full days  
**Risk:** Higher (harder to debug if issues occur)  
**Recommended:** Only if you have a full day to dedicate

---

## 📝 Final Notes

### Recommended Approach
- **Use phased prompts** (Phase 0-6)
- **One phase per session**
- **Test thoroughly between phases**
- **Commit code after each phase**

### Time Investment
- **Phased:** 12-18 hours over 1-2 weeks
- **All-at-once:** 12-16 hours in 1-2 days

### Success Rate
- **Phased:** Higher (easier to debug, test, and verify)
- **All-at-once:** Lower (harder to isolate issues)

---

**Ready to start? Begin with Phase 0! 🚀**

Copy the Phase 0 prompt and paste it into a new conversation, or continue in this one. After Phase 0 completes successfully, move to Phase 1, and so on.

Good luck with your implementation!

