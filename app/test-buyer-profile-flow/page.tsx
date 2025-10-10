'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestBuyerProfileFlowPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testSignInFlow = async () => {
    if (!email || !password) {
      addResult('❌ Please fill in email and password');
      return;
    }

    clearResults();
    addResult('🚀 Testing sign in flow...');

    try {
      // Step 1: Sign in
      addResult('🔐 Attempting sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        addResult(`❌ Sign in failed: ${signInError.message}`);
        return;
      }

      if (!signInData.user) {
        addResult('❌ No user returned from sign in');
        return;
      }

      addResult(`✅ Signed in successfully: ${signInData.user.email}`);
      addResult(`🆔 User ID: ${signInData.user.id}`);

      // Step 2: Check user profile
      addResult('📋 Checking user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', signInData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        addResult(`❌ Error loading profile: ${profileError.message}`);
      } else if (profile) {
        addResult(`✅ User profile found: ${profile.FirstName} ${profile.LastName}`);
      } else {
        addResult('⚠️ No user profile found');
      }

      // Step 3: Check buyer preferences
      addResult('💼 Checking buyer preferences...');
      const { data: buyerPrefs, error: buyerPrefsError } = await supabase
        .from('UserBuyerPreferences')
        .select('*')
        .eq('UserId', signInData.user.id)
        .single();

      if (buyerPrefsError && buyerPrefsError.code !== 'PGRST116') {
        addResult(`❌ Error loading buyer preferences: ${buyerPrefsError.message}`);
      } else if (buyerPrefs) {
        addResult('✅ Buyer preferences found:');
        addResult(`   - First time buyer: ${buyerPrefs.FirstTimeBuyer}`);
        addResult(`   - Pre-approved: ${buyerPrefs.PreApproved}`);
        addResult(`   - Has house to sell: ${buyerPrefs.HasHouseToSell}`);
        addResult(`   - Purchase timeframe: ${buyerPrefs.PurchaseTimeframe}`);
      } else {
        addResult('⚠️ No buyer preferences found - should show buyer profile modal');
      }

      // Step 4: Test buyer profile modal trigger
      addResult('🔄 Testing buyer profile modal trigger...');
      if (!buyerPrefs) {
        addResult('✅ Buyer profile modal should appear automatically');
        addResult('💡 This happens because no buyer preferences were found');
      } else {
        addResult('ℹ️ Buyer profile modal will not appear (preferences already exist)');
      }

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    }
  };

  const testCreateBuyerProfile = async () => {
    if (!email || !password) {
      addResult('❌ Please sign in first');
      return;
    }

    addResult('💾 Testing buyer profile creation...');

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        addResult('❌ No authenticated user found');
        return;
      }

      addResult(`👤 Using user: ${user.id}`);

      // Create buyer preferences
      const { error } = await supabase
        .from('UserBuyerPreferences')
        .upsert({
          UserId: user.id,
          FirstTimeBuyer: true,
          PreApproved: false,
          HasHouseToSell: false,
          PurchaseTimeframe: '3-6',
        });

      if (error) {
        addResult(`❌ Error creating buyer profile: ${error.message}`);
      } else {
        addResult('✅ Buyer profile created successfully');
        addResult('🔄 Now try signing in again - modal should not appear');
      }
    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    addResult('🚪 Signed out');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Buyer Profile Flow Test</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
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

          <div className="flex gap-4">
            <Button 
              onClick={testSignInFlow}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Test Sign In Flow
            </Button>
            <Button 
              onClick={testCreateBuyerProfile}
              variant="outline"
              className="flex-1"
            >
              Create Buyer Profile
            </Button>
            <Button 
              onClick={signOut}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
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
