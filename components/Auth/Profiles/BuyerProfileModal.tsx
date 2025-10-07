'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { mockGetUserProfile, mockUpdateUserProfile } from '@/lib/mockData';

interface BuyerProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onProfileComplete?: () => void; // New callback for profile completion
}

const moveTimeframeOptions = [
  { value: '0-3months', label: '0–3 Months' },
  { value: '3-6months', label: '3–6 Months' },
  { value: '6-12months', label: '6–12 Months' },
  { value: '12+months', label: '12+ Months' },
  { value: 'curious', label: 'Just Curious' }
];

export function BuyerProfileModal({ open, onClose, userId, onProfileComplete }: BuyerProfileModalProps) {
  const [isPreapproved, setIsPreapproved] = useState(false);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [hasHouseToSell, setHasHouseToSell] = useState(false);
  const [moveTimeframe, setMoveTimeframe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load existing profile data when modal opens
  useEffect(() => {
    if (open && userId) {
      loadProfileData();
    }
  }, [open, userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profile = await mockGetUserProfile(userId);

      if (profile) {
        // For mock data, we'll use default values since the mock profile doesn't have these fields
        setIsPreapproved(false);
        setIsFirstTimeBuyer(true);
        setHasHouseToSell(false);
        setMoveTimeframe('6-12months');
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Updating profile with data:', {
        userId,
        is_preapproved: isPreapproved,
        is_first_time_buyer: isFirstTimeBuyer,
        has_house_to_sell: hasHouseToSell,
        move_timeframe: moveTimeframe
      });

      // Update the profile using mock function
      const result = await mockUpdateUserProfile(userId, {
        is_preapproved: isPreapproved,
        is_first_time_buyer: isFirstTimeBuyer,
        has_house_to_sell: hasHouseToSell,
        move_timeframe: moveTimeframe
      });

      if (result.success) {
        console.log('Profile updated successfully');
        onProfileComplete?.();
        onClose();
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoad) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Tell Us About You</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Help us find the perfect property for your needs
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Pre-approved for mortgage */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Are you pre-approved for a mortgage?</span>
            <button
              type="button"
              onClick={() => setIsPreapproved(!isPreapproved)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isPreapproved ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isPreapproved ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* First-time homebuyer */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Are you a first-time homebuyer?</span>
            <button
              type="button"
              onClick={() => setIsFirstTimeBuyer(!isFirstTimeBuyer)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isFirstTimeBuyer ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isFirstTimeBuyer ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Have property to sell */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Do you have a property to sell?</span>
            <button
              type="button"
              onClick={() => setHasHouseToSell(!hasHouseToSell)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                hasHouseToSell ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  hasHouseToSell ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Move timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When are you looking to move?
            </label>
            <select
              value={moveTimeframe}
              onChange={(e) => setMoveTimeframe(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select a timeframe</option>
              {moveTimeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !moveTimeframe}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Submit Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 