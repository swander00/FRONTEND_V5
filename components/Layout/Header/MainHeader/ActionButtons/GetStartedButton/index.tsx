'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Auth';
import { Button } from '@/components/ui/button';
import { SignUpModal, SignInModal } from '@/components/Auth';

export function GetStartedButton() {
  const { signIn } = useAuth();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSigningInDemo, setIsSigningInDemo] = useState(false);

  const handleDemoSignIn = async () => {
    try {
      setIsSigningInDemo(true);
      await signIn('demo@example.com', 'demo123');
    } catch (error) {
      console.error('Demo sign in error:', error);
    } finally {
      setIsSigningInDemo(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleDemoSignIn}
          disabled={isSigningInDemo}
          variant="outline"
          className="px-3 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          {isSigningInDemo ? 'Signing In...' : 'Demo Sign In'}
        </Button>
        <Button 
          onClick={() => setIsSignInOpen(true)}
          variant="outline"
          className="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => setIsSignUpOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Get Started
        </Button>
      </div>
      
      <SignInModal
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
      
      <SignUpModal
        open={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}