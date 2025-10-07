'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AuthModal, EmailField, PasswordField, SubmitButton, CancelButton } from '@/components/shared';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      
      // Simulate Google OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the signIn function from AuthProvider with mock Google credentials
      const success = await signIn('google-user@example.com', 'google-oauth-token');
      
      if (success) {
        console.log('Mock Google sign in successful');
        toast.success('Signed in successfully with Google!');
        onClose();
        
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      setLoading(true);
      
      // Use the signIn function from AuthProvider
      const success = await signIn(email, password);
      
      if (success) {
        toast.success('Signed in successfully!');
        onClose();
        
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal
      open={open}
      onClose={onClose}
      title="Welcome Back"
      description="Sign in to your account to continue"
      loading={loading}
    >
      {/* Google Sign In Button */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-11 border-2 hover:bg-gray-50 transition-colors"
        >
          <Chrome className="mr-2 h-5 w-5 text-red-500" />
          {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </Button>
        
        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">or sign in with email</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <EmailField
          value={email}
          onChange={setEmail}
          required
        />

        {/* Password Field */}
        <PasswordField
          value={password}
          onChange={setPassword}
          required
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <CancelButton 
            onClick={onClose} 
            className="flex-1"
          />
          <SubmitButton 
            loading={loading}
            className="flex-1"
          >
            Sign In
          </SubmitButton>
        </div>
      </form>

      {/* Sign Up Link */}
      <p className="text-sm text-center text-gray-600 mt-4">
        Don't have an account?{' '}
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Sign up here
        </a>
      </p>
    </AuthModal>
  );
} 