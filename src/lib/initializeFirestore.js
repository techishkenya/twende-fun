import { db } from './firebase';
import { collection, addDoc, writeBatch, doc, setDoc } from 'firebase/firestore';
import { FMCG_PRODUCTS } from './products';
import { SUPERMARKETS } from './types';

/**
 * Initialize Firestore with mock data
 * Run this once to populate the database
 */
export async function initializeFirestore() {
    try {
        console.log('Starting Firestore initialization...');

        // 1. Add Supermarkets
        console.log('Adding supermarkets...');
        for (const supermarket of SUPERMARKETS) {
            // Use setDoc with custom ID to prevent duplicates
            const supermarketRef = doc(db, 'supermarkets', supermarket.id);
            await setDoc(supermarketRef, {
                ...supermarket,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        console.log(`✓ Added ${SUPERMARKETS.length} supermarkets`);

        // 2. Add Products
        console.log('Adding products...');
        for (const product of FMCG_PRODUCTS) {
            const productRef = doc(db, 'products', product.id);
            await setDoc(productRef, {
                ...product,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        console.log(`✓ Added ${FMCG_PRODUCTS.length} products`);

        // 3. Add Unified Prices (all 4 supermarkets per product)
        console.log('Adding unified prices for all products...');

        // Helper function to generate random price variations
        const generatePriceVariations = (basePrice) => {
            const variation = 0.15; // ±15% variation
            return {
                carrefour: Math.round(basePrice * (1 + (Math.random() * variation * 2 - variation))),
                naivas: Math.round(basePrice * (1 + (Math.random() * variation * 2 - variation))),
                quickmart: Math.round(basePrice * (1 + (Math.random() * variation * 2 - variation))),
                magunas: Math.round(basePrice * (1 + (Math.random() * variation * 2 - variation)))
            };
        };

        for (const product of FMCG_PRODUCTS) {
            // Generate base price based on category
            const basePrices = {
                'Dairy': 150,
                'Beverages': 120,
                'Snacks': 80,
                'Household': 200,
                'Personal Care': 180,
                'Pantry': 160,
                'Fresh Produce': 100,
                'Baby Products': 250
            };

            const basePrice = basePrices[product.category] || 150;
            const prices = generatePriceVariations(basePrice);

            // Create unified price document with product ID as document ID
            const priceRef = doc(db, 'prices', product.id);
            await setDoc(priceRef, {
                productId: product.id,
                prices: {
                    carrefour: {
                        price: prices.carrefour,
                        location: 'Two Rivers',
                        updatedAt: new Date()
                    },
                    naivas: {
                        price: prices.naivas,
                        location: 'Junction',
                        updatedAt: new Date()
                    },
                    quickmart: {
                        price: prices.quickmart,
                        location: 'Westlands',
                        updatedAt: new Date()
                    },
                    magunas: {
                        price: prices.magunas,
                        location: 'Ngong Road',
                        updatedAt: new Date()
                    }
                },
                lastUpdated: new Date(),
                verified: true
            });
        }
        console.log(`✓ Added unified prices for ${FMCG_PRODUCTS.length} products`);

        console.log('✅ Firestore initialization complete!');
        return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
        console.error('❌ Error initializing Firestore:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generate sample prices for testing
 */
function generateSamplePrices(count) {
    const prices = [];
    const supermarketIds = ['carrefour', 'naivas', 'quickmart', 'magunas'];

    for (let i = 0; i < count; i++) {
        const product = FMCG_PRODUCTS[Math.floor(Math.random() * FMCG_PRODUCTS.length)];
        const supermarketId = supermarketIds[Math.floor(Math.random() * supermarketIds.length)];
        const basePrice = Math.floor(Math.random() * 500) + 50;

        prices.push({
            productId: product.id,
            supermarketId: supermarketId,
            price: basePrice,
            location: getRandomLocation(supermarketId),
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
            userId: 'admin',
            photoUrl: null
        });
    }

    return prices;
}

/**
 * Get random location for a supermarket
 */
function getRandomLocation(supermarketId) {
    const supermarket = SUPERMARKETS.find(s => s.id === supermarketId);
    if (!supermarket || !supermarket.locations) return 'Nairobi';
    return supermarket.locations[Math.floor(Math.random() * supermarket.locations.length)];
}

/**
 * Clear all data from Firestore collections
 * USE WITH CAUTION - This deletes all data!
 */
export async function clearFirestore() {
    try {
        console.log('⚠️  Clearing Firestore...');
        const collections = ['supermarkets', 'products', 'prices', 'users', 'submissions'];

        // Note: In production, you'd want to use the Firebase Admin SDK for this
        // as it's more efficient. This is a simplified version for development.
        console.log('To clear data, please use the Firebase Console.');

        return { success: true, message: 'Please clear data via Firebase Console' };
    } catch (error) {
        console.error('Error clearing Firestore:', error);
        return { success: false, error: error.message };
    }
}
