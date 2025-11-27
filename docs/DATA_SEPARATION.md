# Data Separation Architecture

## Overview

This application implements a **strict data separation system** between **Live** and **Demo** environments. This allows administrators to safely test features, train new admins, and demonstrate functionality without affecting production data.

## Core Concepts

### 1. Data Modes

**Live Mode** (Production)
- Contains real production data visible to public users
- What customers see on the public website
- Admin operations in Live Mode affect production data

**Demo Mode** (Testing/Training)
- Contains sandbox data for testing and training
- **NEVER** visible to public users
- Completely isolated from Live data
- Safe environment for experimentation

### 2. The `isDemo` Flag

Every document in Firestore collections can have an `isDemo` field:

```javascript
// Live data (production)
{
  id: "product-123",
  name: "Milk 1L",
  isDemo: undefined // or false
}

// Demo data (testing/training)
{
  id: "demo-product-456",
  name: "Test Milk 1L (Demo)",
  isDemo: true
}
```

### 3. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FIRESTORE DATABASE                    │
│                                                          │
│  ┌────────────────────┐    ┌────────────────────┐      │
│  │   Live Data        │    │   Demo Data        │      │
│  │   isDemo !== true  │    │   isDemo === true  │      │
│  └────────────────────┘    └────────────────────┘      │
└─────────────────────────────────────────────────────────┘
           │                           │
           │                           │
           ▼                           ▼
┌──────────────────┐          ┌──────────────────┐
│  PUBLIC SITE     │          │  ADMIN PANEL     │
│  (Always Live)   │          │  (Mode Toggle)   │
│                  │          │                  │
│  - Home          │          │  Live Mode:      │
│  - Search        │          │  Shows Live Data │
│  - Product Pages │          │                  │
│  - Submissions   │          │  Demo Mode:      │
│                  │          │  Shows Demo Data │
└──────────────────┘          └──────────────────┘
```

## Implementation Details

### Public Site (Always Live Data)

All public-facing pages **exclusively** show live data by filtering out `isDemo === true`:

**Files:**
- `src/hooks/useFirestore.js` - All hooks filter `isDemo !== true`
- `src/components/CategoryGrid.jsx` - Filters categories
- `src/pages/SupermarketTrending.jsx` - Filters products/prices
- `src/pages/SubmitPrice.jsx` - Filters products for user submissions

**Example:**
```javascript
// useProducts hook (public)
const productsList = snapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .filter(p => p.isDemo !== true); // Exclude demo products
```

### Admin Panel (Mode-Aware)

Admin pages filter based on the current `viewMode` from `AdminContext`:

**Files:**
- `src/pages/admin/AdminDashboard.jsx` - Statistics by mode
- `src/pages/admin/ProductsManagement.jsx` - Products/prices by mode
- `src/pages/admin/SupermarketsManagement.jsx` - Supermarkets by mode
- `src/pages/admin/SubmissionsManagement.jsx` - Submissions by mode
- `src/pages/admin/UsersManagement.jsx` - Users by mode

**Example:**
```javascript
// Admin panel filtering
const isDemoMode = viewMode === 'demo';

const filteredProducts = productsSnapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .filter(p => isDemoMode ? p.isDemo === true : p.isDemo !== true);
```

### Creating New Data

When creating data in the admin panel, the `isDemo` flag is automatically added based on the current mode:

```javascript
const handleAddProduct = async (productData) => {
  const isDemoMode = viewMode === 'demo';
  
  const newProduct = {
    ...productData,
    // ... other fields
  };
  
  // Tag as demo if in demo mode
  if (isDemoMode) {
    newProduct.isDemo = true;
  }
  
  await setDoc(doc(db, 'products', productId), newProduct);
};
```

### UI Indicators

**Admin Layout Banner:**
- Orange banner appears at the top of all admin pages when in Demo Mode
- Clear message: "Demo Mode Active - Changes will not affect live environment"
- Provides link to Data Management page to switch modes

**Location:** `src/components/AdminLayout.jsx`

## Key Files Reference

### Context
- **`src/context/AdminContext.jsx`** - Manages `viewMode` state (demo/live)

### Hooks
- **`src/hooks/useFirestore.js`** - Public data hooks with demo filtering

### Admin Pages
- **`src/pages/admin/DataManagement.jsx`** - Mode toggle interface
- **`src/pages/admin/AdminDashboard.jsx`** - Mode-aware statistics
- **`src/pages/admin/ProductsManagement.jsx`** - Product CRUD with mode tagging
- **`src/pages/admin/SupermarketsManagement.jsx`** - Supermarket CRUD with mode tagging

### Initialization
- **`src/lib/initializeFirestore.js`** - Creates demo data with `isDemo: true`

## User Submissions

User submissions from the public site are **ALWAYS** live data:
- Created without `isDemo` flag (defaults to live)
- Example: Price submissions, product suggestions
- **Location:** `src/pages/SubmitPrice.jsx`

## Testing the Separation

### Verify Public Site Shows Only Live Data:
1. Create demo data via admin panel in Demo Mode
2. Visit public homepage - demo data should NOT appear
3. Switch admin to Live Mode
4. Create live data
5. Visit public homepage - live data should appear

### Verify Admin Mode Separation:
1. In Demo Mode: Only see demo data
2. In Live Mode: Only see live data
3. Statistics update when switching modes

## Best Practices

1. **Always check the mode indicator** before making admin changes
2. **Test in Demo Mode** before making live changes
3. **Demo data naming**: Add "(Demo)" suffix to names for clarity
4. **Never manually set `isDemo: true`** on production data

## Migration Notes

If you need to convert existing data:
- Existing data without `isDemo` field is treated as **live data**
- Add `isDemo: true` to any data that should be demo
- Use Firestore console or write a migration script

## Security

- Data separation is enforced at the **application level**
- Firestore rules provide additional security
- Both admin and public queries filter by `isDemo` flag
- No cross-contamination between modes
