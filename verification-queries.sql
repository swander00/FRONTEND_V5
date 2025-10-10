-- ============================================================================
-- SUPABASE MIGRATION VERIFICATION QUERIES
-- ============================================================================
-- Run these queries AFTER the migration to verify success
-- Run each section separately for clearest results
-- ============================================================================

-- ============================================================================
-- 1. VERIFY ALL TABLES EXIST
-- ============================================================================
-- Expected: 7 rows showing User tables with their column counts

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE 'User%'
ORDER BY table_name;

-- Expected results:
-- UserBuyerPreferences (7 columns)
-- UserLikedProperties (6 columns)
-- UserNotifications (8 columns)
-- UserProfiles (9 columns)
-- UserSavedListings (8 columns)
-- UserSavedSearches (10 columns)
-- UserViewingHistory (6 columns)


-- ============================================================================
-- 2. VERIFY ROW LEVEL SECURITY IS ENABLED
-- ============================================================================
-- Expected: All 7 tables should return 't' (true) for RLS enabled

SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename LIKE 'User%'
ORDER BY tablename;


-- ============================================================================
-- 3. VERIFY RLS POLICIES EXIST
-- ============================================================================
-- Expected: 24 policies total across all tables

SELECT 
  tablename, 
  policyname,
  cmd as operation,
  permissive
FROM pg_policies
WHERE tablename LIKE 'User%'
ORDER BY tablename, policyname;

-- Count policies
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE tablename LIKE 'User%';


-- ============================================================================
-- 4. VERIFY INDEXES EXIST
-- ============================================================================
-- Expected: 20+ indexes including primary keys

SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename LIKE 'User%'
ORDER BY tablename, indexname;

-- Count indexes
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename LIKE 'User%';


-- ============================================================================
-- 5. VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Expected: Foreign keys to auth.users and Property table

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name LIKE 'User%'
ORDER BY tc.table_name, kcu.column_name;


-- ============================================================================
-- 6. VERIFY TRIGGERS EXIST
-- ============================================================================
-- Expected: 5 update triggers + 1 auto-profile creation trigger

SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event_type,
  action_statement
FROM information_schema.triggers
WHERE event_object_table LIKE 'User%'
  OR (event_object_schema = 'auth' AND event_object_table = 'users')
ORDER BY event_object_table, trigger_name;


-- ============================================================================
-- 7. VERIFY HELPER FUNCTIONS EXIST
-- ============================================================================
-- Expected: 4 functions (update_updated_at_column, create_user_profile, 
--           get_user_liked_listings, mark_notification_read, get_unread_notification_count)

SELECT 
  routine_name as function_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%user%' OR routine_name LIKE '%notification%')
ORDER BY routine_name;


-- ============================================================================
-- 8. TEST TABLE STRUCTURE DETAILS
-- ============================================================================
-- Run for each table to see detailed column information

-- UserProfiles structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'UserProfiles'
ORDER BY ordinal_position;

-- UserLikedProperties structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'UserLikedProperties'
ORDER BY ordinal_position;


-- ============================================================================
-- 9. CHECK IF PROPERTY TABLE EXISTS (REQUIRED FOR FOREIGN KEYS)
-- ============================================================================
-- Expected: Should return 1 row if Property table exists

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = 'Property') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'Property';

-- If Property table doesn't exist, you may see foreign key errors


-- ============================================================================
-- 10. COMPREHENSIVE HEALTH CHECK
-- ============================================================================
-- All-in-one verification query

SELECT 
  'Tables Created' as check_type,
  COUNT(*)::TEXT as result,
  '7 expected' as expected
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'User%'

UNION ALL

SELECT 
  'RLS Enabled',
  COUNT(*)::TEXT,
  '7 expected'
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'User%' AND rowsecurity = true

UNION ALL

SELECT 
  'RLS Policies',
  COUNT(*)::TEXT,
  '24 expected'
FROM pg_policies
WHERE tablename LIKE 'User%'

UNION ALL

SELECT 
  'Indexes Created',
  COUNT(*)::TEXT,
  '20+ expected'
FROM pg_indexes
WHERE schemaname = 'public' AND tablename LIKE 'User%'

UNION ALL

SELECT 
  'Triggers Created',
  COUNT(*)::TEXT,
  '6 expected'
FROM information_schema.triggers
WHERE event_object_table LIKE 'User%'
   OR (event_object_schema = 'auth' AND event_object_table = 'users' AND trigger_name = 'on_auth_user_created');


-- ============================================================================
-- SUCCESS INDICATOR
-- ============================================================================
-- If all checks pass, migration was successful! 🎉

