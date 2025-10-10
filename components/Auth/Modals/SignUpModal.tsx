'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Mail, Lock, User, Chrome, ArrowLeft, Home, Clock, Check, Phone } from 'lucide-react';

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'initial' | 'email-signup' | 'email-signin' | 'buyer-questionnaire';

interface BuyerProfile {
  firstTimeBuyer: boolean | null;
  preApproved: boolean | null;
  hasHouseToSell: boolean | null;
  purchaseTimeframe: '0-3' | '3-6' | '6-12' | '12+' | null;
}

// Pure mapping function that converts UI state (camelCase) to a DB-ready payload (snake_case)
function toUserProfilesPayload(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}, buyerProfile: {
  firstTimeBuyer: boolean | null;
  preApproved: boolean | null;
  hasHouseToSell: boolean | null;
  purchaseTimeframe: '0-3' | '3-6' | '6-12' | '12+' | null;
}) {
  return {
    email: formData.email,
    first_name: formData.firstName || null,
    last_name: formData.lastName || null,
    phone: formData.phone || null,
    first_time_buyer: buyerProfile.firstTimeBuyer,
    pre_approved: buyerProfile.preApproved,
    has_house_to_sell: buyerProfile.hasHouseToSell,
    purchase_timeframe: buyerProfile.purchaseTimeframe // '0-3'|'3-6'|'6-12'|'12+'|null
  };
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  const { signUp, signIn, completeSignUp, signInWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({
    firstTimeBuyer: null,
    preApproved: null,
    hasHouseToSell: null,
    purchaseTimeframe: null
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Basic phone validation - allow digits, spaces, dashes, parentheses
    if (field === 'phone') {
      // Allow only digits, spaces, dashes, parentheses, and plus sign
      const phoneRegex = /^[\d\s\-\(\)\+]*$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBuyerProfileChange = (field: keyof BuyerProfile, value: boolean | string | null) => {
    setBuyerProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      
      // Use the real Google OAuth flow from AuthProvider
      const success = await signInWithGoogle();
      
      if (success) {
        // Google OAuth will redirect to callback page, so we close the modal
        // The AuthProvider will handle the user creation and profile setup
        toast.success('Redirecting to Google...');
        onClose();
        
        // Reset form and step
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setBuyerProfile({
          firstTimeBuyer: null,
          preApproved: null,
          hasHouseToSell: null,
          purchaseTimeframe: null
        });
        setCurrentStep('initial');
      } else {
        toast.error('Failed to initiate Google sign-in. Please try again.');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      toast.error('Failed to sign up with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    
    // Basic phone validation - check for at least 10 digits
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Use the signUp function from AuthProvider
      // Use phone number as password for simplified authentication
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const success = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: phoneDigits // Use phone number digits as password
      });
      
      if (success) {
        console.log('✅ Sign up successful for:', formData.email);
        // Proceed to Step 3: Buyer Questionnaire
        setCurrentStep('buyer-questionnaire');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      // Check for specific error types
      if (error?.message?.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerQuestionnaireSubmit = async () => {
    try {
      setLoading(true);
      
      console.log('🔵 Complete Setup button clicked');
      console.log('🔵 Buyer profile data:', buyerProfile);
      console.log('🔵 Form data:', { email: formData.email, firstName: formData.firstName, lastName: formData.lastName });
      
      // Complete the sign up process with buyer profile
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const success = await completeSignUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: phoneDigits, // Use phone number digits as password
        buyerProfile: buyerProfile
      });
      
      console.log('🔵 completeSignUp returned:', success);
      
      if (success) {
        console.log('✅ Complete signup successful - closing modal');
        toast.success('Account created successfully! Welcome to your personalized home search experience.');
        
        // Reset all form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setBuyerProfile({
          firstTimeBuyer: null,
          preApproved: null,
          hasHouseToSell: null,
          purchaseTimeframe: null
        });
        setCurrentStep('initial');
        
        // Close modal AFTER state is reset
        console.log('🔵 Calling onClose()');
        onClose();
        console.log('✅ Modal should now close');
      } else {
        console.error('❌ completeSignUp returned false');
        toast.error('Unable to complete setup. Please try signing in with your email and password.');
      }
    } catch (error: any) {
      console.error('❌ Questionnaire submission error:', error);
      console.error('❌ Error details:', error.message);
      if (error?.message?.includes('email confirmation')) {
        toast.error('Please verify your email address to continue. Check your inbox for a confirmation link.');
      } else {
        toast.error(`Failed to complete setup: ${error.message || 'Unknown error'}`);
      }
    } finally {
      console.log('🔵 Setting loading to false');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    
    // Basic phone validation - check for at least 10 digits
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      
      // Use the signIn function from AuthProvider
      // Use phone number digits as password
      const success = await signIn(formData.email, phoneDigits);
      
      if (success) {
        toast.success('Signed in successfully!');
        onClose();
        
        // Reset form and step
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setBuyerProfile({
          firstTimeBuyer: null,
          preApproved: null,
          hasHouseToSell: null,
          purchaseTimeframe: null
        });
        setCurrentStep('initial');
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

  const goBack = () => {
    if (currentStep === 'buyer-questionnaire') {
      setCurrentStep('email-signup');
    } else {
      setCurrentStep('initial');
    }
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setBuyerProfile({
      firstTimeBuyer: null,
      preApproved: null,
      hasHouseToSell: null,
      purchaseTimeframe: null
    });
  };

  const handleClose = () => {
    onClose();
    setCurrentStep('initial');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setBuyerProfile({
      firstTimeBuyer: null,
      preApproved: null,
      hasHouseToSell: null,
      purchaseTimeframe: null
    });
  };

  // Step 1: Initial options
  if (currentStep === 'initial') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          {/* Step Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500 font-medium">Step 1 of 3</span>
          </div>
          
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Welcome</DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose how you&apos;d like to get started
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full h-12 border-2 hover:bg-gray-50 transition-colors text-base"
            >
              <Chrome className="mr-3 h-5 w-5 text-red-500" />
              {googleLoading ? 'Signing up with Google...' : 'Sign in with Google'}
            </Button>
            
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">or</span>
              </div>
            </div>

            {/* Enter Email Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep('email-signup')}
              className="w-full h-12 border-2 hover:bg-gray-50 transition-colors text-base"
            >
              <Mail className="mr-3 h-5 w-5 text-gray-600" />
              Enter email
            </Button>
          </div>

          {/* Disclosure Text */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              By registering, you agree to our Terms of Use and Privacy Policy. You acknowledge that real estate professionals and lenders may contact you by phone, text, or email about your inquiry, including automated or prerecorded messages. Consent is not required to purchase any property, goods, or services. Standard message/data rates may apply.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 2: Email Sign Up Form
  if (currentStep === 'email-signup') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[450px]">
          {/* Step Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500 font-medium">Step 2 of 3</span>
          </div>
          
          <DialogHeader className="text-center">
            <div className="flex items-center justify-between mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-bold">Create Account</DialogTitle>
              <div className="w-8"></div> {/* Spacer for centering */}
            </div>
            <DialogDescription className="text-gray-600">
              Join thousands of users finding their perfect home
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  <User className="inline mr-1 h-3 w-3" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  <User className="inline mr-1 h-3 w-3" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <Mail className="inline mr-1 h-3 w-3" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="h-10"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                <Phone className="inline mr-1 h-3 w-3" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-10"
              />
              <p className="text-xs text-gray-500">
                This will be used for login and account recovery
              </p>
            </div>


            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentStep('email-signin')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-gray-500 mt-2">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 3: Buyer Questionnaire
  if (currentStep === 'buyer-questionnaire') {
    const timeframeOptions = [
      { label: '0–3 months', value: '0-3' },
      { label: '3–6 months', value: '3-6' },
      { label: '6–12 months', value: '6-12' },
      { label: 'Over 12 months', value: '12+' }
    ];

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          {/* Step Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500 font-medium">Step 3 of 3</span>
          </div>
          
          <DialogHeader className="text-center">
            <div className="flex items-center justify-between mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-bold">Buyer Profile</DialogTitle>
              <div className="w-8"></div> {/* Spacer for centering */}
            </div>
            <DialogDescription className="text-gray-600">
              Help us personalize your home search experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* First Time Buyer Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Are you a first-time buyer?
              </Label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">No</span>
                <Switch
                  checked={buyerProfile.firstTimeBuyer === true}
                  onCheckedChange={(checked) => 
                    handleBuyerProfileChange('firstTimeBuyer', checked ? true : false)
                  }
                />
                <span className="text-sm text-gray-600">Yes</span>
              </div>
            </div>

            {/* Pre-approved Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Check className="h-4 w-4" />
                Are you pre-approved for a mortgage?
              </Label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">No</span>
                <Switch
                  checked={buyerProfile.preApproved === true}
                  onCheckedChange={(checked) => 
                    handleBuyerProfileChange('preApproved', checked ? true : false)
                  }
                />
                <span className="text-sm text-gray-600">Yes</span>
              </div>
            </div>

            {/* House to Sell Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Do you have a house to sell?
              </Label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">No</span>
                <Switch
                  checked={buyerProfile.hasHouseToSell === true}
                  onCheckedChange={(checked) => 
                    handleBuyerProfileChange('hasHouseToSell', checked ? true : false)
                  }
                />
                <span className="text-sm text-gray-600">Yes</span>
              </div>
            </div>

            {/* Purchase Timeframe Chips */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                What is your time frame for purchase?
                <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => 
                      handleBuyerProfileChange('purchaseTimeframe', 
                        buyerProfile.purchaseTimeframe === option.value ? null : option.value
                      )
                    }
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      buyerProfile.purchaseTimeframe === option.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 h-11"
              >
                Skip
              </Button>
              <Button 
                type="button" 
                onClick={handleBuyerQuestionnaireSubmit}
                disabled={loading} 
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Completing Setup...' : 'Complete Setup'}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-gray-500 mt-4">
            This information helps us provide you with more relevant property recommendations and connect you with the right professionals.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  // Email Sign In Form (Alternative path from Step 1)
  if (currentStep === 'email-signin') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          {/* Step Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500 font-medium">Sign In</span>
          </div>
          <DialogHeader className="text-center">
            <div className="flex items-center justify-between mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
              <div className="w-8"></div> {/* Spacer for centering */}
            </div>
            <DialogDescription className="text-gray-600">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm font-medium">
                <Mail className="inline mr-1 h-3 w-3" />
                Email Address
              </Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="h-10"
              />
            </div>

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
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-10"
              />
              <p className="text-xs text-gray-500">
                Enter the phone number used during signup
              </p>
            </div>


            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentStep('email-signup')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
} 