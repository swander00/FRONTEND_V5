'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        setStatus('Processing authentication...');
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        if (data.session) {
          console.log('✅ OAuth callback successful');
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => router.push('/'), 1500);
        } else {
          console.log('❌ No session found in callback');
          setStatus('No authentication session found. Redirecting...');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Processing Authentication</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
} 