import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FMCG_PRODUCTS } from './products';
import { SUPERMARKETS } from './types';
import { DEMO_USERS, DEMO_PRODUCT_SUBMISSIONS, DEMO_PRICE_SUBMISSIONS } from './seedDemoData';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Initialize Firestore with mock data
 * Run this once to populate the database
 */
export async function initializeFirestore() {
    try {
        // console.log('Starting Firestore initialization...');

        // 1. Add Supermarkets
        // console.log('Adding supermarkets...');
        for (const supermarket of SUPERMARKETS) {
            // Create DEMO version
            const demoId = `demo-${supermarket.id}`;
            const supermarketRef = doc(db, 'supermarkets', demoId);
            await setDoc(supermarketRef, {
                ...supermarket,
                id: demoId,
                name: `${supermarket.name} (Demo)`,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDemo: true
            });
        }
        // console.log(`✓ Added ${SUPERMARKETS.length} demo supermarkets`);

        // 2. Add Categories
        // console.log('Adding categories...');
        const { CATEGORIES } = await import('./types');
        for (const categoryName of CATEGORIES) {
            // Create DEMO version
            const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
            const demoId = `demo-${categoryId}`;
            const categoryRef = doc(db, 'categories', demoId);
            await setDoc(categoryRef, {
                name: `${categoryName} (Demo)`,
                productCount: 0,
                createdAt: new Date(),
                isDemo: true
            });
        }
        // console.log(`✓ Added ${CATEGORIES.length} demo categories`);

        // 3. Add Products
        // console.log('Adding products...');
        for (const product of FMCG_PRODUCTS) {
            const productRef = doc(db, 'products', product.id);
            await setDoc(productRef, {
                ...product,
                barcode: product.barcode || `616${Math.abs(product.id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString().padEnd(9, '0').substring(0, 9)}`,
                active: true,
                isDemo: true, // Mark as demo data
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        // console.log(`✓ Added ${FMCG_PRODUCTS.length} products`);

        // 3. Add Unified Prices (all 4 supermarkets per product)
        // console.log('Adding unified prices for all products...');

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

            // Map prices to DEMO supermarket IDs
            const demoPrices = {
                'demo-carrefour': {
                    price: prices.carrefour,
                    location: 'Two Rivers',
                    updatedAt: new Date()
                },
                'demo-naivas': {
                    price: prices.naivas,
                    location: 'Junction',
                    updatedAt: new Date()
                },
                'demo-quickmart': {
                    price: prices.quickmart,
                    location: 'Westlands',
                    updatedAt: new Date()
                },
                'demo-magunas': {
                    price: prices.magunas,
                    location: 'Ngong Road',
                    updatedAt: new Date()
                }
            };

            await setDoc(priceRef, {
                productId: product.id,
                prices: demoPrices,
                lastUpdated: new Date(),
                verified: true,
                isDemo: true // Mark as demo data
            });
        }
        // console.log(`✓ Added unified prices for ${FMCG_PRODUCTS.length} products`);

        // 5. Add Demo Users
        // console.log('Adding demo users...');
        for (const user of DEMO_USERS) {
            await setDoc(doc(db, 'users', user.uid), user);
        }
        // console.log(`✓ Added ${DEMO_USERS.length} demo users`);

        // 6. Add Demo Product Submissions
        // console.log('Adding demo product submissions...');
        for (const submission of DEMO_PRODUCT_SUBMISSIONS) {
            await addDoc(collection(db, 'product_submissions'), submission);
        }
        // console.log(`✓ Added ${DEMO_PRODUCT_SUBMISSIONS.length} demo product submissions`);

        // 7. Add Demo Price Submissions
        // console.log('Adding demo price submissions...');
        for (const submission of DEMO_PRICE_SUBMISSIONS) {
            await addDoc(collection(db, 'submissions'), submission);
        }
        // console.log(`✓ Added ${DEMO_PRICE_SUBMISSIONS.length} demo price submissions`);

        // console.log('✅ Firestore initialization complete!');
        return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
        // console.error('❌ Error initializing Firestore:', error);
        return { success: false, error: error.message };
    }
}





/**
 * Clear all data from Firestore collections
 * USE WITH CAUTION - This deletes all data!
 */
export async function clearFirestore() {
    try {
        console.log('⚠️  Clearing Firestore...');
        // const collections = ['supermarkets', 'products', 'prices', 'users', 'submissions'];

        // Note: In production, you'd want to use the Firebase Admin SDK for this
        // as it's more efficient. This is a simplified version for development.
        console.log('To clear data, please use the Firebase Console.');

        return { success: true, message: 'Please clear data via Firebase Console' };
    } catch (error) {
        console.error('Error clearing Firestore:', error);
        return { success: false, error: error.message };
    }
}
