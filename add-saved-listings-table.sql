-- ============================================================================
-- OPTIONAL: Add UserSavedListings Table
-- ============================================================================
-- This adds a separate "Saved Listings" table distinct from "Liked Properties"
-- 
-- Use Case:
-- - UserLikedProperties: Quick "heart" button for favorites
-- - UserSavedListings: Detailed saves with personal notes and tags
--
-- Only run this if you want the notes/tags feature!
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

-- Indexes
CREATE INDEX idx_saved_listings_user_id ON public."UserSavedListings"("UserId");
CREATE INDEX idx_saved_listings_mls_number ON public."UserSavedListings"("MlsNumber");
CREATE INDEX idx_saved_listings_saved_at ON public."UserSavedListings"("SavedAt" DESC);
CREATE INDEX idx_saved_listings_tags ON public."UserSavedListings" USING GIN("Tags");

-- RLS Policies
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

-- Auto-update trigger
CREATE TRIGGER update_saved_listings_updated_at
  BEFORE UPDATE ON public."UserSavedListings"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public."UserSavedListings" IS 'Properties saved with notes and tags (separate from liked)';

-- Verify
SELECT 'UserSavedListings table created successfully!' as status;

