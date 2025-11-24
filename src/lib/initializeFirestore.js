import { db } from './firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
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
        const supermarketsRef = collection(db, 'supermarkets');
        for (const supermarket of SUPERMARKETS) {
            await addDoc(supermarketsRef, {
                ...supermarket,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        console.log(`✓ Added ${SUPERMARKETS.length} supermarkets`);

        // 2. Add Products in batches (Firestore has a 500 write limit per batch)
        console.log('Adding products...');
        const batchSize = 500;

        for (let i = 0; i < FMCG_PRODUCTS.length; i += batchSize) {
            const batch = writeBatch(db);
            const batchProducts = FMCG_PRODUCTS.slice(i, i + batchSize);

            for (const product of batchProducts) {
                // Use setDoc with custom ID instead of addDoc to preserve product IDs
                const productRef = doc(db, 'products', product.id);
                batch.set(productRef, {
                    ...product,
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            await batch.commit();
            console.log(`✓ Added batch ${Math.floor(i / batchSize) + 1} (${batchProducts.length} products)`);
        }
        console.log(`✓ Added ${FMCG_PRODUCTS.length} products total`);

        // 3. Create sample prices for some products
        console.log('Adding sample prices...');
        const pricesRef = collection(db, 'prices');
        const samplePrices = generateSamplePrices(50); // Generate 50 sample prices

        for (const price of samplePrices) {
            await addDoc(pricesRef, {
                ...price,
                createdAt: new Date(),
                verified: true,
                confidenceScore: Math.floor(Math.random() * 20) + 80
            });
        }
        console.log(`✓ Added ${samplePrices.length} sample prices`);

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
