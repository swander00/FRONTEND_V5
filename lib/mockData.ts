// Mock data utilities for the real estate application
// This file is kept for backward compatibility
// New code should use lib/mockDataService.ts

import { Property } from '@/types';
import { 
  mockProperties as serviceMockProperties,
  mockSearch as serviceMockSearch,
  mockGetProperty as serviceMockGetProperty,
  mockSearchSuggestions as serviceMockSearchSuggestions,
  mockGetUserProfile as serviceMockGetUserProfile,
  mockUpdateUserProfile as serviceMockUpdateUserProfile,
  mockVerifyEmail as serviceMockVerifyEmail
} from './mockDataService';

// Re-export from the service for backward compatibility
export const mockProperties: Property[] = serviceMockProperties;

// Re-export functions for backward compatibility
export const mockSearch = serviceMockSearch;
export const mockGetProperty = serviceMockGetProperty;
export const mockSearchSuggestions = serviceMockSearchSuggestions;
export const mockGetUserProfile = serviceMockGetUserProfile;
export const mockUpdateUserProfile = serviceMockUpdateUserProfile;
export const mockVerifyEmail = serviceMockVerifyEmail;
