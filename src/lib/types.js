/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} barcode
 * @property {string} image_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Price
 * @property {string} id
 * @property {string} product_id
 * @property {string} supermarket_id
 * @property {string} location_id
 * @property {number} price
 * @property {string} user_id
 * @property {string} photo_url
 * @property {boolean} verified
 * @property {number} confidence_score
 * @property {string} timestamp
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} phone_number
 * @property {string} username
 * @property {number} points
 * @property {number} contributions_count
 * @property {string[]} badges
 */

/**
 * @typedef {Object} Supermarket
 * @property {string} id
 * @property {string} name
 * @property {string} logo_url
 * @property {string[]} locations
 */

export const CATEGORIES = [
    'Dairy',
    'Beverages',
    'Snacks',
    'Household',
    'Personal Care',
    'Pantry',
    'Fresh Produce',
    'Baby Products'
];

export const SUPERMARKETS = [
    {
        id: 'carrefour',
        name: 'Carrefour',
        color: 'blue-600',
        logo_url: 'https://placehold.co/100x100/2563eb/ffffff?text=C',
        description: 'Premium shopping experience with international brands',
        locations: [
            'Hub Karen', 'Two Rivers', 'TRM', 'Junction Mall', 'Galleria',
            'Sarit Center', 'Village Market', 'Mega Plaza', 'Westgate',
            'NextGen Mall', 'Garden City', 'Southfield Mall', 'BBS',
            'St Ellis Plaza', 'Valley Arcade', 'Kilimani', 'Comet House'
        ]
    },
    {
        id: 'naivas',
        name: 'Naivas',
        color: 'orange-500',
        logo_url: 'https://placehold.co/100x100/f97316/ffffff?text=N',
        description: 'Kenya\'s leading supermarket chain with 106+ branches',
        locations: [
            'Waiyaki Way', 'Westlands', 'Kasarani', 'Kitengela', 'Thika Road',
            'Eastgate', 'Prestige', 'Gateway Mall', 'Capital Center', 'Kilimani',
            'Buru Buru', 'Ciata Mall', 'Spur Mall', 'Lavington', 'Komarock',
            'Hazina', 'Ruaraka', 'Green House', 'Umoja', 'Lifestyle',
            'Nakuru Midtown', 'Eldoret Zion', 'Kisumu Market', 'Mombasa Nyali'
        ]
    },
    {
        id: 'quickmart',
        name: 'Quickmart',
        color: 'yellow-500',
        logo_url: 'https://placehold.co/100x100/eab308/ffffff?text=Q',
        description: 'Fast, convenient shopping with 80+ branches nationwide',
        locations: [
            'Buru Buru', 'Chaka', 'Donholm', 'Embakasi', 'Fedha',
            'Jipange', 'Kahawa Sukari', 'Kilimani', 'Lavington', 'Mfangano',
            'Mombasa Road', 'Pioneer', 'Pipeline', 'Roysambu', 'Ruai',
            'T-Mall', 'Utawala', 'Waiyaki Way', 'Westlands', 'Karen Crossroads',
            'Mtwapa', 'Kisumu Kondele', 'Machakos', 'Eldoret'
        ]
    },
    {
        id: 'magunas',
        name: 'Magunas',
        color: 'red-600',
        logo_url: 'https://placehold.co/100x100/dc2626/ffffff?text=M',
        description: 'Quality products at competitive prices',
        locations: [
            'Thika Town', 'Ruiru', 'Juja', 'Githurai', 'Kahawa West',
            'Zimmerman', 'Roysambu', 'Kasarani', 'Eastleigh', 'Umoja'
        ]
    }
];
