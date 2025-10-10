-- ============================================================================
-- SUPABASE DATABASE SCHEMA MIGRATION
-- User Authentication & Data Management Tables
-- ============================================================================
-- 
-- Project: FRONTEND_V5
-- Database: gyeviskmqtkskcoyyprp.supabase.co
-- Generated: October 10, 2025
--
-- This migration creates all necessary user-related tables, relationships,
-- indexes, RLS policies, and triggers for Supabase Auth integration.
--
-- BEFORE RUNNING:
-- 1. Backup your database
-- 2. Review each section
-- 3. Test in development first
--
-- TO RUN:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" or press Ctrl+Enter
--
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
-- Purpose: Store user profile information linked to Supabase Auth users
-- Relationship: 1:1 with auth.users
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserProfiles" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_userprofiles_user_id ON "UserProfiles"(user_id);
CREATE INDEX IF NOT EXISTS idx_userprofiles_email ON "UserProfiles"(email);

-- Row Level Security Policies
ALTER TABLE "UserProfiles" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON "UserProfiles";
CREATE POLICY "Users can view own profile"
  ON "UserProfiles" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON "UserProfiles";
CREATE POLICY "Users can insert own profile"
  ON "UserProfiles" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON "UserProfiles";
CREATE POLICY "Users can update own profile"
  ON "UserProfiles" FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. USER BUYER PREFERENCES TABLE
-- ============================================================================
-- Purpose: Store buyer qualification and preference information
-- Relationship: 1:1 with auth.users
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserBuyerPreferences" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_first_time_buyer BOOLEAN,
  is_preapproved BOOLEAN,
  has_house_to_sell BOOLEAN,
  purchase_timeframe TEXT CHECK (purchase_timeframe IN ('0-3months', '3-6months', '6-12months', '12+months', 'curious')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_userbuyerpreferences_user_id ON "UserBuyerPreferences"(user_id);

-- Row Level Security Policies
ALTER TABLE "UserBuyerPreferences" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own buyer preferences" ON "UserBuyerPreferences";
CREATE POLICY "Users can view own buyer preferences"
  ON "UserBuyerPreferences" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own buyer preferences" ON "UserBuyerPreferences";
CREATE POLICY "Users can insert own buyer preferences"
  ON "UserBuyerPreferences" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own buyer preferences" ON "UserBuyerPreferences";
CREATE POLICY "Users can update own buyer preferences"
  ON "UserBuyerPreferences" FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. USER LIKED PROPERTIES TABLE
-- ============================================================================
-- Purpose: Track properties that users have "liked" for quick reference
-- Relationship: Many-to-many between users and properties
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserLikedProperties" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_key TEXT NOT NULL REFERENCES "Property"("ListingKey") ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_key)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_userlikedproperties_user_id ON "UserLikedProperties"(user_id);
CREATE INDEX IF NOT EXISTS idx_userlikedproperties_listing_key ON "UserLikedProperties"(listing_key);
CREATE INDEX IF NOT EXISTS idx_userlikedproperties_liked_at ON "UserLikedProperties"(liked_at DESC);

-- Row Level Security Policies
ALTER TABLE "UserLikedProperties" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own liked properties" ON "UserLikedProperties";
CREATE POLICY "Users can view own liked properties"
  ON "UserLikedProperties" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own liked properties" ON "UserLikedProperties";
CREATE POLICY "Users can insert own liked properties"
  ON "UserLikedProperties" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own liked properties" ON "UserLikedProperties";
CREATE POLICY "Users can delete own liked properties"
  ON "UserLikedProperties" FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. USER SAVED LISTINGS TABLE
-- ============================================================================
-- Purpose: Properties saved with notes and tags for detailed tracking
-- Relationship: Many-to-many between users and properties (with metadata)
-- Note: This is separate from "liked" - saved listings have notes/tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserSavedListings" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_key TEXT NOT NULL REFERENCES "Property"("ListingKey") ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usersavedlistings_user_id ON "UserSavedListings"(user_id);
CREATE INDEX IF NOT EXISTS idx_usersavedlistings_listing_key ON "UserSavedListings"(listing_key);
CREATE INDEX IF NOT EXISTS idx_usersavedlistings_saved_at ON "UserSavedListings"(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_usersavedlistings_tags ON "UserSavedListings" USING GIN(tags);

-- Row Level Security Policies
ALTER TABLE "UserSavedListings" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved listings" ON "UserSavedListings";
CREATE POLICY "Users can view own saved listings"
  ON "UserSavedListings" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved listings" ON "UserSavedListings";
CREATE POLICY "Users can insert own saved listings"
  ON "UserSavedListings" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own saved listings" ON "UserSavedListings";
CREATE POLICY "Users can update own saved listings"
  ON "UserSavedListings" FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved listings" ON "UserSavedListings";
CREATE POLICY "Users can delete own saved listings"
  ON "UserSavedListings" FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. USER SAVED SEARCHES TABLE
-- ============================================================================
-- Purpose: Store user's saved search criteria with notification settings
-- Features: Auto-saved searches, email notifications, search execution tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserSavedSearches" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_auto_saved BOOLEAN NOT NULL DEFAULT false,
  notification_settings JSONB,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usersavedsearches_user_id ON "UserSavedSearches"(user_id);
CREATE INDEX IF NOT EXISTS idx_usersavedsearches_is_active ON "UserSavedSearches"(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_usersavedsearches_created_at ON "UserSavedSearches"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usersavedsearches_search_criteria ON "UserSavedSearches" USING GIN(search_criteria);

-- Row Level Security Policies
ALTER TABLE "UserSavedSearches" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved searches" ON "UserSavedSearches";
CREATE POLICY "Users can view own saved searches"
  ON "UserSavedSearches" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved searches" ON "UserSavedSearches";
CREATE POLICY "Users can insert own saved searches"
  ON "UserSavedSearches" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own saved searches" ON "UserSavedSearches";
CREATE POLICY "Users can update own saved searches"
  ON "UserSavedSearches" FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved searches" ON "UserSavedSearches";
CREATE POLICY "Users can delete own saved searches"
  ON "UserSavedSearches" FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. USER VIEWING HISTORY TABLE
-- ============================================================================
-- Purpose: Track which properties users view for analytics and recommendations
-- Features: View duration tracking, source tracking (search, map, direct, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserViewingHistory" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_key TEXT NOT NULL REFERENCES "Property"("ListingKey") ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_duration INTEGER, -- Duration in seconds
  source TEXT, -- 'search', 'map', 'direct_link', 'saved_listing', 'liked_listing', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_userviewinghistory_user_id_viewed_at ON "UserViewingHistory"(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_userviewinghistory_listing_key ON "UserViewingHistory"(listing_key);
CREATE INDEX IF NOT EXISTS idx_userviewinghistory_viewed_at ON "UserViewingHistory"(viewed_at DESC);

-- Row Level Security Policies
ALTER TABLE "UserViewingHistory" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own viewing history" ON "UserViewingHistory";
CREATE POLICY "Users can view own viewing history"
  ON "UserViewingHistory" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own viewing history" ON "UserViewingHistory";
CREATE POLICY "Users can insert own viewing history"
  ON "UserViewingHistory" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. USER NOTIFICATIONS TABLE
-- ============================================================================
-- Purpose: Store user notifications (price changes, new listings, etc.)
-- Features: Read/unread status, notification types, additional data
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserNotifications" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'price_change', 'new_listing', 'saved_search_match', 'open_house', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional notification-specific data (property info, etc.)
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for notification queries
CREATE INDEX IF NOT EXISTS idx_usernotifications_user_id_created_at ON "UserNotifications"(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usernotifications_unread ON "UserNotifications"(user_id, is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_usernotifications_type ON "UserNotifications"(type);

-- Row Level Security Policies
ALTER TABLE "UserNotifications" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON "UserNotifications";
CREATE POLICY "Users can view own notifications"
  ON "UserNotifications" FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON "UserNotifications";
CREATE POLICY "Users can update own notifications"
  ON "UserNotifications" FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON "UserNotifications";
CREATE POLICY "Users can delete own notifications"
  ON "UserNotifications" FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DROP TRIGGER IF EXISTS update_userprofiles_updated_at ON "UserProfiles";
CREATE TRIGGER update_userprofiles_updated_at
  BEFORE UPDATE ON "UserProfiles"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_userbuyerpreferences_updated_at ON "UserBuyerPreferences";
CREATE TRIGGER update_userbuyerpreferences_updated_at
  BEFORE UPDATE ON "UserBuyerPreferences"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_userlikedproperties_updated_at ON "UserLikedProperties";
CREATE TRIGGER update_userlikedproperties_updated_at
  BEFORE UPDATE ON "UserLikedProperties"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usersavedlistings_updated_at ON "UserSavedListings";
CREATE TRIGGER update_usersavedlistings_updated_at
  BEFORE UPDATE ON "UserSavedListings"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usersavedsearches_updated_at ON "UserSavedSearches";
CREATE TRIGGER update_usersavedsearches_updated_at
  BEFORE UPDATE ON "UserSavedSearches"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "UserProfiles" (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', COALESCE(NEW.raw_user_meta_data->>'firstName', '')),
    COALESCE(NEW.raw_user_meta_data->>'last_name', COALESCE(NEW.raw_user_meta_data->>'lastName', ''))
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get user's liked listing keys (for quick checks)
CREATE OR REPLACE FUNCTION get_user_liked_listings(p_user_id UUID)
RETURNS TABLE(listing_key TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ulp.listing_key
  FROM "UserLikedProperties" ulp
  WHERE ulp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE "UserNotifications"
  SET is_read = true, read_at = NOW()
  WHERE id = p_notification_id AND user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  notification_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO notification_count
  FROM "UserNotifications"
  WHERE user_id = p_user_id AND is_read = false;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION COMPLETE - VERIFICATION QUERIES
-- ============================================================================

-- Verify all tables exist and show column counts
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE 'User%'
ORDER BY table_name;

-- Show all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename LIKE 'User%'
ORDER BY tablename, policyname;

-- Show all indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename LIKE 'User%'
ORDER BY tablename, indexname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Review the verification queries above';
  RAISE NOTICE '2. Test user signup to verify profile auto-creation';
  RAISE NOTICE '3. Update your frontend to use real Supabase Auth';
  RAISE NOTICE '4. Replace mock userDataService with real queries';
END $$;

