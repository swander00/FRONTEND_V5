'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TestResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function TestEmailSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults(prev => prev.map((result, i) => 
      i === index ? { ...result, ...updates } : result
    ));
  };

  const runEmailSignupTest = async () => {
    if (!email || !password || !firstName || !lastName) {
      alert('Please fill in all fields');
      return;
    }

    setIsRunning(true);
    
    const tests: TestResult[] = [
      { step: '1. Check Environment', status: 'pending', message: 'Checking Supabase configuration...' },
      { step: '2. Check Database Connection', status: 'pending', message: 'Testing database connection...' },
      { step: '3. Sign Up User', status: 'pending', message: 'Creating user account...' },
      { step: '4. Check User Profile', status: 'pending', message: 'Verifying UserProfiles auto-creation...' },
      { step: '5. Sign In User', status: 'pending', message: 'Testing sign in...' },
      { step: '6. Save Buyer Preferences', status: 'pending', message: 'Testing buyer preferences...' },
      { step: '7. Cleanup', status: 'pending', message: 'Cleaning up test data...' },
    ];
    
    setResults(tests);

    let testUserId: string | null = null;

    try {
      // Test 1: Check Environment
      updateResult(0, { status: 'running' });
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        updateResult(0, {
          status: 'error',
          message: '❌ Supabase environment variables not configured',
          details: { supabaseUrl, hasKey: !!supabaseKey }
        });
        setIsRunning(false);
        return;
      }
      
      updateResult(0, {
        status: 'success',
        message: '✅ Environment variables configured',
        details: { url: supabaseUrl }
      });

      // Test 2: Check Database Connection
      updateResult(1, { status: 'running' });
      const { error: connError } = await supabase
        .from('UserProfiles')
        .select('count')
        .limit(1);

      if (connError) {
        updateResult(1, {
          status: 'error',
          message: `❌ Database connection failed: ${connError.message}`,
          details: connError
        });
        setIsRunning(false);
        return;
      }

      updateResult(1, {
        status: 'success',
        message: '✅ Database connection successful'
      });

      // Test 3: Sign Up User
      updateResult(2, { status: 'running' });
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
        updateResult(2, {
          status: 'error',
          message: `❌ Sign up failed: ${signUpError.message}`,
          details: signUpError
        });
        setIsRunning(false);
        return;
      }

      if (!signUpData.user) {
        updateResult(2, {
          status: 'error',
          message: '❌ Sign up did not return user data',
          details: signUpData
        });
        setIsRunning(false);
        return;
      }

      testUserId = signUpData.user.id;
      const hasSession = !!signUpData.session;

      updateResult(2, {
        status: 'success',
        message: `✅ User created successfully${hasSession ? ' with session' : ' (email confirmation may be required)'}`,
        details: {
          userId: testUserId,
          email: signUpData.user.email,
          hasSession,
          emailConfirmed: signUpData.user.email_confirmed_at ? true : false
        }
      });

      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

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
          message: `❌ User profile not found: ${profileError.message}`,
          details: profileError
        });
      } else {
        updateResult(3, {
          status: 'success',
          message: `✅ User profile auto-created: ${profileData.FirstName} ${profileData.LastName}`,
          details: profileData
        });
      }

      // Test 5: Sign In User
      updateResult(4, { status: 'running' });
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        updateResult(4, {
          status: 'error',
          message: `⚠️ Sign in failed: ${signInError.message} (This is expected if email confirmation is required)`,
          details: signInError
        });
      } else if (signInData.user) {
        updateResult(4, {
          status: 'success',
          message: '✅ Sign in successful',
          details: { hasSession: !!signInData.session }
        });
      }

      // Test 6: Save Buyer Preferences (only if we have a session)
      updateResult(5, { status: 'running' });
      if (signInData?.session) {
        const { data: buyerPrefData, error: buyerPrefError } = await supabase
          .from('UserBuyerPreferences')
          .insert({
            UserId: testUserId,
            FirstTimeBuyer: true,
            PreApproved: false,
            HasHouseToSell: false,
            PurchaseTimeframe: '3-6' as const,
          })
          .select()
          .single();

        if (buyerPrefError) {
          updateResult(5, {
            status: 'error',
            message: `❌ Buyer preferences save failed: ${buyerPrefError.message}`,
            details: buyerPrefError
          });
        } else {
          updateResult(5, {
            status: 'success',
            message: '✅ Buyer preferences saved successfully',
            details: buyerPrefData
          });
        }
      } else {
        updateResult(5, {
          status: 'error',
          message: '⚠️ Skipped - no session available',
        });
      }

      // Test 7: Cleanup
      updateResult(6, { status: 'running' });
      
      // Sign out first
      await supabase.auth.signOut();

      // Note: Cleanup requires service role key or admin access
      updateResult(6, {
        status: 'success',
        message: '✅ Signed out. Note: Manual cleanup may be required for test user.',
        details: { userId: testUserId }
      });

    } catch (error: any) {
      console.error('Test failed:', error);
      const pendingIndex = results.findIndex(r => r.status === 'running' || r.status === 'pending');
      if (pendingIndex !== -1) {
        updateResult(pendingIndex, {
          status: 'error',
          message: `❌ Unexpected error: ${error.message || 'Unknown error'}`,
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Email Signup Flow Test</h1>
          
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
            onClick={runEmailSignupTest}
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Running Tests...' : 'Run Email Signup Test'}
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
                  {result.step}
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
  );
}

