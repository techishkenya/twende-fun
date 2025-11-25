import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Hook to fetch all active products
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'products'), where('active', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
            if (doc.exists()) {
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
            setLoading(false);
            return;
        }

        const priceDocRef = doc(db, 'prices', productId);

        const unsubscribe = onSnapshot(
            priceDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
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
            const supermarketsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
