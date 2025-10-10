# Supabase Authentication - Implementation Guide

**Quick Start Guide for Developers**

---

## 🚀 Quick Start (15 Minutes)

### Step 1: Run the Database Migration (5 min)

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/gyeviskmqtkskcoyyprp
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-migration.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Wait for "Migration completed successfully!" message

**Verify it worked:**
```sql
-- Run this query to check tables
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_name LIKE 'User%';
```

You should see:
- UserProfiles (8 columns)
- UserBuyerPreferences (7 columns)
- UserLikedProperties (6 columns)
- UserSavedListings (8 columns)
- UserSavedSearches (10 columns)
- UserViewingHistory (7 columns)
- UserNotifications (8 columns)

---

### Step 2: Update Environment Variables (2 min)

Make sure your `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gyeviskmqtkskcoyyprp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZXZpc2ttcXRrc2tjb3l5cHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjM5MzgsImV4cCI6MjA3Mzg5OTkzOH0.qDOpA1nSwWdnQhIJQiQx-rjgl800EjTU3M90iKQQDiI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZXZpc2ttcXRrc2tjb3l5cHJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODMyMzkzOCwiZXhwIjoyMDczODk5OTM4fQ.KryixRJ8n-wy1n_WySex5qkHVST_awSudkM53SaSDj0
```

---

### Step 3: Test Database Connection (3 min)

Create a test file to verify everything works:

```typescript
// test-db-connection.ts
import { supabase } from './lib/supabaseClient';

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check if we can query UserProfiles
  const { data, error } = await supabase
    .from('UserProfiles')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('UserProfiles table is accessible');
  }
  
  // Test 2: Check auth
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session ? 'Logged in' : 'Not logged in');
}

testConnection();
```

Run: `npx ts-node test-db-connection.ts`

---

### Step 4: Update AuthProvider (5 min)

Replace the mock authentication in `components/Auth/AuthProvider.tsx`:

```typescript
// components/Auth/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
  signIn: async () => false,
  signUp: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('UserProfiles')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .single();

    if (profile) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: `${profile.first_name} ${profile.last_name}`.trim() || undefined,
        avatar_url: profile.avatar_url || undefined,
      });
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signUp = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return false;
      }

      if (data.user) {
        // Profile is auto-created by database trigger
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signOut,
        signIn,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🔧 Detailed Implementation

### Part 1: Replace User Data Service

Update `lib/userDataService.ts` to use real Supabase queries:

```typescript
// lib/userDataService.ts
import { supabase } from './supabaseClient';
import { Property } from '@/types';
import { LikedListing, SavedListing, SavedSearch } from '@/types/userData';

// ============================================================================
// LIKED LISTINGS
// ============================================================================

export async function getLikedListings(userId: string): Promise<LikedListing[]> {
  const { data, error } = await supabase
    .from('UserLikedProperties')
    .select(`
      id,
      user_id,
      listing_key,
      liked_at,
      Property (
        ListingKey,
        UnparsedAddress,
        StreetAddress,
        ListPrice,
        Bedrooms,
        Bathrooms,
        SquareFootage,
        PropertyType,
        PrimaryImageUrl,
        MlsStatus
      )
    `)
    .eq('user_id', userId)
    .order('liked_at', { ascending: false });

  if (error) {
    console.error('Error fetching liked listings:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    listingKey: item.listing_key,
    likedAt: item.liked_at,
    property: {
      listingKey: item.Property.ListingKey,
      address: item.Property.UnparsedAddress || item.Property.StreetAddress || '',
      price: item.Property.ListPrice || 0,
      bedrooms: item.Property.Bedrooms || 0,
      bathrooms: item.Property.Bathrooms || 0,
      squareFootage: item.Property.SquareFootage || '',
      propertyType: item.Property.PropertyType || '',
      primaryImageUrl: item.Property.PrimaryImageUrl,
      status: item.Property.MlsStatus || 'Active',
    },
  }));
}

export async function addLikedListing(
  userId: string,
  listingKey: string,
  property: Property
): Promise<LikedListing> {
  const { data, error } = await supabase
    .from('UserLikedProperties')
    .insert({
      user_id: userId,
      listing_key: listingKey,
      liked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding liked listing:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    listingKey: data.listing_key,
    likedAt: data.liked_at,
    property: {
      listingKey: property.ListingKey,
      address: property.UnparsedAddress || property.StreetAddress || '',
      price: property.ListPrice || 0,
      bedrooms: property.Bedrooms || 0,
      bathrooms: property.Bathrooms || 0,
      squareFootage: property.SquareFootage || '',
      propertyType: property.PropertyType || '',
      primaryImageUrl: property.PrimaryImageUrl,
      status: property.MlsStatus || 'Active',
    },
  };
}

export async function removeLikedListing(
  userId: string,
  listingKey: string
): Promise<boolean> {
  const { error } = await supabase
    .from('UserLikedProperties')
    .delete()
    .eq('user_id', userId)
    .eq('listing_key', listingKey);

  if (error) {
    console.error('Error removing liked listing:', error);
    return false;
  }

  return true;
}

export async function isListingLiked(
  userId: string,
  listingKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('UserLikedProperties')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_key', listingKey)
    .single();

  return !error && !!data;
}

// ============================================================================
// SAVED LISTINGS
// ============================================================================

export async function getSavedListings(userId: string): Promise<SavedListing[]> {
  const { data, error } = await supabase
    .from('UserSavedListings')
    .select(`
      id,
      user_id,
      listing_key,
      saved_at,
      notes,
      tags,
      Property (
        ListingKey,
        UnparsedAddress,
        StreetAddress,
        ListPrice,
        Bedrooms,
        Bathrooms,
        SquareFootage,
        PropertyType,
        PrimaryImageUrl,
        MlsStatus
      )
    `)
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved listings:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    listingKey: item.listing_key,
    savedAt: item.saved_at,
    notes: item.notes,
    tags: item.tags || [],
    property: {
      listingKey: item.Property.ListingKey,
      address: item.Property.UnparsedAddress || item.Property.StreetAddress || '',
      price: item.Property.ListPrice || 0,
      bedrooms: item.Property.Bedrooms || 0,
      bathrooms: item.Property.Bathrooms || 0,
      squareFootage: item.Property.SquareFootage || '',
      propertyType: item.Property.PropertyType || '',
      primaryImageUrl: item.Property.PrimaryImageUrl,
      status: item.Property.MlsStatus || 'Active',
    },
  }));
}

export async function addSavedListing(
  userId: string,
  listingKey: string,
  property: Property,
  notes?: string,
  tags?: string[]
): Promise<SavedListing> {
  const { data, error } = await supabase
    .from('UserSavedListings')
    .insert({
      user_id: userId,
      listing_key: listingKey,
      saved_at: new Date().toISOString(),
      notes,
      tags,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding saved listing:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    listingKey: data.listing_key,
    savedAt: data.saved_at,
    notes: data.notes,
    tags: data.tags || [],
    property: {
      listingKey: property.ListingKey,
      address: property.UnparsedAddress || property.StreetAddress || '',
      price: property.ListPrice || 0,
      bedrooms: property.Bedrooms || 0,
      bathrooms: property.Bathrooms || 0,
      squareFootage: property.SquareFootage || '',
      propertyType: property.PropertyType || '',
      primaryImageUrl: property.PrimaryImageUrl,
      status: property.MlsStatus || 'Active',
    },
  };
}

export async function updateSavedListing(
  userId: string,
  listingKey: string,
  updates: { notes?: string; tags?: string[] }
): Promise<SavedListing | null> {
  const { data, error } = await supabase
    .from('UserSavedListings')
    .update(updates)
    .eq('user_id', userId)
    .eq('listing_key', listingKey)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved listing:', error);
    return null;
  }

  // Note: This is a simplified return, should include property data
  return data as any;
}

export async function removeSavedListing(
  userId: string,
  listingKey: string
): Promise<boolean> {
  const { error } = await supabase
    .from('UserSavedListings')
    .delete()
    .eq('user_id', userId)
    .eq('listing_key', listingKey);

  if (error) {
    console.error('Error removing saved listing:', error);
    return false;
  }

  return true;
}

export async function isListingSaved(
  userId: string,
  listingKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('UserSavedListings')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_key', listingKey)
    .single();

  return !error && !!data;
}

// ============================================================================
// SAVED SEARCHES
// ============================================================================

export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  const { data, error } = await supabase
    .from('UserSavedSearches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved searches:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    name: item.name,
    searchCriteria: item.search_criteria,
    createdAt: item.created_at,
    lastRunAt: item.last_run_at,
    isActive: item.is_active,
    isAutoSaved: item.is_auto_saved,
    notificationSettings: item.notification_settings,
  }));
}

export async function addSavedSearch(
  userId: string,
  name: string,
  searchCriteria: SavedSearch['searchCriteria'],
  notificationSettings?: SavedSearch['notificationSettings'],
  isAutoSaved?: boolean
): Promise<SavedSearch> {
  const { data, error } = await supabase
    .from('UserSavedSearches')
    .insert({
      user_id: userId,
      name,
      search_criteria: searchCriteria,
      is_active: true,
      is_auto_saved: isAutoSaved || false,
      notification_settings: notificationSettings,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding saved search:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    searchCriteria: data.search_criteria,
    createdAt: data.created_at,
    lastRunAt: data.last_run_at,
    isActive: data.is_active,
    isAutoSaved: data.is_auto_saved,
    notificationSettings: data.notification_settings,
  };
}

export async function updateSavedSearch(
  userId: string,
  searchId: string,
  updates: Partial<SavedSearch>
): Promise<SavedSearch | null> {
  const { data, error } = await supabase
    .from('UserSavedSearches')
    .update({
      name: updates.name,
      search_criteria: updates.searchCriteria,
      is_active: updates.isActive,
      notification_settings: updates.notificationSettings,
    })
    .eq('id', searchId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved search:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    searchCriteria: data.search_criteria,
    createdAt: data.created_at,
    lastRunAt: data.last_run_at,
    isActive: data.is_active,
    isAutoSaved: data.is_auto_saved,
    notificationSettings: data.notification_settings,
  };
}

export async function removeSavedSearch(
  userId: string,
  searchId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('UserSavedSearches')
    .delete()
    .eq('id', searchId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing saved search:', error);
    return false;
  }

  return true;
}

export async function runSavedSearch(
  userId: string,
  searchId: string
): Promise<SavedSearch | null> {
  const { data, error } = await supabase
    .from('UserSavedSearches')
    .update({ last_run_at: new Date().toISOString() })
    .eq('id', searchId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error running saved search:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    searchCriteria: data.search_criteria,
    createdAt: data.created_at,
    lastRunAt: data.last_run_at,
    isActive: data.is_active,
    isAutoSaved: data.is_auto_saved,
    notificationSettings: data.notification_settings,
  };
}

// Continue with other functions...
```

---

## ✅ Testing Checklist

After implementation, test these scenarios:

### Authentication
- [ ] Sign up new user → Check UserProfiles table has new record
- [ ] Sign in with correct credentials → User data loads
- [ ] Sign in with wrong credentials → Shows error
- [ ] Sign out → Session cleared
- [ ] Refresh page while logged in → Session persists

### Liked Properties
- [ ] Like a property → Record added to UserLikedProperties
- [ ] Unlike a property → Record removed
- [ ] Try to like same property twice → Prevented by unique constraint
- [ ] View liked properties list → Shows all liked properties

### Saved Listings
- [ ] Save a property with notes → Stored correctly
- [ ] Edit notes on saved property → Updates in database
- [ ] Add tags to saved property → Tags array updated
- [ ] Remove saved property → Record deleted

### Saved Searches
- [ ] Create saved search → Stored with JSONB criteria
- [ ] Edit saved search criteria → Updates correctly
- [ ] Toggle email notifications → Settings updated
- [ ] Delete saved search → Record removed

### Security
- [ ] User A cannot see User B's data
- [ ] Unauthenticated user cannot query user tables
- [ ] Service role can access all data

---

## 🐛 Troubleshooting

### "relation does not exist"
**Problem:** Table name casing issue  
**Solution:** Wrap table names in quotes: `"UserProfiles"` instead of `UserProfiles`

### "Row Level Security policy violation"
**Problem:** RLS is enabled but no matching policy  
**Solution:** Check that you're authenticated and using `auth.uid()` correctly

### "Foreign key constraint violation"
**Problem:** Trying to reference non-existent record  
**Solution:** Ensure the Property.ListingKey or auth.users.id exists

### "Unique constraint violation"
**Problem:** Trying to like/save same property twice  
**Solution:** Check if record exists before inserting, or handle error gracefully

### "Cannot read properties of null"
**Problem:** User not authenticated  
**Solution:** Check `user?.id` before making queries

---

## 📚 Resources

- **Full Audit Report:** `SUPABASE_AUTH_AUDIT_REPORT.md`
- **SQL Migration:** `supabase-migration.sql`
- **Quick Summary:** `AUDIT_SUMMARY.md`
- **Supabase Docs:** https://supabase.com/docs
- **Supabase JS Client:** https://supabase.com/docs/reference/javascript

---

**Need Help?**
- Check the full audit report for detailed explanations
- Review Supabase documentation for specific issues
- Test each piece incrementally, don't change everything at once

---

**Happy Coding! 🚀**

