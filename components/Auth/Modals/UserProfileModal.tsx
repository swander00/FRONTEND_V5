'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Phone, Home, Check, Clock, Edit3, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  isPreapproved?: boolean;
  isFirstTimeBuyer?: boolean;
  hasHouseToSell?: boolean;
  moveTimeframe?: string;
  avatar_url?: string;
}

const moveTimeframeOptions = [
  { value: '0-3', label: '0–3 Months' },
  { value: '3-6', label: '3–6 Months' },
  { value: '6-12', label: '6–12 Months' },
  { value: '12+', label: '12+ Months' }
];

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    isPreapproved: false,
    isFirstTimeBuyer: false,
    hasHouseToSell: false,
    moveTimeframe: ''
  });

  // Load profile data when modal opens
  useEffect(() => {
    if (open && user?.id) {
      loadProfileData();
    }
  }, [open, user?.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading user profile data for:', user?.id);

      // Load user profile from UserProfiles table
      const { data: userProfile, error: profileError } = await supabase
        .from('UserProfiles')
        .select('*')
        .eq('Id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error loading user profile:', profileError);
        toast.error('Failed to load profile data');
        return;
      }

      // Load buyer preferences from UserBuyerPreferences table
      const { data: buyerPrefs, error: buyerPrefsError } = await supabase
        .from('UserBuyerPreferences')
        .select('*')
        .eq('UserId', user?.id)
        .single();

      if (buyerPrefsError && buyerPrefsError.code !== 'PGRST116') {
        console.error('❌ Error loading buyer preferences:', buyerPrefsError);
      }

      // Set profile data
      if (userProfile) {
        setProfile({
          firstName: userProfile.FirstName || '',
          lastName: userProfile.LastName || '',
          email: userProfile.Email || '',
          phone: userProfile.Phone || '',
          avatar_url: userProfile.AvatarUrl || '',
          isPreapproved: buyerPrefs?.PreApproved || false,
          isFirstTimeBuyer: buyerPrefs?.FirstTimeBuyer || false,
          hasHouseToSell: buyerPrefs?.HasHouseToSell || false,
          moveTimeframe: buyerPrefs?.PurchaseTimeframe || ''
        });

        setFormData({
          firstName: userProfile.FirstName || '',
          lastName: userProfile.LastName || '',
          phone: userProfile.Phone || '',
          isPreapproved: buyerPrefs?.PreApproved || false,
          isFirstTimeBuyer: buyerPrefs?.FirstTimeBuyer || false,
          hasHouseToSell: buyerPrefs?.HasHouseToSell || false,
          moveTimeframe: buyerPrefs?.PurchaseTimeframe || ''
        });
      }
    } catch (err) {
      console.error('❌ Error loading profile data:', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('💾 Saving profile data for user:', user.id);
      
      // Update user profile in UserProfiles table
      const { error: profileError } = await supabase
        .from('UserProfiles')
        .update({
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Phone: formData.phone || null,
        })
        .eq('Id', user.id);

      if (profileError) {
        console.error('❌ Error updating user profile:', profileError);
        toast.error('Failed to update profile. Please try again.');
        return;
      }

      // Update buyer preferences in UserBuyerPreferences table
      const { error: buyerPrefsError } = await supabase
        .from('UserBuyerPreferences')
        .upsert({
          UserId: user.id,
          FirstTimeBuyer: formData.isFirstTimeBuyer,
          PreApproved: formData.isPreapproved,
          HasHouseToSell: formData.hasHouseToSell,
          PurchaseTimeframe: formData.moveTimeframe || null,
        });

      if (buyerPrefsError) {
        console.error('❌ Error updating buyer preferences:', buyerPrefsError);
        toast.error('Failed to update buyer preferences. Please try again.');
        return;
      }

      console.log('✅ Profile updated successfully');
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await loadProfileData(); // Reload to get updated data
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        isPreapproved: false,
        isFirstTimeBuyer: false,
        hasHouseToSell: false,
        moveTimeframe: ''
      });
    }
    setIsEditing(false);
  };

  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return user?.name || user?.email || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  if (loading && !profile) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">My Profile</DialogTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url} alt={getDisplayName()} />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{getDisplayName()}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Buyer Preferences */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Buyer Preferences
            </h4>

            <div className="space-y-4">
              {/* Pre-approved for mortgage */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Pre-approved for mortgage</p>
                  <p className="text-sm text-gray-600">Are you pre-approved for a mortgage?</p>
                </div>
                <button
                  type="button"
                  onClick={() => isEditing && setFormData(prev => ({ ...prev, isPreapproved: !prev.isPreapproved }))}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.isPreapproved ? 'bg-blue-600' : 'bg-gray-300'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.isPreapproved ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* First-time homebuyer */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">First-time homebuyer</p>
                  <p className="text-sm text-gray-600">Are you a first-time homebuyer?</p>
                </div>
                <button
                  type="button"
                  onClick={() => isEditing && setFormData(prev => ({ ...prev, isFirstTimeBuyer: !prev.isFirstTimeBuyer }))}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.isFirstTimeBuyer ? 'bg-blue-600' : 'bg-gray-300'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.isFirstTimeBuyer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Have property to sell */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Have property to sell</p>
                  <p className="text-sm text-gray-600">Do you have a property to sell?</p>
                </div>
                <button
                  type="button"
                  onClick={() => isEditing && setFormData(prev => ({ ...prev, hasHouseToSell: !prev.hasHouseToSell }))}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.hasHouseToSell ? 'bg-blue-600' : 'bg-gray-300'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.hasHouseToSell ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Move timeframe */}
              <div className="space-y-2">
                <Label htmlFor="moveTimeframe" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Move Timeframe
                </Label>
                <select
                  id="moveTimeframe"
                  value={formData.moveTimeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, moveTimeframe: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a timeframe</option>
                  {moveTimeframeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
