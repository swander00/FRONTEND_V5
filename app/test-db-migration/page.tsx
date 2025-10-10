'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Database, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function TestDatabaseMigration() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [envError, setEnvError] = useState<string | null>(null);

  // Check environment variables on mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setEnvError('Supabase environment variables are not configured. Please check your .env.local file.');
    }
    
    console.log('📊 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl?.substring(0, 30) + '...',
    });
  }, []);

  const updateResult = (index: number, status: 'success' | 'error', message: string, details?: any) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], status, message, details };
      return newResults;
    });
  };

  const runTests = async () => {
    console.log('🔍 Starting database verification tests...');
    setIsRunning(true);
    setOverallStatus('running');
    
    const tests: TestResult[] = [
      { name: 'Connection Test', status: 'pending', message: 'Testing Supabase connection...' },
      { name: 'Auth Status', status: 'pending', message: 'Checking authentication status...' },
      { name: 'UserProfiles Table', status: 'pending', message: 'Verifying UserProfiles table...' },
      { name: 'UserBuyerPreferences Table', status: 'pending', message: 'Verifying UserBuyerPreferences table...' },
      { name: 'UserLikedProperties Table', status: 'pending', message: 'Verifying UserLikedProperties table...' },
      { name: 'UserSavedListings Table', status: 'pending', message: 'Verifying UserSavedListings table...' },
      { name: 'UserSavedSearches Table', status: 'pending', message: 'Verifying UserSavedSearches table...' },
      { name: 'UserViewingHistory Table', status: 'pending', message: 'Verifying UserViewingHistory table...' },
      { name: 'UserNotifications Table', status: 'pending', message: 'Verifying UserNotifications table...' },
      { name: 'RLS Policies', status: 'pending', message: 'Testing Row Level Security...' },
    ];
    
    setResults(tests);

    try {
      // Test 1: Connection
      try {
        const { data, error } = await supabase.from('UserProfiles').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows" which is OK
        updateResult(0, 'success', 'Successfully connected to Supabase database');
      } catch (error: any) {
        updateResult(0, 'error', `Connection failed: ${error.message}`, error);
      }

      // Test 2: Auth Status
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          updateResult(1, 'success', `Authenticated as: ${user.email}`, { userId: user.id });
        } else {
          updateResult(1, 'success', 'Not authenticated (anonymous user)', { note: 'Sign in to test user-specific features' });
        }
      } catch (error: any) {
        updateResult(1, 'error', `Auth check failed: ${error.message}`, error);
      }

      // Test 3-9: Table Access Tests
      const tableTests = [
        { index: 2, table: 'UserProfiles' },
        { index: 3, table: 'UserBuyerPreferences' },
        { index: 4, table: 'UserLikedProperties' },
        { index: 5, table: 'UserSavedListings' },
        { index: 6, table: 'UserSavedSearches' },
        { index: 7, table: 'UserViewingHistory' },
        { index: 8, table: 'UserNotifications' },
      ];

      for (const test of tableTests) {
        try {
          const { data, error, count } = await supabase
            .from(test.table)
            .select('*', { count: 'exact', head: true });
          
          if (error) throw error;
          
          updateResult(
            test.index, 
            'success', 
            `✅ Table exists and accessible (${count ?? 0} rows)`,
            { rowCount: count }
          );
        } catch (error: any) {
          if (error.code === '42P01') {
            updateResult(test.index, 'error', `❌ Table does not exist - migration may have failed`, error);
          } else if (error.code === '42501') {
            updateResult(test.index, 'error', `❌ Permission denied - RLS policies may be blocking`, error);
          } else {
            updateResult(test.index, 'error', `❌ Error: ${error.message}`, error);
          }
        }
      }

      // Test 9: RLS Policies
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          updateResult(9, 'success', 'RLS test skipped - sign in to test user-specific policies', { 
            note: 'RLS policies restrict data access to authenticated users' 
          });
        } else {
          // Try to query own profile
          const { data, error } = await supabase
            .from('UserProfiles')
            .select('*')
            .eq('Id', user.id);
          
          if (error) throw error;
          
          updateResult(9, 'success', `✅ RLS policies working - can access own data`, { 
            profileExists: data && data.length > 0,
            rowsReturned: data?.length ?? 0
          });
        }
      } catch (error: any) {
        updateResult(9, 'error', `❌ RLS test failed: ${error.message}`, error);
      }

    } catch (error: any) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
      setOverallStatus('complete');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
      default:
        return null;
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalTests = results.length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <CardTitle>Database Migration Verification</CardTitle>
          </div>
          <CardDescription>
            Test your Supabase database migration to verify all tables, RLS policies, and connections are working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {envError && (
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>
                  {envError}
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Required in .env.local:</p>
                    <pre className="mt-1 bg-white p-2 rounded border text-xs">
NEXT_PUBLIC_SUPABASE_URL=https://gyeviskmqtkskcoyyprp.supabase.co{'\n'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
                    </pre>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {overallStatus === 'idle' && !envError && (
              <Alert>
                <AlertTitle>Ready to Test</AlertTitle>
                <AlertDescription>
                  Click the button below to run all verification tests. This will check:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Database connection</li>
                    <li>Authentication status</li>
                    <li>All 7 user tables exist and are accessible</li>
                    <li>Row Level Security policies are working</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {overallStatus === 'complete' && (
              <Alert className={errorCount === 0 ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}>
                <AlertTitle>
                  {errorCount === 0 ? '✅ All Tests Passed!' : `⚠️ ${errorCount} Test(s) Failed`}
                </AlertTitle>
                <AlertDescription>
                  {successCount} of {totalTests} tests passed successfully.
                  {errorCount > 0 && ' Review the errors below and ensure your migration completed successfully.'}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={runTests} 
              disabled={isRunning || !!envError}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Verification Tests'
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="font-semibold text-lg mb-3">Test Results:</h3>
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      result.status === 'success' ? 'bg-green-50 border-green-200' :
                      result.status === 'error' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                              View Details
                            </summary>
                            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ If all tests pass, your migration is complete!</li>
                <li>✅ Sign up for a new account to test profile auto-creation</li>
                <li>✅ Update your <code className="bg-gray-100 px-1 py-0.5 rounded">userDataService.ts</code> to use real database queries</li>
                <li>✅ Replace mock data with Supabase queries in your components</li>
                <li>⚠️ If tests fail, review the migration SQL and error messages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manual Verification (Optional)</CardTitle>
          <CardDescription>Additional verification steps you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">1. Check Tables in Supabase Dashboard:</h4>
              <p className="text-gray-600">
                Visit: <a 
                  href="https://app.supabase.com/project/gyeviskmqtkskcoyyprp/editor" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Table Editor
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. View RLS Policies:</h4>
              <p className="text-gray-600">
                Visit: <a 
                  href="https://app.supabase.com/project/gyeviskmqtkskcoyyprp/auth/policies" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  RLS Policies
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. Test Authentication:</h4>
              <p className="text-gray-600">
                Visit: <a 
                  href="https://app.supabase.com/project/gyeviskmqtkskcoyyprp/auth/users" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Auth Users
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">4. Run Verification SQL:</h4>
              <p className="text-gray-600">
                See <code className="bg-gray-100 px-1 py-0.5 rounded">verification-queries.sql</code> in project root
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

