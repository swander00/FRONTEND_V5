'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AuthModal, EmailField, SubmitButton, CancelButton } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      
      // Use the real Google OAuth flow from AuthProvider
      const success = await signInWithGoogle();
      
      if (success) {
        // Google OAuth will redirect to callback page, so we close the modal
        // The AuthProvider will handle the user authentication
        toast.success('Redirecting to Google...');
        onClose();
        
        // Reset form
        setEmail('');
        setPhone('');
      } else {
        toast.error('Failed to initiate Google sign-in. Please try again.');
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
    
    if (!phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    
    // Basic phone validation - check for at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      
      // Use the signIn function from AuthProvider
      // Use phone number digits as password
      const success = await signIn(email, phoneDigits);
      
      if (success) {
        toast.success('Signed in successfully!');
        onClose();
        
        // Reset form
        setEmail('');
        setPhone('');
      } else {
        toast.error('Invalid email or phone number');
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

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="signin-phone" className="text-sm font-medium">
            <Phone className="inline mr-1 h-3 w-3" />
            Phone Number
          </Label>
          <Input
            id="signin-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-10"
          />
          <p className="text-xs text-gray-500">
            Enter the phone number used during signup
          </p>
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
        Don&apos;t have an account?{' '}
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Sign up here
        </a>
      </p>
    </AuthModal>
  );
} 