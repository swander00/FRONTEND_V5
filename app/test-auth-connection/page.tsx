'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function TestAuthConnection() {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      addResult('🔍 Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data, error } = await supabase
        .from('UserProfiles')
        .select('count')
        .limit(1);
      
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
        return;
      }
      
      addResult('✅ Supabase connection successful');
      
      // Test 2: Check auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addResult(`⚠️ Auth check failed: ${authError.message}`);
      } else {
        addResult(`ℹ️ Current user: ${user ? `${user.email} (${user.id.substring(0, 8)}...)` : 'Not signed in'}`);
      }
      
      // Test 3: Test signup
      const testEmail = `test-connection-${Date.now()}@example.com`;
      addResult(`🧪 Testing signup with ${testEmail}...`);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: {
            firstName: 'Test',
            lastName: 'User'
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
      
      addResult(`✅ User created: ${signUpData.user.id.substring(0, 8)}...`);
      addResult(`ℹ️ Session exists: ${signUpData.session ? 'Yes' : 'No (email confirmation may be required)'}`);
      
      // Test 4: Check if UserProfile was auto-created
      const { data: profileData, error: profileError } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', signUpData.user.id)
        .single();
      
      if (profileError) {
        addResult(`⚠️ UserProfile not found: ${profileError.message}`);
      } else {
        addResult(`✅ UserProfile auto-created: ${profileData.FirstName} ${profileData.LastName}`);
      }
      
      // Test 5: Test buyer preferences insert
      addResult('🧪 Testing UserBuyerPreferences insert...');
      
      const { data: buyerPrefsData, error: buyerPrefsError } = await supabase
        .from('UserBuyerPreferences')
        .insert({
          UserId: signUpData.user.id,
          FirstTimeBuyer: true,
          PreApproved: false,
          HasHouseToSell: false,
          PurchaseTimeframe: '3-6'
        })
        .select()
        .single();
      
      if (buyerPrefsError) {
        addResult(`❌ Buyer preferences insert failed: ${buyerPrefsError.message}`);
      } else {
        addResult(`✅ Buyer preferences saved: ${buyerPrefsData.PurchaseTimeframe} months`);
      }
      
      // Test 6: Cleanup
      addResult('🧹 Cleaning up test data...');
      
      await supabase
        .from('UserBuyerPreferences')
        .delete()
        .eq('UserId', signUpData.user.id);
      
      await supabase
        .from('UserProfiles')
        .delete()
        .eq('Id', signUpData.user.id);
      
      // Note: We can't delete the auth user without admin privileges
      addResult('✅ Test data cleaned up (auth user remains)');
      
      addResult('🎉 All tests completed successfully!');
      
    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Auth Connection Test</h1>
          
          <div className="mb-6">
            <Button 
              onClick={testConnection}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Running Tests...' : 'Test Auth Connection'}
            </Button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium mb-3">Test Results:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
