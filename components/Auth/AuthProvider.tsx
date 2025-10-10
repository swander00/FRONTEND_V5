'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BuyerProfileModal } from '@/components/Auth/Profiles/BuyerProfileModal';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  showBuyerProfileModal: () => void;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  completeSignUp: (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone?: string;
    password: string;
    buyerProfile?: {
      firstTimeBuyer: boolean | null;
      preApproved: boolean | null;
      hasHouseToSell: boolean | null;
      purchaseTimeframe: '0-3' | '3-6' | '6-12' | '12+' | null;
    };
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  showBuyerProfileModal: () => {},
  signOut: () => {},
  signIn: async () => false,
  signUp: async () => false,
  signInWithGoogle: async () => false,
  completeSignUp: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuyerProfileModalState, setShowBuyerProfileModalState] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile from UserProfiles table
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('📋 Loading user profile for:', supabaseUser.id);
      
      // Query UserProfiles table
      const { data: profile, error } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ Error loading profile:', error);
      }

      // Create user object for frontend
      const frontendUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile ? `${profile.FirstName || ''} ${profile.LastName || ''}`.trim() : undefined,
        avatar_url: profile?.AvatarUrl || supabaseUser.user_metadata?.avatar_url || undefined,
      };

      setUser(frontendUser);
      setUserProfile(profile);
      
      // If no profile exists, create one with Google data
      if (!profile && supabaseUser.user_metadata) {
        try {
          console.log('📋 Creating profile with Google data...');
          const { error: insertError } = await supabase
            .from('UserProfiles')
            .insert({
              Id: supabaseUser.id,
              Email: supabaseUser.email,
              FirstName: supabaseUser.user_metadata.first_name || supabaseUser.user_metadata.given_name,
              LastName: supabaseUser.user_metadata.last_name || supabaseUser.user_metadata.family_name,
              AvatarUrl: supabaseUser.user_metadata.avatar_url,
            });

          if (insertError) {
            console.error('❌ Error creating profile:', insertError);
          } else {
            console.log('✅ Profile created with Google data');
            // Update the frontend user with the new profile data
            const updatedUser: User = {
              ...frontendUser,
              name: `${supabaseUser.user_metadata.first_name || ''} ${supabaseUser.user_metadata.last_name || ''}`.trim(),
              avatar_url: supabaseUser.user_metadata.avatar_url,
            };
            setUser(updatedUser);
          }
        } catch (error) {
          console.error('❌ Error creating profile:', error);
        }
      }

      // Check if user has buyer preferences (only if profile exists)
      if (profile) {
        try {
          const { data: buyerPrefs, error: buyerPrefsError } = await supabase
            .from('UserBuyerPreferences')
            .select('*')
            .eq('UserId', supabaseUser.id)
            .single();

          if (buyerPrefsError && buyerPrefsError.code !== 'PGRST116') {
            console.error('❌ Error checking buyer preferences:', buyerPrefsError);
          }

          if (!buyerPrefs) {
            console.log('📋 No buyer preferences found - showing profile modal');
            // Show buyer profile modal after a short delay to allow UI to settle
            setTimeout(() => {
              showBuyerProfileModal();
            }, 1000);
          } else {
            console.log('✅ Buyer preferences found');
          }
        } catch (error) {
          console.error('❌ Error checking buyer preferences:', error);
        }
      } else {
        console.log('⚠️ No user profile found - user may need to complete signup');
        // If no profile exists, we might want to show the buyer profile modal anyway
        // This handles the case where someone signs in but their profile wasn't created properly
        setTimeout(() => {
          showBuyerProfileModal();
        }, 1000);
      }
      
      console.log('✅ User profile loaded:', {
        user: frontendUser,
        profile: profile ? 'exists' : 'not found'
      });
      
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Still set basic user info even if profile fails
      const frontendUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
      };
      setUser(frontendUser);
    }
  };

  const showBuyerProfileModal = () => {
    console.log('Showing buyer profile modal directly');
    setShowBuyerProfileModalState(true);
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        setUser(null);
        setUserProfile(null);
        console.log('✅ User signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Sign in successful');
        // Load user profile after successful auth
        await loadUserProfile(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return false;
    }
  };

  const signUp = async (userData: { firstName: string; lastName: string; email: string; phone?: string; password: string }): Promise<boolean> => {
    try {
      console.log('📝 Attempting sign up with:', userData.email);
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error.message);
        // Check if it's a duplicate user error
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Sign up successful - user created in auth.users');
        console.log('📋 UserProfiles will be auto-created by trigger');
        
        // Check if email confirmation is required
        if (!data.session) {
          console.log('📧 Email confirmation required - user needs to verify email');
          // Even without a session, return true since the user was created
          // The UI should handle the email confirmation flow
        } else {
          console.log('✅ Session created - user can proceed immediately');
          // Load user profile if we have a session
          await loadUserProfile(data.user);
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      console.log('🔐 Attempting Google sign in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        console.error('❌ Google sign in error:', error.message);
        return false;
      }

      console.log('✅ Google OAuth initiated');
      return true;
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      return false;
    }
  };

  const completeSignUp = async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone?: string;
    password: string;
    buyerProfile?: {
      firstTimeBuyer: boolean | null;
      preApproved: boolean | null;
      hasHouseToSell: boolean | null;
      purchaseTimeframe: '0-3' | '3-6' | '6-12' | '12+' | null;
    };
  }): Promise<boolean> => {
    try {
      console.log('🔧 completeSignUp called - completing profile setup');
      
      // First, try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      let currentUser = session?.user;
      let isSignedIn = !!session;

      // If no session exists, try to sign in
      if (!session) {
        console.log('🔄 No session found, attempting to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        });

        if (signInData?.user && !signInError) {
          currentUser = signInData.user;
          isSignedIn = true;
          console.log('✅ Sign in successful');
        } else {
          console.log('⚠️ Could not sign in - email confirmation may be required');
          console.error('Sign in error:', signInError?.message);
          
          // If email confirmation is required, we can still save the buyer profile
          // by creating it without authentication (this requires the user to exist)
          if (signInError?.message?.includes('email') || signInError?.message?.includes('confirm')) {
            console.log('📧 Email confirmation required - saving buyer profile anyway');
            
            // Try to get the user ID from the auth system (this might work even without session)
            try {
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              if (user && !userError) {
                currentUser = user;
                console.log('✅ Got user without session:', user.id);
              }
            } catch (error) {
              console.log('⚠️ Could not get user without session');
            }
          } else {
            // Other authentication errors
            throw new Error('Authentication failed: ' + signInError?.message);
          }
        }
      }

      if (!currentUser) {
        console.error('❌ No user found - cannot complete setup');
        throw new Error('User not found. Please try signing up again.');
      }

      console.log('✅ User found:', currentUser.id);

      // Update the user profile with additional information (only if we have a session)
      if (isSignedIn) {
        try {
          console.log('💾 Updating user profile...');
          const { error: profileError } = await supabase
            .from('UserProfiles')
            .update({
              FirstName: userData.firstName,
              LastName: userData.lastName,
              Phone: userData.phone || null,
            })
            .eq('Id', currentUser.id);

          if (profileError) {
            console.error('⚠️ Error updating profile:', profileError);
            // Continue anyway - profile might not exist yet
          } else {
            console.log('✅ User profile updated');
          }
        } catch (error) {
          console.error('⚠️ Error updating user profile:', error);
          // Continue anyway
        }
      }

      // Save buyer profile if provided
      if (userData.buyerProfile && currentUser.id) {
        try {
          console.log('💾 Saving buyer profile data...');
          const { error } = await supabase
            .from('UserBuyerPreferences')
            .insert({
              UserId: currentUser.id,
              FirstTimeBuyer: userData.buyerProfile.firstTimeBuyer,
              PreApproved: userData.buyerProfile.preApproved,
              HasHouseToSell: userData.buyerProfile.hasHouseToSell,
              PurchaseTimeframe: userData.buyerProfile.purchaseTimeframe,
            });

          if (error) {
            console.error('❌ Error saving buyer profile:', error);
            // Don't fail the entire process if buyer profile save fails
            console.log('⚠️ Buyer profile save failed, but continuing...');
          } else {
            console.log('✅ Buyer profile saved successfully');
          }
        } catch (error) {
          console.error('❌ Error saving buyer profile:', error);
          // Don't fail the entire process if buyer profile save fails
        }
      }

      // Load the user profile for the frontend if user is signed in
      if (isSignedIn && currentUser) {
        await loadUserProfile(currentUser);
      }
      
      console.log('✅ Complete sign up successful');
      return true;
    } catch (error: any) {
      console.error('❌ Complete sign up error:', error);
      throw error; // Re-throw to let the UI handle the specific error
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const checkInitialSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error checking session:', error);
        } else if (session?.user) {
          console.log('✅ Found existing session');
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ No existing session found');
        }
      } catch (error) {
        console.error('❌ Error in initial auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session ? 'with session' : 'no session');
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        console.log('🚪 User signed out - clearing state');
        setUser(null);
        setUserProfile(null);
      } else if (session?.user) {
        console.log('👤 User signed in - loading profile');
        await loadUserProfile(session.user);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      showBuyerProfileModal,
      signOut,
      signIn,
      signUp,
      signInWithGoogle,
      completeSignUp,
    }}>
      {children}
      {user && (
        <BuyerProfileModal
          open={showBuyerProfileModalState}
          onClose={() => {
            setShowBuyerProfileModalState(false);
          }}
          userId={user.id}
          onProfileComplete={() => {
            console.log('Profile completed, updating UI state');
            setShowBuyerProfileModalState(false);
          }}
        />
      )}
    </AuthContext.Provider>
  );
} 