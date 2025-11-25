/**
 * Service for interacting with Google Maps Places API
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Searches for supermarket locations using Google Places API (Text Search)
 * @param {string} supermarketName - Name of the supermarket to search for
 * @returns {Promise<string[]>} - List of formatted addresses/names of branches
 */
export const searchSupermarketLocations = async (supermarketName) => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
        return [];
    }

    try {
        // Note: Direct client-side calls to Places API require a proxy or specific configuration to avoid CORS issues.
        // For this implementation, we'll assume a proxy or that the key is configured for client-side use with appropriate referrers.
        // If CORS is an issue, this should be moved to a backend function (Firebase Cloud Function).

        // Using the Text Search API (New) or standard Text Search
        // We'll use a constructed URL for now, but in a real app, use the Google Maps JavaScript API library.

        // Since we can't easily load the JS library dynamically without setup, we'll use a fetch approach 
        // IF the user has a proxy. If not, this might fail with CORS.
        // A safer bet for a frontend-only app without a backend proxy is to use the Google Maps JS SDK.

        // Let's assume we are using the JS SDK if available, or fall back to a mock for now if the library isn't loaded.

        if (!window.google || !window.google.maps) {
            // If the script isn't loaded, we can't easily do a Places search client-side without CORS issues via fetch.
            // We will return a mock response for demonstration if the key is present but SDK is missing,
            // or throw an error telling the user to install the SDK/setup proxy.
            console.warn('Google Maps JavaScript API not loaded.');
            return [];
        }

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        const request = {
            query: `${supermarketName} branches in Kenya`, // Contextualize to Kenya as per app context
            fields: ['name', 'formatted_address']
        };

        return new Promise((resolve, reject) => {
            service.textSearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    const locations = results.map(place => {
                        // Clean up the name/address to get a nice location string
                        // e.g. "Naivas Supermarket - Westlands" -> "Westlands"
                        // This parsing depends heavily on the data format.
                        // For now, return the name or a simplified address.
                        return place.name;
                    });
                    resolve(locations);
                } else {
                    console.error('Places Text Search failed:', status);
                    resolve([]);
                }
            });
        });

    } catch (error) {
        console.error('Error fetching supermarket locations:', error);
        return [];
    }
};

/**
 * Helper to load the Google Maps script dynamically if needed
 * @returns {Promise<void>}
 */
export const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        if (!GOOGLE_MAPS_API_KEY) {
            reject(new Error('Google Maps API Key missing'));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
};
