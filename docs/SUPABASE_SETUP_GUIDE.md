# Supabase Setup and Field Mapping Guide

## Overview

This guide explains how to use the Supabase connection and field mapper to connect your frontend to your Supabase database.

## Files Created

1. **`lib/supabaseClient.ts`** - Establishes the Supabase connection
2. **`lib/supabaseFieldMapper.ts`** - Placeholder mapper for mapping database fields to frontend Property type
3. **`lib/testSupabaseConnection.ts`** - Utility to test the connection and mappings

## Setup Steps

### Step 1: Verify Environment Variables

Your `.env.local` file should have these Supabase variables (already configured):
```
NEXT_PUBLIC_SUPABASE_URL=https://gyeviskmqtkskcoyyprp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Update Table Names

In `lib/supabaseClient.ts`, update the `TABLES` constant with your actual Supabase table names:

```typescript
export const TABLES = {
  PROPERTIES: 'properties',  // Change to your actual table name
  MEDIA: 'media',           // Change to your actual table name
  // ... etc
} as const;
```

### Step 3: Test the Connection

Run the connection test to verify Supabase is working:

```typescript
import { testConnection } from '@/lib/supabaseClient';

// In your component or test file
const result = await testConnection();
console.log(result);
```

### Step 4: Map Fields One by One

Open `lib/supabaseFieldMapper.ts` and map fields one at a time:

#### Example: Mapping ListingKey

**Before:**
```typescript
mapListingKey: (dbProperty: any) => {
  return ''; // TODO: Map from Supabase field
},
```

**After:**
```typescript
mapListingKey: (dbProperty: any) => {
  return dbProperty.listing_key || dbProperty.ListingKey || '';
},
```

#### Example: Mapping ListPrice

**Before:**
```typescript
mapListPrice: (dbProperty: any) => {
  return undefined; // TODO: Map from Supabase field
},
```

**After:**
```typescript
mapListPrice: (dbProperty: any) => {
  return parseNumber(dbProperty.list_price);
},
```

### Step 5: Test Your Mappings

After mapping a field, test it to ensure it works:

```typescript
import { supabase, TABLES } from '@/lib/supabaseClient';
import { mapSupabasePropertyToFrontend } from '@/lib/supabaseFieldMapper';

// Fetch a property
const { data, error } = await supabase
  .from(TABLES.PROPERTIES)
  .select('*')
  .limit(1)
  .single();

if (data) {
  const mappedProperty = mapSupabasePropertyToFrontend(data);
  console.log('Mapped Property:', mappedProperty);
}
```

## Field Mapping Strategy

### Priority 1: Critical Fields
Start with these essential fields:
1. `ListingKey` - Unique identifier
2. `UnparsedAddress` or `StreetAddress` - Full address
3. `City` - City name
4. `ListPrice` - Property price
5. `Bedrooms` - Number of bedrooms
6. `Bathrooms` - Number of bathrooms
7. `PropertyType` - Type of property
8. `MlsStatus` - Listing status

### Priority 2: Display Fields
Then map fields used for display:
1. `PrimaryImageUrl` - Main image
2. `images` - All images
3. `SquareFootage` - Property size
4. `Description` - Property description
5. `DaysOnMarket` - How long listed

### Priority 3: Additional Details
Finally map remaining fields as needed:
- Property features
- Amenities
- Open house information
- Timestamps
- etc.

## Helper Functions

The field mapper includes helper functions for common conversions:

### parseNumber()
```typescript
mapListPrice: (dbProperty: any) => {
  return parseNumber(dbProperty.list_price);
}
```

### parseBoolean()
```typescript
mapWaterfront: (dbProperty: any) => {
  return parseBoolean(dbProperty.waterfront);
}
```

### parseDate()
```typescript
mapListDate: (dbProperty: any) => {
  return parseDate(dbProperty.list_date);
}
```

### parseArray()
```typescript
mapImages: (dbProperty: any) => {
  return parseArray(dbProperty.images);
}
```

## Common Patterns

### Mapping with Fallbacks
```typescript
mapCity: (dbProperty: any) => {
  return dbProperty.city || dbProperty.City || undefined;
}
```

### Mapping with Type Conversion
```typescript
mapBedrooms: (dbProperty: any) => {
  const value = dbProperty.bedrooms || dbProperty.Bedrooms;
  return parseNumber(value);
}
```

### Mapping Computed Fields
```typescript
mapStreetAddress: (dbProperty: any) => {
  // If stored as full address
  if (dbProperty.street_address) return dbProperty.street_address;
  
  // If stored as separate fields
  const parts = [
    dbProperty.street_number,
    dbProperty.street_name,
    dbProperty.street_suffix
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(' ') : undefined;
}
```

### Mapping JSON Fields
```typescript
mapImages: (dbProperty: any) => {
  // If stored as JSON
  if (dbProperty.images && typeof dbProperty.images === 'string') {
    try {
      return JSON.parse(dbProperty.images);
    } catch {
      return undefined;
    }
  }
  // If already an array
  return dbProperty.images;
}
```

## Testing Workflow

1. **Map a field** in `supabaseFieldMapper.ts`
2. **Test the mapping** using the test utility
3. **Verify the output** in your frontend
4. **Move to next field**

## Next Steps

Once you've mapped the critical fields:

1. Update `propertyDataService.ts` to use Supabase instead of mock data
2. Update `propertyMapping.ts` to use the new field mapper
3. Test property listing pages
4. Test property detail pages
5. Test search and filters

## Troubleshooting

### Connection Errors
- Verify environment variables are correct
- Check Supabase dashboard for API status
- Ensure table names match your database

### Mapping Errors
- Log the raw database object to see actual field names
- Check for case sensitivity (e.g., `listing_key` vs `ListingKey`)
- Use helper functions for type conversions
- Handle null/undefined values appropriately

### Type Errors
- Use optional chaining (`?.`) for nested properties
- Use nullish coalescing (`??`) for default values
- Check TypeScript errors and fix type mismatches

## Example: Complete Field Mapping

Here's an example of mapping several related fields:

```typescript
// In supabaseFieldMapper.ts

mapListingKey: (dbProperty: any) => {
  return dbProperty.listing_key || dbProperty.ListingKey || '';
},

mapUnparsedAddress: (dbProperty: any) => {
  return dbProperty.unparsed_address || dbProperty.UnparsedAddress || '';
},

mapCity: (dbProperty: any) => {
  return dbProperty.city || dbProperty.City || undefined;
},

mapListPrice: (dbProperty: any) => {
  return parseNumber(dbProperty.list_price || dbProperty.ListPrice);
},

mapBedrooms: (dbProperty: any) => {
  return parseNumber(dbProperty.bedrooms || dbProperty.Bedrooms);
},

mapBathrooms: (dbProperty: any) => {
  return parseNumber(dbProperty.bathrooms || dbProperty.Bathrooms);
},

mapPropertyType: (dbProperty: any) => {
  return dbProperty.property_type || dbProperty.PropertyType || undefined;
},

mapMlsStatus: (dbProperty: any) => {
  return dbProperty.mls_status || dbProperty.MlsStatus || undefined;
},
```

## Resources

- [Supabase JavaScript Client Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Querying Data](https://supabase.com/docs/guides/database/query)
- Frontend Property Type: `types/property.ts`

