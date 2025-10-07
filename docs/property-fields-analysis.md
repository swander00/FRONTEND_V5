# Property Field Mappings: Frontend to Mock Data

This document outlines the mapping between frontend fields in the Property Details Modal and their corresponding data structure. The application currently uses mock data instead of a database.

## Data Structure Used

### Primary Data Source: Mock Properties
The application uses mock property data defined in `data/mockProperties.ts` for demonstration purposes.

### Field Mappings

### Property Details Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `propertyClass` | Mock data | "Residential" | Property classification |
| `propertyType` | Mock data | "house" | Main property type |
| `bedrooms` | Mock data | 0 | Number of bedrooms |
| `bathrooms` | Mock data | 0 | Total bathrooms |
| `kitchens` | Mock data | 1 | Number of kitchens |
| `squareFootage` | Mock data | 0 | Square footage (parsed as number) |
| `lotSizeAcres` | Mock data | "0" | Lot size in acres |
| `propertyAge` | Mock data | 0 | Property age in years |

| `hasFamilyRoom` | Mock data | false | Family room availability |
| `hasFireplace` | Mock data | false | Fireplace availability |

### Description Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `publicRemarks` | Mock data | "" | Property description/remarks |

### Additional Information Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `lotSizeAcres` | Mock data | "0" | Lot size in acres |

| `basementKitchen` | Mock data | "N/A" | Basement kitchen information |
| `potlFee` | Mock data | "N/A" | POTL fee information |
| `waterfront` | Mock data | "N" | Waterfront property indicator |
| `interiorFeatures` | Mock data | [] | Array of interior features |
| `exteriorFeatures` | Mock data | [] | Array of exterior features |

### Lease Terms Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `leaseTerm` | Mock data | undefined | Lease term information |
| `paymentFrequency` | Mock data | "N/A" | Payment frequency |
| `portionForLease` | Mock data | "N/A" | Portion of property for lease |

### Condo/Maintenance Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `rentIncludes` | Mock data | "N/A" | What rent includes |
| `furnished` | Mock data | "N/A" | Furnished status |
| `locker` | Mock data | "N/A" | Locker availability |
| `maintenanceFee` | Mock data | "N/A" | Monthly maintenance fee |
| `feeIncludes` | Mock data | "N/A" | What fee includes |
| `petsAllowed` | Mock data | "N/A" | Pet policy |

### Parking Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `driveParking` | Mock data | "0 spaces" | Driveway parking spaces |
| `garageParking` | Mock data | "0 spaces" | Garage parking spaces |
| `totalParking` | Mock data | "0 spaces" | Total parking spaces |

### Utilities Section

| Frontend Field | Data Source | Fallback | Notes |
|----------------|-------------|----------|-------|
| `ac` | Mock data | "None" | Air conditioning type |
| `heatSource` | Mock data | "None" | Heating system type |
| `sewers` | Mock data | "City Sewer" | Sewer system type |
| `water` | Mock data | "City Water" | Water source type |

## Implementation Details

### Data Fetching Strategy

1. **Mock Data**: All property information is fetched from the mock data defined in `data/mockProperties.ts`.

2. **Graceful Fallbacks**: If any field is missing, the application provides sensible defaults without breaking the UI.

### Field Processing

#### Lot Size Calculation
```typescript
// Calculate lot size in acres from width and depth
if (lotWidth && lotDepth) {
  const width = parseFloat(lotWidth);
  const depth = parseFloat(lotDepth);
  const squareFeet = width * depth;
  const acres = squareFeet / 43560; // Convert square feet to acres
  return acres.toFixed(2);
}
```

#### Square Footage Processing
```typescript
// Parse square footage from string to number
const squareFootage = parseFloat(squareFootageRaw || '0');
```

#### Status Mapping
```typescript
// Map various status fields to frontend status
export function mapStatus(contractStatus: string | null, transactionType: string | null, mlsStatus: string | null): Property['status'] {
  // Implementation details...
}
```

## Notes

- This application currently uses mock data for demonstration purposes
- All database functionality has been removed
- Authentication features are disabled
- The application maintains the same UI/UX but without backend connectivity
