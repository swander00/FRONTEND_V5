'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  testBasicConnection,
  testFetchSingleProperty,
  testFetchMultipleProperties,
  testPropertyCount,
  testFieldMapping,
  testCompareRawAndMapped,
  runAllTests,
  quickTest
} from '@/lib/testSupabaseConnection';

export default function TestSupabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleTest = async (testFn: () => Promise<any>, testName: string) => {
    setIsLoading(true);
    setResults(null);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${testName}`);
    console.log('='.repeat(60));
    
    try {
      const result = await testFn();
      setResults(result);
    } catch (error) {
      console.error('Test error:', error);
      setResults({ success: false, error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Supabase Connection Test</h1>
        <p className="text-gray-600">
          Use these tests to verify your Supabase connection and field mappings.
          Check the browser console for detailed output.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Test</CardTitle>
            <CardDescription>
              Run a quick connection and mapping test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleTest(quickTest, 'Quick Test')}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Run Quick Test'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Test Suite</CardTitle>
            <CardDescription>
              Run all tests in sequence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleTest(runAllTests, 'Full Test Suite')}
              disabled={isLoading}
              className="w-full"
              variant="default"
            >
              {isLoading ? 'Testing...' : 'Run All Tests'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Individual Tests</CardTitle>
          <CardDescription>
            Run specific tests to debug individual components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button
              onClick={() => handleTest(testBasicConnection, 'Test 1: Basic Connection')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 1: Basic Connection
            </Button>
            
            <Button
              onClick={() => handleTest(testFetchSingleProperty, 'Test 2: Fetch Single Property')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 2: Fetch Single Property
            </Button>
            
            <Button
              onClick={() => handleTest(() => testFetchMultipleProperties(5), 'Test 3: Fetch Multiple Properties')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 3: Fetch Multiple Properties
            </Button>
            
            <Button
              onClick={() => handleTest(testPropertyCount, 'Test 4: Property Count')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 4: Property Count
            </Button>
            
            <Button
              onClick={() => handleTest(testFieldMapping, 'Test 5: Field Mapping')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 5: Field Mapping
            </Button>
            
            <Button
              onClick={() => handleTest(testCompareRawAndMapped, 'Test 6: Compare Raw and Mapped')}
              disabled={isLoading}
              variant="outline"
              className="justify-start"
            >
              Test 6: Compare Raw and Mapped Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              View detailed results in the browser console (F12)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
            
            {results.success !== undefined && (
              <div className={`mt-4 p-4 rounded-md ${results.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{results.success ? '✅' : '❌'}</span>
                  <span className="font-semibold">
                    {results.success ? 'Test Passed!' : 'Test Failed'}
                  </span>
                </div>
                {!results.success && results.error && (
                  <div className="mt-2 text-sm">
                    <strong>Error:</strong> {JSON.stringify(results.error)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Verify Environment Variables</h3>
              <p className="text-gray-600">
                Make sure your <code className="bg-gray-100 px-1 rounded">.env.local</code> file has the correct Supabase credentials.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Update Table Names</h3>
              <p className="text-gray-600">
                In <code className="bg-gray-100 px-1 rounded">lib/supabaseClient.ts</code>, update the TABLES constant with your actual table names.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Run Tests</h3>
              <p className="text-gray-600">
                Start with the <strong>Quick Test</strong> to verify your connection. Then run individual tests to debug specific issues.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">4. Map Fields</h3>
              <p className="text-gray-600">
                Open <code className="bg-gray-100 px-1 rounded">lib/supabaseFieldMapper.ts</code> and map fields one by one. Use the field mapping test to verify your mappings.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">5. Check Console</h3>
              <p className="text-gray-600">
                All detailed test output is logged to the browser console. Press <strong>F12</strong> to open Developer Tools and view the Console tab.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">📚 Documentation</h3>
        <p className="text-blue-800 text-sm">
          For detailed setup instructions and field mapping examples, see:{' '}
          <code className="bg-blue-100 px-1 rounded">docs/SUPABASE_SETUP_GUIDE.md</code>
        </p>
      </div>
    </div>
  );
}

