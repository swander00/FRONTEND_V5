/**
 * Property Data Service
 * 
 * Temporary service file for property data operations.
 * Currently using mock data - will be replaced with proper API calls later.
 */

import { Property } from '@/types';
import { FilterCriteria } from '@/types/filters';
import * as MockDataService from './mockDataService';

// Re-export types from mock service
export type { PropertySearchResult, PropertyCountResult } from './mockDataService';

/**
 * Get properties with pagination from database
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function getPropertiesWithPaginationFromDB(
  page: number,
  pageSize: number,
  filters: FilterCriteria
): Promise<{
  properties: Property[];
  totalCount: number;
  totalPages: number;
}> {
  console.log('📦 Using mock data service (replace with API call later)');
  
  // Use mock data for now
  const result = await MockDataService.getPropertiesWithPagination(page, pageSize, filters);
  
  return {
    properties: result.properties,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
  };
}

/**
 * Search properties by text
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function searchProperties(
  searchTerm: string,
  status: string = 'buy',
  page: number = 1,
  pageSize: number = 12
): Promise<{
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}> {
  console.log('🔍 Using mock search service (replace with API call later)');
  
  // Use mock data for now
  return await MockDataService.searchProperties(searchTerm, page, pageSize, { status });
}

/**
 * Get a single property by MLS number
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function getPropertyByMLS(mlsNumber: string): Promise<Property | null> {
  console.log('📄 Using mock property service (replace with API call later)');
  
  // Use mock data for now
  return await MockDataService.getPropertyByMLS(mlsNumber);
}

/**
 * Get sample properties
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function getSampleProperties(limit: number = 5): Promise<Property[]> {
  console.log('📋 Using mock sample service (replace with API call later)');
  
  // Use mock data for now
  return await MockDataService.getSampleProperties(limit);
}

/**
 * Search property suggestions (same as search for now)
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function searchPropertySuggestions(
  searchTerm: string,
  status: string = 'buy',
  page: number = 1,
  pageSize: number = 12
): Promise<{
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}> {
  console.log('💡 Using mock suggestions service (replace with API call later)');
  
  // Use mock data for now - same as search
  return await MockDataService.searchProperties(searchTerm, page, pageSize, { status });
}

/**
 * Get property count with optional filters
 * Currently returns mock data - TODO: Replace with actual API call
 */
export async function getPropertyCount(filters?: FilterCriteria): Promise<{
  totalCount: number;
  filteredCount: number;
}> {
  console.log('🔢 Using mock count service (replace with API call later)');
  
  // Use mock data for now
  return await MockDataService.getPropertyCount(filters);
}
