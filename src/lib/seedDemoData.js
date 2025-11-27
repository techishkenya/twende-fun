import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';

// Demo users with profiles
export const DEMO_USERS = [
    {
        uid: 'demo-user-alice',
        email: 'alice.kamau@demo.com',
        displayName: 'Alice Kamau',
        photoURL: 'https://ui-avatars.com/api/?name=Alice+Kamau&background=10b981&color=fff',
        points: 150,
        role: 'user',
        createdAt: new Date('2025-01-15'),
        termsAccepted: true,
        isDemo: true
    },
    {
        uid: 'demo-user-brian',
        email: 'brian.otieno@demo.com',
        displayName: 'Brian Otieno',
        photoURL: 'https://ui-avatars.com/api/?name=Brian+Otieno&background=3b82f6&color=fff',
        points: 65,
        role: 'user',
        createdAt: new Date('2025-02-01'),
        termsAccepted: true,
        isDemo: true
    },
    {
        uid: 'demo-user-carol',
        email: 'carol.mwangi@demo.com',
        displayName: 'Carol Mwangi',
        photoURL: 'https://ui-avatars.com/api/?name=Carol+Mwangi&background=ec4899&color=fff',
        points: 10,
        role: 'user',
        createdAt: new Date('2025-02-20'),
        termsAccepted: true,
        isDemo: true
    }
];

// Demo product submissions
export const DEMO_PRODUCT_SUBMISSIONS = [
    // Alice's submissions (active user - mostly approved)
    {
        userId: 'demo-user-alice',
        userName: 'Alice Kamau',
        userEmail: 'alice.kamau@demo.com',
        productName: 'Dettol Hand Sanitizer 500ml',
        category: 'Health & Beauty',
        newCategory: null,
        imageUrl: 'https://via.placeholder.com/150/10b981/fff?text=Dettol',
        barcode: '6001106117804',
        status: 'approved',
        createdAt: new Date('2025-02-15'),
        reviewedAt: new Date('2025-02-16'),
        isDemo: true
    },
    {
        userId: 'demo-user-alice',
        userName: 'Alice Kamau',
        userEmail: 'alice.kamau@demo.com',
        productName: 'Colgate MaxFresh 150ml',
        category: 'Health & Beauty',
        newCategory: null,
        imageUrl: 'https://via.placeholder.com/150/10b981/fff?text=Colgate',
        barcode: '8718951312354',
        status: 'approved',
        createdAt: new Date('2025-02-18'),
        reviewedAt: new Date('2025-02-19'),
        isDemo: true
    },
    // Brian's submissions (moderate user - mixed)
    {
        userId: 'demo-user-brian',
        userName: 'Brian Otieno',
        userEmail: 'brian.otieno@demo.com',
        productName: 'Nivea Body Lotion 400ml',
        category: 'Health & Beauty',
        newCategory: null,
        imageUrl: 'https://via.placeholder.com/150/3b82f6/fff?text=Nivea',
        barcode: '4005900123456',
        status: 'pending',
        createdAt: new Date('2025-02-25'),
        isDemo: true
    },
    {
        userId: 'demo-user-brian',
        userName: 'Brian Otieno',
        userEmail: 'brian.otieno@demo.com',
        productName: 'Pedigree Dog Food 10kg',
        category: 'Pet Supplies',
        newCategory: 'Pet Supplies',
        imageUrl: 'https://via.placeholder.com/150/3b82f6/fff?text=Pedigree',
        barcode: '5010394987654',
        status: 'rejected',
        createdAt: new Date('2025-02-20'),
        reviewedAt: new Date('2025-02-21'),
        isDemo: true
    },
    // Carol's submissions (new user - pending)
    {
        userId: 'demo-user-carol',
        userName: 'Carol Mwangi',
        userEmail: 'carol.mwangi@demo.com',
        productName: 'Dove Soap Bar 100g',
        category: 'Health & Beauty',
        newCategory: null,
        imageUrl: 'https://via.placeholder.com/150/ec4899/fff?text=Dove',
        barcode: '8712561876543',
        status: 'pending',
        createdAt: new Date('2025-02-26'),
        isDemo: true
    }
];

// Demo price submissions  
export const DEMO_PRICE_SUBMISSIONS = [
    // Alice's price submissions (experienced user)
    {
        userId: 'demo-user-alice',
        userName: 'Alice Kamau',
        productId: 'milk-fresh-1l',
        supermarketId: 'carrefour',
        price: 155,
        location: { lat: -1.2864, lng: 36.8172, name: 'Nairobi CBD' },
        timestamp: new Date('2025-02-24'),
        status: 'approved',
        reviewedAt: new Date('2025-02-25'),
        isDemo: true
    },
    {
        userId: 'demo-user-alice',
        userName: 'Alice Kamau',
        productId: 'bread-white-400g',
        supermarketId: 'naivas',
        price: 52,
        location: { lat: -1.2921, lng: 36.8219, name: 'Westlands' },
        timestamp: new Date('2025-02-23'),
        status: 'approved',
        reviewedAt: new Date('2025-02-24'),
        isDemo: true
    },
    {
        userId: 'demo-user-alice',
        userName: 'Alice Kamau',
        productId: 'eggs-tray-30',
        supermarketId: 'quickmart',
        price: 420,
        location: { lat: -1.2921, lng: 36.8219, name: 'Westlands' },
        timestamp: new Date('2025-02-22'),
        status: 'approved',
        reviewedAt: new Date('2025-02-23'),
        isDemo: true
    },
    // Brian's price submissions (moderate activity - mixed status)
    {
        userId: 'demo-user-brian',
        userName: 'Brian Otieno',
        productId: 'rice-white-2kg',
        supermarketId: 'carrefour',
        price: 285,
        location: { lat: -1.3197, lng: 36.8312, name: 'Kilimani' },
        timestamp: new Date('2025-02-26'),
        status: 'pending',
        isDemo: true
    },
    {
        userId: 'demo-user-brian',
        userName: 'Brian Otieno',
        productId: 'cooking-oil-2l',
        supermarketId: 'naivas',
        price: 520,
        location: { lat: -1.3197, lng: 36.8312, name: 'Kilimani' },
        timestamp: new Date('2025-02-21'),
        status: 'rejected',
        reviewedAt: new Date('2025-02-22'),
        isDemo: true
    },
    // Carol's price submissions (new user - pending)
    {
        userId: 'demo-user-carol',
        userName: 'Carol Mwangi',
        productId: 'sugar-white-2kg',
        supermarketId: 'quickmart',
        price: 245,
        location: { lat: -1.2921, lng: 36.8219, name: 'Westlands' },
        timestamp: new Date('2025-02-27'),
        status: 'pending',
        isDemo: true
    }
];

// Demo approved products (from Alice's approved product submissions)
const DEMO_PRODUCTS = [
    {
        id: 'dettol-hand-sanitizer-500ml',
        name: 'Dettol Hand Sanitizer 500ml',
        category: 'Health & Beauty',
        image: 'https://via.placeholder.com/150/10b981/fff?text=Dettol',
        barcode: '6001106117804',
        active: true,
        submittedBy: 'demo-user-alice',
        createdAt: new Date('2025-02-16'),
        updatedAt: new Date('2025-02-16'),
        isDemo: true
    },
    {
        id: 'colgate-maxfresh-150ml',
        name: 'Colgate MaxFresh 150ml',
        category: 'Health & Beauty',
        image: 'https://via.placeholder.com/150/10b981/fff?text=Colgate',
        barcode: '8718951312354',
        active: true,
        submittedBy: 'demo-user-alice',
        createdAt: new Date('2025-02-19'),
        updatedAt: new Date('2025-02-19'),
        isDemo: true
    }
];

// Demo approved prices (from approved price submissions)
const DEMO_PRICES = [
    {
        productId: 'milk-fresh-1l',
        supermarketId: 'carrefour',
        price: 155,
        location: { lat: -1.2864, lng: 36.8172, name: 'Nairobi CBD' },
        timestamp: new Date('2025-02-24'),
        verified: true,
        submittedBy: 'demo-user-alice',
        isDemo: true
    },
    {
        productId: 'bread-white-400g',
        supermarketId: 'naivas',
        price: 52,
        location: { lat: -1.2921, lng: 36.8219, name: 'Westlands' },
        timestamp: new Date('2025-02-23'),
        verified: true,
        submittedBy: 'demo-user-alice',
        isDemo: true
    },
    {
        productId: 'eggs-tray-30',
        supermarketId: 'quickmart',
        price: 420,
        location: { lat: -1.2921, lng: 36.8219, name: 'Westlands' },
        timestamp: new Date('2025-02-22'),
        verified: true,
        submittedBy: 'demo-user-alice',
        isDemo: true
    }
];

/**
 * Seed demo data to Firestore
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function seedDemoData() {
    try {
        // console.log('🌱 Seeding demo data...');

        // 1. Create demo users
        for (const user of DEMO_USERS) {
            await setDoc(doc(db, 'users', user.uid), user);
        }
        // console.log('✅ Created 3 demo users');

        // 2. Create demo product submissions
        for (const submission of DEMO_PRODUCT_SUBMISSIONS) {
            await addDoc(collection(db, 'product_submissions'), submission);
        }
        // console.log('✅ Created demo product submissions');

        // 3. Create demo price submissions
        for (const submission of DEMO_PRICE_SUBMISSIONS) {
            await addDoc(collection(db, 'submissions'), submission);
        }
        // console.log('✅ Created demo price submissions');

        // 4. Create demo approved products
        for (const product of DEMO_PRODUCTS) {
            await setDoc(doc(db, 'products', product.id), product);
        }
        // console.log('✅ Created demo products');

        // 5. Create demo approved prices
        for (const price of DEMO_PRICES) {
            await addDoc(collection(db, 'prices'), price);
        }
        // console.log('✅ Created demo prices');

        // console.log('🎉 Demo data seeded successfully!');
        return { success: true, message: 'Demo data created successfully' };
    } catch (error) {
        // console.error('❌ Error seeding demo data:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Delete all demo data from Firestore
 * WARNING: This is a destructive operation
 * @returns {Promise<{success: boolean, message: string, deletedCounts: object}>}
 */
export async function deleteDemoData() {
    try {
        // console.log('🗑️ Deleting demo data...');

        const deletedCounts = {
            users: 0,
            products: 0,
            prices: 0,
            submissions: 0,
            productSubmissions: 0
        };

        // Import deleteDoc and getDocs
        const { deleteDoc, getDocs, query, where } = await import('firebase/firestore');

        // Delete demo users
        const usersSnapshot = await getDocs(
            query(collection(db, 'users'), where('isDemo', '==', true))
        );
        for (const docSnapshot of usersSnapshot.docs) {
            await deleteDoc(doc(db, 'users', docSnapshot.id));
            deletedCounts.users++;
        }

        // Delete demo products
        const productsSnapshot = await getDocs(
            query(collection(db, 'products'), where('isDemo', '==', true))
        );
        for (const docSnapshot of productsSnapshot.docs) {
            await deleteDoc(doc(db, 'products', docSnapshot.id));
            deletedCounts.products++;
        }

        // Delete demo prices
        const pricesSnapshot = await getDocs(
            query(collection(db, 'prices'), where('isDemo', '==', true))
        );
        for (const docSnapshot of pricesSnapshot.docs) {
            await deleteDoc(doc(db, 'prices', docSnapshot.id));
            deletedCounts.prices++;
        }

        // Delete demo price submissions
        const submissionsSnapshot = await getDocs(
            query(collection(db, 'submissions'), where('isDemo', '==', true))
        );
        for (const docSnapshot of submissionsSnapshot.docs) {
            await deleteDoc(doc(db, 'submissions', docSnapshot.id));
            deletedCounts.submissions++;
        }

        // Delete demo product submissions
        const productSubmissionsSnapshot = await getDocs(
            query(collection(db, 'product_submissions'), where('isDemo', '==', true))
        );
        for (const docSnapshot of productSubmissionsSnapshot.docs) {
            await deleteDoc(doc(db, 'product_submissions', docSnapshot.id));
            deletedCounts.productSubmissions++;
        }

        // console.log('✅ Demo data deleted:', deletedCounts);
        return {
            success: true,
            message: 'Demo data deleted successfully',
            deletedCounts
        };
    } catch (error) {
        // console.error('❌ Error deleting demo data:', error);
        return { success: false, message: error.message };
    }
}
