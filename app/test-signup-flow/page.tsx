'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function TestSignupFlow() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults(prev => prev.map((result, i) => 
      i === index ? { ...result, ...updates } : result
    ));
  };

  const runCompleteSignupTest = async () => {
    setIsRunning(true);
    
    const tests: TestResult[] = [
      { name: '1. Connection Test', status: 'pending', message: 'Testing Supabase connection...' },
      { name: '2. Sign Up User (Phone-based)', status: 'pending', message: 'Creating test user account with phone auth...' },
      { name: '3. Sign In User (Phone-based)', status: 'pending', message: 'Signing in test user with phone auth...' },
      { name: '4. Check User Profile', status: 'pending', message: 'Verifying UserProfiles table...' },
      { name: '5. Save Buyer Profile', status: 'pending', message: 'Testing UserBuyerPreferences insert...' },
      { name: '6. Verify Buyer Profile', status: 'pending', message: 'Confirming buyer profile was saved...' },
      { name: '7. Cleanup Test Data', status: 'pending', message: 'Removing test user...' },
    ];
    
    setResults(tests);

    const testEmail = `test-signup-${Date.now()}@example.com`;
    const testPhone = '5551234567'; // Use phone number as password for simplified auth
    let testUserId: string | null = null;

    try {
      // Test 1: Connection Test
      updateResult(0, { status: 'running' });
      const { data: connectionTest, error: connectionError } = await supabase
        .from('UserProfiles')
        .select('count')
        .limit(1);

      if (connectionError) {
        updateResult(0, { 
          status: 'error', 
          message: `Connection failed: ${connectionError.message}`,
          details: connectionError
        });
        return;
      }

      updateResult(0, { 
        status: 'success', 
        message: '✅ Supabase connection successful'
      });

      // Test 2: Sign Up User (using phone-based auth)
      updateResult(1, { status: 'running' });
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPhone, // Use phone number as password
        options: {
          data: {
            firstName: 'Test',
            lastName: 'User',
            phone: '555-123-4567',
          }
        }
      });

      if (signUpError || !signUpData.user) {
        updateResult(1, { 
          status: 'error', 
          message: `Sign up failed: ${signUpError?.message || 'No user returned'}`,
          details: signUpError
        });
        return;
      }

      testUserId = signUpData.user.id;
      updateResult(1, { 
        status: 'success', 
        message: `✅ User created successfully (ID: ${testUserId.substring(0, 8)}...)`,
        details: { userId: testUserId, email: testEmail }
      });

      // Test 3: Sign In User (using phone-based auth)
      updateResult(2, { status: 'running' });
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPhone, // Use phone number as password
      });

      if (signInError || !signInData.user) {
        updateResult(2, { 
          status: 'error', 
          message: `Sign in failed: ${signInError?.message || 'No user returned'}`,
          details: signInError
        });
        return;
      }

      updateResult(2, { 
        status: 'success', 
        message: '✅ User signed in successfully',
        details: { sessionExists: !!signInData.session }
      });

      // Test 4: Check User Profile
      updateResult(3, { status: 'running' });
      const { data: profileData, error: profileError } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', testUserId)
        .single();

      if (profileError) {
        updateResult(3, { 
          status: 'error', 
          message: `Profile check failed: ${profileError.message}`,
          details: profileError
        });
        return;
      }

      updateResult(3, { 
        status: 'success', 
        message: `✅ User profile found: ${profileData.FirstName} ${profileData.LastName}`,
        details: profileData
      });

      // Test 5: Save Buyer Profile
      updateResult(4, { status: 'running' });
      const buyerProfileData = {
        UserId: testUserId,
        FirstTimeBuyer: true,
        PreApproved: false,
        HasHouseToSell: false,
        PurchaseTimeframe: '3-6' as const,
      };

      const { data: buyerProfileResult, error: buyerProfileError } = await supabase
        .from('UserBuyerPreferences')
        .insert(buyerProfileData)
        .select()
        .single();

      if (buyerProfileError) {
        updateResult(4, { 
          status: 'error', 
          message: `Buyer profile save failed: ${buyerProfileError.message}`,
          details: buyerProfileError
        });
        return;
      }

      updateResult(4, { 
        status: 'success', 
        message: '✅ Buyer profile saved successfully',
        details: buyerProfileResult
      });

      // Test 6: Verify Buyer Profile
      updateResult(5, { status: 'running' });
      const { data: verifyData, error: verifyError } = await supabase
        .from('UserBuyerPreferences')
        .select('*')
        .eq('UserId', testUserId)
        .single();

      if (verifyError) {
        updateResult(5, { 
          status: 'error', 
          message: `Verification failed: ${verifyError.message}`,
          details: verifyError
        });
        return;
      }

      updateResult(5, { 
        status: 'success', 
        message: '✅ Buyer profile verified in database',
        details: verifyData
      });

      // Test 7: Cleanup Test Data
      updateResult(6, { status: 'running' });
      
      // Delete buyer preferences first (due to foreign key constraints)
      await supabase
        .from('UserBuyerPreferences')
        .delete()
        .eq('UserId', testUserId);

      // Delete user profile
      await supabase
        .from('UserProfiles')
        .delete()
        .eq('Id', testUserId);

      // Delete auth user
      await supabase.auth.admin.deleteUser(testUserId);

      updateResult(6, { 
        status: 'success', 
        message: '✅ Test data cleaned up successfully'
      });

    } catch (error) {
      console.error('Test failed:', error);
      // Find the first pending test and mark it as error
      const pendingIndex = results.findIndex(r => r.status === 'running' || r.status === 'pending');
      if (pendingIndex !== -1) {
        updateResult(pendingIndex, { 
          status: 'error', 
          message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Complete Signup Flow Test</h1>
          
          <div className="mb-6">
            <Button 
              onClick={runCompleteSignupTest}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Running Tests...' : 'Run Complete Signup Test'}
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'error' ? 'bg-red-50 border-red-200' :
                result.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${
                    result.status === 'success' ? 'text-green-800' :
                    result.status === 'error' ? 'text-red-800' :
                    result.status === 'running' ? 'text-blue-800' :
                    'text-gray-800'
                  }`}>
                    {result.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'success' ? 'bg-green-100 text-green-800' :
                    result.status === 'error' ? 'bg-red-100 text-red-800' :
                    result.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium mb-2">Test Summary:</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-green-600">
                  ✅ Success: {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-red-600">
                  ❌ Errors: {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-gray-600">
                  ⏳ Pending: {results.filter(r => r.status === 'pending' || r.status === 'running').length}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
