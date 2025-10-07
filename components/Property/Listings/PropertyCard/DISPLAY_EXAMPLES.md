# PropertyCard Display Examples

**Visual Guide for Enhanced Property Details**

---

## 📋 Example 1: Full Details with Ranges

### Property Data:
```typescript
{
  Bedrooms: 3,
  BedroomsAboveGrade: 3,
  BedroomsBelowGrade: 1,
  Bathrooms: 2,
  SquareFootage: '1800',
  SquareFootageMin: 1700,
  SquareFootageMax: 1900,
  GarageParking: 2,
  DriveParking: 2
}
```

### Displayed As:
```
┌─────────────────────────────────────────────┐
│  [🛏️ 3+1]  [🛁 2]  [📏 1,700-1,900 sqft]  [🚗 2+2]  │
└─────────────────────────────────────────────┘
```

**Legend:**
- 🛏️ **3+1** = 3 above grade + 1 below grade bedrooms
- 🛁 **2** = 2 bathrooms
- 📏 **1,700-1,900 sqft** = Square footage range
- 🚗 **2+2** = 2 garage + 2 driveway parking spaces

---

## 📋 Example 2: No Below Grade Bedrooms

### Property Data:
```typescript
{
  Bedrooms: 3,
  BedroomsAboveGrade: 3,
  BedroomsBelowGrade: 0,
  Bathrooms: 2,
  SquareFootage: '1600',
  SquareFootageMin: 1500,
  SquareFootageMax: 1700,
  GarageParking: 0,
  DriveParking: 1
}
```

### Displayed As:
```
┌─────────────────────────────────────────────┐
│  [🛏️ 3]  [🛁 2]  [📏 1,500-1,700 sqft]  [🚗 1]  │
└─────────────────────────────────────────────┘
```

**Legend:**
- 🛏️ **3** = 3 bedrooms (no below grade)
- 🛁 **2** = 2 bathrooms
- 📏 **1,500-1,700 sqft** = Square footage range
- 🚗 **1** = 1 parking space (driveway only)

---

## 📋 Example 3: Legacy Format (No Enhanced Data)

### Property Data:
```typescript
{
  Bedrooms: 2,
  Bathrooms: 1,
  SquareFootage: '950',
  GarageParking: 0,
  DriveParking: 1
}
```

### Displayed As:
```
┌─────────────────────────────────────────┐
│  [🛏️ 2]  [🛁 1]  [📏 950 sqft]  [🚗 1]  │
└─────────────────────────────────────────┘
```

**Legend:**
- Works with legacy data format
- Falls back to simple display when enhanced fields not available

---

## 📋 Example 4: Luxury Property

### Property Data:
```typescript
{
  Bedrooms: 4,
  BedroomsAboveGrade: 3,
  BedroomsBelowGrade: 1,
  Bathrooms: 3,
  SquareFootage: '2200',
  SquareFootageMin: 2000,
  SquareFootageMax: 2400,
  GarageParking: 2,
  DriveParking: 2
}
```

### Displayed As:
```
┌─────────────────────────────────────────────┐
│  [🛏️ 3+1]  [🛁 3]  [📏 2,000-2,400 sqft]  [🚗 2+2]  │
└─────────────────────────────────────────────┘
```

**Legend:**
- 🛏️ **3+1** = 4 total bedrooms (3 above + 1 below)
- 🛁 **3** = 3 bathrooms
- 📏 **2,000-2,400 sqft** = Large square footage range
- 🚗 **2+2** = 4 total parking spaces (2 garage + 2 driveway)

---

## 📋 Example 5: Condo with No Parking

### Property Data:
```typescript
{
  Bedrooms: 2,
  Bathrooms: 2,
  SquareFootage: '1100',
  SquareFootageMin: 1000,
  SquareFootageMax: 1200,
  GarageParking: 0,
  DriveParking: 0
}
```

### Displayed As:
```
┌─────────────────────────────────────────┐
│  [🛏️ 2]  [🛁 2]  [📏 1,000-1,200 sqft]  │
└─────────────────────────────────────────┘
```

**Legend:**
- Parking icon hidden when no parking available
- Clean, uncluttered display

---

## 🎨 Actual Visual Appearance

### Full Property Card:
```
┌─────────────────────────────────────────────────────────┐
│  [Active] [house] [🏠 Open House]      [📍 Downtown]    │
│                                                    [❤️]  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │          [Property Image]                        │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  $750,000                                                │
│                                                          │
│  123 Main Street                                         │
│  Toronto, ON                                             │
│  ─────────────────────────────────────────────────────  │
│  [🛏️ 3+1] [🛁 2] [📏 1,700-1,900 sqft] [🚗 2+2]        │
│  ─────────────────────────────────────────────────────  │
│  MLS® W1234567                      Listed 5 days ago    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Format Logic

### Bedrooms:
- If `BedroomsAboveGrade` and `BedroomsBelowGrade` exist:
  - Show **"3+1"** format
- Else:
  - Show single number **"3"**

### Square Footage:
- If `SquareFootageMin` and `SquareFootageMax` exist:
  - Show range **"1,500-2,000"** (with comma formatting)
- Else:
  - Show single value **"1,800"** (with comma formatting)

### Parking:
- If `GarageParking` and `DriveParking` both exist:
  - Show **"2+1"** format
- Else if only one exists:
  - Show single number **"2"**
- Else if neither exist:
  - Hide parking icon entirely

---

## 📱 Responsive Behavior

### Desktop (>1024px):
```
[🛏️ 3+1]  [🛁 2]  [📏 1,700-1,900 sqft]  [🚗 2+2]
```

### Tablet (640px-1024px):
```
[🛏️ 3+1]  [🛁 2]
[📏 1,700-1,900 sqft]  [🚗 2+2]
```

### Mobile (<640px):
```
[🛏️ 3+1]  [🛁 2]
[📏 1,700-1,900]
[🚗 2+2]
```

---

## ✅ Benefits

1. **More Information** - Users see detailed breakdowns
2. **Better Decision Making** - Range data helps set expectations
3. **Professional Display** - Industry-standard notation
4. **Backward Compatible** - Works with old and new data
5. **Space Efficient** - Compact format saves vertical space

---

## 🎯 User Understanding

The + notation is common in real estate:
- **3+1 bedrooms** = Well understood as "above grade + below grade"
- **2+1 parking** = Common notation for "garage + driveway"
- **1500-2000 sqft** = Clear range indication

No additional explanation needed for experienced users!

---

**Status:** ✅ Implemented and Ready for Use

