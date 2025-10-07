'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate auth callback processing
    const processCallback = async () => {
      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to home page after successful auth
        router.push('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        // Redirect to home page even on error
        router.push('/');
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Processing Authentication</h1>
        <p className="text-gray-600">Please wait while we complete your sign-in...</p>
      </div>
    </div>
  );
} 