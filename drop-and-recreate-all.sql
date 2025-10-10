-- ============================================================================
-- DROP AND RECREATE ALL USER TABLES
-- ============================================================================
-- WARNING: This will DELETE all existing data in user tables!
-- Make sure you have a backup before running this script.
-- ============================================================================

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public."UserProfiles";
DROP TRIGGER IF EXISTS update_buyer_prefs_updated_at ON public."UserBuyerPreferences";
DROP TRIGGER IF EXISTS update_saved_listings_updated_at ON public."UserSavedListings";
DROP TRIGGER IF EXISTS update_saved_searches_updated_at ON public."UserSavedSearches";

-- Drop all tables (CASCADE will drop foreign key constraints)
DROP TABLE IF EXISTS public."UserNotifications" CASCADE;
DROP TABLE IF EXISTS public."UserViewingHistory" CASCADE;
DROP TABLE IF EXISTS public."UserSavedSearches" CASCADE;
DROP TABLE IF EXISTS public."UserSavedListings" CASCADE;
DROP TABLE IF EXISTS public."UserLikedProperties" CASCADE;
DROP TABLE IF EXISTS public."UserBuyerPreferences" CASCADE;
DROP TABLE IF EXISTS public."UserProfiles" CASCADE;

-- Drop all user-specific functions (NOT update_updated_at_column - it's shared with Property tables)
DROP FUNCTION IF EXISTS mark_all_notifications_read(UUID);
DROP FUNCTION IF EXISTS mark_notification_read(UUID, UUID);
DROP FUNCTION IF EXISTS get_unread_notification_count(UUID);
DROP FUNCTION IF EXISTS get_user_saved_count(UUID);
DROP FUNCTION IF EXISTS get_user_liked_count(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================================
-- NOW RECREATE EVERYTHING
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE 1: User Profiles
-- ============================================================================
CREATE TABLE public."UserProfiles" (
  "Id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "Email" TEXT NOT NULL,
  "FirstName" TEXT,
  "LastName" TEXT,
  "Phone" TEXT,
  "AvatarUrl" TEXT,
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "UpdatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "LastLoginAt" TIMESTAMPTZ
);

CREATE INDEX idx_user_profiles_email ON public."UserProfiles"("Email");

ALTER TABLE public."UserProfiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public."UserProfiles"
  FOR SELECT
  USING (auth.uid() = "Id");

CREATE POLICY "Users can update own profile"
  ON public."UserProfiles"
  FOR UPDATE
  USING (auth.uid() = "Id")
  WITH CHECK (auth.uid() = "Id");

COMMENT ON TABLE public."UserProfiles" IS 'Extended user profile information';


-- ============================================================================
-- TABLE 2: User Buyer Preferences
-- ============================================================================
CREATE TABLE public."UserBuyerPreferences" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "FirstTimeBuyer" BOOLEAN,
  "PreApproved" BOOLEAN,
  "HasHouseToSell" BOOLEAN,
  "PurchaseTimeframe" TEXT CHECK ("PurchaseTimeframe" IN ('0-3', '3-6', '6-12', '12+')),
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "UpdatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_buyer_prefs UNIQUE ("UserId")
);

CREATE INDEX idx_buyer_prefs_user_id ON public."UserBuyerPreferences"("UserId");

ALTER TABLE public."UserBuyerPreferences" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON public."UserBuyerPreferences"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can create own preferences"
  ON public."UserBuyerPreferences"
  FOR INSERT
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can update own preferences"
  ON public."UserBuyerPreferences"
  FOR UPDATE
  USING (auth.uid() = "UserId")
  WITH CHECK (auth.uid() = "UserId");

COMMENT ON TABLE public."UserBuyerPreferences" IS 'Buyer questionnaire responses from signup';


-- ============================================================================
-- TABLE 3: User Liked Properties
-- ============================================================================
CREATE TABLE public."UserLikedProperties" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "MlsNumber" TEXT NOT NULL,
  "LikedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_property UNIQUE ("UserId", "MlsNumber")
);

CREATE INDEX idx_liked_user_id ON public."UserLikedProperties"("UserId");
CREATE INDEX idx_liked_mls_number ON public."UserLikedProperties"("MlsNumber");
CREATE INDEX idx_liked_user_mls ON public."UserLikedProperties"("UserId", "MlsNumber");

ALTER TABLE public."UserLikedProperties" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own liked properties"
  ON public."UserLikedProperties"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can like properties"
  ON public."UserLikedProperties"
  FOR INSERT
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can unlike properties"
  ON public."UserLikedProperties"
  FOR DELETE
  USING (auth.uid() = "UserId");

COMMENT ON TABLE public."UserLikedProperties" IS 'User favorited properties (quick like/heart button)';


-- ============================================================================
-- TABLE 4: User Saved Listings
-- ============================================================================
CREATE TABLE public."UserSavedListings" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "MlsNumber" TEXT NOT NULL,
  "SavedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "Notes" TEXT,
  "Tags" TEXT[],
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "UpdatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_saved_listing UNIQUE ("UserId", "MlsNumber")
);

CREATE INDEX idx_saved_listings_user_id ON public."UserSavedListings"("UserId");
CREATE INDEX idx_saved_listings_mls_number ON public."UserSavedListings"("MlsNumber");
CREATE INDEX idx_saved_listings_saved_at ON public."UserSavedListings"("SavedAt" DESC);
CREATE INDEX idx_saved_listings_tags ON public."UserSavedListings" USING GIN("Tags");

ALTER TABLE public."UserSavedListings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved listings"
  ON public."UserSavedListings"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can create saved listings"
  ON public."UserSavedListings"
  FOR INSERT
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can update own saved listings"
  ON public."UserSavedListings"
  FOR UPDATE
  USING (auth.uid() = "UserId")
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can delete own saved listings"
  ON public."UserSavedListings"
  FOR DELETE
  USING (auth.uid() = "UserId");

COMMENT ON TABLE public."UserSavedListings" IS 'Properties saved with notes and tags (separate from liked)';


-- ============================================================================
-- TABLE 5: User Saved Searches
-- ============================================================================
CREATE TABLE public."UserSavedSearches" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "Name" TEXT NOT NULL,
  "Filters" JSONB NOT NULL DEFAULT '{}',
  "AlertsEnabled" BOOLEAN DEFAULT true,
  "AlertFrequency" TEXT DEFAULT 'daily' CHECK ("AlertFrequency" IN ('instant', 'daily', 'weekly', 'never')),
  "LastRunAt" TIMESTAMPTZ,
  "LastNotifiedAt" TIMESTAMPTZ,
  "NewResultsCount" INT DEFAULT 0,
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "UpdatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_saved_searches_user_id ON public."UserSavedSearches"("UserId");
CREATE INDEX idx_saved_searches_alerts ON public."UserSavedSearches"("AlertsEnabled") WHERE "AlertsEnabled" = true;

ALTER TABLE public."UserSavedSearches" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved searches"
  ON public."UserSavedSearches"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can create saved searches"
  ON public."UserSavedSearches"
  FOR INSERT
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can update own saved searches"
  ON public."UserSavedSearches"
  FOR UPDATE
  USING (auth.uid() = "UserId")
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can delete own saved searches"
  ON public."UserSavedSearches"
  FOR DELETE
  USING (auth.uid() = "UserId");

COMMENT ON TABLE public."UserSavedSearches" IS 'User saved search criteria and alerts';


-- ============================================================================
-- TABLE 6: User Viewing History
-- ============================================================================
CREATE TABLE public."UserViewingHistory" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "MlsNumber" TEXT NOT NULL,
  "ViewCount" INT DEFAULT 1,
  "FirstViewedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "LastViewedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_property_view UNIQUE ("UserId", "MlsNumber")
);

CREATE INDEX idx_viewing_user_id ON public."UserViewingHistory"("UserId");
CREATE INDEX idx_viewing_mls_number ON public."UserViewingHistory"("MlsNumber");
CREATE INDEX idx_viewing_last_viewed ON public."UserViewingHistory"("LastViewedAt" DESC);

ALTER TABLE public."UserViewingHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own viewing history"
  ON public."UserViewingHistory"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can track their own views"
  ON public."UserViewingHistory"
  FOR INSERT
  WITH CHECK (auth.uid() = "UserId");

CREATE POLICY "Users can update their own viewing history"
  ON public."UserViewingHistory"
  FOR UPDATE
  USING (auth.uid() = "UserId")
  WITH CHECK (auth.uid() = "UserId");

COMMENT ON TABLE public."UserViewingHistory" IS 'Property viewing history tracking';


-- ============================================================================
-- TABLE 7: User Notifications
-- ============================================================================
CREATE TABLE public."UserNotifications" (
  "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "UserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "Type" TEXT NOT NULL CHECK ("Type" IN ('saved_search', 'price_change', 'status_change', 'open_house', 'system')),
  "Title" TEXT NOT NULL,
  "Message" TEXT NOT NULL,
  "Data" JSONB DEFAULT '{}',
  "IsRead" BOOLEAN DEFAULT false,
  "ReadAt" TIMESTAMPTZ,
  "CreatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user_id ON public."UserNotifications"("UserId");
CREATE INDEX idx_notifications_unread ON public."UserNotifications"("UserId", "IsRead") WHERE "IsRead" = false;
CREATE INDEX idx_notifications_created ON public."UserNotifications"("CreatedAt" DESC);

ALTER TABLE public."UserNotifications" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public."UserNotifications"
  FOR SELECT
  USING (auth.uid() = "UserId");

CREATE POLICY "Users can update own notifications"
  ON public."UserNotifications"
  FOR UPDATE
  USING (auth.uid() = "UserId")
  WITH CHECK (auth.uid() = "UserId");

COMMENT ON TABLE public."UserNotifications" IS 'User notifications and alerts';


-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to auto-update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."UpdatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply UpdatedAt triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public."UserProfiles"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_prefs_updated_at
  BEFORE UPDATE ON public."UserBuyerPreferences"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_listings_updated_at
  BEFORE UPDATE ON public."UserSavedListings"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON public."UserSavedSearches"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================================

-- Function to auto-create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."UserProfiles" ("Id", "Email", "FirstName", "LastName", "LastLoginAt")
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    NEW.last_sign_in_at
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- HELPER FUNCTIONS (OPTIONAL)
-- ============================================================================

-- Get user's liked listing count
CREATE OR REPLACE FUNCTION get_user_liked_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  liked_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO liked_count
  FROM public."UserLikedProperties"
  WHERE "UserId" = p_user_id;
  
  RETURN COALESCE(liked_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Get user's saved listings count
CREATE OR REPLACE FUNCTION get_user_saved_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  saved_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO saved_count
  FROM public."UserSavedListings"
  WHERE "UserId" = p_user_id;
  
  RETURN COALESCE(saved_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  notification_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO notification_count
  FROM public."UserNotifications"
  WHERE "UserId" = p_user_id AND "IsRead" = false;
  
  RETURN COALESCE(notification_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public."UserNotifications"
  SET "IsRead" = true, "ReadAt" = NOW()
  WHERE "Id" = p_notification_id AND "UserId" = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public."UserNotifications"
  SET "IsRead" = true, "ReadAt" = NOW()
  WHERE "UserId" = p_user_id AND "IsRead" = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ All tables dropped and recreated successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  1. UserProfiles';
  RAISE NOTICE '  2. UserBuyerPreferences';
  RAISE NOTICE '  3. UserLikedProperties';
  RAISE NOTICE '  4. UserSavedListings';
  RAISE NOTICE '  5. UserSavedSearches';
  RAISE NOTICE '  6. UserViewingHistory';
  RAISE NOTICE '  7. UserNotifications';
END $$;

