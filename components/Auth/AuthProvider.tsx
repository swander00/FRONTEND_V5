'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { BuyerProfileModal } from '@/components/Auth/Profiles/BuyerProfileModal';
// Note: User profile functions removed since user_profiles table doesn't exist yet

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
  completeSignUp: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuyerProfileModalState, setShowBuyerProfileModalState] = useState(false);

  const showBuyerProfileModal = () => {
    console.log('Showing buyer profile modal directly');
    setShowBuyerProfileModalState(true);
  };

  const signOut = () => {
    console.log('Signing out user');
    setUser(null);
    localStorage.removeItem('mock-auth-user');
    sessionStorage.removeItem('mock-auth-user');
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const mockUser: User = {
          id: 'mock-user-123',
          email: email,
          name: 'Demo User',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        
        setUser(mockUser);
        localStorage.setItem('mock-auth-user', 'authenticated');
        console.log('Mock user signed in:', mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signUp = async (userData: { firstName: string; lastName: string; email: string; phone?: string; password: string }): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (userData.email && userData.password) {
        console.log('Mock user account created (but not signed in yet):', userData.email);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
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
      console.log('🔧 completeSignUp called with:', userData);
      console.log('⚠️ Note: User profile database functions disabled - user_profiles table not available yet');
      
      // Create user object for frontend state (mock mode)
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      setUser(newUser);
      localStorage.setItem('mock-auth-user', 'authenticated');
      console.log('✅ User created and signed in (mock mode):', newUser);
      console.log('📝 Buyer profile data (not saved to DB yet):', userData.buyerProfile);
      
      return true;
    } catch (error) {
      console.error('❌ Complete sign up error:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUser: User = {
          id: 'mock-user-123',
          email: 'demo@example.com',
          name: 'Demo User',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        
        setUser(mockUser);
        console.log('Mock user authenticated:', mockUser);
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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