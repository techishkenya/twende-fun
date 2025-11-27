/**
 * ============================================================================
 * File: useFirestore.js
 * Developer: Dickson Otieno
 * AI Assistant: Google Antigravity (Gemini 3 Pro)
 * Purpose: Custom React hooks for Firestore data fetching (PUBLIC SITE)
 * Date: 2025-11-28
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { collection, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * PUBLIC SITE DATA HOOKS
 * 
 * These hooks are used by public-facing pages and components.
 * They ALWAYS filter out demo data (isDemo === true) to ensure
 * the public site only displays production/live data.
 * 
 * Demo data is used exclusively in the admin panel for testing
 * and training purposes and should never be visible to end users.
 * 
 * See docs/DATA_SEPARATION.md for complete architecture details.
 */

/**
 * Hook to fetch all active products (LIVE DATA ONLY)
 * 
 * Automatically filters out demo products to ensure only
 * production data is shown on the public site.
 * 
 * @returns {Object} { products: Array, loading: boolean, error: Error|null }
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'products'), where('active', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(p => p.isDemo !== true); // Filter out demo products
            setProducts(productsList);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching products:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { products, loading, error };
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const unsubscribe = onSnapshot(doc(db, 'products', id), (doc) => {
            if (doc.exists() && doc.data().isDemo !== true) {
                setProduct({ id: doc.id, ...doc.data() });
            } else {
                setError('Product not found');
            }
            setLoading(false);
        }, (err) => {
            console.error('Error fetching product:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    return { product, loading, error };
}

/**
 * Hook to fetch unified prices for a product (all 4 supermarkets)
 */
export function usePrices(productId) {
    const [prices, setPrices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }

        const priceDocRef = doc(db, 'prices', productId);

        const unsubscribe = onSnapshot(
            priceDocRef,
            (docSnap) => {
                if (docSnap.exists() && docSnap.data().isDemo !== true) {
                    setPrices(docSnap.data().prices);
                } else {
                    setPrices(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching prices:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [productId]);

    return { prices, loading, error };
}

/**
 * Utility: Get cheapest price from unified prices
 */
export function getCheapestPrice(prices) {
    if (!prices) return null;

    const entries = Object.entries(prices);
    if (entries.length === 0) return null;

    return entries.reduce((min, [supermarket, data]) => {
        const price = data.price || data;
        const minPrice = min.price || min;
        return price < minPrice ? { supermarket, price, ...data } : min;
    }, entries[0][1]);
}

import { getSupermarketColor as getUtilsColor } from '../lib/supermarketUtils';

/**
 * Utility: Get supermarket brand color
 */
export function getSupermarketColor(supermarketId) {
    return getUtilsColor(supermarketId);
}

/**
 * Utility: Format prices array for chart
 */
export function formatPricesForChart(prices) {
    if (!prices) return [];

    return Object.entries(prices).map(([supermarket, data]) => ({
        supermarket: supermarket.charAt(0).toUpperCase() + supermarket.slice(1),
        price: data.price || data,
        color: getSupermarketColor(supermarket)
    }));
}

/**
 * Hook to fetch all supermarkets
 */
export function useSupermarkets() {
    const [supermarkets, setSupermarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'supermarkets'), orderBy('name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const supermarketsList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(s => s.isDemo !== true); // Filter out demo supermarkets
            setSupermarkets(supermarketsList);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching supermarkets:', err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { supermarkets, loading, error };
}
