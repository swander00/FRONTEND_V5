/**
 * Supabase Client Configuration
 * 
 * This file establishes the connection to Supabase using environment variables.
 * The connection is ready to use but no field mappings have been implemented yet.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase client instance (lazy initialization)
 * Use this client for all database operations
 */
function getSupabaseClient(): SupabaseClient {
  // During build time (SSR/SSG), return a placeholder to prevent errors
  if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    // Return a dummy client for build time
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      if (typeof window !== 'undefined') {
        console.warn('⚠️ Supabase environment variables not configured. Auth features will not work.');
      }
      // Return a dummy client that won't crash the app
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  
  return supabaseInstance;
}

/**
 * Supabase client instance (getter to enable lazy initialization)
 * Use this client for all database operations
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return (client as any)[prop];
  }
});

// ============================================================================
// UTILITY FUNCTIONS FOR AUTHENTICATION
// ============================================================================

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

