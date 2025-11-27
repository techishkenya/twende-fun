/**
 * ============================================================================
 * File: AdminContext.jsx
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Date: 2025-11-28
 * ============================================================================
 */

/**
 * ADMIN CONTEXT - View Mode Management
 * 
 * This context manages the admin panel's view mode state:
 * - 'demo': Shows demo/test data (isDemo === true)
 * - 'live': Shows production data (isDemo !== true)
 * 
 * The viewMode is persisted in localStorage and controls:
 * 1. What data admin pages fetch and display
 * 2. How new data is tagged when created (with or without isDemo flag)
 * 3. UI indicators showing current mode
 * 
 * IMPORTANT: ViewMode only affects the admin panel.
 * The public site ALWAYS shows live data regardless of this setting.
 * 
 * See docs/DATA_SEPARATION.md for complete architecture details.
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function useAdmin() {
    return useContext(AdminContext);
}

export function AdminProvider({ children }) {
    // Default to 'demo' mode initially, or persist in localStorage
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('adminViewMode') || 'demo';
    });

    useEffect(() => {
        localStorage.setItem('adminViewMode', viewMode);
    }, [viewMode]);

    const isDemoMode = viewMode === 'demo';

    const value = {
        viewMode,
        setViewMode,
        isDemoMode
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}
