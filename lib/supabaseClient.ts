/**
 * Supabase Client Configuration
 * 
 * This file establishes the connection to Supabase using environment variables.
 * The connection is ready to use but no field mappings have been implemented yet.
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

/**
 * Supabase client instance
 * Use this client for all database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ============================================================================
// DATABASE TYPES (To be defined based on your Supabase schema)
// ============================================================================

/**
 * TODO: Define your Supabase database types here
 * 
 * Example:
 * export interface SupabaseProperty {
 *   id: string;
 *   listing_key: string;
 *   // ... add your database field names here
 * }
 */

export interface SupabaseProperty {
  // Add your Supabase database field names here
  // These will be mapped to the frontend Property type using the field mapper
  [key: string]: any;
}

export interface SupabaseMedia {
  // Add your Supabase media table field names here
  [key: string]: any;
}

// ============================================================================
// TABLE NAMES
// ============================================================================

/**
 * TODO: Update these with your actual Supabase table names
 */
export const TABLES = {
  PROPERTIES: 'properties',           // TODO: Update with your actual table name
  MEDIA: 'media',                     // TODO: Update with your actual table name
  ROOMS: 'rooms',                     // TODO: Update with your actual table name
  BASEMENTS: 'basements',             // TODO: Update with your actual table name
  UTILITIES: 'utilities',             // TODO: Update with your actual table name
  USER_PROFILES: 'user_profiles',     // TODO: Update with your actual table name
  SAVED_SEARCHES: 'saved_searches',   // TODO: Update with your actual table name
  LIKED_LISTINGS: 'liked_listings',   // TODO: Update with your actual table name
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test the Supabase connection
 * Call this function to verify that the connection is working
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return { success: false, error };
    }

    console.log('✅ Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return { success: false, error };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
}

/**
 * Get the current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }
  
  return session;
}

// Export the client as default for convenience
export default supabase;

