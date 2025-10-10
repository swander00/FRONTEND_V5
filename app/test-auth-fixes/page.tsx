'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, User, LogOut, LogIn, Image } from 'lucide-react';

export default function TestAuthFixes() {
  const { user, isAuthenticated, loading, signOut, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      console.log('🔍 Testing logout...');
      await signOut();
      setMessage('✅ Logout test completed - check console for details');
    } catch (error) {
      setMessage('❌ Logout error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const success = await signInWithGoogle();
      if (success) {
        setMessage('✅ Google sign-in initiated! Check if profile picture loads...');
      } else {
        setMessage('❌ Google sign-in failed');
      }
    } catch (error) {
      setMessage('❌ Google sign-in error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Loading authentication...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <CardTitle>Auth Fixes Test</CardTitle>
          </div>
          <CardDescription>
            Test the fixes for logout and Google profile picture issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Status */}
            <Alert className={isAuthenticated ? 'border-green-500 bg-green-50' : 'border-gray-500 bg-gray-50'}>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-600" />
                )}
                <AlertTitle>
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </AlertTitle>
              </div>
              <AlertDescription>
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name || 'Not set'}</p>
                    
                    {/* Profile Picture Test */}
                    <div className="flex items-center gap-2">
                      <strong>Avatar:</strong> 
                      {user.avatar_url ? (
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Set</span>
                          <img 
                            src={user.avatar_url} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              console.error('❌ Profile image failed to load:', user.avatar_url);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            onLoad={() => console.log('✅ Profile image loaded successfully')}
                          />
                        </div>
                      ) : (
                        <span className="text-red-600">❌ Not set</span>
                      )}
                    </div>
                  </div>
                ) : (
                  'No user is currently signed in.'
                )}
              </AlertDescription>
            </Alert>

            {/* Message */}
            {message && (
              <Alert className={message.includes('✅') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Test Actions */}
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="text-center">
                  <Button 
                    onClick={handleGoogleSignIn} 
                    disabled={isLoading}
                    className="flex items-center gap-2 mx-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Test Google Sign-In (Check Profile Pic)
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Button 
                    onClick={handleSignOut} 
                    disabled={isLoading}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    Test Logout (Check Console)
                  </Button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li><strong>Profile Picture Test:</strong> Sign in with Google and check if your profile picture appears above</li>
                <li><strong>Logout Test:</strong> Click logout and check browser console for "🚪 User signed out" message</li>
                <li><strong>Console Check:</strong> Open DevTools (F12) to see detailed auth logs</li>
                <li><strong>Database Check:</strong> Verify UserProfiles table gets updated with Google data</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-xs text-blue-700">
                  <strong>Expected Results:</strong>
                  <br />• Profile picture should load from Google
                  <br />• Logout should clear user state and show console messages
                  <br />• UserProfiles table should have Google avatar_url
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
