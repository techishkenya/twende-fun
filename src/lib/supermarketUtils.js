/**
 * Centralized configuration for Supermarkets
 */
export const SUPERMARKET_BRANDING = {
    carrefour: {
        id: 'carrefour',
        name: 'Carrefour',
        colors: {
            primary: 'blue-600',
            bg: 'bg-blue-600',
            text: 'text-blue-600',
            bgLight: 'bg-blue-50',
            border: 'border-blue-200'
        }
    },
    naivas: {
        id: 'naivas',
        name: 'Naivas',
        colors: {
            primary: 'orange-500',
            bg: 'bg-orange-500',
            text: 'text-orange-500',
            bgLight: 'bg-orange-50',
            border: 'border-orange-200'
        }
    },
    quickmart: {
        id: 'quickmart',
        name: 'Quickmart',
        colors: {
            primary: 'yellow-500',
            bg: 'bg-yellow-500',
            text: 'text-yellow-600', // Darker text for visibility on light bg
            bgLight: 'bg-yellow-50',
            border: 'border-yellow-200'
        }
    },
    magunas: {
        id: 'magunas',
        name: 'Magunas',
        colors: {
            primary: 'red-600',
            bg: 'bg-red-600',
            text: 'text-red-600',
            bgLight: 'bg-red-50',
            border: 'border-red-200'
        }
    },
    chandarana: {
        id: 'chandarana',
        name: 'Chandarana',
        colors: {
            primary: 'green-600',
            bg: 'bg-green-600',
            text: 'text-green-600',
            bgLight: 'bg-green-50',
            border: 'border-green-200'
        }
    }
};

const DEFAULT_BRANDING = {
    colors: {
        primary: 'gray-600',
        bg: 'bg-gray-600',
        text: 'text-gray-600',
        bgLight: 'bg-gray-50',
        border: 'border-gray-200'
    }
};

/**
 * Get branding info for a supermarket
 * @param {string} supermarketId 
 * @returns {Object} Branding object
 */
export const getSupermarketBranding = (supermarketId) => {
    const id = supermarketId?.toLowerCase();
    return SUPERMARKET_BRANDING[id] || DEFAULT_BRANDING;
};

/**
 * Get supermarket color class
 * @param {string} supermarketId 
 * @returns {string} Tailwind color class (e.g., 'blue-600')
 */
export const getSupermarketColor = (supermarketId) => {
    return getSupermarketBranding(supermarketId).colors.primary;
};

/**
 * Generates initials for a supermarket name
 * @param {string} name 
 * @returns {string} Initials
 */
export const getSupermarketInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);

    // Rule 1: Two or more words -> First letter of first two words
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    // Rule 2: One word -> First letter (and second if needed to distinguish, but for now simple)
    // We can enhance this if we pass allNames, but for UI components usually simple is fine.
    // If we need collision detection, we should use the one in stringUtils.js or move it here.
    // For now, let's stick to simple logic for the card display.
    return name.substring(0, 1).toUpperCase();
};
