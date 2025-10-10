'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestSignupDebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testSignupFlow = async () => {
    if (!email || !password || !firstName || !lastName) {
      addResult('❌ Please fill in all fields');
      return;
    }

    clearResults();
    addResult('🚀 Starting signup flow test...');

    try {
      // Step 1: Check environment
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addResult(`🔧 Environment check: ${supabaseUrl ? '✅ URL set' : '❌ URL missing'}`);
      addResult(`🔧 Key check: ${supabaseKey ? '✅ Key set' : '❌ Key missing'}`);

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        addResult('❌ Supabase environment variables not configured properly');
        return;
      }

      // Step 2: Sign up
      addResult('📝 Attempting signup...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            firstName: firstName,
            lastName: lastName,
          }
        }
      });

      if (signUpError) {
        addResult(`❌ Signup failed: ${signUpError.message}`);
        return;
      }

      if (!signUpData.user) {
        addResult('❌ No user returned from signup');
        return;
      }

      addResult(`✅ User created: ${signUpData.user.id}`);
      addResult(`📧 Email confirmed: ${signUpData.user.email_confirmed_at ? 'Yes' : 'No'}`);
      addResult(`🔐 Session created: ${signUpData.session ? 'Yes' : 'No'}`);

      // Step 3: Check user profile creation
      addResult('📋 Checking user profile...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for trigger

      const { data: profileData, error: profileError } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', signUpData.user.id)
        .single();

      if (profileError) {
        addResult(`⚠️ Profile not found: ${profileError.message}`);
      } else {
        addResult(`✅ Profile found: ${profileData.FirstName} ${profileData.LastName}`);
      }

      // Step 4: Try to sign in
      addResult('🔐 Attempting sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        addResult(`⚠️ Sign in failed: ${signInError.message}`);
        addResult('💡 This is expected if email confirmation is required');
      } else {
        addResult('✅ Sign in successful');
        addResult(`🔐 Session active: ${signInData.session ? 'Yes' : 'No'}`);
      }

      // Step 5: Test buyer preferences
      if (signInData?.session) {
        addResult('💾 Testing buyer preferences...');
        const { error: buyerError } = await supabase
          .from('UserBuyerPreferences')
          .insert({
            UserId: signUpData.user.id,
            FirstTimeBuyer: true,
            PreApproved: false,
            HasHouseToSell: false,
            PurchaseTimeframe: '3-6' as const,
          });

        if (buyerError) {
          addResult(`❌ Buyer preferences failed: ${buyerError.message}`);
        } else {
          addResult('✅ Buyer preferences saved');
        }
      } else {
        addResult('⚠️ Skipping buyer preferences - no session');
      }

      // Cleanup
      addResult('🧹 Signing out...');
      await supabase.auth.signOut();
      addResult('✅ Test completed');

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Signup Flow Debug Test</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>

          <Button 
            onClick={testSignupFlow}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Run Signup Flow Test
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-gray-500 text-center py-8">No results yet. Run a test to see output.</p>
          )}
        </div>
      </div>
    </div>
  );
}
