export type Range = {
  min: number;
  max: number;
};

export type Option = string | number;

export interface FilterCriteria {
  city?: string[];
  propertyType?: string[];
  priceRange?: { min: number; max: number } | null;
  bedrooms?: { min: number; max: number } | null;
  bathrooms?: { min: number; max: number } | null;
  squareFeet?: { min: number; max: number } | null;
  lotSize?: { min: number; max: number } | null;
  yearBuilt?: { min: number; max: number } | null;
  status?: string[];
  features?: string[];
  searchTerm?: string;
}