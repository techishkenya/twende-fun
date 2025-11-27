# File Header Attribution Template

## Standard Header Format

All source code files in this project should include the following attribution header:

```javascript
/**
 * ============================================================================
 * File: [filename]
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)  
 * Purpose: [Brief description of file purpose]
 * Date: [YYYY-MM-DD]
 * ============================================================================
 */
```

## For Modified Files

When making significant changes to existing files, add a modification comment:

```javascript
/**
 * MODIFICATION HISTORY
 * --------------------------------------------------------------------------
 * Date: 2025-11-28
 * Modified by: [Dickson Otieno | Google Antigravity]
 * Changes: [Description of what was changed and why]
 * --------------------------------------------------------------------------
 */
```

## Examples by File Type

### React Components

```javascript
/**
 * ============================================================================
 * File: ProductCard.jsx
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Reusable product card component for displaying product information
 * Date: 2025-11-28
 * ============================================================================
 */

import React from 'react';
// ...component code
```

### Context Providers

```javascript
/**
 * ============================================================================
 * File: AuthContext.jsx
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Firebase authentication context provider
 * Date: 2025-11-28
 * ============================================================================
 */
```

### Custom Hooks

```javascript
/**
 * ============================================================================
 * File: useFirestore.js
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Custom React hooks for Firestore data operations
 * Date: 2025-11-28
 * ============================================================================
 */
```

### Utility Files

```javascript
/**
 * ============================================================================
 * File: stringUtils.js
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: String manipulation and formatting utilities
 * Date: 2025-11-28
 * ============================================================================
 */
```

### Configuration Files

```javascript
/**
 * ============================================================================
 * File: firebase.js
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Firebase configuration and initialization
 * Date: 2025-11-28
 * ============================================================================
 */
```

## For CSS/Style Files

```css
/**
 * ============================================================================
 * File: index.css
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Global styles and Tailwind CSS configuration
 * Date: 2025-11-28
 * ============================================================================
 */
```

## For Markdown Documentation

```markdown
<!--
  ============================================================================
  File: DATA_SEPARATION.md
  Developer: Dickson Otieno
  AI Assistant: Google Antigravity (Gemini 3 Pro)
  Purpose: Architecture documentation for data separation system
  Date: 2025-11-28
  ============================================================================
-->
```

## Key Files Already Attributed

✅ Files with attribution headers:
- `src/App.jsx`
- `src/context/AdminContext.jsx`
- `src/hooks/useFirestore.js`
- `ATTRIBUTION.js`
- `CREDITS.md`
- `README.md`

## Files Pending Attribution

Run the following command to see which files still need headers:

```bash
bash scripts/add-attribution-headers.sh
```

## Guidelines

1. **Always include the header** when creating new files
2. **Update the date** when making significant changes
3. **Add modification history** for major refactors
4. **Be specific in purpose** - explain what the file does
5. **Maintain consistency** - use the exact format shown above

## Attribution in Comments

Beyond file headers, include attribution in:

### Complex Logic Sections

```javascript
// ============================================================================
// Data Separation Filter Logic
// Developer: Dickson Otieno
// AI Assistant: Google Antigravity (Gemini 3 Pro)
// 
// This section implements strict filtering to ensure demo data (isDemo === true)
// is never shown on the public site.
// ============================================================================
const filteredData = data.filter(item => item.isDemo !== true);
```

### Feature Implementations

```javascript
/**
 * FEATURE: Real-time Price Comparison
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * 
 * Implements live price updates across multiple supermarkets using
 * Firestore real-time listeners and React state management.
 */
```

### Bug Fixes

```javascript
/**
 * BUG FIX: Price update not reflecting in UI
 * Fixed by: Dickson Otieno with Google Antigravity
 * Date: 2025-11-28
 * Issue: Prices collection was being updated but products state wasn't refreshing
 * Solution: Added proper state synchronization between prices and products
 */
```

## Verification

To ensure all files have proper attribution:

1. Check for the standard header format
2. Verify developer name is "Dickson Dickson"
3. Confirm AI assistant is "Google Antigravity (Gemini 3 Pro)"
4. Ensure date is present and accurate
5. Validate purpose description is clear

---

**Created by:** Dickson Otieno  
**AI Assistant:** Google Antigravity (Gemini 3 Pro)  
**Last Updated:** 2025-11-28
