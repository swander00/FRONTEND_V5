/**
 * Shared Mapper Utilities
 * 
 * Contains interfaces, types, and helper functions used by all mappers
 */

import { Property } from '@/types';
import { SupabaseProperty } from '../supabaseClient';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to safely parse numbers from database values
 */
export function parseNumber(value: any): number | undefined {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Helper function to safely parse booleans from database values
 */
export function parseBoolean(value: any): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === 'yes' || lower === '1') return true;
    if (lower === 'false' || lower === 'no' || lower === '0') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return undefined;
}

/**
 * Helper function to safely parse dates from database values
 */
export function parseDate(value: any): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

/**
 * Helper function to safely parse arrays from database values
 */
export function parseArray(value: any): string[] | undefined {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Try to parse JSON array
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      // If not JSON, try comma-separated
      return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
  }
  return undefined;
}

// ============================================================================
// SHARED MAPPER FUNCTIONS
// ============================================================================

/**
 * Core identifier mappers used by both card and details
 */
export const sharedMappers = {
  // Core Identifiers
  mapListingKey: (dbProperty: any) => {
    // TODO: Map from Supabase field
    // Example: return dbProperty.listing_key || dbProperty.ListingKey || '';
    return '';
  },

  // Address Fields (used in both cards and details)
  mapUnparsedAddress: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return '';
  },

  mapStreetNumber: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapStreetName: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapStreetSuffix: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapCity: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapStateOrProvince: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapPostalCode: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  // Basic Property Details (used in both)
  mapMLSNumber: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapListPrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapBedrooms: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapBathrooms: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapSquareFootage: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapPropertyType: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapMlsStatus: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  // Media Fields
  mapPrimaryImageUrl: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapImages: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
};

