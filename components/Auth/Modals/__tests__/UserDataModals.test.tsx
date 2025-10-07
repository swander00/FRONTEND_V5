// Test file for user data modals integration
// This is a placeholder test file to verify the modals can be imported and rendered

import React from 'react';
import { render } from '@testing-library/react';
import { LikedListingsModal } from '../LikedListingsModal';
import { SavedListingsModal } from '../SavedListingsModal';
import { SavedSearchesModal } from '../SavedSearchesModal';

// Mock the useAuth hook
jest.mock('@/components/Auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    isAuthenticated: true
  })
}));

// Mock the user data hooks
jest.mock('@/hooks/useUserData', () => ({
  useLikedListings: () => ({
    likedListings: [],
    loading: false,
    error: null,
    unlikeListing: jest.fn(),
    refresh: jest.fn()
  }),
  useSavedListings: () => ({
    savedListings: [],
    loading: false,
    error: null,
    updateListing: jest.fn(),
    unsaveListing: jest.fn(),
    refresh: jest.fn()
  }),
  useSavedSearches: () => ({
    savedSearches: [],
    loading: false,
    error: null,
    updateSavedSearch: jest.fn(),
    deleteSavedSearch: jest.fn(),
    executeSavedSearch: jest.fn(),
    refresh: jest.fn()
  })
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('User Data Modals', () => {
  it('renders LikedListingsModal without crashing', () => {
    const { container } = render(
      <LikedListingsModal open={true} onClose={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders SavedListingsModal without crashing', () => {
    const { container } = render(
      <SavedListingsModal open={true} onClose={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders SavedSearchesModal without crashing', () => {
    const { container } = render(
      <SavedSearchesModal open={true} onClose={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
